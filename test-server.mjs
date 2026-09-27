import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';
import { randomBytes, randomUUID } from 'node:crypto';

const port = Number(process.env.BLOCKHAUS_PORT || 8787);
const distDir = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const users = new Map();
const rooms = new Map();
const streams = new Set();

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 64_000) throw new Error('Requête trop volumineuse');
  }
  return body ? JSON.parse(body) : {};
}

function visibleRoom(room, userId) {
  if (!room.members.has(userId)) return null;
  return {
    id: room.id,
    name: room.name,
    type: 'private',
    members: [...room.members].map((id) => users.get(id)?.name || 'Membre'),
    messages: room.messages
  };
}

function stateFor(userId) {
  return {
    user: users.get(userId) || null,
    rooms: [...rooms.values()].map((room) => visibleRoom(room, userId)).filter(Boolean)
  };
}

function broadcast(roomId) {
  for (const client of streams) {
    const room = rooms.get(roomId);
    if (!room || !room.members.has(client.userId)) continue;
    client.response.write(`event: update\ndata: ${JSON.stringify({ roomId })}\n\n`);
  }
}

function addSystemMessage(room, text) {
  room.messages.push({
    id: randomUUID(),
    authorId: 'system',
    author: 'Blockhaus',
    text,
    time: new Date().toISOString(),
    system: true
  });
}

async function handleApi(request, response, url) {
  if (request.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(response, 200, { ok: true, mode: 'test-lan' });
  }

  if (request.method === 'POST' && url.pathname === '/api/session') {
    const body = await readJson(request);
    const name = String(body.name || '').trim().slice(0, 32);
    if (!name) return sendJson(response, 400, { error: 'Prénom requis.' });
    const userId = typeof body.userId === 'string' && body.userId ? body.userId : randomUUID();
    const user = { id: userId, name };
    users.set(userId, user);
    return sendJson(response, 200, { user });
  }

  if (request.method === 'GET' && url.pathname === '/api/state') {
    return sendJson(response, 200, stateFor(url.searchParams.get('userId')));
  }

  if (request.method === 'GET' && url.pathname === '/api/events') {
    const userId = url.searchParams.get('userId');
    response.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive'
    });
    response.write('event: ready\ndata: {}\n\n');
    const client = { userId, response };
    streams.add(client);
    const ping = setInterval(() => response.write(': ping\n\n'), 15_000);
    request.on('close', () => {
      clearInterval(ping);
      streams.delete(client);
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/rooms') {
    const body = await readJson(request);
    const user = users.get(body.userId);
    if (!user) return sendJson(response, 401, { error: 'Identité inconnue.' });
    const room = {
      id: `prive-${randomBytes(4).toString('hex')}`,
      token: randomBytes(12).toString('hex'),
      name: String(body.name || 'Discussion privée').trim().slice(0, 60) || 'Discussion privée',
      members: new Set([user.id]),
      messages: []
    };
    addSystemMessage(room, `${user.name} a créé cette discussion privée.`);
    rooms.set(room.id, room);
    broadcast(room.id);
    return sendJson(response, 201, {
      room: visibleRoom(room, user.id),
      invite: `/?room=${encodeURIComponent(room.id)}&invite=${encodeURIComponent(room.token)}`
    });
  }

  if (request.method === 'POST' && url.pathname === '/api/join') {
    const body = await readJson(request);
    const user = users.get(body.userId);
    const room = rooms.get(body.roomId);
    if (!user || !room || room.token !== body.token) {
      return sendJson(response, 403, { error: "Invitation invalide ou discussion expirée." });
    }
    if (!room.members.has(user.id)) {
      room.members.add(user.id);
      addSystemMessage(room, `${user.name} a rejoint la discussion.`);
      broadcast(room.id);
    }
    return sendJson(response, 200, { room: visibleRoom(room, user.id) });
  }

  if (request.method === 'POST' && url.pathname === '/api/messages') {
    const body = await readJson(request);
    const user = users.get(body.userId);
    const room = rooms.get(body.roomId);
    const text = String(body.text || '').trim().slice(0, 2_000);
    if (!user || !room || !room.members.has(user.id)) {
      return sendJson(response, 403, { error: 'Accès refusé.' });
    }
    if (!text) return sendJson(response, 400, { error: 'Message vide.' });
    room.messages.push({ id: randomUUID(), authorId: user.id, author: user.name, text, time: new Date().toISOString() });
    broadcast(room.id);
    return sendJson(response, 201, { ok: true });
  }

  return sendJson(response, 404, { error: 'API inconnue.' });
}

async function serveStatic(response, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const relativePath = normalize(pathname).replace(/^([/\\])+/, '');
  let filePath = join(distDir, relativePath);
  if (!filePath.startsWith(distDir)) return sendJson(response, 403, { error: 'Accès refusé.' });
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = join(filePath, 'index.html');
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(body);
  } catch {
    const body = await readFile(join(distDir, 'index.html'));
    response.writeHead(200, { 'Content-Type': mimeTypes['.html'], 'Cache-Control': 'no-store' });
    response.end(body);
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) await handleApi(request, response, url);
    else await serveStatic(response, url);
  } catch (error) {
    sendJson(response, 500, { error: error.message || 'Erreur serveur.' });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Blockhaus test local : http://localhost:${port}`);
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) console.log(`Téléphones sur le même Wi-Fi : http://${address.address}:${port}`);
    }
  }
  console.log('Les discussions et messages disparaissent à l’arrêt du serveur.');
});
