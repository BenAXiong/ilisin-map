/* ═══════════════════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════════════════ */

const CELL_W   = 48;
const BAND_H   = 18;
const BAND_GAP = 3;

const CELL_OW     = 10;  // px per day in overview
const BAND_OW_H   = 8;   // band height in overview
const BAND_OW_GAP = 2;
const DENSITY_H   = 32;  // max density bar height

function shortName(s) { return s ? s.replace(/[縣市鄉鎮區]$/, '') : ''; }

let _bandTip = null;
function _initBandTip() {
  if (_bandTip) return _bandTip;
  _bandTip = document.createElement('div');
  _bandTip.id = 'tl-tip';
  document.body.appendChild(_bandTip);
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('.tl-band')) hideBandTip();
  });
  return _bandTip;
}
function showBandTip(el) {
  const tip  = _initBandTip();
  const rect = el.getBoundingClientRect();
  tip.textContent = el.dataset.tip;
  tip.style.left  = (rect.left + rect.width / 2) + 'px';
  tip.style.top   = rect.top + 'px';
  tip.classList.add('visible');
}
function hideBandTip() {
  if (_bandTip) _bandTip.classList.remove('visible');
}

let tlMonths          = [];
let tlActiveMonth     = null;
let tlSelectedDay     = null;
let tlCountyFilter    = 'all';
let tlTownshipFilter  = null;
let tlOverviewMode    = false;
let _ovData           = null; // set by renderOverviewStrip(), read by _renderToCanvas()
let tlNameMode        = localStorage.getItem('pokoh-tl-name-mode') === 'indigenous' ? 'indigenous' : 'chinese';

function applyTlNameMode() {
  document.querySelectorAll('[data-tl-name-toggle]').forEach(b => {
    b.textContent = tlNameMode === 'chinese' ? '中' : '原';
    b.title = tlNameMode === 'chinese' ? '顯示族語名稱' : '顯示中文名稱';
  });
}
applyTlNameMode();
document.querySelectorAll('[data-tl-name-toggle]').forEach(b =>
  b.addEventListener('click', () => {
    tlNameMode = tlNameMode === 'chinese' ? 'indigenous' : 'chinese';
    localStorage.setItem('pokoh-tl-name-mode', tlNameMode);
    applyTlNameMode();
    renderStrip();
  })
);

// Days from first day of first month to given date
function tlDayOffset(date) {
  const origin = new Date(tlMonths[0].getFullYear(), tlMonths[0].getMonth(), 1);
  return Math.round((date - origin) / 86400000);
}

function villagesOnDay(date) {
  return visibleEvents().filter(v => {
    if (v.status === 'tbd' || v.status === 'cancelled') return false;
    if (tlCountyFilter !== 'all' && v.county !== tlCountyFilter) return false;
    if (tlTownshipFilter && v.township !== tlTownshipFilter) return false;
    const start = parseStartDate(v.date);
    if (!start) return false;
    const end = parseEndDate(v.date) || start;
    return date >= start && date <= end;
  });
}

function initTimeline() {
  const starts = visibleEvents()
    .filter(v => v.status !== 'tbd')
    .map(v => parseStartDate(v.date))
    .filter(Boolean)
    .sort((a, b) => a - b);

  if (!starts.length) return;

  const minDate = starts[0];
  const maxDate = starts[starts.length - 1];

  const cursor   = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  tlMonths = [];
  while (cursor <= endMonth) {
    tlMonths.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  let defaultDay = null;
  if (today >= minDate) {
    if (villagesOnDay(today).length > 0) {
      defaultDay = today;
    } else {
      const look = new Date(today);
      look.setDate(look.getDate() + 1);
      while (look <= maxDate) {
        if (villagesOnDay(look).length > 0) { defaultDay = new Date(look); break; }
        look.setDate(look.getDate() + 1);
      }
    }
  }
  if (!defaultDay) {
    for (const m of tlMonths) {
      defaultDay = firstEventDayInMonth(m);
      if (defaultDay) break;
    }
  }
  defaultDay = defaultDay || new Date(tlMonths[0].getFullYear(), tlMonths[0].getMonth(), 1);

  tlActiveMonth = new Date(defaultDay.getFullYear(), defaultDay.getMonth(), 1);
  tlSelectedDay = defaultDay;

  renderMonthTabs();
  renderStrip();
  renderDayCards();
  requestAnimationFrame(() => scrollStripToDay(tlSelectedDay));

  addDragScroll(document.getElementById('tlStripScroll'));
  addDragScroll(document.getElementById('tlMonthTabs'));
}

function firstEventDayInMonth(monthDate) {
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const date = new Date(y, m, d);
    if (villagesOnDay(date).length > 0) return date;
  }
  return null;
}

