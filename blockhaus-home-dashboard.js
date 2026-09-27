(function () {
  "use strict";

  var VERSION = "1";
  var ROOT_ID = "bh-member-dashboard";
  var STYLE_ID = "bh-member-dashboard-v1-style";
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
      "a.mainmenu[data-bh-agenda-link='true']{display:inline-flex!important;align-items:center;gap:5px;font-weight:800!important}",
      "a.mainmenu[data-bh-agenda-link='true']:before{content:'▦';font:900 14px/1 monospace}",
      "#" + BETA_NAV_ID + " .bh-beta-toggle{display:inline-flex!important;align-items:center;gap:5px;padding:4px 7px!important;border:1px solid currentColor;font-weight:900!important}",
      "#" + BETA_NAV_ID + " .bh-beta-toggle:before{content:'β';font:900 14px/1 monospace}",
      "#" + ROOT_ID + " .bh-beta-exit{display:inline-flex;align-items:center;min-height:32px;padding:6px 9px;border:1px solid #d8d2c7;color:var(--bh-paper);font:800 10px/1 monospace;text-transform:uppercase}",
      "[data-bh-old-calendar-hidden='true']{display:none!important}",
      "@media(max-width:800px){#" + ROOT_ID + "{margin:0 0 14px}#" + ROOT_ID + " .bh-priority-grid{grid-template-columns:1fr}#" + ROOT_ID + " .bh-card p{min-height:0}#" + ROOT_ID + " .bh-agenda{grid-template-columns:1fr}#" + ROOT_ID + " .bh-agenda-copy{border-right:0;border-bottom:1px solid var(--bh-line)}#" + ROOT_ID + " .bh-agenda-frame{height:430px}#" + ROOT_ID + " .bh-archive-groups{grid-template-columns:1fr}#" + ROOT_ID + " .bh-dash-head{align-items:flex-start}#" + ROOT_ID + " .bh-version{padding-top:4px}}"
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

  function isMember() {
    return allLinks().some(function (link) {
      return /déconnexion|logout/i.test(normalize(link.textContent || "") + " " + (link.getAttribute("href") || ""));
    });
  }

  function isBetaEnabled() {
    var requested = new URLSearchParams(window.location.search).get("bh_beta");
    try {
      if (requested === "1") window.localStorage.setItem(BETA_STORAGE_KEY, "1");
      if (requested === "0") window.localStorage.removeItem(BETA_STORAGE_KEY);
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
    item.innerHTML = '<a class="mainmenu bh-beta-toggle" href="/?bh_beta=' + (enabled ? "0" : "1") + '">' + (enabled ? "Quitter la bêta" : "Bêta accueil") + "</a> &nbsp;";
    nav.appendChild(item);
  }

  function buildDashboard() {
    if (document.getElementById(ROOT_ID) || !isMember()) return;
    if (!/^\/(?:index\.htm)?$/.test(window.location.pathname) && window.BLOCKHAUS_HOME_DASHBOARD_PREVIEW !== true) return;

    var main = document.getElementById("main-content") || document.getElementById("main") || document.body;
    var meetingHref = findLink([/^REUNIONS$/i, /réunions/i], "/f39-reunions");
    var agendaHref = AGENDA_PATH;
    var odjHref = findLink([/^ODJ\b/i, /ordre(?:s)? du jour/i]);
    var reportHref = findLink([/compte(?:s)? rendu(?:s)?/i, /^CR\b/i]);
    var generalHref = findLink([/^Discussion générale$/i, /^Général$/i]);
    var soundHref = findLink([/^The sounds of the Blockhaus DY10$/i, /^Collège son$/i], "/f27-the-sounds-of-the-blockhaus-dy10");
    var setHref = findLink([/52\s*x\s*Set\/30/i, /^set\/30/i], "/f37-52-x-set-30-archives");
    var waveHref = findLink([/Wave Drone Orchestra/i], "/f19-wave-drone-orchestra");
    var disqHref = findLink([/BLOCKHAUS DY DISQ/i], "/f21-blockhaus-dy-disq");
    var videoHref = findLink([/Atelier Vidéo/i], "/f35-atelier-video-salle-6-etage-1-s1-6");
    var documentaryHref = findLink([/Documentaires/i], "/f32-documentaires");
    var imagesHref = "/images";

    var root = document.createElement("section");
    root.id = ROOT_ID;
    root.dataset.version = VERSION;
    root.setAttribute("aria-label", "Accueil des membres du Blockhaus");
    root.innerHTML =
      '<header class="bh-dash-head"><div><span class="bh-dash-kicker">Blockhaus / DY10</span><h1>À la une des membres</h1></div><div><span class="bh-version">ACCUEIL V' + VERSION + '</span><br><a class="bh-beta-exit" href="/?bh_beta=0">Quitter la bêta</a></div></header>' +
      '<div class="bh-priority-grid">' +
        '<article class="bh-card"><span class="bh-card-number">01 / PRIORITÉ</span><h2>Réunions & décisions</h2><p>Ordres du jour, comptes rendus et décisions collectives.</p><div class="bh-actions">' + link("Réunions", meetingHref, true) + link("Dernier ODJ", odjHref, false) + link("Dernier CR", reportHref, false) + "</div></article>" +
        '<article class="bh-card"><span class="bh-card-number">02 / À VENIR</span><h2>Agenda & événements</h2><p>Les soirées et rendez-vous à venir dans l’agenda partagé.</p><div class="bh-actions">' + link("Ouvrir l’agenda", agendaHref, true) + link("Événements du forum", "/events", false) + "</div></article>" +
        '<article class="bh-card"><span class="bh-card-number">03 / ACTIVITÉ</span><h2>Ce qui bouge</h2><p>Retrouver rapidement les nouveaux messages et discussions.</p><div class="bh-actions">' + link("Nouveaux messages", "/search?search_id=newposts", true) + link("Sans réponse", "/search?search_id=unanswered", false) + link("Général", generalHref, false) + "</div></article>" +
      "</div>" +
      '<section class="bh-agenda"><div class="bh-agenda-copy"><span class="bh-card-number">AGENDA PARTAGÉ</span><h2>Soirées @ Blockhaus</h2><p>Google Agenda devient la vue principale. L’ancien calendrier Forumactif reste conservé comme archive technique.</p>' + link("Voir en grand", agendaHref, true) + '</div><iframe class="bh-agenda-frame" loading="lazy" title="Agenda Google du Blockhaus" src="' + AGENDA_EMBED + '"></iframe></section>' +
      '<details class="bh-archives"><summary>Archives musicales & visuelles <small>niveau secondaire</small></summary><div class="bh-archive-groups">' +
        '<section class="bh-archive-group"><h3>Musique & son</h3><div class="bh-chip-list">' + chip("The Sounds", soundHref) + chip("Set/30'", setHref) + chip("Wave Drone Orchestra", waveHref) + chip("DY DISQ", disqHref) + "</div></section>" +
        '<section class="bh-archive-group"><h3>Images & vidéo</h3><div class="bh-chip-list">' + chip("Dernières images", imagesHref) + chip("Atelier vidéo", videoHref) + chip("Documentaires", documentaryHref) + "</div></section>" +
      "</div></details>";

    main.insertBefore(root, main.firstChild);
    hideOldCalendar();
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
    if (!betaEnabled) return;
    fixAgendaNavigation();
    buildDashboard();
  });
})();
