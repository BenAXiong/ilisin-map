/* ═══════════════════════════════════════════════════
   VILLAGE DETAIL OVERLAY
   ═══════════════════════════════════════════════════ */

function renderDetailBody(v) {
  const detail  = getScheduleDetail(v);

  const welcomeHtml = detail.welcome
    ? `<div class="detail-welcome">迎賓日 ${detail.welcome.date}${detail.welcome.time ? ` ${detail.welcome.time}` : ''}</div>`
    : '';

  const posterHtml = detail.poster
    ? `<div class="detail-poster">
         <img src="${detail.poster.src}" alt="${v.chinese} 祭儀海報" loading="lazy" />
         ${detail.poster.credit ? `<div class="detail-poster-credit">圖片來源：${detail.poster.credit}</div>` : ''}
       </div>`
    : '';

  const daysHtml = detail.days
    ? `<div class="detail-section-title">祭典流程</div>
       <div class="detail-days">
         ${detail.days.map(d => `
           <div class="detail-day-row">
             <span class="detail-day-date">${d.date}</span>
             <span class="detail-day-name">${d.name}</span>
             <span class="detail-day-zh">${d.zh}</span>
             ${d.desc_zh ? `<span class="detail-day-desc">${d.desc_zh}</span>` : ''}
           </div>`).join('')}
       </div>`
    : '';

  const historyHtml = detail.history
    ? `<div class="detail-section-title">部落介紹</div><p class="detail-history">${detail.history}</p>`
    : '';

  return `
    <div class="village-card detail-header-card card-${v.status}">
      ${cardBodyHtml(v)}
      ${welcomeHtml}
    </div>
    <button class="detail-map-link" onclick="closeDetail();goToMapVillage('${v.id}')">在地圖上查看 ›</button>
    ${posterHtml}
    ${daysHtml}
    ${historyHtml}
  `;
}

function openDetail(id) {
  const v = VILLAGES.find(x => x.id === id);
  if (!v) return;
  document.getElementById('detailBody').innerHTML = renderDetailBody(v);
  const overlay = document.getElementById('detailOverlay');
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('open'));
  trackEvent('detail_open', { id, name: v.chinese });
}

function closeDetail() {
  const overlay = document.getElementById('detailOverlay');
  overlay.classList.remove('open');
  setTimeout(() => { overlay.hidden = true; }, 200);
}

document.getElementById('detailCloseBtn').addEventListener('click', closeDetail);
// Tapping the dimmed backdrop (outside the panel) closes it, same as the close button.
document.getElementById('detailOverlay').addEventListener('click', e => {
  if (e.target.id === 'detailOverlay') closeDetail();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !document.getElementById('detailOverlay').hidden) closeDetail();
});
