/* ==========================================================================
   Mental Drawer — shell behaviour
   Owns four preferences (mode, palette, motion, sidebar), the layout shell,
   the scroll gear, and the Settings panel. All state lives in localStorage
   under the md: prefix; every read is guarded because storage can throw.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var MOBILE = '(max-width: 768px)';
  var THEMES = ['brass', 'copper', 'verdigris'];
  var MODES = ['light', 'dark', 'auto'];

  /* --- Preference storage ------------------------------------------------ */

  function read(key, allowed, fallback) {
    try {
      var v = localStorage.getItem('md:' + key);
      return allowed.indexOf(v) > -1 ? v : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem('md:' + key, value); } catch (e) { /* private mode */ }
  }

  function prefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isMobile() {
    return window.matchMedia(MOBILE).matches;
  }

  /* --- Applying preferences ---------------------------------------------- */

  function applyMode(mode) {
    root.setAttribute('data-mode', mode);
    root.setAttribute('data-resolved', mode === 'auto' ? (prefersDark() ? 'dark' : 'light') : mode);
  }

  function setMode(mode) {
    applyMode(mode);
    write('mode', mode);
    syncControls();
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    write('theme', theme);
    syncControls();
  }

  function setMotion(on) {
    root.setAttribute('data-motion', on ? 'on' : 'off');
    write('motion', on ? 'on' : 'off');
    gear.classList.toggle('is-animated', on);
    syncControls();
  }

  function setSidebar(state, remember) {
    root.setAttribute('data-sidebar', state);
    if (remember) { write('sidebar', state); }
    var open = state === 'open';
    if (burgerBtn) {
      burgerBtn.setAttribute('aria-expanded', String(open));
      burgerBtn.setAttribute('aria-label', open ? 'Collapse navigation' : 'Expand navigation');
    }
  }

  function toggleSidebar() {
    var next = root.getAttribute('data-sidebar') === 'open' ? 'closed' : 'open';
    // Mobile is transient: a drawer opened on a phone shouldn't dictate the
    // desktop layout on the next visit.
    setSidebar(next, !isMobile());
  }

  /* --- Icons -------------------------------------------------------------- */

  var ICON = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M5.6 5.6 4 4M20 20l-1.6-1.6M18.4 5.6 20 4M4 20l1.6-1.6"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z"/></svg>',
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/></svg>'
  };

  /* A gear drawn from a single path so it stays crisp at any size. */
  function gearSvg() {
    var teeth = 12, out = 10.4, inn = 8.2, half = Math.PI / teeth * 0.34, d = '';
    for (var i = 0; i < teeth; i++) {
      var a = (i / teeth) * Math.PI * 2;
      var pts = [
        [a - half, out], [a + half, out],
        [a + (Math.PI / teeth) - half, inn], [a + (Math.PI / teeth) + half, inn]
      ];
      for (var j = 0; j < pts.length; j++) {
        var x = (12 + Math.cos(pts[j][0]) * pts[j][1]).toFixed(2);
        var y = (12 + Math.sin(pts[j][0]) * pts[j][1]).toFixed(2);
        d += (i === 0 && j === 0 ? 'M' : 'L') + x + ' ' + y;
      }
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<g class="md-gear__spin" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">' +
      '<path d="' + d + 'Z"/><circle cx="12" cy="12" r="3.6"/></g></svg>';
  }

  /* --- Shell elements ----------------------------------------------------- */

  var header = document.querySelector('.md-header');
  var scrim = document.querySelector('.md-scrim');
  var gear = document.querySelector('.md-gear');
  var burgerBtn = document.querySelector('.md-burger-btn');
  var modeBtn = document.querySelector('.md-mode-btn');

  gear.innerHTML = gearSvg();
  gear.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: root.getAttribute('data-motion') === 'on' ? 'smooth' : 'auto' });
  });

  burgerBtn.addEventListener('click', toggleSidebar);
  scrim.addEventListener('click', function () { setSidebar('closed', false); });

  // The header button is a straight light/dark flip; Auto lives in Settings.
  modeBtn.addEventListener('click', function () {
    setMode(root.getAttribute('data-resolved') === 'dark' ? 'light' : 'dark');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMobile() && root.getAttribute('data-sidebar') === 'open') {
      setSidebar('closed', false);
    }
  });

  /* --- Scroll gear -------------------------------------------------------- */

  var ticking = false;

  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset || root.scrollTop;
      var max = Math.max(1, root.scrollHeight - window.innerHeight);
      var pct = Math.min(1, Math.max(0, y / max));
      gear.style.setProperty('--gear-rotation', (pct * 720).toFixed(1) + 'deg');
      gear.classList.toggle('is-visible', y > 120);
      gear.setAttribute('aria-label', 'Scrolled ' + Math.round(pct * 100) + '% — back to top');
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* --- Settings panel ----------------------------------------------------- */

  var GROUPS = [
    {
      key: 'mode',
      label: 'Appearance',
      hint: 'Auto follows whatever your operating system is set to.',
      options: [
        { value: 'light', label: 'Light', icon: ICON.sun },
        { value: 'dark', label: 'Dark', icon: ICON.moon },
        { value: 'auto', label: 'Auto', icon: ICON.auto }
      ]
    },
    {
      key: 'theme',
      label: 'Theme',
      hint: 'Each palette works in both light and dark.',
      options: [
        { value: 'brass', label: 'Brass', swatch: 'brass' },
        { value: 'copper', label: 'Copper', swatch: 'copper' },
        { value: 'verdigris', label: 'Verdigris', swatch: 'verdigris' }
      ]
    },
    {
      key: 'motion',
      label: 'Motion',
      hint: 'The scroll gear still shows your position when animation is off.',
      options: [
        { value: 'on', label: 'Animate gear' },
        { value: 'off', label: 'Still gear' }
      ]
    }
  ];

  function buildPanel(host) {
    host.innerHTML = '';
    host.className = 'settings-panel';

    GROUPS.forEach(function (group) {
      var wrap = document.createElement('div');
      wrap.className = 'settings-group';

      var label = document.createElement('p');
      label.className = 'settings-group__label';
      label.textContent = group.label;

      var hint = document.createElement('p');
      hint.className = 'settings-group__hint';
      hint.textContent = group.hint;

      var opts = document.createElement('div');
      opts.className = 'settings-options';
      opts.setAttribute('role', 'radiogroup');
      opts.setAttribute('aria-label', group.label);

      group.options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'settings-option';
        btn.setAttribute('role', 'radio');
        btn.dataset.group = group.key;
        btn.dataset.value = opt.value;

        if (opt.icon) {
          var span = document.createElement('span');
          span.innerHTML = opt.icon;
          btn.appendChild(span.firstChild);
        }
        if (opt.swatch) {
          var sw = document.createElement('span');
          sw.className = 'settings-swatch settings-swatch--' + opt.swatch;
          btn.appendChild(sw);
        }

        btn.appendChild(document.createTextNode(opt.label));
        btn.addEventListener('click', function () {
          if (group.key === 'mode') { setMode(opt.value); }
          else if (group.key === 'theme') { setTheme(opt.value); }
          else { setMotion(opt.value === 'on'); }
        });

        opts.appendChild(btn);
      });

      wrap.appendChild(label);
      wrap.appendChild(hint);
      wrap.appendChild(opts);
      host.appendChild(wrap);
    });

    syncControls();
  }

  /* Reflects current state onto whichever controls happen to be on screen. */
  function syncControls() {
    var current = {
      mode: root.getAttribute('data-mode'),
      theme: root.getAttribute('data-theme'),
      motion: root.getAttribute('data-motion')
    };

    Array.prototype.forEach.call(document.querySelectorAll('.settings-option'), function (btn) {
      btn.setAttribute('aria-checked', String(current[btn.dataset.group] === btn.dataset.value));
    });

    if (modeBtn) {
      var dark = root.getAttribute('data-resolved') === 'dark';
      modeBtn.innerHTML = dark ? ICON.sun : ICON.moon;
      modeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      modeBtn.setAttribute('title', modeBtn.getAttribute('aria-label'));
    }
  }

  /* --- Docsify integration ------------------------------------------------ */

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.doneEach(function () {
      var host = document.getElementById('settings-panel');
      if (host) { buildPanel(host); }

      // A tap on a drawer link should close the drawer behind it.
      if (isMobile()) { setSidebar('closed', false); }

      onScroll();
    });
  });

  /* --- Boot --------------------------------------------------------------- */

  applyMode(read('mode', MODES, 'auto'));
  setTheme(read('theme', THEMES, 'brass'));
  setMotion(read('motion', ['on', 'off'], 'on') === 'on');
  setSidebar(isMobile() ? 'closed' : read('sidebar', ['open', 'closed'], 'open'), false);
  syncControls();

  // Track the OS only while the user has actually asked us to.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (root.getAttribute('data-mode') === 'auto') {
      applyMode('auto');
      syncControls();
    }
  });

  // Crossing the breakpoint restores the remembered desktop state.
  var mobileQuery = window.matchMedia(MOBILE);
  mobileQuery.addEventListener('change', function (e) {
    setSidebar(e.matches ? 'closed' : read('sidebar', ['open', 'closed'], 'open'), false);
  });

  onScroll();
})();
