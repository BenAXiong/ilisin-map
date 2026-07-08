// ── Schedule detail ─────────────────────────────────────────────
// Hand-curated per-EVENTS-entry schedule detail: sub-events, welcome-day
// (迎賓日) info, poster image, optional history prose. Keyed by EVENTS.id,
// not buluo_id — this data is festival-instance/year-specific, unlike the
// enduring identity facts in BULUO_REF (buluo-ref.js).
//
// Shape per entry (all keys optional):
//   poster:  { url, credit, creditUrl?, kind } — kind: 'lineup' | 'summary'.
//            `credit` is the link text shown ("圖片來源：{credit}"); when
//            `creditUrl` is set it becomes a link to where the poster was
//            published, never displaying the raw URL text itself.
//   days:    [{ date, zh, name, desc_zh?, desc_en? }, ...]  — day-by-day
//            sub-event breakdown, only when a source actually gives one.
//            One event per row — if a single day has multiple named
//            sub-events, give each its own `days` entry (same `date` is
//            fine) rather than combining names/zh into one row.
//   welcome: { date, time }                — 迎賓日, separate info from
//            `days`, not a row inside it and not merged into any schedule
//            text. Rendered in the overlay's header, not the schedule list.
//   history: string                        — hand-authored cultural/history
//            prose. Deliberately NOT sourced from BULUO_REF.notes, which is
//            internal data-provenance text, not visitor-facing copy.
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
  'tt-cg-05': { // 小馬部落 Piyoxo — 成功鎮 115年度各部落歲時祭儀期程表
    welcome: { date: '7/11', time: '08:00' },
  },
  // 2026-07 taitung-festival.vercel.app scrape (src: tt_zhishi) — welcome-day
  // info for the batch of newly-added 臺東縣 buluo (see docs/DATA-SOURCES.md).
  'tt-tt-13': { welcome: { date: '7/10', time: '10:00' } },
  'tt-tt-14': { welcome: { date: '7/11', time: '11:00' } },
  'tt-tt-15': { welcome: { date: '7/11', time: '10:00' } },
  'tt-tt-16': { welcome: { date: '7/9', time: '10:00' } },
  'tt-tt-17': { welcome: { date: '7/11', time: '19:30' } },
  'tt-tt-18': { welcome: { date: '7/12', time: '19:00' } },
  'tt-tt-19': { welcome: { date: '7/12', time: '13:30' } },
  'tt-tt-20': { welcome: { date: '7/11', time: '10:00' } },
  'tt-tt-21': { welcome: { date: '7/18', time: '09:30' } },
  'tt-bn-09': { welcome: { date: '7/11', time: '15:00' } },
  'tt-cb-15': { welcome: { date: '7/12', time: '18:00' } },
  'tt-ly-01': { welcome: { date: '7/11', time: '20:00' } },
  'tt-ly-02': { welcome: { date: '7/11', time: '00:00' } },
  'tt-ly-03': { welcome: { date: '7/18', time: '10:00' } },
  'tt-ly-04': { welcome: { date: '7/18', time: '15:00' } },
  'tt-ly-05': { welcome: { date: '8/1', time: '19:30' } },
  'tt-gs-01': { welcome: { date: '8/8', time: '11:00' } },
  'tt-gs-02': { welcome: { date: '8/9', time: '11:00' } },
  'tt-gs-03': { welcome: { date: '8/16', time: '11:00' } },
  'tt-gs-04': { welcome: { date: '8/16', time: '11:00' } },
  'tt-gs-05': { welcome: { date: '8/22', time: '17:30' } },
};

// Poster images shared by many EVENTS entries via the same data-source
// `src` (data.js SOURCES key) — used as a fallback when a EVENTS id has no
// poster of its own in SCHEDULE_DETAILS. Avoids duplicating the same file
// path across every buluo on a shared township-wide board.
const SCHEDULE_POSTERS = {
  tt_chenggong_poster: { url: '/images/schedule/tt-chenggong-poster.png', credit: '成功鎮公所 115年度期程表', creditUrl: SOURCES.tt_chenggong_poster.url, kind: 'summary' },
};
