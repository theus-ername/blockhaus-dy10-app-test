// Run: deno test --allow-read --allow-env tests/mobile-forum.test.mjs
// Public live check: add --allow-net before the filename, then -- --live.
import { JSDOM } from "npm:jsdom@26.1.0";
import assert from "node:assert/strict";

const source = await Deno.readTextFile(new URL("../blockhaus-mobile-forumactif.js", import.meta.url));
const instrumented = source.replace(/  if \(document.readyState === "loading"\)[\s\S]*?\n\}\(\)\);\s*$/, "  window.testFinder = { parseForumPage, createShell, initFinder, readForumDocument };\n}());");
const origin = "https://blockhaus-dy10.forumactif.com";
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function env() {
  const dom = new JSDOM('<body id="mpage-body-modern"><a href="/login?logout=1">Déconnexion</a><main></main></body>', { url: origin + '/?bh_beta=1', runScripts: "outside-only" });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  dom.window.eval(instrumented);
  return dom;
}
function guestEnv() {
  const dom = new JSDOM('<body id="mpage-body-modern"><main></main></body>', { url: origin + '/?bh_beta=1', runScripts: "outside-only" });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  dom.window.eval(instrumented);
  return dom;
}
const folder = (id, title) => `<div class="forum-section"><div class="forum-content"><a href="/f${id}-forum"><h3>${title}</h3><div class="forum-statistics">forum 56</div></a><div class="forum-lastpost-wrap"><a href="/t999-unrelated">ODJ hors rubrique</a></div></div></div>`;
const topic = (id, title) => `<div class="forum-section"><div class="forum-content"><h3><a href="/t${id}-sujet">${title}</a></h3><div class="forum-statistics">comment 2</div></div></div>`;
const group = (title, rows) => `<div class="forum"><h2><span>${title}</span></h2>${rows}</div>`;
const index = group("BLOGHAUS DY10", folder(23, "BLOGHAUS DY10")) + group("The sounds of the Blockhaus DY10", folder(27, "The sounds of the Blockhaus DY10")) + group("52 x Set/30' Archives", folder(37, "52 x Set/30' Archives")) + group("DY10", folder(40, "MODE D'EMPLOI DU FORUM") + folder(12, "Règlement et adhésions") + folder(39, "REUNIONS"));

Deno.test("mobile index preserves the real groups and excludes last-post/sidebar links", () => {
  const dom = env();
  try {
    const doc = new dom.window.DOMParser().parseFromString(index + '<div class="module">' + group("Derniers sujets", folder(99, "Ne pas inclure")) + '</div>', 'text/html');
    const result = dom.window.testFinder.parseForumPage(doc, '/');
    assert.equal(result.children.length, 4);
    assert.equal(result.children[3].title, "DY10");
    assert.deepEqual(Array.from(result.children[3].children, c => c.title), ["MODE D'EMPLOI DU FORUM", "Règlement et adhésions", "REUNIONS"]);
    assert.equal(result.children[0].href, '/f23-forum');
    assert.equal(JSON.stringify(result).includes('t999'), false);
  } finally { dom.window.close(); }
});

Deno.test("mobile beta keeps the compact navigation and full-width Blockhaus header image", () => {
  const dom = env();
  try {
    const root = dom.window.testFinder.createShell();
    assert.equal(root.querySelectorAll('.bhm-header-image').length, 1);
    assert.equal(root.querySelector('.bhm-header-image').getAttribute('src').includes('blockhaus-header.png'), true);
    assert.equal(root.querySelectorAll('.bhm-logo').length, 0);
    assert.deepEqual([...root.querySelectorAll('.bhm-bottom-nav a')].map(a => a.textContent.replace(/\s+/g, ' ').trim()), ['⌂Accueil', '▦Forum', '✉MP', '▤ChatBox']);
    const menu = root.querySelector('.bhm-menu-panel').textContent;
    assert.ok(menu.indexOf('Agenda Google') < menu.indexOf('Forum complet'));
    assert.match(source, /__BLOCKHAUS_MOBILE_SHELL_BOOTSTRAPPED__/);
    assert.ok(source.includes("grid-template-columns:repeat(4,minmax(0,1fr))"));
  } finally { dom.window.close(); }
});

