/* ═══════════════════════════════════════════════════
   INFO + CONTRIBUTION FORM
   ═══════════════════════════════════════════════════ */

const AT_TBL_REPORTS = 'Reports';
const AT_TBL_NEW     = 'Submissions';

/* Build a county → sorted township array map from event data.
   Runs at parse time — EVENTS comes from data.js (loaded first). */
const TOWNSHIP_MAP = {};
EVENTS.forEach(v => {
  (TOWNSHIP_MAP[v.county] ??= new Set()).add(v.township);
});
Object.keys(TOWNSHIP_MAP).forEach(c => {
  TOWNSHIP_MAP[c] = [...TOWNSHIP_MAP[c]].sort();
});

function festivalDayCount(dateStr) {
  if (!dateStr || dateStr === '—' || dateStr === '停辦') return 0;
  const start = parseStartDate(dateStr);
  if (!start) return 0;
  const end = parseEndDate(dateStr) || start;
  return Math.round((end - start) / 86400000) + 1;
}

function initInfo() {
  // Cards are Amis-only for now — buluo_id coverage for other groups (pwn/pyu/
  // szy/ckv) is too partial to build a meaningful denominator yet.
  const confirmed = EVENTS.reduce((sum, v) => {
    if (v.group !== 'ami' || v.status !== 'confirmed') return sum;
    return sum + (v.buluo_ids ? v.buluo_ids.length : 1);
  }, 0);
  // Denominator is the known Amis buluo population (BULUO_REF ami- entries +
  // BULUO_UNCOVERED), not EVENTS.length — so it reads as "of all known Amis
  // buluo, how many already have an announced date," not "of festivals we
  // happen to be tracking." Derived, not hardcoded, so it can't go stale.
  const amisRefCount = typeof BULUO_REF === 'undefined' ? 0
    : Object.keys(BULUO_REF).filter(id => id.startsWith('ami-')).length;
  const amisUncoveredCount = typeof BULUO_UNCOVERED === 'undefined' ? 0 : BULUO_UNCOVERED.length;
  const total = amisRefCount + amisUncoveredCount;

  const festivalDays = EVENTS
    .filter(v => v.group === 'ami' && v.status !== 'cancelled' && v.date && v.date !== '—')
    .reduce((sum, v) => sum + festivalDayCount(v.date), 0);

  let firstDate = null, lastDate = null;
  EVENTS.forEach(v => {
    if (v.group !== 'ami' || v.status === 'cancelled') return;
    const s = parseStartDate(v.date);
    if (!s) return;
    const e = parseEndDate(v.date) || s;
    if (!firstDate || s < firstDate) firstDate = s;
    if (!lastDate || e > lastDate) lastDate = e;
  });
  const dateRange = firstDate
    ? `${firstDate.getMonth() + 1}/${firstDate.getDate()}~${lastDate.getMonth() + 1}/${lastDate.getDate()}`
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
  const isReport = which === 'report';
  // Reset to the form view (not a leftover success card), and clear any
  // invalid/valid marks + error banner left over from a previous failed
  // attempt — every time the modal is opened, not just after a submission.
  document.getElementById('reportSuccess').hidden = true;
  document.getElementById('newSuccess').hidden = true;
  resetFormValidity('formReport');
  resetFormValidity('formNew');
  document.getElementById('formReport').classList.toggle('active', isReport);
  document.getElementById('formNew').classList.toggle('active', !isReport);
  document.getElementById('contribTitle').textContent = isReport ? '回報錯誤' : '新增部落';
  const overlay = document.getElementById('contribOverlay');
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('open'));
  trackEvent('form_open', { form: which });
}

function closeContrib() {
  const overlay = document.getElementById('contribOverlay');
  overlay.classList.remove('open');
  setTimeout(() => { overlay.hidden = true; }, 200);
}

document.getElementById('contribCloseBtn').addEventListener('click', closeContrib);
// Tapping the dimmed backdrop (outside the panel) closes it, same convention
// as the village detail overlay (js/detail.js).
document.getElementById('contribOverlay').addEventListener('click', e => {
  if (e.target.id === 'contribOverlay') closeContrib();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !document.getElementById('contribOverlay').hidden) closeContrib();
});

