const screens = [...document.querySelectorAll('.screen')];
const nav = document.querySelector('.bottom-nav');
const navItems = [...document.querySelectorAll('.nav-item')];
const chatScreen = document.querySelector('#screen-chat');
const chatTitle = document.querySelector('#chat-title');
const chatAvatar = document.querySelector('#chat-avatar');
const chatStatus = document.querySelector('.chat-header div span');
const chatHistory = document.querySelector('#chat-history');
const themeToggle = document.querySelector('#theme-toggle');
const conversationList = document.querySelector('#conversation-list');
const channelGroups = document.querySelector('#channel-groups');
const roomModal = document.querySelector('#room-modal');
const roomForm = document.querySelector('#room-form');
const roomNameInput = document.querySelector('#room-name');
const memberSearch = document.querySelector('#member-picker-search');
const memberPicker = document.querySelector('#member-picker');
const selectedMembers = document.querySelector('#selected-members');
const liveTestCard = document.querySelector('#live-test-card');
const liveTestStatus = document.querySelector('#live-test-status');
const roomModalNote = document.querySelector('#room-modal-note');
const identityModal = document.querySelector('#identity-modal');
const identityForm = document.querySelector('#identity-form');
const identityName = document.querySelector('#identity-name');
const inviteModal = document.querySelector('#invite-modal');
const inviteLink = document.querySelector('#invite-link');
const themeKey = 'blockhaus-grey-test';
const customRoomsKey = 'blockhaus-custom-rooms-v1';
const customMessagesKey = 'blockhaus-custom-messages-v1';
const liveUserKey = 'blockhaus-live-user-v1';

const members = [
  { id: 'maya', name: 'Maya', role: 'Atelier', avatar: 'M', tone: 'avatar-accent', online: true },
  { id: 'noe', name: 'Noé', role: 'Programmation', avatar: 'N', tone: 'avatar-sand', online: true },
  { id: 'samira', name: 'Samira', role: 'Technique', avatar: 'S', tone: 'avatar-grey', online: true },
  { id: 'jules', name: 'Jules', role: 'Membre actif', avatar: 'J', tone: 'avatar-ink', online: false },
  { id: 'camille', name: 'Camille', role: 'Modération', avatar: 'C', tone: 'avatar-sand', online: false },
  { id: 'lea', name: 'Léa', role: 'Archives', avatar: 'L', tone: 'avatar-grey', online: true },
  { id: 'tom', name: 'Tom', role: 'Bar / accueil', avatar: 'T', tone: 'avatar-accent', online: false }
];

const baseRooms = [
  { id: 'general', type: 'room', group: 'Vie du lieu', name: 'Général', avatar: '#', desc: 'Annonces courtes et fil commun', unread: 4, time: '16:42', preview: 'Maya : qui passe ce soir pour préparer la salle ?', online: '6 membres en ligne' },
  { id: 'intermix', type: 'room', group: 'Vie du lieu', name: 'Intermix', avatar: 'IM', desc: 'Rencontres, croisements, entraide', unread: 2, time: '15:12', preview: 'Noé : on cale une playlist commune ?', online: '4 membres en ligne' },
  { id: 'transmission', type: 'room', group: 'Ateliers', name: 'Transmission', avatar: 'TR', desc: 'Ateliers, savoir-faire, passation', unread: 1, time: '14:35', preview: 'Samira a ajouté une note matériel.', online: '3 membres en ligne' },
  { id: 'set30', type: 'room', group: 'Programmation', name: "Set/30'", avatar: '30', desc: 'Formats courts, concerts et rotations', time: 'hier', preview: 'Camille : il reste un créneau samedi.', online: '2 membres en ligne' },
  { id: 'archives', type: 'room', group: 'Mémoire', name: 'Archives', avatar: 'AR', desc: 'Traces, comptes-rendus, liens forum', time: 'lun.', preview: 'Léa : j’ai retrouvé les CR 2019.', online: '1 membre en ligne' },
  { id: 'technique', type: 'room', group: 'Ateliers', name: 'Technique scène', avatar: 'T', desc: 'Son, lumière et matériel', time: 'hier', preview: 'Les câbles sont dans la réserve.', online: '3 membres en ligne' },
  { id: 'maya', type: 'private', group: 'Privé', name: 'Maya', avatar: 'M', desc: 'Message direct', time: 'lun.', preview: 'Parfait, je te confirme demain.', online: 'en ligne', recipients: ['maya'] }
];

