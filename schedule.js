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
//   days:    [{ date, zh, name, desc_zh?, desc_en? }, ...]  — day-by-day
//            sub-event breakdown, only when a source actually gives one.
//            One event per row — if a single day has multiple named
//            sub-events, give each its own `days` entry (same `date` is
//            fine) rather than combining names/zh into one row.
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
};

// Poster images shared by many EVENTS entries via the same data-source
// `src` (data.js SOURCES key) — used as a fallback when a EVENTS id has no
// poster of its own in SCHEDULE_DETAILS. Avoids duplicating the same file
// path across every buluo on a shared township-wide board.
const SCHEDULE_POSTERS = {
  tt_chenggong_poster: { url: '/images/schedule/tt-chenggong-poster.png', credit: '成功鎮公所 115年度期程表', creditUrl: SOURCES.tt_chenggong_poster.url, kind: 'summary' },
};
