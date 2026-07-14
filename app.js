/* ═══════════════════════════════════════════════════
   SHARED UTILITIES
   (must be defined before tab files' callbacks fire,
    but tab files are parsed first — that's fine because
    these functions are only *called* at runtime, not at
    tab file parse time)
   ═══════════════════════════════════════════════════ */

const DECADE_DAY = { '上': 5, '中': 15, '下': 25 };
const WEEKDAYS   = '日一二三四五六';

// Group filter shared by every browsing tab (timeline/map/search). No UI to
// change this yet — hardcoded to 'ami' until a group selector lands. Only
// gates what's *displayed*; lookups by known id (EVENTS.find) and the
// info-tab contribution form intentionally see the full dataset.
let activeGroupFilter = 'ami';
// "Saved only" view toggle (v2-H) — a second filter on the same choke point
// as activeGroupFilter, so flipping it narrows timeline/map/search at once
// instead of needing a dedicated saved-items view. Deliberately NOT persisted
// across reloads (unlike the saved ids themselves, see SAVED_KEY below) — a
// user who forgets they left it on shouldn't reopen the app to an
// apparently-empty timeline.
let savedOnlyFilter = false;
function visibleEvents() {
  return EVENTS.filter(v => v.group === activeGroupFilter && (!savedOnlyFilter || isSaved(v.id)));
}

/* ═══════════════════════════════════════════════════
   SAVED / FAVORITE EVENTS
   ═══════════════════════════════════════════════════ */

const SAVED_KEY = 'pokoh-saved-events';

// Re-reads localStorage each call rather than caching a module-level Set —
// dataset is a couple hundred entries, cost is negligible, and it avoids a
// second source of truth to keep in sync (same tradeoff getRecents() in
// js/search.js already makes for recent searches).
function getSavedIds() {
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')); }
  catch { return new Set(); }
}
function isSaved(id) {
  return getSavedIds().has(id);
}
function toggleSaved(id) {
  const s = getSavedIds();
  const nowSaved = !s.has(id);
  nowSaved ? s.add(id) : s.delete(id);
  localStorage.setItem(SAVED_KEY, JSON.stringify([...s]));
  trackEvent('save_event_click', { id, saved: nowSaved });
  return nowSaved;
}

const BOOKMARK_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

// Handles a tap on any per-card save button (timeline/search/map-sheet cards,
// detail overlay). Re-renders the currently visible list only when the
// saved-only filter is active, so unsaving a card while filtered-to-saved
// drops it immediately — otherwise the button's own class flip is enough.
function onSaveTap(id) {
  const nowSaved = toggleSaved(id);
  document.querySelectorAll(`[data-save-id="${id}"]`).forEach(b => b.classList.toggle('saved', nowSaved));
  if (savedOnlyFilter) refreshVisibleTabs();
}

// Re-renders every tab currently mounted, called when the set of visible
// events changes for a reason no single tab's own filter-change handler
// already covers (the global saved-only toggle, or unsaving a card while
// that toggle is active).
function refreshVisibleTabs() {
  renderStrip();
  renderDayCards();
  if (mapInitialized) {
    updateMarkers();
    renderSheet();
  }
  renderSearchResults();
}

function applySavedOnlyFilter(active) {
  savedOnlyFilter = active;
  document.querySelectorAll('[data-saved-filter-btn]').forEach(b => b.classList.toggle('active', active));
  refreshVisibleTabs();
}
document.querySelectorAll('[data-saved-filter-btn]').forEach(b =>
  b.addEventListener('click', () => {
    applySavedOnlyFilter(!savedOnlyFilter);
    trackEvent('saved_filter_toggle', { active: savedOnlyFilter });
  })
);

/* ═══════════════════════════════════════════════════
   SHARE (v2-I)
   ═══════════════════════════════════════════════════ */

const SHARE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

