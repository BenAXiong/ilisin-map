/* ═══════════════════════════════════════════════════
   VILLAGE DETAIL OVERLAY
   ═══════════════════════════════════════════════════ */

// Groups consecutive same-date entries so multiple sub-events on one day
// (e.g. Palaylay + Malikoda, both 7/9) share one container with the date
// shown once, rather than each getting its own separate boxed row.
function groupDaysByDate(days) {
  const groups = [];
  for (const d of days) {
    const last = groups.at(-1);
    if (last && last.date === d.date) last.events.push(d);
    else groups.push({ date: d.date, events: [d] });
  }
  return groups;
}

function renderDetailBody(v) {
  const detail  = getScheduleDetail(v);

  let welcomeHtml = '';
  if (v.welcome_date) {
    const timeText = v.welcome_time ? ` ${v.welcome_time}` : '';
    welcomeHtml = `<div class="detail-welcome">迎賓日 ${dateHtml(v.welcome_date)}${timeText}</div>`;
  }

  let creditHtml = '';
  if (detail.poster?.credit) {
    creditHtml = detail.poster.creditUrl
      ? `<a class="detail-poster-credit" href="${detail.poster.creditUrl}" target="_blank" rel="noopener">圖片來源：${detail.poster.credit}</a>`
      : `<span class="detail-poster-credit">圖片來源：${detail.poster.credit}</span>`;
  }
  const posterHtml = detail.poster
    ? `<div class="detail-poster">
         <img src="${detail.poster.url}" alt="${v.chinese} 祭儀海報" loading="lazy" />
         ${creditHtml}
       </div>`
    : '';

  const daysHtml = detail.days
    ? `<div class="detail-section-title">祭典流程</div>
       <div class="detail-days">
         ${groupDaysByDate(detail.days).map(g => `
           <div class="detail-day-row">
             <span class="detail-day-date">${dateHtml(g.date)}</span>
             <div class="detail-day-events">
               ${g.events.map(d => `
                 <div class="detail-day-event">
                   <span class="detail-day-name">${d.name}</span>
                   <span class="detail-day-zh">${d.zh}</span>
                   ${d.desc_zh ? `<span class="detail-day-desc">${d.desc_zh}</span>` : ''}
                 </div>`).join('')}
             </div>
           </div>`).join('')}
       </div>`
    : '';

  const historyHtml = detail.history
    ? `<div class="detail-section-title">部落介紹</div><p class="detail-history">${detail.history}</p>`
    : '';

  return `
    <div class="village-card detail-header-card card-${v.status}">
      ${cardBodyHtml(v, { showAmis: false, showWelcome: false, forceDesktopLoc: true })}
      ${welcomeHtml}
    </div>
    ${posterHtml}
    ${daysHtml}
    ${historyHtml}
  `;
}

function openDetail(id) {
  const v = EVENTS.find(x => x.id === id);
  if (!v) return;
  document.getElementById('detailBody').innerHTML = renderDetailBody(v);
  document.getElementById('detailHeaderTitle').textContent = indigenousNameInfo(v).latinName;
  document.getElementById('detailMapLink').onclick = () => { closeDetail(); goToMapVillage(id); };
  document.getElementById('detailShareBtn').onclick = () => shareEvent(id, v.chinese);
  // 'tbd'/'cancelled' entries have no real date to put in an .ics — hide
  // rather than show a dead button (same gating buildIcs() itself falls
  // back on via parseStartDate returning null, kept explicit here too).
  const calBtn = document.getElementById('detailCalendarBtn');
  calBtn.style.display = v.status === 'confirmed' ? '' : 'none';
  calBtn.onclick = () => onCalendarTap(id);
  history.replaceState(null, '', shareUrl(id));
  const overlay = document.getElementById('detailOverlay');
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('open'));
  trackEvent('detail_open', { id, name: v.chinese });
}

function closeDetail() {
  const overlay = document.getElementById('detailOverlay');
  overlay.classList.remove('open');
  setTimeout(() => { overlay.hidden = true; }, 200);
  history.replaceState(null, '', location.pathname);
}

document.getElementById('detailCloseBtn').addEventListener('click', closeDetail);
// Tapping the dimmed backdrop (outside the panel) closes it, same as the close button.
document.getElementById('detailOverlay').addEventListener('click', e => {
  if (e.target.id === 'detailOverlay') closeDetail();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !document.getElementById('detailOverlay').hidden) closeDetail();
});
