/* PWA glue: service-worker registration + save-to-home-screen UI. */
(function () {
  'use strict';

  /* ---- register the service worker ---- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(function (reg) {
          reg.addEventListener('updatefound', function () {
            reg.installing && reg.installing.addEventListener('statechange', function (ev) {
              if (ev.target.state === 'installed' &&
                  navigator.serviceWorker.controller) {
                // quietly refresh in the background so she never sees a stale site
                setTimeout(function () { location.reload(); }, 4000);
              }
            });
          });
        })
        .catch(function (err) { console.warn('SW register failed (non-fatal):', err); });
    });
  }

  /* ---- save-to-home-screen section ---- */
  var installSection = document.getElementById('installSection');
  var installBtn = document.getElementById('installBtn');
  var installHint = document.getElementById('installHint');
  var deferredPrompt = null;

  if (!installSection || !installBtn) return;

  function hideSection() {
    installSection.classList.add('install-hidden');
    try { localStorage.setItem('adedolapo-pwa-dismissed', '1'); } catch (e) {}
  }

  function showSection() { installSection.classList.remove('install-hidden'); }

  // already running as an installed app → never show the nudge
  var standalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
    || document.referrer.indexOf('android-app://') === 0;
  if (standalone) { hideSection(); return; }

  // Android / desktop Chrome + Edge fire this when installable
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (!isDismissed()) showSection();
  });

  installBtn.addEventListener('click', function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choice) {
        if (choice.outcome === 'accepted') hideSection();
        deferredPrompt = null;
      }).catch(function () { deferredPrompt = null; });
    } else {
      // iOS Safari or unsupported browser → highlight the share button
      installBtn.classList.add('install-wobble');
      installHint.classList.add('install-hint-flash');
      setTimeout(function () {
        installBtn.classList.remove('install-wobble');
        installHint.classList.remove('install-hint-flash');
      }, 2600);
    }
  });

  var closeBtn = document.getElementById('installClose');
  if (closeBtn) closeBtn.addEventListener('click', hideSection);

  function isDismissed() {
    try { return localStorage.getItem('adedolapo-pwa-dismissed') === '1'; } catch (e) { return false; }
  }

  // if the browser never offers the native prompt (e.g. iOS), still show
  // the section so she sees the manual instructions
  setTimeout(function () {
    if (!deferredPrompt && !isDismissed() && !standalone) showSection();
  }, 6000);

  // log the install for a sweet post-install touch
  window.addEventListener('appinstalled', function () {
    hideSection();
    try {
      var s = window.burstConfetti;
      if (s) setTimeout(s, 300);
    } catch (e) {}
    try {
      var wishes = JSON.parse(localStorage.getItem('adedolapo-pwa-installed') || '[]');
      wishes.push(new Date().toISOString());
      localStorage.setItem('adedolapo-pwa-installed', JSON.stringify(wishes.slice(-3)));
    } catch (e) {}
  });
})();
