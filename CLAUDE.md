# Pokoh — CLAUDE.md

Live site: **https://pokoh.vercel.app/** (no custom domain yet — this is Vercel's auto-assigned URL for the `pokoh` project)  
Repo: `C:\Users\Ben\Documents\LL\6_ycm\豐年祭 地圖`  
Deeper docs (gitignored, local only): `docs/ROADMAP-v1.md`, `docs/ROADMAP-v2.md`, `docs/DATA-SOURCES.md`

---

## Architecture

**No build toolchain.** Plain `<script src="...">` tags, no bundler, no transpiler,
no ES modules. Files are served as-is by Vercel. The one build step is
`scripts/prerender.js` (Node, run by Vercel on deploy via `vercel.json`).

**Script load order in index.html:**
```
data.js → buluo-ref.js → schedule.js → js/timeline.js → js/map.js → js/search.js → js/info.js → js/detail.js → app.js
```
Tab files parse before `app.js` but only *call* shared utilities (`cardHtml`,
`parseStartDate`, `trackEvent`, etc.) at runtime — never at parse time — so
loading `app.js` last is safe. `TOWNSHIP_MAP` in `js/info.js` is the exception:
it runs at parse time, which is safe because `data.js` loads first.

**Reading `data.js` in Node scripts** — use `new Function()` (same pattern in
both `scripts/build_buluo_ref.js` and `scripts/prerender.js`):
```js
const src = fs.readFileSync('data.js', 'utf8');
const { SOURCES, DATA_NOTE, EVENTS } = new Function(src + '\nreturn { SOURCES, DATA_NOTE, EVENTS };')();
```

**Prerender / crawler mechanism:**
- `<main id="festival-data">` in `index.html` — static HTML injected at build time
- `html.js-ready #festival-data` CSS rule hides it once JS loads
- `document.documentElement.classList.add('js-ready')` fires in `app.js` at boot

---

## File map

| File / Dir | What it does |
|---|---|
| `index.html` | App shell + prerendered static content (injected by `scripts/prerender.js`) |
| `app.css` | All styles. CSS custom property theme system (`--fs-*`, `--c-*`, `data-theme` attr) |
| `app.js` | Shared utilities, theme, tab switching, PWA, SW registration, boot |
| `data.js` | Primary data: `SOURCES`, `DATA_NOTE`, `EVENTS` |
| `buluo-ref.js` | Generated. `BULUO_REF` (matched buluo identity facts, incl. `lat`/`lng`/`coord_precision`) + `BULUO_UNCOVERED` (unmatched) |
| `schedule.js` | Hand-curated. `SCHEDULE_DETAILS` (per-village sub-events/poster/history) + `SCHEDULE_POSTERS` (poster images shared by `src`) |
| `js/timeline.js` | Timeline tab — month strip, day cards, county filter |
| `js/map.js` | Map tab — Leaflet init, markers, bottom sheet, drag |
| `js/search.js` | Search tab — filter, recents, IME support |
| `js/info.js` | Info tab — stat tiles, sources, coverage box, contribution form |
| `js/detail.js` | Village detail overlay — near-fullscreen "更多資訊" view, reads `schedule.js` |
| `api/contribute.js` | Vercel serverless — proxies contribution form POSTs to Airtable |
| `scripts/prerender.js` | Build: injects static HTML + JSON-LD into `index.html` |
| `scripts/build_buluo_ref.js` | Dev-only: joins `data.js` against `Datasets/buluo/{ami,pwn,pyu,bnn,sakizaya,kavalan}.json`, writes `buluo-ref.js` |
| `viz.html` | Internal data viz / QA tool, not linked from the main app |
| `sw.js` | Service worker — caches app shell for offline/PWA |
| `images/schedule/` | Poster image assets referenced by `schedule.js` |
| `docs/` | Gitignored local docs: `ROADMAP-v1.md`, `DATA-SOURCES.md`, CIP PDF, archive/, `sources/` (raw source docs/images, not deployed) |

---

## Key data conventions

