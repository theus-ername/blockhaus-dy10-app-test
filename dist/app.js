const screens = [...document.querySelectorAll('.screen')];
const nav = document.querySelector('.bottom-nav');
const navItems = [...document.querySelectorAll('.nav-item')];
const chatScreen = document.querySelector('#screen-chat');
const chatTitle = document.querySelector('#chat-title');
const chatAvatar = document.querySelector('#chat-avatar');
const themeToggle = document.querySelector('#theme-toggle');
const themeKey = 'blockhaus-grey-test';

const chatNames = {
  general: ['Général', '#'], programmation: ['Programmation', 'P'], technique: ['Technique scène', 'T'],
  maya: ['Maya', 'M'], presence: ['Qui est là ?', '⌂'], atelier: ['Atelier', 'A'],
  concerts: ['Concerts', '♪'], agenda: ['Agenda', '09'], administratif: ['Administratif', '⌑']
};

function setGreyTest(enabled) {
  document.body.classList.toggle('theme-grey-test', enabled);
  themeToggle.setAttribute('aria-pressed', String(enabled));
  themeToggle.textContent = enabled ? 'Fond clair' : 'Fond sombre';
  localStorage.setItem(themeKey, enabled ? '1' : '0');
}

setGreyTest(localStorage.getItem(themeKey) === '1');
themeToggle.addEventListener('click', () => setGreyTest(!document.body.classList.contains('theme-grey-test')));

function showScreen(name) {
  chatScreen.hidden = true;
  screens.forEach((screen) => { screen.hidden = screen.id !== `screen-${name}`; });
  nav.hidden = false;
  navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function openChat(key, sourceButton) {
  const [name, avatar] = chatNames[key] || ['Discussion', '#'];
  screens.forEach((screen) => { screen.hidden = true; });
  nav.hidden = true;
  chatScreen.hidden = false;
  chatTitle.textContent = name;
  chatAvatar.textContent = avatar;
  sourceButton?.classList.add('was-opened');
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
}

navItems.forEach((item) => item.addEventListener('click', () => showScreen(item.dataset.screen)));
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open-chat]');
  if (trigger) openChat(trigger.dataset.openChat, trigger);
});
document.querySelector('#chat-back').addEventListener('click', () => showScreen('chats'));

document.querySelector('#composer').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#message-input');
  const text = input.value.trim();
  if (!text) return;
  const article = document.createElement('article');
  article.className = 'message outgoing';
  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const wrap = document.createElement('div');
  const paragraph = document.createElement('p');
  const status = document.createElement('span');
  paragraph.textContent = text;
  status.className = 'message-status';
  status.textContent = `${now} · Envoyé`;
  wrap.append(paragraph, status);
  article.append(wrap);
  document.querySelector('#chat-history').append(article);
  input.value = '';
  article.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

document.querySelectorAll('.reaction').forEach((button) => {
  button.addEventListener('click', () => {
    const active = button.classList.toggle('is-active');
    button.querySelector('span').textContent = active ? '3' : '2';
  });
});

document.querySelector('#mark-read').addEventListener('click', () => {
  document.querySelectorAll('.unread-count').forEach((count) => count.remove());
  document.querySelectorAll('.preview.unread').forEach((preview) => preview.classList.remove('unread'));
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}
