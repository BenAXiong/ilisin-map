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
let activePill    = null;

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
  const bs = document.getElementById('bottomSheet');
  if (bs) {
    bs.dataset.state = state;
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
  setSheetState('collapsed');
}

function renderSheet() {
  const content = document.getElementById('bsContent');
  const pillsRow = document.getElementById('bsPills');
  if (!content) return;

  const displayed = VILLAGES.filter(v =>
    countyFilter === 'all' || v.county === countyFilter
  );

  const grouped = {};
  displayed.forEach(v => {
    const key = clusterKey(v);
    (grouped[key] ??= []).push(v);
  });

  const order = ['confirmed', 'tbd', 'cancelled'];
  const keys  = Object.keys(grouped).sort((a, b) => {
    const topStatus = arr => order.indexOf(arr.find(x => x)?.status ?? 'cancelled');
    return topStatus(grouped[a]) - topStatus(grouped[b]);
  });

  pillsRow.innerHTML = keys.map(k => {
    const v = grouped[k][0];
    const isActive = k === activePill;
    return `<button class="bs-pill${isActive ? ' active' : ''}" data-key="${k}">${v.chinese}${grouped[k].length > 1 ? ` (${grouped[k].length})` : ''}</button>`;
  }).join('');

  content.innerHTML = keys.map(key => {
    const list = grouped[key];
    const label = list[0].chinese;
    return `<div class="bs-cluster-label" id="cl-${CSS.escape(key)}">
        <span class="cl-text">${label}</span>
        ${list.length > 1 ? `<span class="bs-cluster-count">${list.length}</span>` : ''}
      </div>
      ${list.map(v => makeSectionHtml(v)).join('')}`;
  }).join('');
}

function makeSectionHtml(v) {
  return cardHtml(v, `data-vid="${v.id}" onclick="activateVillage('${v.id}')"`);
}

function activateVillage(id) {
  if (activeId && markers[activeId]) {
    const prev = VILLAGES.find(x => x.id === activeId);
    if (prev) markers[activeId].setIcon(makeIcon(prev.status, false));
  }
  activeId = id;
  activePill = clusterKey(VILLAGES.find(v => v.id === id));

  if (markers[id]) markers[id].setIcon(makeIcon(VILLAGES.find(v => v.id === id)?.status, true));

  renderSheet();
  setSheetState('half');

  document.querySelectorAll('.village-card').forEach(c =>
    c.classList.toggle('active', c.dataset.vid === id)
  );

  const pill = document.querySelector(`.bs-pill[data-key="${CSS.escape(activePill)}"]`);
  if (pill) pill.scrollIntoView({ inline: 'center', block: 'nearest' });

  const card = document.querySelector(`.village-card[data-vid="${id}"]`);
  if (card) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  trackEvent('village_tap', { id, name: VILLAGES.find(v => v.id === id)?.chinese });
}

function goToMapVillage(id) {
  const v = VILLAGES.find(x => x.id === id);
  if (!v || !v.lat || !v.lng) return;
  switchTab('map');
  setTimeout(() => {
    if (!leafletMap) return;
    leafletMap.setView([v.lat, v.lng], 14, { animate: true });
    activateVillage(id);
  }, leafletMap ? 0 : 400);
}

function updateMarkers() {
  if (!leafletMap) return;
  clusterGroup.clearLayers();
  markers = {};

  const displayed = VILLAGES.filter(v =>
    v.lat && v.lng && (countyFilter === 'all' || v.county === countyFilter)
  );
  displayed.forEach(v => {
    const m = L.marker([v.lat, v.lng], { icon: makeIcon(v.status, false) });
    const dateStr = v.date ? `<span class="popup-date">${v.date}</span>` : '';
    m.bindPopup(`<span class="popup-cn">${v.chinese}</span><span class="popup-sub">${v.amis || ''}</span>${dateStr}`);
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

  const bounds = VILLAGES
    .filter(v => v.lat && v.lng)
    .map(v => [v.lat, v.lng]);

  leafletMap = L.map('map', { zoomControl: true });
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

document.getElementById('bsPills').addEventListener('click', e => {
  const pill = e.target.closest('.bs-pill');
  if (!pill) return;
  activePill = pill.dataset.key;
  renderSheet();
  const el = document.getElementById(`cl-${CSS.escape(activePill)}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
