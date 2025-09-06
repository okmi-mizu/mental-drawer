// Theme Switcher JavaScript
(function() {
  'use strict';

  // Theme configuration
  const themes = {
    blue: {
      name: 'Dark Blue',
      cssFile: 'libs/theme-blue.css'
    },
    brown: {
      name: 'Dark Brown',
      cssFile: 'libs/theme-brown.css'
    },
    purple: {
      name: 'Dark Purple',
      cssFile: 'libs/theme-purple.css'
    }
  };

  let currentTheme = 'blue'; // default theme
  let themeLink = null;

  // Load theme from localStorage or use default
  function loadSavedTheme() {
    const saved = localStorage.getItem('docsify-theme');
    if (saved && themes[saved]) {
      currentTheme = saved;
    }
    return currentTheme;
  }

  // Save theme to localStorage
  function saveTheme(theme) {
    localStorage.setItem('docsify-theme', theme);
  }

  // Apply theme by loading CSS file
  function applyTheme(themeName) {
    if (!themes[themeName]) return;

    // Remove existing theme link
    if (themeLink) {
      themeLink.remove();
    }

    // Create new theme link
    themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = themes[themeName].cssFile;
    themeLink.id = 'theme-css';

    // Insert after the base CSS
    const head = document.head;
    const baseCSS = head.querySelector('link[href*="vue.css"]') || head.querySelector('link[href*="dark.css"]');
    if (baseCSS) {
      baseCSS.insertAdjacentElement('afterend', themeLink);
    } else {
      head.appendChild(themeLink);
    }

    currentTheme = themeName;
    saveTheme(themeName);
    updateActiveButton();
  }

  // Update active button state
  function updateActiveButton() {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
  }

  // Create theme switcher UI
  function createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';

    const label = document.createElement('span');
    label.className = 'theme-switcher-label';
    label.textContent = 'Theme';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'theme-buttons';

    // Create theme buttons
    Object.keys(themes).forEach(themeKey => {
      const button = document.createElement('button');
      button.className = `theme-btn ${themeKey}`;
      button.dataset.theme = themeKey;
      button.title = themes[themeKey].name;
      button.addEventListener('click', () => applyTheme(themeKey));
      buttonsContainer.appendChild(button);
    });

    switcher.appendChild(label);
    switcher.appendChild(buttonsContainer);
    document.body.appendChild(switcher);
  }

  // Initialize theme switcher
  function init() {
    // Load saved theme or default
    const savedTheme = loadSavedTheme();

    // Create switcher UI
    createThemeSwitcher();

    // Apply initial theme
    applyTheme(savedTheme);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose theme switcher API for potential future use
  window.ThemeSwitcher = {
    setTheme: applyTheme,
    getCurrentTheme: () => currentTheme,
    getAvailableThemes: () => Object.keys(themes)
  };
})();
