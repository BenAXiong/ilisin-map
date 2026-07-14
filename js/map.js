/* ═══════════════════════════════════════════════════
   MAP + BOTTOM SHEET
   ═══════════════════════════════════════════════════ */

let leafletMap    = null;
let tileLayer     = null;
let labelsLayer   = null;
let satelliteOn   = false;
let clusterGroup  = null;
let plainGroup    = null;
let clusterModeOn = false;
let mapInitialized = false;
let markers       = {};
let activeId      = null;
let bsState       = 'collapsed';
let TAP_NEXT      = null;
let countyFilter   = 'all';
let timeFilter     = 'all';
let townshipFilter = null;
let customStart    = null;
let customEnd      = null;

const TIME_LABELS = {
  all: '全期', today: '今天', tomorrow: '明天', '7days': '7天',
  'next-weekend': '下週末', custom: '自訂',
};

// yyyy-mm-dd from local date parts — Date#toISOString() converts to UTC
// first, which can land on the wrong calendar day near local midnight.
function toDateInputValue(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Theme custom properties (app.css), not literal hex — so pins recolor with
// the active theme instead of staying stuck in Cidal's amber/gray. Inactive
// confirmed uses --accent at reduced alpha rather than --amber-pale: pale is
// an absolute lightness bump (l + 0.28) tuned for Cidal's accent (57% l) —
// on folad/fois, whose accents already sit at 68-72% l to pop off a near-
// black bg, that same bump clips to ~100% l and washes out to white.
// Alpha preserves the hue at any base lightness instead.
//
// Teardrop pin (SVG, not CSS-rotated-square) so the anchor point can sit
// exactly on the drawn tip without fighting a runtime transform. The small
// bg-colored dot in the wide part is a placeholder "glyph slot" — v2 only
// ever displays the `ami` group, so there's nothing to visually distinguish
// yet; a per-group glyph goes there in v3 without needing to touch this
// geometry again. className stays '' (like the old icon) since all visual
// state lives in the html string's own classes, not Leaflet's wrapper.
function makeIcon(status, isActive) {
  const colors = {
    confirmed: isActive ? 'var(--accent)'  : 'oklch(from var(--accent) l c h / 0.55)',
    tbd:       isActive ? 'var(--text-2)'  : 'var(--text-3)',
    cancelled: isActive ? 'var(--text-2)'  : 'var(--text-3)',
  };
  const c = colors[status] || colors.confirmed;
  return L.divIcon({
    className: '',
    html: `<div class="marker-pin-wrap${isActive ? ' is-active' : ''}">
      <svg width="28" height="36" viewBox="0 0 24 32">
        <path d="M12 1C5.925 1 1 5.925 1 12c0 8.5 11 19 11 19s11-10.5 11-19C23 5.925 18.075 1 12 1z"
              fill="${c}" stroke="var(--bg)" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4" fill="var(--bg)"/>
      </svg>
    </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 35],
    popupAnchor: [0, -30],
  });
}

// Pins are drawn at a fixed SVG size, then scaled per zoom level via CSS
// (see .marker-pin-wrap rules in app.css) so this only needs to keep one
// data attribute on #map in sync — no marker re-creation on zoom.
function updateZoomTier() {
  if (!leafletMap) return;
  const mapEl = document.getElementById('map');
  const z = leafletMap.getZoom();
  if (!mapEl || typeof z !== 'number' || Number.isNaN(z)) return;
  mapEl.dataset.zoomTier = z <= 9 ? 'far' : z >= 14 ? 'near' : 'mid';
}

function setSheetState(state, from) {
  bsState = state;
  if (state === 'collapsed') TAP_NEXT = null;
  const bs = document.getElementById('bottomSheet');
  if (bs) {
    bs.dataset.state = state;
    // scrollIntoView propagates up to #panel-map (overflow:hidden but still
    // scrollable via scrollTop in Chrome), which would visually cancel the
    // sheet's CSS translateY. Reset on every state change as a safety net.
    const panel = document.getElementById('panel-map');
    if (panel && panel.scrollTop !== 0) panel.scrollTop = 0;
    if (from === 'marker' && state === 'half' && window.innerWidth < 768) {
      const mapEl = document.getElementById('map');
      if (mapEl && leafletMap) leafletMap.invalidateSize();
    }
  }
  // #mapFloatCard is mobile's replacement for the sheet's "half" state (see
  // its CSS) — just needs to track the same collapsed-vs-selected distinction,
  // not the half/full split, since a single floating card has no "full" size.
  const floatCard = document.getElementById('mapFloatCard');
  if (floatCard) floatCard.hidden = state === 'collapsed';
}

function deselect() {
  if (activeId && markers[activeId]) {
    const v = EVENTS.find(x => x.id === activeId);
    if (v) markers[activeId].setIcon(makeIcon(v.status, false));
  }
  activeId = null;
  TAP_NEXT = null;
  setSheetState('collapsed');
}

// The Saturday/Sunday of the *following* weekend, i.e. always skipping the
// nearest upcoming Sat/Sun (already covered by the "7天" filter) — except
// when today is itself a Sunday, whose nearest upcoming Saturday (6 days
// out) is already past the weekend today sits in, so it's "next", not "this".
function nextWeekendRange(today) {
  const day = today.getDay(); // 0 Sun .. 6 Sat
  let daysToSat = (6 - day + 7) % 7;
  if (day !== 0) daysToSat += 7;
  const sat = new Date(today); sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(sat);   sun.setDate(sat.getDate() + 1);
  return [sat, sun];
}

function matchesTime(v) {
  if (timeFilter === 'all') return true;
  const start = parseStartDate(v.date);
  if (!start) return false;
  const end = parseEndDate(v.date) ?? start;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  if (timeFilter === 'today') return start <= today && end >= today;

  if (timeFilter === 'tomorrow') {
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    return start <= tomorrow && end >= tomorrow;
  }

  if (timeFilter === 'next-weekend') {
    const [sat, sun] = nextWeekendRange(today);
    return start <= sun && end >= sat;
  }

  if (timeFilter === 'custom') {
    if (!customStart || !customEnd) return true;
    return start <= customEnd && end >= customStart;
  }

  const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 6);
  return start <= weekEnd && end >= today;
}

function filteredEvents() {
  return visibleEvents().filter(v => {
    if (countyFilter !== 'all' && v.county !== countyFilter) return false;
    if (townshipFilter && v.township !== townshipFilter) return false;
    return matchesTime(v);
  });
}

function renderTownshipChips() {
  const el = document.getElementById('mapTownshipChips');
  if (!el) return;
  if (countyFilter === 'all') { el.hidden = true; return; }
  // Mobile flyout spawns beside whichever county button is active, not
  // always at the top of the toggle — offsetTop is relative to
  // #mapCountyChips, which itself starts flush with .map-loc's top edge, so
  // it doubles as the flyout's offset within .map-loc (its positioned
  // ancestor). No-op on desktop, where the sub-list sits in normal flow.
  const activeBtn = document.querySelector('#mapCountyChips .map-chip.active');
  el.style.top = activeBtn ? `${activeBtn.offsetTop}px` : '';
  const townships = [...new Set(
    visibleEvents().filter(v => v.county === countyFilter && v.township).map(v => v.township)
  )].sort();
  el.innerHTML = townships.map(t =>
    `<button class="map-chip${townshipFilter === t ? ' active' : ''}" data-township="${t}">${t}</button>`
  ).join('');
  el.hidden = townships.length === 0;
}

function fitToFilter() {
  if (!leafletMap) return;
  const coords = filteredEvents().map(eventCoord).filter(Boolean);
  if (!coords.length) return;
  if (coords.length === 1) {
    leafletMap.setView(coords[0], 13, { animate: true });
  } else {
    leafletMap.fitBounds(coords, { padding: [40, 40], maxZoom: 14, animate: true });
  }
}

function renderSheet() {
  const content = document.getElementById('bsContent');
  if (!content) return;

  const statusOrder = { confirmed: 0, tbd: 1, cancelled: 2 };
  const displayed = filteredEvents()
    .slice()
    .sort((a, b) => {
      const sd = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2);
      if (sd !== 0) return sd;
      const da = parseStartDate(a.date), db = parseStartDate(b.date);
      if (da && db) return da - db;
      return 0;
    });

  content.innerHTML = displayed.length
    ? displayed.map(v => makeSectionHtml(v)).join('')
    : '<p class="bs-empty">無符合的部落</p>';
}

function makeSectionHtml(v) {
  return cardHtml(v, `data-vid="${v.id}" onclick="openDetail('${v.id}')"`);
}

// #mapFloatCard's content — same card markup as the sheet's list rows (see
// makeSectionHtml), just one of them, plus a close button since there's no
// drag-to-dismiss handle on a floating card the way there is on the sheet.
function renderFloatCard(v) {
  const card = document.getElementById('mapFloatCard');
  if (!card || !v) return;
  card.innerHTML = `<button class="map-float-close" aria-label="關閉" onclick="deselect()">✕</button>${makeSectionHtml(v)}`;
}

function activateVillage(id) {
  if (activeId && markers[activeId]) {
    const prev = EVENTS.find(x => x.id === activeId);
    if (prev) markers[activeId].setIcon(makeIcon(prev.status, false));
  }
  activeId = id;

  if (markers[id]) markers[id].setIcon(makeIcon(EVENTS.find(v => v.id === id)?.status, true));

  renderSheet();
  renderFloatCard(EVENTS.find(v => v.id === id));
  setSheetState('half');

  document.querySelectorAll('.village-card').forEach(c =>
    c.classList.toggle('active', c.dataset.vid === id)
  );

  // Scroll only #bsContent to land the activated card at the top of the
  // visible area. Same reason: avoid scrollIntoView propagating to #panel-map.
  // Deferred past the sheet's CSS transition (.35s) so getBoundingClientRect
  // values are stable when we compute the target scroll position. Desktop
  // only — mobile shows #mapFloatCard instead of scrolling to a card inside
  // the (now hidden) sheet.
  if (window.innerWidth >= 768) {
    setTimeout(() => {
      const bsContent = document.getElementById('bsContent');
      const card = bsContent?.querySelector(`.village-card[data-vid="${id}"]`);
      if (card && bsContent) {
        const top = card.getBoundingClientRect().top - bsContent.getBoundingClientRect().top + bsContent.scrollTop;
        bsContent.scrollTo({ top, behavior: 'smooth' });
      }
    }, 360);
  }

  trackEvent('village_tap', { id, name: EVENTS.find(v => v.id === id)?.chinese });
}

// The layer group actually attached to the map right now — clustered
// (default) or every pin shown individually at its exact position.
function activeMarkerGroup() {
  return clusterModeOn ? clusterGroup : plainGroup;
}

function goToMapVillage(id) {
  const v = EVENTS.find(x => x.id === id);
  const coord = v && eventCoord(v);
  if (!coord) return;
  switchTab('map');
  setTimeout(() => {
    if (!leafletMap) return;
    // activateVillage runs first and unconditionally, so the sheet reaches
    // 'half' immediately rather than depending on zoomToShowLayer's async
    // callback — that callback can be delayed by a cluster spiderfy, and on
    // mobile that gap was enough for the sheet to end up looking fully open
    // instead of half by the time everything settled.
    activateVillage(id);
    const marker = markers[id];
    // zoomToShowLayer (leaflet.markercluster) zooms/pans to whatever level
    // actually reveals this marker on its own — a fixed zoom level can't
    // guarantee that in denser areas, it might still be inside a cluster blob.
    // Only meaningful in clustered mode; in individual mode every marker is
    // already visible on its own, so just pan/zoom straight to it.
    if (clusterModeOn && marker && clusterGroup.hasLayer(marker)) {
      clusterGroup.zoomToShowLayer(marker, () => {});
    } else {
      leafletMap.setView(coord, 16, { animate: true });
    }
  }, leafletMap ? 0 : 400);
}

function updateMarkers() {
  if (!leafletMap) return;
  const group = activeMarkerGroup();
  group.clearLayers();
  markers = {};

  filteredEvents().forEach(v => {
    const coord = eventCoord(v);
    if (!coord) return;
    const m = L.marker(coord, { icon: makeIcon(v.status, false) });
    m.on('click', () => {
      if (TAP_NEXT === v.id) {
        setSheetState('full');
        TAP_NEXT = null;
        return;
      }
      TAP_NEXT = v.id;
      activateVillage(v.id);
    });
    group.addLayer(m);
    markers[v.id] = m;
  });
}

function setClusterMode(on) {
  if (on === clusterModeOn || !leafletMap) return;
  const oldGroup = activeMarkerGroup();
  clusterModeOn = on;
  updateMarkers();
  leafletMap.removeLayer(oldGroup);
  leafletMap.addLayer(activeMarkerGroup());
}

function initSheetDrag() {
  const bs    = document.getElementById('bottomSheet');
  const bar   = document.getElementById('bsHandleBar');
  if (!bs || !bar) return;

  let startY = 0, startState = 'collapsed', isDragging = false;
  const STATES = ['collapsed', 'half', 'full'];

  function onStart(y) {
    startY     = y;
    startState = bsState;
    isDragging = true;
    bs.style.transition = 'none';
  }
  function onMove(y) {
    if (!isDragging) return;
    const dy = y - startY;
    bs.style.transform = dy > 0 ? `translateY(${dy}px)` : '';
  }
  function onEnd(y) {
    if (!isDragging) return;
    isDragging = false;
    bs.style.transition = '';
    bs.style.transform  = '';
    const dy   = y - startY;
    const idx  = STATES.indexOf(startState);
    if (dy < -40 && idx < STATES.length - 1) setSheetState(STATES[idx + 1]);
    else if (dy > 40 && idx > 0)             setSheetState(STATES[idx - 1]);
    else                                     setSheetState(startState);
  }

  bar.addEventListener('touchstart', e => { onStart(e.touches[0].clientY); }, { passive: true });
  bar.addEventListener('touchmove',  e => { onMove(e.touches[0].clientY);  }, { passive: true });
  bar.addEventListener('touchend',   e => { onEnd(e.changedTouches[0].clientY); });
  bar.addEventListener('mousedown',  e => {
    onStart(e.clientY);
    const mm = e2 => onMove(e2.clientY);
    const mu = e2 => { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); onEnd(e2.clientY); };
    document.addEventListener('mousemove', mm);
    document.addEventListener('mouseup', mu);
  });
  bar.addEventListener('click', () => {
    const idx = STATES.indexOf(bsState);
    setSheetState(idx < STATES.length - 1 ? STATES[idx + 1] : 'collapsed');
  });

  const closeBtn = document.getElementById('bsCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', () => { deselect(); setSheetState('collapsed'); });
}

// CARTO's free raster basemaps (no API key, OSM data underneath) — Voyager
// (colored: green parks, blue water) for the two light themes (cidal/riyar),
// Dark Matter for the two dark ones (folad/fois). CARTO has no colored dark
// counterpart to Voyager, so this pairing is intentionally asymmetric — same
// pattern Google/Apple Maps use, dark mode basemaps are always more
// desaturated than light. THEMES/dark-vs-light grouping mirrors js/shell.js's
// THEMES array; kept as a literal set here rather than importing that array
// so this file doesn't need to know shell.js's load order.
const DARK_THEMES = new Set(['folad', 'fois']);
const TILE_STYLES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap contributors © CARTO',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap contributors © CARTO',
  },
};

function currentTileStyle() {
  return DARK_THEMES.has(document.documentElement.dataset.theme) ? TILE_STYLES.dark : TILE_STYLES.light;
}

// Esri World Imagery — free, no API key or account required (unlike Stadia/
// Mapbox satellite tiles), same free-tier constraint the CARTO basemaps
// above were picked under. Imagery alone has no place labels/roads, so it's
// always paired with the labels overlay below, on top of it in the same
// tilePane (stacking is DOM-insertion order — see applyBaseLayer()).
const SATELLITE_STYLE = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  maxZoom: 19,
};
const SATELLITE_LABELS_STYLE = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Tiles © Esri',
  maxZoom: 19,
};

function makeTileLayer() {
  const style = satelliteOn ? SATELLITE_STYLE : currentTileStyle();
  return L.tileLayer(style.url, { attribution: style.attribution, maxZoom: style.maxZoom || 20, detectRetina: true });
}

// Called from js/shell.js's applyTheme() via the 'pokoh:theme-changed' event
// (not a direct call) so this file doesn't need to parse before or after
// shell.js — see the load-order note at the top of shell.js. Also called
// directly by the satellite toggle's own click handler below.
function applyBaseLayer() {
  if (!leafletMap) return;
  const next = makeTileLayer();
  next.addTo(leafletMap);
  if (tileLayer) leafletMap.removeLayer(tileLayer);
  tileLayer = next;

  if (satelliteOn) {
    if (labelsLayer) leafletMap.removeLayer(labelsLayer);
    labelsLayer = L.tileLayer(SATELLITE_LABELS_STYLE.url, {
      attribution: SATELLITE_LABELS_STYLE.attribution,
      maxZoom: SATELLITE_LABELS_STYLE.maxZoom,
    }).addTo(leafletMap);
  } else if (labelsLayer) {
    leafletMap.removeLayer(labelsLayer);
    labelsLayer = null;
  }
}
document.addEventListener('pokoh:theme-changed', applyBaseLayer);

function setSatelliteMode(on) {
  if (on === satelliteOn || !leafletMap) return;
  satelliteOn = on;
  applyBaseLayer();
}

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;

  const bounds = visibleEvents().map(eventCoord).filter(Boolean);

  // tap:false disables Leaflet's own touch-tap emulation shim (L.Map.Tap),
  // which exists only to work around old Android browsers' ~300ms ghost-click
  // delay. It listens at the document level and, after any map interaction,
  // can swallow/misattribute the very next touch to the map — modern
  // browsers (incl. current Android Chrome) don't need the shim at all, and
  // leaving it on is the documented cause of taps on sibling UI (like the
  // sheet's grab bar) landing on the map instead, right after a programmatic
  // zoom/pan like zoomToShowLayer.
  leafletMap = L.map('map', { zoomControl: false, tap: false });
  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);
  tileLayer = makeTileLayer().addTo(leafletMap);

  clusterGroup = L.markerClusterGroup({ showCoverageOnHover: false });
  plainGroup   = L.layerGroup();
  leafletMap.addLayer(activeMarkerGroup());

  updateMarkers();
  renderSheet();

  if (bounds.length) {
    leafletMap.fitBounds(bounds, { padding: [32, 32] });
  }

  leafletMap.on('click', () => {
    if (bsState !== 'collapsed') deselect();
  });
  leafletMap.on('zoomend', updateZoomTier);
  updateZoomTier();

  initSheetDrag();
}

/* ── Time dropdown (mobile: chip panel collapses behind a trigger button
   that deploys it downward; desktop CSS forces the panel open and hides
   the trigger, see app.css). County stays a plain always-visible 3-segment
   toggle, unchanged since before this dropdown was added. ── */

function closeDropdowns() {
  document.querySelectorAll('.map-dd.open').forEach(dd => {
    dd.classList.remove('open');
    dd.querySelector('.map-dd-trigger')?.setAttribute('aria-expanded', 'false');
  });
}

function toggleDropdown(dd) {
  const willOpen = !dd.classList.contains('open');
  closeDropdowns();
  dd.classList.toggle('open', willOpen);
  dd.querySelector('.map-dd-trigger')?.setAttribute('aria-expanded', String(willOpen));
}

document.getElementById('mapTimeTrigger').addEventListener('click', () => {
  toggleDropdown(document.getElementById('mapTimeDD'));
});
document.addEventListener('click', e => {
  if (!e.target.closest('.map-dd')) closeDropdowns();
  // Township flyout isn't a .map-dd (county itself has no trigger to close),
  // so it gets its own outside-click check rather than folding into closeDropdowns().
  if (!e.target.closest('.map-loc')) {
    const sub = document.getElementById('mapTownshipChips');
    if (sub && !sub.hidden) sub.hidden = true;
  }
});

/* ── Event listeners ── */

document.getElementById('mapCountyChips').addEventListener('click', e => {
  const chip = e.target.closest('.map-chip');
  if (!chip) return;
  const newCounty = chip.dataset.county;
  const subEl = document.getElementById('mapTownshipChips');

  if (newCounty === countyFilter && newCounty !== 'all') {
    // Same county re-tapped: toggle sub-row, clear township selection
    townshipFilter = null;
    if (subEl.hidden) renderTownshipChips(); else subEl.hidden = true;
    if (mapInitialized) { updateMarkers(); renderSheet(); }
    return;
  }

  countyFilter = newCounty;
  townshipFilter = null;
  syncActiveChips(document.getElementById('mapCountyChips'), '.map-chip', c => c === chip);
  renderTownshipChips();
  if (mapInitialized) {
    updateMarkers();
    renderSheet();
    fitToFilter();
    trackEvent('map_filter', { county: countyFilter });
  }
});

document.getElementById('mapTimeChips').addEventListener('click', e => {
  const chip = e.target.closest('.map-chip');
  if (!chip) return;
  timeFilter = chip.dataset.time;
  syncActiveChips(document.getElementById('mapTimeChips'), '.map-chip', c => c === chip);
  document.getElementById('mapTimeLabel').textContent = TIME_LABELS[timeFilter] || timeFilter;

  const customRow = document.getElementById('mapCustomDateRow');
  if (timeFilter === 'custom') {
    customRow.hidden = false;
    const startInput = document.getElementById('mapCustomStart');
    const endInput   = document.getElementById('mapCustomEnd');
    if (!startInput.value) startInput.value = endInput.value = toDateInputValue(new Date());
    // Custom selection isn't final until "套用" is tapped — leave the
    // dropdown open so the date inputs stay reachable.
    return;
  }
  customRow.hidden = true;
  closeDropdowns();
  if (mapInitialized) {
    updateMarkers();
    renderSheet();
    trackEvent('map_filter', { time: timeFilter });
  }
});

document.getElementById('mapCustomApply').addEventListener('click', () => {
  const startVal = document.getElementById('mapCustomStart').value;
  const endVal   = document.getElementById('mapCustomEnd').value;
  if (!startVal || !endVal) return;
  // Built from the y/m/d parts rather than `new Date(str)` — the latter
  // parses a bare yyyy-mm-dd as UTC midnight, which can land on the wrong
  // local calendar day outside UTC+ zones.
  const [sy, sm, sd] = startVal.split('-').map(Number);
  const [ey, em, ed] = endVal.split('-').map(Number);
  customStart = new Date(sy, sm - 1, sd);
  customEnd   = new Date(ey, em - 1, ed);
  if (customEnd < customStart) [customStart, customEnd] = [customEnd, customStart];
  closeDropdowns();
  if (mapInitialized) {
    updateMarkers();
    renderSheet();
    trackEvent('map_filter', { time: 'custom' });
  }
});

document.getElementById('mapTownshipChips').addEventListener('click', e => {
  const chip = e.target.closest('.map-chip');
  if (!chip) return;
  // renderTownshipChips() below replaces this chip via innerHTML, detaching
  // it from the DOM — if this click then bubbles to the document listener,
  // e.target.closest('.map-loc') sees a detached node and misreads it as an
  // outside click, closing the flyout right after the tap. Stop it here.
  e.stopPropagation();
  townshipFilter = chip.dataset.township;
  renderTownshipChips();
  if (mapInitialized) {
    updateMarkers();
    renderSheet();
    fitToFilter();
    trackEvent('map_filter', { county: countyFilter, township: townshipFilter });
  }
});

document.getElementById('mapClusterToggle').addEventListener('click', e => {
  const btn = e.target.closest('.map-chip');
  if (!btn) return;
  setClusterMode(btn.dataset.cluster === 'on');
  const clusterToggleEl = document.getElementById('mapClusterToggle');
  syncActiveChips(clusterToggleEl, '.map-chip', c => c === btn);
  clusterToggleEl.querySelectorAll('.map-chip').forEach(c =>
    c.setAttribute('aria-pressed', String(c === btn))
  );
  trackEvent('map_filter', { clusterMode: clusterModeOn ? 'grouped' : 'individual' });
});

document.getElementById('mapSatelliteToggle').addEventListener('click', e => {
  const btn = e.target.closest('.map-chip');
  if (!btn) return;
  setSatelliteMode(btn.dataset.basemap === 'satellite');
  const satToggleEl = document.getElementById('mapSatelliteToggle');
  syncActiveChips(satToggleEl, '.map-chip', c => c === btn);
  satToggleEl.querySelectorAll('.map-chip').forEach(c =>
    c.setAttribute('aria-pressed', String(c === btn))
  );
  trackEvent('map_filter', { basemap: satelliteOn ? 'satellite' : 'standard' });
});

