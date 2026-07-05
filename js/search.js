/* ═══════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════ */

const COUNTY_FILTERS = new Set(['hualien', 'taitung', 'taitung-city']);
let srFilters = new Set();

/* Normalize smart quotes and curly apostrophes → straight before matching */
function srNorm(str) {
  return (str || '').normalize('NFC').toLowerCase().replace(/[''ʼ`]/g, "'");
}

function getSearchResults(query, filters) {
  const q = srNorm(query.trim());
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);

  return VILLAGES
    .filter(v => {
      if (q) {
        const ref = v.buluo_id && typeof BULUO_REF !== 'undefined' ? BULUO_REF[v.buluo_id] : null;
        const hay = [v.chinese, v.amis, v.township, v.venue,
          ...(ref ? [...ref.chinese_name_alt, ref.indigenous_name, ...ref.indigenous_name_alt] : [])
        ].map(srNorm).join(' ');
        if (!hay.includes(q)) return false;
      }
      if (filters.has('week')) {
        const d = parseStartDate(v.date);
        if (!d || d < now || d >= weekEnd) return false;
      }
      if (filters.has('hualien')      && v.county    !== '花蓮縣') return false;
      if (filters.has('taitung')      && v.county    !== '臺東縣') return false;
      if (filters.has('taitung-city') && v.township  !== '臺東市') return false;
      if (filters.has('confirmed')    && v.status    !== 'confirmed') return false;
      return true;
    })
    .sort((a, b) => {
      if (a.status === 'cancelled' && b.status !== 'cancelled') return  1;
      if (b.status === 'cancelled' && a.status !== 'cancelled') return -1;
      const ad = parseStartDate(a.date), bd = parseStartDate(b.date);
      if (ad && !bd) return -1;
      if (!ad && bd) return  1;
      if (!ad && !bd) return 0;
      return ad - bd;
    });
}

/* ── Recent searches ─────────────────────────────── */
const RECENT_KEY  = 'pokoh-searches';
const RECENT_MAX  = 50;
const RECENT_PAGE = 10;
let recentShown   = RECENT_PAGE;

function getRecents() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
  catch { return []; }
}

function saveRecentSearch(q) {
  const t = q.trim();
  if (t.length < 2) return;
  const list = getRecents().filter(x => x !== t);
  list.unshift(t);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
}

function removeRecentSearch(q) {
  const list = getRecents().filter(x => x !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  recentShown = RECENT_PAGE;
  renderSearchResults();
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
  recentShown = RECENT_PAGE;
  renderSearchResults();
}

function renderRecents(div) {
  const all = getRecents();
  if (all.length === 0) {
    div.innerHTML = '<div class="sr-hint">輸入部落名稱或選擇篩選條件</div>';
    return;
  }
  const page    = all.slice(0, recentShown);
  const hasMore = all.length > recentShown;
  const rows    = page.map(q =>
    `<div class="sr-recent-row" data-action="apply" data-q="${encodeURIComponent(q)}">
      <span class="sr-recent-icon">↺</span>
      <span class="sr-recent-text">${q}</span>
      <button class="sr-recent-del" data-action="del" data-q="${encodeURIComponent(q)}" aria-label="刪除">✕</button>
    </div>`
  ).join('');
  const moreBtn = hasMore
    ? `<button class="sr-show-more" data-action="more">顯示更多 ${all.length - recentShown} 筆</button>`
    : '';
  div.innerHTML = `
    <div class="sr-recent-header">
      <span class="sr-recent-title">最近搜尋</span>
      <button class="sr-clear-all" data-action="clear">清除</button>
    </div>
    ${rows}${moreBtn}`;
}

function renderSearchResults() {
  const q      = document.getElementById('srInput').value;
  const div    = document.getElementById('srResults');
  const hasAny = q.trim().length > 0 || srFilters.size > 0;

  if (!hasAny) {
    recentShown = RECENT_PAGE;
    renderRecents(div);
    return;
  }

  const list = getSearchResults(q, srFilters);

  if (list.length === 0) {
    div.innerHTML = '<div class="sr-hint">找不到符合條件的部落</div>';
    return;
  }

  div.innerHTML = `<div class="sr-count">${list.length} 筆結果</div>
    ${list.map(v => cardHtml(v, `data-vid="${v.id}" onclick="srCardTap('${v.id}')"`)).join('')}`;
}

function srCardTap(id) {
  const q = document.getElementById('srInput').value.trim();
  if (q.length >= 2) { saveRecentSearch(q); trackEvent('search', { query: q }); }
  goToMapVillage(id);
}

function srOnInput() {
  document.getElementById('srClear').hidden = document.getElementById('srInput').value.length === 0;
  renderSearchResults();
}

/* ── Event listeners ── */

/* 'input' fires on every keystroke; 'compositionend' fires when IME commits Chinese */
document.getElementById('srInput').addEventListener('input', srOnInput);
document.getElementById('srInput').addEventListener('compositionend', srOnInput);
document.getElementById('srInput').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const q = document.getElementById('srInput').value.trim();
  if (q.length >= 2) { saveRecentSearch(q); trackEvent('search', { query: q }); }
  e.target.blur();
});

document.getElementById('srClear').addEventListener('click', () => {
  document.getElementById('srInput').value = '';
  document.getElementById('srClear').hidden = true;
  renderSearchResults();
  document.getElementById('srInput').focus();
});

document.getElementById('srResults').addEventListener('click', e => {
  const del   = e.target.closest('[data-action="del"]');
  const clear = e.target.closest('[data-action="clear"]');
  const more  = e.target.closest('[data-action="more"]');
  const apply = !del && !clear && !more && e.target.closest('[data-action="apply"]');

  if (del)   { e.stopPropagation(); removeRecentSearch(decodeURIComponent(del.dataset.q)); return; }
  if (clear) { clearRecentSearches(); return; }
  if (more)  { recentShown += RECENT_PAGE; renderSearchResults(); return; }
  if (apply) {
    const q = decodeURIComponent(apply.dataset.q);
    document.getElementById('srInput').value = q;
    document.getElementById('srClear').hidden = false;
    renderSearchResults();
  }
});

document.getElementById('srChips').addEventListener('click', e => {
  const chip = e.target.closest('.sr-chip');
  if (!chip) return;
  const key = chip.dataset.filter;

  if (srFilters.has(key)) {
    srFilters.delete(key);
    chip.classList.remove('active');
  } else {
    if (COUNTY_FILTERS.has(key)) {
      COUNTY_FILTERS.forEach(k => {
        srFilters.delete(k);
        document.querySelector(`.sr-chip[data-filter="${k}"]`)?.classList.remove('active');
      });
    }
    srFilters.add(key);
    chip.classList.add('active');
    trackEvent('search_filter', { filter: key });
  }
  renderSearchResults();
});