**`EVENTS` entry shape:**
```js
{ id:'hl-xc-02', group:'ami', buluo_id:'ami-palamitan',
  chinese:'康樂部落', amis:'Palamitan',
  county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657,
  date:'7/25 六', venue:'巴拉米旦聚會所',
  status:'confirmed', src:'hl_pdf' }
```
- `group` — project-internal short code, not a verified ISO 639-3 for every entry
  (see `Datasets/buluo/groups.json`'s `_note`): `ami` (Amis), `bnn` (Bunun), `trv`
  (Truku), `pwn` (Paiwan), `pyu` (Puyuma), `szy` (Sakizaya), `ckv` (Kavalan). Never
  full names. Must reflect actual ethnicity, never a source document's own
  administrative filing — e.g. `hl_pdf` (a Amis-focused county PDF) lists a few
  Sakizaya/Kavalan buluo under its Amis schedule, but their `group` here is still
  `szy`/`ckv`. `ami`/`pwn`/`pyu`/`bnn`/`szy`/`ckv` all have a buluo reference db
  wired up (see below); only `trv` entries are never auto-matched to a `buluo_id`.
- `status` — `'confirmed'` | `'tbd'` | `'cancelled'`
- `buluo_id` — optional, added by `scripts/build_buluo_ref.js`. Single FK into `BULUO_REF`.
- `buluo_ids` — optional array, **hand-curated** (never auto-written). Use when one
  festival entry is a known merge of 2+ distinct registered buluo (e.g. `hl-sf-12`
  月眉部落 = `['ami-sililasay','ami-siapaluway']`). The build script validates the
  ids and folds them into `BULUO_REF` coverage; it does not try to auto-derive these.
- `joint` — optional `true`, hand-set. Marks a multi-buluo umbrella/tourism event
  that isn't one specific buluo (e.g. `tt-dh-01` 瑪洛阿瀧聯合豐年祭). The build
  script skips these entirely — no `buluo_id`, not counted as unmatched. Prefer
  this explicit flag over any name-substring heuristic (e.g. matching "聯合") —
  it can't false-positive on a real buluo whose name happens to contain that
  substring, and can't false-negative on a joint event that doesn't.
- `note` — optional free-text string, informational only (no code reads it yet).
  Used so far to record *why* a `szy`/`ckv` entry is sourced from an Amis-focused
  PDF (`hl_pdf`) despite its `group` — provenance, not a discrepancy flag (the
  `group` itself is always the corrected, actual ethnicity). See
  `docs/DATA-SOURCES.md` §9.
- `date` formats: `'7/25 六'`, `'7/3 五–7/11 六'`, `'8月下旬'`, `'停辦'`
- `welcome_date`/`welcome_time` — optional scalars, 迎賓日 (welcome day).
  `welcome_date` is a bare `'M/D'` (no weekday suffix, unlike `date`);
  `welcome_time` is `'HH:MM'`. Read by `cardBodyHtml()`/timeline band
  rendering (`app.js`/`js/timeline.js`) and emitted into prerendered static
  HTML + JSON-LD `subEvent` (`scripts/prerender.js`) — promoted here from
  `schedule.js` specifically so those consumers don't need a second lookup.
- `venueOverride` — optional `true`, hand-set. Marks an entry whose own
  `lat`/`lng` is authoritative even though it has a `buluo_id` — used for the
  rare case where a festival is genuinely held somewhere other than the
  buluo's own community (not yet used by any entry as of 2026-07-09; flag it
  when you identify one, along with a `note` explaining the divergence).
  Without this flag, a matched entry's *effective* coordinate is resolved by
  `eventCoord()`, not read directly from `v.lat`/`v.lng` — see below.

**Coordinate resolution (`eventCoord(v)` in `app.js`, mirrored in
`scripts/prerender.js`):** buluo identity/location now lives in the shared
`Datasets/buluo/*.json` db (`lat`/`lng`/`coord_precision`, threaded into
`BULUO_REF` by `build_buluo_ref.js` — see below), not duplicated per-project.
Every place that plots a pin or emits geo data calls `eventCoord(v)` instead
of reading `v.lat`/`v.lng` directly (`js/map.js`'s marker/bounds/fit-to-filter
code, `app.js`'s maps-link fallback, `scripts/prerender.js`'s JSON-LD `geo`).
Priority: (1) `venueOverride:true` → the entry's own `lat`/`lng`; (2)
`BULUO_REF[buluo_id].coord_precision` is `'exact'` or `'village'` (see
`Datasets/buluo/schema.json` for what distinguishes them) → inherit that;
(3) the entry's own `lat`/`lng` (usually still a township-level
approximation, shared across every buluo in the same township — kept as a
fallback so nothing regresses while `BULUO_REF` coverage is incomplete);
(4) `BULUO_REF`'s coordinate at any precision; (5) `null` (no pin).

