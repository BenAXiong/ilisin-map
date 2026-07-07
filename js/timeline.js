/* ═══════════════════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════════════════ */

const CELL_W   = 48;
const BAND_H   = 18;
const BAND_GAP = 3;

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
function toggleBandTip(el) {
  const tip = _initBandTip();
  if (tip.classList.contains('visible') && tip.textContent === el.dataset.tip) {
    hideBandTip();
  } else {
    showBandTip(el);
  }
}

let tlMonths          = [];
let tlActiveMonth     = null;
let tlSelectedDay     = null;
let tlCountyFilter    = 'all';
let tlTownshipFilter  = null;

// Days from first day of first month to given date
function tlDayOffset(date) {
  const origin = new Date(tlMonths[0].getFullYear(), tlMonths[0].getMonth(), 1);
  return Math.round((date - origin) / 86400000);
}

function villagesOnDay(date) {
  return visibleVillages().filter(v => {
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
  const starts = visibleVillages()
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
  const events = visibleVillages()
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
    const tip  = `${v.chinese} · ${shortName(v.township)} · ${shortName(v.county)}`;
    bandsHtml += `<div class="tl-band" data-tip="${tip}" style="left:${left}px;width:${w}px;top:${top}px;height:${BAND_H}px" onmouseenter="showBandTip(this)" onmouseleave="hideBandTip()" onclick="toggleBandTip(this)">
      <span class="tl-band-label">${v.chinese}</span>
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

/* ── Event listeners ── */

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


function renderTownshipChips() {
  const bar = document.getElementById('tlCounty');
  bar.querySelectorAll('.tl-county-sep, .tl-chip-twp').forEach(el => el.remove());
  if (tlCountyFilter === 'all') return;

  const twps = [...new Set(
    visibleVillages()
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
    return;
  }

  const chip = e.target.closest('.tl-chip');
  if (!chip) return;
  tlCountyFilter = chip.dataset.county;
  tlTownshipFilter = null;
  document.querySelectorAll('.tl-chip').forEach(c => c.classList.toggle('active', c === chip));
  renderTownshipChips();
  renderStrip();
  renderDayCards();
});
