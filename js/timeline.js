/* ═══════════════════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════════════════ */

const CELL_W   = 48;
const BAND_H   = 18;
const BAND_GAP = 3;

let tlMonths       = [];
let tlActiveMonth  = null;
let tlSelectedDay  = null;
let tlAnchorDate   = null;
let tlCountyFilter = 'all';

function villagesOnDay(date) {
  return VILLAGES.filter(v => {
    if (v.status === 'tbd' || v.status === 'cancelled') return false;
    if (tlCountyFilter !== 'all' && v.county !== tlCountyFilter) return false;
    const start = parseStartDate(v.date);
    if (!start) return false;
    const end = parseEndDate(v.date) || start;
    return date >= start && date <= end;
  });
}

function initTimeline() {
  const starts = VILLAGES
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
  tlAnchorDate  = new Date(defaultDay);

  renderMonthTabs();
  renderStrip();
  renderDayCards();
  updateNavLabel();
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
  const y     = tlActiveMonth.getFullYear();
  const mo    = tlActiveMonth.getMonth();
  const days  = new Date(y, mo + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const multiDay = VILLAGES
    .filter(v => {
      if (v.status === 'tbd' || v.status === 'cancelled') return false;
      if (tlCountyFilter !== 'all' && v.county !== tlCountyFilter) return false;
      return parseEndDate(v.date) !== null;
    })
    .map(v => ({ ...v, _s: parseStartDate(v.date), _e: parseEndDate(v.date) }))
    .filter(v => v._s && v._e &&
      v._s <= new Date(y, mo + 1, 0) &&
      v._e >= new Date(y, mo, 1)
    );

  let bandsHtml = '';
  const bandsHeight = multiDay.length * (BAND_H + BAND_GAP);
  multiDay.forEach((v, i) => {
    const sd  = v._s.getMonth() === mo ? v._s.getDate() : 1;
    const ed  = v._e.getMonth() === mo ? v._e.getDate() : days;
    const left = (sd - 1) * CELL_W;
    const w    = (ed - sd + 1) * CELL_W;
    const top  = i * (BAND_H + BAND_GAP);
    bandsHtml += `<div class="tl-band" style="left:${left}px;width:${w}px;top:${top}px;height:${BAND_H}px">
      <span class="tl-band-label">${v.chinese}</span>
    </div>`;
  });

  let cellsHtml = '';
  for (let d = 1; d <= days; d++) {
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
  }

  const totalW = days * CELL_W;
  document.getElementById('tlStripScroll').innerHTML =
    `<div class="tl-strip-inner" style="width:${totalW}px">
      <div class="tl-cells-layer">${cellsHtml}</div>
      <div class="tl-bands-layer" style="height:${bandsHeight}px;position:relative">${bandsHtml}</div>
    </div>`;
}

function selectDay(date) {
  tlSelectedDay = date;
  document.querySelectorAll('.tl-cell').forEach(c =>
    c.classList.toggle('active', c.dataset.date === date.toDateString())
  );
  renderDayCards();
}

function scrollStripToDay(date) {
  const scroll = document.getElementById('tlStripScroll');
  const d = date.getDate();
  const target = Math.max(0, (d - 1) * CELL_W - scroll.clientWidth / 2 + CELL_W / 2);
  scroll.scrollTo({ left: target, behavior: 'smooth' });
}

function updateNavLabel() {
  const end = new Date(tlAnchorDate);
  end.setDate(end.getDate() + 6);
  const fmt = d => `${d.getMonth() + 1}/${d.getDate()}`;
  document.getElementById('tlNavLabel').textContent = `${fmt(tlAnchorDate)} – ${fmt(end)}`;
}

function renderDayCards() {
  const list     = document.getElementById('tlDayList');
  const d        = tlSelectedDay;
  const label    = `${d.getMonth() + 1}月${d.getDate()}日 ${WEEKDAYS[d.getDay()]}`;
  const villages = villagesOnDay(d);

  if (villages.length === 0) {
    list.innerHTML = `<div class="tl-day-header"><span>${label}</span></div>
      <div class="tl-empty">本日暫無祭儀</div>`;
    return;
  }
  list.innerHTML = `<div class="tl-day-header">
      <span>${label}</span>
      <span class="tl-day-count">${villages.length} 部落</span>
    </div>
    ${villages.map(v => cardHtml(v, `onclick="goToMapVillage('${v.id}')"`)).join('')}`;
}

/* ── Event listeners ── */

document.getElementById('tlMonthTabs').addEventListener('click', e => {
  const tab = e.target.closest('.tl-month-tab');
  if (!tab) return;
  tlActiveMonth = new Date(Number(tab.dataset.ts));
  renderMonthTabs();
  const target = firstEventDayInMonth(tlActiveMonth) ||
                 new Date(tlActiveMonth.getFullYear(), tlActiveMonth.getMonth(), 1);
  tlSelectedDay = target;
  tlAnchorDate  = new Date(target);
  renderStrip();
  renderDayCards();
  updateNavLabel();
  requestAnimationFrame(() => scrollStripToDay(target));
});

document.getElementById('tlNavPrev').addEventListener('click', () => {
  tlAnchorDate.setDate(tlAnchorDate.getDate() - 7);
  updateNavLabel();
  scrollStripToDay(tlAnchorDate);
});
document.getElementById('tlNavNext').addEventListener('click', () => {
  tlAnchorDate.setDate(tlAnchorDate.getDate() + 7);
  updateNavLabel();
  scrollStripToDay(tlAnchorDate);
});

document.getElementById('tlCounty').addEventListener('click', e => {
  const chip = e.target.closest('.tl-chip');
  if (!chip) return;
  tlCountyFilter = chip.dataset.county;
  document.querySelectorAll('.tl-chip').forEach(c => c.classList.toggle('active', c === chip));
  renderStrip();
  renderDayCards();
});
