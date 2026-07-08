#!/usr/bin/env node
// Joins this project's data.js EVENTS against Datasets/buluo/{ami,pwn,pyu}.json
// by (county, township, normalized Chinese name), and:
//   1. adds a `buluo_id` foreign key to each matched EVENTS entry in data.js
//   2. writes buluo-ref.js — a small, self-contained lookup table (id -> identity
//      facts) for the matched buluo only, for viz.html to join against at render time.
// Re-run whenever Datasets/buluo/*.json or this project's data.js changes.
// Datasets/buluo is a sibling directory outside this repo (and outside what
// Vercel deploys), so this script's OUTPUT (buluo-ref.js) is what actually
// ships — not a live fetch of the buluo db at runtime.
//
// A EVENTS entry can opt out of / extend the default single-match behavior:
//   - `joint:true`    — a multi-buluo umbrella/tourism event, not one buluo
//                       (e.g. 瑪洛阿瀧聯合豐年祭). Skipped entirely: no buluo_id,
//                       not counted as unmatched. See docs/DATA-SOURCES.md §9.
//   - `buluo_ids:[]`  — one festival entry that is a known merge of 2+ distinct
//                       registered buluo (e.g. two adjacent hamlets sharing one
//                       date/venue, like 月眉部落). Hand-curated in data.js, not
//                       auto-derived — this script only validates + covers them.
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const BULUO_ROOT = path.join(PROJECT_ROOT, '..', 'Datasets', 'buluo');

const dataJsPath = path.join(PROJECT_ROOT, 'data.js');
const dataJsSrc = fs.readFileSync(dataJsPath, 'utf8');

const sourcesReg = JSON.parse(fs.readFileSync(path.join(BULUO_ROOT, 'sources.json'), 'utf8')).sources;

// Only groups this project currently has festival-event coverage for get a
// reference db loaded. Other groups' EVENTS entries (trv) simply stay
// unmatched, same as before — they have no buluo-identity project yet.
// szy/ckv (Sakizaya/Kavalan) map to the sibling db's own file-naming
// convention (sakizaya.json/kavalan.json), which predates this project's
// preference for real ISO 639-3 codes in `group` — see groups.json's _note.
// bnn (Bunun) added once Datasets/buluo/bnn.json existed (2026-06-30).
const GROUP_FILES = { ami: 'ami.json', pwn: 'pwn.json', pyu: 'pyu.json', bnn: 'bnn.json', szy: 'sakizaya.json', ckv: 'kavalan.json' };

