// ── Sources ──────────────────────────────────────────────────────
const SOURCES = {
  hl_pdf: {
    label: '花蓮縣原民處 PDF 2026',
    url: 'https://ab.hl.gov.tw/Utility/DisplayFile?id=8251'
  },
  hl_web: {
    label: '花蓮縣原民處公告',
    url: 'https://ab.hl.gov.tw/zh-tw/Event/NewsOrgDetail/5224/115%E5%B9%B4%E5%BA%A6%E8%8A%B1%E8%93%AE%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E6%97%8F%E5%90%84%E9%83%A8%E8%90%BD%E5%82%B3%E7%B5%B1%E6%AD%B2%E6%99%82%E7%A5%A3%E5%84%80%E6%96%87%E5%8C%96%E6%B4%BB%E5%8B%95%E6%97%A5%E7%A8%8B%E8%A1%A8'
  },
  hl_gf_web: {
    label: '光復鄉公所 115年豐年祭日程表',
    url: 'https://www.guangfu.gov.tw/News_Content.aspx?n=3329&sms=10600&s=209999'
  },
  tt_abm: {
    label: '臺東縣原住民歲時祭儀查詢頁',
    url: 'https://abm.ttweb.tw/?list1=yes'
  },
  tt_chiShang: {
    label: '池上鄉公所公告 PDF',
    url: 'https://www.cs.gov.tw/home/index.php?id=11506&option=com_attachments&task=download'
  },
  tt_donghe: {
    label: '臺東觀光旅遊網',
    url: 'https://tour.taitung.gov.tw/zh-tw/event-calendar/details/6247'
  },
  tt_changbin: {
    label: '長濱鄉公所 Facebook',
    url: 'https://www.facebook.com/changbinchengtownship/photos/%E5%85%AC%E5%91%8A%E8%87%BA%E6%9D%B1%E7%B8%A3%E9%95%B7%E6%BF%B1%E9%84%89115%E5%B9%B4%E5%BA%A6%E5%8E%9F%E4%BD%8F%E6%B0%91%E6%97%8F%E9%83%A8%E8%90%BD%E6%AD%B2%E6%99%82%E7%A5%A3%E5%84%80%E6%9C%9F%E7%A8%8B%E8%A1%A8-%E9%95%B7%E6%BF%B1%E9%84%89115%E5%B9%B4%E5%BA%A6%E5%90%84%E9%83%A8%E8%90%BD%E8%B1%90%E5%B9%B4%E7%A5%AD-%E6%AD%B2%E6%99%82%E7%A5%A3%E5%84%80-%E6%99%82%E7%A8%8B%E8%A1%A81150601-%E6%9B%B4%E6%96%B0%E5%8D%97%E7%AB%B9%E6%B9%96%E9%83%A8%E8%90%BD-%E7%A5%A3%E5%84%80%E6%9C%9F%E9%96%93%E8%AA%BF%E6%95%B4%E7%82%BA716-719/1416900903798785/'
  },
  tt_chenggong: {
    label: '成功鎮豐年節 Instagram',
    url: 'https://www.instagram.com/p/DZRiIJsB3AT/'
  },
  tt_chenggong_fb: {
    label: '成功鎮豐年節 Facebook',
    url: 'https://www.facebook.com/a833633/photos/2026%E5%B9%B4%E4%B8%83%E6%9C%88%E6%88%90%E5%8A%9F%E9%8E%AE%E8%B1%90%E5%B9%B4%E7%AF%80%E6%B4%BB%E5%8B%95%E6%97%A5%E7%A8%8B%E8%A1%A8%E4%B8%80%E5%B9%B4%E4%B8%80%E5%BA%A6%E7%9A%84%E9%98%BF%E7%BE%8E%E6%97%8F%E8%B1%90%E5%B9%B4%E7%AF%80%E5%8F%88%E8%A6%81%E7%86%B1%E9%AC%A7%E7%99%BB%E5%A0%B4%E4%BA%86%E9%82%84%E8%A8%98%E5%BE%97%E5%8E%BB%E5%B9%B4%E4%B8%83%E6%9C%88%E5%85%A8%E6%9D%91%E4%BA%BA%E9%BD%8A%E8%81%9A%E6%9C%83%E5%A0%B4%E8%B7%B3%E8%88%9E%E5%94%B1%E6%AD%8C%E7%9A%84%E7%86%B1%E9%AC%A7%E5%A0%B4%E6%99%AF%E5%97%8E%E9%82%84%E8%A8%98%E5%BE%97%E9%81%B2%E5%88%B0%E8%A2%AB%E5%B9%B9%E9%83%A8%E6%8B%BF%E8%97%A4%E6%A2%9D%E6%8F%90%E9%86%92%E7%9A%84%E8%B6%A3%E4%BA%8B%E5%97%8E%E9%82%A3%E4%BA%9B%E4%B8%80/1661610605971735/'
  },
  tt_malan_fb: {
    label: '馬蘭部落 Facebook',
    url: 'https://www.facebook.com/photo/?fbid=846632771854962&set=a.108499335668313'
  },
  tt_kalaruran_ig: {
    label: '卡拉魯然部落 Instagram',
    url: 'https://www.instagram.com/reel/DLrLZsVSUzy/'
  },
  tt_changbin_zhengbing: {
    label: '真柄部落 Instagram',
    url: 'https://www.instagram.com/p/DYTVnmTzSiG/'
  },
  tt_donghe_fb: {
    label: '東河鄉公所 Facebook',
    url: 'https://www.facebook.com/DongheTownshipOffice/posts/-2026-%E8%87%BA%E6%9D%B1%E7%B8%A3%E6%9D%B1%E6%B2%B3%E9%84%89-%E5%90%84%E9%83%A8%E8%90%BD%E6%AD%B2%E6%99%82%E7%A5%AD%E5%84%80%E6%97%A5%E7%A8%8B%E8%A1%A8-ngaay-ho%E5%A4%8F%E5%A4%A9%E5%88%B0%E4%BA%86%E4%B8%80%E5%B9%B4%E4%B8%80%E5%BA%A6%E6%9C%80%E8%AE%93%E4%BA%BA%E7%86%B1%E8%A1%80%E6%B2%B8%E9%A8%B0%E7%9A%84%E8%B1%90%E5%B9%B4%E7%A5%AD%E5%AD%A3%E7%AF%80%E6%AD%A3%E5%BC%8F%E5%88%B0%E4%BE%86%E8%B1%90%E5%B9%B4%E7%A5%AD%E6%98%AF%E9%98%BF%E7%BE%8E%E6%97%8F%E4%BA%BA%E6%84%9F%E8%AC%9D%E7%A5%96%E9%9D%88%E5%BA%87%E4%BD%91%E6%85%B6%E7%A5%9D%E8%B1%90%E6%94%B6%E4%B8%A6%E4%B8%94%E5%82%B3%E6%89%BF%E9%83%A8/1408402144658270/'
  },
  tt_summary: {
    label: '2026 臺東豐年祭整理頁',
    url: 'https://eatmary.net/5316'
  },
  tt_liji_ig: {
    label: '利吉部落 Instagram',
    url: 'https://www.instagram.com/reels/DY8jH8fEzR-/'
  },
  tt_changguang_threads: {
    label: '長光部落 Threads（社群貼文，可信度較低）',
    url: 'https://www.threads.com/@yuming_qian/post/DXa8a2XCbRr'
  },
  tt_chenggong_poster: {
    label: '成功鎮 115年度各部落歲時祭儀期程表 Instagram',
    url: 'https://www.instagram.com/p/DZKbSxWOsUu/'
  },
  tt_changbin_poster: {
    label: '115年長濱鄉的Ilisin 豐年祭時間',
    url: 'https://www.instagram.com/p/DaNBAVuTyrK/'
  },
  tt_zhishi: {
    label: '織・時臺東',
    url: 'https://taitung-festival.vercel.app/'
  }
};

// ── Data note (shown in UI) ───────────────────────────────────────
const DATA_NOTE = '花蓮縣資料來自縣政府原民處官方 PDF（115 年全縣表，完整）。臺東縣：池上鄉來自鄉公所 PDF；成功鎮、長濱鄉、東河鄉來自鄉公所公告；延平鄉、海端鄉、太麻里鄉、大武鄉、卑南鄉／臺東市部分族群（布農族、排灣族、卑南族）來自臺東縣原住民歲時祭儀查詢頁；臺東市阿美族部分來自社群貼文／IG OCR，可信度低於縣府 PDF——正式出行前務必透過部落或公所管道再確認。整理截至 2026-07-06。';

