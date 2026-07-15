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
//            placeholder text (e.g. "待補") as if it were a real name. Some
//            sources (e.g. hl_rs_web, 瑞穗鄉公所) redact the 頭目 given name
//            themselves, publishing only "{surname}頭目" — stored verbatim,
//            not filled in.
//   address: string — real street address for the venue, only when the
//            source publishes one (added 2026-07-16, first used by
//            hl_rs_web). Purely informational for now — venueLinkHtml()'s
//            Google Maps query still uses `venue` by default; a caller can
//            pass this through explicitly for a more precise search (see
//            js/detail.js's renderDetailBody()).
//   shuttle: { dates, outbound, return } — free-text shuttle-bus info for
//            multi-day umbrella festivals (added 2026-07-16, first used by
//            hl-hl-14). All three optional; omit the whole field rather than
//            guessing when a source doesn't cover shuttle service.
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
  // list (台東觀光旅遊網／花蓮縣政府官方頁面／東河鄉公所) but no per-activity
  // hour-by-hour schedule anywhere (checked 2026-07-14, see
  // docs/DATA-SOURCES.md §12) — one `days` row per activity, all sharing
  // the event's single date, no `name` (no indigenous term for these
  // program segments, unlike tt-tt-01's ritual stages). Still genuinely
  // useful to a visitor even without per-activity times, so surfaced
  // rather than withheld. tt-dh-01 (but not hl-hl-14 — no time window
  // found for that one) does have a confirmed overall start/end time
  // (09:30–17:30); appended to every row's `date` — since they're all
  // identical, groupDaysByDate() still collapses them into one shared
  // header showing it once, not per row.
  'tt-dh-01': { // 瑪洛阿瀧聯合豐年節 — 8/22（六）09:30–17:30，東河國小
    days: [
      { date: '8/22 六 09:30-17:30', zh: '千人牽手大圓舞' },
      { date: '8/22 六 09:30-17:30', zh: '傳統舞蹈展演、原創舞蹈競賽' },
      { date: '8/22 六 09:30-17:30', zh: '體技能競賽（傳統射箭、撒魚網、趣味競賽、頂上功夫、鋸木比賽）' },
      { date: '8/22 六 09:30-17:30', zh: '部落文化體驗（族語、唱跳、傳統服飾、搗米樂）' },
      { date: '8/22 六 09:30-17:30', zh: '山海原民市集' },
      { date: '8/22 六 09:30-17:30', zh: '原民豐潮音樂盛宴' },
    ],
  },
  // cpok.tw 網路媒體報導（非官方一手來源，但提供先前 4 個一手來源都沒有的
  // 逐日流程，2026-07-16 查核）：https://cpok.tw/70856 — 7/16 為單獨主題夜
  // 「夢想之夜」，7/17–7/19 三天共用同一晚會流程（含大會舞確切時段），另有
  // 接駁車時刻，補進 shuttle 欄位（見上方欄位說明）。
  'hl-hl-14': { // 太平洋南島聯合豐年節 — 7/16–7/19，德興大草坪
    days: [
      { date: '7/16 四 12:30', zh: '圓夢館入場、暖場、南島展演、踩街報訊息、小男孩樂團＆巴大雄演出、與花蓮共舞', name: '夢想之夜' },
      { date: '7/17 五–7/19 日 18:00', zh: '各部落樂舞演出、晚會活動' },
      { date: '7/17 五–7/19 日 20:25-21:00', zh: '千人大會舞' },
      { date: '7/16 四–7/19 日', zh: '特色市集（原住民美食、手工藝品、農特產品）' },
      { date: '7/16 四–7/19 日', zh: '部落微旅行簡介' },
    ],
    shuttle: {
      dates: '7/17 五–7/19 日',
      outbound: '17:20 起發車（各接駁點開往德興大草坪）',
      return: '活動結束後至 22:10 止（德興大草坪開往各接駁點）',
    },
  },

  // 瑞穗鄉公所 115年度日程表 (hl_rs_web) — 頭目/聯絡人 contact columns、逐部落
  // 地址、辦理期間全數與 address/contacts/days 對應，2026-07-16 查核，比對
  // 依據為部落羅馬拼音＋現有 date（宴客日）完全吻合。頭目欄位來源本身即以
  // 「{姓}頭目」呈現（未附全名），聯絡人欄位則為「{姓}○{名末字}」的部分遮蔽
  // 全名——均照實轉錄，非本站另行遮蔽。共用同一張日程表海報圖（poster）。
  'hl-rs-01': { // 法淖部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉瑞良村仁愛一街45號',
    contacts: [{ role: '頭目', name: '楊頭目', phone: '0928-875091' }, { role: '聯絡人', name: '莊○富', phone: '0919-245605' }],
    days: [{ date: '7/24–7/27', zh: '活動期間' }, { date: '7/26 日 18:00', zh: '宴客' }],
  },
  'hl-rs-02': { // 屋拉力部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉鶴岡村興鶴路一段111號',
    contacts: [{ role: '頭目', name: '陳頭目', phone: '0912-093106' }, { role: '聯絡人', name: '林○金', phone: '0955-471270' }],
    days: [{ date: '7/30–8/3', zh: '活動期間' }, { date: '8/1 六 18:00', zh: '宴客' }],
  },
  'hl-rs-03': { // 烏槓部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉瑞穗村萬生路',
    contacts: [{ role: '頭目', name: '胡頭目', phone: '0937-216716' }, { role: '聯絡人', name: '羅○門', phone: '0985-672930' }],
    days: [{ date: '8/7–8/10', zh: '活動期間' }, { date: '8/8 六 11:00', zh: '宴客' }],
  },
  'hl-rs-04': { // 娜魯灣部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉瑞美村自強街59號旁',
    contacts: [{ role: '頭目', name: '林頭目', phone: '0926-395845' }, { role: '聯絡人', name: '劉○美', phone: '0937-675521' }],
    days: [{ date: '8/7–8/9', zh: '活動期間' }, { date: '8/8 六 12:00', zh: '宴客' }],
  },
  'hl-rs-05': { // 掃叭頂部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉舞鶴14鄰278號',
    contacts: [{ role: '頭目', name: '林頭目', phone: '0988-117201' }, { role: '聯絡人', name: '曾○蘭', phone: '0912-916435' }],
    days: [{ date: '8/7–8/10', zh: '活動期間' }, { date: '8/9 日 12:00', zh: '宴客' }],
  },
  'hl-rs-06': { // 梧繞部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉舞鶴村211號對面',
    contacts: [{ role: '頭目', name: '黃頭目', phone: '0952-547556' }, { role: '聯絡人', name: '黃○明', phone: '0982-764510' }],
    days: [{ date: '8/7–8/10', zh: '活動期間' }, { date: '8/9 日 17:00', zh: '宴客' }],
  },
  'hl-rs-07': { // 拉基禾幹部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉新興村150號',
    contacts: [{ role: '頭目', name: '朱頭目', phone: '0965-424521' }, { role: '聯絡人', name: '賴○明', phone: '0932-072703' }],
    days: [{ date: '8/14–8/16', zh: '活動期間' }, { date: '8/15 六 11:30', zh: '宴客' }],
  },
  'hl-rs-08': { // 溫泉部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉瑞祥村溫泉三192巷6號',
    contacts: [{ role: '頭目', name: '陳頭目', phone: '0965-592551' }, { role: '聯絡人', name: '古○雄', phone: '0927-327101' }],
    days: [{ date: '8/14–8/16', zh: '活動期間' }, { date: '8/15 六 11:30', zh: '宴客' }],
  },
  'hl-rs-09': { // 馬立雲部落 (Sakizaya)
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉舞鶴5鄰139-6號',
    contacts: [{ role: '頭目', name: '林頭目', phone: '0911-862342' }, { role: '聯絡人', name: '陳○輝', phone: '0981-126172' }],
    days: [{ date: '8/14–8/16', zh: '活動期間' }, { date: '8/15 六 17:00', zh: '宴客' }],
  },
  'hl-rs-10': { // 馬聚集部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉瑞北村虎頭山路123號（省道旁）',
    contacts: [{ role: '頭目', name: '林頭目', phone: '0916-156232' }, { role: '聯絡人', name: '游○富', phone: '0928-096929' }],
    days: [{ date: '8/14–8/16', zh: '活動期間' }, { date: '8/15 六 12:00', zh: '宴客' }],
  },
  'hl-rs-11': { // 牧魯棧部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉富民村正路一段208-1號',
    contacts: [{ role: '頭目', name: '劉頭目', phone: '0921-032508' }, { role: '聯絡人', name: '李○榮', phone: '0931-231554' }],
    days: [{ date: '8/14–8/17', zh: '活動期間' }, { date: '8/15 六 17:00', zh: '宴客' }],
  },
  'hl-rs-12': { // 阿多瀾部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉富民村民生街93號',
    contacts: [{ role: '頭目', name: '張頭目', phone: '0968-950390' }, { role: '聯絡人', name: '劉○明', phone: '0922-725431' }],
    days: [{ date: '8/13–8/16', zh: '活動期間' }, { date: '8/15 六 18:00', zh: '宴客' }],
  },
  'hl-rs-13': { // 拉加善部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉富民村正路一段21-2號（省道旁）',
    contacts: [{ role: '頭目', name: '卓頭目', phone: '0921-788154' }, { role: '聯絡人', name: '李○生', phone: '0917-565819' }],
    days: [{ date: '8/13–8/16', zh: '活動期間' }, { date: '8/15 六 19:00', zh: '宴客' }],
  },
  'hl-rs-14': { // 鶺櫓棧部落 — 見 data.js 該筆 note，臨時地址已更新
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉舞鶴東富路82號（臨時地／頭目住宅）',
    contacts: [{ role: '頭目', name: '余頭目', phone: '0955-309023' }, { role: '聯絡人', name: '林○蘭', phone: '0908-863669' }],
    days: [{ date: '8/14–8/17', zh: '活動期間' }, { date: '8/15 六 12:00', zh: '宴客' }],
  },
  'hl-rs-15': { // 迦納納部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉舞鶴迦納納四路180號',
    contacts: [{ role: '頭目', name: '陳頭目', phone: '0928-569529' }, { role: '聯絡人', name: '陳○雄', phone: '0928-828354' }],
    days: [{ date: '8/14–8/17', zh: '活動期間' }, { date: '8/16 日 12:00', zh: '宴客' }],
  },
  'hl-rs-16': { // 奇美部落
    poster: { url: '/images/schedule/hl-rs-poster.jpg', credit: '瑞穗鄉公所 115年度日程表', creditUrl: SOURCES.hl_rs_web.url, kind: 'summary' },
    address: '花蓮縣瑞穗鄉奇美村3鄰16號',
    contacts: [{ role: '頭目', name: '謝頭目', phone: '0910-174076' }, { role: '聯絡人', name: '蔣○謀', phone: '0931-093716' }],
    days: [{ date: '8/14–8/17', zh: '活動期間' }, { date: '8/17 一 18:00', zh: '宴客' }],
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