function initContribForm() {
  /* Populate the village dropdown in the error-report form */
  const sel     = document.getElementById('rVillage');
  const grouped = {};
  EVENTS.forEach(v => {
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

  /* Show/hide conditional update field based on issue type — it becomes
     genuinely required (not just visible) for 日期有誤/場地更新, since a
     report of "the date is wrong" with no proposed correction isn't
     actionable. required-ness itself is driven by rUpdateWrap's 'visible'
     class (see REQUIRED_FIELDS.formReport's requiredIf below); the
     `required` attribute here just keeps that reflected for a11y. */
  document.getElementById('rIssueGroup').addEventListener('change', e => {
    const val  = e.target.value;
    const wrap = document.getElementById('rUpdateWrap');
    const lbl  = document.getElementById('rUpdateLabel');
    const inp  = document.getElementById('rUpdate');
    if (val === '日期有誤') {
      wrap.classList.add('visible');
      lbl.innerHTML = '更新後日期<span class="req">*</span>';
      inp.placeholder = '例：7/15';
      inp.required = true;
    } else if (val === '場地更新') {
      wrap.classList.add('visible');
      lbl.innerHTML = '更新後場地<span class="req">*</span>';
      inp.placeholder = '例：文化活動中心廣場';
      inp.required = true;
    } else {
      wrap.classList.remove('visible');
      inp.required = false;
      clearField('rUpdate');
    }
  });

  wireLiveValidation('formReport');
  wireLiveValidation('formNew');
}

// County → township cascade. When the chosen county only has one known
// township, select it automatically instead of making the visitor pick from
// a list of one — otherwise, a real placeholder option forces an explicit
// choice (previously the first township was silently pre-selected with no
// placeholder, so "required" didn't actually guarantee an intentional pick).
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
  const list = [...townships].sort();
  if (list.length === 1) {
    // A real, auto-selected value — safe to mark valid immediately.
    sel.innerHTML = `<option value="${list[0]}">${list[0]}</option>`;
    markField('nTownship', true);
  } else {
    // Defaults to the empty placeholder — leave unmarked until the visitor
    // actually picks one (marking it invalid here would flag the field
    // before they've had any chance to interact with it).
    sel.innerHTML = '<option value="">— 選擇鄉鎮 —</option>' + list.map(t => `<option value="${t}">${t}</option>`).join('');
    clearField('nTownship');
  }
}

/* ── Inline field validation ──────────────────────────────────────────
   Required fields per form, validated live (on blur/change) and again on
   submit — border color + a small icon on the field itself (app.css), not
   just the aggregate .form-status banner. `requiredIf` lets a field be
   conditionally required (rUpdate — see the rIssueGroup listener above). */
const REQUIRED_FIELDS = {
  formReport: [
    { id: 'rVillage',    label: '部落',       kind: 'select' },
    { id: 'rIssueGroup', label: '問題類型',   kind: 'radio', name: 'rIssue' },
    { id: 'rUpdate',     label: '更新後資訊', kind: 'text',
      requiredIf: () => document.getElementById('rUpdateWrap').classList.contains('visible') },
  ],
  formNew: [
    { id: 'nChinese',  label: '中文名稱', kind: 'text'   },
    { id: 'nCounty',   label: '縣市',     kind: 'select' },
    { id: 'nTownship', label: '鄉鎮',     kind: 'select' },
  ],
};

// Maps a form key to the status-banner/submit-button pair resetFormValidity
// needs — kept alongside REQUIRED_FIELDS rather than hardcoded per call site.
const FORM_META = {
  formReport: { statusId: 'rStatus', submitId: 'rSubmit' },
  formNew:    { statusId: 'nStatus', submitId: 'nSubmit' },
};

function isRequired(f) {
  return !f.requiredIf || f.requiredIf();
}

function fieldValue(f) {
  if (f.kind === 'radio') return document.querySelector(`input[name="${f.name}"]:checked`)?.value ?? '';
  return document.getElementById(f.id).value.trim();
}

function markField(id, valid) {
  document.getElementById(id).classList.toggle('invalid', !valid);
  document.getElementById(id).classList.toggle('valid', valid);
}

function clearField(id) {
  document.getElementById(id).classList.remove('invalid', 'valid');
}

function wireLiveValidation(formKey) {
  REQUIRED_FIELDS[formKey].forEach(f => {
    const el  = document.getElementById(f.id);
    const evt = f.kind === 'text' ? 'blur' : 'change';
    el.addEventListener(evt, () => {
      if (!isRequired(f)) { clearField(f.id); return; }
      markField(f.id, !!fieldValue(f));
    });
  });
}

// Validates every currently-required field in a form, marking each one's
// visual state (a field whose requiredIf is false right now is cleared, not
// validated). Returns the first invalid field (for focus) or null if the
// form is valid.
function validateForm(formKey) {
  let firstInvalid = null;
  REQUIRED_FIELDS[formKey].forEach(f => {
    if (!isRequired(f)) { clearField(f.id); return; }
    const valid = !!fieldValue(f);
    markField(f.id, valid);
    if (!valid) {
      firstInvalid ??= f;
      trackEvent('field_error', { form: formKey, field: f.id });
    }
  });
  return firstInvalid;
}

// Clears every field's valid/invalid mark and the status banner for a form —
// called on every modal open so a previous failed-and-abandoned attempt
// never leaves stale error styling for the next visit.
function resetFormValidity(formKey) {
  REQUIRED_FIELDS[formKey].forEach(f => clearField(f.id));
  const { statusId, submitId } = FORM_META[formKey];
  setFormState(document.getElementById(statusId), document.getElementById(submitId), '', '');
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

function escHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function successRow(label, value) {
  return value ? `<div class="form-success-row"><span class="form-success-label">${label}</span><span class="form-success-value">${escHtml(value)}</span></div>` : '';
}

// Swaps the form out for a confirmation card summarizing what was actually
// submitted, rather than just a one-line "sent!" status message.
function renderSuccess(elId, title, rows) {
  const el = document.getElementById(elId);
  el.innerHTML = `
    <div class="form-success-icon">✓</div>
    <div class="form-success-title">${title}</div>
    <div class="form-success-fields">${rows.join('')}</div>
    <button class="form-submit" onclick="closeContrib()">完成</button>
  `;
  el.hidden = false;
}

async function submitReport() {
  const statusEl = document.getElementById('rStatus');
  const submitEl = document.getElementById('rSubmit');
  const firstInvalid = validateForm('formReport');
  if (firstInvalid) {
    setFormState(statusEl, submitEl, 'err', '請填寫必填欄位');
    document.getElementById(firstInvalid.id).focus();
    return;
  }
  setFormState(statusEl, submitEl, 'loading', '');

  const village = document.getElementById('rVillage').value;
  const issue   = document.querySelector('input[name="rIssue"]:checked')?.value;
  const update  = document.getElementById('rUpdate').value.trim();
  const source  = document.getElementById('rSource').value.trim();
  const note    = document.getElementById('rNote').value.trim();
  const v = EVENTS.find(x => x.id === village);
  try {
    await atPost(AT_TBL_REPORTS, {
      '部落ID':   village,
      '部落名稱': v?.chinese ?? '',
      '問題類型': issue,
      '更新資訊': update,
      '來源網址': source,
      '備註':     note,
    });
    trackEvent('form_submit_ok', { form: 'report', village, issue });
    document.getElementById('formReport').classList.remove('active');
    document.getElementById('formReport').reset();
    document.getElementById('rUpdateWrap').classList.remove('visible');
    document.getElementById('rUpdate').required = false;
    resetFormValidity('formReport');
    renderSuccess('reportSuccess', '已送出回報，謝謝你的協助！', [
      successRow('部落',     v?.chinese ?? village),
      successRow('問題類型', issue),
      successRow('更新資訊', update),
      successRow('來源網址', source),
      successRow('備註',     note),
    ]);
  } catch (e) {
    setFormState(statusEl, submitEl, 'err', `送出失敗 (${e.message})，請稍後再試`);
  }
}

async function submitNew() {
  const statusEl = document.getElementById('nStatus');
  const submitEl = document.getElementById('nSubmit');
  const firstInvalid = validateForm('formNew');
  if (firstInvalid) {
    setFormState(statusEl, submitEl, 'err', '請填寫必填欄位');
    document.getElementById(firstInvalid.id).focus();
    return;
  }
  setFormState(statusEl, submitEl, 'loading', '');

  const chinese  = document.getElementById('nChinese').value.trim();
  const amis     = document.getElementById('nAmis').value.trim();
  const county   = document.getElementById('nCounty').value;
  const township = document.getElementById('nTownship').value;
  const date     = document.getElementById('nDate').value.trim();
  const venue    = document.getElementById('nVenue').value.trim();
  const source   = document.getElementById('nSource').value.trim();
  const note     = document.getElementById('nNote').value.trim();

  try {
    await atPost(AT_TBL_NEW, {
      '中文名稱': chinese,
      'Amis名稱': amis,
      '縣市':     county,
      '鄉鎮':     township,
      '日期':     date,
      '場地':     venue,
      '來源網址': source,
      '備註':     note,
    });
    trackEvent('form_submit_ok', { form: 'new', county, township });
    document.getElementById('formNew').classList.remove('active');
    document.getElementById('formNew').reset();
    document.getElementById('nTownship').innerHTML = '<option value="">— 先選縣市 —</option>';
    resetFormValidity('formNew');
    renderSuccess('newSuccess', '已送出新增，謝謝你的貢獻！', [
      successRow('中文名稱',   chinese),
      successRow('Amis 名稱', amis),
      successRow('縣市',       county),
      successRow('鄉鎮',       township),
      successRow('日期',       date),
      successRow('場地',       venue),
      successRow('來源網址',   source),
      successRow('備註',       note),
    ]);
  } catch (e) {
    setFormState(statusEl, submitEl, 'err', `送出失敗 (${e.message})，請稍後再試`);
  }
}
