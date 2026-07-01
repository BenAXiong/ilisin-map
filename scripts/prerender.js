#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const DATA  = path.join(ROOT, 'data.js');

// Load data.js — same new Function() pattern as build_buluo_ref.js
const src = fs.readFileSync(DATA, 'utf8');
const { SOURCES, DATA_NOTE, VILLAGES } = new Function(
  src + '\nreturn { SOURCES, DATA_NOTE, VILLAGES };'
)();

// ── Group config ──────────────────────────────────────────────────────
const GROUP_META = {
  ami: { heading: '阿美族 Amis (Pangcah) · Ilisin 豐年祭', festival: 'Ilisin 豐年祭', org: '阿美族（Pangcah）' },
  bnn: { heading: '布農族 Bunun · 射耳祭 Malahtangia',     festival: '射耳祭 Malahtangia', org: '布農族（Bunun）' },
  trv: { heading: '太魯閣族 Truku · 感恩祭 Smyus',         festival: '感恩祭 Smyus',        org: '太魯閣族（Truku）' },
};
const GROUP_ORDER = ['ami', 'bnn', 'trv'];

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
const confirmed = VILLAGES.filter(v => v.status === 'confirmed');
const total     = VILLAGES.length;

let staticHtml =
  `<h1>2026 全臺原住民族歲時祭儀 · Taiwan Indigenous Festival Calendar 2026</h1>\n` +
  `<p>涵蓋花蓮縣、臺東縣共 ${total}+ 部落，資料來源：各縣市原民處官方公告。</p>`;

for (const grp of GROUP_ORDER) {
  const meta    = GROUP_META[grp];
  const entries = confirmed.filter(v => v.group === grp);
  if (!entries.length) continue;

  staticHtml += `\n<section data-group="${grp}">\n  <h2>${meta.heading}</h2>`;
  for (const v of entries) {
    const name  = v.amis ? `${v.chinese} ${v.amis}` : v.chinese;
    const venue = v.venue && v.venue !== '—' ? ` · ${v.venue}` : '';
    staticHtml +=
      `\n  <article>\n    <h3>${name}</h3>\n    <p>${v.county}${v.township} · ${v.date}${venue}</p>\n  </article>`;
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
      url: 'https://ilisin.tw/',
    };
    if (v.lat && v.lng) {
      ev.location.geo = { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng };
    }
    if (v.amis) ev.alternateName = [v.amis];
    return ev;
  })
  .filter(Boolean);

const ldData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: '豐年祭地圖',
      alternateName: 'Taiwan Indigenous Festival Map',
      url: 'https://ilisin.tw/',
      description: '全臺唯一原住民族歲時祭儀彙整地圖',
      inLanguage: ['zh-TW', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ilisin.tw/?q={search_term_string}',
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
