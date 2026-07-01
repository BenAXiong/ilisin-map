/* ═══════════════════════════════════════════════════
   INFO + CONTRIBUTION FORM
   ═══════════════════════════════════════════════════ */

const AT_TBL_REPORTS = 'Reports';
const AT_TBL_NEW     = 'Submissions';

/* Build a county → sorted township array map from event data.
   Runs at parse time — VILLAGES comes from data.js (loaded first). */
const TOWNSHIP_MAP = {};
VILLAGES.forEach(v => {
  (TOWNSHIP_MAP[v.county] ??= new Set()).add(v.township);
});
Object.keys(TOWNSHIP_MAP).forEach(c => {
  TOWNSHIP_MAP[c] = [...TOWNSHIP_MAP[c]].sort();
});

function parseDateRange(dateStr) {
  if (!dateStr || dateStr === '—' || dateStr === '停辦') return null;
  if (dateStr.includes('–')) {
    const [startPart, endRaw] = dateStr.split('–');
    const s = startPart.match(/(\d+)\/(\d+)/);
    const e = endRaw.split('；')[0].match(/(\d+)\/(\d+)/);
    if (!s || !e) return null;
    return { startM: +s[1], startD: +s[2], endM: +e[1], endD: +e[2] };
  }
  const m = dateStr.match(/(\d+)\/(\d+)/);
  if (!m) return null;
  return { startM: +m[1], startD: +m[2], endM: +m[1], endD: +m[2] };
}

function festivalDayCount(dateStr) {
  const r = parseDateRange(dateStr);
  if (!r) return 0;
  const start = new Date(2026, r.startM - 1, r.startD);
  const end   = new Date(2026, r.endM   - 1, r.endD);
  return Math.round((end - start) / 86400000) + 1;
}

function initInfo() {
  const total     = VILLAGES.length;
  const confirmed = VILLAGES.filter(v => v.status === 'confirmed').length;

  const festivalDays = VILLAGES
    .filter(v => v.status !== 'cancelled' && v.date && v.date !== '—')
    .reduce((sum, v) => sum + festivalDayCount(v.date), 0);

  let firstVal = Infinity, lastVal = -Infinity;
  let firstM, firstD, lastM, lastD;
  VILLAGES.forEach(v => {
    if (v.group !== 'ami' || v.status === 'cancelled') return;
    const r = parseDateRange(v.date);
    if (!r) return;
    const sv = r.startM * 100 + r.startD;
    const ev = r.endM   * 100 + r.endD;
    if (sv < firstVal) { firstVal = sv; firstM = r.startM; firstD = r.startD; }
    if (ev > lastVal)  { lastVal  = ev; lastM  = r.endM;   lastD  = r.endD;  }
  });
  const dateRange = firstVal < Infinity
    ? `${firstM}月${firstD}號 ~ ${lastM}月${lastD}號`
    : '—';

  document.getElementById('infoTiles').innerHTML = [
    { value: dateRange,                label: '祭儀期間' },
    { value: `${confirmed}/${total}`, label: '已公告' },
    { value: festivalDays,             label: '祭典日數' },
  ].map(t => `<div class="info-tile">
      <div class="info-tile-value">${t.value}</div>
      <div class="info-tile-label">${t.label}</div>
    </div>`).join('');

  document.getElementById('infoSources').innerHTML = Object.values(SOURCES)
    .map(s => `<a class="info-source-link" href="${s.url}" target="_blank" rel="noopener">
      <span class="info-source-label">${s.label}</span>
      <span class="info-source-arrow">↗</span>
    </a>`).join('');

  initCoverageBox();
  initContribForm();
}

function initCoverageBox() {
  const list = typeof BULUO_UNCOVERED === 'undefined' ? [] : BULUO_UNCOVERED;
  if (!list.length) return;

  document.getElementById('nChineseSuggest').innerHTML = list
    .map(r => `<option value="${r.chinese_name}">${r.county}${r.township}${r.indigenous_name ? ' · ' + r.indigenous_name : ''}</option>`)
    .join('');
}

