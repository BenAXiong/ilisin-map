#!/usr/bin/env node
// Joins this project's data.js VILLAGES against Datasets/buluo/ami.json by
// (county, township, normalized Chinese name), and:
//   1. adds a `buluo_id` foreign key to each matched VILLAGES entry in data.js
//   2. writes buluo-ref.js — a small, self-contained lookup table (id -> identity
//      facts) for the matched buluo only, for viz.html to join against at render time.
// Re-run whenever Datasets/buluo/ami.json or this project's data.js changes.
// Datasets/buluo is a sibling directory outside this repo (and outside what
// Vercel deploys), so this script's OUTPUT (buluo-ref.js) is what actually
// ships — not a live fetch of the buluo db at runtime.
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const BULUO_ROOT = path.join(PROJECT_ROOT, '..', 'Datasets', 'buluo');

const dataJsPath = path.join(PROJECT_ROOT, 'data.js');
const dataJsSrc = fs.readFileSync(dataJsPath, 'utf8');

const sourcesReg = JSON.parse(fs.readFileSync(path.join(BULUO_ROOT, 'sources.json'), 'utf8')).sources;
const ami = JSON.parse(fs.readFileSync(path.join(BULUO_ROOT, 'ami.json'), 'utf8'));

function stripBrackets(s) {
  return (s || '').replace(/[（(].*?[）)]/g, '').trim();
}
// data.js sometimes joins an alt name with full-width slash, e.g. '大本部落／華東'.
function nameVariants(s) {
  return (s || '').split('／').map(stripBrackets).filter(Boolean);
}

// Index buluo records by (county|township|normalized chinese name), covering
// both chinese_name and every chinese_name_alt.
const buluoIndex = new Map();
for (const r of ami.records) {
  const names = [r.chinese_name, ...r.chinese_name_alt];
  for (const n of names) {
    const key = `${r.county}|${r.township}|${stripBrackets(n)}`;
    if (!buluoIndex.has(key)) buluoIndex.set(key, r);
  }
}
// Fallback index by (county|township|indigenous name), lowercased+apostrophe-
// normalized. Some buluo have a CIP-gazetted Chinese name that differs
// substantially from the commonly-used one this project's data.js carries
// (not just a bracket variant — e.g. CIP's 主農部落 vs data.js's
// 幾巴爾巴爾蘭部落), but the indigenous name still agrees and is a more
// reliable join key than the Chinese name in those cases.
function indigKey(s) { return (s || '').replace(/[‘’]/g, "'").toLowerCase().replace(/[^a-z0-9']/g, ''); }
const buluoIndexByIndig = new Map();
for (const r of ami.records) {
  const names = [r.indigenous_name, ...r.indigenous_name_alt].filter(Boolean);
  for (const n of names) {
    const key = `${r.county}|${r.township}|${indigKey(n)}`;
    if (!buluoIndexByIndig.has(key)) buluoIndexByIndig.set(key, r);
  }
}

// Strip any buluo_id already inserted by a previous run, so this script is
// idempotent (safe to re-run after ami.json changes without piling up fields).
const cleanedSrc = dataJsSrc.replace(/ buluo_id:'[^']*',/g, '');

// Extract the VILLAGES array literal and re-serialize it with buluo_id added,
// rather than eval+regenerate the whole file (preserves comments/formatting).
const vStart = cleanedSrc.indexOf('const VILLAGES = [');
const arrEnd = cleanedSrc.indexOf('\n];', vStart) + 1; // position of ']'
const VILLAGES = new Function(cleanedSrc.slice(vStart, arrEnd + 2) + '\nreturn VILLAGES;')();

const matched = [];
const unmatched = [];
for (const v of VILLAGES) {
  if (!v.chinese || v.chinese.includes('族群')) continue; // ethnic-group umbrella entries, not individual buluo
  const hit = nameVariants(v.chinese)
    .map(n => buluoIndex.get(`${v.county}|${v.township}|${n}`))
    .find(Boolean)
    || (v.amis ? buluoIndexByIndig.get(`${v.county}|${v.township}|${indigKey(v.amis)}`) : undefined);
  if (hit) matched.push({ villageId: v.id, buluoId: hit.id });
  else unmatched.push(`${v.id} (${v.chinese}, ${v.county}${v.township})`);
}

// 1. Patch data.js: insert buluo_id right after each matched entry's id field.
let patched = cleanedSrc;
for (const { villageId, buluoId } of matched) {
  const re = new RegExp(`(id:\\s*'${villageId}',)`);
  patched = patched.replace(re, `$1 buluo_id:'${buluoId}',`);
}
fs.writeFileSync(dataJsPath, patched, 'utf8');

// 2. Write buluo-ref.js: self-contained lookup for the matched ids only.
const matchedIds = [...new Set(matched.map(m => m.buluoId))];
const matchedIdSet = new Set(matchedIds);
const ref = {};
for (const id of matchedIds) {
  const r = ami.records.find(x => x.id === id);
  ref[id] = {
    chinese_name: r.chinese_name,
    chinese_name_alt: r.chinese_name_alt,
    indigenous_name: r.indigenous_name,
    indigenous_name_alt: r.indigenous_name_alt,
    dialect: r.dialect,
    status: r.status,
    sources: r.sources.map(s => (sourcesReg[s] || {}).label || s),
    notes: r.notes,
  };
}

// 3. Buluo known to the source-of-truth db but with no event data in data.js
// yet — i.e. a real community we have no 2026 ilisin info for. Derived fresh
// on every run (not hand-maintained) so it can't go stale. Carries its own
// location since there's no VILLAGES row to borrow one from.
const uncovered = ami.records
  .filter(r => !matchedIdSet.has(r.id))
  .map(r => ({
    id: r.id,
    chinese_name: r.chinese_name,
    chinese_name_alt: r.chinese_name_alt,
    indigenous_name: r.indigenous_name,
    indigenous_name_alt: r.indigenous_name_alt,
    dialect: r.dialect,
    county: r.county,
    township: r.township,
    village: r.village,
    lat: r.lat,
    lng: r.lng,
    coord_precision: r.coord_precision,
    status: r.status,
    sources: r.sources.map(s => (sourcesReg[s] || {}).label || s),
    notes: r.notes,
  }));

const header = `// Generated by scripts/build_buluo_ref.js from Datasets/buluo/ami.json — do not hand-edit.\n// Re-run the script after Datasets/buluo changes. See Datasets/buluo/DISPLAY.md for how to render these fields.\n` +
  `// BULUO_REF: identity facts for buluo that already have a data.js event entry (joined via buluo_id).\n` +
  `// BULUO_UNCOVERED: buluo known to the db with NO event entry yet — candidates for the 新增部落 contribution flow.\n`;
fs.writeFileSync(path.join(PROJECT_ROOT, 'buluo-ref.js'), header +
  `const BULUO_REF = ${JSON.stringify(ref, null, 2)};\n` +
  `const BULUO_UNCOVERED = ${JSON.stringify(uncovered, null, 2)};\n`, 'utf8');

console.log(`Matched: ${matched.length} / ${VILLAGES.length} VILLAGES entries (${matchedIds.length} unique buluo)`);
console.log(`Unmatched (excluding 族群 umbrella entries): ${unmatched.length}`);
for (const u of unmatched) console.log('  -', u);
console.log(`Uncovered (in buluo db, no data.js event yet): ${uncovered.length} / ${ami.records.length} ami.json records`);
