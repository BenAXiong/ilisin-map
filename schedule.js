// ── Schedule detail ─────────────────────────────────────────────
// Hand-curated per-VILLAGES-entry schedule detail: sub-events, welcome-day
// (迎賓日) info, poster image, optional history prose. Keyed by VILLAGES.id,
// not buluo_id — this data is festival-instance/year-specific, unlike the
// enduring identity facts in BULUO_REF (buluo-ref.js).
//
// Shape per entry (all keys optional):
//   poster:  { src, credit, kind }         — kind: 'lineup' | 'summary'
//   days:    [{ date, zh, name, desc_zh?, desc_en? }, ...]  — day-by-day
//            sub-event breakdown, only when a source actually gives one
//   welcome: { date, time }                — 迎賓日, separate info from
//            `days`, not a row inside it and not merged into any schedule
//            text. Rendered in the overlay's header, not the schedule list.
//   history: string                        — hand-authored cultural/history
//            prose. Deliberately NOT sourced from BULUO_REF.notes, which is
//            internal data-provenance text, not visitor-facing copy.
const SCHEDULE_DETAILS = {
  'tt-tt-01': { // 馬蘭部落 Farangaw — 2026 Kiluma'an 豐年祭海報
    poster: { src: 'images/schedule/tt-tt-01-kilumaan.jpg', credit: "FARANGAW La fayfay", kind: 'lineup' },
    days: [
      { date: "7/3 五–7/5 日", zh: '文化成長營',         name: "Pakalongay" },
      { date: "7/5 日",        zh: '報訊',               name: "Misahafay" },
      { date: "7/6 一",        zh: '階級晉升酒祭',       name: "Panenmem" },
      { date: "7/7 二",        zh: '清點人數‧行前告祭', name: "Pafata'an" },
      { date: "7/7 二–7/9 四", zh: '海祭',               name: "Mikesi" },
      { date: "7/9 四",        zh: '豐收凱旋‧年祭團舞', name: "Palaylay / Malikoda" },
      { date: "7/10 五",       zh: '分食共享',           name: "Misahemay" },
      { date: "7/11 六",       zh: '歌舞競賽歡慶',       name: "Pipipay" },
    ],
  },
  'tt-cg-05': { // 小馬部落 Piyoxo — 成功鎮 115年度各部落歲時祭儀期程表
    welcome: { date: '7/11', time: '08:00' },
  },
};

// Poster images shared by many VILLAGES entries via the same data-source
// `src` (data.js SOURCES key) — used as a fallback when a VILLAGES id has no
// poster of its own in SCHEDULE_DETAILS. Avoids duplicating the same file
// path across every buluo on a shared township-wide board.
const SCHEDULE_POSTERS = {
  tt_chenggong_poster: { src: 'images/schedule/tt-chenggong-poster.png', credit: '成功鎮公所 115年度期程表', kind: 'summary' },
};