function openContrib(which) {
  document.getElementById('formReport').classList.toggle('active', which === 'report');
  document.getElementById('formNew').classList.toggle('active', which === 'new');
  const formEl = document.getElementById(which === 'report' ? 'formReport' : 'formNew');
  setTimeout(() => formEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function initContribForm() {
  /* Populate the village dropdown in the error-report form */
  const sel     = document.getElementById('rVillage');
  const grouped = {};
  VILLAGES.forEach(v => {
    const gk = `${v.county} · ${v.township}`;
    (grouped[gk] ??= []).push(v);
  });
  Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).forEach(([group, vs]) => {
    const og = document.createElement('optgroup');
    og.label = group;
    vs.forEach(v => {
      const o = document.createElement('option');
      o.value = v.id;
      o.textContent = v.chinese + (v.amis ? ` · ${v.amis}` : '');
      og.appendChild(o);
    });
    sel.appendChild(og);
  });

  /* Dynamic county list for new-village form (Phase B: replaces hardcoded 花蓮/臺東) */
  const nCounty   = document.getElementById('nCounty');
  const counties  = new Set(Object.keys(TOWNSHIP_MAP));
  const uncovered = typeof BULUO_UNCOVERED !== 'undefined' ? BULUO_UNCOVERED : [];
  uncovered.forEach(r => counties.add(r.county));
  [...counties].sort().forEach(c => {
    const o = document.createElement('option');
    o.value = o.textContent = c;
    nCounty.appendChild(o);
  });

  /* nChineseSuggest is already populated in initCoverageBox() above */

  /* Show/hide conditional update field based on issue type */
  document.getElementById('rIssueGroup').addEventListener('change', e => {
    const val  = e.target.value;
    const wrap = document.getElementById('rUpdateWrap');
    const lbl  = document.getElementById('rUpdateLabel');
    if (val === '日期有誤') {
      wrap.classList.add('visible');
      lbl.textContent = '更新後日期';
      document.getElementById('rUpdate').placeholder = '例：8/15 六';
    } else if (val === '場地更新') {
      wrap.classList.add('visible');
      lbl.textContent = '更新後場地';
      document.getElementById('rUpdate').placeholder = '例：文化活動中心廣場';
    } else {
      wrap.classList.remove('visible');
    }
  });

}

function cascadeTownship() {
  const county = document.getElementById('nCounty').value;
  const sel    = document.getElementById('nTownship');
  if (!county) {
    sel.innerHTML = '<option value="">— 先選縣市 —</option>';
    return;
  }
  const townships = new Set(TOWNSHIP_MAP[county] ?? []);
  const uncovered = typeof BULUO_UNCOVERED !== 'undefined' ? BULUO_UNCOVERED : [];
  uncovered.filter(r => r.county === county).forEach(r => townships.add(r.township));
  sel.innerHTML = [...townships].sort().map(t => `<option value="${t}">${t}</option>`).join('');
}

async function atPost(table, fields) {
  const r = await fetch('/api/contribute', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ table, fields }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
}

function setFormState(statusEl, submitEl, state, msg) {
  statusEl.className  = 'form-status ' + (state === 'ok' ? 'ok' : state === 'err' ? 'err' : '');
  statusEl.textContent = msg;
  submitEl.disabled   = state === 'loading';
}

async function submitReport() {
  const village = document.getElementById('rVillage').value;
  const issue   = document.querySelector('input[name="rIssue"]:checked')?.value;
  const statusEl = document.getElementById('rStatus');
  const submitEl = document.getElementById('rSubmit');

  if (!village || !issue) { setFormState(statusEl, submitEl, 'err', '請選擇部落和問題類型'); return; }
  setFormState(statusEl, submitEl, 'loading', '');

  const v = VILLAGES.find(x => x.id === village);
  try {
    await atPost(AT_TBL_REPORTS, {
      '部落ID':   village,
      '部落名稱': v?.chinese ?? '',
      '問題類型': issue,
      '更新資訊': document.getElementById('rUpdate').value.trim(),
      '來源網址': document.getElementById('rSource').value.trim(),
      '備註':     document.getElementById('rNote').value.trim(),
    });
    setFormState(statusEl, submitEl, 'ok', '已送出，謝謝你的回報！');
    trackEvent('report_submit', { result: 'ok', village, issue });
    document.getElementById('formReport').reset();
    document.getElementById('rUpdateWrap').classList.remove('visible');
  } catch (e) {
    setFormState(statusEl, submitEl, 'err', `送出失敗 (${e.message})，請稍後再試`);
    trackEvent('report_submit', { result: 'error' });
  }
}

async function submitNew() {
  const chinese   = document.getElementById('nChinese').value.trim();
  const county    = document.getElementById('nCounty').value;
  const township  = document.getElementById('nTownship').value;
  const date      = document.getElementById('nDate').value.trim();
  const statusEl  = document.getElementById('nStatus');
  const submitEl  = document.getElementById('nSubmit');

  if (!chinese || !county || !township || !date) {
    setFormState(statusEl, submitEl, 'err', '請填寫必填欄位（中文名稱、縣市、鄉鎮、日期）');
    return;
  }
  setFormState(statusEl, submitEl, 'loading', '');

  try {
    await atPost(AT_TBL_NEW, {
      '中文名稱': chinese,
      'Amis名稱': document.getElementById('nAmis').value.trim(),
      '縣市':     county,
      '鄉鎮':     township,
      '日期':     date,
      '場地':     document.getElementById('nVenue').value.trim(),
      '來源網址': document.getElementById('nSource').value.trim(),
      '備註':     document.getElementById('nNote').value.trim(),
    });
    setFormState(statusEl, submitEl, 'ok', '已送出，謝謝你的貢獻！');
    trackEvent('new_submit', { result: 'ok', county, township });
    document.getElementById('formNew').reset();
    document.getElementById('nTownship').innerHTML = '<option value="">— 先選縣市 —</option>';
  } catch (e) {
    setFormState(statusEl, submitEl, 'err', `送出失敗 (${e.message})，請稍後再試`);
    trackEvent('new_submit', { result: 'error' });
  }
}