Deno.test("mobile guest shell exposes only public sound archives", () => {
  const dom = guestEnv();
  try {
    const root = dom.window.testFinder.createShell();
    assert.match(root.textContent, /Archives son/);
    assert.doesNotMatch(root.textContent, /Résumé du dernier CR|Agenda Google|activité/i);
    assert.deepEqual([...root.querySelectorAll('.bhm-bottom-nav a')].map(a => a.textContent.replace(/\s+/g, ' ').trim()), ['↪Connexion']);
  } finally { dom.window.close(); }
});

Deno.test("mobile Finder synchronizes its stack with the phone back gesture", () => {
  assert.match(source, /window\.history\.pushState\(state/);
  assert.match(source, /window\.addEventListener\("popstate"/);
  assert.match(source, /event\.preventDefault\(\); stack = \[home\]; open\(FORUMS\.forum\)/);
});

Deno.test("desktop lists exclude breadcrumbs, embedded latest topics and last-post shortcuts", () => {
  const dom = env();
  try {
    const html = `<a class="nav" href="/f1-parent">Parent</a><div class="module"><a class="topictitle" href="/t900-odj">ODJ</a></div><div class="forabg"><div class="table-title"><h2>DY10</h2></div><ul class="topiclist forums"><li class="row"><a class="forumtitle" href="/f39-reunions">REUNIONS</a><a href="/t999-cr">Dernier CR</a></li></ul></div><ul class="topiclist topics"><li class="row"><a class="topictitle" href="/t170-aneth">Aneth Penny</a><a href="/t170-aneth#446">Dernier message</a></li></ul><div class="pagination"><a href="/f27p50-sounds">2</a><a href="/f39p50-reunions">Autre forum</a></div>`;
    const doc = new dom.window.DOMParser().parseFromString(html, 'text/html');
    const result = dom.window.testFinder.parseForumPage(doc, '/f27-sounds');
    assert.deepEqual(Array.from(result.children, c => c.title), ['REUNIONS', 'Aneth Penny']);
    assert.equal(result.next, '/f27p50-sounds');
    assert.equal(dom.window.testFinder.parseForumPage(doc, '/').children[0].title, 'DY10');
  } finally { dom.window.close(); }
});

Deno.test("full navigation reaches 56 topics and message pages without leaving the Finder", async () => {
  const dom = env(), win = dom.window;
  try {
    const replies = n => `<div class="topic"><div class="post-section" id="p${n}"><div class="post-info">Membre test</div><div class="post-content">Message ${n}<iframe src="https://bandcamp.com/EmbeddedPlayer/album=123/size=large/"></iframe><img src="https://example.org/smiles/smile.gif"></div></div></div>`;
    const pages = {
      '/': index,
      '/f39-forum': group('REUNIONS', folder(17, 'Ordres du jour') + folder(16, 'Comptes rendus') + folder(45, 'Sondages et votes') + folder(46, '30 ans Blockhaus DY10')) + group('Sujets', topic(700, 'Sujet à la racine')),
      '/f17-forum': group('Sujets', Array.from({length:50}, (_,i) => topic(i+1, 'ODJ '+(i+1))).join('')) + '<a class="mobile_next_button block" href="/f17p50-forum">Suivant</a>',
      '/f17p50-forum': group('Sujets', Array.from({length:6}, (_,i) => topic(i+51, 'ODJ '+(i+51))).join('')),
      '/t56-sujet': replies(1) + '<a class="mobile_next_button block" href="/t56p15-sujet">Suivant</a>',
      '/t56p15-sujet': replies(2),
    };
    win.fetch = async href => { assert.ok(Object.hasOwn(pages, href), 'Unexpected request '+href); return { ok: true, url: origin+href, text: async () => pages[href] }; };
    const root = win.testFinder.createShell(); const finder = win.testFinder.initFinder(root);
    const clickRow = async title => { const button = [...root.querySelectorAll('[data-bhm-index]')].find(b => b.querySelector('.bhm-row-title').textContent === title); assert.ok(button, 'Missing '+title); button.click(); await tick(); };
    finder.openForum(); await tick();
    await clickRow('DY10'); await clickRow('REUNIONS');
    assert.equal(root.querySelectorAll('[data-bhm-index]').length, 5);
    await clickRow('Ordres du jour');
    assert.equal(root.querySelectorAll('[data-bhm-index]').length, 50);
    root.querySelector('[data-bhm-status] button').click(); await tick();
    assert.equal(root.querySelectorAll('[data-bhm-index]').length, 56);
    await clickRow('ODJ 56');
    assert.match(root.querySelector('[data-bhm-path]').textContent, /Forum complet›DY10›REUNIONS›Ordres du jour›ODJ 56/);
    assert.equal(root.querySelectorAll('.bhm-post').length, 1);
    assert.equal(root.querySelectorAll('.bhm-bandcamp-frame').length, 1);
    assert.equal(root.querySelectorAll('.bhm-preview-image').length, 0);
    root.querySelector('[data-bhm-post-status] button').click(); await tick();
    assert.equal(root.querySelectorAll('.bhm-post').length, 2);
    root.querySelector('[data-bhm-back]').click();
    assert.equal(root.querySelectorAll('[data-bhm-index]').length, 56);
  } finally { dom.window.close(); }
});

Deno.test("login redirects do not appear as empty folders and failed loads are retryable", async () => {
  const dom = env(), win = dom.window;
  try {
    let requests = 0;
    win.fetch = async () => { requests++; return { ok: true, url: origin + '/login?redirect=reunions', text: async () => '<form><input type="password"></form>' }; };
    const root = win.testFinder.createShell(); win.testFinder.initFinder(root);
    [...root.querySelectorAll('[data-bhm-index]')].find(b => b.textContent.includes('Réunions')).click(); await tick();
    assert.match(root.querySelector('[data-bhm-status]').textContent, /Connecte-toi/);
    root.querySelector('[data-bhm-status] button').click(); await tick();
    assert.equal(requests, 2);
    assert.equal(root.querySelectorAll('[data-bhm-index]').length, 0);
  } finally { dom.window.close(); }
});

Deno.test("a delayed folder response cannot replace a different selected branch", async () => {
  const dom = env(), win = dom.window;
  try {
    let release;
    win.fetch = href => href === '/' ? new Promise(resolve => { release = () => resolve({ok:true,url:origin+'/',text:async()=>index}); }) : Promise.resolve({ok:true,url:origin+href,text:async()=>group('Sujets',topic(170,'Aneth Penny'))});
    const root = win.testFinder.createShell(); const finder = win.testFinder.initFinder(root);
    finder.openForum();
    root.querySelector('[data-bhm-back]').click();
    [...root.querySelectorAll('[data-bhm-index]')].find(b=>b.textContent.includes('Archives son')).click(); await tick();
    release(); await tick();
    assert.deepEqual([...root.querySelectorAll('.bhm-row-title')].map(n=>n.textContent), ['Aneth Penny']);
    assert.match(root.querySelector('[data-bhm-path]').textContent, /Archives son$/);
  } finally { dom.window.close(); }
});

Deno.test({ name: "public Forumactif pages expose the four root groups and actual music topics", ignore: !Deno.args.includes('--live'), async fn() {
  const dom = env();
  try {
    const pages = await Promise.all(['/', '/f27-the-sounds-of-the-blockhaus-dy10', '/f4-college-son'].map(async path => {
      const response = await fetch(origin + path + '?mobile=1', {headers:{'User-Agent':'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/129.0.0.0 Mobile Safari/537.36'}});
      assert.equal(response.status,200);
      const doc = new dom.window.DOMParser().parseFromString(await response.text(),'text/html');
      return dom.window.testFinder.parseForumPage(doc,path);
    }));
    assert.deepEqual(Array.from(pages[0].children, n=>n.title), ['BLOGHAUS DY10','The sounds of the Blockhaus DY10',"52 x Set/30' Archives",'DY10']);
    assert.ok(pages[1].children.some(n=>n.title.includes('Aneth Penny')));
    assert.ok(pages[1].children.some(n=>n.title.includes('DCIM')));
    assert.ok(pages[1].children.every(n=>n.topic && !n.href.includes('#')));
    assert.ok(pages[2].children.some(n=>n.forumHref && n.title === 'Projets avec les groupes'));
    console.log('Verified public root categories:', pages[0].children.length, '; music topics:', pages[1].children.length);
  } finally {dom.window.close();}
}});
