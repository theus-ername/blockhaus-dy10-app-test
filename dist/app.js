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
const themeKey = 'blockhaus-grey-test';
const customRoomsKey = 'blockhaus-custom-rooms-v1';
const customMessagesKey = 'blockhaus-custom-messages-v1';

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
  return [...baseRooms, ...customRooms];
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
  const messages = customMessages[room.id] || seedMessages[room.id] || [
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
  selectedRecipientIds = new Set(mode === 'private' ? ['maya'] : []);
  roomNameInput.value = mode === 'room' ? '' : 'Nouvelle discussion';
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

function createRoom() {
  const selected = [...selectedRecipientIds];
  const pickedMembers = selected.map((id) => members.find((member) => member.id === id)).filter(Boolean);
  const defaultName = modalMode === 'room'
    ? 'Nouveau salon'
    : pickedMembers.map((member) => member.name).join(', ') || 'Discussion privée';
  const name = roomNameInput.value.trim() || defaultName;
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

roomForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createRoom();
});

document.querySelectorAll('[data-room-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    modalMode = button.dataset.roomMode;
    renderRoomModal();
  });
});

memberSearch.addEventListener('input', renderRoomModal);

document.querySelector('#composer').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#message-input');
  const text = input.value.trim();
  if (!text) return;
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}
