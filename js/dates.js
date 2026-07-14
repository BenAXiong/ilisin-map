/* ═══════════════════════════════════════════════════
   DATE / COORDINATE RESOLUTION (shared)
   Pure logic, no DOM — consumed by js/event.js, js/info.js (all
   browser <script src>) and scripts/prerender.js (Node, via the same
   new Function() trick used for data.js/buluo-ref.js). new Function()
   bodies don't close over the caller's lexical scope, so prerender.js
   passes BULUO_REF in as an explicit function parameter instead of
   relying on it as a global the way the browser does.
   ═══════════════════════════════════════════════════ */

const DECADE_DAY = { '上': 5, '中': 15, '下': 25 };

function parseStartDate(str) {
  const slash = str.match(/(\d{1,2})\/(\d{1,2})/);
  if (slash) return new Date(2026, Number(slash[1]) - 1, Number(slash[2]));
  const decade = str.match(/(\d{1,2})月([上中下])旬/);
  if (decade) return new Date(2026, Number(decade[1]) - 1, DECADE_DAY[decade[2]]);
  return null;
}

function parseEndDate(str) {
  const m = str.match(/\d{1,2}\/\d{1,2}[^–—]*[–—](\d{1,2})\/(\d{1,2})/);
  if (m) return new Date(2026, Number(m[1]) - 1, Number(m[2]));
  return null;
}

// Resolves the best available coordinate for an EVENTS entry. Priority:
// 1. `venueOverride:true` — hand-curated flag for the rare case where the
//    festival is genuinely held somewhere other than the buluo's own
//    community (not the default; must be set explicitly per entry).
// 2. BULUO_REF's coordinate, if it's been geocoded to `'exact'` (real
//    per-venue) or `'village'` (named landmark/administrative-village
//    anchor — still better than a township-wide centroid) precision —
//    buluo identity/location now lives in the shared Datasets/buluo db,
//    not duplicated per-project.
// 3. This entry's own lat/lng — usually still just a township-level
//    approximation, kept as a fallback so nothing regresses while BULUO_REF
//    coverage is incomplete.
// 4. BULUO_REF's coordinate at any precision, else null (no pin).
const GOOD_COORD_PRECISION = new Set(['exact', 'village']);
function eventCoord(v) {
  if (v.venueOverride && v.lat != null && v.lng != null) return [v.lat, v.lng];
  const ref = v.buluo_id && typeof BULUO_REF !== 'undefined' ? BULUO_REF[v.buluo_id] : null;
  if (GOOD_COORD_PRECISION.has(ref?.coord_precision) && ref.lat != null && ref.lng != null) return [ref.lat, ref.lng];
  if (v.lat != null && v.lng != null) return [v.lat, v.lng];
  if (ref?.lat != null && ref.lng != null) return [ref.lat, ref.lng];
  return null;
}