**Geocoding pass methodology — lessons from the 2026-07-09/13 passes
(`docs/DATA-SOURCES.md` §11a–11e), worth re-reading before starting another
one:**
- **Never trust a same-looking coordinate across 2+ distinct buluo as real
  precision.** If a new source claims per-venue coordinates, check the
  *entire* source for values reused across multiple distinct buluo (a
  township/regional-centroid artifact baked into that source), not just
  the handful of records you're currently matching — a spot-check misses
  this. Found this exact pattern twice: taitung-festival's own 東河鄉 rows
  (9 buluo, one shared point) and TICD's `ami-dipit`/`ami-palinkaan`
  (two different real buluo sharing one wrong point).
- **Check any existing `note`/`notes` on the record before overwriting its
  coordinate** — a prior manual correction (e.g. `tt-ly-03`, which
  reverted an implausible scraped coordinate) can look like a stale,
  upgradeable value to a heuristic that doesn't read prose. This bit us
  once (`ami-pailasan` almost got re-broken by the very upgrade meant to
  help it) — caught by spot-checking against known-flagged entries after
  the fact, not by the process itself, so build the check in up front next
  time rather than relying on catching it after.
- **Verify an "alternate name" lead against a second source before logging
  it** — a similar-sounding name found via search is not automatically the
  same buluo. `ami-cirocan`'s search briefly suggested "牧魯棧部落" as an
  alt name; a stronger source (國家文化記憶庫) revealed it's a *different,
  neighboring* buluo instead. Don't write an alt name from a single
  search-summary result.
- **Nominatim (OpenStreetMap) has effectively no building/street-level
  coverage for rural 花蓮/臺東 indigenous venues.** Free-text Traditional
  Chinese address queries mostly return nothing, or garbage (fuzzy-matched
  unrelated places in Europe in more than one case). English/romanized
  queries for well-known *named landmarks* (train stations, forest
  recreation areas, or the OSM administrative-village node itself) work
  reliably — that's the ceiling for free automated geocoding here, which
  is exactly why `coord_precision: 'village'` exists as an honest
  intermediate tier rather than forcing a choice between `'exact'` and a
  raw township centroid.
- **`hl_pdf` (the 花蓮縣原民處 PDF) has a recurring group-misclassification
  pattern** — it's Amis-focused and periodically files a Sakizaya/Kavalan
  buluo under `group:'ami'` anyway (see the `szy`/`ckv` examples already
  in this doc). Found 2 more instances of this in entries that also lacked
  a coordinate (`hl-hl-06`, `hl-fb-12`) — worth treating a coordinate gap
  as a cue to double-check the `group` field too, not just assume it's
  purely a geocoding problem.
- **Don't fabricate a new `Datasets/buluo` record just to unblock a
  coordinate.** If a buluo genuinely isn't in any loaded registry under
  its name or common variants, leave it unmatched (township-level
  fallback) rather than inventing identity fields to make a coordinate
  possible — that just relocates the fabrication from `lat`/`lng` to the
  record's other fields.

Adding a new non-`ami` `group` value requires wiring it in 3 places, or the entry
silently vanishes from prerendered output: (1) `GROUP_FILES` in
`scripts/build_buluo_ref.js` (which `Datasets/buluo/*.json` to load), (2)
`GROUP_META` + `GROUP_ORDER` in `scripts/prerender.js` (heading/festival-name/org
strings + render order), (3) re-run both build scripts.