function renderMonthTabs() {
  document.getElementById('tlMonthTabs').innerHTML = tlMonths.map(m => {
    const active = tlActiveMonth &&
      m.getFullYear() === tlActiveMonth.getFullYear() &&
      m.getMonth() === tlActiveMonth.getMonth();
    const hasData = !!firstEventDayInMonth(m);
    return `<button class="tl-month-tab${active ? ' active' : ''}" data-ts="${m.getTime()}"${hasData ? '' : ' disabled'}>${m.getMonth() + 1}月</button>`;
  }).join('');
}

function renderStrip() {
  const scroll = document.getElementById('tlStripScroll');
  const savedX = scroll.scrollLeft;
  const today  = new Date(); today.setHours(0, 0, 0, 0);

  // All events across every month, greedy lane packing on absolute offsets
  const events = visibleEvents()
    .filter(v => {
      if (v.status === 'tbd' || v.status === 'cancelled') return false;
      if (tlCountyFilter !== 'all' && v.county !== tlCountyFilter) return false;
      if (tlTownshipFilter && v.township !== tlTownshipFilter) return false;
      return parseStartDate(v.date) !== null;
    })
    .map(v => ({ ...v, _s: parseStartDate(v.date), _e: parseEndDate(v.date) || parseStartDate(v.date) }))
    .filter(v => v._s && v._e)
    .sort((a, b) => a._s - b._s);

  hideBandTip();

  const laneEnds = [];
  events.forEach(v => {
    const sd = tlDayOffset(v._s);
    const ed = tlDayOffset(v._e);
    let lane = laneEnds.findIndex(end => end < sd);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = ed;
    v._lane = lane; v._sd = sd; v._ed = ed;
  });

  let bandsHtml = '';
  const bandsHeight = laneEnds.length * (BAND_H + BAND_GAP);
  events.forEach(v => {
    const left = v._sd * CELL_W;
    const w    = (v._ed - v._sd + 1) * CELL_W;
    const top  = v._lane * (BAND_H + BAND_GAP);
    const welcomeCls = v.welcome_date ? ' tl-band-welcome' : '';
    const welcomeTip = v.welcome_date ? ` · 迎賓 ${v.welcome_date}` : '';
    const tip  = `${v.chinese} · ${shortName(v.township)} · ${shortName(v.county)}${welcomeTip}`;
    const label = tlNameMode === 'indigenous' ? (indigenousNameInfo(v).latinName || '?') : v.chinese;
    bandsHtml += `<div class="tl-band${welcomeCls}" data-tip="${tip}" style="left:${left}px;width:${w}px;top:${top}px;height:${BAND_H}px" onmouseenter="showBandTip(this)" onmouseleave="hideBandTip()" onclick="selectBandVillage('${v.id}', ${v._s.getTime()})">
      <span class="tl-band-label">${label}</span>
    </div>`;
  });

  let cellsHtml = '';
  let totalDays = 0;
  for (const month of tlMonths) {
    const y  = month.getFullYear();
    const mo = month.getMonth();
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date     = new Date(y, mo, d);
      const count    = villagesOnDay(date).length;
      const isActive = tlSelectedDay && date.toDateString() === tlSelectedDay.toDateString();
      const isToday  = date.toDateString() === today.toDateString();
      const cls      = ['tl-cell', isActive ? 'active' : '', isToday ? 'today' : ''].filter(Boolean).join(' ');
      const badge    = count > 0 ? `<span class="tl-count">${count}</span>` : '<span class="tl-count-empty"></span>';
      cellsHtml += `<div class="${cls}" data-date="${date.toDateString()}" onclick="selectDay(new Date(${date.getTime()}))">
        <span class="tl-weekday">${WEEKDAYS[date.getDay()]}</span>
        <span class="tl-daynum">${d}</span>
        ${badge}
      </div>`;
      totalDays++;
    }
  }

  scroll.innerHTML =
    `<div class="tl-strip-inner" style="width:${totalDays * CELL_W}px">
      <div class="tl-cells-layer">${cellsHtml}</div>
      <div class="tl-bands-layer" style="height:${bandsHeight}px;position:relative">${bandsHtml}</div>
    </div>`;
  scroll.scrollLeft = savedX;
}

