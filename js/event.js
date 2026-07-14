/* ═══════════════════════════════════════════════════
   EVENT DOMAIN — filters, saved/favorite state, share,
   card rendering. What tab files actually reach for.
   (Shared utilities — safe to load after tab files parse, since they only
    *call* these at runtime, never at their own parse time; see CLAUDE.md.)
   ═══════════════════════════════════════════════════ */

const WEEKDAYS = '日一二三四五六';

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

// Two overlapping circles — flags an EVENTS entry as more than one buluo's
// own event (`buluo_ids` merge or `joint:true` umbrella), used by
// namesHtml() below and js/timeline.js's band rendering.
const MULTI_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="12" r="6" stroke="currentColor" stroke-width="1.6"/><circle cx="15" cy="12" r="6" stroke="currentColor" stroke-width="1.6"/></svg>`;

// Shared by namesHtml() and js/timeline.js — title text explains *why* the
// icon appears, distinguishing a hand-curated buluo_ids merge (same
// venue/date, see docs/ROADMAP-v2.md v2-O) from a joint/umbrella event that
// was never one specific buluo to begin with.
function multiBadgeHtml(v) {
  if (v.buluo_ids) return `<span class="card-multi" title="本活動由 ${v.buluo_ids.length} 個登記部落共同舉行">${MULTI_SVG}</span>`;
  if (v.joint) return `<span class="card-multi" title="聯合／跨部落活動">${MULTI_SVG}</span>`;
  return '';
}

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
// Read once at boot (see js/shell.js's BOOT section) via URLSearchParams(location.search).
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

/* ═══════════════════════════════════════════════════
   ADD TO CALENDAR (v2-L)
   ═══════════════════════════════════════════════════ */

const CALENDAR_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

function pad2(n) { return String(n).padStart(2, '0'); }
function icsDateStamp(d) { return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`; }

