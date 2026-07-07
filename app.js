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
// gates what's *displayed*; lookups by known id (VILLAGES.find) and the
// info-tab contribution form intentionally see the full dataset.
let activeGroupFilter = 'ami';
function visibleVillages() {
  return VILLAGES.filter(v => v.group === activeGroupFilter);
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

function dayDecade(d) {
  if (d <= 10) return '上旬';
  if (d <= 20) return '中旬';
  return '下旬';
}

function clusterKey(v) {
  const d = parseStartDate(v.date);
  if (!d) return v.chinese;
  return `${d.getMonth() + 1}月${dayDecade(d.getDate())}`;
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
// poster asset can cover many VILLAGES entries without duplication.
function getScheduleDetail(v) {
  const d = (typeof SCHEDULE_DETAILS !== 'undefined' && SCHEDULE_DETAILS[v.id]) || null;
  const poster = d?.poster || (typeof SCHEDULE_POSTERS !== 'undefined' && SCHEDULE_POSTERS[v.src]) || null;
  return { poster, welcome: d?.welcome || null, days: d?.days || null, history: d?.history || null };
}

// The name/date/venue/source block shared by the card list view and the
// detail overlay's header — so the overlay reads as the same card, just
// expanded in place, not a differently-laid-out summary.
function cardBodyHtml(v, nameOpts) {
  const sourceHtml = `<a class="card-source" href="${SOURCES[v.src].url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${SOURCES[v.src].label} ↗</a>`;
  const hasVenue   = v.venue && v.venue !== '—';
  const mapsUrl    = hasVenue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.venue)}`
    : `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`;
  const venueHtml  = hasVenue
    ? `<a class="card-venue" href="${mapsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><svg class="card-pin" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg><span class="card-venue-text">${v.venue}</span></a>`
    : '';
  return `<div class="card-top">
      ${namesHtml(v, nameOpts)}
      <span class="card-date">${dateHtml(v.date)}</span>
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
