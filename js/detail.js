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

  // Row 2: "show in Pokoh map" (relocated from the header's icon-only
  // button, 2026-07-14 — a bare pin icon there didn't communicate what it
  // did) inline with the welcome-day pill — sharing a row rather than each
  // getting its own (2026-07-14) since both are short. Unlike the list
  // cards' .card-welcome (cardBodyHtml(), which omits the pill entirely
  // when there's no welcome_date), the detail overlay always shows it —
  // "無資料" instead of a date — per explicit request specific to this and
  // the map floater, not list cards generally.
  const pokohMapLinkHtml = `<a class="detail-pokohmap-link" href="javascript:void(0)" onclick="closeDetail(); goToMapVillage('${v.id}')">
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="5.5" r="3.5" stroke="currentColor" stroke-width="1.5"/><circle cx="7" cy="5.5" r="1.5" fill="currentColor"/><path d="M7 9v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    顯示於 Pokoh 地圖
  </a>`;
  const welcomeTimeText = v.welcome_time ? ` ${v.welcome_time}` : '';
  const welcomePillHtml = v.welcome_date
    ? `<span class="detail-welcome">迎賓日 ${dateHtml(v.welcome_date)}${welcomeTimeText}</span>`
    : `<span class="detail-welcome">迎賓日 無資料</span>`;
  const row2Html = `<div class="detail-row2">${pokohMapLinkHtml}${welcomePillHtml}</div>`;

  // Row 3: venue — county/township now dot-separated like the mobile card
  // format, plus an explicit "open in Google Maps" hint (2026-07-14) so the
  // link's destination isn't only implied by the pin icon.
  const venueRowHtml = `<div class="detail-venue-row">${venueLinkHtml(v, { forceDesktopLoc: true, dotBetweenAdmin: true, mapsHint: true })}</div>`;

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

  const contactsHtml = detail.contacts?.length
    ? `<div class="detail-section-title">聯絡資訊</div>
       <div class="detail-contacts">
         ${detail.contacts.map(c => `
           <div class="detail-contact-row">
             <span class="detail-contact-role">${c.role}</span>
             <span class="detail-contact-name">${c.name}</span>
             <a class="detail-contact-phone" href="tel:${c.phone.replace(/-/g, '')}">${c.phone}</a>
           </div>`).join('')}
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
                   ${d.name ? `<span class="detail-day-name">${d.name}</span>` : ''}
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
      <div class="card-top">
        ${namesHtml(v, { showAmis: false })}
        <span class="card-date">${dateHtml(v.date)}</span>
      </div>
      ${row2Html}
      ${venueRowHtml}
    </div>
    ${posterHtml}
    ${contactsHtml}
    ${daysHtml}
    ${historyHtml}
  `;
}

function openDetail(id, source = 'card') {
  const v = EVENTS.find(x => x.id === id);
  if (!v) return;
  document.getElementById('detailBody').innerHTML = renderDetailBody(v);
  document.getElementById('detailHeaderTitle').textContent = indigenousNameInfo(v).latinName;
  document.getElementById('detailShareBtn').onclick = () => shareEvent(id, v.chinese);
  // Header save button is persistent markup (unlike the body, not
  // regenerated per open) — reset its target id + saved-state class on
  // every open, same broadcast mechanism onSaveTap() already uses for
  // every other save button on the page (matched via data-save-id).
  const saveBtn = document.getElementById('detailSaveBtn');
  saveBtn.dataset.saveId = id;
  saveBtn.classList.toggle('saved', isSaved(id));
  saveBtn.onclick = () => onSaveTap(id);
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
  trackEvent('detail_open', { id, name: v.chinese, source });
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