// Builds a Google Calendar "quick add" link for one entry — no file
// involved, Google reads the event straight off the query string. Only
// meaningful for status:'confirmed' — 'tbd'/'cancelled' entries carry
// placeholder date strings ('未定'/'停辦') that parseStartDate() can't
// parse, so this naturally returns null for them; callers gate on status
// anyway (see js/detail.js) rather than relying on that fallthrough.
function googleCalendarUrl(v) {
  const start = parseStartDate(v.date);
  if (!start) return null;
  // Google's all-day `dates` end, like ICS's DTEND, is exclusive — same
  // +1-day step covers both the single-day and multi-day cases.
  const dtEnd = parseEndDate(v.date) || start;
  const end = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate() + 1);

  const hasVenue = v.venue && v.venue !== '—';
  const location = [hasVenue ? v.venue : null, `${v.county}${v.township}`].filter(Boolean).join(', ');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${v.chinese} 豐年祭`,
    dates: `${icsDateStamp(start)}/${icsDateStamp(end)}`,
    details: `由 Pokoh 提供\n${shareUrl(v.id)}`,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function onCalendarTap(id) {
  const v = EVENTS.find(x => x.id === id);
  if (!v) return;
  const url = googleCalendarUrl(v);
  if (!url) return;
  trackEvent('add_to_calendar_click', { id });
  window.open(url, '_blank', 'noopener');
}

// Date strings mix Latin digits/punctuation with a trailing CJK weekday
// character (e.g. "7/3 五–7/11 六"). At equal font-size the CJK glyph reads
// larger than the digits — same mismatch as .card-chinese vs .card-amis,
// just inverted here: the digits must stay their current size, so the
// weekday character is what gets scaled down (.card-date-weekday in
// app.css). Also normalizes the range dash (–/—) to "~".
// Matches an optional leading space + weekday char so "7/13 一" renders as
// "7/13(一)" — the space is consumed, not left dangling before the "(".
const WEEKDAY_SUFFIX_RE = new RegExp(` ?([${WEEKDAYS}])`, 'g');
// Some source data (mostly tt_chenggong* entries) never included a weekday
// character at all, unlike most `date` strings — matches a bare "M/D" not
// already followed by one, so it can be computed and inserted instead of
// silently rendering as a shorter, inconsistent-looking date. Assumes 2026,
// same convention as js/dates.js's parseStartDate()/parseEndDate().
const MD_NO_WEEKDAY_RE = new RegExp(`(\\d{1,2})/(\\d{1,2})(?!\\d)(?!\\s?[${WEEKDAYS}])`, 'g');
function dateHtml(dateStr) {
  const withWeekdays = dateStr.replace(MD_NO_WEEKDAY_RE, (m, mo, da) =>
    `${m} ${WEEKDAYS[new Date(2026, Number(mo) - 1, Number(da)).getDay()]}`
  );
  return withWeekdays
    .replace(/[–—]/g, '~')
    .replace(WEEKDAY_SUFFIX_RE, (_, c) => `<span class="card-date-weekday">(${c})</span>`);
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

// Resolves the administrative 村/里 for an EVENTS entry, same
// buluo-identity-lives-in-BULUO_REF pattern as js/dates.js's eventCoord() —
// not a hand-curated EVENTS field, sourced from Datasets/buluo/*.json's own
// `village` and threaded through by build_buluo_ref.js. `buluo_ids`-merged
// entries join each distinct village named, in case the merged buluo sit in
// different administrative villages.
function eventVillage(v) {
  if (typeof BULUO_REF === 'undefined') return null;
  if (v.buluo_ids) {
    const villages = [...new Set(v.buluo_ids.map(id => BULUO_REF[id]?.village).filter(Boolean))];
    return villages.length ? villages.join('、') : null;
  }
  return (v.buluo_id && BULUO_REF[v.buluo_id]?.village) || null;
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
  return `<div class="card-names"${namesTitle}>${multiBadgeHtml(v)}<span class="card-chinese">${v.chinese}</span>${altHtml}${amisHtml}</div>`;
}

// Resolves per-village schedule/poster detail (schedule.js), merging a
// village-specific poster with the shared-by-`src` fallback so a single
// poster asset can cover many EVENTS entries without duplication.
function getScheduleDetail(v) {
  const d = (typeof SCHEDULE_DETAILS !== 'undefined' && SCHEDULE_DETAILS[v.id]) || null;
  const poster = d?.poster || (typeof SCHEDULE_POSTERS !== 'undefined' && SCHEDULE_POSTERS[v.src]) || null;
  return { poster, days: d?.days || null, history: d?.history || null, contacts: d?.contacts || null };
}

// Strips the trailing admin-unit character (縣/市/鄉/鎮/區) so county/township
// can sit side by side on narrow screens without the suffixes eating space
// that carries no extra information there — full names still shown at
// desktop width, see `.card-loc-desktop`/`.card-loc-mobile` in app.css.
function shortAdmin(name) {
  return name ? name.replace(/[縣市鄉鎮區]$/, '') : '';
}

// The name/date/venue block shared by the card list view and the detail
// overlay's header — so the overlay reads as the same card, just expanded
// in place, not a differently-laid-out summary. Source attribution is
// deliberately omitted here — it's secondary info, kept in the detail
// overlay only, not worth the row space on every card.
// `showWelcome: false` (used by the detail overlay) omits the inline badge
// since that view renders its own larger `.detail-welcome` pill instead —
// avoids showing 迎賓日 info twice in the same header.
// `forceDesktopLoc: true` (used by the detail overlay) always renders the
// full county/township + venue name string, regardless of actual viewport
// width — the overlay is a deliberate, independent "more info" view, not
// meant to inherit the list card's mobile-vs-desktop space-saving swap.
// May ellipsis-truncate on narrow screens for now; that's an accepted
// tradeoff, not a bug to chase yet.
function cardBodyHtml(v, { showWelcome = true, forceDesktopLoc = false, ...nameOpts } = {}) {
  const hasVenue = v.venue && v.venue !== '—';
  const coord    = eventCoord(v);
  const mapsUrl  = hasVenue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.venue)}`
    : `https://www.google.com/maps/search/?api=1&query=${coord?.[0]},${coord?.[1]}`;
  // Desktop has room for the venue name itself plus full county/township;
  // mobile drops the venue name and shows a shortened county/township(/village)
  // string instead — long venue names were the wrapping culprit on narrow
  // screens, while county/township(/village) is short and bounded-length.
  const desktopLocText = `${v.county}${v.township}` + (hasVenue ? ` · ${v.venue}` : '');
  const locHtml = forceDesktopLoc
    ? `<span class="card-venue-text">${desktopLocText}</span>`
    : (() => {
        const village = eventVillage(v);
        const mobileLocText = `${shortAdmin(v.county)}・${shortAdmin(v.township)}${village ? `・${village}` : ''}`;
        return `<span class="card-venue-text card-loc-desktop">${desktopLocText}</span><span class="card-venue-text card-loc-mobile">${mobileLocText}</span>`;
      })();
  const venueHtml = `<div class="card-venue-wrap"><a class="card-venue" href="${mapsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><svg class="card-pin" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>${locHtml}</a></div>`;
  const welcomeTimeText = v.welcome_time ? ` ${v.welcome_time}` : '';
  const welcomeHtml = (showWelcome && v.welcome_date)
    ? `<span class="card-welcome" title="迎賓日 ${v.welcome_date}${welcomeTimeText}">迎賓 ${dateHtml(v.welcome_date)}</span>`
    : '';
  const saveHtml = `<button class="card-save${isSaved(v.id) ? ' saved' : ''}" data-save-id="${v.id}" aria-label="收藏" onclick="event.stopPropagation(); onSaveTap('${v.id}')">${BOOKMARK_SVG}</button>`;
  const shareHtml = `<button class="card-share" data-share-id="${v.id}" aria-label="分享" onclick="event.stopPropagation(); onShareTap('${v.id}')">${SHARE_SVG}</button>`;
  return `<div class="card-top">
      ${namesHtml(v, nameOpts)}
      <span class="card-date">${dateHtml(v.date)}</span>
    </div>
    <div class="card-meta">
      <div class="card-icons">
        ${shareHtml}
        ${saveHtml}
      </div>
      ${venueHtml}
      ${welcomeHtml}
    </div>`;
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