// ── Village data ──────────────────────────────────────────────────
// status: 'confirmed' | 'tbd' | 'cancelled'
// Coordinates are approximate township-level centers.
const EVENTS = [

  // ══ 花蓮縣 秀林鄉 ════════════════════════════════════════════════
  { id:'hl-xl-01', group:'ami', chinese:'全鄉阿美族群', amis:'', county:'花蓮縣', township:'秀林鄉', lat:24.064455, lng:121.569676, date:'8/29 六', venue:'秀林鄉佳民村多功能聚會所', status:'confirmed', src:'hl_pdf', note:'座標改採佳民村（venue 所在村）之 OSM 行政界中心點（Nominatim），較先前的秀林鄉概略座標更精確一級，惟仍為村里層級近似值，非聚會所本身座標。' },

  // ══ 花蓮縣 新城鄉 ════════════════════════════════════════════════
  { id:'hl-xc-01', group:'bnn', chinese:'布農族群', amis:'Bunun', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'5/30 六', venue:'復興部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-02', buluo_id:'ami-palamitan', group:'ami', chinese:'康樂部落', amis:'Palamitan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'7/25 六', venue:'巴拉米旦聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-03', buluo_id:'ami-katanka', group:'ami', chinese:'佳林部落', amis:'Katangka', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/1 六', venue:'佳林部落社區廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-04', buluo_id:'ami-palinkaan', group:'ami', chinese:'復興部落', amis:'Palinkaan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/1 六', venue:'復興部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-05', buluo_id:'ami-lalumaang', group:'ami', chinese:'東方羅馬部落', amis:'Lalumaan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/15 六', venue:'東方羅馬社區籃球場廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-06', buluo_id:'ami-pacidal', group:'ami', chinese:'華陽部落', amis:'Pacidalan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/15 六', venue:'華陽部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-07', buluo_id:'ami-hupu', group:'ami', chinese:'北埔部落', amis:'Hupu', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/15 六', venue:'北埔聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-08', buluo_id:'ami-kaliyawan', group:'ami', chinese:'嘉里部落', amis:'Kaliyawan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/22 六', venue:'嘉里部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-09', buluo_id:'ami-paudadan', group:'ami', chinese:'大德部落', amis:'Pauradan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/22 六', venue:'大德部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-10', buluo_id:'ami-cilapuk', group:'ami', chinese:'嘉新部落', amis:'Cilapuk', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/22 六', venue:'嘉新部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-11', group:'trv', chinese:'太魯閣族群', amis:'Truku', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/29 六', venue:'新城鄉原住民多功能活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-12', buluo_id:'ami-pabuisan', group:'ami', chinese:'北星部落', amis:'Pavuisan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },
  { id:'hl-xc-13', buluo_id:'ami-pibutingan', group:'ami', chinese:'順安部落', amis:'Pivutingan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },
  { id:'hl-xc-14', buluo_id:'ami-patirengan', group:'ami', chinese:'立業部落', amis:'Patirengan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },
  { id:'hl-xc-15', buluo_id:'ami-sudadatan', group:'ami', chinese:'新城部落', amis:'Suraratan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },

  // ══ 花蓮縣 花蓮市 ════════════════════════════════════════════════
  { id:'hl-hl-01', buluo_id:'ami-kanian', group:'ami', chinese:'嘎尼按部落', amis:'Kanian', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'7/25 六', venue:'林芥公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-02', buluo_id:'ami-singsiya', group:'ami', chinese:'新夏部落', amis:'Singsiya', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'7/26 日', venue:'拉署旦部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-03', buluo_id:'ami-ciku', group:'ami', chinese:'磯固部落', amis:'Ciku', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'花蓮市原住民文化歷史館旁扶輪公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-04', buluo_id:'ami-cipawkan', group:'ami', chinese:'吉寶竿部落', amis:'Cipawkan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'吉寶竿部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-05', buluo_id:'ami-cikep', group:'ami', chinese:'幾可普部落', amis:'Cikep', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'球崙運動公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-06', buluo_id:'sakizaya-takubuwan', group:'szy', chinese:'達固部灣部落', amis:'Takubuwan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'花蓮縣立體育場 A 區停車場', status:'confirmed', src:'hl_pdf', note:'來源 hl_pdf（花蓮縣原民處官方 PDF）將此部落列在阿美族豐年祭時程表中，但達固部灣（Takubuwan）為撒奇萊雅族史上重要據點（1878年達固部灣事件發生地）；本站 group 已修正為 szy（Sakizaya）。' },
  { id:'hl-hl-07', buluo_id:'ami-kenuy', group:'ami', chinese:'根努夷部落', amis:'Kenuy', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/8 六', venue:'根努夷部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-08', buluo_id:'ami-lasutan', group:'ami', chinese:'拉署旦部落', amis:'Lasutan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/8 六', venue:'拉署旦部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-09', buluo_id:'ami-tasutasunan', group:'ami', chinese:'達蘇達蘇湳部落', amis:'Tasutasunan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/8 六', venue:'中山公園禾埕風雨球場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-10', buluo_id:'sakizaya-sakur', group:'szy', chinese:'撒固兒部落', amis:'Sakur', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/15 六', venue:'撒固兒部落聚會所', status:'confirmed', src:'hl_pdf', note:'來源 hl_pdf（花蓮縣原民處官方 PDF）將此部落列在阿美族豐年祭時程表中，但族群人口實際上以撒奇萊雅族為主；本站 group 已修正為 szy（Sakizaya）。' },
  { id:'hl-hl-11', buluo_id:'ami-cibarbaran', group:'ami', chinese:'幾巴爾巴爾蘭部落', amis:'Cibarbaran', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/16 日', venue:'巴爾巴爾蘭祭祀廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-12', buluo_id:'ami-tuwapun', group:'ami', chinese:'大本部落／華東', amis:'Tuwapun', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/22 六', venue:'大本部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-13', group:'trv', chinese:'太魯閣族群', amis:'Truku', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/22 六', venue:'花蓮市原住民文化歷史館旁扶輪公園', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 吉安鄉 ════════════════════════════════════════════════
  { id:'hl-ja-01', buluo_id:'ami-ciripunan', group:'ami', chinese:'慶豐部落', amis:'Ciripunan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/1 六', venue:'慶豐部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-02', buluo_id:'ami-isaetipan-pahikukian', group:'ami', chinese:'仁和部落', amis:'Isaetipan Pahikukian', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/1 六', venue:'南埔公園停車場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-03', buluo_id:'ami-cikeliwan', group:'ami', chinese:'歌柳灣部落', amis:'Cikeliwan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/1 六', venue:'歌柳部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-04', buluo_id:'ami-taracan', group:'ami', chinese:'達拉贊部落', amis:'Taracan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/8 六', venue:'南埔公園停車場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-05', buluo_id:'ami-kungkung', group:'ami', chinese:'大鼓部落', amis:'Kungkung', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/9 日', venue:'希望公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-06', buluo_id:'ami-citekudan', group:'ami', chinese:'小台東部落', amis:'Citekudan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'小台東部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-07', buluo_id:'ami-pukpuk', group:'ami', chinese:'簿簿部落', amis:'Pukpuk', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'簿簿聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-08', buluo_id:'ami-atonan', group:'ami', chinese:'阿都南部落', amis:'Atonan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'光華部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-09', buluo_id:'ami-sarad', group:'ami', chinese:'撒樂部落', amis:'Sarad', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'北昌社區活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-10', buluo_id:'ami-ciyibangcalay', group:'ami', chinese:'吉野汎扎萊部落', amis:'Ciyibangcalay', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'希望公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-11', buluo_id:'ami-mabuwakay', group:'ami', chinese:'南華部落', amis:'Mabuwakay', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'南華部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-12', buluo_id:'ami-sirakesay', group:'ami', chinese:'永安部落', amis:'Sirakesay', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'永安社區活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-13', buluo_id:'ami-cikasuwan', group:'ami', chinese:'七腳川部落', amis:'Cikasuwan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/16 日', venue:'七腳川部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-14', buluo_id:'ami-lidaw', group:'ami', chinese:'里漏部落', amis:'Lidaw', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/22 六', venue:'化仁國小', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-15', buluo_id:'ami-hacining', group:'ami', chinese:'干城部落', amis:'Hacining', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/22 六', venue:'干城村籃球場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-16', buluo_id:'ami-natawran', group:'ami', chinese:'那荳蘭部落', amis:'Natawran', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/23 日', venue:'娜荳蘭部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-17', buluo_id:'ami-buner', group:'ami', chinese:'宜昌部落', amis:'Buner', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/23 日', venue:'娜荳蘭部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-18', buluo_id:'ami-isawalian-pahikukian', group:'ami', chinese:'仁安部落', amis:'Isawalian Pahikukian', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/29 六（暫定）', venue:'仁安部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-19', buluo_id:'ami-fulufuluan', group:'ami', chinese:'勝安部落', amis:'Fulufuluan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/29 六', venue:'娜荳蘭部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-20', group:'trv', chinese:'太魯閣族群', amis:'Truku', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'9/12 六', venue:'鬱金香花園', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 壽豐鄉 ════════════════════════════════════════════════
  { id:'hl-sf-01', buluo_id:'ami-tdlu', group:'ami', chinese:'豐裡部落', amis:"Mulimutu a Telu'", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'7/18 六', venue:'豐裡聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-02', buluo_id:'ami-cealalupalantdlu', group:'ami', chinese:'豐山部落', amis:"Yamaseta a Telu'", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'7/25 六', venue:'豐山聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-03', buluo_id:'ami-cihak', group:'ami', chinese:'志學部落', amis:'Tay-yen / Cihak', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/1 六', venue:'志昌廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-04', buluo_id:'ami-cipuypuyan', group:'ami', chinese:'米棧部落', amis:'Cipuypuyan', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/1 六', venue:'米棧活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-05', buluo_id:'ami-adetuman', group:'ami', chinese:'平和部落', amis:"Ci'adetuman", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/8 六', venue:'平和聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-06', buluo_id:'ami-banaw', group:'ami', chinese:'池南部落', amis:'Banaw', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/8 六', venue:'白天文蘭國小；晚上原舞者廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-07', buluo_id:'ami-telu', group:'ami', chinese:'豐坪部落', amis:'Kay-ha-co', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/8 六', venue:'前頭目邱田發自宅前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-08', buluo_id:'ami-tumay', group:'ami', chinese:'鹽寮部落', amis:'Tumay', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/9 日', venue:'鹽寮聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-09', buluo_id:'ami-ciwidiyan', group:'ami', chinese:'水璉部落', amis:'Ciwidian', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/9 日', venue:'水璉部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-10', buluo_id:'ami-rinahem', group:'ami', chinese:'光榮部落', amis:'Rinahem', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/15 六', venue:'光榮部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-11', buluo_id:'ami-kiku', group:'ami', chinese:'溪口部落', amis:'Kiku', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/22 六', venue:'上午溪口國小；下午溪口聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-12', buluo_ids:['ami-sililasay','ami-siapaluway'], group:'ami', chinese:'月眉部落', amis:'Sililasay / Siapaluway', county:'花蓮縣', township:'壽豐鄉', lat:23.871420, lng:121.562540, date:'8/22 六', venue:'月眉國小', status:'confirmed', src:'hl_pdf', note:'座標改採月眉村（月眉國小所在村）之 OSM 行政界中心點（Nominatim），較先前的壽豐鄉概略座標更精確一級，惟仍為村里層級近似值，非學校本身座標。' },
  { id:'hl-sf-13', buluo_id:'ami-ciamengan', group:'ami', chinese:'壽豐部落', amis:"Ciamengan / Ci'alupalan / Sanasay", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/22 六', venue:'壽豐國小；中午原住民多功能活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-14', buluo_id:'ami-sawanengan', group:'ami', chinese:'共和部落', amis:'Sawanengan', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/29 六', venue:'共和聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-15', buluo_id:'ami-taukak', group:'ami', chinese:'樹湖部落', amis:"Ta'ukak", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },

  // ══ 花蓮縣 鳳林鎮 ════════════════════════════════════════════════
  { id:'hl-fl-01', buluo_id:'ami-sariwsiw', group:'ami', chinese:'沙溜秀部落', amis:'Sariwsiw', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'7/25 六', venue:'大榮里二村活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-02', buluo_id:'ami-cirakayan', group:'ami', chinese:'山興部落', amis:'Cirakayan', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/1 六', venue:'前山興國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-03', buluo_id:'ami-cingaroan', group:'ami', chinese:'鳳信部落', amis:'Cingaroan', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/8 六', venue:'前鳳信國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-04', buluo_id:'ami-ciloohay', group:'ami', chinese:'森榮部落', amis:"Cilo'ohay", county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/15 六', venue:'森榮國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-05', buluo_id:'ami-tangahang', group:'ami', chinese:'長橋部落', amis:'Tangahang', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/15 六', venue:'森榮國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-06', buluo_id:'ami-cihafayan', group:'ami', chinese:'中興部落', amis:'Cihafayan', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/22 六', venue:'中興活動中心', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 萬榮鄉 ════════════════════════════════════════════════
  { id:'hl-wr-01', group:'trv', chinese:'固努安部落', amis:'Qunuan', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'6/27 六', venue:'馬遠部落多功能聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-wr-02', group:'trv', chinese:'支亞干部落', amis:'Ciyakang', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'西林運動廣場', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-03', group:'trv', chinese:'馬里巴西／大加汗部落', amis:'Maribas / Thgahan', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'尚未決定', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-04', group:'trv', chinese:'東光／大馬遠部落', amis:'Tamaian / Tungkang', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'7/11 六', venue:'東光多功能聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-wr-05', group:'trv', chinese:'新白楊部落', amis:'Miharasi', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'見晴社區多功能活動中心', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-06', group:'trv', chinese:'摩里莎卡／魯巴斯部落', amis:'Murisaka / Rubas', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'萬榮村活動中心，萬榮天主堂', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-07', group:'trv', chinese:'紅葉部落', amis:'Y-Hunang', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'尚未決定', status:'tbd', src:'hl_pdf' },

  // ══ 花蓮縣 光復鄉 ════════════════════════════════════════════════
  { id:'hl-gf-01', buluo_id:'ami-atomo', group:'ami', chinese:'阿多莫部落', amis:'Atomo', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'7/31 五–8/2 日', venue:'阿多莫活動中心', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-02', buluo_id:'ami-alolong', group:'ami', chinese:'阿囉隆部落', amis:'Alolong', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/1 六–8/2 日', venue:'阿囉隆部落豐年舞場', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-03', buluo_id:'ami-sado', group:'ami', chinese:'砂荖部落', amis:'Sado', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/7 五–8/9 日', venue:'砂荖部落豐年舞場', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-04', buluo_id:'ami-lasoay', group:'ami', chinese:'拉索埃部落', amis:"Laso'ay", county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/7 五–8/9 日', venue:'拉索埃部落豐年舞場', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-05', buluo_id:'ami-kalotong', group:'ami', chinese:'加里洞部落', amis:'Kalotongan', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/7 五–8/9 日', venue:'加里洞活動中心', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-06', buluo_id:'ami-fata-an', group:'ami', chinese:'馬太鞍部落', amis:"Fata'an", county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/20 四–8/22 六', venue:'馬太鞍文化廣場', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-07', buluo_id:'ami-tafalong', group:'ami', chinese:'太巴塱部落', amis:'Tafalong', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/14 五–8/17 一', venue:'太巴塱文化祭祀廣場', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-08', group:'ami', chinese:'香草場部落', amis:'Kosoy', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/8 六', venue:'香草場部落豐年舞場', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-09', buluo_id:'ami-fahol', group:'ami', chinese:'馬佛部落', amis:'Fahol', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/21 五–8/23 日', venue:'西富國小旁廣場', status:'confirmed', src:'hl_gf_web' },
  { id:'hl-gf-10', buluo_id:'ami-o-kakay', group:'ami', chinese:'大興部落', amis:'Okakay', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/21 五–8/23 日', venue:'大興部落豐年舞場', status:'confirmed', src:'hl_gf_web' },

  // ══ 花蓮縣 豐濱鄉 ════════════════════════════════════════════════
  { id:'hl-fb-01', buluo_id:'ami-tafugan', group:'ami', chinese:'三富橋部落', amis:'Tafugan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/12 日', venue:'三富橋部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-02', buluo_id:'ami-tisilan', group:'ami', chinese:'靜安部落', amis:'Tisilan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/15 三', venue:'靜安部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-03', buluo_id:'ami-cawi', group:'ami', chinese:'查威部落', amis:'Cawi', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/17 五', venue:'太陽廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-04', buluo_id:'ami-laeno', group:'ami', chinese:'大港口部落', amis:"La'e'no", county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/18 六', venue:'大港口廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-05', buluo_id:'ami-makotaay-fengbin', group:'ami', chinese:'港口部落', amis:"Makota'ay", county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/23', venue:'港口天主教堂廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-06', buluo_id:'kavalan-kodic', group:'ckv', chinese:'立德部落', amis:'Kudis', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/3 一', venue:'立德部落廣場', status:'confirmed', src:'hl_pdf', note:'來源 hl_pdf（花蓮縣原民處官方 PDF）將此部落列在阿美族豐年祭時程表中，但實際為噶瑪蘭族聚落；本站 group 已修正為 ckv（Kavalan）。' },
  { id:'hl-fb-07', buluo_id:'ami-malaloong', group:'ami', chinese:'東興部落', amis:'Malaloon', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/7 五', venue:'東興廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-08', buluo_id:'ami-haciliwan', group:'ami', chinese:'八里灣部落', amis:'Haciliwan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/8 六', venue:'八里灣部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-09', buluo_id:'kavalan-paterungan', group:'ckv', chinese:'新社部落', amis:'PateRungan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/8 六', venue:'新社國小運動場', status:'confirmed', src:'hl_pdf', note:'來源 hl_pdf（花蓮縣原民處官方 PDF）將此部落列在阿美族豐年祭時程表中，但實際為全臺最大噶瑪蘭語／文化重鎮；本站 group 已修正為 ckv（Kavalan）。' },
  { id:'hl-fb-10', buluo_id:'ami-fakong', group:'ami', chinese:'貓公部落', amis:'Fakong', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/8 六', venue:'豐濱河濱公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-11', buluo_id:'ami-tingalaw', group:'ami', chinese:'豐富部落', amis:'Tingalaw', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/9 日', venue:'豐富部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-12', buluo_id:'sakizaya-kaluluwan', group:'szy', chinese:'磯崎部落', amis:'Kaluluan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/16 日', venue:'龜庵天主堂對面廣場', status:'confirmed', src:'hl_pdf', note:'來源 hl_pdf（花蓮縣原民處官方 PDF）將此部落列在阿美族豐年祭時程表中，但磯崎部落（Kaluluwan）登記為撒奇萊雅族部落；本站 group 已修正為 szy（Sakizaya）。' },

  // ══ 花蓮縣 瑞穗鄉 ════════════════════════════════════════════════
  { id:'hl-rs-01', buluo_id:'ami-fanaw', group:'ami', chinese:'法淖部落', amis:'Fanaw', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'7/26 日', venue:'法淖部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-02', buluo_id:'ami-olalip', group:'ami', chinese:'屋拉力部落', amis:'Olalip', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/1 六', venue:'鶴岡屋拉力集貨場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-03', buluo_id:'ami-ukang', group:'ami', chinese:'烏槓部落', amis:'UKang', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/8 六', venue:'烏槓聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-04', buluo_id:'ami-narowan', group:'ami', chinese:'娜魯灣部落', amis:'Nalowan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/8 六', venue:'娜魯灣部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-05', buluo_id:'ami-sapat', group:'ami', chinese:'掃叭頂部落', amis:'Sapat', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/9 日', venue:'舞鶴活動中心前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-06', buluo_id:'ami-olaw', group:'ami', chinese:'梧繞部落', amis:'Olaw', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/9 日', venue:'梧繞部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-07', buluo_id:'ami-lacihakan', group:'ami', chinese:'拉基禾幹部落', amis:'Lacihakan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'拉基禾幹部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-08', buluo_id:'ami-koyo', group:'ami', chinese:'溫泉部落', amis:'Onsing', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'溫泉部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-09', buluo_id:'sakizaya-maifor', group:'szy', chinese:'馬立雲部落', amis:'Maifor', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'馬立雲部落聚會所', status:'confirmed', src:'hl_pdf', note:'來源 hl_pdf（花蓮縣原民處官方 PDF）將此部落列在阿美族豐年祭時程表中，但實際為撒奇萊雅族重要文化據點；本站 group 已修正為 szy（Sakizaya）。' },
  { id:'hl-rs-10', buluo_id:'ami-marorok', group:'ami', chinese:'馬聚集部落', amis:'Marekrek', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'馬聚集部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-11', buluo_id:'ami-morocan', group:'ami', chinese:'牧魯棧部落', amis:'Morocan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'牧魯棧聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-12', buluo_id:'ami-atolan', group:'ami', chinese:'阿多瀾部落', amis:'Atolan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'阿多瀾聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-13', buluo_id:'ami-langas', group:'ami', chinese:'拉加善部落', amis:'Langasan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'拉加善部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-14', buluo_id:'ami-cirocan', group:'ami', chinese:'鶺魯棧部落', amis:'Cirocan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'鶺魯棧聚會所預定地', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-15', buluo_id:'ami-kalala', group:'ami', chinese:'迦納納部落', amis:'Kalala', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/16 日', venue:'迦納納部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-16', buluo_id:'ami-kiwit', group:'ami', chinese:'奇美部落', amis:'Kiwit / Raranges', county:'花蓮縣', township:'瑞穗鄉', lat:23.510, lng:121.333, date:'8/17 一', venue:'奇美部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-17', group:'bnn', chinese:'奇美布農部落', amis:'Kiwit (Bunun)', county:'花蓮縣', township:'瑞穗鄉', lat:23.510, lng:121.333, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },

  // ══ 花蓮縣 玉里鎮 ════════════════════════════════════════════════
  { id:'hl-yl-01', buluo_id:'ami-patawlinan', group:'ami', chinese:'巴島力安部落／達谷寮', amis:'Patawrian / Takoliyaw', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'7/25 六', venue:'高寮聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-02', buluo_id:'ami-posko', group:'ami', chinese:'璞石閣部落', amis:'Posko', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/1 六', venue:'自強三街旁廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-03', buluo_id:'ami-cilakesay', group:'ami', chinese:'吉拉格賽部落', amis:'Cilakesay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/8 六', venue:'北平街旁廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-04', group:'bnn', chinese:'布農族群', amis:'Bunun', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/8 六', venue:'中城里 11 鄰 6 號', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-05', buluo_id:'ami-namisan', group:'ami', chinese:'拿彌散部落', amis:'Namisan', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/14 五', venue:'樂合里 20 鄰 98 號前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-06', buluo_id:'ami-satefo', group:'ami', chinese:'下德武部落', amis:'Satefu', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/15 六', venue:'下德武部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-07', buluo_id:'ami-matadim', group:'ami', chinese:'馬太林部落', amis:'Matadim', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/15 六', venue:'春日里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-08', buluo_id:'ami-cinemnemay', group:'ami', chinese:'吉能能麥部落', amis:'Cinemnemay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/15 六', venue:'吉能能麥部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-09', buluo_id:'ami-lingacay', group:'ami', chinese:'苓雅仔部落', amis:'Lingacay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/16 日', venue:'德武里祭祀活動廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-10', buluo_id:'ami-harawan', group:'ami', chinese:'哈拉灣部落', amis:'Halawan', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'樂合里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-11', buluo_id:'ami-ceroh', group:'ami', chinese:'織羅部落', amis:'Ceroh', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'春日里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-12', buluo_id:'ami-afih', group:'ami', chinese:'阿飛赫部落／鐵份', amis:'Afih', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'東豐天主教堂廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-13', buluo_id:'ami-tokar', group:'ami', chinese:'督旮薾部落', amis:'Tokar', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'督旮薾聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-14', buluo_id:'ami-angcoh', group:'ami', chinese:'安通部落', amis:'Angcoh', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'安通 57 號部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-15', buluo_id:'ami-makotaay-yuli', group:'ami', chinese:'瑪谷達璦部落', amis:"Makotaay", county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'松浦里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-16', buluo_id:'ami-lohok', group:'ami', chinese:'洛合谷部落', amis:'Lohok', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/23 日', venue:'松浦里部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-17', buluo_id:'ami-mangcelan', group:'ami', chinese:'滿自然部落', amis:'Mangcelan', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/23 日', venue:'松浦國小旁多功能活動廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-18', buluo_id:'ami-takay', group:'ami', chinese:'達蓋部落', amis:'Takay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/24 四', venue:'三民土地公廟廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-19', buluo_id:'ami-silangkong', group:'ami', chinese:'喜瑯宮部落', amis:'Silangkong', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/26 六', venue:'源城里多功能活動廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-20', buluo_id:'ami-cihakay', group:'ami', chinese:'吉哈蓋部落', amis:'Cihakay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/26 六', venue:'長良里土地公廟旁跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-21', buluo_id:'ami-sedeng', group:'ami', chinese:'瑟冷部落', amis:'Sedeng', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/26 六', venue:'大禹土地公廟廣場', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 富里鄉 ════════════════════════════════════════════════
  { id:'hl-ly-01', buluo_id:'ami-monating', group:'ami', chinese:'姆拉丁部落', amis:'Monating', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'7/25 六', venue:'姆拉丁跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-02', buluo_id:'ami-cirakesay', group:'ami', chinese:'基拉歌賽部落', amis:'Cirakesay', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/1 六', venue:'復興部落多功能活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-03', buluo_id:'ami-cihalaay', group:'ami', chinese:'達蘭埠／黑暗部落', amis:'Talampo / Cihalaay', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/8 六', venue:'達蘭埠部落聚會場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-04', buluo_id:'ami-maliwang', group:'ami', chinese:'馬里旺部落', amis:'Maliwang', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/9 日', venue:'馬里旺部落聚會場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-05', group:'ami', chinese:'公埔部落', amis:'Kungpu', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/15 六', venue:'明里村福德寺前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-06', buluo_id:'ami-lupo', group:'ami', chinese:'露埔部落', amis:'Lupo', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/16 日', venue:'露埔部落跳舞場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-07', buluo_id:'ami-cilamitay', group:'ami', chinese:'吉拉米代部落', amis:'Cilamitay', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/22 六', venue:'吉拉米代部落祭祀廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-08', buluo_id:'ami-pacuya', group:'ami', chinese:'安住／巴族耶部落', amis:'Ancoh / Pacuya', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/29 六', venue:'吳江村前空地', status:'confirmed', src:'hl_pdf' },

  // ══ 臺東縣 池上鄉 ════════════════════════════════════════════════
  { id:'tt-cs-01', buluo_id:'ami-kalokapuk', group:'ami', chinese:'大埔部落', amis:'Kalokapuk', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/7 五–8/9 日', venue:'大埔聚會所，大埔村 55-1 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-02', buluo_id:'ami-cipuwa', group:'ami', chinese:'吉布娃部落', amis:'Cipuwa', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/7 五–8/9 日', venue:'慶豐聚會所，慶豐村 77-8 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-03', buluo_id:'ami-dihekoay', group:'ami', chinese:'陸安部落', amis:'Dihekoay', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/7 五–8/9 日', venue:'陸安聚會所，大埔村陸安 27 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-04', buluo_id:'ami-ciataw', group:'ami', chinese:'甲道部落', amis:'Ciataw', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/14 五–8/16 日', venue:'甲道聚會所，福原村忠孝路 2 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-05', buluo_id:'ami-kawaliwali', group:'ami', chinese:'大坡部落', amis:'Kawaliwali', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/14 五–8/16 日', venue:'大坡聚會所，大坡村 18 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-06', buluo_id:'ami-cicalaay', group:'ami', chinese:'福文部落', amis:"Cicala'ay", county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/14 五–8/16 日', venue:'福文聚會所，福文村大同路 88 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-07', buluo_id:'ami-fangafangasan', group:'ami', chinese:'新興部落', amis:'Fangafangasan', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/21 五–8/23 日', venue:'新興聚會所，新興村一路 1 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-08', buluo_id:'ami-muliyaw', group:'ami', chinese:'白毛寮部落', amis:'Moliyaw', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/21 五–8/23 日', venue:'振興聚會所，振興村 36-1 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-09', buluo_id:'ami-cikowaay', group:'ami', chinese:'吉瓜愛部落', amis:"Cikowa'ay", county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/21 五–8/23 日', venue:'富興聚會所，富興村水墜 62-5 號', status:'confirmed', src:'tt_chiShang' },

  // ══ 臺東縣 長濱鄉 ════════════════════════════════════════════════
  { id:'tt-cb-01', group:'ami', chinese:'南竹湖部落', amis:'Karangasan area', county:'臺東縣', township:'長濱鄉', lat:23.27571, lng:121.42162, date:'7/16–7/20', venue:'南竹湖活動中心', status:'confirmed', src:'tt_changbin_poster', note:'此部落未在部落識別資料庫（Datasets/buluo）中找到對應紀錄，故無 buluo_id，座標無法透過 BULUO_REF 取得；座標改為直接採用 taitung-festival.vercel.app 提供的場地座標（南竹湖活動中心，長濱鄉竹湖村33之2號），2026-07-09。' },

  // ══ 臺東縣 東河鄉 ════════════════════════════════════════════════
  { id:'tt-dh-01', joint:true, group:'ami', chinese:'瑪洛阿瀧聯合豐年祭', amis:'', county:'臺東縣', township:'東河鄉', lat:22.970333, lng:121.290059, date:'8/22 六', venue:'東河國小', status:'confirmed', src:'tt_donghe_fb', note:'座標改採東河村（東河國小所在村）之 OSM 行政界中心點（Nominatim），較先前的東河鄉概略座標更精確一級（東河鄉幅員狹長，鄉治概略座標與東河村相距約28公里），惟仍為村里層級近似值，非學校本身座標。' },

  // ══ 臺東縣 成功鎮 ════════════════════════════════════════════════
  { id:'tt-cg-01', buluo_id:'ami-kalahaay', group:'ami', chinese:'民豐部落', amis:'Karahay', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/9–7/10', welcome_date:'7/10', venue:'忠智里活動中心', status:'confirmed', src:'tt_chenggong' },
  { id:'tt-cg-02', buluo_id:'ami-ciliksay', group:'ami', chinese:'麒麟部落', amis:'Ciliksay', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/9–7/11', welcome_date:'7/10', venue:'麒麟活動中心', status:'confirmed', src:'tt_chenggong_fb' },
  { id:'tt-cg-03', buluo_id:'ami-mararoong', group:'ami', chinese:'美山部落', amis:"Mararo'ong", county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/17–7/20', welcome_date:'7/19', venue:'美山活動中心露天場地', status:'confirmed', src:'tt_chenggong_fb' },

  // ══ 臺東縣 成功鎮 (補充 — 115年度各部落歲時祭儀期程表) ════════════════
  { id:'tt-cg-04', buluo_id:'ami-madawdaw', group:'ami', chinese:'麻荖漏部落', amis:'Madawdaw', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/9–7/10', welcome_date:'7/10', venue:'三民里第二市場', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-05', buluo_id:'ami-piyoxo', group:'ami', chinese:'小馬部落', amis:'Piyoxo', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/10–7/14', welcome_date:'7/11', welcome_time:'08:00', venue:'小馬活動中心', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-06', buluo_id:'ami-torik', group:'ami', chinese:'都歷部落', amis:'Torik', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/10–7/13', welcome_date:'7/11', venue:'都歷活動中心', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-07', buluo_id:'ami-dadowacen', group:'ami', chinese:'玉水橋部落', amis:'Dadowacen', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/10–7/12', welcome_date:'7/11', venue:'玉水橋活動中心', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-08', buluo_id:'ami-tomiyac', group:'ami', chinese:'重安部落', amis:'Tomiyac', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/10–7/13', welcome_date:'7/11', venue:'博愛國小', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-09', buluo_id:'ami-cirarokohay', group:'ami', chinese:'芝田部落', amis:'Cirarokohay', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/15–7/16', welcome_date:'7/16', venue:'芝田路 18 號廣場', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-10', buluo_id:'ami-pisirian', group:'ami', chinese:'比西里岸部落', amis:'Pisirian', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/16–7/19', welcome_date:'7/17', venue:'白守蓮活動中心', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-11', buluo_id:'ami-folalacay', group:'ami', chinese:'小港部落', amis:'Folalacay', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/17–7/20', welcome_date:'7/18', venue:'小港活動中心', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-12', buluo_id:'ami-saaniwan', group:'ami', chinese:'宜灣部落', amis:"Sa'aniwan", county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/15–7/19', welcome_date:'7/18', venue:'宜灣活動中心', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-13', buluo_id:'ami-paongaongan', group:'ami', chinese:'八嗡嗡部落', amis:'Paongaongan', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/30–7/31', welcome_date:'7/31', venue:'豐田活動中心', status:'confirmed', src:'tt_chenggong_poster' },
  { id:'tt-cg-14', buluo_id:'ami-kahciday', group:'ami', chinese:'和平部落', amis:'Kahciday', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/31', welcome_date:'7/31', venue:'和平活動中心', status:'confirmed', src:'tt_chenggong_poster' },

  // ══ 臺東縣 長濱鄉 (補充) ══════════════════════════════════════════
  { id:'tt-cb-02', buluo_id:'ami-makrahay', group:'ami', chinese:'真柄部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/16–7/19', venue:'真柄活動中心', status:'confirmed', src:'tt_changbin_zhengbing', note:'期程表 tt_changbin_poster 對真柄僅標 7/16 單日，與部落自己 IG 公告的 7/16–7/19 不同，此處採部落自己公告的日期範圍，地點採期程表資訊。' },
  { id:'tt-cb-03', buluo_id:'ami-ciwkangan', group:'ami', chinese:'長光部落', amis:'Ciwkangan', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/17–7/19', venue:'長光社區部落聚會所', status:'confirmed', src:'tt_changbin_poster', note:'日期與先前 tt_changguang_threads（可信度較低）一致，改採鄉公所期程表為主要來源並補上地點。' },
  { id:'tt-cb-04', buluo_id:'bnn-nadan', group:'bnn', chinese:'南溪布農部落', amis:'Nadan', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'4/4 六', venue:'南山基督長老教會前廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-cb-05', buluo_id:'ami-cikadaan', group:'ami', chinese:'南溪阿美部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/9–7/11', venue:'南溪國小', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-06', buluo_id:'ami-mornos', group:'ami', chinese:'永福部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/9–7/12', venue:'永福活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-07', buluo_id:'ami-sadipongan', group:'ami', chinese:'三間屋部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/10–7/12', venue:'三間屋活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-08', group:'ami', chinese:'埠橋部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/10–7/12', venue:'埠橋聚會所', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-09', buluo_id:'ami-koladot', group:'ami', chinese:'樟原部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/11–7/13', venue:'樟原活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-10', buluo_id:'ami-cidatayay', group:'ami', chinese:'烏石鼻部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/15–7/18', venue:'烏石鼻活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-11', buluo_id:'ami-ta-man', group:'ami', chinese:'膽曼部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/15–7/19', venue:'膽曼活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-12', buluo_id:'ami-tapowaray-saranawan', group:'ami', chinese:'大俱來部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/15–7/19', venue:'大俱來聚會所/活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-13', buluo_id:'ami-pasongan', group:'ami', chinese:'八桑安部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/15–7/19', venue:'八桑安活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-14', buluo_id:'ami-kinanoka', group:'ami', chinese:'僅那鹿角部落', amis:'', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/17–7/20', venue:'光榮活動中心', status:'confirmed', src:'tt_changbin_poster' },
  { id:'tt-cb-15', buluo_id:'ami-polot', group:'ami', chinese:'大峰峰部落', amis:"Polo't", county:'臺東縣', township:'長濱鄉', lat:23.43332, lng:121.49139, date:'7/10 五–7/12 日', welcome_date:'7/12', welcome_time:'18:00', venue:'大峰峰尖石沙灘', status:'confirmed', src:'tt_zhishi' },

  // ══ 臺東縣 東河鄉 (補充) ══════════════════════════════════════════
  // 源自東河鄉公所 FB 2026 歲時祭儀日程表
  { id:'tt-dh-02', buluo_id:'ami-asiroay-2', group:'ami', chinese:'阿奚露艾部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/4 六–7/6 一', venue:'北源村柑桔林39號', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-03', buluo_id:'ami-paanifong', group:'ami', chinese:'巴阿尼豐部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/9 四–7/11 六', venue:'興隆國小', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-04', buluo_id:'ami-kalifangar', group:'ami', chinese:'佳尼發納部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/10 五–7/12 日', venue:'隆昌部落聚會所', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-05', buluo_id:'ami-fafokod', group:'ami', chinese:'發富谷部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/11 六–7/13 一', venue:'東河國小', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-06', buluo_id:'ami-howak', group:'ami', chinese:'乎哇固部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/15 三–7/16 四', venue:'花固部落集貨場', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-07', buluo_id:'ami-etolan', group:'ami', chinese:'阿度蘭部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/15 三–7/17 五', venue:'都蘭活動中心', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-08', buluo_id:'ami-alapawan', group:'ami', chinese:'阿拉巴灣部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/10 五–7/12 日', venue:'泰源村多功能活動中心', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-09', buluo_id:'ami-sena', group:'ami', chinese:'順那部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/17 五–7/19 日', venue:'北源村德高老19號', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-10', buluo_id:'ami-cilafinan', group:'ami', chinese:'基拉菲婻部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/18 六–7/20 一', venue:'北源活動中心', status:'confirmed', src:'tt_donghe_fb' },
  { id:'tt-dh-11', buluo_id:'ami-maolaway', group:'ami', chinese:'瑪屋撈外部落', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'7/13 一', venue:'尚德國小旁土地公廟', status:'confirmed', src:'tt_donghe_fb' },

  // ══ 臺東縣 卑南鄉 ════════════════════════════════════════════════
  { id:'tt-bn-01', buluo_id:'ami-dikidiki', group:'ami', chinese:'利吉部落', amis:'Dikidiki', county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'7/17 五–7/19 日', venue:'（詳見來源）', status:'confirmed', src:'tt_liji_ig' },
  { id:'tt-bn-02', buluo_id:'ami-fudafudak', group:'ami', chinese:'莿桐部落', amis:'Fudafudak', county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'7/8 三–7/12 日', venue:'未提供', status:'confirmed', src:'tt_abm' },
  { id:'tt-bn-03', buluo_id:'pyu-tamalakaw', group:'pyu', chinese:'大巴六九部落', amis:'Tamalakaw', county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'未定', venue:'大巴六九傳統聚會所文化廣場', status:'tbd', src:'tt_abm' },
  { id:'tt-bn-04', buluo_id:'pyu-likavung', group:'pyu', chinese:'利嘉部落', amis:'Likavung', county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'未定', venue:'臺東縣卑南鄉利嘉社區活動中心', status:'tbd', src:'tt_abm' },
  { id:'tt-bn-05', buluo_id:'pyu-pinaski', group:'pyu', chinese:'下賓朗部落', amis:'Pinaski', county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'未定', venue:'花東縱管處賓朗遊客中心旁大草園', status:'tbd', src:'tt_abm' },
  { id:'tt-bn-06', buluo_id:'pyu-ulivelivek', group:'pyu', chinese:'初鹿部落（成年禮）', amis:'Ulivelivek', county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'未定', venue:'初鹿原住民聚會所', status:'tbd', src:'tt_abm' },
  { id:'tt-bn-07', buluo_id:'pyu-alripay', group:'pyu', chinese:'阿里擺部落', amis:"A'lripay", county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'未定', venue:'阿里擺部落文化廣場', status:'tbd', src:'tt_abm' },
  { id:'tt-bn-08', buluo_id:'pyu-danadanaw', group:'pyu', chinese:'龍過脈部落', amis:'Danadanaw', county:'臺東縣', township:'卑南鄉', lat:22.833, lng:121.153, date:'未定', venue:'龍過脈社區活動中心', status:'tbd', src:'tt_abm' },
  { id:'tt-bn-09', buluo_id:'ami-kalitood', group:'ami', chinese:'山里部落', amis:"Kalito'od", county:'臺東縣', township:'卑南鄉', lat:22.776133, lng:121.062303, date:'7/10 五–7/12 日', welcome_date:'7/11', welcome_time:'15:00', venue:'山里部落多功能聚會所（卑南鄉山里路40-1號）', status:'confirmed', src:'tt_zhishi' },

  // ══ 臺東縣 臺東市 ════════════════════════════════════════════════
  // 來源可信度混合：社群貼文可信度低於縣府 PDF，正式出行前應再確認
  { id:'tt-tt-01', buluo_id:'ami-falangaw', group:'ami', chinese:'馬蘭部落', amis:'Falangaw', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'7/3 五–7/11 六', venue:'馬蘭部落文化廣場及傳統領域', status:'confirmed', src:'tt_malan_fb' },
  { id:'tt-tt-03', buluo_id:'pwn-kalaluran', group:'pwn', chinese:'卡拉魯然部落', amis:'Kalaluran', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'7/18 六–7/19 日', venue:'新園社區青年活動中心（新園路 434 巷 6 號）', status:'confirmed', src:'tt_kalaruran_ig' },
  { id:'tt-tt-04', buluo_id:'ami-siafulungay', group:'ami', chinese:'建農部落／阿福隆愛', amis:'Afolong', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'6/28 日', venue:'建農里社區活動中心', status:'confirmed', src:'tt_summary' },
  { id:'tt-tt-05', buluo_id:'ami-asiroay', group:'ami', chinese:'阿西路愛部落', amis:'', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'7/10 五', venue:'阿西路愛聚會所', status:'confirmed', src:'tt_summary' },
  { id:'tt-tt-06', buluo_id:'pyu-papulu', group:'pyu', chinese:'巴布麓部落', amis:'Papulu', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'未定', venue:'四維寶桑活動中心', status:'tbd', src:'tt_abm' },
  { id:'tt-tt-07', buluo_id:'ami-ining', group:'ami', chinese:'伊濘部落', amis:'Ining', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'未定', venue:'大康樂活動中心', status:'tbd', src:'tt_abm' },
  { id:'tt-tt-08', buluo_id:'ami-matang', group:'ami', chinese:'馬當部落', amis:'Matang', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'未定', venue:'馬當聚會所', status:'tbd', src:'tt_abm' },
  { id:'tt-tt-09', buluo_id:'ami-pusong', group:'ami', chinese:'布頌部落', amis:'Pusong', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'未定', venue:'四維寶桑多功能活動中心', status:'tbd', src:'tt_abm' },
  { id:'tt-tt-10', buluo_id:'pyu-kasavakan', group:'pyu', chinese:'射馬干部落／建和部落', amis:'Kasavakan', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'未定', venue:'建和部落多功能聚會所', status:'tbd', src:'tt_abm' },
  { id:'tt-tt-11', buluo_id:'pyu-puyuma', group:'pyu', chinese:'普悠瑪部落（南王）', amis:'Puyuma', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'未定', venue:'普悠瑪聚會所', status:'tbd', src:'tt_abm' },
  { id:'tt-tt-12', group:'pyu', chinese:'卡大地布部落／卡地布部落', amis:'Katatipul', county:'臺東縣', township:'臺東市', lat:22.754, lng:121.149, date:'未定', venue:'卡大地布聚會所', status:'tbd', src:'tt_abm', note:'除喪祭（非豐年祭），來源 tt_abm 列於臺東市；部落識別資料庫將此部落跨列臺東市／卑南鄉，本站以臺東市為準。' },
  { id:'tt-tt-13', buluo_id:'ami-pongodan', group:'ami', chinese:'大橋部落', amis:'Pongodan', county:'臺東縣', township:'臺東市', lat:22.786357, lng:121.130345, date:'7/5 日–7/10 五', welcome_date:'7/10', welcome_time:'10:00', venue:'大橋部落聚會所（臺東志航路一段412巷17弄38號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-14', buluo_id:'ami-alapanay', group:'ami', chinese:'阿拉巴奈部落', amis:'Alapanay', county:'臺東縣', township:'臺東市', lat:22.736006, lng:121.119305, date:'7/5 日–7/11 六', welcome_date:'7/11', welcome_time:'11:00', venue:'東豐社區（臺東市中華路3段208巷內）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-15', buluo_id:'ami-fukid', group:'ami', chinese:'新馬蘭部落', amis:'Fukid', county:'臺東縣', township:'臺東市', lat:22.771096, lng:121.133651, date:'7/5 日–7/11 六', welcome_date:'7/11', welcome_time:'10:00', venue:'新馬蘭聚會所（臺東市青島街1號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-16', buluo_id:'ami-apapuro', group:'ami', chinese:'高坡部落', amis:'Apapuro', county:'臺東縣', township:'臺東市', lat:22.738447, lng:121.125807, date:'7/7 二–7/9 四', welcome_date:'7/9', welcome_time:'10:00', venue:'臺東市中華路二段806號（旁邊空地）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-17', buluo_id:'ami-kakawasan', group:'ami', chinese:'石山部落', amis:'Kakawasan', county:'臺東縣', township:'臺東市', lat:22.782816, lng:121.161629, date:'7/8 三–7/11 六', welcome_date:'7/11', welcome_time:'19:30', venue:'富豐里活動中心（臺東市吉林路一段279巷58號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-18', buluo_id:'ami-pasawali', group:'ami', chinese:'巴沙哇力部落', amis:'Pasawali', county:'臺東縣', township:'臺東市', lat:22.792248, lng:121.185205, date:'7/9 四–7/12 日', welcome_date:'7/12', welcome_time:'19:00', venue:'巴沙哇力聚會所（臺東市吉林路二段699巷22號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-19', buluo_id:'ami-karoroan', group:'ami', chinese:'加路蘭部落', amis:'Karoroan', county:'臺東縣', township:'臺東市', lat:22.810601, lng:121.188137, date:'7/10 五–7/12 日', welcome_date:'7/12', welcome_time:'13:30', venue:'加路蘭活動中心（臺東市合江路220巷58號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-20', buluo_id:'ami-sihodingan', group:'ami', chinese:'常德部落', amis:'Sihodingan', county:'臺東縣', township:'臺東市', lat:22.749002, lng:121.133169, date:'7/10 五–7/11 六', welcome_date:'7/11', welcome_time:'10:00', venue:'臺東市常德路145巷17號（7-11冠美門市對面）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-tt-21', buluo_id:'ami-pakurung', group:'ami', chinese:'巴古崙岸部落', amis:'Pakurung', county:'臺東縣', township:'臺東市', lat:22.759173, lng:121.054753, date:'7/13 一–7/18 六', welcome_date:'7/18', welcome_time:'09:30', venue:'臺東市射馬干生態園區（射馬干段79-3號）', status:'confirmed', src:'tt_zhishi' },

  // ══ 臺東縣 延平鄉 ════════════════════════════════════════════════
  { id:'tt-yp-01', buluo_id:'bnn-kainisungan', group:'bnn', chinese:'卡努舒岸部落（下里）', amis:'Kainisungan', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'3/7 六', venue:'蝴蝶谷祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-02', buluo_id:'bnn-kamisatu', group:'bnn', chinese:'卡米莎度部落（上里）', amis:'Kamisatu', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'3/7 六', venue:'蝴蝶谷祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-03', buluo_id:'bnn-talunas', group:'bnn', chinese:'達魯那斯部落（鹿鳴）', amis:'Talunas', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'3/7 六', venue:'蝴蝶谷祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-04', buluo_id:'bnn-pasikau', group:'bnn', chinese:'巴喜告部落（桃源）', amis:'Pasikau', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'3/7 六', venue:'蝴蝶谷祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-05', buluo_id:'bnn-vakangan', group:'bnn', chinese:'瓦岡岸部落（紅葉）', amis:'Vakangan', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'3/28 六', venue:'紅葉祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-06', buluo_id:'bnn-minami', group:'bnn', chinese:'米娜咪部落', amis:'Minami', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'4/3 五', venue:'延平鄉鸞山村祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-07', buluo_id:'bnn-kaminu', group:'bnn', chinese:'卡米努部落', amis:'Kaminu', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'4/3 五', venue:'延平鄉鸞山村祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-08', buluo_id:'bnn-su-nun-sung', group:'bnn', chinese:'蘇儂頌部落（永康）', amis:'Su nun sung', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'4/3 五', venue:'永康村茄苳樹文化祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-09', buluo_id:'bnn-nakanu', group:'bnn', chinese:'拿卡努部落', amis:'Nakanu', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'4/3 五', venue:'延平鄉鸞山村祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-10', buluo_id:'bnn-kalisahan', group:'bnn', chinese:'卡里沙汗部落', amis:'Kalisahan', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'4/3 五', venue:'延平鄉鸞山村祭祀廣場', status:'confirmed', src:'tt_abm' },
  { id:'tt-yp-11', buluo_id:'bnn-buklavu', group:'bnn', chinese:'布谷拉夫部落（武陵）', amis:'Buklavu', county:'臺東縣', township:'延平鄉', lat:23.070, lng:121.080, date:'4/18 六', venue:'武陵村祭祀廣場', status:'confirmed', src:'tt_abm' },

  // ══ 臺東縣 海端鄉 ════════════════════════════════════════════════
  { id:'tt-hd-01', buluo_id:'bnn-litu', group:'bnn', chinese:'利稻部落', amis:'Litu', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/4 六', venue:'利稻山莊', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-02', buluo_id:'bnn-tuapuu', group:'bnn', chinese:'大埔部落', amis:'Tuapuu', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/4 六', venue:'未提供', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-03', buluo_id:'bnn-takimi', group:'bnn', chinese:'龍泉部落', amis:'Takimi', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/4 六', venue:'未提供', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-04', buluo_id:'bnn-likau-uan', group:'bnn', chinese:'錦屏部落', amis:'Likau-uan', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/4 六', venue:'未提供', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-05', buluo_id:'bnn-vahu', group:'bnn', chinese:'下馬部落', amis:'Vahu', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/18 六', venue:'霧鹿砲台公園', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-06', buluo_id:'bnn-bulbul', group:'bnn', chinese:'霧鹿部落', amis:'Bulbul', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/18 六', venue:'霧鹿砲台公園', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-07', buluo_id:'bnn-kamcing', group:'bnn', chinese:'崁頂部落', amis:'Kamcing', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/25 六', venue:'崁頂聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-08', buluo_id:'bnn-kusunuki', group:'bnn', chinese:'紅石部落', amis:'Kusunuki', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/25 六', venue:'崁頂聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-09', buluo_id:'bnn-haitutuan', group:'bnn', chinese:'山平部落', amis:'Haitutuan', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/25 六', venue:'山平聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-10', buluo_id:'bnn-kanahcian', group:'bnn', chinese:'加和部落', amis:'Kanahcian', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'6/6 六', venue:'加拿聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-11', buluo_id:'bnn-kanaluk', group:'bnn', chinese:'加樂部落', amis:'Kanaluk', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'6/6 六', venue:'加拿聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-12', buluo_id:'bnn-bacingul', group:'bnn', chinese:'加平部落', amis:'Bacingul', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'6/6 六', venue:'加拿聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-13', buluo_id:'bnn-samuluh', group:'bnn', chinese:'新武部落', amis:'Samuluh', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'4/4 六', venue:'新武聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-hd-14', buluo_id:'bnn-sulai-iaz', group:'bnn', chinese:'初來部落', amis:'Sulai-iaz', county:'臺東縣', township:'海端鄉', lat:23.031, lng:121.056, date:'5/2 六', venue:'待商議', status:'tbd', src:'tt_abm', note:'來源 tt_abm 原將此部落誤植為「海端鎮」（無此行政區，應為海端鄉）、族群誤植為阿美族；本站已依部落識別資料庫（Datasets/buluo/bnn.json，Sulai-iaz）修正為海端鄉布農族。' },

  // ══ 臺東縣 太麻里鄉 ═══════════════════════════════════════════════
  { id:'tt-tm-01', buluo_id:'ami-cilalongay', group:'ami', chinese:'吉拉龍噯部落', amis:'Cilalongay', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/12 日–7/14 二', venue:'吉拉龍愛14鄰聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-02', buluo_id:'ami-sasaljak', group:'ami', chinese:'沙薩拉克部落', amis:'Sasaljak', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/13 一–7/14 二', venue:'香蘭活動中心', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-03', buluo_id:'ami-takidis', group:'ami', chinese:'德其里部落', amis:'Takidis', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/18 六–7/20 一', venue:'德其里部落聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-04', buluo_id:'ami-anasolay', group:'ami', chinese:'荒野部落', amis:'Anasolay', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/20 一', venue:'美和荒野活動中心', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-05', buluo_id:'pwn-padrangigrang', group:'pwn', chinese:'溫泉部落', amis:'Padrangigrang', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/12 日–7/13 一', venue:'溫泉部落聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-06', buluo_id:'pwn-lupakatj', group:'pwn', chinese:'魯巴卡茲部落', amis:'Lupakatj', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/13 一–7/14 二', venue:'北新橋下新興國小旁', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-07', group:'pwn', chinese:'利里武部落', amis:'', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/15 三–7/16 四', venue:'利里武祖靈屋', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-08', group:'pwn', chinese:'加拉班部落', amis:'', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/18 六', venue:'加拉班祖靈屋對面', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-09', buluo_id:'pwn-davugele', group:'pwn', chinese:'大武窟部落', amis:'Davugele', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/24 五–7/27 一', venue:'金崙活動中心', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-10', buluo_id:'pwn-kanadun', group:'pwn', chinese:'金崙部落', amis:'Kanadun', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/24 五–7/27 一', venue:'金崙活動中心', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-11', buluo_id:'pwn-lalauran', group:'pwn', chinese:'拉勞蘭部落', amis:'Lalauran', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/26 日', venue:'香蘭活動中心', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-12', buluo_id:'pwn-kiring', group:'pwn', chinese:'給陵部落', amis:'Kiring', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/26 日', venue:'給陵部落頭目鄭翔勻宅', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-13', buluo_id:'pwn-tjatjigel', group:'pwn', chinese:'喳其格勒部落', amis:'Tjatjigel', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/27 一', venue:'大溪國小', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-14', buluo_id:'pwn-tjavualji', group:'pwn', chinese:'大麻里部落', amis:'Tjavualji', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'7/9 四–7/10 五', venue:'大王部落文化聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-15', buluo_id:'pwn-calavi', group:'pwn', chinese:'查拉密部落', amis:'Calavi', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'8/10 一', venue:'查拉密瀧部落聚會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-tm-16', group:'pwn', chinese:'拉加崙部落', amis:'', county:'臺東縣', township:'太麻里鄉', lat:22.620, lng:121.003, date:'未定', venue:'拉加崙部落頭目高春花宅', status:'tbd', src:'tt_abm' },

  // ══ 臺東縣 大武鄉 ════════════════════════════════════════════════
  { id:'tt-dw-01', buluo_id:'pwn-pangwi', group:'pwn', chinese:'大武部落', amis:'Pangwi', county:'臺東縣', township:'大武鄉', lat:22.362, lng:120.898, date:'8/15 六–8/16 日', venue:'加羅板集會所', status:'confirmed', src:'tt_abm', note:'與加羅板部落（tt-dw-02）同日同場地舉行；部落識別資料庫（Datasets/buluo/pwn.json）將兩者列為不同登記部落，本站依此各自列出。' },
  { id:'tt-dw-02', buluo_id:'pwn-qaljapang', group:'pwn', chinese:'加羅板部落', amis:'Qaljapang', county:'臺東縣', township:'大武鄉', lat:22.362, lng:120.898, date:'8/15 六–8/16 日', venue:'加羅板集會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-dw-03', buluo_id:'pwn-seqeciin', group:'pwn', chinese:'加津林部落', amis:'Seqeciin', county:'臺東縣', township:'大武鄉', lat:22.362, lng:120.898, date:'8/2 日', venue:'加津林集會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-dw-04', buluo_id:'pwn-tjukuvulj', group:'pwn', chinese:'愛國蒲部落', amis:'Tjukuvulj', county:'臺東縣', township:'大武鄉', lat:22.362, lng:120.898, date:'8/2 日', venue:'愛國蒲集會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-dw-05', buluo_id:'pwn-seqalapit', group:'pwn', chinese:'斯卡拉比部落', amis:'Seqalapit', county:'臺東縣', township:'大武鄉', lat:22.362, lng:120.898, date:'8/23 日', venue:'愛國蒲集會所', status:'confirmed', src:'tt_abm' },
  { id:'tt-dw-06', buluo_id:'pwn-ru-ja-qas', group:'pwn', chinese:'魯加卡斯部落', amis:'Ru ja qas', county:'臺東縣', township:'大武鄉', lat:22.362, lng:120.898, date:'8/9 日', venue:'南興集會所', status:'confirmed', src:'tt_abm' },

  // ══ 臺東縣 鹿野鄉 ════════════════════════════════════════════════
  { id:'tt-ly-01', buluo_ids:['ami-kanaopu','ami-efong'], group:'ami', chinese:'卡拿吾部部落／瑞源部落', amis:"Kanao'pu / Efong", county:'臺東縣', township:'鹿野鄉', lat:22.956109, lng:121.15455, date:'7/9 四–7/12 日', welcome_date:'7/11', welcome_time:'20:00', venue:'瑞源瑞隆文化聚會所', status:'confirmed', src:'tt_zhishi', note:'來源列為兩個獨立部落但同日同場地舉行，本站合併為一筆；部落識別資料庫仍將兩者列為不同登記部落，reconciliation 待辦見 docs/ROADMAP-v2.md。' },
  { id:'tt-ly-02', buluo_id:'ami-salinliw', group:'ami', chinese:'山領榴部落', amis:'Salinliw', county:'臺東縣', township:'鹿野鄉', lat:22.937634, lng:121.142257, date:'7/10 五–7/12 日', welcome_date:'7/11', welcome_time:'00:00', venue:'永隆多功能活動中心', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-ly-03', buluo_id:'ami-pailasan', group:'ami', chinese:'八伊拉善部落', amis:'Pailasan', county:'臺東縣', township:'鹿野鄉', lat:22.97, lng:121.15, date:'7/17 五–7/19 日', welcome_date:'7/18', welcome_time:'10:00', venue:'寶華展售中心', status:'confirmed', src:'tt_zhishi', note:'來源座標（22.097, 121.173）明顯偏離鹿野鄉其他部落聚落（皆約北緯22.9–23.0度），研判為原始資料誤植；本筆改用鹿野鄉概略座標，coord_precision 相當於 township 等級，待實地/官方來源核實。' },
  { id:'tt-ly-04', buluo_id:'ami-rekat', group:'ami', chinese:'永昌部落', amis:'Rekat', county:'臺東縣', township:'鹿野鄉', lat:22.931221, lng:121.138782, date:'7/17 五–7/19 日', welcome_date:'7/18', welcome_time:'15:00', venue:'永昌活動中心', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-ly-05', buluo_id:'ami-pakalaac', group:'ami', chinese:'瑞興部落', amis:"Pakala'ac", county:'臺東縣', township:'鹿野鄉', lat:22.979323, lng:121.155733, date:'7/31 五–8/2 日', welcome_date:'8/1', welcome_time:'19:30', venue:'瑞興活動中心', status:'confirmed', src:'tt_zhishi' },

  // ══ 臺東縣 關山鎮 ════════════════════════════════════════════════
  { id:'tt-gs-01', buluo_id:'ami-himoti', group:'ami', chinese:'電光部落', amis:'Himoti', county:'臺東縣', township:'關山鎮', lat:23.007585, lng:121.173603, date:'8/7 五–8/9 日', welcome_date:'8/8', welcome_time:'11:00', venue:'電光社區活動中心（關山鎮電光里中興102號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-gs-02', buluo_id:'ami-cu-ki-ngo', group:'ami', chinese:'月眉部落', amis:'Cu ki ngo', county:'臺東縣', township:'關山鎮', lat:23.009322, lng:121.153141, date:'8/9 日', welcome_date:'8/9', welcome_time:'11:00', venue:'關山鎮月眉里6鄰中和1-1號（螞蟻農藥行前岔路口順著路直走至鐵路橋下空地）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-gs-03', buluo_id:'ami-takofan', group:'ami', chinese:'德高部落', amis:'Takofan', county:'臺東縣', township:'關山鎮', lat:23.074798, lng:121.177566, date:'8/14 五–8/16 日', welcome_date:'8/16', welcome_time:'11:00', venue:'德高社區活動中心（關山鎮德高里2鄰永豐11號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-gs-04', buluo_id:'ami-cipurungan', group:'ami', chinese:'隆興部落', amis:'Cipurungan', county:'臺東縣', township:'關山鎮', lat:23.035166, lng:121.163457, date:'8/15 六–8/17 一', welcome_date:'8/16', welcome_time:'11:00', venue:'隆興部落聚會所（關山鎮里壠里隆興31-1號）', status:'confirmed', src:'tt_zhishi' },
  { id:'tt-gs-05', buluo_id:'ami-parupu', group:'ami', chinese:'新福部落', amis:'Parupu', county:'臺東縣', township:'關山鎮', lat:23.046057, lng:121.172109, date:'8/21 五–8/23 日', welcome_date:'8/22', welcome_time:'17:30', venue:'新福社區活動中心（關山鎮溪埔路34號）', status:'confirmed', src:'tt_zhishi' }

];

// ── General notes (festival background) ──────────────────────────
const GENERAL_NOTES = [
  { icon:'◎', label:'別名 · Names', text:'豐年祭又稱 Ilisin, Malalikit/Malalikid, Kilumaan/Kiloma\'an 或 Malikoda（依部落而異），是阿美族（Amis/Pangcah）最重要的年度祭典。' },
  { icon:'◷', label:'日期 · Dates', text:'各部落日期每年微調，以部落或各鄉鎮市公所最新公告為準。本表資料截至 2026-06-21。' },
  { icon:'▣', label:'階級 · Age-grade', text:'年齡階級（pakelang）是典禮核心。不同階層各司其職，禮儀角色世代傳承。' },
  { icon:'⊗', label:'限制 · Restricted', text:'男子儀式期間有嚴格限制區域，嚴禁非阿美族人擅入。請尊重所有指示與圍繩。' },
  { icon:'○', label:'牽手舞 · Dancing', text:'圓圈舞（牽手舞）開放外來訪客參與，著裝端莊（不露肩、不穿短褲）即可加入。' },
  { icon:'◻', label:'攝影 · Photography', text:'拍照前請先徵得同意。部分儀式嚴禁錄影拍照，請以部落現場指示為準。' }
];
