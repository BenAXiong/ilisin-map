// ── Schedule detail ─────────────────────────────────────────────
// Hand-curated per-EVENTS-entry schedule detail: sub-events, poster image,
// optional history prose. Keyed by EVENTS.id, not buluo_id — this data is
// festival-instance/year-specific, unlike the enduring identity facts in
// BULUO_REF (buluo-ref.js). (迎賓日/welcome-day info lives directly on
// EVENTS as `welcome_date`/`welcome_time` — see data.js — since it's a
// simple scalar fact needed by card/badge/prerender rendering, not
// overlay-only content like the fields below.)
//
// Shape per entry (all keys optional):
//   poster:  { url, credit, creditUrl?, kind } — kind: 'lineup' | 'summary'.
//            `credit` is the link text shown ("圖片來源：{credit}"); when
//            `creditUrl` is set it becomes a link to where the poster was
//            published, never displaying the raw URL text itself.
//   days:    [{ date, zh, name?, desc_zh?, desc_en? }, ...]  — day-by-day
//            sub-event breakdown, only when a source actually gives one.
//            One event per row — if a single day has multiple named
//            sub-events, give each its own `days` entry (same `date` is
//            fine) rather than combining names/zh into one row. `name` is
//            optional (added 2026-07-14) — omit it for tourism-program
//            activity lists that have no traditional/indigenous-language
//            term (e.g. `tt-dh-01`'s "千人牽手大圓舞"), vs. `tt-tt-01`'s
//            named ritual stages where `name` carries the Amis term.
//   history: string                        — hand-authored cultural/history
//            prose. Deliberately NOT sourced from BULUO_REF.notes, which is
//            internal data-provenance text, not visitor-facing copy.
//   contacts: [{ role, name, phone }, ...]  — real personal contact info
//            (頭目/聯絡人), only when the source publishes it. `role` is a
//            free-text Chinese label as given by the source (e.g. '頭目',
//            '聯絡人'), not an enum. Personal names/cellphone numbers of real
//            individuals — per project-owner decision (2026-07-14), stored
//            and displayed exactly as officially sourced (not restricted to
//            office-only numbers, not excluded from prerendered/SEO output).
//            Omit an entry entirely rather than storing a source's own
//            placeholder text (e.g. "待補") as if it were a real name.
const SCHEDULE_DETAILS = {
  'tt-tt-01': { // 馬蘭部落 Farangaw — 2026 Kiluma'an 豐年祭海報
    // ASSUMPTION (unconfirmed): creditUrl reuses this entry's own data
    // source (SOURCES.tt_malan_fb, the 馬蘭部落 Facebook page already cited
    // as where the 7/3–7/11 dates came from) as a guess at where the poster
    // image itself was posted. Flag/replace if that's a different post.
    poster: { url: '/images/schedule/tt-tt-01-kilumaan.jpg', credit: "FARANGAW La fayfay", creditUrl: SOURCES.tt_malan_fb.url, kind: 'lineup' },
    days: [
      { date: "7/3 五–7/5 日", zh: '文化成長營',         name: "Pakalongay" },
      { date: "7/5 日",        zh: '報訊',               name: "Misahafay" },
      { date: "7/6 一",        zh: '階級晉升酒祭',       name: "Panenmem" },
      { date: "7/7 二",        zh: '清點人數‧行前告祭', name: "Pafata'an" },
      { date: "7/7 二–7/9 四", zh: '海祭',               name: "Mikesi" },
      { date: "7/9 四",        zh: '豐收凱旋',           name: "Palaylay" },
      { date: "7/9 四",        zh: '年祭團舞',           name: "Malikoda" },
      { date: "7/10 五",       zh: '分食共享',           name: "Misahemay" },
      { date: "7/11 六",       zh: '歌舞競賽歡慶',       name: "Pipipay" },
    ],
  },
  // 光復鄉公所 115年度期程表 (hl_gf_web) — 頭目/聯絡人 contact columns,
  // matched to EVENTS ids by romanized name + exact date (all 10 confirmed
  // 2026-07-14). hl-gf-03 砂荖部落's 頭目 field was literally "待補"
  // (placeholder, not a real name) in the source — omitted per the
  // 「omit rather than store a placeholder」rule above.
  'hl-gf-01': { contacts: [{ role: '頭目', name: '黃建富', phone: '0928-608-212' }, { role: '聯絡人', name: '孫志文', phone: '0915-973-075' }] },
  'hl-gf-02': { contacts: [{ role: '頭目', name: '劉金武', phone: '0921-171-213' }, { role: '聯絡人', name: '林桂銘', phone: '0927-658-702' }] },
  'hl-gf-03': { contacts: [{ role: '聯絡人', name: '楊金福', phone: '0932-052-304' }] },
  'hl-gf-04': { contacts: [{ role: '頭目', name: '黃福順', phone: '0917-698-073' }, { role: '聯絡人', name: '林淑珍', phone: '0939-772-885' }] },
  'hl-gf-05': { contacts: [{ role: '頭目', name: '陳茂森', phone: '0919-251-221' }, { role: '聯絡人', name: '李玉蘭', phone: '0927-211-120' }] },
  'hl-gf-06': { contacts: [{ role: '頭目', name: '張有征', phone: '0958-704-259' }, { role: '聯絡人', name: '張志雄', phone: '0960-514-994' }] },
  'hl-gf-07': { contacts: [{ role: '頭目', name: '楊德成', phone: '0911-555-190' }] }, // 頭目與聯絡人同一人
  'hl-gf-08': { contacts: [{ role: '頭目', name: '謝連光', phone: '0910-468-928' }] }, // 頭目與聯絡人同一人
  'hl-gf-09': { contacts: [{ role: '頭目', name: '陳榮德', phone: '0970-277-153' }, { role: '聯絡人', name: '陳林阿佑', phone: '0935-902-922' }] },
  'hl-gf-10': { contacts: [{ role: '頭目', name: '張新亞', phone: '0910-559-622' }, { role: '聯絡人', name: '張榕軒', phone: '0900-772-813' }] },
  // Both joint:true tourism festivals below: found a real activity-category
  // list (台東觀光旅遊網／花蓮縣政府官方頁面／東河鄉公所) but no hour-by-hour
  // schedule anywhere (checked 2026-07-14, see docs/DATA-SOURCES.md §12) —
  // one `days` row per activity, all sharing the event's single date, no
  // `name` (no indigenous term for these program segments, unlike
  // tt-tt-01's ritual stages). Still genuinely useful to a visitor even
  // without exact times, so surfaced rather than withheld.
  'tt-dh-01': { // 瑪洛阿瀧聯合豐年節 — 8/22（六）09:30–17:30，東河國小
    days: [
      { date: '8/22 六', zh: '千人牽手大圓舞' },
      { date: '8/22 六', zh: '傳統舞蹈展演、原創舞蹈競賽' },
      { date: '8/22 六', zh: '體技能競賽（傳統射箭、撒魚網、趣味競賽、頂上功夫、鋸木比賽）' },
      { date: '8/22 六', zh: '部落文化體驗（族語、唱跳、傳統服飾、搗米樂）' },
      { date: '8/22 六', zh: '山海原民市集' },
      { date: '8/22 六', zh: '原民豐潮音樂盛宴' },
    ],
  },
  'hl-hl-14': { // 太平洋南島聯合豐年節 — 7/16–7/19，德興大草坪
    days: [
      { date: '7/16 四–7/19 日', zh: '原住民族樂舞展演' },
      { date: '7/16 四–7/19 日', zh: '千人大會舞' },
      { date: '7/16 四–7/19 日', zh: '特色市集（原住民美食、手工藝品、農特產品）' },
      { date: '7/16 四–7/19 日', zh: '部落微旅行簡介' },
    ],
  },
};

// Poster images shared by many EVENTS entries via the same data-source
// `src` (data.js SOURCES key) — used as a fallback when a EVENTS id has no
// poster of its own in SCHEDULE_DETAILS. Avoids duplicating the same file
// path across every buluo on a shared township-wide board.
const SCHEDULE_POSTERS = {
  tt_chenggong_poster: { url: '/images/schedule/tt-chenggong-poster.png', credit: '成功鎮公所 115年度期程表', creditUrl: SOURCES.tt_chenggong_poster.url, kind: 'summary' },
  tt_changbin_poster: { url: '/images/schedule/tt-changbin-poster.png', credit: '長濱鄉 115年度期程表', creditUrl: SOURCES.tt_changbin_poster.url, kind: 'summary' },
  hl_gf_web: { url: '/images/schedule/hl-gf-poster.png', credit: '光復鄉公所 115年度期程表', creditUrl: SOURCES.hl_gf_web.url, kind: 'summary' },
};