// Query-string-on-the-single-page-app scheme — no server routes involved.
// Read once at boot (see BOOT section) via URLSearchParams(location.search).
function shareUrl(id) {
  return `${location.origin}${location.pathname}?v=${id}`;
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

function copyShareLink(url) {
  navigator.clipboard.writeText(url)
    .then(() => showToast('連結已複製'))
    .catch(() => showToast(url));
}

// Web Share API where available (mobile mostly); clipboard-copy fallback
// elsewhere. AbortError (user cancelled the native share sheet) is not a
// failure — only fall back to clipboard on a real error.
async function shareEvent(id, name) {
  const url = shareUrl(id);
  trackEvent('share_click', { id });
  if (navigator.share) {
    try { await navigator.share({ title: `${name} 豐年祭 - Pokoh`, url }); return; }
    catch (err) { if (err.name === 'AbortError') return; }
  }
  copyShareLink(url);
}

function onShareTap(id) {
  const v = EVENTS.find(x => x.id === id);
  if (v) shareEvent(id, v.chinese);
}

// Date strings mix Latin digits/punctuation with a trailing CJK weekday
// character (e.g. "7/3 五–7/11 六"). At equal font-size the CJK glyph reads
// larger than the digits — same mismatch as .card-chinese vs .card-amis,
// just inverted here: the digits must stay their current size, so the
// weekday character is what gets scaled down (.card-date-weekday in
// app.css). Also normalizes the range dash (–/—) to "~".
const WEEKDAY_RE = new RegExp(`[${WEEKDAYS}]`, 'g');
function dateHtml(dateStr) {
  return dateStr
    .replace(/[–—]/g, '~')
    .replace(WEEKDAY_RE, c => `<span class="card-date-weekday">${c}</span>`);
}

function parseStartDate(str) {
  const slash = str.match(/(\d{1,2})\/(\d{1,2})/);
  if (slash) return new Date(2026, Number(slash[1]) - 1, Number(slash[2]));
  const decade = str.match(/(\d{1,2})月([上中下])旬/);
  if (decade) return new Date(2026, Number(decade[1]) - 1, DECADE_DAY[decade[2]]);
  return null;
}

function parseEndDate(str) {
  const m = str.match(/\d{1,2}\/\d{1,2}[^–—]*[–—](\d{1,2})\/(\d{1,2})/);
  if (m) return new Date(2026, Number(m[1]) - 1, Number(m[2]));
  return null;
}


// Indigenous/romanized name resolution shared by namesHtml() and the detail
// overlay header (js/detail.js puts this name in the sticky header bar
// instead of inline with the Chinese name, so both need the same lookup).
function indigenousNameInfo(v) {
  const ref        = v.buluo_id && typeof BULUO_REF !== 'undefined' ? BULUO_REF[v.buluo_id] : null;
  const latinName  = v.amis || ref?.indigenous_name || '';
  const tooltipParts = [
    ...(ref?.chinese_name_alt || []),
    ...(ref ? [ref.indigenous_name, ...ref.indigenous_name_alt] : (v.amis ? [v.amis] : []))
  ].filter(Boolean);
  return { ref, latinName, tooltipParts };
}

// Resolves the best available coordinate for an EVENTS entry. Priority:
// 1. `venueOverride:true` — hand-curated flag for the rare case where the
//    festival is genuinely held somewhere other than the buluo's own
//    community (not the default; must be set explicitly per entry).
// 2. BULUO_REF's coordinate, if it's been geocoded to `'exact'` (real
//    per-venue) or `'village'` (named landmark/administrative-village
//    anchor — still better than a township-wide centroid) precision —
//    buluo identity/location now lives in the shared Datasets/buluo db,
//    not duplicated per-project.
// 3. This entry's own lat/lng — usually still just a township-level
//    approximation, kept as a fallback so nothing regresses while BULUO_REF
//    coverage is incomplete.
// 4. BULUO_REF's coordinate at any precision, else null (no pin).
const GOOD_COORD_PRECISION = new Set(['exact', 'village']);
function eventCoord(v) {
  if (v.venueOverride && v.lat != null && v.lng != null) return [v.lat, v.lng];
  const ref = v.buluo_id && typeof BULUO_REF !== 'undefined' ? BULUO_REF[v.buluo_id] : null;
  if (GOOD_COORD_PRECISION.has(ref?.coord_precision) && ref.lat != null && ref.lng != null) return [ref.lat, ref.lng];
  if (v.lat != null && v.lng != null) return [v.lat, v.lng];
  if (ref?.lat != null && ref.lng != null) return [ref.lat, ref.lng];
  return null;
}

// `showAmis: false` omits the indigenous name from this block — used by the
// detail overlay, which shows it in its own sticky header instead.
function namesHtml(v, { showAmis = true } = {}) {
  const { ref, latinName, tooltipParts } = indigenousNameInfo(v);
  // Alt names are shown as "primary (alt)" — parenthesized alt already reads
  // as "this village" from context, so a trailing 部落 on the alt (e.g.
  // 都蘭部落) is redundant with the primary's own 部落 suffix; strip it for
  // display only (BULUO_REF keeps the full name).
  const altChinese = ref?.chinese_name_alt?.[0]?.replace(/部落$/, '') || null;
  const altLatin   = ref?.indigenous_name_alt?.[0] || null;
  const namesTitle = tooltipParts.length
    ? ` title="${tooltipParts.join(' / ').replace(/"/g, '&quot;')}"` : '';
  const altHtml    = altChinese ? ` <span class="card-chinese-alt">(${altChinese})</span>` : '';
  const amisAltHtml = (showAmis && altLatin) ? ` <span class="card-amis-alt">(${altLatin})</span>` : '';
  const amisHtml   = (showAmis && latinName) ? `<span class="card-amis">${latinName}</span>${amisAltHtml}` : '';
  return `<div class="card-names"${namesTitle}><span class="card-chinese">${v.chinese}</span>${altHtml}${amisHtml}</div>`;
}

// Resolves per-village schedule/poster detail (schedule.js), merging a
// village-specific poster with the shared-by-`src` fallback so a single
// poster asset can cover many EVENTS entries without duplication.
function getScheduleDetail(v) {
  const d = (typeof SCHEDULE_DETAILS !== 'undefined' && SCHEDULE_DETAILS[v.id]) || null;
  const poster = d?.poster || (typeof SCHEDULE_POSTERS !== 'undefined' && SCHEDULE_POSTERS[v.src]) || null;
  return { poster, days: d?.days || null, history: d?.history || null };
}

// The name/date/venue/source block shared by the card list view and the
// detail overlay's header — so the overlay reads as the same card, just
// expanded in place, not a differently-laid-out summary.
// `showWelcome: false` (used by the detail overlay) omits the inline badge
// since that view renders its own larger `.detail-welcome` pill instead —
// avoids showing 迎賓日 info twice in the same header.
function cardBodyHtml(v, { showWelcome = true, ...nameOpts } = {}) {
  const sourceHtml = `<a class="card-source" href="${SOURCES[v.src].url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${SOURCES[v.src].label} ↗</a>`;
  const hasVenue   = v.venue && v.venue !== '—';
  const coord      = eventCoord(v);
  const mapsUrl    = hasVenue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.venue)}`
    : `https://www.google.com/maps/search/?api=1&query=${coord?.[0]},${coord?.[1]}`;
  const venueHtml  = hasVenue
    ? `<a class="card-venue" href="${mapsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><svg class="card-pin" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg><span class="card-venue-text">${v.venue}</span></a>`
    : '';
  const welcomeTimeText = v.welcome_time ? ` ${v.welcome_time}` : '';
  const welcomeHtml = (showWelcome && v.welcome_date)
    ? `<span class="card-welcome" title="迎賓日 ${v.welcome_date}${welcomeTimeText}">迎賓 ${dateHtml(v.welcome_date)}</span>`
    : '';
  const saveHtml = `<button class="card-save${isSaved(v.id) ? ' saved' : ''}" data-save-id="${v.id}" aria-label="收藏" onclick="event.stopPropagation(); onSaveTap('${v.id}')">${BOOKMARK_SVG}</button>`;
  const shareHtml = `<button class="card-share" data-share-id="${v.id}" aria-label="分享" onclick="event.stopPropagation(); onShareTap('${v.id}')">${SHARE_SVG}</button>`;
  return `<div class="card-top">
      ${shareHtml}
      ${namesHtml(v, nameOpts)}
      <div class="card-top-right">
        <span class="card-date">${dateHtml(v.date)}</span>
        ${welcomeHtml}
        ${saveHtml}
      </div>
    </div>
    <div class="card-meta">${venueHtml}${sourceHtml}</div>`;
}

function cardHtml(v, extraAttrs) {
  return `<div class="village-card card-${v.status}" id="card-${v.id}" ${extraAttrs}>
    ${cardBodyHtml(v)}
  </div>`;
}

function addDragScroll(el) {
  let down = false, startX, startLeft, didDrag = false;
  el.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    down = true; didDrag = false;
    startX = e.clientX; startLeft = el.scrollLeft;
  });
  document.addEventListener('mousemove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) { didDrag = true; el.scrollLeft = startLeft - dx; }
  });
  document.addEventListener('mouseup', () => { down = false; });
  /* Block child clicks that follow a drag (capture phase fires before child handlers) */
  el.addEventListener('click', e => {
    if (didDrag) { didDrag = false; e.stopImmediatePropagation(); }
  }, true);
}

function trackEvent(name, data) {
  window.umami?.track(name, data);
}

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
  openDetail(sharedEventId);
}
