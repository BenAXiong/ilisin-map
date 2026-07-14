/* ═══════════════════════════════════════════════════
   TIMELINE OVERVIEW (全覽) — dev-only tooling
   Full-year density/band view + PNG/HTML export, gated behind
   localStorage.getItem('pokoh_dev') === '1' (see js/info.js's dev-flag
   convention). Unreachable in production. Split out of js/timeline.js,
   which it loads after — reads that file's state (tlMonths, tlOverviewMode,
   _ovData, shortName(), etc.) as plain top-level globals, same
   no-ES-modules convention as every other file split in this codebase.
   ═══════════════════════════════════════════════════ */

const BAND_OW_H   = 8;   // band height in overview
const BAND_OW_GAP = 2;

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
  document.querySelectorAll('[data-tl-overview-btn]').forEach(b => b.classList.toggle('active', on));
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

  // Compute cell width to fill wrap without scrolling. The 2px/day floor
  // below is inert on any real desktop width (it only ever engages under
  // ~758px of available wrap width) — but below the app's own 768px
  // mobile/desktop breakpoint (app.css), a 365-day strip can't honor a 2px
  // floor without needing 730px+, wider than the phone itself. Mobile skips
  // the floor so the strip always fits exactly instead of overflowing.
  const wrap    = document.getElementById('tlOverviewWrap');
  const padPx   = 2 * Math.round(0.85 * 16);
  const isMobile = window.innerWidth < 768;
  const cellW   = isMobile
    ? Math.max(0.1, (wrap.clientWidth - padPx) / total)
    : Math.max(2, (wrap.clientWidth - padPx) / total);

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

/* ── Event listeners (dev-only, overview toggle + export buttons) ── */

if (localStorage.getItem('pokoh_dev') === '1') {
  // Desktop instance lives inside .tl-header, absolutely positioned against
  // it (only .tl-header gets position:relative at the ≥768px breakpoint —
  // see app.css). A mobile-only CSS rule force-hides this specific instance
  // (`display:none !important`) since positioning it absolutely against an
  // unpositioned .tl-header on narrow viewports is what made it "bugged on
  // mobile" — the button rendered relative to whatever positioned ancestor
  // happened to exist further up the tree instead of .tl-header.
  const _ovBtn = document.getElementById('tlOverviewBtn');
  Object.assign(_ovBtn.style, { display: 'inline-block', position: 'absolute',
    right: '2.75rem', top: '50%', transform: 'translateY(-50%)' });
  _ovBtn.addEventListener('click', () => setOverviewMode(!tlOverviewMode));

  // Mobile instance: a normal-flow icon button in .app-header, same
  // convention as the theme/name-toggle/saved-filter buttons there — no
  // absolute positioning needed since the header is already a flex row.
  const _ovBtnMobile = document.getElementById('tlOverviewBtnMobile');
  _ovBtnMobile.hidden = false;
  _ovBtnMobile.addEventListener('click', () => setOverviewMode(!tlOverviewMode));

  const _expWrap = document.createElement('div');
  _expWrap.id = 'tloExportWrap';
  _expWrap.innerHTML = '<button class="theme-btn" id="tloExpPng">PNG</button><button class="theme-btn" id="tloExpHtml">HTML</button>';
  document.getElementById('panel-timeline').appendChild(_expWrap);
  document.getElementById('tloExpPng').addEventListener('click', _exportPng);
  document.getElementById('tloExpHtml').addEventListener('click', _exportHtml);
}
