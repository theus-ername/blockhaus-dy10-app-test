(function () {
  "use strict";

  var VERSION = "0.1.0-mobile-shell";
  var ROOT_ID = "bh-mobile-shell";
  var STYLE_ID = "bh-mobile-shell-v010-style";
  var preview = window.BLOCKHAUS_MOBILE_PREVIEW === true;
  var params = new URLSearchParams(window.location.search);
  var enabled = preview || params.get("bh_mobile_beta") === "1";
  var isMobileTemplate = !!(document.body && (document.body.id === "mpage-body-modern" || document.querySelector("#tab-bar")));

  if (!enabled || (!isMobileTemplate && !preview) || document.getElementById(ROOT_ID)) return;

  var FORUMS = {
    meetings: { title: "Réunions & décisions", meta: "4 rubriques", href: "/f39-reunions", icon: "★", children: [
      { title: "Ordres du jour", meta: "56 sujets · 375 réponses", href: "/f17-ordres-du-jour", icon: "▦", kind: "folder" },
      { title: "Comptes rendus", meta: "47 sujets · 67 réponses", href: "/f16-comptes-rendus", icon: "▦", kind: "folder" },
      { title: "Sondages et votes", meta: "1 sujet · 4 réponses", href: "/f45-sondages-et-votes", icon: "▦", kind: "folder" },
      { title: "30 ans Blockhaus DY10", meta: "5 sujets · 11 réponses", href: "/f46-30-ans-blockhaus-dy10", icon: "▦", kind: "folder" }
    ] },
    events: { title: "Événements", meta: "Agenda et événements", href: "/calendar", icon: "◷", children: [
      { title: "Agenda Google", meta: "Vue principale", href: "/h1-google-agenda", icon: "▦", kind: "link" },
      { title: "Événements du forum", meta: "Calendrier Forumactif", href: "/calendar", icon: "◷", kind: "link" }
    ] },
    sounds: { title: "Archives son", meta: "Sons et liens publics", href: "/f27-the-sounds-of-the-blockhaus-dy10", icon: "♫", children: [
      { title: "The Sounds", meta: "33 sujets · archives artistes", href: "/f27-the-sounds-of-the-blockhaus-dy10", icon: "♫", kind: "folder", children: [
        "Aalpes", "Aneth Penny", "Crimesex", "DCIM", "DY10 ORCHESTRA", "Elastic Systems", "Eva Durand", "Extreme Shoegaze", "France Reverb", "Ground", "Jencks", "Kosmos Natur Furor", "Nerfs", "OBC", "Omnisphynx", "Peninsula", "Phil Tremble", "Ravadiscs", "Robonom", "Rocade", "Set/30’", "Spacemec", "Struwwelpetra", "Subutex Social Club", "The Shy Accident", "TX", "Undertakeaway", "Urticaria records"
      ] },
      { title: "52 x Set/30’", meta: "Archives par année", href: "/f37-52-x-set-30-archives", icon: "♫", kind: "folder" },
      { title: "Collège son", meta: "51 sujets · 178 réponses", href: "/f4-college-son", icon: "♫", kind: "folder" }
    ] },
    forum: { title: "Forum complet", meta: "Arborescence Forumactif", href: "/c1-dy10", icon: "⌘", children: [] }
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>\"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#" + ROOT_ID + "{--bg:#98948b;--paper:#f4f2ec;--ink:#171815;--deep:#5f5d55;--line:#77736a;--muted:#504e48;box-sizing:border-box;display:block;margin:0;background:var(--bg);color:var(--ink);font:15px/1.4 Arial,sans-serif}",
      "#" + ROOT_ID + " *{box-sizing:border-box}",
      "#" + ROOT_ID + " a{color:inherit;text-decoration:none}",
      "#" + ROOT_ID + " .bhm-head{position:sticky;top:0;z-index:8;display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--ink);color:var(--paper);box-shadow:0 2px 0 #0003}",
      "#" + ROOT_ID + " .bhm-menu{position:relative;flex:none}",
      "#" + ROOT_ID + " .bhm-menu summary{display:grid;place-items:center;width:40px;height:40px;border:1px solid var(--paper);font-size:21px;cursor:pointer;list-style:none}",
      "#" + ROOT_ID + " .bhm-menu summary::-webkit-details-marker{display:none}",
      "#" + ROOT_ID + " .bhm-menu-panel{position:absolute;top:46px;left:0;width:min(280px,calc(100vw - 24px));padding:6px;background:var(--paper);color:var(--ink);border:2px solid var(--ink);box-shadow:4px 4px 0 var(--ink)}",
      "#" + ROOT_ID + " .bhm-menu-panel a{display:block;padding:11px 9px;border-bottom:1px solid #c8c3ba;font-weight:800}",
      "#" + ROOT_ID + " .bhm-menu-panel a:last-child{border-bottom:0}",
      "#" + ROOT_ID + " .bhm-brand{min-width:0;flex:1}",
      "#" + ROOT_ID + " .bhm-brand strong{display:block;font-size:17px;letter-spacing:.02em}",
      "#" + ROOT_ID + " .bhm-brand small{display:block;color:#d8d2c7;font-size:11px}",
      "#" + ROOT_ID + " .bhm-beta{font:900 10px/1 monospace;color:#d8d2c7;white-space:nowrap}",
      "#" + ROOT_ID + " .bhm-main{padding:10px 10px 22px}",
      "#" + ROOT_ID + " .bhm-card{margin:0 0 10px;padding:14px;background:var(--paper);border:1px solid var(--line)}",
      "#" + ROOT_ID + " .bhm-card h1,#" + ROOT_ID + " .bhm-card h2{margin:0 0 8px;font-size:20px;line-height:1.15}",
      "#" + ROOT_ID + " .bhm-eyebrow{display:block;margin-bottom:6px;color:var(--muted);font:900 10px/1 monospace;letter-spacing:.08em;text-transform:uppercase}",
      "#" + ROOT_ID + " .bhm-summary{margin:0;color:#36352f;font-size:13px;line-height:1.45}",
      "#" + ROOT_ID + " .bhm-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}",
      "#" + ROOT_ID + " .bhm-action{display:inline-flex;align-items:center;min-height:38px;padding:8px 10px;background:transparent;border:1px solid var(--ink);font-size:12px;font-weight:900}",
      "#" + ROOT_ID + " .bhm-action.primary{background:var(--ink);color:var(--paper)}",
      "#" + ROOT_ID + " .bhm-finder{padding:0;overflow:hidden}",
      "#" + ROOT_ID + " .bhm-finder-head{padding:14px;background:var(--deep);color:var(--paper)}",
      "#" + ROOT_ID + " .bhm-finder-head h2{margin:0;font-size:20px}",
      "#" + ROOT_ID + " .bhm-path{display:flex;gap:4px;overflow:auto;margin-top:7px;color:#e4dfd5;font:700 11px/1.3 monospace;white-space:nowrap}",
      "#" + ROOT_ID + " .bhm-path button{border:0;background:none;color:inherit;padding:0;text-decoration:underline;cursor:pointer}",
      "#" + ROOT_ID + " .bhm-list{padding:6px;background:var(--bg)}",
      "#" + ROOT_ID + " .bhm-row{display:flex;align-items:center;gap:10px;width:100%;min-height:56px;padding:9px 8px;border:0;border-bottom:1px solid #b3aea4;background:transparent;color:var(--ink);text-align:left;cursor:pointer}",
      "#" + ROOT_ID + " .bhm-row:focus,#" + ROOT_ID + " .bhm-row:hover{background:var(--paper);outline:0}",
      "#" + ROOT_ID + " .bhm-row-icon{display:grid;place-items:center;width:30px;height:30px;flex:none;border:1px solid currentColor;font-weight:900}",
      "#" + ROOT_ID + " .bhm-row-copy{min-width:0;flex:1}",
      "#" + ROOT_ID + " .bhm-row-title{display:block;font-weight:900;overflow-wrap:anywhere}",
      "#" + ROOT_ID + " .bhm-row-meta{display:block;margin-top:2px;color:var(--muted);font:11px/1.25 monospace}",
      "#" + ROOT_ID + " .bhm-row-arrow{font:900 20px/1 monospace}",
      "#" + ROOT_ID + " .bhm-preview{padding:14px;background:var(--paper);border-top:1px solid var(--line)}",
      "#" + ROOT_ID + " .bhm-preview p{margin:0 0 9px;color:#36352f}",
      "#" + ROOT_ID + " .bhm-status{margin-top:10px;color:var(--muted);font:11px/1.35 monospace}",
      "#" + ROOT_ID + " .bhm-note{padding:11px 12px;color:#ebe5da;background:var(--deep);font-size:12px}",
      (!preview ? "@media(min-width:701px){#" + ROOT_ID + "{display:none!important}}" : ""),
      "@media(max-width:700px){body{overflow-x:hidden!important}#" + ROOT_ID + " .bhm-main{padding-bottom:88px}body#mpage-body-modern #" + ROOT_ID + "~#tab-bar{display:flex!important}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function findMain() {
    return document.querySelector("#main-content, #content, main, #main") || document.body;
  }

  function link(href, label) {
    return '<a class="bhm-action" href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>';
  }

  function normalizeChildren(node) {
    return (node.children || []).map(function (child) {
      if (typeof child === "string") return { title: child, meta: "Sujet artiste", href: node.href, icon: "♫", kind: "topic" };
      return child;
    });
  }

  function createShell() {
    addStyle();
    var main = findMain();
    var root = document.createElement("section");
    root.id = ROOT_ID;
    root.setAttribute("aria-label", "Interface mobile Blockhaus");
    root.innerHTML = '<header class="bhm-head"><details class="bhm-menu"><summary aria-label="Ouvrir le menu">☰</summary><div class="bhm-menu-panel">' +
      link("/", "Accueil") + link("/calendar", "Événements") + link("/h1-google-agenda", "Agenda") + link("/memberlist", "Membres") + link("/profile", "Mon profil") + link("/privmsg", "Messages privés") + link("/login?logout=1", "Se déconnecter") +
      '</div></details><div class="bhm-brand"><strong>Blockhaus-DY10</strong><small>le forum du DY10</small></div><span class="bhm-beta">BÊTA MOBILE</span></header>' +
      '<main class="bhm-main"><section class="bhm-card"><span class="bhm-eyebrow">01 / résumé du dernier CR</span><h1>Ce qui se décide</h1><p class="bhm-summary">Nouveaux membres · captation et archives · programmation octobre–février · soirées LGBT+ · migration Messenger · K-Haus · espace couture.</p><div class="bhm-actions">' + link("/f39-reunions", "Réunions") + link("/f17-ordres-du-jour", "Dernier ODJ") + link("/f16-comptes-rendus", "Dernier CR") + '</div></section>' +
      '<section class="bhm-card"><span class="bhm-eyebrow">02 / à venir</span><h2>Agenda & événements</h2><p class="bhm-summary">Accéder rapidement à l’agenda partagé et aux événements du forum.</p><div class="bhm-actions">' + link("/h1-google-agenda", "Agenda Google") + link("/calendar", "Événements") + '</div></section>' +
      '<section class="bhm-card"><span class="bhm-eyebrow">03 / activité</span><h2>Dernières publications</h2><p class="bhm-summary">Une seule colonne, lisible sur téléphone. Le fil complet reste dans Forumactif.</p><div class="bhm-note">Le flux détaillé et la galerie seront branchés à l’étape suivante.</div></section>' +
      '<section class="bhm-card bhm-finder"><div class="bhm-finder-head"><h2>Explorer le forum</h2><div class="bhm-path" data-bhm-path></div></div><div class="bhm-list" data-bhm-list></div><div class="bhm-preview" data-bhm-preview hidden></div><div class="bhm-status" data-bhm-status></div></section></main>';
    if (main === document.body) document.body.insertBefore(root, document.body.firstChild);
    else main.insertBefore(root, main.firstChild);
    if (preview) {
      var legacyHeader = document.querySelector("#mwrap > #header");
      if (legacyHeader) legacyHeader.hidden = true;
      Array.prototype.forEach.call(main.children, function (child) {
        if (child !== root) child.hidden = true;
      });
    }
    return root;
  }

  function initFinder(root) {
    var list = root.querySelector("[data-bhm-list]");
    var preview = root.querySelector("[data-bhm-preview]");
    var pathEl = root.querySelector("[data-bhm-path]");
    var status = root.querySelector("[data-bhm-status]");
    var stack = [{ title: "Accueil", node: { children: [
      { title: "À lire", meta: "Favoris et accès rapides", href: "/", icon: "•", kind: "folder", children: [FORUMS.meetings, FORUMS.events, FORUMS.sounds] },
      FORUMS.meetings, FORUMS.events, FORUMS.sounds, FORUMS.forum
    ] } }];

    function render() {
      var current = stack[stack.length - 1];
      var items = normalizeChildren(current.node);
      pathEl.innerHTML = stack.map(function (entry, index) {
        return (index ? '<span aria-hidden="true">›</span>' : '') + '<button type="button" data-bhm-path-index="' + index + '">' + escapeHtml(entry.title) + '</button>';
      }).join("");
      list.innerHTML = items.length ? items.map(function (item, index) {
        var hasChildren = item.children && item.children.length;
        return '<button type="button" class="bhm-row" data-bhm-index="' + index + '"><span class="bhm-row-icon">' + escapeHtml(item.icon || "›") + '</span><span class="bhm-row-copy"><span class="bhm-row-title">' + escapeHtml(item.title) + '</span><span class="bhm-row-meta">' + escapeHtml(item.meta || "Forumactif") + '</span></span><span class="bhm-row-arrow">' + (hasChildren ? "›" : "↗") + '</span></button>';
      }).join("") : '<div class="bhm-preview">Aucun sous-dossier visible à ce niveau.</div>';
      status.textContent = items.length + " entrée" + (items.length > 1 ? "s" : "") + " · données Forumactif";
      preview.hidden = true;
      list.querySelectorAll("[data-bhm-index]").forEach(function (button) {
        button.addEventListener("click", function () {
          var item = items[Number(button.getAttribute("data-bhm-index"))];
          if (item.children && item.children.length) {
            stack.push({ title: item.title, node: item });
            window.history.pushState({ bhMobilePath: stack.map(function (entry) { return entry.title; }) }, "", window.location.pathname + "?bh_mobile_beta=1&bh_path=" + encodeURIComponent(stack.map(function (entry) { return entry.title; }).join("/")));
            render();
            root.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            preview.hidden = false;
            preview.innerHTML = '<span class="bhm-eyebrow">Aperçu</span><h2>' + escapeHtml(item.title) + '</h2><p>' + escapeHtml(item.meta || "Sujet Forumactif") + '</p><div class="bhm-actions"><a class="bhm-action primary" href="' + escapeHtml(item.href) + '">Ouvrir dans le forum</a></div>';
          }
        });
      });
      pathEl.querySelectorAll("[data-bhm-path-index]").forEach(function (button) {
        button.addEventListener("click", function () {
          stack = stack.slice(0, Number(button.getAttribute("data-bhm-path-index")) + 1);
          render();
        });
      });
    }
    window.addEventListener("popstate", function () { if (stack.length > 1) stack.pop(); render(); });
    render();
  }

  function init() {
    try {
      var root = createShell();
      initFinder(root);
      window.BlockhausMobileShell = { version: VERSION, root: root };
    } catch (error) {
      var marker = document.createElement("div");
      marker.style.cssText = "margin:12px;padding:12px;background:#f4f2ec;color:#171815;border:2px solid #171815;font:14px monospace";
      marker.textContent = "Erreur interface mobile : " + (error && error.message ? error.message : error);
      document.body.insertBefore(marker, document.body.firstChild);
      if (window.console && console.error) console.error("Blockhaus mobile shell", error);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}());