const seedMessages = {
  general: [
    ['incoming', 'Maya', 'M', 'avatar-accent', '16:38', 'Qui passe ce soir pour préparer la salle ?'],
    ['outgoing', 'Moi', 'JR', '', '16:40', 'Je peux être là vers 18 h. Il faut surtout quoi ?'],
    ['incoming', 'Noé', 'N', 'avatar-sand', '16:41', 'Les praticables et deux lignes lumière. J’ai mis la liste complète dans le sujet technique.'],
    ['incoming', 'Samira', 'S', 'avatar-grey', '16:42', 'Je passe aussi. Les câbles sont déjà dans la réserve.']
  ],
  intermix: [['incoming', 'Noé', 'N', 'avatar-sand', '15:12', 'On peut faire un salon intermix pour les idées qui traversent les projets.']],
  transmission: [['incoming', 'Samira', 'S', 'avatar-grey', '14:35', 'Je mets ici les tutos et les passages de relais.']],
  set30: [['incoming', 'Camille', 'C', 'avatar-sand', 'Hier', "Pour Set/30', il faudrait une room par date quand il y a beaucoup de monde."]],
  archives: [['incoming', 'Léa', 'L', 'avatar-grey', 'Lun.', 'Les archives restent liées au forum pour garder les décisions longues.']],
  technique: [['incoming', 'Samira', 'S', 'avatar-grey', 'Hier', 'Les câbles sont dans la réserve, rangée gauche.']],
  maya: [['incoming', 'Maya', 'M', 'avatar-accent', 'Lun.', 'Parfait, je te confirme demain.']]
};

let currentChatId = 'general';
let modalMode = 'private';
let selectedRecipientIds = new Set(['maya']);
let customRooms = loadJson(customRoomsKey, []);
let customMessages = loadJson(customMessagesKey, {});
let liveEnabled = false;
let liveUser = loadJson(liveUserKey, null);
let liveRooms = [];
let liveMessages = {};
let eventSource = null;
let pendingInvite = null;

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(customRoomsKey, JSON.stringify(customRooms));
  localStorage.setItem(customMessagesKey, JSON.stringify(customMessages));
}

function rooms() {
  return [...liveRooms, ...baseRooms, ...customRooms];
}

function isLiveRoom(id) {
  return liveRooms.some((room) => room.id === id);
}

function roomById(id) {
  return rooms().find((room) => room.id === id) || rooms()[0];
}

function setGreyTest(enabled) {
  document.body.classList.toggle('theme-grey-test', enabled);
  themeToggle.setAttribute('aria-pressed', String(enabled));
  themeToggle.textContent = enabled ? 'Fond sombre' : 'Fond clair';
  localStorage.setItem(themeKey, enabled ? '1' : '0');
}

function avatarHtml(room) {
  const tone = room.type === 'private' ? 'avatar-accent' : 'avatar-grey';
  return `<span class="avatar ${tone}">${room.avatar}</span>`;
}

function renderConversations() {
  conversationList.innerHTML = rooms().map((room) => `
    <button class="conversation" data-open-chat="${room.id}">
      ${avatarHtml(room)}
      <span class="conversation-copy">
        <span class="conversation-line"><strong>${room.name}</strong><time>${room.time || 'local'}</time></span>
        <span class="preview ${room.unread ? 'unread' : ''}">${room.preview}</span>
      </span>
      ${room.unread ? `<span class="unread-count">${room.unread}</span>` : ''}
    </button>
  `).join('');
}

function renderChannels() {
  const grouped = rooms().filter((room) => room.type === 'room').reduce((acc, room) => {
    acc[room.group] = [...(acc[room.group] || []), room];
    return acc;
  }, {});
  channelGroups.innerHTML = Object.entries(grouped).map(([group, groupRooms]) => `
    <div class="channel-group">
      <div class="channel-group-title"><span>${group.toUpperCase()}</span><button data-open-room-modal="room" aria-label="Ajouter un salon">＋</button></div>
      ${groupRooms.map((room) => `
        <button class="channel ${room.id === currentChatId ? 'active' : ''}" data-open-chat="${room.id}">
          <span class="channel-icon">${room.avatar}</span>
          <span><strong>${room.name}</strong><small>${room.desc}</small></span>
          ${room.unread ? `<b>${room.unread}</b>` : ''}
        </button>
      `).join('')}
    </div>
  `).join('');
}

