(function () {
  "use strict";

  var VERSION = "5";
  var ROOT_ID = "bh-member-dashboard";
  var STYLE_ID = "bh-member-dashboard-v2-style";
  var BETA_NAV_ID = "bh-dashboard-beta-nav";
  var BETA_STORAGE_KEY = "bh_dashboard_beta_v1";
  var AGENDA_PATH = "/h1-google-agenda";
  var AGENDA_EMBED = "https://calendar.google.com/calendar/embed?src=4o90q8lq7lv50fh0o03c3mma9o%40group.calendar.google.com&ctz=Europe%2FParis&mode=AGENDA&showTitle=0&showNav=1&showTabs=0&showCalendars=0&wkst=2";

  if (window.BLOCKHAUS_HOME_DASHBOARD_DISABLED === true) return;

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  function addStyle() {
    if (!document.head || document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#" + ROOT_ID + "{--bh-concrete:#928e85;--bh-deep:#66645c;--bh-ink:#141513;--bh-paper:#f4f2ec;--bh-white:#fff;--bh-line:#817d74;margin:0 0 22px;font-family:Arial,sans-serif;color:var(--bh-ink)}",
      "#" + ROOT_ID + " *{box-sizing:border-box}",
      "#" + ROOT_ID + " a{color:inherit;text-decoration:none}",
      "#" + ROOT_ID + " .bh-dash-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:18px 20px;background:var(--bh-ink);color:var(--bh-paper);border-bottom:5px solid var(--bh-concrete)}",
      "#" + ROOT_ID + " .bh-dash-kicker{display:block;margin-bottom:5px;font:800 11px/1 monospace;letter-spacing:.12em;text-transform:uppercase;color:#d8d2c7}",
      "#" + ROOT_ID + " h1{margin:0!important;padding:0!important;font-size:clamp(23px,4vw,40px)!important;line-height:.98!important;color:var(--bh-paper)!important;text-transform:uppercase}",
      "#" + ROOT_ID + " .bh-version{font:700 10px/1 monospace;color:#d8d2c7}",
      "#" + ROOT_ID + " .bh-priority-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-left:1px solid var(--bh-line);background:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-card{min-width:0;padding:18px;border-right:1px solid var(--bh-line);border-bottom:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-card-number{display:block;margin-bottom:15px;font:900 12px/1 monospace;color:#615f58}",
      "#" + ROOT_ID + " .bh-card h2{margin:0 0 8px!important;padding:0!important;font-size:18px!important;line-height:1.1!important;color:var(--bh-ink)!important}",
      "#" + ROOT_ID + " .bh-card p{min-height:34px;margin:0 0 12px;color:#514f49;font-size:13px;line-height:1.35}",
      "#" + ROOT_ID + " .bh-actions{display:flex;flex-wrap:wrap;gap:7px}",
      "#" + ROOT_ID + " .bh-action{display:inline-flex;align-items:center;min-height:38px;padding:8px 10px;border:1px solid var(--bh-ink);background:transparent;font-weight:800;font-size:12px}",
      "#" + ROOT_ID + " .bh-action.primary{background:var(--bh-ink);color:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-action:hover,#" + ROOT_ID + " .bh-action:focus{background:var(--bh-concrete);color:var(--bh-ink);outline:2px solid var(--bh-ink);outline-offset:1px}",
      "#" + ROOT_ID + " .bh-agenda{display:grid;grid-template-columns:220px minmax(0,1fr);background:var(--bh-deep);color:var(--bh-paper);border-bottom:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-agenda-copy{padding:18px;border-right:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-agenda-copy h2{margin:0 0 8px!important;padding:0!important;color:var(--bh-paper)!important;font-size:18px!important}",
      "#" + ROOT_ID + " .bh-agenda-copy p{margin:0 0 14px;color:#ebe5da;font-size:13px;line-height:1.4}",
      "#" + ROOT_ID + " .bh-agenda-frame{width:100%;height:360px;border:0;background:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-archives{border:1px solid var(--bh-line);border-top:0;background:#e5e0d7}",
      "#" + ROOT_ID + " .bh-archives summary{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px;cursor:pointer;font-weight:900;text-transform:uppercase;list-style:none}",
      "#" + ROOT_ID + " .bh-archives summary::-webkit-details-marker{display:none}",
      "#" + ROOT_ID + " .bh-archives summary:after{content:'+';font:900 22px/1 monospace}",
      "#" + ROOT_ID + " .bh-archives[open] summary:after{content:'−'}",
      "#" + ROOT_ID + " .bh-archive-groups{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--bh-line);border-top:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-archive-group{padding:16px;background:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-archive-group h3{margin:0 0 10px!important;padding:0!important;color:var(--bh-ink)!important;font-size:14px!important;text-transform:uppercase}",
      "#" + ROOT_ID + " .bh-chip-list{display:flex;flex-wrap:wrap;gap:7px}",
      "#" + ROOT_ID + " .bh-chip{display:inline-flex;align-items:center;min-height:34px;padding:7px 9px;background:#d6d1c8;border:1px solid #8d887e;font-size:12px;font-weight:700}",
      "#" + ROOT_ID + " .bh-forum-browser{display:grid;grid-template-columns:190px 230px minmax(250px,1fr) minmax(290px,.9fr);min-height:430px;background:var(--bh-concrete);border:2px solid var(--bh-ink);border-top:0}",
      "#" + ROOT_ID + " .bh-col{min-width:0;border-right:1px solid var(--bh-ink);background:rgba(244,242,236,.28)}",
      "#" + ROOT_ID + " .bh-col:last-child{border-right:0}",
      "#" + ROOT_ID + " .bh-col-title{display:flex;align-items:center;min-height:40px;padding:10px 12px;border-bottom:1px solid var(--bh-ink);background:rgba(20,21,19,.88);color:var(--bh-paper);font:900 12px/1 monospace;text-transform:uppercase}",
      "#" + ROOT_ID + " .bh-list{display:flex;flex-direction:column;padding:8px 7px;gap:4px}",
      "#" + ROOT_ID + " .bh-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;min-height:40px;padding:8px 9px;border:1px solid transparent;color:var(--bh-ink);font-weight:800}",
      "#" + ROOT_ID + " .bh-row:hover,#" + ROOT_ID + " .bh-row:focus{border-color:var(--bh-ink);background:var(--bh-paper);outline:0}",
      "#" + ROOT_ID + " .bh-row.active{background:var(--bh-ink);color:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-row[data-bh-folder]{cursor:pointer}",
      "#" + ROOT_ID + " .bh-row .bh-chevron{justify-self:end;font:900 14px/1 monospace}",
      "#" + ROOT_ID + " .bh-row-icon{width:20px;text-align:center;font:900 15px/1 monospace}",
      "#" + ROOT_ID + " .bh-row-main{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}",
      "#" + ROOT_ID + " .bh-status{justify-self:end;padding:3px 5px;border:1px solid currentColor;font:900 9px/1 monospace;text-transform:uppercase;white-space:nowrap}",
      "#" + ROOT_ID + " .bh-preview{padding:18px;background:rgba(244,242,236,.42)}",
      "#" + ROOT_ID + " .bh-preview h2{margin:0 0 8px!important;padding:0!important;color:var(--bh-ink)!important;font-size:21px!important;line-height:1.15!important}",
      "#" + ROOT_ID + " .bh-preview p{margin:0 0 14px;color:#30312d;line-height:1.42}",
      "#" + ROOT_ID + " .bh-preview-meta{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0 18px}",
      "#" + ROOT_ID + " .bh-preview-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}",
      "#" + ROOT_ID + " .bh-column-toolbar{display:flex;align-items:center;gap:6px;padding:7px;border-bottom:1px solid var(--bh-ink);background:#d8d2c7}",
      "#" + ROOT_ID + " .bh-column-brand{font:900 10px/1 monospace;letter-spacing:.08em;color:#3f3e39;margin-right:5px;white-space:nowrap}",
      "#" + ROOT_ID + " .bh-column-toolbar button{border:1px solid var(--bh-ink);background:var(--bh-paper);color:var(--bh-ink);font:900 12px/1 monospace;padding:6px 8px;cursor:pointer}",
      "#" + ROOT_ID + " .bh-column-toolbar button:disabled{opacity:.4;cursor:default}",
      "#" + ROOT_ID + " .bh-column-path{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:700 11px/1 monospace;color:#3f3e39}",
      "#" + ROOT_ID + " .bh-column-info{font:700 10px/1 monospace;color:#5d5a53;white-space:nowrap}",
      "#" + ROOT_ID + " .bh-column-scroll{overflow-x:scroll;overflow-y:hidden;scroll-behavior:smooth;scroll-snap-type:x mandatory;scrollbar-width:auto;scrollbar-color:var(--bh-ink) var(--bh-concrete);padding-bottom:4px}",
      "#" + ROOT_ID + " .bh-column-scroll::-webkit-scrollbar{height:14px}",
      "#" + ROOT_ID + " .bh-column-scroll::-webkit-scrollbar-track{background:var(--bh-concrete);border-top:1px solid var(--bh-ink)}",
      "#" + ROOT_ID + " .bh-column-scroll::-webkit-scrollbar-thumb{background:var(--bh-ink);border:3px solid var(--bh-concrete)}",
      "#" + ROOT_ID + " .bh-column-scroll .bh-forum-browser{min-width:980px}",
      "#" + ROOT_ID + " .bh-column-scroll .bh-col{scroll-snap-align:start}",
      "#" + ROOT_ID + " .bh-bandcamp-note{margin-top:10px;color:#5d5a53;font-size:11px;line-height:1.35}",
      "a.mainmenu[data-bh-agenda-link='true']{display:inline-flex!important;align-items:center;gap:5px;font-weight:800!important}",
      "a.mainmenu[data-bh-agenda-link='true']:before{content:'▦';font:900 14px/1 monospace}",
      "#" + BETA_NAV_ID + " .bh-beta-toggle{display:inline-flex!important;align-items:center;gap:5px;padding:4px 7px!important;border:1px solid currentColor;font-weight:900!important}",
      "#" + BETA_NAV_ID + " .bh-beta-toggle:before{content:'β';font:900 14px/1 monospace}",
      "#" + ROOT_ID + " .bh-beta-exit{display:inline-flex;align-items:center;min-height:32px;padding:6px 9px;border:1px solid #d8d2c7;color:var(--bh-paper);font:800 10px/1 monospace;text-transform:uppercase}",
      "[data-bh-old-calendar-hidden='true']{display:none!important}",
      "body#mpage-body-modern #" + ROOT_ID + "{margin:10px 8px 16px;border:1px solid var(--bh-ink);overflow:hidden}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-dash-head{padding:13px 14px}",
      "body#mpage-body-modern #" + ROOT_ID + " h1{font-size:22px!important}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-priority-grid{grid-template-columns:1fr}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-agenda{grid-template-columns:1fr}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-agenda-copy{border-right:0;border-bottom:1px solid var(--bh-line)}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-agenda-frame{height:430px}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-forum-browser{display:block;min-height:0;border-left:0;border-right:0}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-col{border-right:0;border-bottom:1px solid var(--bh-ink)}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-col:nth-child(2),body#mpage-body-modern #" + ROOT_ID + " .bh-col:nth-child(4){display:none}",
      "@media(max-width:800px){#" + ROOT_ID + "{margin:0 0 14px}#" + ROOT_ID + " .bh-priority-grid{grid-template-columns:1fr}#" + ROOT_ID + " .bh-card p{min-height:0}#" + ROOT_ID + " .bh-agenda{grid-template-columns:1fr}#" + ROOT_ID + " .bh-agenda-copy{border-right:0;border-bottom:1px solid var(--bh-line)}#" + ROOT_ID + " .bh-agenda-frame{height:430px}#" + ROOT_ID + " .bh-forum-browser{display:block;min-height:0}#" + ROOT_ID + " .bh-col{border-right:0;border-bottom:1px solid var(--bh-ink)}#" + ROOT_ID + " .bh-col:nth-child(4){display:none}#" + ROOT_ID + " .bh-archive-groups{grid-template-columns:1fr}#" + ROOT_ID + " .bh-dash-head{align-items:flex-start}#" + ROOT_ID + " .bh-version{padding-top:4px}#" + ROOT_ID + " .bh-column-brand,#" + ROOT_ID + " .bh-column-info{display:none}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function allLinks() {
    return Array.prototype.slice.call(document.querySelectorAll("a[href]"));
  }

  function findLink(patterns, fallback) {
    var links = allLinks();
    for (var i = 0; i < patterns.length; i += 1) {
      var pattern = patterns[i];
      var found = links.find(function (link) {
        return pattern.test(normalize((link.textContent || "") + " " + (link.getAttribute("title") || "")));
      });
      if (found) return found.getAttribute("href");
    }
    return fallback || "#";
  }

  function link(label, href, primary) {
    if (!href || href === "#") return "";
    return '<a class="bh-action' + (primary ? " primary" : "") + '" href="' + href + '">' + label + "</a>";
  }

  function chip(label, href) {
    if (!href || href === "#") return "";
    return '<a class="bh-chip" href="' + href + '">' + label + "</a>";
  }

  function externalMusicLinks() {
    var seen = {};
    return allLinks().filter(function (anchor) {
      var href = anchor.getAttribute("href") || "";
      return /^https?:\/\//i.test(href) && /bandcamp\.com/i.test(href) && !seen[href] && (seen[href] = true);
    }).slice(0, 40).map(function (anchor) {
      var label = normalize(anchor.textContent) || anchor.hostname.replace(/^www\./, "");
      return { label: label.slice(0, 56), href: anchor.href };
    });
  }

  function row(label, href, icon, status, active) {
    if (!href || href === "#") href = "/";
    return '<a class="bh-row" data-bh-folder="true" href="' + href + '"><span class="bh-row-icon" aria-hidden="true">' + icon + '</span><span class="bh-row-main">' + label + '</span>' + (status ? '<span class="bh-status">' + status + "</span>" : "") + '<span class="bh-chevron" aria-hidden="true">›</span></a>';
  }

  function fixAgendaNavigation() {
    var agendaLinks = document.querySelectorAll('a[href^="' + AGENDA_PATH + '"]');
    Array.prototype.forEach.call(agendaLinks, function (agendaLink) {
      if (agendaLink.closest("#" + ROOT_ID)) return;
      agendaLink.textContent = "Agenda";
      agendaLink.removeAttribute("target");
      agendaLink.setAttribute("title", "Agenda Google du Blockhaus");
      agendaLink.setAttribute("aria-label", "Agenda du Blockhaus");
      agendaLink.setAttribute("data-bh-agenda-link", "true");
    });
  }

  function hideOldCalendar() {
    var marker = document.querySelector('a[name="p_calendar"]');
    if (!marker) return;
    marker.setAttribute("data-bh-old-calendar-hidden", "true");
    var calendarModule = marker.nextElementSibling;
    if (calendarModule && calendarModule.classList.contains("module")) calendarModule.setAttribute("data-bh-old-calendar-hidden", "true");
  }

  function hideClassicHome(root, main) {
    var siblings = Array.prototype.slice.call(main.children);
    siblings.forEach(function (element) {
      if (element === root || element.id === BETA_NAV_ID || element.id === "tab-bar" || element.id === "to-top") return;
      if (element.tagName === "SCRIPT" || element.tagName === "STYLE") return;
      element.setAttribute("data-bh-classic-home-hidden", "true");
      element.style.setProperty("display", "none", "important");
    });
  }

  function isMember() {
    return allLinks().some(function (link) {
      return /déconnexion|logout/i.test(normalize(link.textContent || "") + " " + (link.getAttribute("href") || ""));
    });
  }

  function isBetaEnabled() {
    var requested = new URLSearchParams(window.location.search).get("bh_beta");
    try {
      if (requested === "1") window.localStorage.setItem(BETA_STORAGE_KEY, "1");
      else if (requested !== null) window.localStorage.removeItem(BETA_STORAGE_KEY);
      return window.localStorage.getItem(BETA_STORAGE_KEY) === "1";
    } catch (error) {
      return requested === "1";
    }
  }

  function addBetaNavigation(enabled) {
    if (!isMember() || document.getElementById(BETA_NAV_ID)) return;
    var nav = document.querySelector("ul.linklist.navlinks") || document.querySelector(".navbar ul") || document.querySelector(".navbar");
    if (!nav) return;
    var item = document.createElement(nav.tagName === "UL" ? "li" : "span");
    item.id = BETA_NAV_ID;
    item.innerHTML = '<a class="mainmenu bh-beta-toggle" href="/?bh_beta=' + (enabled ? "off" : "1") + '">' + (enabled ? "Quitter la bêta" : "Bêta accueil") + "</a> &nbsp;";
    nav.appendChild(item);
  }

  function buildDashboard() {
    if (!isMember()) return;
    // Replace an older beta container left in the DOM after its Forumactif
    // script was disabled; the classic forum markup remains untouched.
    var previousRoot = document.getElementById(ROOT_ID);
    if (previousRoot) previousRoot.remove();
    if (!/^\/(?:index\.htm)?$/.test(window.location.pathname) && window.BLOCKHAUS_HOME_DASHBOARD_PREVIEW !== true) return;

    var main = document.getElementById("main-content") || document.getElementById("main") || document.body;
    var meetingHref = findLink([/^REUNIONS$/i, /réunions/i], "/f39-reunions");
    var agendaHref = AGENDA_PATH;
    var odjHref = findLink([/^ODJ\b/i, /ordre(?:s)? du jour/i]);
    var reportHref = findLink([/compte(?:s)? rendu(?:s)?/i, /^CR\b/i]);
    var generalHref = findLink([/^Discussion générale$/i, /^Général$/i]);
    var eventsHref = findLink([/^Évènements du calendrier$/i, /^Evènements du calendrier$/i, /propositions d.?évènements/i], "/events");
    var rulesHref = findLink([/Règlement et adhésions/i], "#");
    var projectHref = findLink([/notre projet/i], "#");
    var consentHref = findLink([/Consenthaus|charte des bons comportements/i], "#");
    var transmissionHref = findLink([/Transmission/i, /Atelier soudure/i], "#");
    var intermixHref = findLink([/Intermix/i, /Chambre intermix/i], "#");
    var soundHref = findLink([/^The sounds of the Blockhaus DY10$/i, /^Collège son$/i], "/f27-the-sounds-of-the-blockhaus-dy10");
    var setHref = findLink([/52\s*x\s*Set\/30/i, /^set\/30/i], "/f37-52-x-set-30-archives");
    var waveHref = findLink([/Wave Drone Orchestra/i], "/f19-wave-drone-orchestra");
    var disqHref = findLink([/BLOCKHAUS DY DISQ/i], "/f21-blockhaus-dy-disq");
    var videoHref = findLink([/Atelier Vidéo/i], "/f35-atelier-video-salle-6-etage-1-s1-6");
    var documentaryHref = findLink([/Documentaires/i], "/f32-documentaires");
    var imagesHref = "/images";
    var musicLinks = externalMusicLinks();
    var musicChips = musicLinks.map(function (item) { return chip(item.label, item.href); }).join("");
    if (!musicChips) musicChips = '<span class="bh-bandcamp-note">Les liens Bandcamp ajoutés dans les sujets du forum apparaîtront ici automatiquement.</span>';

    var root = document.createElement("section");
    root.id = ROOT_ID;
    root.dataset.version = VERSION;
    root.setAttribute("aria-label", "Accueil des membres du Blockhaus");
    root.innerHTML =
      '<header class="bh-dash-head"><div><span class="bh-dash-kicker">Blockhaus / DY10</span><h1>À la une des membres</h1></div><div><span class="bh-version">ACCUEIL V' + VERSION + '</span><br><a class="bh-beta-exit" href="/?bh_beta=off">Quitter la bêta</a></div></header>' +
      '<div class="bh-priority-grid">' +
        '<article class="bh-card"><span class="bh-card-number">01 / PRIORITÉ</span><h2>Réunions & décisions</h2><p>Ordres du jour, comptes rendus et décisions collectives.</p><div class="bh-actions">' + link("Réunions", meetingHref, true) + link("Dernier ODJ", odjHref, false) + link("Dernier CR", reportHref, false) + "</div></article>" +
        '<article class="bh-card"><span class="bh-card-number">02 / À VENIR</span><h2>Agenda & événements</h2><p>Les soirées et rendez-vous à venir dans l’agenda partagé.</p><div class="bh-actions">' + link("Ouvrir l’agenda", agendaHref, true) + link("Événements du forum", "/events", false) + "</div></article>" +
        '<article class="bh-card"><span class="bh-card-number">03 / ACTIVITÉ</span><h2>Ce qui bouge</h2><p>Retrouver rapidement les nouveaux messages et discussions.</p><div class="bh-actions">' + link("Nouveaux messages", "/search?search_id=newposts", true) + link("Sans réponse", "/search?search_id=unanswered", false) + link("Général", generalHref, false) + "</div></article>" +
      "</div>" +
      '<section class="bh-agenda"><div class="bh-agenda-copy"><span class="bh-card-number">AGENDA PARTAGÉ</span><h2>Soirées @ Blockhaus</h2><p>Google Agenda devient la vue principale. L’ancien calendrier Forumactif reste conservé comme archive technique.</p>' + link("Voir en grand", agendaHref, true) + '</div><iframe class="bh-agenda-frame" loading="lazy" title="Agenda Google du Blockhaus" src="' + AGENDA_EMBED + '"></iframe></section>' +
      '<div class="bh-column-toolbar" role="toolbar" aria-label="Navigation par colonnes"><span class="bh-column-brand">BLOCKHAUS / DY10</span><button type="button" data-bh-col-back disabled aria-label="Revenir">‹</button><button type="button" data-bh-col-forward aria-label="Avancer">›</button><span class="bh-column-path" data-bh-col-path>Accueil › Zones › À lire</span><span class="bh-column-info">4 niveaux · vue Finder</span></div>' +
      '<div class="bh-column-scroll" data-bh-col-scroll><section class="bh-forum-browser" aria-label="Circuler dans le forum">' +
        '<div class="bh-col"><div class="bh-col-title">1. Zones</div><div class="bh-list">' +
          row("À lire", "/search?search_id=newposts", "!", "actif", true) +
          row("Réus", meetingHref, "R", "prio", false) +
          row("Événements", eventsHref, "E", "date", false) +
          row("Agenda", agendaHref, "A", "google", false) +
          row("Archives son", soundHref, "S", "", false) +
          row("Archives image", imagesHref, "I", "", false) +
          row("ChatBox", "/chatbox/", "C", "direct", false) +
        "</div></div>" +
        '<div class="bh-col"><div class="bh-col-title">2. Rubriques</div><div class="bh-list">' +
          row("Derniers posts", "/search?search_id=newposts", ">", "nouveau", true) +
          row("Important", rulesHref, "*", "", false) +
          row("Le projet DY10", projectHref, "P", "", false) +
          row("Charte / comportements", consentHref, "B", "", false) +
          row("Liens & ressources", generalHref, "L", "", false) +
        "</div></div>" +
        '<div class="bh-col"><div class="bh-col-title">3. Sujets utiles</div><div class="bh-list">' +
          row("Réunion / ordre du jour", odjHref || meetingHref, "D", "à lire", true) +
          row("Dernier compte rendu", reportHref || meetingHref, "D", "cr", false) +
          row("Événements du calendrier", eventsHref, "D", "date", false) +
          row("52 x Set/30' Archives", setHref, "D", "son", false) +
          row("Intermix", intermixHref, "D", "", false) +
          row("Transmission", transmissionHref, "D", "", false) +
        "</div></div>" +
        '<div class="bh-col"><div class="bh-col-title">4. Aperçu</div><div class="bh-preview"><h2>Vue liste / colonnes</h2><p>Cette bêta garde l’organisation du forum, mais donne une entrée plus directe aux choses à lire, aux réunions, à l’agenda et aux archives.</p><div class="bh-preview-meta"><span class="bh-chip">sans compteurs</span><span class="bh-chip">mobile en liste</span><span class="bh-chip">desktop en colonnes</span></div><p>Les nombres de sujets et de réponses restent dans l’interface classique. Ici, on privilégie les statuts utiles : nouveau, important, à lire, date, archive.</p><div class="bh-preview-actions">' + link("Ouvrir les nouveaux messages", "/search?search_id=newposts", true) + link("Revenir au forum classique", "/?bh_beta=off", false) + "</div></div></div>" +
      "</section></div>" +
      '<details class="bh-archives"><summary>Archives musicales & visuelles <small>niveau secondaire</small></summary><div class="bh-archive-groups">' +
        '<section class="bh-archive-group"><h3>Musique & son</h3><div class="bh-chip-list">' + chip("The Sounds", soundHref) + chip("Set/30'", setHref) + chip("Wave Drone Orchestra", waveHref) + chip("DY DISQ", disqHref) + musicChips + "</div></section>" +
        '<section class="bh-archive-group"><h3>Images & vidéo</h3><div class="bh-chip-list">' + chip("Dernières images", imagesHref) + chip("Atelier vidéo", videoHref) + chip("Documentaires", documentaryHref) + "</div></section>" +
      "</div></details>";

    main.insertBefore(root, main.firstChild);
    var scroll = root.querySelector("[data-bh-col-scroll]");
    var back = root.querySelector("[data-bh-col-back]");
    var forward = root.querySelector("[data-bh-col-forward]");
    var path = root.querySelector("[data-bh-col-path]");
    var level = 0;
    function setLevel(next) {
      level = Math.max(0, Math.min(3, next));
      var width = scroll.scrollWidth / 4;
      scroll.scrollTo({ left: width * level, behavior: "smooth" });
      back.disabled = level === 0;
      forward.disabled = level === 3;
      path.textContent = ["Accueil › Zones › À lire", "Accueil › Zones › Réunions", "Accueil › Rubriques › Sujets utiles", "Accueil › Aperçu › Archive"][level];
    }
    back.addEventListener("click", function () { setLevel(level - 1); });
    forward.addEventListener("click", function () { setLevel(level + 1); });
    root.querySelectorAll(".bh-row[data-bh-folder]").forEach(function (entry) {
      entry.addEventListener("click", function (event) {
        var column = Array.prototype.indexOf.call(root.querySelectorAll(".bh-col"), entry.closest(".bh-col"));
        if (column < 0) return;
        if (!(event && (event.metaKey || event.ctrlKey || event.shiftKey))) event.preventDefault();
        root.querySelectorAll(".bh-row.active").forEach(function (item) { item.classList.remove("active"); });
        entry.classList.add("active");
        if (column < 3) setLevel(column + 1);
        path.textContent = "Accueil › " + entry.querySelector(".bh-row-main").textContent.trim();
      });
    });
    hideClassicHome(root, main);
    hideOldCalendar();
  }

  function buildVisitorArchive() {
    if (document.getElementById("bh-public-archive") || !/^\/(?:index\.htm)?$/.test(window.location.pathname)) return;
    var main = document.getElementById("main-content") || document.getElementById("main") || document.body;
    var links = externalMusicLinks();
    if (!links.length) {
      links = [
        { label: "The Sounds of the Blockhaus", href: "/f27-the-sounds-of-the-blockhaus-dy10" },
        { label: "52 x Set/30' Archives", href: "/f37-52-x-set-30-archives" },
        { label: "Collège son", href: "/f4-college-son" },
        { label: "Galerie images", href: "/images" }
      ];
    }
    var section = document.createElement("details");
    section.id = "bh-public-archive";
    section.className = "bh-archives";
    section.innerHTML = '<summary>Archives audio & liens <small>accès visiteur</small></summary><div class="bh-archive-groups"><section class="bh-archive-group"><h3>Bandcamp / sons du lieu</h3><div class="bh-chip-list">' + links.map(function (item) { return chip(item.label, item.href); }).join("") + '</div><p class="bh-bandcamp-note">Les archives restent en retrait de l’accueil et s’ouvrent seulement à la demande.</p></section></div>';
    main.appendChild(section);
  }

  function rollback() {
    var root = document.getElementById(ROOT_ID);
    var style = document.getElementById(STYLE_ID);
    var betaNav = document.getElementById(BETA_NAV_ID);
    if (root) root.remove();
    if (style) style.remove();
    if (betaNav) betaNav.remove();
    Array.prototype.forEach.call(document.querySelectorAll('[data-bh-old-calendar-hidden="true"]'), function (element) {
      element.removeAttribute("data-bh-old-calendar-hidden");
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-bh-classic-home-hidden="true"]'), function (element) {
      element.removeAttribute("data-bh-classic-home-hidden");
      element.style.removeProperty("display");
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-bh-agenda-link="true"]'), function (agendaLink) {
      agendaLink.textContent = "";
      agendaLink.setAttribute("target", "_blank");
      agendaLink.removeAttribute("title");
      agendaLink.removeAttribute("aria-label");
      agendaLink.removeAttribute("data-bh-agenda-link");
    });
  }

  window.BlockhausHomeDashboard = {
    version: VERSION,
    rollback: rollback
  };

  ready(function () {
    addStyle();
    var betaEnabled = isBetaEnabled();
    addBetaNavigation(betaEnabled);
    buildVisitorArchive();
    if (!betaEnabled) return;
    fixAgendaNavigation();
    buildDashboard();
    // Build once only. Rebuilding on an interval reset the Finder-style
    // horizontal scroll position and made the columns look like an
    // automatically moving slider. Navigation is now fully manual.
  });
})();
