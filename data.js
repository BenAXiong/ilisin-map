// ── Sources ──────────────────────────────────────────────────────
const SOURCES = {
  hl_pdf: {
    label: '花蓮縣原民處 PDF 2026',
    url: 'https://ab.hl.gov.tw/Utility/DisplayFile?id=8138'
  },
  hl_web: {
    label: '花蓮縣原民處公告',
    url: 'https://ab.hl.gov.tw/zh-tw/Event/NewsOrgDetail/5224/115%E5%B9%B4%E5%BA%A6%E8%8A%B1%E8%93%AE%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E6%97%8F%E5%90%84%E9%83%A8%E8%90%BD%E5%82%B3%E7%B5%B1%E6%AD%B2%E6%99%82%E7%A5%A3%E5%84%80%E6%96%87%E5%8C%96%E6%B4%BB%E5%8B%95%E6%97%A5%E7%A8%8B%E8%A1%A8'
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
    label: '成功鎮 Instagram',
    url: 'https://www.instagram.com/p/DZRiIJsB3AT/'
  }
};

// ── Data note (shown in UI) ───────────────────────────────────────
const DATA_NOTE = '花蓮縣資料來自縣政府原民處官方 PDF（115 年全縣表）。臺東縣官方查詢頁本次無法完整擷取，僅收錄已能核驗的鄉鎮公所公告。實際日期以各部落最新公告為準。';

