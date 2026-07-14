#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const DATA  = path.join(ROOT, 'data.js');

// Load data.js — same new Function() pattern as build_buluo_ref.js
const src = fs.readFileSync(DATA, 'utf8');
const { SOURCES, DATA_NOTE, EVENTS } = new Function(
  src + '\nreturn { SOURCES, DATA_NOTE, EVENTS };'
)();

// buluo-ref.js is a plain global-scope script (BULUO_REF/BULUO_UNCOVERED),
// same loading trick as data.js above.
const refSrc = fs.readFileSync(path.join(ROOT, 'buluo-ref.js'), 'utf8');
const { BULUO_REF } = new Function(refSrc + '\nreturn { BULUO_REF };')();

// js/dates.js is the shared parseStartDate/parseEndDate/eventCoord module
// (also loaded by the browser via <script src>) — new Function() bodies
// don't close over this file's local scope, so BULUO_REF is passed in as an
// explicit parameter rather than relied on as a global like in the browser.
const datesSrc = fs.readFileSync(path.join(ROOT, 'js/dates.js'), 'utf8');
const { parseStartDate, parseEndDate, eventCoord } = new Function(
  'BULUO_REF',
  datesSrc + '\nreturn { parseStartDate, parseEndDate, eventCoord };'
)(BULUO_REF);

// ── Group config ──────────────────────────────────────────────────────
const GROUP_META = {
  ami: { heading: '阿美族 Amis (Pangcah) · Ilisin 豐年祭', festival: 'Ilisin 豐年祭', org: '阿美族（Pangcah）' },
  bnn: { heading: '布農族 Bunun · 射耳祭 Malahtangia',     festival: '射耳祭 Malahtangia', org: '布農族（Bunun）' },
  trv: { heading: '太魯閣族 Truku · 感恩祭 Smyus',         festival: '感恩祭 Smyus',        org: '太魯閣族（Truku）' },
  pwn: { heading: '排灣族 Paiwan · 豐年祭 Masalut',        festival: '豐年祭 Masalut',      org: '排灣族（Paiwan）' },
  pyu: { heading: '卑南族 Puyuma · 年祭 Mangayaw',         festival: '年祭 Mangayaw',       org: '卑南族（Puyuma）' },
  szy: { heading: '撒奇萊雅族 Sakizaya · 豐年祭 Malaliki\'', festival: '豐年祭 Malaliki\'',   org: '撒奇萊雅族（Sakizaya）' },
  ckv: { heading: '噶瑪蘭族 Kavalan · 豐年祭 Gataban',      festival: '豐年祭 Gataban',      org: '噶瑪蘭族（Kavalan）' },
  // Not an ethnicity code like the 7 above — a county/city-run cross-tribe
  // joint festival (always paired with joint:true; see CLAUDE.md). `chinese`
  // for this group is already a complete standalone event title (unlike the
  // tribe groups, where it's just a place/buluo name), so `festival` is left
  // empty to avoid restating it — accepts a harmless double-space in the
  // generated JSON-LD `name` string as the tradeoff. `org` is currently
  // hardcoded to this group's one real entry's actual organizer
  // (花蓮縣政府) — if a second `misc` entry from a different organizing
  // government is ever added (e.g. a future 桃園市 joint festival), this
  // needs to become a per-EVENTS-entry field instead of a per-group constant.
  misc: { heading: '跨族群聯合活動 · 縣市聯合豐年節', festival: '', org: '花蓮縣政府' },
};
const GROUP_ORDER = ['ami', 'bnn', 'trv', 'pwn', 'pyu', 'szy', 'ckv', 'misc'];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Build static HTML ─────────────────────────────────────────────────
const confirmed = EVENTS.filter(v => v.status === 'confirmed');
const total     = EVENTS.length;

let staticHtml =
  `<h1>Pokoh · 2026 全臺原住民族歲時祭儀 · Taiwan Indigenous Festival Calendar 2026</h1>\n` +
  `<p>涵蓋花蓮縣、臺東縣共 ${total}+ 部落，資料來源：各縣市原民處官方公告。</p>`;