function stripBrackets(s) {
  return (s || '').replace(/[（(].*?[）)]/g, '').trim();
}
// data.js sometimes joins an alt name with full-width slash, e.g. '大本部落／華東'.
function nameVariants(s) {
  return (s || '').split('／').map(stripBrackets).filter(Boolean);
}
// Some buluo have a CIP-gazetted Chinese name that differs substantially from
// the commonly-used one this project's data.js carries (not just a bracket
// variant), but the indigenous name still agrees and is a more reliable join
// key than the Chinese name in those cases.
function indigKey(s) { return (s || '').replace(/[‘’]/g, "'").toLowerCase().replace(/[^a-z0-9']/g, ''); }

// Per-group: raw records + two lookup indices (by chinese name, by indigenous
// name), keyed on (county|township|normalized name). Kept separate per group
// so a name collision between e.g. an Amis and a Paiwan buluo in the same
// township can't cross-match.
const groupRecords = {};      // group -> records[]
const recordsById = new Map(); // every loaded record, any group, by id
const indexByGroup = {};       // group -> Map(county|township|chineseName -> record)
const indigIndexByGroup = {};  // group -> Map(county|township|indigKey -> record)

for (const [grp, file] of Object.entries(GROUP_FILES)) {
  const records = JSON.parse(fs.readFileSync(path.join(BULUO_ROOT, file), 'utf8')).records;
  groupRecords[grp] = records;
  const nameIdx = new Map();
  const indigIdx = new Map();
  for (const r of records) {
    recordsById.set(r.id, r);
    for (const n of [r.chinese_name, ...r.chinese_name_alt]) {
      const key = `${r.county}|${r.township}|${stripBrackets(n)}`;
      if (!nameIdx.has(key)) nameIdx.set(key, r);
    }
    for (const n of [r.indigenous_name, ...r.indigenous_name_alt].filter(Boolean)) {
      const key = `${r.county}|${r.township}|${indigKey(n)}`;
      if (!indigIdx.has(key)) indigIdx.set(key, r);
    }
  }
  indexByGroup[grp] = nameIdx;
  indigIndexByGroup[grp] = indigIdx;
}

// Strip any buluo_id already inserted by a previous run, so this script is
// idempotent (safe to re-run after ami.json changes without piling up fields).
// Targets the singular `buluo_id:'...'` field only — hand-curated
// `buluo_ids:[...]` (plural) entries are a different literal string and are
// untouched by this regex.
const cleanedSrc = dataJsSrc.replace(/ buluo_id:'[^']*',/g, '');

// Extract the EVENTS array literal and re-serialize it with buluo_id added,
// rather than eval+regenerate the whole file (preserves comments/formatting).
const vStart = cleanedSrc.indexOf('const EVENTS = [');
const arrEnd = cleanedSrc.indexOf('\n];', vStart) + 1; // position of ']'
const EVENTS = new Function(cleanedSrc.slice(vStart, arrEnd + 2) + '\nreturn EVENTS;')();

const matched = [];      // { villageId, buluoId } — single auto-match; buluo_id gets written to data.js
const multiMatched = []; // { villageId, buluoIds } — hand-curated in data.js already, just validated + counted
const unmatched = [];
let jointSkipped = 0;

for (const v of EVENTS) {
  if (!v.chinese || v.chinese.includes('族群')) continue; // ethnic-group umbrella entries, not individual buluo
  if (v.joint) { jointSkipped++; continue; } // multi-buluo joint/tourism event — see docs/DATA-SOURCES.md §9
  if (v.buluo_ids) {
    for (const id of v.buluo_ids) {
      if (!recordsById.has(id)) console.warn(`  ! ${v.id}: buluo_ids references unknown id '${id}'`);
    }
    multiMatched.push({ villageId: v.id, buluoIds: v.buluo_ids });
    continue;
  }
  const nameIdx = indexByGroup[v.group];
  const indigIdx = indigIndexByGroup[v.group];
  let hit;
  if (nameIdx) {
    hit = nameVariants(v.chinese).map(n => nameIdx.get(`${v.county}|${v.township}|${n}`)).find(Boolean);
  }
  if (!hit && indigIdx && v.amis) {
    hit = indigIdx.get(`${v.county}|${v.township}|${indigKey(v.amis)}`);
  }
  if (hit) matched.push({ villageId: v.id, buluoId: hit.id });
  else unmatched.push(`${v.id} (${v.chinese}, ${v.county}${v.township})`);
}

// 1. Patch data.js: insert buluo_id right after each auto-matched entry's id field.
let patched = cleanedSrc;
for (const { villageId, buluoId } of matched) {
  const re = new RegExp(`(id:\\s*'${villageId}',)`);
  patched = patched.replace(re, `$1 buluo_id:'${buluoId}',`);
}
fs.writeFileSync(dataJsPath, patched, 'utf8');

// 2. Write buluo-ref.js: self-contained lookup for every matched id (single +
// hand-curated multi), across all loaded groups.
const matchedIds = [...new Set([
  ...matched.map(m => m.buluoId),
  ...multiMatched.flatMap(m => m.buluoIds),
])];
const matchedIdSet = new Set(matchedIds);
const ref = {};
for (const id of matchedIds) {
  const r = recordsById.get(id);
  if (!r) continue;
  ref[id] = {
    chinese_name: r.chinese_name,
    chinese_name_alt: r.chinese_name_alt,
    indigenous_name: r.indigenous_name,
    indigenous_name_alt: r.indigenous_name_alt,
    dialect: r.dialect,
    status: r.status,
    sources: r.sources.map(s => (sourcesReg[s] || {}).label || s),
    notes: r.notes,
    chiefs: (r.chiefs || []).map(c => ({ ...c, sources: c.sources.map(s => sourcesReg[s]?.label || s) })),
    contact: (r.contact || []).map(c => ({ ...c, sources: c.sources.map(s => sourcesReg[s]?.label || s) })),
  };
}

// 3. Buluo known to the source-of-truth db but with no event data in data.js
// yet — i.e. a real community we have no 2026 ilisin info for. Derived fresh
// on every run (not hand-maintained) so it can't go stale. Scoped to `ami`
// only (this project's Amis-focused 新增部落 contribution flow) — the Paiwan/
// Puyuma reference data loaded above is only used to fix mis-tagged entries,
// not to grow this list.
const uncovered = groupRecords.ami
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

const header = `// Generated by scripts/build_buluo_ref.js from Datasets/buluo/{ami,pwn,pyu}.json — do not hand-edit.\n// Re-run the script after Datasets/buluo changes. See Datasets/buluo/DISPLAY.md for how to render these fields.\n` +
  `// BULUO_REF: identity facts for buluo that already have a data.js event entry (joined via buluo_id / buluo_ids).\n` +
  `// BULUO_UNCOVERED: Amis buluo known to the db with NO event entry yet — candidates for the 新增部落 contribution flow.\n`;
fs.writeFileSync(path.join(PROJECT_ROOT, 'buluo-ref.js'), header +
  `const BULUO_REF = ${JSON.stringify(ref, null, 2)};\n` +
  `const BULUO_UNCOVERED = ${JSON.stringify(uncovered, null, 2)};\n`, 'utf8');

console.log(`Matched: ${matched.length} single-buluo + ${multiMatched.length} multi-buluo EVENTS entries / ${EVENTS.length} total (${matchedIds.length} unique buluo covered)`);
console.log(`Joint/umbrella events skipped from matching: ${jointSkipped}`);
console.log(`Unmatched (excluding 族群 umbrella + joint entries): ${unmatched.length}`);
for (const u of unmatched) console.log('  -', u);
console.log(`Uncovered (Amis buluo in db, no data.js event yet): ${uncovered.length} / ${groupRecords.ami.length} ami.json records`);