// ── Village data ──────────────────────────────────────────────────
// status: 'confirmed' | 'tbd' | 'cancelled'
// Coordinates are approximate township-level centers.
const VILLAGES = [

  // ══ 花蓮縣 秀林鄉 ════════════════════════════════════════════════
  { id:'hl-xl-01', chinese:'全鄉阿美族群', amis:'', county:'花蓮縣', township:'秀林鄉', lat:24.035, lng:121.564, date:'8/29 六', venue:'秀林鄉佳民村多功能聚會所', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 新城鄉 ════════════════════════════════════════════════
  { id:'hl-xc-01', chinese:'布農族群', amis:'Bunun', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'5/30 六', venue:'復興部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-02', chinese:'康樂部落', amis:'Palamitan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'7/25 六', venue:'巴拉米旦聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-03', chinese:'佳林部落', amis:'Katangka', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/1 六', venue:'佳林部落社區廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-04', chinese:'復興部落', amis:'Palinkaan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/1 六', venue:'復興部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-05', chinese:'東方羅馬部落', amis:'Lalumaan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/15 六', venue:'東方羅馬社區籃球場廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-06', chinese:'華陽部落', amis:'Pacidalan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/15 六', venue:'華陽部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-07', chinese:'北埔部落', amis:'Hupu', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/15 六', venue:'北埔聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-08', chinese:'嘉里部落', amis:'Kaliyawan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/22 六', venue:'嘉里部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-09', chinese:'大德部落', amis:'Pauradan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/22 六', venue:'大德部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-10', chinese:'嘉新部落', amis:'Cilapuk', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/22 六', venue:'嘉新部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-11', chinese:'太魯閣族群', amis:'Truku', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'8/29 六', venue:'新城鄉原住民多功能活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-xc-12', chinese:'北星部落', amis:'Pavuisan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },
  { id:'hl-xc-13', chinese:'順安部落', amis:'Pivutingan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },
  { id:'hl-xc-14', chinese:'立業部落', amis:'Patirengan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },
  { id:'hl-xc-15', chinese:'新城部落', amis:'Suraratan', county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },

  // ══ 花蓮縣 花蓮市 ════════════════════════════════════════════════
  { id:'hl-hl-01', chinese:'嘎尼按部落', amis:'Kanian', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'7/25 六', venue:'林芥公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-02', chinese:'新夏部落', amis:'Singsiya', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'7/26 日', venue:'拉署旦部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-03', chinese:'磯固部落', amis:'Ciku', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'花蓮市原住民文化歷史館旁扶輪公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-04', chinese:'吉寶竿部落', amis:'Cipawkan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'吉寶竿部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-05', chinese:'幾可普部落', amis:'Cikep', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'球崙運動公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-06', chinese:'達固部灣部落', amis:'Takubuwan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/1 六', venue:'花蓮縣立體育場 A 區停車場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-07', chinese:'根努夷部落', amis:'Kenuy', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/8 六', venue:'根努夷部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-08', chinese:'拉署旦部落', amis:'Lasutan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/8 六', venue:'拉署旦部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-09', chinese:'達蘇達蘇湳部落', amis:'Tasutasunan', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/8 六', venue:'中山公園禾埕風雨球場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-10', chinese:'撒固兒部落', amis:'Sakur', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/15 六', venue:'撒固兒部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-11', chinese:'幾巴爾巴爾蘭部落', amis:'Cibarbaran', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/16 日', venue:'巴爾巴爾蘭祭祀廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-12', chinese:'大本部落／華東', amis:'Tuwapun', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/22 六', venue:'大本部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-hl-13', chinese:'太魯閣族群', amis:'Truku', county:'花蓮縣', township:'花蓮市', lat:23.975, lng:121.604, date:'8/22 六', venue:'花蓮市原住民文化歷史館旁扶輪公園', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 吉安鄉 ════════════════════════════════════════════════
  { id:'hl-ja-01', chinese:'慶豐部落', amis:'Ciripunan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/1 六', venue:'慶豐部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-02', chinese:'仁和部落', amis:'Isaetipan Pahikukian', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/1 六', venue:'南埔公園停車場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-03', chinese:'歌柳灣部落', amis:'Cikeliwan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/1 六', venue:'歌柳部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-04', chinese:'達拉贊部落', amis:'Taracan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/8 六', venue:'南埔公園停車場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-05', chinese:'大鼓部落', amis:'Kungkung', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/9 日', venue:'希望公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-06', chinese:'小台東部落', amis:'Citekudan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'小台東部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-07', chinese:'簿簿部落', amis:'Pukpuk', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'簿簿聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-08', chinese:'阿都南部落', amis:'Atonan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'光華部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-09', chinese:'撒樂部落', amis:'Sarad', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'北昌社區活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-10', chinese:'吉野汎扎萊部落', amis:'Ciyibangcalay', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'希望公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-11', chinese:'南華部落', amis:'Mabuwakay', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'南華部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-12', chinese:'永安部落', amis:'Sirakesay', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/15 六', venue:'永安社區活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-13', chinese:'七腳川部落', amis:'Cikasuwan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/16 日', venue:'七腳川部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-14', chinese:'里漏部落', amis:'Lidaw', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/22 六', venue:'化仁國小', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-15', chinese:'干城部落', amis:'Hacining', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/22 六', venue:'干城村籃球場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-16', chinese:'那荳蘭部落', amis:'Natawran', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/23 日', venue:'娜荳蘭部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-17', chinese:'宜昌部落', amis:'Buner', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/23 日', venue:'娜荳蘭部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-18', chinese:'仁安部落', amis:'Isawalian Pahikukian', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/29 六（暫定）', venue:'仁安部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-19', chinese:'勝安部落', amis:'Fulufuluan', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'8/29 六', venue:'娜荳蘭部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ja-20', chinese:'太魯閣族群', amis:'Truku', county:'花蓮縣', township:'吉安鄉', lat:23.956, lng:121.570, date:'9/12 六', venue:'鬱金香花園', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 壽豐鄉 ════════════════════════════════════════════════
  { id:'hl-sf-01', chinese:'豐裡部落', amis:"Mulimutu a Telu'", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'7/18 六', venue:'豐裡聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-02', chinese:'豐山部落', amis:"Yamaseta a Telu'", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'7/25 六', venue:'豐山聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-03', chinese:'志學部落', amis:'Tay-yen / Cihak', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/1 六', venue:'志昌廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-04', chinese:'米棧部落', amis:'Cipuypuyan', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/1 六', venue:'米棧活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-05', chinese:'平和部落', amis:"Ci'adetuman", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/8 六', venue:'平和聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-06', chinese:'池南部落', amis:'Banaw', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/8 六', venue:'白天文蘭國小；晚上原舞者廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-07', chinese:'豐坪部落', amis:'Kay-ha-co', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/8 六', venue:'前頭目邱田發自宅前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-08', chinese:'鹽寮部落', amis:'Tumay', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/9 日', venue:'鹽寮聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-09', chinese:'水璉部落', amis:'Ciwidian', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/9 日', venue:'水璉部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-10', chinese:'光榮部落', amis:'Rinahem', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/15 六', venue:'光榮部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-11', chinese:'溪口部落', amis:'Kiku', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/22 六', venue:'上午溪口國小；下午溪口聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-12', chinese:'月眉部落', amis:'Sililasay / Siapaluay', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/22 六', venue:'月眉國小', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-13', chinese:'壽豐部落', amis:"Ciamengan / Ci'alupalan / Sanasay", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/22 六', venue:'壽豐國小；中午原住民多功能活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-14', chinese:'共和部落', amis:'Sawanengan', county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'8/29 六', venue:'共和聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-sf-15', chinese:'樹湖部落', amis:"Ta'ukak", county:'花蓮縣', township:'壽豐鄉', lat:23.857, lng:121.557, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },

  // ══ 花蓮縣 鳳林鎮 ════════════════════════════════════════════════
  { id:'hl-fl-01', chinese:'沙溜秀部落', amis:'Sariwsiw', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'7/25 六', venue:'大榮里二村活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-02', chinese:'山興部落', amis:'Cirakayan', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/1 六', venue:'前山興國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-03', chinese:'鳳信部落', amis:'Cingaroan', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/8 六', venue:'前鳳信國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-04', chinese:'森榮部落', amis:"Cilo'ohay", county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/15 六', venue:'森榮國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-05', chinese:'長橋部落', amis:'Tangahang', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/15 六', venue:'森榮國小操場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fl-06', chinese:'中興部落', amis:'Cihafayan', county:'花蓮縣', township:'鳳林鎮', lat:23.733, lng:121.467, date:'8/22 六', venue:'中興活動中心', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 萬榮鄉 ════════════════════════════════════════════════
  { id:'hl-wr-01', chinese:'固努安部落', amis:'Qunuan', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'6/27 六', venue:'馬遠部落多功能聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-wr-02', chinese:'支亞干部落', amis:'Ciyakang', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'西林運動廣場', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-03', chinese:'馬里巴西／大加汗部落', amis:'Maribas / Thgahan', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'尚未決定', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-04', chinese:'東光／大馬遠部落', amis:'Tamaian / Tungkang', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'東光多功能聚會所', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-05', chinese:'新白楊部落', amis:'Miharasi', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'見晴社區多功能活動中心', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-06', chinese:'摩里莎卡／魯巴斯部落', amis:'Murisaka / Rubas', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'萬榮村活動中心，萬榮天主堂', status:'tbd', src:'hl_pdf' },
  { id:'hl-wr-07', chinese:'紅葉部落', amis:'Y-Hunang', county:'花蓮縣', township:'萬榮鄉', lat:23.718, lng:121.398, date:'未定', venue:'尚未決定', status:'tbd', src:'hl_pdf' },

  // ══ 花蓮縣 光復鄉 ════════════════════════════════════════════════
  { id:'hl-gf-01', chinese:'阿多莫部落', amis:'Atomo', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'8/1 六', venue:'阿多莫活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-gf-02', chinese:'阿囉隆部落', amis:'Alolong', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'阿囉隆部落豐年舞場', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-03', chinese:'砂荖部落', amis:'Sado', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'砂荖部落豐年舞場', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-04', chinese:'拉索埃部落', amis:"Laso'ay", county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'拉索埃部落豐年舞場', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-05', chinese:'加里洞部落', amis:'Kalotongan', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'加里洞活動中心', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-06', chinese:'馬太鞍部落', amis:"Fata'an", county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'馬太鞍文化廣場', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-07', chinese:'太巴塱部落', amis:'Tafalong', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'太巴塱文化祭祀廣場', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-08', chinese:'香草場部落', amis:'Kosoy', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'香草場部落豐年舞場', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-09', chinese:'馬佛部落', amis:'Fahol', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'西富國小旁廣場', status:'tbd', src:'hl_pdf' },
  { id:'hl-gf-10', chinese:'大興部落', amis:'Okakay', county:'花蓮縣', township:'光復鄉', lat:23.670, lng:121.444, date:'未定', venue:'大興部落豐年舞場', status:'tbd', src:'hl_pdf' },

  // ══ 花蓮縣 豐濱鄉 ════════════════════════════════════════════════
  { id:'hl-fb-01', chinese:'三富橋部落', amis:'Tafugan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/12 日', venue:'三富橋部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-02', chinese:'靜安部落', amis:'Tisilan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/15 三', venue:'靜安部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-03', chinese:'查威部落', amis:'Cawi', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/17 五', venue:'太陽廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-04', chinese:'大港口部落', amis:"La'e'no", county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/18 六', venue:'大港口廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-05', chinese:'港口部落', amis:"Makota'ay", county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'7/23', venue:'港口天主教堂廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-06', chinese:'立德部落', amis:'Kudis', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/3 一', venue:'立德部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-07', chinese:'東興部落', amis:'Malaloon', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/7 五', venue:'東興廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-08', chinese:'八里灣部落', amis:'Haciliwan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/8 六', venue:'八里灣部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-09', chinese:'新社部落', amis:'PateRungan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/8 六', venue:'新社國小運動場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-10', chinese:'貓公部落', amis:'Fakong', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/8 六', venue:'豐濱河濱公園', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-11', chinese:'豐富部落', amis:'Tingalaw', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/9 日', venue:'豐富部落廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-fb-12', chinese:'磯崎部落', amis:'Kaluluan', county:'花蓮縣', township:'豐濱鄉', lat:23.634, lng:121.490, date:'8/16 日', venue:'龜庵天主堂對面廣場', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 瑞穗鄉 ════════════════════════════════════════════════
  { id:'hl-rs-01', chinese:'法淖部落', amis:'Fanaw', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'7/26 日', venue:'法淖部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-02', chinese:'屋拉力部落', amis:'Olalip', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/1 六', venue:'鶴岡屋拉力集貨場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-03', chinese:'烏槓部落', amis:'UKang', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/8 六', venue:'烏槓聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-04', chinese:'娜魯灣部落', amis:'Nalowan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/8 六', venue:'娜魯灣部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-05', chinese:'掃叭頂部落', amis:'Sapat', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/9 日', venue:'舞鶴活動中心前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-06', chinese:'梧繞部落', amis:'Olaw', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/9 日', venue:'梧繞部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-07', chinese:'拉基禾幹部落', amis:'Lacihakan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'拉基禾幹部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-08', chinese:'溫泉部落', amis:'Onsing', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'溫泉部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-09', chinese:'馬立雲部落', amis:'Maifor', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'馬立雲部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-10', chinese:'馬聚集部落', amis:'Marekrek', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'馬聚集部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-11', chinese:'牧魯棧部落', amis:'Morocan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'牧魯棧聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-12', chinese:'阿多瀾部落', amis:'Atolan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'阿多瀾聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-13', chinese:'拉加善部落', amis:'Langasan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'拉加善部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-14', chinese:'鶺魯棧部落', amis:'Cirocan', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/15 六', venue:'鶺魯棧聚會所預定地', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-15', chinese:'迦納納部落', amis:'Kalala', county:'花蓮縣', township:'瑞穗鄉', lat:23.493, lng:121.427, date:'8/16 日', venue:'迦納納部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-16', chinese:'奇美部落', amis:'Kiwit / Raranges', county:'花蓮縣', township:'瑞穗鄉', lat:23.510, lng:121.333, date:'8/17 一', venue:'奇美部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-rs-17', chinese:'奇美布農部落', amis:'Kiwit (Bunun)', county:'花蓮縣', township:'瑞穗鄉', lat:23.510, lng:121.333, date:'停辦', venue:'—', status:'cancelled', src:'hl_pdf' },

  // ══ 花蓮縣 玉里鎮 ════════════════════════════════════════════════
  { id:'hl-yl-01', chinese:'巴島力安部落／達谷寮', amis:'Patawrian / Takoliyaw', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'7/25 六', venue:'高寮聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-02', chinese:'璞石閣部落', amis:'Posko', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/1 六', venue:'自強三街旁廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-03', chinese:'吉拉格賽部落', amis:'Cilakesay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/8 六', venue:'北平街旁廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-04', chinese:'布農族群', amis:'Bunun', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/8 六', venue:'中城里 11 鄰 6 號', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-05', chinese:'拿彌散部落', amis:'Namisan', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/14 五', venue:'樂合里 20 鄰 98 號前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-06', chinese:'下德武部落', amis:'Satefu', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/15 六', venue:'下德武部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-07', chinese:'馬太林部落', amis:'Matadim', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/15 六', venue:'春日里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-08', chinese:'吉能能麥部落', amis:'Cinemnemay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/15 六', venue:'吉能能麥部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-09', chinese:'苓雅仔部落', amis:'Lingacay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/16 日', venue:'德武里祭祀活動廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-10', chinese:'哈拉灣部落', amis:'Halawan', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'樂合里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-11', chinese:'織羅部落', amis:'Ceroh', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'春日里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-12', chinese:'阿飛赫部落／鐵份', amis:'Afih', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'東豐天主教堂廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-13', chinese:'督旮薾部落', amis:'Tokar', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'督旮薾聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-14', chinese:'安通部落', amis:'Angcoh', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'安通 57 號部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-15', chinese:'瑪谷達璦部落', amis:"Makotaay", county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/22 六', venue:'松浦里部落跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-16', chinese:'洛合谷部落', amis:'Lohok', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/23 日', venue:'松浦里部落聚會所', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-17', chinese:'滿自然部落', amis:'Mangcelan', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'8/23 日', venue:'松浦國小旁多功能活動廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-18', chinese:'達蓋部落', amis:'Takay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/24 四', venue:'三民土地公廟廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-19', chinese:'喜瑯宮部落', amis:'Silangkong', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/26 六', venue:'源城里多功能活動廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-20', chinese:'吉哈蓋部落', amis:'Cihakay', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/26 六', venue:'長良里土地公廟旁跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-yl-21', chinese:'瑟冷部落', amis:'Sedeng', county:'花蓮縣', township:'玉里鎮', lat:23.333, lng:121.310, date:'9/26 六', venue:'大禹土地公廟廣場', status:'confirmed', src:'hl_pdf' },

  // ══ 花蓮縣 富里鄉 ════════════════════════════════════════════════
  { id:'hl-ly-01', chinese:'姆拉丁部落', amis:'Monating', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'7/25 六', venue:'姆拉丁跳舞廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-02', chinese:'基拉歌賽部落', amis:'Cirakesay', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/1 六', venue:'復興部落多功能活動中心', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-03', chinese:'達蘭埠／黑暗部落', amis:'Talampo / Cihalaay', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/8 六', venue:'達蘭埠部落聚會場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-04', chinese:'馬里旺部落', amis:'Maliwang', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/9 日', venue:'馬里旺部落聚會場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-05', chinese:'公埔部落', amis:'Kungpu', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/15 六', venue:'明里村福德寺前廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-06', chinese:'露埔部落', amis:'Lupo', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/16 日', venue:'露埔部落跳舞場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-07', chinese:'吉拉米代部落', amis:'Cilamitay', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/22 六', venue:'吉拉米代部落祭祀廣場', status:'confirmed', src:'hl_pdf' },
  { id:'hl-ly-08', chinese:'安住／巴族耶部落', amis:'Ancoh / Pacuya', county:'花蓮縣', township:'富里鄉', lat:23.273, lng:121.293, date:'8/29 六', venue:'吳江村前空地', status:'confirmed', src:'hl_pdf' },

  // ══ 臺東縣 池上鄉 ════════════════════════════════════════════════
  { id:'tt-cs-01', chinese:'大埔部落', amis:'Kalokapuk', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/7 五–8/9 日', venue:'大埔聚會所，大埔村 55-1 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-02', chinese:'吉布娃部落', amis:'Cipuwa', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/7 五–8/9 日', venue:'慶豐聚會所，慶豐村 77-8 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-03', chinese:'陸安部落', amis:'Dihekoay', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/7 五–8/9 日', venue:'陸安聚會所，大埔村陸安 27 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-04', chinese:'甲道部落', amis:'Ciataw', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/14 五–8/16 日', venue:'甲道聚會所，福原村忠孝路 2 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-05', chinese:'大坡部落', amis:'Kawaliwali', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/14 五–8/16 日', venue:'大坡聚會所，大坡村 18 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-06', chinese:'福文部落', amis:"Cicala'ay", county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/14 五–8/16 日', venue:'福文聚會所，福文村大同路 88 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-07', chinese:'新興部落', amis:'Fangafangasan', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/21 五–8/23 日', venue:'新興聚會所，新興村一路 1 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-08', chinese:'白毛寮部落', amis:'Moliyaw', county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/21 五–8/23 日', venue:'振興聚會所，振興村 36-1 號', status:'confirmed', src:'tt_chiShang' },
  { id:'tt-cs-09', chinese:'吉瓜愛部落', amis:"Cikowa'ay", county:'臺東縣', township:'池上鄉', lat:23.113, lng:121.213, date:'8/21 五–8/23 日', venue:'富興聚會所，富興村水墜 62-5 號', status:'confirmed', src:'tt_chiShang' },

  // ══ 臺東縣 長濱鄉 ════════════════════════════════════════════════
  { id:'tt-cb-01', chinese:'南竹湖部落', amis:'Karangasan area', county:'臺東縣', township:'長濱鄉', lat:23.327, lng:121.443, date:'7/16–7/19', venue:'（地點未完整擷取）', status:'confirmed', src:'tt_changbin' },

  // ══ 臺東縣 東河鄉 ════════════════════════════════════════════════
  { id:'tt-dh-01', chinese:'瑪洛阿瀧聯合豐年祭', amis:'', county:'臺東縣', township:'東河鄉', lat:23.213, lng:121.373, date:'8/15（暫訂）', venue:'東河國小', status:'confirmed', src:'tt_donghe' },

  // ══ 臺東縣 成功鎮 ════════════════════════════════════════════════
  { id:'tt-cg-01', chinese:'民豐部落', amis:'Karahay', county:'臺東縣', township:'成功鎮', lat:23.097, lng:121.373, date:'7/9–7/10；迎賓日 7/10', venue:'忠智里活動中心', status:'confirmed', src:'tt_chenggong' }

];

// ── General notes (festival background) ──────────────────────────
const GENERAL_NOTES = [
  { icon:'◎', label:'別名 · Names', text:'豐年祭又稱 Ilisin（北部阿美語）或 Malikoda（南部），是阿美族（Pangcah）最重要的年度祭典。' },
  { icon:'◷', label:'日期 · Dates', text:'各部落日期每年微調，以部落或各鄉鎮市公所最新公告為準。本表資料截至 2026-06-21。' },
  { icon:'▣', label:'階級 · Age-grade', text:'年齡階級（pakelang）是典禮核心。不同階層各司其職，禮儀角色世代傳承。' },
  { icon:'⊗', label:'限制 · Restricted', text:'男子儀式期間有嚴格限制區域，嚴禁非阿美族人擅入。請尊重所有指示與圍繩。' },
  { icon:'○', label:'牽手舞 · Dancing', text:'圓圈舞（牽手舞）開放外來訪客參與，著裝端莊（不露肩、不穿短褲）即可加入。' },
  { icon:'◻', label:'攝影 · Photography', text:'拍照前請先徵得同意。部分儀式嚴禁錄影拍照，請以部落現場指示為準。' }
];