function renderMessages(room) {
  const messages = liveMessages[room.id] || customMessages[room.id] || seedMessages[room.id] || [
    ['incoming', 'Blockhaus', '#', 'avatar-grey', 'Local', 'Cette room est prête côté interface.']
  ];
  chatHistory.innerHTML = `<div class="day-divider"><span>Aujourd'hui</span></div>` + messages.map(([direction, author, avatar, tone, time, text]) => {
    if (direction === 'outgoing') {
      return `<article class="message outgoing"><div><p>${escapeHtml(text)}</p><span class="message-status">${time} · Envoyé</span></div></article>`;
    }
    return `<article class="message incoming"><span class="avatar ${tone}">${avatar}</span><div><span class="message-author">${author} · ${time}</span><p>${escapeHtml(text)}</p></div></article>`;
  }).join('');
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

function showScreen(name) {
  chatScreen.hidden = true;
  screens.forEach((screen) => { screen.hidden = screen.id !== `screen-${name}`; });
  nav.hidden = false;
  navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function openChat(key, sourceButton) {
  const room = roomById(key);
  currentChatId = room.id;
  screens.forEach((screen) => { screen.hidden = true; });
  nav.hidden = true;
  chatScreen.hidden = false;
  chatTitle.textContent = room.name;
  chatAvatar.textContent = room.avatar;
  chatStatus.innerHTML = `<i></i> ${room.online || 'aperçu local'}`;
  renderMessages(room);
  sourceButton?.classList.add('was-opened');
  renderChannels();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
}

function openRoomModal(mode = 'private') {
  modalMode = mode;
  const livePrivate = liveEnabled && mode === 'private';
  selectedRecipientIds = new Set(mode === 'private' && !livePrivate ? ['maya'] : []);
  roomNameInput.value = livePrivate || mode === 'room' ? '' : 'Nouvelle discussion';
  roomNameInput.placeholder = livePrivate ? 'Ex. Rémy + Phil' : "Ex. Set/30' équipe affiche";
  memberSearch.closest('.field-label').hidden = livePrivate;
  selectedMembers.hidden = livePrivate;
  memberPicker.hidden = livePrivate;
  roomModalNote.textContent = livePrivate
    ? "Une invitation privée sera créée. Envoie-la à la personne qui doit rejoindre la discussion."
    : 'Prévisualisation locale : cette room restera sur cet appareil.';
  roomModal.showModal();
  renderRoomModal();
  setTimeout(() => (mode === 'room' ? roomNameInput : memberSearch).focus(), 50);
}

function renderRoomModal() {
  document.querySelectorAll('[data-room-mode]').forEach((button) => button.classList.toggle('is-active', button.dataset.roomMode === modalMode));
  document.querySelector('#room-modal-title').textContent = modalMode === 'room' ? 'Créer un salon' : 'Créer une discussion';
  const query = memberSearch.value.trim().toLocaleLowerCase('fr');
  selectedMembers.innerHTML = [...selectedRecipientIds].map((id) => {
    const member = members.find((item) => item.id === id);
    if (!member) return '';
    return `<button type="button" data-toggle-member="${member.id}">${member.name} ×</button>`;
  }).join('');
  memberPicker.innerHTML = members
    .filter((member) => !query || member.name.toLocaleLowerCase('fr').includes(query) || member.role.toLocaleLowerCase('fr').includes(query))
    .map((member) => `
      <button type="button" class="picker-member ${selectedRecipientIds.has(member.id) ? 'is-selected' : ''}" data-toggle-member="${member.id}">
        <span class="avatar ${member.tone}">${member.avatar}${member.online ? '<span class="presence"></span>' : ''}</span>
        <span><strong>${member.name}</strong><small>${member.role}</small></span>
        <em>${selectedRecipientIds.has(member.id) ? '✓' : '+'}</em>
      </button>
    `).join('');
}

async function createRoom() {
  const selected = [...selectedRecipientIds];
  const pickedMembers = selected.map((id) => members.find((member) => member.id === id)).filter(Boolean);
  const defaultName = modalMode === 'room'
    ? 'Nouveau salon'
    : pickedMembers.map((member) => member.name).join(', ') || 'Discussion privée';
  const name = roomNameInput.value.trim() || defaultName;

  if (liveEnabled && modalMode === 'private') {
    try {
      const result = await apiPost('/api/rooms', { userId: liveUser.id, name });
      roomModal.close();
      await loadLiveState();
      openChat(result.room.id);
      const url = new URL(result.invite, window.location.href).href;
      inviteLink.value = url;
      inviteModal.showModal();
    } catch (error) {
      roomModalNote.textContent = error.message;
    }
    return;
  }
  const id = `local-${Date.now()}`;
  const room = {
    id,
    type: modalMode,
    group: modalMode === 'room' ? 'Salons créés' : 'Privé',
    name,
    avatar: modalMode === 'room' ? name.slice(0, 2).toUpperCase() : 'MP',
    desc: modalMode === 'room' ? 'Salon proposé depuis le prototype' : `${pickedMembers.length} destinataire(s)`,
    recipients: selected,
    time: 'local',
    preview: modalMode === 'room' ? 'Salon créé en prévisualisation locale.' : `Room privée avec ${pickedMembers.map((member) => member.name).join(', ')}.`,
    online: 'aperçu local'
  };
  customRooms.unshift(room);
  customMessages[id] = [['incoming', 'Blockhaus', '#', 'avatar-grey', 'Local', 'Room créée sur cet appareil. Elle deviendra partagée quand un backend sera branché.']];
  saveState();
  renderConversations();
  renderChannels();
  roomModal.close();
  openChat(id);
}

async function apiPost(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Erreur de connexion.');
  return result;
}

function liveRoomFromServer(room) {
  const lastMessage = [...room.messages].reverse().find((message) => !message.system);
  return {
    id: room.id,
    type: 'private',
    group: 'Discussions privées en direct',
    name: room.name,
    avatar: 'MP',
    desc: room.members.join(', '),
    time: lastMessage ? formatLiveTime(lastMessage.time) : 'maintenant',
    preview: lastMessage ? `${lastMessage.author} : ${lastMessage.text}` : 'Discussion privée prête.',
    online: `${room.members.length} participant(s)`,
    network: true
  };
}

function formatLiveTime(value) {
  return new Date(value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

async function loadLiveState() {
  if (!liveEnabled || !liveUser) return;
  const response = await fetch(`/api/state?userId=${encodeURIComponent(liveUser.id)}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Impossible de charger les discussions.');
  const state = await response.json();
  liveRooms = state.rooms.map(liveRoomFromServer);
  liveMessages = Object.fromEntries(state.rooms.map((room) => [room.id, room.messages.map((message) => [
    message.authorId === liveUser.id ? 'outgoing' : 'incoming',
    message.author,
    message.system ? '#' : message.author.slice(0, 1).toUpperCase(),
    message.system ? 'avatar-grey' : 'avatar-accent',
    formatLiveTime(message.time),
    message.text
  ])]));
  renderConversations();
  renderChannels();
  if (isLiveRoom(currentChatId) && !chatScreen.hidden) renderMessages(roomById(currentChatId));
}

function connectLiveEvents() {
  eventSource?.close();
  eventSource = new EventSource(`/api/events?userId=${encodeURIComponent(liveUser.id)}`);
  eventSource.addEventListener('update', () => loadLiveState().catch(() => {}));
}

async function createOrRestoreSession(name) {
  const result = await apiPost('/api/session', { userId: liveUser?.id, name });
  liveUser = result.user;
  localStorage.setItem(liveUserKey, JSON.stringify(liveUser));
  liveTestStatus.textContent = `Connecté comme ${liveUser.name}`;
  document.querySelectorAll('.profile-button').forEach((button) => {
    button.textContent = liveUser.name.slice(0, 2).toUpperCase();
  });
  await loadLiveState();
  connectLiveEvents();
  await joinPendingInvite();
}

async function joinPendingInvite() {
  if (!pendingInvite || !liveUser) return;
  try {
    const result = await apiPost('/api/join', {
      userId: liveUser.id,
      roomId: pendingInvite.roomId,
      token: pendingInvite.token
    });
    pendingInvite = null;
    history.replaceState({}, '', location.pathname);
    await loadLiveState();
    openChat(result.room.id);
  } catch (error) {
    liveTestStatus.textContent = error.message;
  }
}

async function bootLiveTest() {
  const params = new URLSearchParams(location.search);
  if (params.get('room') && params.get('invite')) {
    pendingInvite = { roomId: params.get('room'), token: params.get('invite') };
  }
  try {
    const response = await fetch('/api/health', { cache: 'no-store' });
    if (!response.ok) return;
    liveEnabled = true;
    liveTestCard.hidden = false;
    roomModalNote.textContent = "Crée une discussion privée puis partage son invitation.";
    if (liveUser?.name) await createOrRestoreSession(liveUser.name);
    else identityModal.showModal();
  } catch {
    // La version GitHub Pages reste un prototype local sans serveur de test.
  }
}

setGreyTest(localStorage.getItem(themeKey) !== '0');
renderConversations();
renderChannels();

themeToggle.addEventListener('click', () => setGreyTest(!document.body.classList.contains('theme-grey-test')));
navItems.forEach((item) => item.addEventListener('click', () => showScreen(item.dataset.screen)));

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open-chat]');
  if (trigger) openChat(trigger.dataset.openChat, trigger);
  const modalTrigger = event.target.closest('[data-open-room-modal]');
  if (modalTrigger) openRoomModal(modalTrigger.dataset.openRoomModal);
  const memberToggle = event.target.closest('[data-toggle-member]');
  if (memberToggle) {
    const id = memberToggle.dataset.toggleMember;
    selectedRecipientIds.has(id) ? selectedRecipientIds.delete(id) : selectedRecipientIds.add(id);
    renderRoomModal();
  }
  if (event.target.closest('[data-close-room-modal]')) roomModal.close();
});

document.querySelector('#chat-back').addEventListener('click', () => showScreen('chats'));

roomForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await createRoom();
});

document.querySelectorAll('[data-room-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    modalMode = button.dataset.roomMode;
    renderRoomModal();
  });
});

memberSearch.addEventListener('input', renderRoomModal);

document.querySelector('#composer').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.querySelector('#message-input');
  const text = input.value.trim();
  if (!text) return;
  if (liveEnabled && isLiveRoom(currentChatId)) {
    input.value = '';
    try {
      await apiPost('/api/messages', { roomId: currentChatId, userId: liveUser.id, text });
      await loadLiveState();
      chatHistory.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (error) {
      input.value = text;
      liveTestStatus.textContent = error.message;
    }
    return;
  }
  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  customMessages[currentChatId] = [...(customMessages[currentChatId] || seedMessages[currentChatId] || []), ['outgoing', 'Moi', 'JR', '', now, text]];
  saveState();
  renderMessages(roomById(currentChatId));
  input.value = '';
  chatHistory.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

document.querySelector('#mark-read').addEventListener('click', () => {
  rooms().forEach((room) => { room.unread = 0; });
  renderConversations();
  renderChannels();
});

document.querySelector('#chat-search').addEventListener('input', (event) => {
  const query = event.target.value.trim().toLocaleLowerCase('fr');
  document.querySelectorAll('.conversation').forEach((row) => {
    row.classList.toggle('is-hidden', !row.textContent.toLocaleLowerCase('fr').includes(query));
  });
});

document.querySelectorAll('[data-agenda-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-agenda-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    const filter = button.dataset.agendaFilter;
    document.querySelectorAll('[data-event-period]').forEach((event) => {
      const period = event.dataset.eventPeriod;
      const visible = filter === 'all' || period === filter || (filter === 'week' && period === 'today');
      event.classList.toggle('is-filtered-out', !visible);
    });
  });
});

identityForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = identityName.value.trim();
  if (!name) return;
  const submit = identityForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    await createOrRestoreSession(name);
    identityModal.close();
  } catch (error) {
    liveTestStatus.textContent = error.message;
    submit.disabled = false;
  }
});

document.querySelectorAll('.profile-button').forEach((button) => {
  button.addEventListener('click', () => {
    if (!liveEnabled) return;
    identityName.value = liveUser?.name || '';
    identityModal.showModal();
  });
});

document.querySelector('#share-invite').addEventListener('click', async () => {
  const shareButton = document.querySelector('#share-invite');
  const shareData = { title: 'Discussion privée Blockhaus', text: 'Rejoins ma discussion privée Blockhaus.', url: inviteLink.value };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  inviteLink.select();
  if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(inviteLink.value);
  else document.execCommand('copy');
  shareButton.textContent = 'Lien copié';
});

document.querySelector('#close-invite').addEventListener('click', () => inviteModal.close());

bootLiveTest();
if (!navigator.share) document.querySelector('#share-invite').textContent = 'Copier le lien';

const localTestHost = ['localhost', '127.0.0.1'].includes(location.hostname) || /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname);
if ('serviceWorker' in navigator && !localTestHost) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}
