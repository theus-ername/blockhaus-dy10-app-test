(function () {
  "use strict";

  var VERSION = "12";
  var ROOT_ID = "bh-chat-widget";
  var STYLE_ID = "bh-chat-widget-v12-style";
  var FRAME_STYLE_ID = "bh-chat-frame-v12-style";
  var CHATBOX_URL = window.BLOCKHAUS_CHATBOX_URL || "/chatbox/";
  var FULL_CHAT_URL = window.BLOCKHAUS_FULL_CHAT_URL || (CHATBOX_URL + (CHATBOX_URL.indexOf("?") === -1 ? "?" : "&") + "bh_desktop=1");

  if (window.top !== window.self) return;

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  function addStyle(id, css, doc) {
    if (!doc.head || doc.getElementById(id)) return;
    var style = doc.createElement("style");
    style.id = id;
    style.textContent = css;
    doc.head.appendChild(style);
  }

  function nativeFrame() {
    return Array.prototype.find.call(document.querySelectorAll("iframe"), function (frame) {
      if (/\/chatbox(?:\/|\?|$)/i.test(frame.getAttribute("src") || "") || /chatbox/i.test(frame.getAttribute("title") || "")) return true;
      try { return !!(frame.contentDocument && frame.contentDocument.getElementById("chatbox")); }
      catch (error) { return false; }
    });
  }

  function frameContainer(frame) {
    if (!frame) return null;
    var candidate = frame.closest(".forumline, .module, .panel, .chatbox, table");
    if (candidate && candidate.querySelectorAll("iframe").length === 1 && candidate.getBoundingClientRect().height < 900) return candidate;
    return frame;
  }

  var widgetCss = [
    "#" + ROOT_ID + "{--bh-bg:#66645c;--bh-panel:#747167;--bh-head:#c8c2b6;--bh-ink:#20211f;--bh-paper:#fffaf0;--bh-muted:#e5ded2;--bh-line:#8b867b;font-family:Inter,Arial,sans-serif;color:var(--bh-paper)}",
    "#" + ROOT_ID + " *{box-sizing:border-box}",
    "#" + ROOT_ID + " button,#" + ROOT_ID + " a{font:inherit}",
    "#" + ROOT_ID + " .bh-entry{max-width:760px;margin:18px auto;padding:16px;background:var(--bh-bg);border:1px solid var(--bh-line);display:flex;align-items:center;gap:12px}",
    "#" + ROOT_ID + " .bh-mark{width:42px;height:42px;display:grid;place-items:center;flex:none;background:var(--bh-ink);color:var(--bh-paper);font:900 12px/1 monospace}",
    "#" + ROOT_ID + " .bh-entry-copy{flex:1;min-width:0}",
    "#" + ROOT_ID + " .bh-entry-copy strong{display:block;font-size:16px}",
    "#" + ROOT_ID + " .bh-entry-copy span{display:block;margin-top:4px;color:#eee8dc;font-size:12px}",
    "#" + ROOT_ID + " .bh-open{border:0;background:var(--bh-paper);color:var(--bh-ink);font-weight:800;padding:11px 15px;cursor:pointer}",
    "#" + ROOT_ID + " .bh-fab{position:fixed;z-index:99997;right:20px;bottom:18px;display:flex;align-items:center;gap:10px;border:0;border-radius:26px;background:var(--bh-paper);color:var(--bh-ink);padding:9px 16px 9px 9px;box-shadow:0 10px 34px #0007;font-weight:800;cursor:pointer}",
    "#" + ROOT_ID + " .bh-fab-mark{position:relative;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:var(--bh-ink);color:var(--bh-paper);font:900 10px/1 monospace}",
    "#" + ROOT_ID + " .bh-presence{position:absolute;right:-1px;bottom:0;width:10px;height:10px;border:2px solid var(--bh-paper);border-radius:50%;background:#62d88f}",
    "#" + ROOT_ID + " .bh-panel{position:fixed;z-index:99998;right:18px;bottom:72px;width:390px;height:min(610px,calc(100dvh - 94px));display:none;flex-direction:column;overflow:hidden;border:1px solid var(--bh-line);border-radius:14px;background:var(--bh-bg);box-shadow:0 22px 70px #0009}",
    "#" + ROOT_ID + " .bh-panel.is-open{display:flex}",
    "#" + ROOT_ID + " .bh-head{display:flex;align-items:center;gap:10px;min-height:58px;padding:8px 10px;background:var(--bh-head);color:var(--bh-ink);border-bottom:1px solid #8b867b}",
    "#" + ROOT_ID + " .bh-head .bh-mark{width:38px;height:38px;border-radius:50%}",
    "#" + ROOT_ID + " .bh-head-title{flex:1;min-width:0;font-size:14px;font-weight:850}",
    "#" + ROOT_ID + " .bh-head-title small{display:block;margin-top:2px;font-size:10px;font-weight:500}",
    "#" + ROOT_ID + " .bh-head-action{width:34px;height:34px;display:grid;place-items:center;border:0;border-radius:50%;background:#d7d3ca;color:var(--bh-ink);text-decoration:none;cursor:pointer}",
    "#" + ROOT_ID + " .bh-close{font-size:22px;line-height:1}",
    "#" + ROOT_ID + " iframe{display:block;flex:1;width:100%;min-height:0;border:0;background:var(--bh-bg)}",
    "#" + ROOT_ID + " [hidden]{display:none!important}",
    "@media(max-width:700px){body.bh-chat-open{overflow:hidden!important}body#mpage-body-modern.bh-chat-open #tab-bar,body#mpage-body-modern.bh-chat-open #to-top{display:none!important}#" + ROOT_ID + " .bh-entry{margin:12px 0;flex-wrap:wrap}#" + ROOT_ID + " .bh-entry .bh-open{width:100%}#" + ROOT_ID + " .bh-fab{right:12px;bottom:calc(10px + env(safe-area-inset-bottom,0px));padding-right:13px}body#mpage-body-modern #" + ROOT_ID + " .bh-fab{bottom:calc(78px + env(safe-area-inset-bottom,0px))}#" + ROOT_ID + " .bh-panel{inset:0;width:100vw;height:100dvh;border:0;border-radius:0}#" + ROOT_ID + " .bh-expand{display:none}}"
  ].join("\n");

  var embeddedChatCss = [
    "html,body{background:#66645c!important;color:#fffaf0!important;font-family:Inter,Arial,sans-serif!important}",
    "body,body *,#chatbox,#chatbox *{text-shadow:none!important}",
    ".message-container{height:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:22px!important;background:#66645c!important;color:#fffaf0!important;text-align:center!important}",
    ".message-container .message{max-width:320px!important;margin:0!important;padding:18px!important;background:#747167!important;border:1px solid #8b867b!important;color:#fffaf0!important;font-size:16px!important;line-height:1.45!important}",
    "#chatbox_header{height:48px!important;background:#747167!important;border-bottom:1px solid #8b867b!important}",
    ".chatbox-title{padding:11px 12px!important;width:auto!important;font-size:15px!important}",
    ".chatbox-title a,.chatbox-options a,.chatbox-options li{color:#fffaf0!important}",
    ".chatbox-options{margin:15px 10px 0 0!important}",
    "#chatbox_members,#chatbox_channels{top:48px!important;bottom:66px!important;width:92px!important;background:#747167!important;border-right:1px solid #8b867b!important}",
    "#chatbox_members .member-title,#chatbox_channels .member-title{background:#5f5d55!important;color:#fffaf0!important;font-size:11px!important}",
    "#chatbox_members ul,#chatbox_channels ul{margin:0 4px!important;padding:0!important}",
    "#chatbox_members li,#chatbox_channels li,#chatbox_members li *,#chatbox_channels li *{overflow-wrap:anywhere!important;color:#fffaf0!important}",
    "#chatbox{top:48px!important;left:93px!important;bottom:66px!important;background:#66645c!important;line-height:1.5!important;font-size:14px!important}",
    "#chatbox .chatbox_row_1,#chatbox .chatbox_row_2,#chatbox .chatbox_row_3{padding:10px 11px!important;background:#706e65!important;border-bottom:1px solid #8b867b!important;min-height:44px!important;line-height:1.5!important;color:#fffaf0!important}",
    "#chatbox .chatbox_row_2{background:#77756c!important}",
    "#chatbox .chatbox_row_1 *,#chatbox .chatbox_row_2 *,#chatbox .chatbox_row_3 *,#chatbox .msg,#chatbox .user-msg,#chatbox .date-and-time,#chatbox a{color:#fffaf0!important}",
    "#chatbox .date-and-time{opacity:.82!important}",
    "#chatbox_footer{min-height:66px!important;padding:8px!important;background:#747167!important;border-top:1px solid #8b867b!important;display:flex!important;align-items:center!important;gap:5px!important;flex-wrap:wrap!important}",
    "#chatbox_footer label{color:#fffaf0!important}",
    "#chatbox_footer form{display:flex!important;align-items:center!important;flex:1!important;min-width:0!important;gap:5px!important}",
    "#message{flex:1!important;min-width:70px!important;width:auto!important;max-width:none!important;background:#fffaf0!important;color:#20211f!important;border:1px solid #8b867b!important;border-radius:18px!important;padding:8px 11px!important}",
    "#submit_button{background:#20211f!important;color:#fffaf0!important;border:0!important;border-radius:18px!important;padding:8px 11px!important}",
    "@media(max-width:700px){#chatbox_members,#chatbox_channels{width:78px!important}#chatbox{left:79px!important}#chatbox_footer{min-height:78px!important}#chatbox,#chatbox_members,#chatbox_channels{bottom:78px!important}.chatbox-options{font-size:10px!important;margin-right:5px!important}}"
  ].join("\n");

  var desktopCss = [
    "html,body.bh-desktop-chat{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;background:#56544d!important;color:#fffaf0!important;font-family:Inter,Arial,sans-serif!important}",
    "#bh-desktop-chrome *{box-sizing:border-box}",
    "#bh-server-rail{position:fixed;z-index:30;inset:0 auto 0 0;width:68px;padding:12px 0;background:#3f3e39;border-right:1px solid #777268;display:flex;flex-direction:column;align-items:center;gap:10px}",
    "#bh-server-rail b,#bh-server-rail span{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:#69665e;color:#fffaf0;font:900 11px/1 monospace}",
    "#bh-server-rail b{background:#fffaf0;color:#20211f}",
    "#bh-channel-rail{position:fixed;z-index:29;left:68px;top:0;bottom:0;width:244px;padding:0 10px;background:#5f5d55;border-right:1px solid #8b867b}",
    "#bh-channel-rail header{height:64px;display:flex;align-items:center;padding:0 8px;border-bottom:1px solid #8b867b;font-weight:900;letter-spacing:.04em;color:#fffaf0}",
    "#bh-channel-rail h2{margin:20px 8px 7px;color:#ded7ca;font:800 11px/1 monospace;letter-spacing:.09em}",
    "#bh-channel-rail div{padding:10px 11px;margin:3px 0;border-radius:5px;color:#fffaf0;font-size:14px}",
    "#bh-channel-rail div.active{background:#fffaf0;color:#20211f;font-weight:850}",
    "#bh-channel-rail small{display:block;margin:18px 8px;color:#ece5d8;line-height:1.45}",
    "body.bh-desktop-chat #chatbox_header{position:fixed!important;z-index:20!important;left:312px!important;right:220px!important;top:0!important;width:auto!important;height:64px!important;background:#747167!important;border-bottom:1px solid #8b867b!important}",
    "body.bh-desktop-chat .chatbox-title{padding:20px!important;font-size:17px!important}",
    "body.bh-desktop-chat .chatbox-title:before{content:'#  ';color:#ded7ca}",
    "body.bh-desktop-chat .chatbox-title a,body.bh-desktop-chat .chatbox-options a{color:#fffaf0!important}",
    "body.bh-desktop-chat #chatbox_members,body.bh-desktop-chat #chatbox_channels{position:fixed!important;z-index:21!important;left:auto!important;right:0!important;top:0!important;bottom:0!important;width:220px!important;background:#5f5d55!important;border-left:1px solid #8b867b!important}",
    "body.bh-desktop-chat #chatbox_members .member-title,body.bh-desktop-chat #chatbox_channels .member-title{padding:22px 14px!important;background:#747167!important;color:#fffaf0!important}",
    "body.bh-desktop-chat #chatbox_members li,body.bh-desktop-chat #chatbox_channels li,body.bh-desktop-chat #chatbox_members li *,body.bh-desktop-chat #chatbox_channels li *{color:#fffaf0!important}",
    "body.bh-desktop-chat #chatbox{position:fixed!important;left:312px!important;right:220px!important;top:64px!important;bottom:76px!important;width:auto!important;background:#66645c!important;font-size:15px!important;line-height:1.55!important}",
    "body.bh-desktop-chat #chatbox .chatbox_row_1,body.bh-desktop-chat #chatbox .chatbox_row_2,body.bh-desktop-chat #chatbox .chatbox_row_3{padding:14px 20px!important;background:#706e65!important;border-bottom:1px solid #8b867b!important;color:#fffaf0!important;line-height:1.55!important}",
    "body.bh-desktop-chat #chatbox .chatbox_row_2{background:#77756c!important}",
    "body.bh-desktop-chat #chatbox .chatbox_row_1 *,body.bh-desktop-chat #chatbox .chatbox_row_2 *,body.bh-desktop-chat #chatbox .chatbox_row_3 *,body.bh-desktop-chat #chatbox .msg,body.bh-desktop-chat #chatbox .user-msg,body.bh-desktop-chat #chatbox .date-and-time,body.bh-desktop-chat #chatbox a{color:#fffaf0!important;text-shadow:none!important}",
    "body.bh-desktop-chat #chatbox .date-and-time{opacity:.82!important}",
    "body.bh-desktop-chat #chatbox_footer{position:fixed!important;z-index:20!important;left:312px!important;right:220px!important;bottom:0!important;width:auto!important;min-height:76px!important;padding:14px!important;background:#747167!important;border-top:1px solid #8b867b!important}",
    "body.bh-desktop-chat #message{background:#fffaf0!important;color:#20211f!important;border:0!important;border-radius:20px!important;padding:10px 14px!important}",
    "body.bh-desktop-chat #submit_button{background:#20211f!important;color:#fffaf0!important;border:0!important;border-radius:20px!important;padding:10px 16px!important}",
    "@media(max-width:1100px){body.bh-desktop-chat #chatbox_header{right:0!important}body.bh-desktop-chat #chatbox_members,body.bh-desktop-chat #chatbox_channels{display:none!important}body.bh-desktop-chat #chatbox,body.bh-desktop-chat #chatbox_footer{right:0!important}}"
  ].join("\n");

  function skinFrame(frame) {
    try {
      var doc = frame.contentDocument;
      if (doc && doc.head && doc.getElementById("chatbox")) addStyle(FRAME_STYLE_ID, embeddedChatCss, doc);
    } catch (error) {
      // The ChatBox remains usable even if a future theme isolates the iframe.
    }
  }

  function setupFullPage() {
    var titleLink = document.querySelector(".chatbox-title a");
    if (titleLink && /chatbox/i.test(titleLink.textContent || "")) titleLink.textContent = "Général";
    if (window.innerWidth < 760) {
      document.body.classList.add("bh-mobile-chat");
      addStyle(FRAME_STYLE_ID, embeddedChatCss, document);
      return;
    }
    document.body.classList.add("bh-desktop-chat");
    addStyle(STYLE_ID, desktopCss, document);
    if (!document.getElementById("bh-desktop-chrome")) {
      var chrome = document.createElement("div");
      chrome.id = "bh-desktop-chrome";
      chrome.innerHTML = '<aside id="bh-server-rail" aria-label="Espaces Blockhaus"><b>B//</b><span>G</span><span>I</span><span>T</span><span>30</span><span>AR</span></aside>' +
        '<aside id="bh-channel-rail"><header>BLOCKHAUS / DY10</header><h2>CHAT EN DIRECT</h2><div class="active"># Général</div><h2>ESPACES CIBLES</h2><div># Intermix</div><div># Transmission</div><div># Set/30\'</div><div># Archives</div><small>La ChatBox Forumactif alimente actuellement Général. Les autres salons seront activés avec le backend permanent.</small></aside>';
      document.body.appendChild(chrome);
    }
  }

  function setupWidget() {
    if (document.getElementById(ROOT_ID)) return;
    var existingFrame = nativeFrame();
    var nativeBlock = frameContainer(existingFrame);
    addStyle(STYLE_ID, widgetCss, document);

    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.dataset.version = VERSION;
    root.innerHTML = '<div class="bh-entry"' + (existingFrame ? '' : ' hidden') + '><span class="bh-mark" aria-hidden="true">B//</span><span class="bh-entry-copy"><strong>Chat du Blockhaus</strong><span>La ChatBox reste disponible dans la nouvelle interface.</span></span><button class="bh-open" type="button">Rejoindre le chat</button></div>' +
      '<button class="bh-fab" type="button" aria-controls="bh-chat-panel" aria-expanded="false"><span class="bh-fab-mark">B//<i class="bh-presence"></i></span><span>Chat DY10</span></button>' +
      '<section class="bh-panel" id="bh-chat-panel" role="dialog" aria-modal="true" aria-label="Chat du Blockhaus"><div class="bh-head"><span class="bh-mark" aria-hidden="true">B//</span><span class="bh-head-title">Chat du Blockhaus<small>En direct · interface V12</small></span><a class="bh-head-action bh-expand" href="' + FULL_CHAT_URL + '" target="_blank" rel="noopener" aria-label="Agrandir le chat">↗</a><button class="bh-head-action bh-close" type="button" aria-label="Fermer le chat">×</button></div><iframe title="ChatBox du Blockhaus" data-src="' + CHATBOX_URL + '?bh_widget=1"></iframe></section>';

    if (nativeBlock && nativeBlock.parentNode) nativeBlock.parentNode.insertBefore(root, nativeBlock);
    else document.body.appendChild(root);

    var panel = root.querySelector(".bh-panel");
    var frame = panel.querySelector("iframe");
    var fab = root.querySelector(".bh-fab");
    var previousFocus;

    function close() {
      panel.classList.remove("is-open");
      document.body.classList.remove("bh-chat-open");
      fab.setAttribute("aria-expanded", "false");
      document.body.style.removeProperty("overflow");
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    function open() {
      previousFocus = document.activeElement;
      if (!frame.getAttribute("src")) frame.setAttribute("src", frame.getAttribute("data-src"));
      panel.classList.add("is-open");
      document.body.classList.add("bh-chat-open");
      fab.setAttribute("aria-expanded", "true");
      if (window.innerWidth <= 700) document.body.style.overflow = "hidden";
      root.querySelector(".bh-close").focus();
    }

    frame.addEventListener("load", function () { skinFrame(frame); });
    root.querySelector(".bh-entry .bh-open").addEventListener("click", open);
    fab.addEventListener("click", open);
    root.querySelector(".bh-close").addEventListener("click", close);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) close();
    });
    if (nativeBlock) nativeBlock.style.display = "none";
  }

  ready(function () {
    var params = new URLSearchParams(window.location.search);
    if (/\/chatbox\/?$/i.test(window.location.pathname) || (params.get("bh_desktop") === "1" && document.getElementById("chatbox"))) setupFullPage();
    else setupWidget();
  });
})();