**`SCHEDULE_DETAILS` / `SCHEDULE_POSTERS` (`schedule.js`):**  
Keyed by `EVENTS.id` (not `buluo_id`) — this data is festival-instance/
year-specific, unlike the enduring identity facts in `BULUO_REF`. Per entry,
all keys optional: `poster` (`{url,credit,creditUrl?,kind}` — `url` is a
root-relative path into `images/schedule/`; `credit` is link text, never a
raw URL — only becomes clickable when `creditUrl` is set, typically reusing
the entry's own `SOURCES[v.src].url` since the poster and the schedule data
usually share a source), `days` (day-by-day sub-event breakdown, only
when a source gives one — `[{date,zh,name,desc_zh?,desc_en?}]`; **one event
per row** — if a single day has multiple named sub-events, give each its own
`days` entry rather than combining names into one row), `history` (hand-authored prose —
deliberately *not* sourced from `BULUO_REF.notes`, which is internal
provenance text, not visitor-facing copy). `SCHEDULE_POSTERS` is a fallback
keyed by `src` (the `SOURCES` key), so one poster image can cover every
`EVENTS` entry sharing that source (e.g. a single township-wide board
covering 14 buluo) without duplicating
the file path per entry — resolved together via `getScheduleDetail(v)` in
`app.js`.

**`data-tab` vs `data-ctab`:**  
Global tab buttons (`.tab-btn`, `.sb-link`) use `data-tab`.  
Contribution sub-tabs (`.contrib-tab`) use `data-ctab` to avoid collision.

**Idempotency markers in `index.html`:**  
`<!-- PRERENDER:START / END -->` wraps static festival HTML inside `<main>`.  
`<!-- JSONLD:START / END -->` wraps the `<script type="application/ld+json">` in `<head>`.  
`scripts/prerender.js` targets these markers — safe to re-run.

---

## Data pipeline

```
Datasets/buluo/{ami,pwn,pyu,bnn,sakizaya,kavalan}.json  (sibling repo, not deployed)
        │
        ▼
scripts/build_buluo_ref.js   →  data.js (adds buluo_id fields)
                             →  buluo-ref.js (BULUO_REF + BULUO_UNCOVERED)
        │
        ▼ (committed to repo)
scripts/prerender.js         →  index.html (static HTML + JSON-LD injected)
        │
        ▼ (run by Vercel on deploy)
        pokoh.vercel.app
```

`ami`/`pwn`/`pyu`/`bnn`/`szy`/`ckv` all have a loaded reference db (`GROUP_FILES`
in `build_buluo_ref.js`) — matching and `BULUO_REF` cover all six, but
`BULUO_UNCOVERED` stays Amis-only (it feeds the `ami`-focused 新增部落
contribution flow). `trv` EVENTS entries are never auto-matched.

**When to re-run `build_buluo_ref.js`:** after any `Datasets/buluo/*.json` in
`GROUP_FILES` changes, or after adding new EVENTS entries that might now match
buluo records.  
`node scripts/build_buluo_ref.js`

**When to re-run `prerender.js`:** after any change to EVENTS data (new entries,
date corrections, cancellations). Vercel runs it automatically on deploy; run
locally before committing if you want the prerendered HTML in the commit.  
`node scripts/prerender.js`

---

## Current status (2026-07-06)

Phases A–E complete. v2 expansion tracked separately.

| Phase | What | Status |
|---|---|---|
| A | `<head>` SEO (title, OG, canonical, robots, sitemap, llms.txt) | ✅ |
| B | HTML refactor — modular files, semantic landmarks, prerender hooks | ✅ |
| B+ | `group` field on all EVENTS entries (ISO 639-3 codes) | ✅ |
| C | `scripts/prerender.js` — static HTML + JSON-LD at build time | ✅ |
| D1 | Themes rework | ✅ |
| D2 | Info tab rework (per-tribe prose, source: `docs/` CIP PDF) | ✅ |
| E | Rename site to "Pokoh" | ✅ |

v2 expansion (tribe data, all-year timeline, donations, village detail overlay,
map behavior, share, Chill'ey integration, contribution form polish — moved
from D3) is tracked in `docs/ROADMAP-v2.md`, not here.

Full roadmap and data source inventory: `docs/ROADMAP-v1.md`, `docs/ROADMAP-v2.md`, `docs/DATA-SOURCES.md`
