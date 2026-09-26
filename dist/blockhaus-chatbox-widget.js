(function () {
  "use strict";

  var ROOT_ID = "bh-chat-widget";
  var STYLE_ID = "bh-chat-widget-style";
  var FRAME_STYLE_ID = "bh-chat-frame-style";
  var CHATBOX_URL = "/chatbox/";

  // Disable this script in Forumactif to restore the original entry point.
  if (window.top !== window.self || document.getElementById(ROOT_ID)) return;

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  function nativeFrame() {
    return Array.prototype.find.call(document.querySelectorAll("iframe"), function (frame) {
      return /\/chatbox(?:\/|\?|$)/i.test(frame.getAttribute("src") || "") || /chatbox/i.test(frame.getAttribute("title") || "");
    });
  }

  function frameContainer(frame) {
    if (!frame) return null;
    var candidate = frame.closest(".forumline, .module, .panel, .chatbox, table");
    // Theme tables can span whole pages: never hide one containing other frames.
    if (candidate && candidate.querySelectorAll("iframe").length === 1 && candidate.getBoundingClientRect().height < 900) return candidate;
    return frame;
  }

  function addStyle(id, css, doc) {
    if (doc.getElementById(id)) return;
    var style = doc.createElement("style");
    style.id = id;
    style.textContent = css;
    doc.head.appendChild(style);
  }

  var forumCss = [
    "#" + ROOT_ID + "{--bh-gray:#928e85;--bh-gray-light:#b4b0a6;--bh-ink:#20211f;--bh-paper:#f4f1e9;font-family:Arial,sans-serif;color:var(--bh-ink)}",
    "#" + ROOT_ID + " *{box-sizing:border-box}",
    "#" + ROOT_ID + " button{font:inherit;cursor:pointer}",
    "#" + ROOT_ID + " .bh-entry{max-width:760px;margin:18px auto;padding:16px;background:var(--bh-gray);border:1px solid #66635c;display:flex;align-items:center;gap:12px}",
    "#" + ROOT_ID + " .bh-mark{width:43px;height:43px;display:grid;place-items:center;flex:none;background:var(--bh-ink);color:var(--bh-paper);font-weight:900}",
    "#" + ROOT_ID + " .bh-entry-copy{flex:1;min-width:0}",
    "#" + ROOT_ID + " .bh-entry-copy strong{display:block;font-size:17px}",
    "#" + ROOT_ID + " .bh-entry-copy span{display:block;margin-top:3px;font-size:12px}",
    "#" + ROOT_ID + " .bh-open{border:0;background:var(--bh-ink);color:var(--bh-paper);font-weight:bold;padding:11px 15px}",
    "#" + ROOT_ID + " .bh-fab{position:fixed;z-index:99997;right:16px;bottom:16px;border:0;border-radius:24px;background:var(--bh-gray-light);color:var(--bh-ink);padding:12px 17px;box-shadow:0 8px 24px #0005;font-weight:bold}",
    "#" + ROOT_ID + " .bh-panel{position:fixed;z-index:99998;right:12px;bottom:12px;width:min(440px,calc(100vw - 24px));height:min(690px,calc(100dvh - 24px));display:none;flex-direction:column;background:var(--bh-gray);border:1px solid #66635c;box-shadow:0 20px 60px #0008}",
    "#" + ROOT_ID + " .bh-panel.is-open{display:flex}",
    "#" + ROOT_ID + " .bh-head{display:flex;align-items:center;gap:10px;padding:11px;background:var(--bh-gray-light);border-bottom:1px solid #77736b}",
    "#" + ROOT_ID + " .bh-head-title{flex:1;min-width:0;font-size:15px;font-weight:bold}",
    "#" + ROOT_ID + " .bh-head-title small{display:block;font-size:11px;font-weight:normal}",
    "#" + ROOT_ID + " .bh-close{border:0;background:transparent;color:var(--bh-ink);font-size:26px;line-height:1;width:36px;height:36px}",
    "#" + ROOT_ID + " iframe{display:block;flex:1;width:100%;min-height:0;border:0;background:var(--bh-gray)}",
    "#" + ROOT_ID + " [hidden]{display:none!important}",
    "@media(max-width:620px){#" + ROOT_ID + " .bh-entry{margin:12px 0;flex-wrap:wrap}#" + ROOT_ID + " .bh-entry .bh-open{width:100%}#" + ROOT_ID + " .bh-fab{left:12px;right:12px;bottom:10px}#" + ROOT_ID + " .bh-panel{inset:0;width:100vw;height:100dvh;border:0}}"
  ].join("\n");

  // Native ChatBox selectors observed on the active Blockhaus Forumactif theme.
  // Sending, presence and refresh remain managed by Forumactif.
  var chatCss = [
    "html,body{background:#928e85!important;color:#20211f!important;font-family:Arial,sans-serif!important}",
    "#chatbox_header{height:48px!important;background:#b4b0a6!important;border-bottom:1px solid #77736b!important}",
    ".chatbox-title{padding:11px 12px!important;width:auto!important;font-size:17px!important}",
    ".chatbox-title a,.chatbox-options a,.chatbox-options li{color:#20211f!important}",
    ".chatbox-options{margin:16px 12px 0 0!important}",
    "#chatbox_members,#chatbox_channels{top:48px!important;bottom:65px!important;width:105px!important;background:#a7a39a!important;border-right:1px solid #77736b!important}",
    "#chatbox_members .member-title,#chatbox_channels .member-title{background:#b4b0a6!important;color:#20211f!important;font-size:12px!important}",
    "#chatbox_members ul,#chatbox_channels ul{margin:0 4px!important;padding:0!important}",
    "#chatbox_members li,#chatbox_channels li{overflow-wrap:anywhere!important}",
    "#chatbox{top:48px!important;left:106px!important;bottom:65px!important;line-height:1.45!important;background:#928e85!important}",
    "#chatbox .chatbox_row_1,#chatbox .chatbox_row_2,#chatbox .chatbox_row_3{padding:10px!important;background:#928e85!important;border-bottom:1px solid #77736b!important;min-height:46px!important;line-height:1.45!important}",
    "#chatbox .chatbox_row_2{background:#a39f96!important}",
    "#chatbox_footer{min-height:65px!important;padding:8px!important;background:#b4b0a6!important;border-top:1px solid #77736b!important;display:flex!important;align-items:center!important;gap:5px!important;flex-wrap:wrap!important}",
    "#chatbox_footer label{color:#20211f!important}",
    "#chatbox_footer form{display:flex!important;align-items:center!important;flex:1!important;min-width:0!important;gap:5px!important}",
    "#message{flex:1!important;min-width:75px!important;width:auto!important;max-width:none!important;background:#f4f1e9!important;color:#20211f!important;border:1px solid #77736b!important;border-radius:16px!important;padding:7px 10px!important}",
    "#submit_button{background:#20211f!important;color:#f4f1e9!important;border:0!important;border-radius:16px!important;padding:7px 10px!important}",
    "@media(max-width:620px){#chatbox_members,#chatbox_channels{width:78px!important}#chatbox{left:79px!important}#chatbox_footer{min-height:78px!important}#chatbox,#chatbox_members,#chatbox_channels{bottom:78px!important}.chatbox-options{font-size:10px!important;margin-right:5px!important}}"
  ].join("\n");

  function skinFrame(frame) {
    try {
      var doc = frame.contentDocument;
      if (doc && doc.head && doc.getElementById("chatbox")) addStyle(FRAME_STYLE_ID, chatCss, doc);
    } catch (error) {
      // If a theme moves ChatBox to another origin, the native UI still works.
    }
  }

  ready(function () {
    var existingFrame = nativeFrame();
    var nativeBlock = frameContainer(existingFrame);
    addStyle(STYLE_ID, forumCss, document);

    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML = '<div class="bh-entry"' + (existingFrame ? '' : ' hidden') + '><span class="bh-mark" aria-hidden="true">B//</span><span class="bh-entry-copy"><strong>Chat du Blockhaus</strong><span>Retrouvez les membres connectés sur le forum.</span></span><button class="bh-open" type="button">Rejoindre le chat</button></div>' +
      '<button class="bh-fab" type="button" aria-controls="bh-chat-panel" aria-expanded="false">Chat DY10</button>' +
      '<section class="bh-panel" id="bh-chat-panel" role="dialog" aria-modal="true" aria-label="Chat du Blockhaus"><div class="bh-head"><span class="bh-mark" aria-hidden="true">B//</span><span class="bh-head-title">Chat du Blockhaus<small>En direct sur le forum</small></span><button class="bh-close" type="button" aria-label="Fermer le chat">×</button></div><iframe title="ChatBox du Blockhaus" data-src="' + CHATBOX_URL + '"></iframe></section>';

    if (nativeBlock && nativeBlock.parentNode) nativeBlock.parentNode.insertBefore(root, nativeBlock);
    else document.body.appendChild(root);

    var panel = root.querySelector(".bh-panel");
    var frame = panel.querySelector("iframe");
    var fab = root.querySelector(".bh-fab");
    var previousFocus;

    function close() {
      panel.classList.remove("is-open");
      fab.setAttribute("aria-expanded", "false");
      document.body.style.removeProperty("overflow");
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    function open() {
      previousFocus = document.activeElement;
      if (!frame.getAttribute("src")) frame.setAttribute("src", frame.getAttribute("data-src"));
      panel.classList.add("is-open");
      fab.setAttribute("aria-expanded", "true");
      if (window.innerWidth <= 620) document.body.style.overflow = "hidden";
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
  });
})();
