/* ═══════════════════════════════════════════════════
   MAP + BOTTOM SHEET
   ═══════════════════════════════════════════════════ */

let leafletMap    = null;
let clusterGroup  = null;
let mapInitialized = false;
let markers       = {};
let activeId      = null;
let bsState       = 'collapsed';
let TAP_NEXT      = null;
let countyFilter  = 'all';

function makeIcon(status, isActive) {
  const colors = {
    confirmed: isActive ? '#6b4200' : '#bf7e1a',
    tbd:       isActive ? '#555'    : '#999',
    cancelled: isActive ? '#555'    : '#bbb',
  };
  const c = colors[status] || colors.confirmed;
  const bg = isActive ? c : 'transparent';
  const border = c;
  return L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${bg};border:2.5px solid ${border};box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
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
}

function deselect() {
  if (activeId && markers[activeId]) {
    const v = VILLAGES.find(x => x.id === activeId);
    if (v) markers[activeId].setIcon(makeIcon(v.status, false));
  }
  activeId = null;
  TAP_NEXT = null;
  setSheetState('collapsed');
}

function renderSheet() {
  const content = document.getElementById('bsContent');
  if (!content) return;

  const statusOrder = { confirmed: 0, tbd: 1, cancelled: 2 };
  const displayed = visibleVillages()
    .filter(v => countyFilter === 'all' || v.county === countyFilter)
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

function activateVillage(id) {
  if (activeId && markers[activeId]) {
    const prev = VILLAGES.find(x => x.id === activeId);
    if (prev) markers[activeId].setIcon(makeIcon(prev.status, false));
  }
  activeId = id;

  if (markers[id]) markers[id].setIcon(makeIcon(VILLAGES.find(v => v.id === id)?.status, true));

  renderSheet();
  setSheetState('half');

  document.querySelectorAll('.village-card').forEach(c =>
    c.classList.toggle('active', c.dataset.vid === id)
  );

  // Scroll only #bsContent to land the activated card at the top of the
  // visible area. Same reason: avoid scrollIntoView propagating to #panel-map.
  // Deferred past the sheet's CSS transition (.35s) so getBoundingClientRect
  // values are stable when we compute the target scroll position.
  setTimeout(() => {
    const bsContent = document.getElementById('bsContent');
    const card = bsContent?.querySelector(`.village-card[data-vid="${id}"]`);
    if (card && bsContent) {
      const top = card.getBoundingClientRect().top - bsContent.getBoundingClientRect().top + bsContent.scrollTop;
      bsContent.scrollTo({ top, behavior: 'smooth' });
    }
  }, 360);

  trackEvent('village_tap', { id, name: VILLAGES.find(v => v.id === id)?.chinese });
}

function goToMapVillage(id) {
  const v = VILLAGES.find(x => x.id === id);
  if (!v || !v.lat || !v.lng) return;
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
    if (marker && clusterGroup.hasLayer(marker)) {
      clusterGroup.zoomToShowLayer(marker, () => {});
    } else {
      leafletMap.setView([v.lat, v.lng], 16, { animate: true });
    }
  }, leafletMap ? 0 : 400);
}

function updateMarkers() {
  if (!leafletMap) return;
  clusterGroup.clearLayers();
  markers = {};

  const displayed = visibleVillages().filter(v =>
    v.lat && v.lng && (countyFilter === 'all' || v.county === countyFilter)
  );
  displayed.forEach(v => {
    const m = L.marker([v.lat, v.lng], { icon: makeIcon(v.status, false) });
    m.on('click', () => {
      if (TAP_NEXT === v.id) {
        setSheetState('full');
        TAP_NEXT = null;
        return;
      }
      TAP_NEXT = v.id;
      activateVillage(v.id);
    });
    clusterGroup.addLayer(m);
    markers[v.id] = m;
  });
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

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;

  const bounds = visibleVillages()
    .filter(v => v.lat && v.lng)
    .map(v => [v.lat, v.lng]);

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
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(leafletMap);

  clusterGroup = L.markerClusterGroup({ showCoverageOnHover: false });
  leafletMap.addLayer(clusterGroup);

  updateMarkers();
  renderSheet();

  if (bounds.length) {
    leafletMap.fitBounds(bounds, { padding: [32, 32] });
  }

  leafletMap.on('click', () => {
    if (bsState !== 'collapsed') deselect();
  });

  initSheetDrag();
}

/* ── Event listeners ── */

document.getElementById('mapCountyChips').addEventListener('click', e => {
  const chip = e.target.closest('.map-chip');
  if (!chip) return;
  countyFilter = chip.dataset.county;
  document.querySelectorAll('.map-chip').forEach(c => c.classList.toggle('active', c === chip));
  if (mapInitialized) {
    updateMarkers();
    renderSheet();
    trackEvent('map_filter', { county: countyFilter });
  }
});

