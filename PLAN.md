# 豐年祭地圖 — Redesign Plan
Source wireframes: Claude Design project `a1eea8ad-b6b6-4077-bcf1-e6963d76de34`

## RULE: Prompt Ben for suggestions + confirmation BEFORE every phase. No exceptions.

---

## Phases

- [ ] **Phase 1** — HTML restructure: tab shell + 4 panels; shared header; CSS relative-color theme system
- [ ] **Phase 2** — Map tab: full-screen Leaflet, floating county chips, bottom sheet (3 states)
- [ ] **Phase 3** — Timeline tab: month tabs, week nav, date strip, day list
- [ ] **Phase 4** — Search tab: sticky input, quick chips, live-filtered results
- [ ] **Phase 5** — Info tab: logo, stat tiles, warning box, sources
- [ ] **Phase 6** — Desktop breakpoint: 240px sidebar, center map, 440px slide-in detail panel
- [ ] **Phase 7** — Data viz page (admin view, post Phase 6)
- [ ] **Phase 8** — User contribution form: report missing/updated dates, submit new village; backend TBD
- [ ] **Phase 9** — Analytics: page views, tab usage, search queries, card taps; provider TBD

---

## Architecture

- Static PWA, no build step — single `index.html` + `data.js` + `sw.js`
- Tab order: **Timeline | Map | Search | Info**
- Tab switching: 4 `<div class="panel">` elements, JS toggles `display:none/block`
- Mobile: bottom tab bar 84px
- Panels with shared header (Timeline, Map, Search): `calc(100dvh - 84px - 54px)`
- Info panel (no shared header): `calc(100dvh - 84px)` — own centered logo layout
- Desktop (≥768px): sidebar nav replaces tab bar; Timeline/Search replace map in center column

---

## Theme System

- **3 base variables:** `--bg`, `--accent`, `--ink` — all other tokens are CSS relative-color derivations
- **Themes:** `default` (warm day) → `night` → `coast` → *(4th reserved)* → cycles back
- Toggle: single cycle button in shared header (right side), persisted in `localStorage`
- `data-theme` attribute on `<html>`; no theme = default

```css
:root {
  --bg:     oklch(92% 0.025 75);
  --accent: oklch(52% 0.16 55);
  --ink:    oklch(10% 0.035 55);

  /* Derived — never manually overridden: */
  --bg-alt:     oklch(from var(--bg)  calc(l - 0.04) c h);
  --surface:    oklch(from var(--bg)  calc(l + 0.04) c h);
  --border:     oklch(from var(--bg)  calc(l - 0.09) c h);
  --border-2:   oklch(from var(--bg)  calc(l - 0.15) c h);
  --amber:      var(--accent);
  --amber-pale: oklch(from var(--accent) calc(l + 0.28) calc(c * 0.5) h);
  --amber-dark: oklch(from var(--accent) calc(l - 0.14) c h);
  --text-1:     var(--ink);
  --text-2:     oklch(from var(--ink) calc(l + 0.25) c h);
  --text-3:     oklch(from var(--ink) calc(l + 0.44) calc(c * 0.7) h);
  --terra:      oklch(from var(--accent) calc(l - 0.08) calc(c * 1.1) calc(h + 12));
  --terra-pale: oklch(from var(--accent) calc(l + 0.22) calc(c * 0.6) calc(h + 12));
  --green:      oklch(46% 0.14 145);
}

[data-theme="night"] {
  --bg:     oklch(14% 0.02 50);
  --accent: oklch(65% 0.14 58);
  --ink:    oklch(91% 0.02 80);
}
[data-theme="coast"] {
  --bg:     oklch(93% 0.018 210);
  --accent: oklch(46% 0.15 210);
  --ink:    oklch(12% 0.025 220);
}
/* [data-theme="reserved"] — slot held for future theme */
```

---

## Wireframe Key Decisions

**Shared header (Timeline, Map, Search)**
- Height: 54px, fixed at top of each panel
- Left: logo (32px circle) + title "豐年祭地圖"
- Right: theme cycle button + PWA install button (hidden until prompt fires)

**Map tab**
- Header present (map height = `calc(100dvh - 84px - 54px)`)
- Floating chips on map: 全部 | 花蓮 | 臺東 (replaces current filter buttons)
- Bottom sheet 3 states: collapsed (handle) → half-open (1–2 cards) → full-open (scroll all)
- Drag handle + swipe gesture; dismiss deselects marker
- Marker popup: Chinese name, Amis name, township, date

**Timeline tab (formerly Calendar — first position)**
- Month tabs: 6月 7月 8月 9月 — accent underline = active
- Week nav: ‹ date range › jumps 7 days; strip swipe pans by day
- Date strip: weekday label | date number | village count per day
- Accent band above strip = multi-day festival span (e.g. 馬蘭 7/3–7/11)
- Below strip: county chips + scrollable village cards for selected day

**Search tab**
- 48px search bar, accent border active, live results as you type
- Quick chips: 本週末 | 花蓮縣 | 臺東縣 | 已公告
- Results sorted soonest-first
- Tapping a card expands inline ceremony schedule (show only if `schedule` field exists — currently none, shows venue + source only)

**Info tab**
- No shared header — own layout
- Logo (60px circle) + title centered at top
- 2×2 stat tiles: 祭儀期間 / 覆蓋範圍 / confirmed count / last-updated date
- ⚠ warning box (Taitung social media caveat)
- Sources list

**Desktop**
- Sidebar (240px): logo, nav links (accent left-border = active), county + status filters, counts
- Center: full map (Timeline/Search replace it when those tabs are active)
- Right detail panel (440px): slides in on marker tap, shows township header + scrollable cards

---

## Known UI Modifications (Ben's)

- Shared header (logo+title left, theme toggle right) on Timeline, Map, Search — NOT Info
- Info tab has its own centered logo layout (wireframe spec)
- Remove redundant color status dots from cards (status conveyed by badge alone)
- _(add more here as phases progress)_

---

## Data Notes

- Ceremony schedule (per-hour times) not in `data.js` — expanded card shows venue + source only for now
- Multi-day date ranges: some exist in data (馬蘭 7/3–7/11); Timeline will parse `date` string for spans
- SW cache must be bumped after every deploy (currently `ilisin-v5`)
- **Coordinates are township-level centroids** — all villages in a township share one lat/lng point. Individual village coordinates needed before map is accurate. 臺東市 had individual coords but was normalized to centroid for visual consistency (originals preserved in git history).