function selectDay(date) {
  tlSelectedDay = date;
  document.querySelectorAll('.tl-cell').forEach(c =>
    c.classList.toggle('active', c.dataset.date === date.toDateString())
  );
  renderDayCards();
}

// Tapping a band navigates to its date (like tapping a day cell) and its
// detail overlay, but also highlights+scrolls its card in the day list —
// same active/scrollIntoView convention as activateVillage() in js/map.js —
// so the tapped buluo is easy to find again once the overlay is closed.
function selectBandVillage(id, startTs) {
  hideBandTip();
  selectDay(new Date(startTs));
  document.querySelectorAll('#tlDayList .village-card').forEach(c =>
    c.classList.toggle('active', c.id === `card-${id}`)
  );
  document.getElementById(`card-${id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  openDetail(id);
}

function scrollStripToDay(date) {
  const scroll  = document.getElementById('tlStripScroll');
  const offset  = tlDayOffset(date);
  const target  = Math.max(0, offset * CELL_W - scroll.clientWidth / 2 + CELL_W / 2);
  scroll.scrollTo({ left: target, behavior: 'smooth' });
}


function renderDayCards() {
  const list     = document.getElementById('tlDayList');
  const d        = tlSelectedDay;
  const villages = villagesOnDay(d);

  if (villages.length === 0) {
    list.innerHTML = `<div class="tl-empty">本日暫無祭儀</div>`;
    return;
  }
  list.innerHTML = villages.map(v => cardHtml(v, `onclick="openDetail('${v.id}')"`)).join('');
}

/* ── Overview (全覽) ── */

function renderOverviewMonthTabs() {
  if (!tlMonths.length) return;
  const year = tlMonths[0].getFullYear();
  const tabs = Array.from({ length: 12 }, (_, m) => {
    const days = new Date(year, m + 1, 0).getDate();
    const label = (m + 1) + '月';
    return `<button class="tl-month-tab" style="flex:${days};min-width:0" tabindex="-1">${label}</button>`;
  }).join('');
  document.getElementById('tlMonthTabs').innerHTML = tabs;
}

function setOverviewMode(on) {
  tlOverviewMode = on;
  document.getElementById('panel-timeline').classList.toggle('ov-active', on);
  document.getElementById('tlOverviewBtn').classList.toggle('active', on);
  document.getElementById('tlStripScroll').hidden = on;
  document.getElementById('tlOverviewWrap').hidden = !on;
  document.getElementById('tlDayList').hidden = on;
  document.getElementById('tlCounty').hidden = on;
  if (on) { renderOverviewMonthTabs(); renderOverviewStrip(); }
  else renderMonthTabs();
  const ew = document.getElementById('tloExportWrap');
  if (ew) ew.style.display = on ? 'flex' : 'none';
}

function renderOverviewStrip() {
  if (!tlMonths.length) return;

  // Full calendar year: Jan 1 → Dec 31
  const year   = tlMonths[0].getFullYear();
  const origin = new Date(year, 0, 1);
  const total  = new Date(year, 11, 31) - origin > 0
    ? Math.round((new Date(year, 11, 31) - origin) / 86400000) + 1
    : 365;

  // Compute cell width to fill wrap without scrolling
  const wrap    = document.getElementById('tlOverviewWrap');
  const padPx   = 2 * Math.round(0.85 * 16);
  const cellW   = Math.max(2, (wrap.clientWidth - padPx) / total);

  const dayIdx = d => Math.round((d - origin) / 86400000);
  const dayAt  = i => new Date(origin.getTime() + i * 86400000);

  // Density bars + collapsible detail bands, one row per tribe
  const TRIBE_ORDER = ['ami', 'szy', 'ckv', 'bnn', 'trv', 'pwn', 'pyu'];
  const TRIBE_NAMES = { ami: "'Amis/Pangcah", szy: 'Sakizaya', ckv: 'Kavalan',
                        bnn: 'Bunun', trv: 'Truku', pwn: 'Paiwan', pyu: 'Puyuma' };
  const TRIBE_ZH    = { ami: '阿美族', szy: '撒奇萊雅族', ckv: '噶瑪蘭族',
                        bnn: '布農族', trv: '太魯閣族', pwn: '排灣族', pyu: '卑南族' };
  const TLO_ROW_H   = 22;
  const TLO_ROW_GAP = 4;

  const tribeRows = [];
  TRIBE_ORDER.forEach(grp => {
    const evs = EVENTS.filter(v => v.group === grp && v.status !== 'tbd' && v.status !== 'cancelled');
    if (!evs.length) return;

    const map = {};
    evs.forEach(v => {
      const s = parseStartDate(v.date), e = parseEndDate(v.date) || s;
      if (!s) return;
      for (let d = new Date(s); d <= e; d = new Date(d.getTime() + 86400000))
        map[d.toDateString()] = (map[d.toDateString()] || 0) + 1;
    });
    if (!Object.keys(map).length) return;

    const maxCount = Math.max(1, ...Object.values(map));
    const dates    = Object.keys(map).map(k => new Date(k));
    const start    = new Date(Math.min(...dates.map(d => d.getTime())));
    const end      = new Date(Math.max(...dates.map(d => d.getTime())));
    const startIdx = dayIdx(start);
    const span     = dayIdx(end) - startIdx + 1;

    const bands = evs
      .map(v => ({ ...v, _s: parseStartDate(v.date), _e: parseEndDate(v.date) || parseStartDate(v.date) }))
      .filter(v => v._s && v._e)
      .sort((a, b) => a._s - b._s);
    const laneEnds = [];
    bands.forEach(v => {
      const sd = dayIdx(v._s), ed = dayIdx(v._e);
      let lane = laneEnds.findIndex(e => e < sd);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = ed;
      v._ov_lane = lane; v._ov_sd = sd; v._ov_ed = ed;
    });

    tribeRows.push({ grp, map, maxCount, start, startIdx, span, bands, laneEnds });
  });

  // Each tribe: density row + band section interleaved so expansion pushes later rows down
  let tribesHtml = '';
  tribeRows.forEach(tr => {
    let cells = '';
    for (let j = 0; j < tr.span; j++) {
      const d   = new Date(tr.start.getTime() + j * 86400000);
      const cnt = tr.map[d.toDateString()] || 0;
      const level = cnt > 0 ? Math.ceil((cnt / tr.maxCount) * 10) : 0;
      cells += `<div class="tlo-t-day" style="width:${cellW}px;opacity:${level > 0 ? ((level / 10) ** 2).toFixed(2) : '0'}"></div>`;
    }

    const bandsH = tr.laneEnds.length * (BAND_OW_H + BAND_OW_GAP);
    let bandsHtml = '';
    tr.bands.forEach(v => {
      const tip = `${v.chinese}${v.amis ? ' / ' + v.amis : ''} · ${v.date} · ${shortName(v.township)}`;
      bandsHtml += `<div class="tlo-band" title="${tip}" style="left:${v._ov_sd * cellW}px;width:${(v._ov_ed - v._ov_sd + 1) * cellW}px;top:${v._ov_lane * (BAND_OW_H + BAND_OW_GAP)}px;height:${BAND_OW_H}px"></div>`;
    });

    tribesHtml += `<div class="tlo-tribe-row">
      <div class="tlo-tribe-bar" data-group="${tr.grp}"
        style="left:${tr.startIdx * cellW}px;width:${tr.span * cellW}px;height:${TLO_ROW_H}px">
        <span class="tlo-tribe-lbl" title="${TRIBE_ZH[tr.grp] || tr.grp}">${TRIBE_NAMES[tr.grp] || tr.grp}</span>
        <div class="tlo-t-cells">${cells}</div>
      </div>
    </div>
    <div class="tlo-band-section" data-group="${tr.grp}" hidden>
      <div style="position:relative;height:${bandsH}px">${bandsHtml}</div>
    </div>`;
  });

  // Grid lines — week (Mon) and month boundaries, behind tribe rows in doc order
  let gridHtml = '';
  const fmo = (1 - origin.getDay() + 7) % 7; // days from Jan 1 to first Monday
  for (let d = fmo; d < total; d += 7)
    gridHtml += `<div class="tlo-grid-week" style="left:${d * cellW}px"></div>`;
  for (let m = 1; m < 12; m++) {
    const d = dayIdx(new Date(origin.getFullYear(), m, 1));
    gridHtml += `<div class="tlo-grid-month" style="left:${d * cellW}px"></div>`;
  }

  wrap.innerHTML = `<div class="tlo-inner" style="width:${total * cellW}px">${gridHtml}${tribesHtml}</div>`;

  _ovData = { cellW, total, origin, tribeRows };

  wrap.querySelectorAll('.tlo-tribe-bar').forEach(bar => {
    const section = wrap.querySelector(`.tlo-band-section[data-group="${bar.dataset.group}"]`);
    if (section) bar.addEventListener('click', () => { section.hidden = !section.hidden; });
  });
}

function selectDayFromOverview(date) {
  tlSelectedDay = date;
  tlActiveMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  setOverviewMode(false);
  renderMonthTabs();
  renderStrip();
  renderDayCards();
  requestAnimationFrame(() => scrollStripToDay(date));
}

/* ── Overview export (dev-only) ── */

function _toRgb(cssColor) {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const cx = c.getContext('2d');
  cx.fillStyle = cssColor;
  cx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
  return a > 0 ? `rgb(${r},${g},${b})` : 'transparent';
}

function _readCssVar(varName) {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;left:-9999px;width:1px;height:1px;background:var(${varName})`;
  document.body.appendChild(el);
  const color = _toRgb(getComputedStyle(el).backgroundColor);
  document.body.removeChild(el);
  return color;
}

function _renderToCanvas() {
  if (!_ovData) return null;
  const { cellW, total, origin, tribeRows } = _ovData;
  const TRIBE_NAMES = { ami: "'Amis/Pangcah", szy: 'Sakizaya', ckv: 'Kavalan',
                        bnn: 'Bunun', trv: 'Truku', pwn: 'Paiwan', pyu: 'Puyuma' };
  const TLO_ROW_H = 22, BAND_OW_H = 8, BAND_OW_GAP = 2, ROW_GAP = 4;
  const HEADER_H = 32, PAD_V = 10;
  const padL = Math.round(0.85 * 16); // matches .tlo-wrap padding
  const dayX = i => padL + i * cellW; // mirrors screen layout exactly

  // Which band sections are currently expanded in the DOM
  const wrap = document.getElementById('tlOverviewWrap');
  const expanded = new Set(
    [...wrap.querySelectorAll('.tlo-band-section:not([hidden])')].map(el => el.dataset.group)
  );

  const C_BG     = _readCssVar('--bg');
  const C_TEXT1  = _readCssVar('--ink');
  const C_TEXT3  = _readCssVar('--text-3');
  const C_ACCENT = _readCssVar('--accent');
  const bandEl   = document.querySelector('.tlo-band');
  const C_BAND   = bandEl ? (_toRgb(getComputedStyle(bandEl).backgroundColor) || C_ACCENT) : C_ACCENT;

  const panelW = document.getElementById('panel-timeline').offsetWidth;

  let totalH = PAD_V + HEADER_H + PAD_V;
  tribeRows.forEach(tr => {
    totalH += ROW_GAP + TLO_ROW_H;
    if (expanded.has(tr.grp))
      totalH += ROW_GAP + tr.laneEnds.length * (BAND_OW_H + BAND_OW_GAP);
  });
  totalH += PAD_V;

  const scale  = Math.min(window.devicePixelRatio || 2, 3);
  const canvas = document.createElement('canvas');
  canvas.width = panelW * scale; canvas.height = totalH * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  ctx.fillStyle = C_BG; ctx.fillRect(0, 0, panelW, totalH);

  // Grid lines — same week/month logic as renderOverviewStrip()
  const fmo = (1 - origin.getDay() + 7) % 7;
  ctx.fillStyle = C_TEXT1;
  ctx.globalAlpha = 0.02;
  for (let d = fmo; d < total; d += 7) ctx.fillRect(dayX(d), 0, 1, totalH);
  ctx.globalAlpha = 0.05;
  for (let m = 1; m < 12; m++) {
    const d = Math.round((new Date(origin.getFullYear(), m, 1) - origin) / 86400000);
    ctx.fillRect(dayX(d), 0, 1, totalH);
  }
  ctx.globalAlpha = 1;

  // Month bar (same proportional positions as the header tabs)
  for (let m = 0; m < 12; m++) {
    const x1 = dayX(Math.round((new Date(origin.getFullYear(), m, 1) - origin) / 86400000));
    const x2 = dayX(Math.round((new Date(origin.getFullYear(), m + 1, 1) - origin) / 86400000));
    ctx.strokeStyle = C_TEXT3; ctx.globalAlpha = 0.35; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(x1, PAD_V + 4); ctx.lineTo(x1, PAD_V + HEADER_H - 4); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = '11px sans-serif'; ctx.fillStyle = C_TEXT1;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${m + 1}月`, (x1 + x2) / 2, PAD_V + HEADER_H / 2);
  }

  // Tribe rows — label floats left of each bar, matching screen
  let y = PAD_V + HEADER_H + PAD_V;
  tribeRows.forEach(tr => {
    y += ROW_GAP;
    const barX = dayX(tr.startIdx);
    ctx.font = 'bold 11px "Courier New", monospace'; ctx.textAlign = 'right';
    ctx.textBaseline = 'middle'; ctx.fillStyle = C_TEXT1; ctx.globalAlpha = 1;
    ctx.fillText(TRIBE_NAMES[tr.grp] || tr.grp, barX - 6, y + TLO_ROW_H / 2);
    for (let j = 0; j < tr.span; j++) {
      const cnt = tr.map[new Date(tr.start.getTime() + j * 86400000).toDateString()] || 0;
      if (!cnt) continue;
      const level = Math.ceil((cnt / tr.maxCount) * 10);
      const x = dayX(tr.startIdx + j), w = dayX(tr.startIdx + j + 1) - x;
      ctx.fillStyle = C_ACCENT; ctx.globalAlpha = (level / 10) ** 2;
      ctx.fillRect(x, y, w, TLO_ROW_H);
    }
    ctx.globalAlpha = 1; y += TLO_ROW_H;
    if (expanded.has(tr.grp)) {
      y += ROW_GAP;
      tr.bands.forEach(v => {
        const bx = dayX(v._ov_sd), bw = dayX(v._ov_ed + 1) - bx;
        ctx.fillStyle = C_BAND;
        ctx.fillRect(bx, y + v._ov_lane * (BAND_OW_H + BAND_OW_GAP), bw, BAND_OW_H);
      });
      y += tr.laneEnds.length * (BAND_OW_H + BAND_OW_GAP);
    }
  });

  return canvas;
}

function _exportPng() {
  const btn = document.getElementById('tloExpPng');
  btn.textContent = '…'; btn.disabled = true;
  try {
    const canvas = _renderToCanvas();
    if (!canvas) throw new Error('No data — open the overview first');
    const a = Object.assign(document.createElement('a'), {
      download: `pokoh-overview-${new Date().toISOString().slice(0, 10)}.png`,
      href: canvas.toDataURL('image/png')
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } catch (e) {
    alert('PNG export failed: ' + e.message);
  } finally {
    btn.textContent = 'PNG'; btn.disabled = false;
  }
}

function _exportHtml() {
  const theme = document.documentElement.dataset.theme || '';
  const monthHtml = document.getElementById('tlMonthTabs').outerHTML;
  const ovClone = document.getElementById('tlOverviewWrap').cloneNode(true);
  ovClone.querySelectorAll('.tlo-band-section').forEach(el => el.removeAttribute('hidden'));
  ovClone.style.cssText = 'overflow:visible;max-height:none;height:auto;flex:none;padding:.75rem .85rem';
  const panelW = document.getElementById('panel-timeline').offsetWidth;
  const date = new Date().toISOString().slice(0, 10);
  fetch('/app.css').then(r => r.text()).then(css => {
    const themeAttr = theme ? ` data-theme="${theme}"` : '';
    const html = `<!DOCTYPE html>
<html${themeAttr}>
<head>
<meta charset="utf-8">
<title>Pokoh 豐年祭 全覽 — ${date}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Courier+Prime&family=Noto+Serif+TC:wght@400;600&display=swap" rel="stylesheet">
<style>${css}
html,body{height:auto;overflow:auto}
body{padding:1.5rem}
.tl-header{position:relative;height:54px;display:flex;align-items:center;border-bottom:1px solid var(--border);margin-bottom:.5rem}
</style>
</head>
<body${themeAttr}>
<div style="max-width:${panelW}px">
<div class="tl-header">${monthHtml}</div>
${ovClone.outerHTML}
</div>
<script>
document.querySelectorAll('.tlo-tribe-bar').forEach(function(bar) {
  var section = document.querySelector('.tlo-band-section[data-group="' + bar.dataset.group + '"]');
  if (section) bar.addEventListener('click', function() { section.hidden = !section.hidden; });
});
</script>
</body>
</html>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    a.download = `pokoh-overview-${date}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
}

/* ── Event listeners ── */

if (localStorage.getItem('pokoh_dev') === '1') {
  const _ovBtn = document.getElementById('tlOverviewBtn');
  Object.assign(_ovBtn.style, { display: 'inline-block', position: 'absolute',
    right: '2.75rem', top: '50%', transform: 'translateY(-50%)' });
  _ovBtn.addEventListener('click', () => setOverviewMode(!tlOverviewMode));

  const _expWrap = document.createElement('div');
  _expWrap.id = 'tloExportWrap';
  _expWrap.innerHTML = '<button class="theme-btn" id="tloExpPng">PNG</button><button class="theme-btn" id="tloExpHtml">HTML</button>';
  document.getElementById('panel-timeline').appendChild(_expWrap);
  document.getElementById('tloExpPng').addEventListener('click', _exportPng);
  document.getElementById('tloExpHtml').addEventListener('click', _exportHtml);
}

document.getElementById('tlMonthTabs').addEventListener('click', e => {
  const tab = e.target.closest('.tl-month-tab');
  if (!tab) return;
  const month  = new Date(Number(tab.dataset.ts));
  const offset = tlDayOffset(new Date(month.getFullYear(), month.getMonth(), 1));
  document.getElementById('tlStripScroll').scrollTo({ left: offset * CELL_W, behavior: 'smooth' });
});

document.getElementById('tlStripScroll').addEventListener('scroll', () => {
  if (!tlMonths.length) return;
  const scrollLeft = document.getElementById('tlStripScroll').scrollLeft;
  const origin     = new Date(tlMonths[0].getFullYear(), tlMonths[0].getMonth(), 1);
  const current    = new Date(origin);
  current.setDate(current.getDate() + Math.floor(scrollLeft / CELL_W));
  const newActive  = new Date(current.getFullYear(), current.getMonth(), 1);
  if (tlActiveMonth.getTime() !== newActive.getTime()) {
    tlActiveMonth = newActive;
    renderMonthTabs();
  }
}, { passive: true });


function renderTimelineTownshipChips() {
  const bar = document.getElementById('tlCounty');
  bar.querySelectorAll('.tl-county-sep, .tl-chip-twp').forEach(el => el.remove());
  if (tlCountyFilter === 'all') return;

  const twps = [...new Set(
    visibleEvents()
      .filter(v => v.county === tlCountyFilter && v.status !== 'cancelled')
      .map(v => v.township)
      .filter(Boolean)
  )];
  if (!twps.length) return;

  const sep = document.createElement('span');
  sep.className = 'tl-county-sep';
  bar.appendChild(sep);

  twps.forEach(twp => {
    const el = document.createElement('button');
    el.className = 'tl-chip-twp' + (tlTownshipFilter === twp ? ' active' : '');
    el.dataset.township = twp;
    el.textContent = shortName(twp);
    bar.appendChild(el);
  });
}

document.getElementById('tlCounty').addEventListener('click', e => {
  const twpChip = e.target.closest('.tl-chip-twp');
  if (twpChip) {
    const twp = twpChip.dataset.township;
    tlTownshipFilter = tlTownshipFilter === twp ? null : twp;
    document.querySelectorAll('.tl-chip-twp').forEach(c => c.classList.toggle('active', c.dataset.township === tlTownshipFilter));
    renderStrip();
    renderDayCards();
    if (tlOverviewMode) renderOverviewStrip();
    return;
  }

  const chip = e.target.closest('.tl-chip');
  if (!chip) return;
  tlCountyFilter = chip.dataset.county;
  tlTownshipFilter = null;
  document.querySelectorAll('.tl-chip').forEach(c => c.classList.toggle('active', c === chip));
  renderTimelineTownshipChips();
  renderStrip();
  renderDayCards();
  if (tlOverviewMode) renderOverviewStrip();
});
