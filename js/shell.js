/* ═══════════════════════════════════════════════════
   APP SHELL — theme, tab switching, PWA, service worker, boot.
   Loads last (same position app.js used to occupy) since BOOT calls
   initTimeline()/openDetail() directly at parse time, which must run after
   every tab file has defined them.
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════ */

const THEMES  = ['', 'folad', 'riyar', 'fois'];
const T_LABEL = ['☀', '◑', '〰', '✦'];
const T_TITLE = ['Cidal', 'Folad', 'Riyar', "Fo'is"];
let themeIdx  = 0;

function applyTheme(idx) {
  themeIdx = idx % THEMES.length;
  document.documentElement.dataset.theme = THEMES[themeIdx];
  document.querySelectorAll('[data-theme-btn]').forEach(b => {
    b.textContent = T_LABEL[themeIdx];
    b.title = T_TITLE[themeIdx];
  });
  localStorage.setItem('pokoh-theme', String(themeIdx));
  /* Mobile status bar (Android/Chrome) — match .app-header's actual
     background (var(--bg)) instead of the static amber fallback baked
     into index.html for pre-JS paint. */
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) themeColorMeta.setAttribute('content', getComputedStyle(document.body).backgroundColor);
  // js/map.js listens for this to swap its tile layer's light/dark variant —
  // dispatched rather than called directly since shell.js loads last and
  // can't assume map.js internals; see js/map.js's own comment on the listener.
  document.dispatchEvent(new CustomEvent('pokoh:theme-changed'));
}
(function initTheme() {
  const saved = Number.parseInt(localStorage.getItem('pokoh-theme') ?? '0', 10);
  applyTheme(Number.isNaN(saved) ? 0 : saved);
})();
document.querySelectorAll('[data-theme-btn]').forEach(b =>
  b.addEventListener('click', () => applyTheme(themeIdx + 1))
);

/* ═══════════════════════════════════════════════════
   TAB SWITCHING
   ═══════════════════════════════════════════════════ */

let currentTab      = 'timeline';
let infoInitialized = false;

function switchTab(name) {
  if (name === currentTab) return;
  trackEvent('tab_switch', { tab: name });
  document.getElementById('panel-' + currentTab).classList.remove('active');
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelectorAll('.tab-btn, .sb-link').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === name)
  );
  document.body.className = 'tab-' + name;
  currentTab = name;

  if (name !== 'map' && window.innerWidth >= 768 && bsState !== 'collapsed') {
    setSheetState('collapsed');
  }
  if (name === 'map') {
    if (mapInitialized) {
      leafletMap.invalidateSize();
    } else {
      initMap();
    }
  }
  if (name === 'info' && !infoInitialized) {
    initInfo();
    infoInitialized = true;
  }
}

document.querySelector('.tab-bar').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (btn) switchTab(btn.dataset.tab);
});
document.getElementById('sidebar').addEventListener('click', e => {
  const btn = e.target.closest('.sb-link');
  if (btn) switchTab(btn.dataset.tab);
});

/* ═══════════════════════════════════════════════════
   PWA
   ═══════════════════════════════════════════════════ */

let deferredPrompt = null;
globalThis.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').hidden = false;
});
document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  trackEvent('pwa_install', { outcome });
  deferredPrompt = null;
  document.getElementById('installBtn').hidden = true;
});

/* ═══════════════════════════════════════════════════
   SERVICE WORKER
   ═══════════════════════════════════════════════════ */

if ('serviceWorker' in navigator) {
  /* sw.js skips waiting and claims clients on its own; once it takes over,
     reload so this tab picks up the new shell rather than running stale JS
     against a freshly-swapped cache. */
  let swRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (swRefreshing) return;
    swRefreshing = true;
    location.reload();
  });

  globalThis.addEventListener('load', async () => {
    const reg = await navigator.serviceWorker.register('/sw.js').catch(() => {});
    if (!reg) return;
    /* Force a byte-diff check now and whenever the installed app regains focus. */
    reg.update();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update();
    });
  });
}

/* ═══════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════ */

/* Mark the document as JS-ready (hides the static Phase C prerender content) */
document.documentElement.classList.add('js-ready');

initTimeline();

// Shared-event deep link (v2-I) — ?v=<id>, opens straight into the v2-A
// detail overlay. openDetail is defined in js/detail.js, which loads before
// this file per the script-order convention (see CLAUDE.md).
const sharedEventId = new URLSearchParams(location.search).get('v');
if (sharedEventId && EVENTS.some(v => v.id === sharedEventId)) {
  openDetail(sharedEventId, 'share_link');
}
