(function () {
  "use strict";

  var VERSION = "0.2.0-mobile-shell";
  var ROOT_ID = "bh-mobile-shell";
  var STYLE_ID = "bh-mobile-shell-v020-style";
  var BETA_KEY = "blockhaus-mobile-beta";
  var BETA_COOKIE = "blockhaus-mobile-beta";
  var THEME_KEY = "blockhaus-mobile-theme";
  var LOGO_URL = "https://i.servimg.com/u/f95/19/07/75/91/blockh13.jpg";
  var AGENDA_BASE = "https://calendar.google.com/calendar/embed?src=4o90q8lq7lv50fh0o03c3mma9o%40group.calendar.google.com&ctz=Europe%2FParis&showTitle=0&showNav=1&showTabs=0&showCalendars=0&wkst=2";
  var AGENDA_HREF = "/h1-google-agenda";
  var OLD_AGENDA_HREF = "/calendar";
  var previewMode = window.BLOCKHAUS_MOBILE_PREVIEW === true;
  var params = new URLSearchParams(window.location.search);
  var isMobileTemplate = !!(document.body && (document.body.id === "mpage-body-modern" || document.querySelector("#tab-bar"))) || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
  var betaRequested = params.get("bh_mobile_beta") === "1" || params.get("bh_beta") === "1";
  var betaDisabled = params.get("bh_beta") === "off";
  var betaStored = false;

  try {
    if (betaRequested) {
      localStorage.setItem(BETA_KEY, "1");
      document.cookie = BETA_COOKIE + "=1; Max-Age=31536000; Path=/; SameSite=Lax";
      document.cookie = BETA_COOKIE + "=1; Max-Age=31536000; Path=/; Domain=.forumactif.com; SameSite=Lax";
    }
    if (betaDisabled) {
      localStorage.removeItem(BETA_KEY);
      document.cookie = BETA_COOKIE + "=; Max-Age=0; Path=/; SameSite=Lax";
      document.cookie = BETA_COOKIE + "=; Max-Age=0; Path=/; Domain=.forumactif.com; SameSite=Lax";
    }
    betaStored = localStorage.getItem(BETA_KEY) === "1" || new RegExp("(?:^|;\\s*)" + BETA_COOKIE + "=1(?:;|$)").test(document.cookie || "");
  } catch (error) {}
  var enabled = previewMode || betaRequested || betaStored;
  if (!enabled || (!isMobileTemplate && !previewMode) || document.getElementById(ROOT_ID)) return;

  var FORUMS = {
    meetings: { title: "Réunions & décisions", meta: "REUNIONS · 4 rubriques", href: "/f39-reunions", forumHref: "/f39-reunions", icon: "★", kind: "folder", children: [
      { title: "Ordres du jour", meta: "56 sujets · 375 réponses", href: "/f17-ordres-du-jour", forumHref: "/f17-ordres-du-jour", icon: "▦", kind: "folder", children: [] },
      { title: "Comptes rendus", meta: "47 sujets · 67 réponses", href: "/f16-comptes-rendus", forumHref: "/f16-comptes-rendus", icon: "▦", kind: "folder", children: [] },
      { title: "Sondages et votes", meta: "1 sujet · 4 réponses", href: "/f45-sondages-et-votes", forumHref: "/f45-sondages-et-votes", icon: "▦", kind: "folder", children: [] },
      { title: "30 ans Blockhaus DY10", meta: "5 sujets · 11 réponses", href: "/f46-30-ans-blockhaus-dy10", forumHref: "/f46-30-ans-blockhaus-dy10", icon: "▦", kind: "folder", children: [] }
    ] },
    events: { title: "Événements", meta: "Agenda et événements", href: "/calendar", icon: "◷", kind: "folder", children: [
      { title: "Agenda Google", meta: "Vue agenda, mois et année", href: AGENDA_HREF, icon: "▦", kind: "link" },
      { title: "Événements du forum", meta: "Calendrier historique", href: OLD_AGENDA_HREF, icon: "◷", kind: "link" }
    ] },
    sounds: { title: "Archives son", meta: "Sons et liens publics", href: "/f27-the-sounds-of-the-blockhaus-dy10", forumHref: "/f27-the-sounds-of-the-blockhaus-dy10", icon: "♫", kind: "folder", children: [] },
    forum: { title: "Forum complet", meta: "Arborescence réelle Forumactif", href: "/c1-dy10", forumHref: "/c1-dy10", icon: "⌘", kind: "folder", children: [
      { title: "Réunions & décisions", meta: "REUNIONS", href: "/f39-reunions", forumHref: "/f39-reunions", icon: "★", kind: "folder", children: [] },
      { title: "The Sounds", meta: "Archives son", href: "/f27-the-sounds-of-the-blockhaus-dy10", forumHref: "/f27-the-sounds-of-the-blockhaus-dy10", icon: "♫", kind: "folder", children: [] },
      { title: "52 x Set/30' Archives", meta: "Archives musicales", href: "/f37-52-x-set-30-archives", forumHref: "/f37-52-x-set-30-archives", icon: "♫", kind: "folder", children: [] },
      { title: "Collège son", meta: "Discussions son", href: "/f4-college-son", forumHref: "/f4-college-son", icon: "♫", kind: "folder", children: [] },
      { title: "Bloghaus DY10", meta: "Forum principal", href: "/f23-bloghaus-dy10", forumHref: "/f23-bloghaus-dy10", icon: "B", kind: "folder", children: [] }
    ] }
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; });
  }
  function text(value) { return String(value == null ? "" : value).replace(/\s+/g, " ").trim(); }
  function abs(href) {
    try { var url = new URL(href || "#", window.location.origin); return url.pathname + url.search + url.hash; }
    catch (error) { return href || "#"; }
  }
  function numberFrom(value) { var m = text(value).match(/\d[\d .,'\u00a0]*/); return m ? m[0].replace(/[^\d]/g, "") : ""; }
  function rowFor(anchor) { return anchor.closest("li") || anchor.closest("dl") || anchor.closest("tr") || anchor.parentElement; }
  function cleanTitle(value) { return text(value).replace(/^\s*[›»•]\s*/, "").replace(/\s+/g, " "); }

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#" + ROOT_ID + "{--bg:#98948b;--paper:#f4f2ec;--ink:#171815;--deep:#5f5d55;--line:#77736a;--muted:#4e4c46;display:block;margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 Arial,sans-serif}",
      "#" + ROOT_ID + " *{box-sizing:border-box}#" + ROOT_ID + " a{color:inherit;text-decoration:none}",
      "#" + ROOT_ID + " .bhm-head{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:10px;min-height:64px;padding:8px 10px;background:var(--ink);color:var(--paper);border-bottom:3px solid var(--bg);box-shadow:0 2px 0 #0005}",
      "#" + ROOT_ID + " .bhm-logo{display:block;flex:none;width:48px;height:48px;border:1px solid var(--paper);background:#000;overflow:hidden}#" + ROOT_ID + " .bhm-logo img{display:block;width:100%;height:100%;object-fit:cover}",
      "#" + ROOT_ID + " .bhm-brand{min-width:0;flex:1}#" + ROOT_ID + " .bhm-brand strong{display:block;font-size:17px;line-height:1.1}#" + ROOT_ID + " .bhm-brand small{display:block;color:#d8d2c7;font-size:11px;line-height:1.2}",
      "#" + ROOT_ID + " .bhm-head-tools{display:flex;align-items:center;gap:6px;flex:none}#" + ROOT_ID + " .bhm-head-tool{display:grid;place-items:center;width:34px;height:34px;border:1px solid #d8d2c7;background:transparent;color:var(--paper);font-size:16px;cursor:pointer}",
      "#" + ROOT_ID + " .bhm-menu{position:relative}#" + ROOT_ID + " .bhm-menu summary{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--paper);font-size:21px;cursor:pointer;list-style:none}#" + ROOT_ID + " .bhm-menu summary::-webkit-details-marker{display:none}",
      "#" + ROOT_ID + " .bhm-menu-panel{position:absolute;right:0;top:44px;width:min(300px,calc(100vw - 20px));padding:6px;background:var(--paper);color:var(--ink);border:2px solid var(--ink);box-shadow:4px 4px 0 var(--ink)}#" + ROOT_ID + " .bhm-menu-panel a,#" + ROOT_ID + " .bhm-menu-panel button{display:block;width:100%;padding:11px 9px;border:0;border-bottom:1px solid #c8c3ba;background:transparent;color:var(--ink);font:800 13px Arial,sans-serif;text-align:left;cursor:pointer}#" + ROOT_ID + " .bhm-menu-panel a:last-child,#" + ROOT_ID + " .bhm-menu-panel button:last-child{border-bottom:0}",
      "#" + ROOT_ID + " .bhm-main{padding:10px 10px 82px}#" + ROOT_ID + " .bhm-card{margin:0 0 10px;padding:15px;background:var(--paper);border:1px solid var(--line)}#" + ROOT_ID + " .bhm-card h1,#" + ROOT_ID + " .bhm-card h2{margin:0 0 9px;font-size:24px;line-height:1.12}#" + ROOT_ID + " .bhm-eyebrow{display:block;margin-bottom:8px;color:var(--muted);font:900 11px/1 monospace;letter-spacing:.08em;text-transform:uppercase}",
      "#" + ROOT_ID + " .bhm-summary{margin:0;color:#252521;font-size:15px;line-height:1.5}#" + ROOT_ID + " .bhm-cr-summary{margin:5px 0 12px;padding-left:19px;color:#252521;font-size:14px;line-height:1.42}#" + ROOT_ID + " .bhm-cr-summary li{margin:0 0 6px}#" + ROOT_ID + " .bhm-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}#" + ROOT_ID + " .bhm-action{display:inline-flex;align-items:center;min-height:38px;padding:8px 10px;border:1px solid var(--ink);background:transparent;font-size:12px;font-weight:900}#" + ROOT_ID + " .bhm-action.primary{background:var(--ink);color:var(--paper)}",
      "#" + ROOT_ID + " .bhm-agenda-frame{display:block;width:100%;height:430px;border:1px solid var(--line);background:#fff}#" + ROOT_ID + " .bhm-agenda-controls{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}#" + ROOT_ID + " .bhm-agenda-controls button{min-height:34px;padding:7px 9px;border:1px solid var(--ink);background:transparent;font:800 12px Arial;cursor:pointer}#" + ROOT_ID + " .bhm-agenda-controls button.active{background:var(--ink);color:var(--paper)}",
      "#" + ROOT_ID + " .bhm-activity{overflow:hidden}#" + ROOT_ID + " .bhm-latest-list{height:210px;overflow-y:auto;border:1px solid var(--line);background:var(--bg);scroll-behavior:smooth}#" + ROOT_ID + " .bhm-latest-item{display:block;padding:11px 12px;border-bottom:1px solid #b5b0a7;background:var(--paper)}#" + ROOT_ID + " .bhm-latest-item strong{display:block;font-size:14px}#" + ROOT_ID + " .bhm-latest-item small{display:block;margin-top:3px;color:var(--muted);font:11px/1.3 monospace}#" + ROOT_ID + " .bhm-gallery{margin-top:12px}#" + ROOT_ID + " .bhm-gallery-frame{position:relative;width:100%;height:250px;background:var(--bg);border:1px solid var(--line);overflow:hidden}#" + ROOT_ID + " .bhm-gallery-frame a{display:none;width:100%;height:100%}#" + ROOT_ID + " .bhm-gallery-frame a.active{display:block}#" + ROOT_ID + " .bhm-gallery-frame img{display:block;width:100%;height:100%;object-fit:contain;background:var(--bg)}#" + ROOT_ID + " .bhm-gallery-controls{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:7px;margin-top:7px;color:var(--muted);font:800 10px/1 monospace;text-transform:uppercase}#" + ROOT_ID + " .bhm-gallery-controls input{width:100%;accent-color:var(--ink)}#" + ROOT_ID + " .bhm-gallery-empty{padding:18px;text-align:center;color:var(--muted);font:12px monospace}",
      "#" + ROOT_ID + " .bhm-finder{padding:0;overflow:hidden}#" + ROOT_ID + " .bhm-finder-head{padding:14px;background:var(--deep);color:var(--paper)}#" + ROOT_ID + " .bhm-finder-head h2{margin:0;font-size:21px}#" + ROOT_ID + " .bhm-path{display:flex;gap:5px;overflow:auto;margin-top:7px;color:#e4dfd5;font:700 11px/1.3 monospace;white-space:nowrap}#" + ROOT_ID + " .bhm-path button{border:0;background:none;color:inherit;padding:0;text-decoration:underline;cursor:pointer}#" + ROOT_ID + " .bhm-list{padding:6px;background:var(--bg)}#" + ROOT_ID + " .bhm-row{display:flex;align-items:center;gap:10px;width:100%;min-height:58px;padding:9px 8px;border:0;border-bottom:1px solid #b3aea4;background:transparent;color:var(--ink);text-align:left;cursor:pointer}#" + ROOT_ID + " .bhm-row:hover,#" + ROOT_ID + " .bhm-row:focus{background:var(--paper);outline:0}#" + ROOT_ID + " .bhm-row-icon{display:grid;place-items:center;width:30px;height:30px;flex:none;border:1px solid currentColor;font-weight:900}#" + ROOT_ID + " .bhm-row-copy{min-width:0;flex:1}#" + ROOT_ID + " .bhm-row-title{display:block;font-weight:900;overflow-wrap:anywhere}#" + ROOT_ID + " .bhm-row-meta{display:block;margin-top:2px;color:var(--muted);font:11px/1.25 monospace}#" + ROOT_ID + " .bhm-row-arrow{font:900 20px/1 monospace}",
      "#" + ROOT_ID + " .bhm-preview{padding:15px;background:var(--paper);border-top:1px solid var(--line)}#" + ROOT_ID + " .bhm-preview p{margin:0 0 9px;color:#292923}#" + ROOT_ID + " .bhm-preview-body{max-height:260px;overflow:auto;padding:10px;background:#ebe8e0;border:1px solid var(--line);font-size:13px;line-height:1.45;white-space:pre-wrap}#" + ROOT_ID + " .bhm-topic-media{margin-top:12px;padding-top:9px;border-top:1px solid #c1bcb2}#" + ROOT_ID + " .bhm-topic-media-label{display:block;margin-bottom:6px;color:var(--muted);font:900 10px monospace;text-transform:uppercase}#" + ROOT_ID + " .bhm-bandcamp-frame{display:block;width:100%;height:180px;border:1px solid var(--line);background:#fff}#" + ROOT_ID + " .bhm-preview-image{display:block;max-width:100%;max-height:190px;margin:6px 0;object-fit:contain}",
      "#" + ROOT_ID + " .bhm-bottom-nav{position:fixed;z-index:60;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(3,1fr);height:58px;background:var(--ink);color:var(--paper);border-top:2px solid var(--paper)}#" + ROOT_ID + " .bhm-bottom-nav a{display:grid;place-items:center;gap:1px;padding:5px 2px;color:inherit;font-size:11px;font-weight:900;text-align:center}#" + ROOT_ID + " .bhm-bottom-nav span{display:block;font-size:20px;line-height:1}",
      "#" + ROOT_ID + ".bhm-dark{--bg:#353631;--paper:#e8e5dd;--ink:#11120f;--deep:#252621;--line:#77786e;--muted:#d0cbc1}",
      "body#mpage-body-modern #header,body#mpage-body-modern #mhead,body#mpage-body-modern #tab-bar,body#mpage-body-modern .mobile-navbar,body#mpage-body-modern #mobile-nav,body#mpage-body-modern #mfoot{display:none!important}",
      "@media(max-width:420px){#" + ROOT_ID + " .bhm-head{gap:7px;padding:7px}#" + ROOT_ID + " .bhm-logo{width:42px;height:42px}#" + ROOT_ID + " .bhm-brand strong{font-size:15px}#" + ROOT_ID + " .bhm-brand small{font-size:10px}#" + ROOT_ID + " .bhm-head-tool{display:none}#" + ROOT_ID + " .bhm-agenda-frame{height:390px}#" + ROOT_ID + " .bhm-gallery-frame{height:220px}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function link(href, label, primary) { return '<a class="bhm-action' + (primary ? ' primary' : '') + '" href="' + esc(href) + '">' + esc(label) + '</a>'; }
  function findMain() { return document.querySelector("#main-content, #content, main, #main") || document.body; }

  function hideNativeChrome(main) {
    ["#mwrap > #header", "#mwrap > #mhead", "#mwrap > #tab-bar", "#tab-bar", "#mobile-nav", ".mobile-navbar", ".mobile-header", ".mobile-footer"].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) { if (!node.closest("#" + ROOT_ID)) node.style.display = "none"; });
    });
    Array.prototype.forEach.call(main.children || [], function (child) { if (child.id !== ROOT_ID) child.hidden = true; });
  }

  function createShell() {
    addStyle();
    var main = findMain();
    var root = document.createElement("section");
    root.id = ROOT_ID;
    root.setAttribute("aria-label", "Interface mobile Blockhaus");
    root.innerHTML =
      '<header class="bhm-head"><a class="bhm-logo" href="/" aria-label="Accueil Blockhaus-DY10"><img src="' + LOGO_URL + '" alt="Blockhaus-DY10"></a><div class="bhm-brand"><strong>Blockhaus-DY10</strong><small>le forum du DY10</small></div><div class="bhm-head-tools"><a class="bhm-head-tool" href="/notifications" aria-label="Notifications">●</a><details class="bhm-menu"><summary aria-label="Ouvrir le menu">⋯</summary><div class="bhm-menu-panel">' +
      link("/", "Accueil") + link("/images", "Dernières images") + link("/calendar", "Événements") + link(AGENDA_HREF, "Agenda Google") + link("/memberlist", "Membres") + link("/profile", "Mon profil") + link("/privmsg", "Messages privés") + link("/search", "Rechercher") + link("/login?logout=1", "Se déconnecter") + link("/?bh_beta=off", "Version web classique") + '<button type="button" data-bhm-theme>Mode sombre</button><a href="/privacy">Cookies</a></div></details></div></header>' +
      '<main class="bhm-main"><section class="bhm-card bhm-cr-card"><span class="bhm-eyebrow">01 / résumé du dernier CR</span><h1>Ce qui se décide</h1><ul class="bhm-cr-summary"><li><strong>Nouveaux membres :</strong> Nicolas Plessis et Pascal Lebrun rejoignent l’association.</li><li><strong>Captation & archives :</strong> filmer les événements, clarifier l’archivage, relancer les Best Of et le projet de labo photo.</li><li><strong>Programmation :</strong> octobre à février, de Rebecca Bonté / Colombey au workshop, à la soirée noise et aux résidences.</li><li><strong>Soirées LGBT+ :</strong> projet accepté, petit comité, DJ sets et projections.</li><li><strong>K-Haus :</strong> accueillir le travail de Jean.</li><li><strong>Migration Messenger :</strong> organiser un vote Slack, Signal, Telegram, Messenger ou Discord.</li><li><strong>Espace couture :</strong> proposition de Mathieu et Hortense, plusieurs personnes intéressées.</li></ul><div class="bhm-actions">' + link("/f39-reunions", "Réunions", true) + link("/f17-ordres-du-jour", "ODJ") + link("/f17-ordres-du-jour", "Dernier ODJ") + link("/f16-comptes-rendus", "Dernier CR") + '</div></section>' +
      '<section class="bhm-card"><span class="bhm-eyebrow">02 / agenda & événements</span><h2>Soirées @ Blockhaus</h2><p class="bhm-summary">L’agenda Google est affiché ici. L’ancien calendrier reste accessible dans le Finder et le menu.</p><iframe class="bhm-agenda-frame" data-bhm-agenda loading="lazy" title="Agenda Google du Blockhaus" src="' + AGENDA_BASE + '&mode=AGENDA"></iframe><div class="bhm-agenda-controls" role="group" aria-label="Vue de l’agenda"><button class="active" type="button" data-bhm-agenda-view="AGENDA">Agenda</button><button type="button" data-bhm-agenda-view="MONTH">Mois</button><a class="bhm-action" href="' + esc(AGENDA_HREF) + '">Voir en grand</a><a class="bhm-action" href="' + esc(OLD_AGENDA_HREF) + '">Ancien agenda</a></div></section>' +
      '<section class="bhm-card bhm-activity"><span class="bhm-eyebrow">03 / activité</span><h2>Activité</h2><div class="bhm-latest-list" data-bhm-latest><div class="bhm-gallery-empty">Chargement des publications…</div></div><div class="bhm-gallery" data-bhm-gallery><div class="bhm-gallery-empty">Chargement de la galerie…</div></div></section>' +
      '<section class="bhm-card bhm-finder"><div class="bhm-finder-head"><h2>Explorer le forum</h2><div class="bhm-path" data-bhm-path></div></div><div class="bhm-list" data-bhm-list></div><div class="bhm-preview" data-bhm-preview hidden></div><div class="bhm-status" data-bhm-status></div></section></main>' +
      '<nav class="bhm-bottom-nav" aria-label="Navigation mobile"><a href="/"><span>⌂</span>Accueil</a><a href="/privmsg"><span>✉</span>MP</a><a href="/chatbox"><span>▤</span>ChatBox</a></nav>';
    if (main === document.body) document.body.insertBefore(root, document.body.firstChild); else main.insertBefore(root, main.firstChild);
    hideNativeChrome(main);
    try { if (localStorage.getItem(THEME_KEY) === "1") root.classList.add("bhm-dark"); } catch (error) {}
    var themeButton = root.querySelector("[data-bhm-theme]");
    themeButton.addEventListener("click", function () { root.classList.toggle("bhm-dark"); try { localStorage.setItem(THEME_KEY, root.classList.contains("bhm-dark") ? "1" : "0"); } catch (error) {} });
    return root;
  }

  function forumChildren(href) {
    return fetch(abs(href), { credentials: "same-origin", redirect: "follow" }).then(function (response) {
      if (!response.ok) throw new Error("forum unavailable");
      return response.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html"), forums = [], topics = [], seen = {};
      function addForum(anchor) {
        var linkHref = abs(anchor.getAttribute("href") || "").split("?")[0], title = cleanTitle(anchor.textContent);
        if (!title || !/^\/(?:c|f)\d+(?:-|$)/i.test(linkHref) || seen[linkHref]) return;
        seen[linkHref] = true;
        var row = rowFor(anchor), topicsEl = row && row.querySelector(".topics,[class*='topics']"), postsEl = row && row.querySelector(".posts,[class*='posts']"), meta = [], topicsCount = numberFrom(topicsEl && topicsEl.textContent), postsCount = numberFrom(postsEl && postsEl.textContent);
        if (topicsCount) meta.push(topicsCount + " sujets"); if (postsCount) meta.push(postsCount + " réponses");
        forums.push({ title: title, meta: meta.join(" · ") || "Rubrique Forumactif", href: linkHref, forumHref: linkHref, icon: /^\/c/i.test(linkHref) ? "C" : "F", kind: "folder", children: [] });
      }
      function addTopic(anchor) {
        var linkHref = abs(anchor.getAttribute("href") || "").split("?")[0], title = cleanTitle(anchor.textContent);
        if (!title || !/\/t\d+(?:-|$)/i.test(linkHref) || seen[linkHref]) return;
        seen[linkHref] = true;
        var row = rowFor(anchor), repliesEl = row && row.querySelector(".posts,[class*='posts']"), viewsEl = row && row.querySelector(".views,[class*='views']"), meta = [], replies = numberFrom(repliesEl && repliesEl.textContent), views = numberFrom(viewsEl && viewsEl.textContent);
        if (replies) meta.push(replies + " rép."); if (views) meta.push(views + " vues");
        topics.push({ title: title, meta: meta.join(" · ") || "Sujet", href: linkHref, topic: true, icon: "▹", kind: "topic" });
      }
      Array.prototype.forEach.call(doc.querySelectorAll("a.forumtitle, a[href*='/f']"), addForum);
      Array.prototype.forEach.call(doc.querySelectorAll("a.topictitle, a[href*='/t']"), function (anchor) { if (!anchor.closest("#comments_scroll_div,.module,.recent-topics,.latest-topics,[id*='recent' i],[class*='recent' i]")) addTopic(anchor); });
      return forums.concat(topics);
    });
  }

  function topicPreview(item, box) {
    box.innerHTML = '<span class="bhm-eyebrow">Aperçu du sujet</span><h2>' + esc(item.title) + '</h2><p>' + esc(item.meta || "Sujet Forumactif") + '</p><div class="bhm-preview-body">Chargement du dernier post…</div>';
    fetch(item.href, { credentials: "same-origin" }).then(function (response) { return response.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html"), posts = Array.prototype.slice.call(doc.querySelectorAll(".postbody,.post-body,.message-body,.content")).filter(function (node) { return text(node.textContent).length > 20; });
      var body = posts.length ? text(posts[posts.length - 1].textContent).slice(0, 900) : "Le sujet est identifié. Ouvre-le pour lire le fil complet.";
      var links = Array.prototype.slice.call(doc.querySelectorAll("a[href]" )).map(function (a) { return a.href; }).filter(function (href) { return /bandcamp\.com/i.test(href); });
      var images = Array.prototype.slice.call(doc.querySelectorAll(".postbody img,.post-body img,.message-body img")).map(function (img) { return img.src; }).filter(function (src) { return /^https?:/i.test(src); }).slice(0, 3);
      var htmlOut = '<span class="bhm-eyebrow">Aperçu du dernier post</span><div class="bhm-preview-body">' + esc(body) + '</div>';
      var embed = links.find(function (href) { return /bandcamp\.com\/EmbeddedPlayer/i.test(href); });
      if (links.length) htmlOut += '<div class="bhm-topic-media"><span class="bhm-topic-media-label">Bandcamp</span>' + (embed ? '<iframe class="bhm-bandcamp-frame" loading="lazy" title="Lecteur Bandcamp" src="' + esc(embed) + '"></iframe>' : '') + '<a class="bhm-action primary" target="_blank" rel="noopener" href="' + esc(links[0]) + '">Ouvrir le lecteur Bandcamp</a></div>';
      if (images.length) htmlOut += '<div class="bhm-topic-media"><span class="bhm-topic-media-label">Image du sujet</span>' + images.map(function (src) { return '<img class="bhm-preview-image" loading="lazy" src="' + esc(src) + '" alt="Image du sujet">'; }).join("") + '</div>';
      htmlOut += '<div class="bhm-actions">' + link(item.href, "Ouvrir le sujet complet", true) + '</div>';
      box.innerHTML = htmlOut;
    }).catch(function () { box.innerHTML = '<span class="bhm-eyebrow">Aperçu</span><p>Le sujet est identifié mais son aperçu n’est pas disponible ici.</p><div class="bhm-actions">' + link(item.href, "Ouvrir le sujet complet", true) + '</div>'; });
  }

  function initFinder(root) {
    var list = root.querySelector("[data-bhm-list]"), preview = root.querySelector("[data-bhm-preview]"), pathEl = root.querySelector("[data-bhm-path]"), status = root.querySelector("[data-bhm-status]");
    var home = { title: "Accueil", children: [FORUMS.meetings, FORUMS.events, FORUMS.sounds, FORUMS.forum] }, stack = [{ title: "Accueil", node: home }];
    function normalize(node) { return (node.children || []).map(function (child) { return typeof child === "string" ? { title: child, href: node.href, icon: "♫", kind: "topic" } : child; }); }
    function hydrate(item, done) {
      if (!item || !item.forumHref || item._loaded) { done(); return; }
      list.innerHTML = '<div class="bhm-preview">Chargement de l’arborescence réelle…</div>';
      forumChildren(item.forumHref).then(function (children) { if (children.length) item.children = children; item._loaded = true; done(); }).catch(function () { item._loaded = true; done(); });
    }
    function render() {
      var current = stack[stack.length - 1], items = normalize(current.node);
      pathEl.innerHTML = stack.map(function (entry, index) { return (index ? '<span aria-hidden="true">›</span>' : '') + '<button type="button" data-bhm-path-index="' + index + '">' + esc(entry.title) + '</button>'; }).join("");
      list.innerHTML = items.length ? items.map(function (item, index) { var hasChildren = item.children && item.children.length; return '<button type="button" class="bhm-row" data-bhm-index="' + index + '"><span class="bhm-row-icon">' + esc(item.icon || (item.topic ? "▹" : "›")) + '</span><span class="bhm-row-copy"><span class="bhm-row-title">' + esc(item.title) + '</span><span class="bhm-row-meta">' + esc(item.meta || (item.topic ? "Sujet" : "Rubrique Forumactif")) + '</span></span><span class="bhm-row-arrow">' + (hasChildren || item.forumHref ? "›" : "↗") + '</span></button>'; }).join("") : '<div class="bhm-preview">Aucun sous-dossier visible à ce niveau.</div>';
      status.textContent = items.length + " entrée" + (items.length > 1 ? "s" : "") + " · arborescence Forumactif";
      preview.hidden = true;
      list.querySelectorAll("[data-bhm-index]").forEach(function (button) { button.addEventListener("click", function () { var item = items[Number(button.getAttribute("data-bhm-index"))]; if (item.topic) { preview.hidden = false; topicPreview(item, preview); return; } if (item.children && item.children.length) { stack.push({ title: item.title, node: item }); render(); root.scrollIntoView({ behavior: "smooth", block: "start" }); hydrate(item, render); return; } if (item.forumHref) { hydrate(item, function () { stack.push({ title: item.title, node: item }); render(); }); return; } preview.hidden = false; preview.innerHTML = '<span class="bhm-eyebrow">Aperçu</span><h2>' + esc(item.title) + '</h2><p>' + esc(item.meta || "Lien Forumactif") + '</p><div class="bhm-actions">' + link(item.href, "Ouvrir", true) + '</div>'; }); });
      pathEl.querySelectorAll("[data-bhm-path-index]").forEach(function (button) { button.addEventListener("click", function () { stack = stack.slice(0, Number(button.getAttribute("data-bhm-path-index")) + 1); render(); }); });
    }
    render();
  }

  function initAgenda(root) {
    var frame = root.querySelector("[data-bhm-agenda]"), controls = root.querySelectorAll("[data-bhm-agenda-view]");
    Array.prototype.forEach.call(controls, function (button) { button.addEventListener("click", function () { var mode = button.getAttribute("data-bhm-agenda-view"); frame.src = AGENDA_BASE + "&mode=" + (mode === "MONTH" ? "MONTH" : "AGENDA"); Array.prototype.forEach.call(controls, function (item) { item.classList.toggle("active", item === button); }); }); });
  }

  function initLatest(root) {
    var target = root.querySelector("[data-bhm-latest]"), source = document.querySelector("#comments_scroll_div");
    var fallbackItems = [
      { href: "/t709-crimesex", title: "Crimesex", detail: "Dernière publication du forum" },
      { href: "/t682-elastic-systems", title: "Elastic Systems", detail: "Dernière publication du forum" },
      { href: "/t681-contacts-de-diffusion", title: "Contacts de diffusion", detail: "Dernière publication du forum" },
      { href: "/t665-urticaria-records", title: "Urticaria records", detail: "Dernière publication du forum" },
      { href: "/t649-appel-a-candidatures-festival-experimance-a-sarrebruck", title: "Appel à candidatures Festival Experimance", detail: "Dernière publication du forum" },
      { href: "/t622-residence-attention-le-tapis-prend-feu-jardin-c", title: "Résidence Attention le Tapis Prend Feu", detail: "Dernière publication du forum" },
      { href: "/t500-clinch-night", title: "Clinch ! Night", detail: "Dernière publication du forum" }
    ];
    function render(items) { if (!items.length) { target.innerHTML = '<div class="bhm-gallery-empty">Aucune publication récente visible.</div>'; return; } target.innerHTML = items.slice(0, 14).map(function (item) { return '<a class="bhm-latest-item" href="' + esc(item.href) + '"><strong>' + esc(item.title) + '</strong><small>' + esc(item.detail || "Publication du forum") + '</small></a>'; }).join(""); startTicker(target); }
    function parse(doc) { var out = [], seen = {}; Array.prototype.forEach.call(doc.querySelectorAll("a[href*='/t']"), function (anchor) { var href = abs(anchor.getAttribute("href") || ""), title = cleanTitle(anchor.textContent); if (!title || !/\/t\d+/.test(href) || seen[href]) return; seen[href] = true; out.push({ href: href, title: title, detail: text(anchor.parentElement && anchor.parentElement.textContent).slice(0, 140) }); }); return out; }
    var local = source ? parse(source) : [];
    if (local.length) render(local); else fetch("/", { credentials: "same-origin" }).then(function (r) { return r.text(); }).then(function (html) {
      var items = parse(new DOMParser().parseFromString(html, "text/html"));
      if (items.length) return items;
      return fetch("/search?search_id=newposts", { credentials: "same-origin" }).then(function (r) { return r.text(); }).then(function (searchHtml) { return parse(new DOMParser().parseFromString(searchHtml, "text/html")); });
    }).then(function (items) { render(items.length ? items : fallbackItems); }).catch(function () { render(fallbackItems); });
  }
  function startTicker(list) { if (list.children.length < 2) return; var paused = false; list.addEventListener("mouseenter", function () { paused = true; }); list.addEventListener("mouseleave", function () { paused = false; }); list.addEventListener("touchstart", function () { paused = true; }, { passive: true }); window.setInterval(function () { if (!paused && list.scrollHeight > list.clientHeight) list.scrollTop = list.scrollTop + 1 >= list.scrollHeight - list.clientHeight ? 0 : list.scrollTop + 1; }, 70); }

  function initGallery(root) {
    var target = root.querySelector("[data-bhm-gallery]");
    function render(items) {
      if (!items.length) { target.innerHTML = '<div class="bhm-gallery-empty">Aucune image publique trouvée.</div>'; return; }
      items = items.slice(0, 24).reverse();
      target.innerHTML = '<div class="bhm-gallery-frame">' + items.map(function (item, index) { return '<a class="' + (index === 0 ? "active" : "") + '" href="' + esc(item.href) + '" title="' + esc(item.alt) + '"><img loading="lazy" src="' + esc(item.url) + '" alt="' + esc(item.alt) + '"></a>'; }).join("") + '</div><div class="bhm-gallery-controls"><span>Galerie</span><input type="range" min="0" max="' + (items.length - 1) + '" value="0" step="1" data-bhm-gallery-slider aria-label="Faire défiler les images"><span data-bhm-gallery-position>1 / ' + items.length + '</span></div>';
      var slides = target.querySelectorAll(".bhm-gallery-frame a"), slider = target.querySelector("[data-bhm-gallery-slider]"), pos = target.querySelector("[data-bhm-gallery-position]"), index = 0, timer;
      function show(next) { index = (next + items.length) % items.length; Array.prototype.forEach.call(slides, function (slide, i) { slide.classList.toggle("active", i === index); }); slider.value = String(index); pos.textContent = (index + 1) + " / " + items.length; }
      function play() { window.clearInterval(timer); timer = window.setInterval(function () { show(index + 1); }, 2600); }
      slider.addEventListener("input", function () { show(Number(slider.value)); play(); }); target.addEventListener("mouseenter", function () { window.clearInterval(timer); }); target.addEventListener("mouseleave", play); show(0); play();
    }
    function collect(doc, fallback) { var seen = {}, out = []; Array.prototype.forEach.call(doc.querySelectorAll("img[src],img[data-src],img[data-original]"), function (img) { var url = img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("src") || ""; if (!/^https?:/i.test(url) || /icon|avatar|smil|emoji|empty/i.test(url) || seen[url]) return; seen[url] = true; var a = img.closest("a[href]"); out.push({ url: url, href: a ? abs(a.getAttribute("href")) : fallback, alt: text(img.alt || "Image partagée") }); }); return out; }
    fetch("/images?json=1&page=0", { credentials: "same-origin" }).then(function (r) { if (!r.ok) throw new Error("gallery"); return r.json(); }).then(function (payload) { var rows = Array.isArray(payload) && Array.isArray(payload[0]) ? payload[0] : payload; render((Array.isArray(rows) ? rows : []).map(function (item) { return { url: item && item.url, href: abs(item && item.topic_url || "/images"), alt: text(item && item.topic_title || "Image partagée") }; }).filter(function (item) { return /^https?:/i.test(item.url || ""); })); }).catch(function () { var local = collect(document, "/images"); if (local.length) render(local); else fetch("/search?search_id=newposts", { credentials: "same-origin" }).then(function (r) { return r.text(); }).then(function (html) { render(collect(new DOMParser().parseFromString(html, "text/html"), "/images")); }).catch(function () { render([]); }); });
  }

  function init() {
    try {
      var root = createShell();
      initAgenda(root); initLatest(root); initGallery(root); initFinder(root);
      window.BlockhausMobileShell = { version: VERSION, root: root };
    } catch (error) {
      var marker = document.createElement("div"); marker.style.cssText = "margin:12px;padding:12px;background:#f4f2ec;color:#171815;border:2px solid #171815;font:14px monospace"; marker.textContent = "Erreur interface mobile : " + (error && error.message ? error.message : error); document.body.insertBefore(marker, document.body.firstChild);
      if (window.console && console.error) console.error("Blockhaus mobile shell", error);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
}());
