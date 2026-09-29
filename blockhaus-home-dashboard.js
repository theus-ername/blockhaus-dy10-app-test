(function () {
  "use strict";

  var VERSION = "10.5";
  var ROOT_ID = "bh-member-dashboard";
  var STYLE_ID = "bh-member-dashboard-v10-5-style";
  var BETA_NAV_ID = "bh-dashboard-beta-nav";
  var SITE_MENU_ID = "bh-forum-site-menu";
  var BETA_STORAGE_KEY = "bh_dashboard_beta_v1";
  var ORG_STORAGE_KEY = "bh_dashboard_finder_org_v1";
  var WIDE_STORAGE_KEY = "bh_dashboard_finder_wide_v1";
  var AGENDA_PATH = "/h1-google-agenda";
  var AGENDA_EMBED = "https://calendar.google.com/calendar/embed?src=4o90q8lq7lv50fh0o03c3mma9o%40group.calendar.google.com&ctz=Europe%2FParis&mode=AGENDA&showTitle=0&showNav=1&showTabs=0&showCalendars=0&wkst=2";

  // A fresh V8 may replace an older cached loader, while later V7 copies are
  // still locked out. This makes Forumactif's async script order harmless.
  if (window.BLOCKHAUS_HOME_DASHBOARD_DISABLED === true && window.BlockhausHomeDashboard && Number(window.BlockhausHomeDashboard.version || 0) >= Number(VERSION)) return;
  if (window.BlockhausHomeDashboard && Number(window.BlockhausHomeDashboard.version || 0) >= Number(VERSION)) return;
  window.BLOCKHAUS_HOME_DASHBOARD_DISABLED = true;

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
      "#" + ROOT_ID + " .bh-dash-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 18px;background:var(--bh-ink);color:var(--bh-paper);border-bottom:5px solid var(--bh-concrete)}",
      "#" + ROOT_ID + " .bh-top-menu{position:relative;flex:0 0 auto;order:-1}",
      "#" + ROOT_ID + " .bh-top-menu summary{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:8px 10px;border:1px solid #d8d2c7;color:var(--bh-paper);cursor:pointer;font:900 11px/1 monospace;list-style:none;text-transform:uppercase}",
      "#" + ROOT_ID + " .bh-top-menu summary::-webkit-details-marker{display:none}",
      "#" + ROOT_ID + " .bh-top-menu summary:before{content:'☰';font-size:15px}",
      "#" + ROOT_ID + " .bh-top-menu[open] summary{background:var(--bh-paper);color:var(--bh-ink)}",
      "#" + ROOT_ID + " .bh-top-menu-panel{position:absolute;z-index:20;top:calc(100% + 6px);left:0;width:min(290px,calc(100vw - 28px));padding:8px;background:var(--bh-paper);border:2px solid var(--bh-ink);box-shadow:5px 5px 0 var(--bh-ink);color:var(--bh-ink)}",
      "#" + ROOT_ID + " .bh-top-menu-title{display:block;padding:7px 8px 9px;border-bottom:1px solid var(--bh-line);font:900 12px/1.2 Arial,sans-serif;text-transform:none}",
      "#" + ROOT_ID + " .bh-top-menu-panel a{display:block;padding:9px 8px;border-bottom:1px solid #d0cbc1;font-size:12px;font-weight:800}",
      "#" + ROOT_ID + " .bh-top-menu-panel a:last-child{border-bottom:0}",
      "#" + ROOT_ID + " .bh-top-menu-panel a:hover,#" + ROOT_ID + " .bh-top-menu-panel a:focus{background:var(--bh-ink);color:var(--bh-paper);outline:0}",
      "body[data-bh-beta-layout='true'] #page-header{position:relative}",
      "body[data-bh-beta-layout='true'] #page-header #logo-desc #site-title,body[data-bh-beta-layout='true'] #page-header #logo-desc p{display:none!important}",
      "#" + SITE_MENU_ID + "{display:block;position:relative;z-index:40;margin:0;padding:4px 12px;background:#928e85;border-bottom:1px solid #141513;font-family:Arial,sans-serif;text-align:right}",
      "#" + SITE_MENU_ID + " summary{display:inline-flex;align-items:center;gap:10px;min-height:40px;padding:7px 12px;border:2px solid #141513;background:#141513;color:#f4f2ec;cursor:pointer;list-style:none;font:900 12px/1.1 Arial,sans-serif}",
      "#" + SITE_MENU_ID + " summary::-webkit-details-marker{display:none}",
      "#" + SITE_MENU_ID + " summary:before{content:'☰';font-size:17px;line-height:1}",
      "#" + SITE_MENU_ID + " summary[aria-expanded='true'],#" + SITE_MENU_ID + "[open] summary{background:#f4f2ec;color:#141513}",
      "#" + SITE_MENU_ID + " .bh-site-menu-title{display:flex;flex-direction:column;gap:2px;text-align:left}",
      "#" + SITE_MENU_ID + " .bh-site-menu-title strong{font-size:12px;letter-spacing:.02em}",
      "#" + SITE_MENU_ID + " .bh-site-menu-title small{font:700 10px/1.1 Arial,sans-serif;opacity:.8}",
      "#" + SITE_MENU_ID + " .bh-site-menu-panel{position:absolute;top:calc(100% + 5px);right:12px;width:min(300px,calc(100vw - 24px));padding:8px;background:#f4f2ec;border:2px solid #141513;box-shadow:5px 5px 0 #141513;color:#141513;text-align:left}",
      "#" + SITE_MENU_ID + " .bh-site-menu-panel a{display:block;padding:9px 8px;border-bottom:1px solid #c8c3ba;color:#141513;text-decoration:none;font-size:12px;font-weight:800}",
      "#" + SITE_MENU_ID + " .bh-site-menu-panel a:last-child{border-bottom:0}",
      "#" + SITE_MENU_ID + " .bh-site-menu-panel a:hover,#" + SITE_MENU_ID + " .bh-site-menu-panel a:focus{background:#141513;color:#f4f2ec;outline:0}",
      "body[data-bh-beta-layout='true'] .navbar{display:none!important}",
      "#" + ROOT_ID + " .bh-brand{display:flex;align-items:center;gap:12px;min-width:0}",
      "#" + ROOT_ID + " .bh-brand-logo{width:48px;height:48px;object-fit:cover;border:1px solid #d8d2c7;background:#000;flex:0 0 auto}",
      "#" + ROOT_ID + " .bh-dash-kicker{display:block;margin-bottom:5px;font:800 11px/1 monospace;letter-spacing:.12em;text-transform:uppercase;color:#d8d2c7}",
      "#" + ROOT_ID + " h1{margin:0!important;padding:0!important;font-size:clamp(24px,4vw,42px)!important;line-height:.98!important;color:var(--bh-paper)!important;text-transform:uppercase;letter-spacing:.01em}",
      "#" + ROOT_ID + " .bh-version{font:700 10px/1 monospace;color:#d8d2c7}",
      "#" + ROOT_ID + " .bh-priority-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-left:1px solid var(--bh-line);background:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-priority-grid{grid-template-columns:minmax(0,1fr) minmax(270px,1.15fr) minmax(0,1fr)}",
      "#" + ROOT_ID + " .bh-card{min-width:0;padding:18px;border-right:1px solid var(--bh-line);border-bottom:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-card-number{display:block;margin-bottom:15px;font:900 12px/1 monospace;color:#615f58}",
      "#" + ROOT_ID + " .bh-card h2{margin:0 0 8px!important;padding:0!important;font-size:18px!important;line-height:1.1!important;color:var(--bh-ink)!important}",
      "#" + ROOT_ID + " .bh-card p{min-height:34px;margin:0 0 12px;color:#514f49;font-size:13px;line-height:1.35}",
      "#" + ROOT_ID + " .bh-card-media{margin:10px 0 12px;padding-top:9px;border-top:1px solid #b3aea4}",
      "#" + ROOT_ID + " .bh-card-media-label{display:block;margin-bottom:7px;font:900 10px/1 monospace;text-transform:uppercase;color:#615f58}",
      "#" + ROOT_ID + " .bh-card-media-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;max-height:340px;overflow:auto;scrollbar-color:var(--bh-ink) #d8d2c7}",
      "#" + ROOT_ID + " .bh-card-media-grid a{display:block;min-height:48px;background:#d8d2c7;border:1px solid #817d74;overflow:hidden}",
      "#" + ROOT_ID + " .bh-card-media-grid img{display:block;width:100%;height:58px;object-fit:cover}",
      "#" + ROOT_ID + " .bh-activity-card .bh-card-media{margin-top:14px;padding-top:0;border-top:0}",
      "#" + ROOT_ID + " .bh-activity-card .bh-card-media-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;max-height:340px;overflow-y:auto;align-content:start}",
      "#" + ROOT_ID + " .bh-activity-card .bh-card-media-grid a{min-height:150px}",
      "#" + ROOT_ID + " .bh-activity-card .bh-card-media-grid img{height:150px;object-fit:cover}",
      "#" + ROOT_ID + " .bh-media-loading{padding:18px 0;color:#615f58;font:700 11px/1.4 monospace}",
      "#" + ROOT_ID + " .bh-card-media-empty{font-size:11px;color:#5d5a53}",
      "#" + ROOT_ID + " .bh-cr-card{min-height:420px}",
      "#" + ROOT_ID + " .bh-cr-card h2{font-size:28px!important;line-height:1.08!important}",
      "#" + ROOT_ID + " .bh-cr-summary{max-height:none;margin:14px 0 12px;padding-left:24px;overflow:visible;color:#3f3e39;font-size:17px;line-height:1.5}",
      "#" + ROOT_ID + " .bh-cr-summary li{margin:0 0 11px}",
      "#" + ROOT_ID + " .bh-actions{display:flex;flex-wrap:wrap;gap:7px}",
      "#" + ROOT_ID + " .bh-action{display:inline-flex;align-items:center;min-height:38px;padding:8px 10px;border:1px solid var(--bh-ink);background:transparent;font-weight:800;font-size:12px}",
      "#" + ROOT_ID + " .bh-action.primary{background:var(--bh-ink);color:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-action:hover,#" + ROOT_ID + " .bh-action:focus{background:var(--bh-concrete);color:var(--bh-ink);outline:2px solid var(--bh-ink);outline-offset:1px}",
      "#" + ROOT_ID + " .bh-latest{display:grid;grid-template-columns:190px minmax(0,1fr);border-top:1px solid var(--bh-line);border-bottom:1px solid var(--bh-line);background:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-latest-head{padding:12px 18px 8px;border-right:0;background:transparent}",
      "#" + ROOT_ID + " .bh-latest-head h2{margin:0 0 7px!important;padding:0!important;font-size:18px!important;line-height:1.05!important;color:var(--bh-ink)!important}",
      "#" + ROOT_ID + " .bh-latest-head p{margin:0;color:#514f49;font-size:12px;line-height:1.35}",
      "#" + ROOT_ID + " .bh-latest-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;max-height:170px;overflow:auto;background:transparent;scrollbar-color:var(--bh-ink) #d8d2c7}",
      "#" + ROOT_ID + " .bh-latest-item{display:block;min-height:76px;padding:11px 13px;background:var(--bh-paper);border-bottom:1px solid #c1bcb2;color:var(--bh-ink)}",
      "#" + ROOT_ID + " .bh-latest-item:hover,#" + ROOT_ID + " .bh-latest-item:focus{background:#fff;outline:2px solid var(--bh-ink);outline-offset:-2px}",
      "#" + ROOT_ID + " .bh-latest-item strong{display:block;margin-bottom:5px;font-size:13px;line-height:1.15}",
      "#" + ROOT_ID + " .bh-latest-item small{display:block;color:#5d5a53;font:700 10px/1.3 monospace}",
      "#" + ROOT_ID + " .bh-latest-empty{padding:18px;color:#514f49;font-size:12px}",
      "#" + ROOT_ID + " .bh-utility-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);align-items:stretch;border-top:1px solid var(--bh-line);border-bottom:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-latest{display:flex;flex-direction:column;min-width:0;border-top:0;border-bottom:0}",
      "#" + ROOT_ID + " .bh-latest-head{border-right:0;border-bottom:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-latest-list{display:flex;flex-direction:column;gap:1px;flex:1;min-height:260px;max-height:380px;overflow-y:auto;overflow-x:hidden}",
      "#" + ROOT_ID + " .bh-latest-item{flex:0 0 auto;min-height:62px;border-bottom:1px solid #c1bcb2}",
      "#" + ROOT_ID + " .bh-latest-priority{background:var(--bh-paper);border-right:1px solid var(--bh-line);border-bottom:1px solid var(--bh-line)}",
      "#" + ROOT_ID + " .bh-latest-priority .bh-latest-head{padding:12px 18px 8px;border-bottom:0}",
      "#" + ROOT_ID + " .bh-latest-priority .bh-latest-list{min-height:0;max-height:205px}",
      "#" + ROOT_ID + " .bh-cr-card{background:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-agenda{display:grid;grid-template-columns:1fr;min-width:0;background:var(--bh-deep);color:var(--bh-paper);border:0}",
      "#" + ROOT_ID + " .bh-agenda-copy{padding:16px 18px;border-right:0;border-bottom:1px solid var(--bh-line)}",
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
      "#" + ROOT_ID + " .bh-forum-browser{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.05fr) minmax(360px,1.35fr) minmax(340px,1.1fr);height:560px;background:var(--bh-concrete);border:2px solid var(--bh-ink);border-top:0}",
      "#" + ROOT_ID + " .bh-forum-browser.bh-wide{min-width:1420px;grid-template-columns:minmax(270px,1fr) minmax(340px,1.2fr) minmax(470px,1.55fr) minmax(430px,1.25fr)}",
      "#" + ROOT_ID + " .bh-col{min-width:0;overflow:hidden;border-right:1px solid var(--bh-ink);background:rgba(244,242,236,.28)}",
      "#" + ROOT_ID + " .bh-col:last-child{border-right:0}",
      "#" + ROOT_ID + " .bh-col-title{display:flex;align-items:center;min-height:40px;padding:10px 12px;border-bottom:1px solid var(--bh-ink);background:rgba(20,21,19,.88);color:var(--bh-paper);font:900 12px/1 monospace;text-transform:uppercase}",
      "#" + ROOT_ID + " .bh-list{display:flex;flex-direction:column;height:calc(100% - 40px);overflow-y:auto;padding:8px 7px;gap:4px;scrollbar-color:var(--bh-ink) var(--bh-concrete)}",
      "#" + ROOT_ID + " .bh-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:start;gap:8px;min-height:44px;padding:9px;border:1px solid transparent;color:var(--bh-ink);font-weight:800}",
      "#" + ROOT_ID + " .bh-row:hover,#" + ROOT_ID + " .bh-row:focus{border-color:var(--bh-ink);background:var(--bh-paper);outline:0}",
      "#" + ROOT_ID + " .bh-row.active{background:var(--bh-ink);color:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-row[data-bh-folder]{cursor:pointer}",
      "#" + ROOT_ID + " .bh-row .bh-chevron{justify-self:end;font:900 14px/1 monospace}",
      "#" + ROOT_ID + " .bh-row-icon{width:20px;text-align:center;font:900 15px/1 monospace}",
      "#" + ROOT_ID + " .bh-row-main{min-width:0;overflow-wrap:anywhere;white-space:normal;font-size:13px;line-height:1.22}",
      "#" + ROOT_ID + " .bh-status{justify-self:end;padding:3px 5px;border:1px solid currentColor;font:900 9px/1 monospace;text-transform:uppercase;white-space:nowrap}",
      "#" + ROOT_ID + " .bh-preview{height:calc(100% - 40px);overflow-y:auto;padding:18px;background:rgba(244,242,236,.42)}",
      "#" + ROOT_ID + " .bh-preview h2{margin:0 0 8px!important;padding:0!important;color:var(--bh-ink)!important;font-size:21px!important;line-height:1.15!important}",
      "#" + ROOT_ID + " .bh-preview p{margin:0 0 14px;color:#30312d;line-height:1.42}",
      "#" + ROOT_ID + " .bh-preview-meta{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0 18px}",
      "#" + ROOT_ID + " .bh-preview-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}",
      "#" + ROOT_ID + " .bh-column-toolbar{display:flex;align-items:center;gap:6px;padding:7px;border-bottom:1px solid var(--bh-ink);background:#d8d2c7}",
      "#" + ROOT_ID + " .bh-column-brand{font:900 10px/1 monospace;letter-spacing:.08em;color:#3f3e39;margin-right:5px;white-space:nowrap}",
      "#" + ROOT_ID + " .bh-column-toolbar button{border:1px solid var(--bh-ink);background:var(--bh-paper);color:var(--bh-ink);font:900 12px/1 monospace;padding:6px 8px;cursor:pointer}",
      "#" + ROOT_ID + " .bh-column-toolbar button[data-bh-wide-toggle].active{background:var(--bh-ink);color:var(--bh-paper)}",
      "#" + ROOT_ID + " .bh-column-toolbar button:disabled{opacity:.4;cursor:default}",
      "#" + ROOT_ID + " .bh-column-path{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:700 11px/1 monospace;color:#3f3e39}",
      "#" + ROOT_ID + " .bh-column-info{font:700 10px/1 monospace;color:#5d5a53;white-space:nowrap}",
      "#" + ROOT_ID + " .bh-column-scroll{overflow-x:auto;overflow-y:hidden;scroll-behavior:auto;scroll-snap-type:none;scrollbar-width:auto;scrollbar-color:var(--bh-ink) var(--bh-concrete);padding-bottom:4px}",
      "#" + ROOT_ID + " .bh-column-scroll::-webkit-scrollbar{height:14px}",
      "#" + ROOT_ID + " .bh-column-scroll::-webkit-scrollbar-track{background:var(--bh-concrete);border-top:1px solid var(--bh-ink)}",
      "#" + ROOT_ID + " .bh-column-scroll::-webkit-scrollbar-thumb{background:var(--bh-ink);border:3px solid var(--bh-concrete)}",
      "#" + ROOT_ID + " .bh-column-scroll .bh-forum-browser{min-width:980px}",
      "#" + ROOT_ID + " .bh-column-scroll .bh-col{scroll-snap-align:start}",
      "#" + ROOT_ID + " .bh-finder-bottom{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:9px 12px;border:2px solid var(--bh-ink);border-top:0;background:#d8d2c7;font:800 10px/1 monospace;text-transform:uppercase}",
      "#" + ROOT_ID + " .bh-finder-bottom input{width:100%;accent-color:var(--bh-ink);cursor:pointer}",
      "#" + ROOT_ID + " .bh-node{width:100%;display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:start;gap:8px;min-height:44px;padding:9px;border:1px solid transparent;background:transparent;text-align:left;color:var(--bh-ink);font-weight:800;cursor:pointer}",
      "#" + ROOT_ID + " .bh-node:hover,#" + ROOT_ID + " .bh-node:focus,#" + ROOT_ID + " .bh-node.active{border-color:var(--bh-ink);background:var(--bh-paper);outline:0}",
      "#" + ROOT_ID + " .bh-node.active .bh-node-meta{color:var(--bh-ink)}",
      "#" + ROOT_ID + " .bh-bandcamp-note{margin-top:10px;color:#5d5a53;font-size:11px;line-height:1.35}",
      "#" + ROOT_ID + " .bh-status-left{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid currentColor;font:900 12px/1 monospace}",
      "#" + ROOT_ID + " .bh-node-meta{justify-self:end;color:#5d5a53;font:700 10px/1.15 monospace;white-space:normal;text-align:right}",
      "#" + ROOT_ID + " .bh-node .bh-status{display:none}",
      "#" + ROOT_ID + " .bh-topic-stats{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 14px}",
      "#" + ROOT_ID + " .bh-topic-stat{display:inline-flex;padding:5px 7px;border:1px solid #817d74;background:#d8d2c7;font:800 10px/1 monospace;text-transform:uppercase}",
      "#" + ROOT_ID + " .bh-topic-preview{margin:14px 0;padding:12px;border-left:4px solid var(--bh-ink);background:rgba(244,242,236,.62)}",
      "#" + ROOT_ID + " .bh-topic-preview-label{display:block;margin-bottom:7px;font:900 10px/1 monospace;text-transform:uppercase;color:#5d5a53}",
      "#" + ROOT_ID + " .bh-topic-excerpt{font-size:13px;line-height:1.45;color:#30312d;white-space:pre-line}",
      "#" + ROOT_ID + " .bh-topic-author{display:block;margin-top:9px;font:700 10px/1 monospace;color:#5d5a53}",
      "#" + ROOT_ID + " .bh-topic-media{display:grid;gap:8px;margin:12px 0}",
      "#" + ROOT_ID + " .bh-topic-media-label{font:900 10px/1 monospace;text-transform:uppercase;color:#5d5a53}",
      "#" + ROOT_ID + " .bh-topic-bandcamp{display:flex;align-items:center;gap:8px;padding:9px 10px;background:#d8d2c7;border:1px solid #817d74;font-size:12px;font-weight:800}",
      "#" + ROOT_ID + " .bh-topic-bandcamp:before{content:'♫';font-size:18px}",
      "#" + ROOT_ID + " .bh-topic-player{width:100%;max-width:100%;overflow:auto;border:1px solid var(--bh-ink);background:#000}",
      "#" + ROOT_ID + " .bh-topic-embed{display:block;width:100%;min-width:300px;height:430px;border:0;background:#000}",
      "#" + ROOT_ID + " .bh-topic-images{display:flex;flex-wrap:wrap;gap:7px}",
      "#" + ROOT_ID + " .bh-topic-image{width:92px;height:70px;object-fit:cover;border:1px solid #817d74;background:#d8d2c7}",
      "#" + ROOT_ID + " .bh-admin-tools{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:14px 0;padding:10px;border:1px dashed #817d74;background:#e1ddd5}",
      "#" + ROOT_ID + " .bh-admin-tools small{flex:1 1 100%;font:800 10px/1.3 monospace;text-transform:uppercase;color:#5d5a53}",
      "#" + ROOT_ID + " .bh-admin-tools button{padding:6px 8px;border:1px solid var(--bh-ink);background:var(--bh-paper);font:800 11px/1 monospace;cursor:pointer}",
      "#" + ROOT_ID + " .bh-admin-tools button:hover,#" + ROOT_ID + " .bh-admin-tools button:focus{background:var(--bh-ink);color:var(--bh-paper)}",
      "a.mainmenu[data-bh-agenda-link='true']{display:inline-flex!important;align-items:center;gap:5px;font-weight:800!important}",
      "a.mainmenu[data-bh-agenda-link='true']:before{content:'▦';font:900 14px/1 monospace}",
      "#" + BETA_NAV_ID + " .bh-beta-toggle{display:inline-flex!important;align-items:center;gap:5px;padding:4px 7px!important;border:1px solid currentColor;font-weight:900!important}",
      "#" + BETA_NAV_ID + " .bh-beta-toggle:before{content:'β';font:900 14px/1 monospace}",
      "#" + ROOT_ID + " .bh-beta-exit{display:inline-flex;align-items:center;min-height:32px;padding:6px 9px;border:1px solid #d8d2c7;color:var(--bh-paper);font:800 10px/1 monospace;text-transform:uppercase}",
      "[data-bh-old-calendar-hidden='true']{display:none!important}",
      "[data-bh-old-recent-hidden='true']{display:none!important}",
      "body[data-bh-beta-layout='true'] #content-container div#left{display:none!important}",
      "body[data-bh-beta-layout='true'] #content-container div#main{margin-left:0!important}",
      "body[data-bh-beta-layout='true'] #content-container div#content{margin-right:0!important}",
      "body[data-bh-beta-layout='true'] #main-content{margin:0!important;padding:0!important}",
      "body[data-bh-beta-layout='true'] #logo-desc{display:flex;align-items:center;justify-content:space-between;gap:20px}",
      "body[data-bh-beta-layout='true'] #logo{float:none;order:2;padding:5px}",
      "body[data-bh-beta-layout='true'] #site-title,body[data-bh-beta-layout='true'] #logo-desc p{order:1}",
      "body[data-bh-beta-layout='true'] .navbar{padding-left:8px;padding-right:8px}",
      "body#mpage-body-modern #" + ROOT_ID + "{margin:10px 8px 16px;border:1px solid var(--bh-ink);overflow:hidden}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-dash-head{padding:12px 14px}",
      "body#mpage-body-modern #" + ROOT_ID + " h1{font-size:22px!important}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-priority-grid{grid-template-columns:1fr}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-agenda{grid-template-columns:1fr}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-agenda-copy{border-right:0;border-bottom:1px solid var(--bh-line)}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-agenda-frame{height:430px}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-forum-browser{display:block;height:auto;min-height:0;border-left:0;border-right:0}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-col{border-right:0;border-bottom:1px solid var(--bh-ink)}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-list,body#mpage-body-modern #" + ROOT_ID + " .bh-preview{height:auto;max-height:none;overflow:visible}",
      "body#mpage-body-modern #" + ROOT_ID + " .bh-col:nth-child(2),body#mpage-body-modern #" + ROOT_ID + " .bh-col:nth-child(4){display:none}",
      "@media(max-width:800px){#" + ROOT_ID + "{margin:0 0 14px}#" + ROOT_ID + " .bh-dash-head{align-items:flex-start;flex-wrap:wrap}#" + ROOT_ID + " .bh-top-menu{order:0}#" + ROOT_ID + " .bh-brand{order:1;flex:1 1 180px}#" + ROOT_ID + " .bh-dash-head>div:last-child{order:2}#" + ROOT_ID + " .bh-priority-grid{grid-template-columns:1fr}#" + ROOT_ID + " .bh-card p{min-height:0}#" + ROOT_ID + " .bh-utility-grid{grid-template-columns:1fr}#" + ROOT_ID + " .bh-latest-head{border-right:0;border-bottom:1px solid var(--bh-line)}#" + ROOT_ID + " .bh-latest-list{max-height:260px}#" + ROOT_ID + " .bh-agenda{grid-template-columns:1fr}#" + ROOT_ID + " .bh-agenda-copy{border-right:0;border-bottom:1px solid var(--bh-line)}#" + ROOT_ID + " .bh-agenda-frame{height:430px}#" + ROOT_ID + " .bh-topic-embed{height:520px}#" + ROOT_ID + " .bh-forum-browser{display:block;height:auto;min-height:0}#" + ROOT_ID + " .bh-forum-browser.bh-wide{min-width:0}#" + ROOT_ID + " .bh-col{border-right:0;border-bottom:1px solid var(--bh-ink)}#" + ROOT_ID + " .bh-list,#" + ROOT_ID + " .bh-preview{height:auto;max-height:none;overflow:visible}#" + ROOT_ID + " .bh-col:nth-child(4){display:block}#" + ROOT_ID + " .bh-archive-groups{grid-template-columns:1fr}#" + ROOT_ID + " .bh-brand-logo{width:40px;height:40px}#" + ROOT_ID + " .bh-version{padding-top:4px}#" + ROOT_ID + " .bh-column-brand,#" + ROOT_ID + " .bh-column-info{display:none}#" + ROOT_ID + " .bh-finder-bottom{grid-template-columns:auto minmax(0,1fr)}}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text).replace(/[&<>\"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function absoluteHref(href) {
    try {
      return new URL(href, window.location.origin).pathname + new URL(href, window.location.origin).search + new URL(href, window.location.origin).hash;
    } catch (error) {
      return href || "#";
    }
  }

  function numberFrom(text) {
    var match = normalize(text).replace(/\u00a0/g, " ").match(/\d[\d .,'\u00a0]*/);
    return match ? match[0].replace(/[^\d]/g, "") : "";
  }

  function topicRow(anchor) {
    return anchor.closest("dl") || anchor.closest("tr") || anchor.closest("li") || anchor.parentElement;
  }

  function topicNodeFromAnchor(anchor) {
    var row = topicRow(anchor);
    var href = absoluteHref(anchor.getAttribute("href") || "#");
    var title = normalize(anchor.textContent);
    if (!title || href === "#" || !/\/t\d+(?:-|$)/i.test(href)) return null;
    var repliesEl = row && row.querySelector(".posts, .topic-replies, [class*='posts']");
    var viewsEl = row && row.querySelector(".views, .topic-views, [class*='views']");
    var lastEl = row && row.querySelector(".lastpost, .last-post, [class*='lastpost']");
    var replies = numberFrom(repliesEl && repliesEl.textContent);
    var views = numberFrom(viewsEl && viewsEl.textContent);
    var lastText = normalize(lastEl && lastEl.textContent);
    var lastAnchor = lastEl && Array.prototype.slice.call(lastEl.querySelectorAll("a[href]")).find(function (candidate) {
      return /dernier message|last post/i.test(normalize(candidate.textContent) + " " + (candidate.getAttribute("title") || ""));
    });
    var node = {
      title: title,
      icon: "D",
      status: "sujet",
      href: href,
      topic: true,
      detail: "Sujet final du forum.",
      replies: replies,
      views: views,
      lastText: lastText,
      lastHref: lastAnchor ? absoluteHref(lastAnchor.getAttribute("href")) : ""
    };
    var meta = [];
    if (replies) meta.push(replies + " rép.");
    if (views) meta.push(views + " vues");
    node.meta = meta.join(" · ");
    if (lastText) node.detail = "Dernier message : " + lastText;
    return node;
  }

  function forumChildNodes(sourceHref) {
    var firstUrl = absoluteHref(sourceHref);
    var pageSize = 50;
    var maxPages = 10;
    var forums = [];
    var topics = [];
    var forumSeen = {};
    var topicSeen = {};
    function addForum(anchor) {
      var href = absoluteHref(anchor.getAttribute("href") || "#").split("?")[0];
      var title = cleanForumTitle(anchor.textContent);
      if (!title || !/^\/(?:c|f)\d+(?:-|$)/i.test(href) || forumSeen[href]) return;
      forumSeen[href] = true;
      var row = anchor.closest("dl") || anchor.closest("tr") || anchor.closest("li") || anchor.parentElement;
      var topicsEl = row && row.querySelector(".topics, [class*='topics']");
      var postsEl = row && row.querySelector(".posts, [class*='posts']");
      var meta = [];
      var countTopics = numberFrom(topicsEl && topicsEl.textContent);
      var countPosts = numberFrom(postsEl && postsEl.textContent);
      if (countTopics) meta.push(countTopics + " sujets");
      if (countPosts) meta.push(countPosts + " rép.");
      forums.push({
        title: title,
        icon: /^\/c\d+/i.test(href) ? "C" : "F",
        status: /^\/c\d+/i.test(href) ? "catégorie" : "rubrique",
        href: href,
        forumHref: href,
        children: [],
        meta: meta.join(" · "),
        detail: "Arborescence réelle du forum Blockhaus-DY10."
      });
    }
    function addTopic(anchor) {
      var node = topicNodeFromAnchor(anchor);
      if (!node || topicSeen[node.href]) return;
      topicSeen[node.href] = true;
      topics.push(node);
    }
    function readPage(page) {
      var url = firstUrl;
      if (page > 0) url += (url.indexOf("?") === -1 ? "?" : "&") + "start=" + (page * pageSize);
      return fetch(url, { credentials: "same-origin", redirect: "follow" }).then(function (response) {
        if (!response.ok) throw new Error("forum unavailable");
        if (/\/login(?:\?|$)/i.test(response.url || "")) {
          var protectedError = new Error("forum protected");
          protectedError.code = "protected";
          throw protectedError;
        }
        return response.text();
      }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        // Never read every /f or /t link in the document: Forumactif themes
        // repeat global navigation and the “Derniers sujets” marquee. These
        // selectors stay inside the forum/category lists only.
        var forumAnchors = Array.prototype.slice.call(doc.querySelectorAll(
          ".forabg a.forumtitle, .forumbg a.forumtitle, .forumlist a.forumtitle, dl.icon a.forumtitle"
        ));
        var topicAnchors = Array.prototype.slice.call(doc.querySelectorAll(
          "ul.topiclist.topics li.row a.topictitle, .forumbg ul.topiclist.topics li.row a.topictitle, .topic-title-container a[href*='/t'], .topic-title a[href*='/t']"
        ));
        forumAnchors.forEach(addForum);
        topicAnchors.forEach(addTopic);
        var pageTopics = topicAnchors.map(function (anchor) { return topicNodeFromAnchor(anchor); }).filter(Boolean);
        if (pageTopics.length < pageSize || page + 1 >= maxPages) {
          return { forums: forums, topics: topics, children: forums.concat(topics) };
        }
        return readPage(page + 1);
      });
    }
    return readPage(0);
  }

  // Kept as a compatibility alias for older cached calls. New Finder code
  // must use forumChildNodes so child forums are never mistaken for topics.
  function forumTopicNodes(sourceHref) {
    return forumChildNodes(sourceHref).then(function (result) { return result.topics; });
  }

  function forumIndexNodes() {
    var seen = {};
    var nodes = allLinks().map(function (anchor) {
      var href = anchor.getAttribute("href") || "";
      var match = href.match(/^\/f\d+(?:-|$)/i);
      var title = cleanForumTitle(anchor.textContent);
      if (!match || !title) return null;
      var key = absoluteHref(href).split("?")[0];
      if (seen[key]) return null;
      seen[key] = true;
      var row = anchor.closest("dl") || anchor.closest("tr") || anchor.closest("li") || anchor.parentElement;
      var rowText = normalize(row && row.textContent).replace(title, "").trim();
      var topicsEl = row && row.querySelector(".topics, [class*='topics']");
      var postsEl = row && row.querySelector(".posts, [class*='posts']");
      var meta = [];
      var topics = numberFrom(topicsEl && topicsEl.textContent);
      var posts = numberFrom(postsEl && postsEl.textContent);
      if (topics) meta.push(topics + " sujets");
      if (posts) meta.push(posts + " rép.");
      return {
        title: title,
        icon: "F",
        status: "rubrique",
        href: key,
        forumHref: key,
        children: [],
        meta: meta.join(" · "),
        detail: rowText ? rowText.slice(0, 220) : "Rubrique du forum Blockhaus-DY10."
      };
    }).filter(Boolean);
    // The homepage does not expose protected branches to guests. Keep the
    // canonical roots in the index so the Finder can request them lazily with
    // the current session instead of silently losing them.
    [
      ["DY10", "/c1-dy10", "catégorie"],
      ["REUNIONS", "/f39-reunions", "rubrique"],
      ["The Sounds", "/f27-the-sounds-of-the-blockhaus-dy10", "rubrique"],
      ["52 x Set/30' Archives", "/f37-52-x-set-30-archives", "rubrique"],
      ["Collège son", "/f4-college-son", "rubrique"]
    ].forEach(function (item) {
      var key = item[1];
      if (seen[key]) return;
      seen[key] = true;
      nodes.push({ title: item[0], icon: item[2] === "catégorie" ? "C" : "F", status: item[2], href: key, forumHref: key, children: [], detail: "Branche canonique du forum Blockhaus-DY10." });
    });
    return nodes;
  }

  function cleanForumTitle(text) {
    var title = normalize(text).replace(/[›»]\s*$/g, "").trim();
    title = title.replace(/^(?:[!RSEAFIC*?])(?=[A-ZÀ-ÖØ-Ý])/u, "");
    title = title.replace(/^D(?=\d)/, "");
    title = title.replace(/(Archives)son$/i, "$1");
    title = title.replace(/(Événements?)date$/i, "$1");
    return title.trim();
  }

  function safeMediaUrl(url) {
    try {
      var parsed = new URL(url, window.location.origin);
      return /^https?:$/i.test(parsed.protocol) ? parsed.href : "";
    } catch (error) {
      return "";
    }
  }

  function isUsefulImage(image, url) {
    if (image && image.closest && image.closest("#logo,#logo-desc,.bh-brand,.bh-top-menu")) return false;
    var source = (url || "") + " " + (image && (image.getAttribute("alt") || "")) + " " + (image && (image.className || ""));
    if (/smil|emoji|emot|avatar|icon|icone|spacer|blank|pixel|quote|delete|trash|info|pp-blank/i.test(source)) return false;
    var width = image && Number(image.getAttribute("width") || 0);
    var height = image && Number(image.getAttribute("height") || 0);
    if (width && height && width < 90 && height < 90) return false;
    return !!url;
  }

  function topicMediaMarkup(body) {
    if (!body) return "";
    var bands = [];
    var images = [];
    Array.prototype.forEach.call(body.querySelectorAll("a[href], iframe[src]"), function (element) {
      var raw = element.getAttribute("href") || element.getAttribute("src") || "";
      var url = safeMediaUrl(raw);
      if (!url) return;
      if (/bandcamp\.com/i.test(url) && bands.indexOf(url) === -1) bands.push(url);
    });
    Array.prototype.forEach.call(body.querySelectorAll("img[src]"), function (image) {
      var url = safeMediaUrl(image.getAttribute("src") || "");
      if (isUsefulImage(image, url) && images.indexOf(url) === -1) images.push(url);
    });
    var html = "";
    if (bands.length) {
      html += '<div class="bh-topic-media"><span class="bh-topic-media-label">Bandcamp</span>';
      bands.slice(0, 3).forEach(function (url) {
        if (/\/EmbeddedPlayer\//i.test(url)) {
          html += '<div class="bh-topic-player"><iframe class="bh-topic-embed" loading="lazy" title="Lecteur Bandcamp" src="' + escapeHtml(url) + '"></iframe></div>';
        } else {
          html += '<a class="bh-topic-bandcamp" target="_blank" rel="noopener" href="' + escapeHtml(url) + '">Ouvrir le lien Bandcamp</a>';
        }
      });
      html += "</div>";
    }
    if (images.length) {
      html += '<div class="bh-topic-media"><span class="bh-topic-media-label">Images du sujet</span><div class="bh-topic-images">';
      images.slice(0, 8).forEach(function (url) {
        html += '<a target="_blank" rel="noopener" href="' + escapeHtml(url) + '"><img class="bh-topic-image" loading="lazy" src="' + escapeHtml(url) + '" alt="Image du sujet"></a>';
      });
      html += "</div></div>";
    }
    return html;
  }

  function topicPreview(node, preview) {
    var box = preview.querySelector("[data-bh-topic-preview]");
    if (!box || !node || !node.topic || node.previewLoading || node.previewLoaded) return;
    node.previewLoading = true;
    fetch(node.href, { credentials: "same-origin" }).then(function (response) {
      if (!response.ok) throw new Error("topic unavailable");
      return response.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var posts = Array.prototype.slice.call(doc.querySelectorAll(".postbody, .post-content, article.message .content"));
      var body = posts.length ? posts[posts.length - 1] : null;
      if (!body) throw new Error("post body unavailable");
      var container = body.closest(".post, .postbody, article.message") || body;
      var text = normalize(body.textContent).slice(0, 900);
      var authorEl = container.querySelector(".username, .author a, .post-author a");
      var author = normalize(authorEl && authorEl.textContent);
      var authorLine = container.querySelector(".author, .post-author");
      var dateText = normalize(authorLine && authorLine.textContent).replace(author, "").replace(/^par\s*/i, "").trim();
      box.innerHTML = '<span class="bh-topic-preview-label">Aperçu du dernier post</span><div class="bh-topic-excerpt">' + escapeHtml(text || "Le dernier post ne contient pas de texte lisible.") + '</div>' + (author || dateText ? '<span class="bh-topic-author">' + escapeHtml([author, dateText].filter(Boolean).join(" · ")) + "</span>" : "") + topicMediaMarkup(body);
      node.previewLoaded = true;
    }).catch(function () {
      box.innerHTML = '<span class="bh-topic-preview-label">Aperçu du dernier post</span><div class="bh-topic-excerpt">Le sujet est bien identifié. Ouvre-le pour lire le message complet.</div>';
    }).finally(function () {
      node.previewLoading = false;
    });
  }

  function allLinks() {
    return Array.prototype.slice.call(document.querySelectorAll("a[href]"));
  }

  function isAdmin() {
    if (window._userdata && (Number(window._userdata.user_level) === 1 || Number(window._userdata.user_level) === 2)) return true;
    return allLinks().some(function (link) {
      return /administration|\/admin(?:_|\/|\?|$)/i.test(normalize(link.textContent) + " " + (link.getAttribute("href") || ""));
    });
  }

  function latestPublicationsMarkup() {
    var source = document.querySelector("#comments_scroll_div .marquee") || document.querySelector("#comments_scroll_div");
    if (!source) return '<p class="bh-latest-empty">Aucune publication récente détectée.</p>';
    var items = [];
    Array.prototype.forEach.call(source.querySelectorAll("a[href]"), function (anchor) {
      var title = normalize(anchor.textContent);
      var href = absoluteHref(anchor.getAttribute("href") || "#");
      if (!title || href === "#" || items.some(function (item) { return item.href === href; })) return;
      var detail = "";
      var sibling = anchor.nextSibling;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.tagName === "A") break;
        detail += sibling.textContent || "";
        sibling = sibling.nextSibling;
      }
      items.push({ title: title, href: href, detail: normalize(detail).replace(/^»\s*/, "").slice(0, 150) });
    });
    if (!items.length) return '<p class="bh-latest-empty">Aucune publication récente détectée.</p>';
    return items.slice(0, 12).map(function (item) {
      return '<a class="bh-latest-item" href="' + escapeHtml(item.href) + '"><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.detail || "Publication du forum") + '</small></a>';
    }).join("");
  }

  function recentSharedMediaMarkup(imagesHref) {
    return '<div data-bh-shared-media><div class="bh-media-loading">Chargement des images partagées…</div></div>';
  }

  function loadRecentSharedMedia(root, imagesHref) {
    var target = root.querySelector("[data-bh-shared-media]");
    if (!target) return;
    function collect(doc, fallbackHref) {
      var seen = {};
      var items = [];
      Array.prototype.forEach.call(doc.querySelectorAll("img[src],img[data-src],img[data-original]"), function (image) {
        var url = safeMediaUrl(image.getAttribute("data-src") || image.getAttribute("data-original") || image.getAttribute("src") || "");
        if (!isUsefulImage(image, url) || seen[url]) return;
        seen[url] = true;
        var anchor = image.closest("a[href]");
        items.push({ url: url, href: anchor ? absoluteHref(anchor.getAttribute("href") || url) : fallbackHref, alt: normalize(image.getAttribute("alt") || "Image partagée") });
      });
      return items;
    }
    function render(items) {
      if (!items.length) {
        target.innerHTML = '<div class="bh-card-media-empty">Aucune image publique trouvée dans la galerie ou les sujets.</div>';
        return;
      }
      target.innerHTML = '<div class="bh-card-media-grid">' + items.slice(0, 24).map(function (item) {
        return '<a href="' + escapeHtml(item.href) + '" title="' + escapeHtml(item.alt) + '"><img loading="lazy" src="' + escapeHtml(item.url) + '" alt="' + escapeHtml(item.alt) + '"></a>';
      }).join("") + '</div>';
    }
    function legacyRecentImages() {
      var candidates = Array.prototype.slice.call(document.querySelectorAll(".module,.widget,.panel,[id*='recent'],[class*='recent'],[id*='image'],[class*='image']"));
      var source = candidates.find(function (element) {
        return element !== root && /images\s+partagées\s+récemment/i.test(normalize(element.textContent || "")) && element.querySelector("img");
      });
      return source ? collect(source, imagesHref) : [];
    }
    function fetchForumGallery() {
      // Forumactif's "Images partagées récemment" module is hydrated client-side.
      // The HTML page is intentionally empty; its JSON endpoint is the canonical
      // source and includes the original topic URL/title for each uploaded image.
      return fetch(imagesHref + "?json=1&page=0", { credentials: "same-origin" }).then(function (response) {
        if (!response.ok) throw new Error("gallery json unavailable");
        return response.json();
      }).then(function (payload) {
        var rows = Array.isArray(payload) && Array.isArray(payload[0]) ? payload[0] : [];
        return rows.map(function (item) {
          var url = safeMediaUrl(item && item.url);
          var href = absoluteHref(item && item.topic_url || imagesHref);
          if (!url) return null;
          return { url: url, href: href, alt: normalize(item && item.topic_title || "Image partagée") };
        }).filter(Boolean);
      });
    }
    function fetchRecentTopicImages() {
      return fetch("/search?search_id=newposts", { credentials: "same-origin" }).then(function (response) {
        if (!response.ok) throw new Error("recent topics unavailable");
        return response.text();
      }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var topicLinks = Array.prototype.slice.call(doc.querySelectorAll("ul.topiclist.topics li.row a.topictitle[href], .forumbg ul.topiclist.topics li.row a.topictitle[href], .topic-title-container a[href*='/t'], .topic-title a[href*='/t']")).map(function (anchor) {
          return absoluteHref(anchor.getAttribute("href") || "");
        }).filter(function (href, index, array) { return href && array.indexOf(href) === index; }).slice(0, 8);
        return Promise.all(topicLinks.map(function (href) {
          return fetch(href, { credentials: "same-origin" }).then(function (response) { return response.ok ? response.text() : ""; }).catch(function () { return ""; });
        })).then(function (pages) {
          var items = [];
          pages.forEach(function (page) {
            if (!page) return;
            items = items.concat(collect(new DOMParser().parseFromString(page, "text/html"), imagesHref));
          });
          var seen = {};
          return items.filter(function (item) { if (seen[item.url]) return false; seen[item.url] = true; return true; });
        });
      });
    }
    var legacyItems = legacyRecentImages();
    fetchForumGallery().then(function (items) {
      return items.length ? items : fetchRecentTopicImages();
    }).then(function (items) { return items.length ? items : legacyItems; }).then(render).catch(function () {
      // Keep the older module/topic fallbacks for forums with the gallery disabled.
      render(legacyItems);
    });
  }

  function hideLegacyRecentPosts() {
    var source = document.querySelector("#comments_scroll_div");
    var module = source && source.closest(".module");
    if (module) module.setAttribute("data-bh-old-recent-hidden", "true");
  }

  function startLatestTicker(root) {
    var list = root.querySelector(".bh-latest-list");
    if (!list || list.children.length < 2) return;
    var paused = false;
    var pause = function () { paused = true; };
    var resume = function () { paused = false; };
    list.addEventListener("mouseenter", pause);
    list.addEventListener("mouseleave", resume);
    list.addEventListener("focusin", pause);
    list.addEventListener("focusout", resume);
    root._bhLatestTicker = window.setInterval(function () {
      if (paused || list.scrollHeight <= list.clientHeight) return;
      if (list.scrollTop + list.clientHeight >= list.scrollHeight - 1) list.scrollTop = 0;
      else list.scrollTop += 1;
    }, 85);
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

  function statusIcon(status) {
    var key = normalize(status).toLowerCase();
    if (/actif|nouveau/.test(key)) return "●";
    if (/prio|important/.test(key)) return "★";
    if (/date|google/.test(key)) return "◷";
    if (/son|musique/.test(key)) return "♫";
    if (/index/.test(key)) return "⌘";
    if (/direct|chat/.test(key)) return "◉";
    if (/rubrique|dossier|archive/.test(key)) return "▦";
    if (/sujet|cr|odj|forum/.test(key)) return "▹";
    if (/à suivre|suivre/.test(key)) return "○";
    return "·";
  }

  function row(label, href, icon, status, active) {
    if (!href || href === "#") href = "/";
    return '<a class="bh-row' + (active ? ' active' : '') + '" data-bh-folder="true" href="' + href + '"><span class="bh-status-left" title="' + escapeHtml(status || "dossier") + '" aria-label="' + escapeHtml(status || "dossier") + '">' + statusIcon(status || "dossier") + '</span><span class="bh-row-main">' + label + '</span><span class="bh-chevron" aria-hidden="true">›</span></a>';
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
      var identity = ((element.id || "") + " " + (typeof element.className === "string" ? element.className : "")).toLowerCase();
      var containsChat = /chat/.test(identity) || !!element.querySelector('[id*="chat" i],[class*="chat" i],[href*="chatbox"]');
      if (element === root || element.id === BETA_NAV_ID || element.id === "tab-bar" || element.id === "to-top" || containsChat) return;
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

  function mountSiteMenu(markup) {
    var previous = document.getElementById(SITE_MENU_ID);
    if (previous) previous.remove();
    var wrapper = document.createElement("div");
    wrapper.innerHTML = markup;
    var menu = wrapper.firstElementChild;
    if (!menu) return;
    var pageHeader = document.querySelector("#page-header");
    var headerbar = pageHeader && (pageHeader.querySelector(".headerbar") || pageHeader.firstElementChild);
    var navbar = pageHeader && pageHeader.querySelector(".navbar");
    if (pageHeader) {
      // Keep the compact site menu at the very top of the Forumactif header,
      // above the logo/headerbar. Inserting before the navbar placed it below
      // the logo on some desktop themes.
      pageHeader.insertBefore(menu, headerbar || navbar || pageHeader.firstChild);
      return;
    }
    var main = document.getElementById("main-content") || document.getElementById("main") || document.body;
    main.insertBefore(menu, main.firstChild);
  }

  function buildDashboard() {
    if (!isMember()) return;
    document.body.setAttribute("data-bh-beta-layout", "true");
    // Replace an older beta container left in the DOM after its Forumactif
    // script was disabled; the classic forum markup remains untouched.
    var previousRoot = document.getElementById(ROOT_ID);
    if (previousRoot) {
      if (previousRoot._bhLatestTicker) window.clearInterval(previousRoot._bhLatestTicker);
      previousRoot.remove();
    }
    if (!/^\/(?:index\.htm)?$/.test(window.location.pathname) && window.BLOCKHAUS_HOME_DASHBOARD_PREVIEW !== true) return;

    var main = document.getElementById("main-content") || document.getElementById("main") || document.body;
    var meetingHref = findLink([/^REUNIONS$/i, /réunions/i], "/f39-reunions");
    var agendaHref = AGENDA_PATH;
    var oldAgendaHref = findLink([/^Calendrier$/i, /calendrier Forumactif/i], "/calendar");
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
    var logoImg = document.querySelector("#logo img");
    var logoSrc = logoImg ? (logoImg.getAttribute("src") || "") : "";
    var topMenuMarkup = '<details id="' + SITE_MENU_ID + '"><summary><span class="bh-site-menu-title"><strong>Blockhaus-DY10</strong><small>le forum du DY10</small></span></summary><div class="bh-site-menu-panel">' +
      link("Accueil", "/", false) + link("Calendrier", agendaHref, false) + link("Événements", eventsHref, false) +
      link("Membres", "/memberlist", false) + link("Mon profil", "/profile?mode=editprofile", false) +
      link("Messages privés", "/privmsg?folder=inbox", false) + link("Se déconnecter", "/login?logout=1", false) +
      '</div></details>';
    mountSiteMenu(topMenuMarkup);

    var root = document.createElement("section");
    root.id = ROOT_ID;
    root.dataset.version = VERSION;
    root.setAttribute("aria-label", "Accueil des membres du Blockhaus");
    var crCardMarkup = '<article class="bh-card bh-cr-card"><span class="bh-card-number">02 / DERNIER CR</span><h2>Compte rendu de réunion</h2><ul class="bh-cr-summary"><li><strong>Nouveaux membres :</strong> Nicolas Plessis et Pascal Lebrun rejoignent l’association.</li><li><strong>Captation & archives :</strong> filmer les événements, clarifier l’archivage, relancer les Best Of et le projet de labo photo.</li><li><strong>Programmation :</strong> octobre à février, de Rebecca Bonté / Colombey au workshop, à la soirée noise et aux résidences.</li><li><strong>Soirées LGBT+ :</strong> projet accepté, petit comité, DJ sets et projections.</li><li><strong>K-Haus :</strong> accueillir le travail de Jean.</li><li><strong>Migration Messenger :</strong> organiser un vote Slack, Signal, Telegram, Messenger ou Discord.</li><li><strong>Espace couture :</strong> proposition de Mathieu et Hortense, plusieurs personnes intéressées.</li></ul></article>';
    var latestSectionMarkup = '<section class="bh-latest bh-latest-priority"><div class="bh-latest-head"><span class="bh-card-number">FIL DU FORUM</span></div><div class="bh-latest-list">' + latestPublicationsMarkup() + '</div></section>';
    root.innerHTML =
      '<header class="bh-dash-head"><div class="bh-brand"><div><h1>BLOCKHAUS DY10</h1></div></div><div><span class="bh-version">ACCUEIL V' + VERSION + '</span><br><a class="bh-beta-exit" href="/?bh_beta=off">Quitter la bêta</a></div></header>' +
      '<div class="bh-priority-grid">' +
        '<article class="bh-card"><span class="bh-card-number">01 / PRIORITÉ</span><h2>Réunions & décisions</h2><p>Ordres du jour, comptes rendus et décisions collectives.</p><div class="bh-actions">' + link("Réunions", meetingHref, true) + link("Dernier ODJ", odjHref, false) + link("Dernier CR", reportHref, false) + "</div></article>" +
        latestSectionMarkup +
        '<article class="bh-card bh-activity-card"><span class="bh-card-number">03 / ACTIVITÉ</span><div class="bh-card-media">' + recentSharedMediaMarkup(imagesHref) + '</div></article>' +
      "</div>" +
      '<div class="bh-utility-grid">' + crCardMarkup +
      '<section class="bh-agenda"><div class="bh-agenda-copy"><span class="bh-card-number">AGENDA PARTAGÉ</span><h2>Soirées @ Blockhaus</h2><p>Google Agenda devient la vue principale. L’ancien calendrier reste conservé plus loin, dans l’archive technique.</p><div class="bh-actions">' + link("Voir en grand", agendaHref, true) + link("Ancien agenda (archive)", oldAgendaHref, false) + '</div></div><iframe class="bh-agenda-frame" loading="lazy" title="Agenda Google du Blockhaus" src="' + AGENDA_EMBED + '"></iframe></section></div>' +
      '<div class="bh-column-toolbar" role="toolbar" aria-label="Navigation par colonnes"><span class="bh-column-brand">BLOCKHAUS / DY10</span><button type="button" data-bh-col-back disabled aria-label="Revenir">‹</button><button type="button" data-bh-col-forward aria-label="Avancer">›</button><button type="button" data-bh-wide-toggle aria-pressed="false">Élargir</button><span class="bh-column-path" data-bh-col-path>Accueil › Zones › À lire</span><span class="bh-column-info">4 niveaux · vue Finder</span></div>' +
      '<div class="bh-column-scroll" data-bh-col-scroll><section class="bh-forum-browser" aria-label="Circuler dans le forum">' +
        '<div class="bh-col"><div class="bh-col-title">1. Zones</div><div class="bh-list">' +
          row("À lire", "/search?search_id=newposts", "!", "actif", true) +
          row("Réus", meetingHref, "R", "prio", false) +
          row("Événements", eventsHref, "E", "date", false) +
          row("Agenda", agendaHref, "A", "google", false) +
          row("Archives son", soundHref, "S", "", false) +
          row("Archives image", imagesHref, "I", "", false) +
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
      "</div></details>" +
      '<div class="bh-finder-bottom" aria-label="Chemin Finder"><span data-bh-bottom-path>Accueil</span><input data-bh-level-slider type="range" min="0" max="3" value="0" step="1" aria-label="Niveau de navigation"><span data-bh-bottom-level>1 / 4</span></div>';

    main.insertBefore(root, main.firstChild);
    loadRecentSharedMedia(root, imagesHref);
    var scroll = root.querySelector("[data-bh-col-scroll]");
    var browser = root.querySelector(".bh-forum-browser");
    var back = root.querySelector("[data-bh-col-back]");
    var forward = root.querySelector("[data-bh-col-forward]");
    var wideToggle = root.querySelector("[data-bh-wide-toggle]");
    var path = root.querySelector("[data-bh-col-path]");
    var bottomPath = root.querySelector("[data-bh-bottom-path]");
    var slider = root.querySelector("[data-bh-level-slider]");
    var bottomLevel = root.querySelector("[data-bh-bottom-level]");
    var columns = root.querySelectorAll(".bh-col");
    var level = 0;
    var wide = false;
    try { wide = window.localStorage.getItem(WIDE_STORAGE_KEY) === "1"; } catch (error) { wide = false; }
    if (wide) {
      browser.classList.add("bh-wide");
      wideToggle.classList.add("active");
      wideToggle.setAttribute("aria-pressed", "true");
    }
    var soundArtists = [
      ["Aalpes", "/t153-aalpes"],
      ["Aneth Penny", "/t170-aneth-penny"],
      ["Crimesex", "/t709-crimesex"],
      ["DCIM", "/t145-dcim"],
      ["Divx", "/t148-divx"],
      ["DY10 ORCHESTRA", "/t346-dy10-orchestra"],
      ["Elastic Systems", "/t682-elastic-systems"],
      ["Eva Durand", "/t146-eva-durand"],
      ["Extreme Shoegaze", "/t159-extreme-shoegaze"],
      ["France Reverb", "/t144-france-reverb"],
      ["Ground", "/t157-ground"],
      ["Jencks", "/t225-jencks"],
      ["Justine et Kyoko", "/t162-justine-et-kyoko"],
      ["Kosmos Natur Furor", "/t167-kosmos-natur-furor"],
      ["Nerfs", "/t226-nerfs"],
      ["OBC", "/t165-obc"],
      ["Omnisphynx", "/t154-omnisphynx"],
      ["Peninsula", "/t171-peninsula"],
      ["Phil Tremble", "/t156-phil-tremble"],
      ["Photo ratée", "/t164-photo-ratee"],
      ["Ravadiscs", "/t166-ravadiscs"],
      ["Righton Rodgers", "/t168-righton-rodgers"],
      ["Robonom", "/t143-robonom"],
      ["Rocade", "/t158-rocade"],
      ["Set/30'", "/t169-set-30"],
      ["Spacemec", "/t161-spacemec"],
      ["Struwwelpetra", "/t163-struwwelpetra"],
      ["Subutex Social Club", "/t160-subutex-social-club"],
      ["The Shy Accident", "/t147-the-shy-accident"],
      ["Tutoriel", "/t149-tutoriel"],
      ["TX", "/t155-tx"],
      ["Undertakeaway", "/t152-undertakeaway"],
      ["Urticaria records", "/t710-urticaria-records"]
    ].map(function (artist) {
      return { title: artist[0], icon: "♪", status: "sujet", href: artist[1], topic: true, detail: "Sujet, morceaux et liens de " + artist[0] + "." };
    });
    var forumIndex = forumIndexNodes();
    var tree = [
      { title: "À lire", icon: "!", status: "actif", children: [
        { title: "Derniers posts", icon: ">", status: "nouveau", href: "/search?search_id=newposts", detail: "Les discussions qui attendent une lecture." },
        { title: "Sans réponse", icon: "?", status: "à suivre", href: "/search?search_id=unanswered", detail: "Sujets ouverts qui n’ont pas encore reçu de réponse." }
      ] },
      { title: "Réunions & décisions", icon: "R", status: "prio", forumHref: meetingHref, children: [], detail: "Blockhaus-DY10 › DY10 › REUNIONS. Sous-forums et sujets réels chargés depuis le forum." },
      { title: "Événements", icon: "E", status: "date", children: [
        { title: "Agenda partagé", icon: "A", status: "google", href: agendaHref, detail: "Agenda Google du Blockhaus." },
        { title: "Ancien agenda", icon: "A", status: "archive", href: oldAgendaHref, detail: "Calendrier historique Forumactif conservé comme archive technique." },
        { title: "Événements du forum", icon: "E", status: "forum", href: eventsHref, detail: "Propositions et événements publiés sur le forum." }
      ] },
      { title: "Archives son", icon: "S", status: "son", children: [
        { title: "The Sounds", icon: "S", status: "son", forumHref: soundHref, href: soundHref, detail: "Archives et liens sonores du Blockhaus.", children: [] },
        { title: "52 x Set/30'", icon: "S", status: "archive", forumHref: setHref, href: setHref, detail: "Archives des sessions Set/30'.", children: [] }
      ] },
      { title: "Forum complet", icon: "F", status: "index", detail: "Arborescence complète : catégories, forums, sous-forums et sujets.", children: forumIndex }
    ];
    function nodeKey(node) {
      return String(node && (node.forumHref || node.href || node.title) || "").split("?")[0].toLowerCase();
    }
    function readOrganization() {
      try {
        var saved = JSON.parse(window.localStorage.getItem(ORG_STORAGE_KEY) || "{}");
        return { order: Array.isArray(saved.order) ? saved.order : [], hidden: saved.hidden && typeof saved.hidden === "object" ? saved.hidden : {} };
      } catch (error) {
        return { order: [], hidden: {} };
      }
    }
    function saveOrganization() {
      try { window.localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(organization)); } catch (error) { /* local-only beta preference */ }
    }
    function organizeList(list) {
      if (!Array.isArray(list)) return list;
      var visible = list.filter(function (node) { return !organization.hidden[nodeKey(node)]; });
      visible.forEach(function (node) {
        if (node.children) {
          node._bhAllChildren = node._bhAllChildren || node.children.slice();
          node.children = organizeList(node._bhAllChildren);
        }
      });
      visible.sort(function (a, b) {
        var ai = organization.order.indexOf(nodeKey(a));
        var bi = organization.order.indexOf(nodeKey(b));
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
      return visible;
    }
    var organization = readOrganization();
    var originalTree = tree;
    tree = organizeList(originalTree);
    var selection = [];
    function nodeButton(node, index, active) {
      var status = node.status || (node.children ? "dossier" : "sujet");
      return '<button type="button" class="bh-node' + (active ? ' active' : '') + '" data-bh-node-index="' + index + '"><span class="bh-status-left" title="' + escapeHtml(status) + '" aria-label="' + escapeHtml(status) + '">' + statusIcon(status) + '</span><span class="bh-row-main">' + escapeHtml(node.title) + '</span>' + (node.meta ? '<span class="bh-node-meta">' + escapeHtml(node.meta) + '</span>' : '<span class="bh-node-meta"></span>') + '<span class="bh-status">' + escapeHtml(status) + '</span></button>';
    }
    function selectedNode(depth) {
      var list = tree;
      var node = null;
      for (var i = 0; i <= depth; i += 1) {
        node = list && list[selection[i]];
        list = node && node.children;
      }
      return node;
    }
    function organizeCurrent(action) {
      if (!isAdmin()) return;
      if (action === "reset") {
        organization = { order: [], hidden: {} };
        saveOrganization();
        selection = [];
        tree = organizeList(originalTree);
        renderFinder();
        return;
      }
      var depth = selection.length - 1;
      if (depth < 0) return;
      var parent = depth === 0 ? null : selectedNode(depth - 1);
      var list = depth === 0 ? tree : (parent && parent.children);
      var index = selection[depth];
      var item = list && list[index];
      if (!item) return;
      if (action === "hide") {
        organization.hidden[nodeKey(item)] = true;
      } else if (action === "up" || action === "down") {
        var key = nodeKey(item);
        var orderIndex = organization.order.indexOf(key);
        if (orderIndex === -1) {
          organization.order.push(key);
          orderIndex = organization.order.length - 1;
        }
        var nextOrderIndex = action === "up" ? orderIndex - 1 : orderIndex + 1;
        if (nextOrderIndex >= 0 && nextOrderIndex < organization.order.length) {
          var swap = organization.order[nextOrderIndex];
          organization.order[nextOrderIndex] = key;
          organization.order[orderIndex] = swap;
        }
      }
      saveOrganization();
      tree = organizeList(originalTree);
      selection = [];
      renderFinder();
    }
    function renderColumn(depth) {
      var list = depth === 0 ? tree : (selectedNode(depth - 1) || {}).children;
      var title = ["1. Zones", "2. Rubriques", "3. Sujets utiles"][depth] || "4. Aperçu";
      if (depth === 3) {
        var item = selectedNode(2) || selectedNode(1) || selectedNode(0);
        var crumb = selection.map(function (_, i) { var n = selectedNode(i); return n ? n.title : ""; }).filter(Boolean);
        var stats = item && item.topic ? '<div class="bh-topic-stats">' + (item.replies ? '<span class="bh-topic-stat">' + escapeHtml(item.replies) + ' réponses</span>' : '') + (item.views ? '<span class="bh-topic-stat">' + escapeHtml(item.views) + ' vues</span>' : '') + (item.lastText ? '<span class="bh-topic-stat">dernier message repéré</span>' : '') + '</div>' : '';
        var topicBox = item && item.topic ? '<div class="bh-topic-preview" data-bh-topic-preview><span class="bh-topic-preview-label">Aperçu du dernier post</span><div class="bh-topic-excerpt">Lecture du sujet…</div></div>' : '';
        var adminTools = isAdmin() && item ? '<div class="bh-admin-tools"><small>Organisation locale de la bêta — visible par les admins de ce compte</small><button type="button" data-bh-org-action="up">↑ Monter</button><button type="button" data-bh-org-action="down">↓ Descendre</button><button type="button" data-bh-org-action="hide">Masquer</button><button type="button" data-bh-org-action="reset">Réinitialiser</button></div>' : '';
        columns[depth].innerHTML = '<div class="bh-col-title">4. Aperçu</div><div class="bh-preview"><h2>' + (item ? escapeHtml(item.title) : "Choisir un dossier") + '</h2><p>' + escapeHtml(item && item.detail ? item.detail : "Sélectionne une zone, puis une rubrique et enfin un sujet.") + '</p>' + stats + topicBox + '<p><strong>Chemin :</strong><br>' + (crumb.length ? "Accueil › " + crumb.map(escapeHtml).join(" › ") : "Accueil") + '</p>' + adminTools + '<div class="bh-preview-actions">' + (item && item.href ? link("Ouvrir le sujet complet", item.href, true) : "") + (item && item.lastHref ? link("Aller au dernier post", item.lastHref, false) : "") + '</div></div>';
        if (item && item.topic) topicPreview(item, columns[depth]);
        columns[depth].querySelectorAll("[data-bh-org-action]").forEach(function (button) {
          button.addEventListener("click", function () {
            organizeCurrent(button.getAttribute("data-bh-org-action"));
          });
        });
        return;
      }
      var parent = depth > 0 ? selectedNode(depth - 1) : null;
      var emptyMessage = parent && parent.forumLoading ? "Lecture des forums et sujets…" : (parent && parent.forumError ? (parent.forumError === "protected" ? "Cette branche est réservée aux membres connectés." : "Branche indisponible pour le moment.") : "Aucun sous-dossier ici.");
      columns[depth].innerHTML = '<div class="bh-col-title">' + title + '</div><div class="bh-list">' + (list && list.length ? list.map(function (node, index) { return nodeButton(node, index, selection[depth] === index); }).join("") : '<p class="bh-preview">' + emptyMessage + '</p>') + '</div>';
      columns[depth].querySelectorAll("[data-bh-node-index]").forEach(function (button) {
        button.addEventListener("click", function () {
          var node = list && list[Number(button.getAttribute("data-bh-node-index"))];
          selection = selection.slice(0, depth);
          selection[depth] = Number(button.getAttribute("data-bh-node-index"));
          renderFinder();
          if (node && node.forumHref && !node.forumLoaded && !node.forumLoading) {
            node.forumLoading = true;
            if (node.children && node.children.length) renderFinder();
            forumChildNodes(node.forumHref).then(function (result) {
              var children = result.children || [];
              node._bhAllChildren = children;
              node.children = organizeList(children);
              node.forumError = "";
              node.forumLoaded = true;
              node.forumLoading = false;
              renderFinder();
            }).catch(function (error) {
              node.forumError = error && error.code ? error.code : "unavailable";
              node.forumLoaded = true;
              node.forumLoading = false;
              renderFinder();
            });
          }
        });
      });
    }
    function renderFinder() {
      renderColumn(0); renderColumn(1); renderColumn(2); renderColumn(3);
      var crumb = selection.map(function (_, i) { var n = selectedNode(i); return n ? n.title : ""; }).filter(Boolean);
      path.textContent = crumb.length ? "Accueil › " + crumb.join(" › ") : "Accueil › Zones";
      bottomPath.textContent = path.textContent;
      level = Math.min(3, selection.length);
      slider.value = String(level);
      bottomLevel.textContent = (level + 1) + " / 4";
      back.disabled = level === 0;
      forward.disabled = level === 3;
      scroll.scrollLeft = (scroll.scrollWidth / 4) * level;
    }
    function setLevel(next) {
      level = Math.max(0, Math.min(3, next));
      selection = selection.slice(0, level);
      renderFinder();
    }
    back.addEventListener("click", function () { setLevel(level - 1); });
    forward.addEventListener("click", function () { setLevel(level + 1); });
    wideToggle.addEventListener("click", function () {
      wide = !wide;
      browser.classList.toggle("bh-wide", wide);
      wideToggle.classList.toggle("active", wide);
      wideToggle.setAttribute("aria-pressed", wide ? "true" : "false");
      try { window.localStorage.setItem(WIDE_STORAGE_KEY, wide ? "1" : "0"); } catch (error) { /* optional preference */ }
      renderFinder();
    });
    slider.addEventListener("input", function () { setLevel(Number(slider.value)); });
    renderFinder();
    startLatestTicker(root);
    hideClassicHome(root, main);
    hideOldCalendar();
    hideLegacyRecentPosts();
  }

  function buildVisitorArchive() {
    if (document.getElementById("bh-public-archive") || !/^\/(?:index\.htm)?$/.test(window.location.pathname)) return;
    var main = document.getElementById("main-content") || document.getElementById("main") || document.body;
    var links = externalMusicLinks();
    var soundArchiveLinks = [
      ["The Sounds", "/f27-the-sounds-of-the-blockhaus-dy10"],
      ["52 x Set/30'", "/f37-52-x-set-30-archives"],
      ["Wave Drone Orchestra", "/f19-wave-drone-orchestra"],
      ["DY DISQ", "/f21-blockhaus-dy-disq"],
      ["Aalpes", "/t153-aalpes"], ["Aneth Penny", "/t170-aneth-penny"], ["Crimesex", "/t709-crimesex"],
      ["DCIM", "/t145-dcim"], ["Divx", "/t148-divx"], ["DY10 ORCHESTRA", "/t346-dy10-orchestra"],
      ["Elastic Systems", "/t682-elastic-systems"], ["Eva Durand", "/t146-eva-durand"], ["Extreme Shoegaze", "/t159-extreme-shoegaze"],
      ["France Reverb", "/t144-france-reverb"], ["Ground", "/t157-ground"], ["Jencks", "/t225-jencks"],
      ["Justine et Kyoko", "/t162-justine-et-kyoko"], ["Kosmos Natur Furor", "/t167-kosmos-natur-furor"], ["Nerfs", "/t226-nerfs"],
      ["OBC", "/t165-obc"], ["Omnisphynx", "/t154-omnisphynx"], ["Peninsula", "/t171-peninsula"],
      ["Phil Tremble", "/t156-phil-tremble"], ["Photo ratée", "/t164-photo-ratee"], ["Ravadiscs", "/t166-ravadiscs"],
      ["Righton Rodgers", "/t168-righton-rodgers"], ["Robonom", "/t143-robonom"], ["Rocade", "/t158-rocade"],
      ["Set/30'", "/t169-set-30"], ["Spacemec", "/t161-spacemec"], ["Struwwelpetra", "/t163-struwwelpetra"],
      ["Subutex Social Club", "/t160-subutex-social-club"], ["The Shy Accident", "/t147-the-shy-accident"],
      ["Tutoriel", "/t149-tutoriel"], ["TX", "/t155-tx"], ["Undertakeaway", "/t152-undertakeaway"], ["Urticaria records", "/t710-urticaria-records"]
    ].map(function (item) { return { label: item[0], href: item[1] }; });
    var archiveChips = soundArchiveLinks.map(function (item) { return chip(item.label, item.href); }).join("");
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
    section.innerHTML = '<summary>Archives audio & liens <small>accès visiteur</small></summary><div class="bh-archive-groups"><section class="bh-archive-group"><h3>Musique & artistes</h3><div class="bh-chip-list">' + archiveChips + '</div><p class="bh-bandcamp-note">Les sujets sonores publics restent accessibles aux invités. Les liens Bandcamp détectés apparaissent aussi ici.</p></section><section class="bh-archive-group"><h3>Bandcamp / liens externes</h3><div class="bh-chip-list">' + links.map(function (item) { return chip(item.label, item.href); }).join("") + '</div></section></div>';
    main.appendChild(section);
  }

  function rollback() {
    var root = document.getElementById(ROOT_ID);
    var style = document.getElementById(STYLE_ID);
    var betaNav = document.getElementById(BETA_NAV_ID);
    var siteMenu = document.getElementById(SITE_MENU_ID);
    if (root) root.remove();
    if (root && root._bhLatestTicker) window.clearInterval(root._bhLatestTicker);
    if (style) style.remove();
    if (betaNav) betaNav.remove();
    if (siteMenu) siteMenu.remove();
    Array.prototype.forEach.call(document.querySelectorAll('[data-bh-old-calendar-hidden="true"]'), function (element) {
      element.removeAttribute("data-bh-old-calendar-hidden");
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-bh-old-recent-hidden="true"]'), function (element) {
      element.removeAttribute("data-bh-old-recent-hidden");
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
    document.body.removeAttribute("data-bh-beta-layout");
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