for (const grp of GROUP_ORDER) {
  const meta    = GROUP_META[grp];
  const entries = confirmed.filter(v => v.group === grp);
  if (!entries.length) continue;

  staticHtml += `\n<section data-group="${grp}">\n  <h2>${meta.heading}</h2>`;
  for (const v of entries) {
    const name    = v.amis ? `${v.chinese} ${v.amis}` : v.chinese;
    const venue   = v.venue && v.venue !== '—' ? ` · ${v.venue}` : '';
    const welcomeTimeText = v.welcome_time ? ` ${v.welcome_time}` : '';
    const welcome = v.welcome_date
      ? `\n    <p>迎賓日：${v.welcome_date}${welcomeTimeText}</p>`
      : '';
    staticHtml +=
      `\n  <article>\n    <h3>${name}</h3>\n    <p>${v.county}${v.township} · ${v.date}${venue}</p>${welcome}\n  </article>`;
  }
  staticHtml += `\n</section>`;
}

// ── Build JSON-LD ─────────────────────────────────────────────────────
const events = confirmed
  .map(v => {
    const start = parseStartDate(v.date);
    if (!start) return null;
    const end  = parseEndDate(v.date) || start;
    const meta = GROUP_META[v.group] || GROUP_META.ami;
    const hasVenue = v.venue && v.venue !== '—';

    const ev = {
      '@type': 'Event',
      name: `${v.chinese} ${meta.festival} 2026`,
      startDate: iso(start),
      endDate:   iso(end),
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: hasVenue ? v.venue : `${v.county}${v.township}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: v.township,
          addressRegion:   v.county,
          addressCountry:  'TW',
        },
      },
      organizer: { '@type': 'Organization', name: `${v.chinese} ${meta.org}` },
      inLanguage: 'zh-TW',
      isAccessibleForFree: true,
      url: 'https://pokoh.vercel.app/',
    };
    const coord = eventCoord(v);
    if (coord) {
      ev.location.geo = { '@type': 'GeoCoordinates', latitude: coord[0], longitude: coord[1] };
    }
    if (v.amis) ev.alternateName = [v.amis];
    if (v.welcome_date) {
      const wStart = parseStartDate(v.welcome_date);
      if (wStart) {
        ev.subEvent = {
          '@type': 'Event',
          name: `${v.chinese} 迎賓日 Welcome Day`,
          startDate: v.welcome_time ? `${iso(wStart)}T${v.welcome_time}` : iso(wStart),
          eventStatus: 'https://schema.org/EventScheduled',
        };
      }
    }
    return ev;
  })
  .filter(Boolean);

const ldData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Pokoh',
      alternateName: ['豐年祭指南', 'Taiwan Indigenous Festival Map'],
      url: 'https://pokoh.vercel.app/',
      description: '全臺唯一原住民族歲時祭儀彙整地圖',
      inLanguage: ['zh-TW', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://pokoh.vercel.app/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    ...events,
  ],
};

const jsonldBlock =
  `<!-- JSONLD:START -->\n` +
  `<script type="application/ld+json">\n` +
  `${JSON.stringify(ldData, null, 2)}\n` +
  `</script>\n` +
  `<!-- JSONLD:END -->`;

// ── Inject into index.html ────────────────────────────────────────────
let html = fs.readFileSync(INDEX, 'utf8');

// Replace <main id="festival-data">...</main> (idempotent across re-runs)
const newMain =
  `<main id="festival-data" aria-label="靜態祭儀資料" aria-hidden="true">\n` +
  `<!-- PRERENDER:START -->\n` +
  `${staticHtml}\n` +
  `<!-- PRERENDER:END -->\n` +
  `</main>`;
html = html.replace(/<main id="festival-data"[\s\S]*?<\/main>/, newMain);

// Replace or insert JSON-LD in <head>
if (html.includes('<!-- JSONLD:START -->')) {
  html = html.replace(/<!-- JSONLD:START -->[\s\S]*?<!-- JSONLD:END -->/, jsonldBlock);
} else {
  html = html.replace('</head>', `${jsonldBlock}\n</head>`);
}

fs.writeFileSync(INDEX, html, 'utf8');
console.log(`prerender: ${confirmed.length} static HTML entries, ${events.length} JSON-LD events → index.html updated`);
