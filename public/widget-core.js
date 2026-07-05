/**
 * 2all.ai Accessibility Widget Core Engine
 * Version: 2.0.0
 * Fully responsive, Shadow-DOM isolated AI accessibility floating menu.
 */
(function () {
  if (window.__2ALL_CORE_INITIALIZED__) return;
  window.__2ALL_CORE_INITIALIZED__ = true;

  var config = window.__2ALL_CONFIG__ || {
    primaryColor: "#2563eb",
    position: "bottom-right",
    size: "medium",
    enabledTools: ["text-resize", "high-contrast", "dark-mode", "highlight-links", "readable-font", "screen-reader"],
  };

  var primaryColor = config.primaryColor || "#2563eb";
  var position = config.position || "bottom-right";
  var size = config.size || "medium";
  var enabledTools = config.enabledTools || ["text-resize", "high-contrast", "dark-mode", "highlight-links", "readable-font", "screen-reader"];

  // State management
  var state = {
    open: false,
    fontSizeMultiplier: 1,
    highContrast: false,
    darkMode: false,
    highlightLinks: false,
    readableFont: false,
    screenReader: false,
  };

  try {
    var saved = localStorage.getItem("2all_widget_state");
    if (saved) {
      var parsed = JSON.parse(saved);
      state = Object.assign(state, parsed);
      state.open = false; // Always closed on load
    }
  } catch (e) {}

  function saveState() {
    try {
      localStorage.setItem("2all_widget_state", JSON.stringify(state));
    } catch (e) {}
  }

  // Create host container with Shadow DOM
  var host = document.createElement("div");
  host.id = "2all-ai-widget-host";
  host.style.position = "fixed";
  host.style.zIndex = "2147483647";
  host.style.pointerEvents = "none";

  // Positioning
  var posStyles = {
    "bottom-right": "bottom: 24px; right: 24px;",
    "bottom-left": "bottom: 24px; left: 24px;",
    "top-right": "top: 24px; right: 24px;",
    "top-left": "top: 24px; left: 24px;",
  };
  host.style.cssText += posStyles[position] || posStyles["bottom-right"];

  document.body.appendChild(host);

  var shadow = host.attachShadow({ mode: "open" });

  // Styles inside shadow DOM
  var styleTag = document.createElement("style");
  styleTag.textContent = `
    * { box-sizing: border-box; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .widget-container { pointer-events: auto; display: flex; flex-direction: column; align-items: flex-end; }
    .widget-container.left { align-items: flex-start; }
    
    /* Floating Button */
    .trigger-btn {
      width: ${size === "large" ? "64px" : size === "small" ? "48px" : "56px"};
      height: ${size === "large" ? "64px" : size === "small" ? "48px" : "56px"};
      border-radius: 50%;
      background: ${primaryColor};
      color: white;
      border: 3px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      outline: none;
    }
    .trigger-btn:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.4);
    }
    .trigger-btn:active { transform: scale(0.95); }
    .trigger-btn svg { width: 60%; height: 60%; fill: currentColor; }

    /* Menu Drawer */
    .menu-panel {
      width: 340px;
      max-height: 80vh;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      margin-bottom: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
    }
    .menu-panel.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .header {
      padding: 18px 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title { font-size: 15px; font-weight: 800; color: #f8fafc; letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; }
    .badge { background: ${primaryColor}; color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .reset-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .reset-btn:hover { background: rgba(255,255,255,0.1); color: white; }

    .tools-grid {
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      overflow-y: auto;
    }
    
    .tool-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 14px 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      transition: all 0.2s;
      color: #94a3b8;
      user-select: none;
    }
    .tool-card:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
      transform: translateY(-2px);
    }
    .tool-card.active {
      background: ${primaryColor};
      border-color: rgba(255, 255, 255, 0.4);
      color: #ffffff;
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
    }
    .tool-icon { font-size: 20px; }
    .tool-label { font-size: 12px; font-weight: 700; line-height: 1.2; }
    .tool-sub { font-size: 10px; opacity: 0.8; }

    .footer {
      padding: 12px 20px;
      background: rgba(0, 0, 0, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .footer a { color: #94a3b8; text-decoration: none; font-weight: 700; }
  `;
  shadow.appendChild(styleTag);

  var container = document.createElement("div");
  container.className = "widget-container " + (position.indexOf("left") !== -1 ? "left" : "");

  // Menu Panel
  var panel = document.createElement("div");
  panel.className = "menu-panel";
  
  var header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
    <div class="header-title">
      <span>2all.ai</span>
      <span class="badge">AI Powered</span>
    </div>
    <button class="reset-btn" id="reset-all">Reset All</button>
  `;
  panel.appendChild(header);

  var grid = document.createElement("div");
  grid.className = "tools-grid";
  panel.appendChild(grid);

  var footer = document.createElement("div");
  footer.className = "footer";
  footer.innerHTML = `Powered by <a href="https://2all.ai" target="_blank">2all.ai Accessibility</a>`;
  panel.appendChild(footer);

  container.appendChild(panel);

  // Trigger Button
  var btn = document.createElement("button");
  btn.className = "trigger-btn";
  btn.setAttribute("aria-label", "Toggle Accessibility Widget");
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>`;
  container.appendChild(btn);

  shadow.appendChild(container);

  // Tool Definitions
  var tools = [
    { id: "text-resize", label: "Text Size", icon: "Aa", sub: () => Math.round(state.fontSizeMultiplier * 100) + "%" },
    { id: "high-contrast", label: "High Contrast", icon: "◑", sub: () => (state.highContrast ? "On" : "Off") },
    { id: "dark-mode", label: "Dark Mode", icon: "☾", sub: () => (state.darkMode ? "On" : "Off") },
    { id: "highlight-links", label: "Highlight Links", icon: "🔗", sub: () => (state.highlightLinks ? "On" : "Off") },
    { id: "readable-font", label: "Readable Font", icon: "Tt", sub: () => (state.readableFont ? "On" : "Off") },
    { id: "screen-reader", label: "Voice Reader", icon: "🔊", sub: () => (state.screenReader ? "On" : "Off") },
  ];

  var toolElements = {};

  function renderTools() {
    grid.innerHTML = "";
    tools.forEach(function (t) {
      if (enabledTools.indexOf(t.id) === -1 && enabledTools.length > 0) return;
      var card = document.createElement("div");
      card.className = "tool-card";
      var isActive = false;
      if (t.id === "text-resize") isActive = state.fontSizeMultiplier !== 1;
      else isActive = state[t.id === "high-contrast" ? "highContrast" : t.id === "dark-mode" ? "darkMode" : t.id === "highlight-links" ? "highlightLinks" : t.id === "readable-font" ? "readableFont" : "screenReader"];

      if (isActive) card.className += " active";
      card.innerHTML = `
        <div class="tool-icon">${t.icon}</div>
        <div class="tool-label">${t.label}</div>
        <div class="tool-sub" id="sub-${t.id}">${t.sub()}</div>
      `;
      card.onclick = function () { handleToolClick(t.id); };
      grid.appendChild(card);
      toolElements[t.id] = card;
    });
  }

  function handleToolClick(id) {
    if (id === "text-resize") {
      if (state.fontSizeMultiplier === 1) state.fontSizeMultiplier = 1.15;
      else if (state.fontSizeMultiplier === 1.15) state.fontSizeMultiplier = 1.3;
      else if (state.fontSizeMultiplier === 1.3) state.fontSizeMultiplier = 1.5;
      else state.fontSizeMultiplier = 1;
    } else if (id === "high-contrast") {
      state.highContrast = !state.highContrast;
      if (state.highContrast) state.darkMode = false;
    } else if (id === "dark-mode") {
      state.darkMode = !state.darkMode;
      if (state.darkMode) state.highContrast = false;
    } else if (id === "highlight-links") {
      state.highlightLinks = !state.highlightLinks;
    } else if (id === "readable-font") {
      state.readableFont = !state.readableFont;
    } else if (id === "screen-reader") {
      state.screenReader = !state.screenReader;
      if (state.screenReader && window.speechSynthesis) {
        var u = new SpeechSynthesisUtterance("Voice reader enabled.");
        window.speechSynthesis.speak(u);
      }
    }
    saveState();
    applyDOMEffects();
    renderTools();
  }

  function applyDOMEffects() {
    // 1. Font Size
    document.documentElement.style.fontSize = state.fontSizeMultiplier !== 1 ? (state.fontSizeMultiplier * 100) + "%" : "";

    // 2. High Contrast & Dark Mode Filter
    var existingFilter = document.getElementById("2all-style-overrides");
    if (!existingFilter) {
      existingFilter = document.createElement("style");
      existingFilter.id = "2all-style-overrides";
      document.head.appendChild(existingFilter);
    }

    var css = "";
    if (state.highContrast) {
      css += `html { filter: invert(1) hue-rotate(180deg) !important; background: #000 !important; } #2all-ai-widget-host { filter: invert(1) hue-rotate(180deg) !important; } `;
    } else if (state.darkMode) {
      css += `html { background-color: #0f172a !important; color: #e2e8f0 !important; } `;
    }

    if (state.highlightLinks) {
      css += `a { background-color: #fef08a !important; color: #0f172a !important; outline: 2px solid #2563eb !important; text-decoration: underline !important; font-weight: bold !important; } `;
    }

    if (state.readableFont) {
      css += `* { font-family: 'Comic Sans MS', 'OpenDyslexic', 'Arial', sans-serif !important; letter-spacing: 0.05em !important; word-spacing: 0.1em !important; } `;
    }

    existingFilter.textContent = css;
  }

  // Voice Reader Hover handler
  document.addEventListener("mouseover", function (e) {
    if (!state.screenReader || !window.speechSynthesis) return;
    var target = e.target;
    if (target && (target.tagName === "A" || target.tagName === "BUTTON" || target.tagName === "H1" || target.tagName === "H2" || target.tagName === "H3" || target.tagName === "P" || target.tagName === "SPAN")) {
      var text = target.innerText || target.textContent;
      if (text && text.trim().length > 0 && text.trim().length < 150) {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text.trim());
        u.rate = 1.1;
        window.speechSynthesis.speak(u);
      }
    }
  });

  // Reset
  shadow.getElementById("reset-all").onclick = function () {
    state.fontSizeMultiplier = 1;
    state.highContrast = false;
    state.darkMode = false;
    state.highlightLinks = false;
    state.readableFont = false;
    state.screenReader = false;
    saveState();
    applyDOMEffects();
    renderTools();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  btn.onclick = function () {
    state.open = !state.open;
    if (state.open) {
      panel.className = "menu-panel open";
    } else {
      panel.className = "menu-panel";
    }
  };

  // Initial render
  renderTools();
  applyDOMEffects();
})();
