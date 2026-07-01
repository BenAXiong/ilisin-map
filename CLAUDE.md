# Ilisin Map — CLAUDE.md

Live site: **https://ilisin.tw/**  
Repo: `C:\Users\Ben\Documents\LL\6_ycm\豐年祭 地圖`  
Deeper docs (gitignored, local only): `docs/ROADMAP-v1.md`, `docs/DATA-SOURCES.md`

---

## Architecture

**No build toolchain.** Plain `<script src="...">` tags, no bundler, no transpiler,
no ES modules. Files are served as-is by Vercel. The one build step is
`scripts/prerender.js` (Node, run by Vercel on deploy via `vercel.json`).

**Script load order in index.html:**
```
data.js → buluo-ref.js → js/timeline.js → js/map.js → js/search.js → js/info.js → app.js
```
Tab files parse before `app.js` but only *call* shared utilities (`cardHtml`,
`parseStartDate`, `trackEvent`, etc.) at runtime — never at parse time — so
loading `app.js` last is safe. `TOWNSHIP_MAP` in `js/info.js` is the exception:
it runs at parse time, which is safe because `data.js` loads first.

**Reading `data.js` in Node scripts** — use `new Function()` (same pattern in
both `scripts/build_buluo_ref.js` and `scripts/prerender.js`):
```js
const src = fs.readFileSync('data.js', 'utf8');
const { SOURCES, DATA_NOTE, VILLAGES } = new Function(src + '\nreturn { SOURCES, DATA_NOTE, VILLAGES };')();
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
| `data.js` | Primary data: `SOURCES`, `DATA_NOTE`, `VILLAGES` (175 entries) |
| `buluo-ref.js` | Generated. `BULUO_REF` (147 matched buluo identity facts) + `BULUO_UNCOVERED` (64 unmatched) |
| `js/timeline.js` | Timeline tab — month strip, day cards, county filter |
| `js/map.js` | Map tab — Leaflet init, markers, bottom sheet, drag |
| `js/search.js` | Search tab — filter, recents, IME support |
| `js/info.js` | Info tab — stat tiles, sources, coverage box, contribution form |
| `api/contribute.js` | Vercel serverless — proxies contribution form POSTs to Airtable |
| `scripts/prerender.js` | Build: injects static HTML + JSON-LD into `index.html` |
| `scripts/build_buluo_ref.js` | Dev-only: joins `data.js` against `Datasets/buluo/ami.json`, writes `buluo-ref.js` |
| `viz.html` | Internal data viz / QA tool, not linked from the main app |
| `sw.js` | Service worker — caches app shell for offline/PWA |
| `docs/` | Gitignored local docs: `ROADMAP-v1.md`, `DATA-SOURCES.md`, CIP PDF, archive/ |

---

## Key data conventions

**`VILLAGES` entry shape:**
```js
{ id:'hl-xc-02', group:'ami', buluo_id:'ami-palamitan',
  chinese:'康樂部落', amis:'Palamitan',
  county:'花蓮縣', township:'新城鄉', lat:24.124, lng:121.657,
  date:'7/25 六', venue:'巴拉米旦聚會所',
  status:'confirmed', src:'hl_pdf' }
```
- `group` — ISO 639-3: `ami` (Amis), `bnn` (Bunun), `trv` (Truku). Never full names.
- `status` — `'confirmed'` | `'tbd'` | `'cancelled'`
- `buluo_id` — optional, added by `scripts/build_buluo_ref.js`. Links to `BULUO_REF`.
- `date` formats: `'7/25 六'`, `'7/3 五–7/11 六'`, `'8月下旬'`, `'停辦'`

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
Datasets/buluo/ami.json  (sibling repo, not deployed)
        │
        ▼
scripts/build_buluo_ref.js   →  data.js (adds buluo_id fields)
                             →  buluo-ref.js (BULUO_REF + BULUO_UNCOVERED)
        │
        ▼ (committed to repo)
scripts/prerender.js         →  index.html (static HTML + JSON-LD injected)
        │
        ▼ (run by Vercel on deploy)
        ilisin.tw
```

**When to re-run `build_buluo_ref.js`:** after `Datasets/buluo/ami.json` changes,
or after adding new VILLAGES entries that might now match buluo records.  
`node scripts/build_buluo_ref.js`

**When to re-run `prerender.js`:** after any change to VILLAGES data (new entries,
date corrections, cancellations). Vercel runs it automatically on deploy; run
locally before committing if you want the prerendered HTML in the commit.  
`node scripts/prerender.js`

---

## Current status (2026-07-01)

Phases A–C complete. Phase D (product polish) is next.

| Phase | What | Status |
|---|---|---|
| A | `<head>` SEO (title, OG, canonical, robots, sitemap, llms.txt) | ✅ |
| B | HTML refactor — modular files, semantic landmarks, prerender hooks | ✅ |
| B+ | `group` field on all 175 VILLAGES entries (ISO 639-3 codes) | ✅ |
| C | `scripts/prerender.js` — static HTML + JSON-LD at build time | ✅ |
| **D1** | **Themes rework** | ☐ |
| **D2** | **Info tab rework** (per-tribe prose, source: `docs/` CIP PDF) | ☐ |
| **D3** | **Contribution form polish** | ☐ |
| v2-A | Tribe expansion (Puyuma → Paiwan/Rukai → Bunun) | ☐ |
| v2-B | All-year timeline | ☐ |
| v2-C | Donations | ☐ |
| v2-D | Rich buluo details (minimap, photos, history) | ☐ |

Full roadmap and data source inventory: `docs/ROADMAP-v1.md`, `docs/DATA-SOURCES.md`
