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

// Mirrors app.js's eventCoord() — see that file for the priority rationale
// (venueOverride > BULUO_REF exact/village > EVENTS' own fallback > BULUO_REF any).
const GOOD_COORD_PRECISION = new Set(['exact', 'village']);
function eventCoord(v) {
  if (v.venueOverride && v.lat != null && v.lng != null) return [v.lat, v.lng];
  const ref = v.buluo_id ? BULUO_REF[v.buluo_id] : null;
  if (GOOD_COORD_PRECISION.has(ref?.coord_precision) && ref.lat != null && ref.lng != null) return [ref.lat, ref.lng];
  if (v.lat != null && v.lng != null) return [v.lat, v.lng];
  if (ref?.lat != null && ref.lng != null) return [ref.lat, ref.lng];
  return null;
}

// ── Group config ──────────────────────────────────────────────────────
const GROUP_META = {
  ami: { heading: '阿美族 Amis (Pangcah) · Ilisin 豐年祭', festival: 'Ilisin 豐年祭', org: '阿美族（Pangcah）' },
  bnn: { heading: '布農族 Bunun · 射耳祭 Malahtangia',     festival: '射耳祭 Malahtangia', org: '布農族（Bunun）' },
  trv: { heading: '太魯閣族 Truku · 感恩祭 Smyus',         festival: '感恩祭 Smyus',        org: '太魯閣族（Truku）' },
  pwn: { heading: '排灣族 Paiwan · 豐年祭 Masalut',        festival: '豐年祭 Masalut',      org: '排灣族（Paiwan）' },
  pyu: { heading: '卑南族 Puyuma · 年祭 Mangayaw',         festival: '年祭 Mangayaw',       org: '卑南族（Puyuma）' },
  szy: { heading: '撒奇萊雅族 Sakizaya · 豐年祭 Malaliki\'', festival: '豐年祭 Malaliki\'',   org: '撒奇萊雅族（Sakizaya）' },
  ckv: { heading: '噶瑪蘭族 Kavalan · 豐年祭 Gataban',      festival: '豐年祭 Gataban',      org: '噶瑪蘭族（Kavalan）' },
};
const GROUP_ORDER = ['ami', 'bnn', 'trv', 'pwn', 'pyu', 'szy', 'ckv'];

// ── Date helpers (mirrors app.js) ────────────────────────────────────
const DECADE_MID = { '上': 5, '中': 15, '下': 25 };

function parseStart(str) {
  const s = str.match(/(\d{1,2})\/(\d{1,2})/);
  if (s) return new Date(2026, +s[1] - 1, +s[2]);
  const d = str.match(/(\d{1,2})月([上中下])旬/);
  if (d) return new Date(2026, +d[1] - 1, DECADE_MID[d[2]]);
  return null;
}

function parseEnd(str) {
  const m = str.match(/\d{1,2}\/\d{1,2}[^–—]*[–—](\d{1,2})\/(\d{1,2})/);
  if (m) return new Date(2026, +m[1] - 1, +m[2]);
  return null;
}

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
    const start = parseStart(v.date);
    if (!start) return null;
    const end  = parseEnd(v.date) || start;
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
      const wStart = parseStart(v.welcome_date);
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
