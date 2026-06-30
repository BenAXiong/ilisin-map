# Handoff: Ilisin PWA — Full Redesign

## Overview

Ilisin is a Progressive Web App listing ~200 Amis / Pangcah (Indigenous Taiwanese) harvest festival ceremonies (豐年祭 / Ilisin) across Hualien and Taitung counties. The existing app (`index.html` + `data.js`) is a vanilla JS PWA using Leaflet for the map. This handoff documents a **full redesign from first principles** — new navigation architecture, new views (Calendar, Search), and significant UX improvements for elderly accessibility.

## About the Design Files

The file `Ilisin PWA Wireframes.dc.html` is a **low-fidelity wireframe** created as a design reference — not production code. It is an annotated, pannable canvas showing structure, layout hierarchy, interaction patterns, and component relationships for all screens.

Open it in a browser and **pan/drag** to explore. Sections are:
- **Top row (A):** 4 mobile screens — Map, Calendar, Search, Info
- **Middle (B):** Desktop layout
- **Bottom row (C):** 3 landing options (Option B is recommended and should be implemented)

Your task is to **implement these designs in the existing codebase** — or refactor it into a framework of your choice — applying the established color tokens, typography, and data structures from `data.js`.

## Fidelity

**Low-fidelity wireframes.** The wireframes show layout, information hierarchy, component structure, and interaction patterns. They use the existing color palette and typography as a guide. Apply final spacing, shadows, and polish during implementation — the wireframes are not pixel-perfect.

---

## Existing Codebase Context

The current app (`index.html` + `data.js` + `sw.js` + `manifest.json`) is a **single-file vanilla JS PWA**. Key facts:

- **Map:** Leaflet 1.9.4 + MarkerCluster 1.5.3 + CartoDB light tiles
- **Data:** `VILLAGES` array (~200 entries), `SOURCES` object, `GENERAL_NOTES` array, `DATA_NOTE` string — all in `data.js`
- **Current layout:** Fixed header → 42vh map → scrollable list below (mobile); side-by-side on desktop ≥768px
- **No existing:** tab navigation, calendar view, search view, bottom sheet

The redesign adds: bottom tab bar, Calendar view, Search view, true full-screen map with bottom sheet.

---

## Design Tokens (from existing codebase — keep these)

### Colors
```css
--bg:          #f0ead8   /* warm parchment — status bars, tab bar, sidebar */
--bg-alt:      #e8e0c8   /* slightly darker parchment */
--surface:     #faf6ee   /* card/sheet surface */
--amber:       #bf7e1a   /* primary accent — active states, selected markers */
--amber-pale:  #f2d48c
--amber-dark:  #7a4e0a   /* dates, secondary amber text */
--terra:       #9c3e18   /* Amis names, active/selected markers */
--terra-pale:  #e8b898
--green:       #3a7a3a   /* confirmed status dot */
--text-1:      #1c1508   /* primary text */
--text-2:      #5a4325   /* secondary text */
--text-3:      #9c845a   /* tertiary / placeholder text */
--border:      #ddd0b0
--border-2:    #c4ac80   /* stronger border, sheet tops */
```

### Typography
```css
--font-display: 'Fraunces', Georgia, serif        /* display headings */
--font-body:    'Noto Serif TC', serif             /* all Chinese body text */
--font-mono:    'Courier Prime', 'Courier New', monospace  /* dates, badges, labels */
```

Google Fonts import:
```
Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..400
Noto Serif TC:wght@300;400;600;700
Courier Prime
```

### Accessibility (elderly users — strict)
- **Village name:** ≥ 20px, font-weight 700, Noto Serif TC
- **Amis name:** 11px, Courier Prime, terra color
- **Date:** ≥ 14px bold, Courier Prime, amber-dark color
- **Body/venue text:** ≥ 13px, Noto Serif TC
- **All touch targets:** ≥ 48px height (tab bar items, bottom sheet handle, filter chips, day cells in date strip)
- **Status:** always text label + colored dot — never dot alone

### Status Colors
| Status | Dot color | Badge bg | Badge text |
|--------|-----------|----------|-----------|
| confirmed (已公告) | `#3a7a3a` | `rgba(58,122,58,.14)` | `#2a6a2a` |
| tbd (未定) | `#9c845a` | `rgba(156,132,90,.18)` | `#6a5218` |
| cancelled (停辦) | `#bbb` | `rgba(175,175,175,.22)` | `#888` |

---

## Navigation Architecture

### Mobile
**Bottom tab bar** (4 tabs, 84px tall incl. home indicator area):

| Tab | Label | Icon | Default open state |
|-----|-------|------|--------------------|
| 1 | 地圖 | Location pin | Map with collapsed bottom sheet |
| 2 | 行事曆 | Calendar | **Current week, today pre-selected** ← landing |
| 3 | 搜尋 | Magnifier | Empty search input |
| 4 | 資訊 | Info circle | Static info page |

**Default tab on app open: 行事曆 (Calendar), tab 2.** Today's date is pre-selected and today's village cards are shown immediately. This is Landing Option B from the wireframe.

Tab bar background: `--bg` (`#f0ead8`), border-top: `1.5px solid --border`. Active tab label and icon: `--amber`. Inactive: `--text-3`.

### Desktop (≥ 768px or ≥ 1024px recommended)
- **Persistent left sidebar** (240px): logo + nav links + filter section + counts
- **Center:** full-height map (Map view) or full-width content area (Calendar/Search/Info)
- **Right detail panel** (440px, slides in): shown when a marker or card is selected on the map. Hidden by default.
- No bottom tab bar on desktop — nav lives in sidebar.

---

## Screens / Views

### 01 · Map View

**Purpose:** Geographic discovery. User explores festivals by location, taps markers to learn about villages.

**Layout (mobile):**
- Full-screen Leaflet map (`position: fixed` or flex `flex: 1`, fills from status bar to tab bar)
- **County filter chips** floating on map — centered top, `position: absolute; top: 12px; left: 50%; transform: translateX(-50%)`. Pill container: `background: rgba(250,246,238,.9); backdrop-filter: blur(4px); padding: 5px 8px; border-radius: 99px; box-shadow: 0 2px 12px rgba(0,0,0,.13)`. Chips inside: see Filter Chips spec below.
- **Zoom controls** (Leaflet default, top-right): `background: --surface; border: 1px solid --border-2; border-radius: 5px`
- **Bottom sheet:** `position: absolute; left: 0; right: 0; bottom: 0; background: --surface; border-radius: 18px 18px 0 0; border-top: 2px solid --border-2; box-shadow: 0 -6px 28px rgba(0,0,0,.14)`

**Bottom sheet — 3 states:**

| State | Height | Trigger |
|-------|--------|---------|
| Collapsed | ~50px (handle + label only) | Default / swipe down / deselect |
| Half-open | ~280px (1 village card visible) | Tap single marker |
| Full-open | ~686px (all nearby cards, scrollable) | Swipe up from half-open |

- **Handle:** centered pill `width: 42px; height: 4px; border-radius: 99px; background: --border-2; margin: 10px auto 6px`
- **Collapsed label:** `"本週 · N場已確認 · 拉起查看"`, Noto Serif TC 12px, `--text-3`
- **Half-open content:** Single village card (see Village Card spec). Below card: `"↑ 向上滑動 · N個部落"` in Courier Prime 10.5px, `--text-3`

**Map markers:**
```js
// Confirmed
{ color: '#bf7e1a', size: 12px }
// TBD
{ color: '#9c845a', size: 11px }
// Cancelled
{ color: '#bbb', size: 10px }
// Active/selected (terra, larger)
{ color: '#9c3e18', size: 17px, boxShadow: '0 2px 14px rgba(156,62,24,.45)', transform: 'scale(1.15)' }
```

All markers: `border: 2px solid rgba(255,251,240,.92); border-radius: 50%`

**Cluster style (MarkerCluster):**
- Outer ring: `background: rgba(191,126,26,.16); border: 1.5px solid rgba(191,126,26,.3)`
- Inner circle: `background: rgba(191,126,26,.82); color: #fff; font: 700 10px Courier Prime`

**Map popup (shown above tapped marker):**
- Background: `--surface`, border: `1px solid --border-2`, border-radius: 5px
- Content: Chinese name (700 13px Noto Serif TC), Amis + township (400 11px Courier Prime, --text-2), date (700 11px Courier Prime, --amber)
- Triangle pointer below popup

**Desktop map:** Same markers, no floating chips (filter is in sidebar), no bottom sheet — clicking marker highlights card in detail panel and scrolls to it.

---

### 02 · Calendar / Timeline View

**Purpose:** Temporal discovery. User browses festivals by date, sees the full season, finds what's on a specific day.

**Layout (mobile), top to bottom:**

1. **Month tabs** (44px tall): 4 tabs — `6月 | 7月 | 8月 | 9月`. Active tab: `--amber` color, `border-bottom: 2.5px solid --amber`, font-weight 700. Background: `--bg`. Inactive: `--text-3`, weight 400. Font: Noto Serif TC 13px.

2. **Week navigation** (42px tall): `← [Month Day – Month Day] →`. Center text: Noto Serif TC 500 13px, `--text-1`. Arrows: 32×32px circles, `background: --surface; border: 1px solid --border`. Background: `--bg`, border-bottom: `1px solid --border`.

3. **Date strip** (78px tall): Horizontal row of day cells, scrollable (overflow-x: auto, snap). Background: `--bg`, border-bottom: `1.5px solid --border`.

   **Date strip anatomy (78px height):**
   - **Top band (22px):** Multi-day festival spans. `border-bottom: 1px solid rgba(232,224,200,.8)`. Each span: `position: absolute; height: 16px; top: 3px; background: rgba(191,126,26,.14); border: 1px solid rgba(191,126,26,.28); border-radius: 8px`. Span label: Courier Prime 600 8.5px, `--amber`.
   - **Day cells (56px):** Each cell `width: 44px; flex-shrink: 0; border-right: 1px solid #e8e0c8`. Content (top-to-bottom): day-of-week label (system-ui 400 9px, `--text-3`), day number (system-ui 700 16px, `--text-1`), event count (system-ui 700 9px, `--amber`; `—` if zero events).

   **Selected day cell:** `background: rgba(191,126,26,.12); border-bottom: 2.5px solid --amber`. All text: `--amber`. Day-of-week may say "今天" if it's today.

   **Multi-day span positioning:** `left = cellIndex × 44px`, `width = spanDays × 44px`. Spans float in the top 22px band only.

   **Scroll fade:** right edge fade `background: linear-gradient(to right, transparent, rgba(240,234,216,.95))` with `›` arrow, `width: 28px`.

4. **Selected day header** (40px): `"M月D日 週X"` left, `"N 部落"` right. Padding: `10px 16px 6px`. Font: Noto Serif TC 700 14px / Courier Prime 400 11px `--text-3`.

5. **County filter chips row** (32px + padding): `全部 | 花蓮縣 | 臺東縣`. See Filter Chips spec.

6. **Village cards list** (flex: 1, overflow-y: auto): Cards for the selected day. See Village Card spec. Gap: 8px, padding: 0 14px.

**Default state on open:** Current date pre-selected. Month tab = current month. Week showing current week. Cards = today's festivals.

**Interactions:**
- Tap month tab → jump to that month, show first week, select first day with events
- Tap `←` / `→` → advance/retreat by 7 days
- Swipe date strip left/right → pan by 1 day at a time (scroll-snap: mandatory)
- Tap day cell → update selected day + card list below
- Tap multi-day festival band → select the start day of the span + highlight all spanned cells

---

### 03 · Search View

**Purpose:** Direct lookup by village name (Chinese or Amis) or township name.

**Layout (mobile), top to bottom:**

1. **Search bar area** (fixed, ~106px): background `--bg`, border-bottom `1.5px solid --border`.
   - **Input** (48px tall): `background: #fff; border: 2px solid --amber; border-radius: 10px; padding: 0 12px`. Left icon: magnifier SVG `--amber`. Text: Noto Serif TC 400 16px, `--text-1`. Clear button (✕) right side when text present.
   - **Quick chip row** (below input): `本週末 | 花蓮縣 | 臺東縣 | 已公告`. See Filter Chips spec.

2. **Results header** (24px + padding): `"[query term] · N 部落"`, Courier Prime 500 12px, `--text-3`.

3. **Results list** (flex: 1, overflow-y: auto): Village cards in date order (soonest first). See Village Card spec. One card may be in **expanded state** showing ceremony schedule.

**Search behavior:**
- Live filter on every keystroke — no submit button
- Searches: `village.chinese`, `village.amis`, `village.township` (case-insensitive)
- Sort: confirmed first, then TBD, then cancelled; within group: ascending date
- Empty state: `"找不到「X」— 試試鄉鎮名稱或 Amis 名"` centered, Noto Serif TC 14px `--text-3`

**Expanded card (ceremony schedule):**
Triggered by tapping `"祭儀日程 ▾"` link. Inside the card, below venue:
```
[Box: background: rgba(240,234,216,.7); border: 1px solid --border; border-radius: 5px; padding: 10px 12px]
  Header: "祭儀日程 · Schedule"  Courier Prime 600 9.5px --amber  letter-spacing .06em
  Rows: [time  Courier Prime 500 11px --amber-dark  width 35px] [description  Noto Serif TC 400 12px --text-1]
  Row gap: 5px
```

---

### 04 · Info / About View

**Purpose:** Context about the festival, data freshness warning, sources list. Static content.

**Layout (mobile), top to bottom:**

1. **Logo + title header** (background: `--bg`, border-bottom: `1.5px solid --border`):
   - Logo: `logo.png`, 60×60px, `border-radius: 50%; object-fit: cover`
   - Title: `"豐年祭地圖"` Noto Serif TC 700 22px `--text-1`
   - Subtitle: `"ILISIN 2026 · PANGCAH"` Courier Prime 400 11px `--amber` letter-spacing .06em
   - Tagline: `"花東阿美族歲時祭儀 · 200+ 部落"` Noto Serif TC 400 12px `--text-2`

2. **Info tiles** (2×2 grid, `gap: 8px`, `padding: 14px`): Each tile: `background: --surface; border: 1px solid --border; border-radius: 6px; padding: 12px; text-align: center`.
   - 📅 祭儀期間 / 6月 — 9月
   - 🗺 覆蓋範圍 / 花蓮縣 · 臺東縣
   - ✓ 已公告部落 / **147** (Courier Prime 700 18px)
   - ⟳ 資料更新 / 2026-06-22 (Courier Prime 600 12px)
   - Label: Courier Prime 600 10px `--amber` uppercase letter-spacing .06em
   - Value: Noto Serif TC 600 13px `--text-1`

3. **Data freshness warning** (`margin: 0 14px; padding: 12px; background: #fff8ec; border: 1.5px solid #e8c870; border-radius: 6px`):
   - Header: `"⚠ 資料說明"` Courier Prime 600 10px `#7a5010`
   - Body: `"臺東部分資料來自社群貼文，正式出行前請向部落或公所再確認。"` Noto Serif TC 400 12px/1.6 `#5a3a08`

4. **Sources list** (`padding: 12px 14px`):
   - Section label: Courier Prime 600 10px `--text-3` uppercase letter-spacing .1em
   - Items: `"→ 花蓮縣原民處官方 PDF 2026"` etc. Noto Serif TC 400 12px `--text-2`. Each is a tappable link.

---

### 05 · Desktop Layout

**Purpose:** Larger screen layout with persistent navigation. Map and detail can be seen simultaneously.

**Layout:** Three-column flex row, `height: 100vh`.

**Column 1 — Sidebar (240px, flex-shrink: 0):**
- Background: `--bg`, border-right: `1.5px solid --border`
- **Logo area** (padding 20px 18px 16px, border-bottom): logo 36×36px + title/subtitle
- **Nav links** (padding 10px 0, border-bottom): 4 items, 48px tall each, padding 12px 18px. Active: `background: rgba(191,126,26,.1); border-left: 3px solid --amber; color: --amber; font-weight: 700`. Inactive: `color: #7a5820; font-weight: 400`. Font: Noto Serif TC 15px.
- **Filter section** (padding 14px 16px, border-bottom): 縣市 chips + 狀態 chips. Section labels: Courier Prime 600 10px `--text-3` uppercase.
- **Count section** (padding 14px 16px): rows of `[label Noto Serif TC 400 12px] [count Courier Prime 700 13px]` for 已公告 (green), 未定 (amber-dark), 停辦 (--border).

**Column 2 — Map (flex: 1):**
- Leaflet map, full height
- No floating filter chips (filter is in sidebar)
- Zoom controls top-right
- Clicking a marker highlights it and opens Column 3

**Column 3 — Detail panel (440px, slides in from right):**
- `display: none` by default; `display: flex; flex-direction: column` when a township is selected
- Background: `rgba(248,244,236,1)`, border-left: `1.5px solid --border`
- **Header** (padding 16px 18px 12px, background `--bg`, border-bottom): township name Noto Serif TC 700 17px + `"花蓮縣 · N 部落"` Courier Prime 400 11px `--text-3` + close `✕` button right
- **Card list** (flex: 1, overflow-y: auto, padding 12px, gap 8px): Village cards. See Village Card spec. Active card has `border-left: 4px solid --amber`.

**Calendar / Search / Info on desktop:** Replace Column 2+3 with a full-width content area. Sidebar nav stays visible.

---

## Shared Components

### Village Card

```
[Container]
  border: 1px solid --border
  border-radius: 6px
  background: --surface
  padding: 12px 14px

[Row: gap 10px, align flex-start]
  [Status dot: 9×9px circle, margin-top 7px, flex-shrink 0]
    confirmed → #3a7a3a
    tbd → #9c845a
    cancelled → #bbb

  [Body: flex 1]
    [Row: space-between, align flex-start]
      [Names]
        Village Chinese name: Noto Serif TC 700 20px/1.25 --text-1  ← LARGE for elderly
        Amis name: Courier Prime 400 11px --terra, margin-top 3px

      [Date + badge, text-right, flex-shrink 0]
        Date: Courier Prime 700 13-15px --amber-dark
        Status badge: display block, margin-top 3px

    Venue: Noto Serif TC 400 13px/1.4 --text-2, margin-top 5px

    [Footer row: space-between, margin-top 10px, padding-top 8px, border-top 1px solid rgba(232,224,200,1)]
      Source link: Courier Prime 400 11px --text-3, "↗ [Source label]"
      Expand ceremonies: Courier Prime 600 11px --amber, "祭儀日程 ▾" (if ceremonies exist)

[Active card modifier]
  border-left: 4px solid --amber
  background: #fffbf0
```

### Filter Chips

```
Active chip:
  background: --amber; border: 1.5px solid --amber; color: #fff
  font: system-ui 600 10px; padding: 4px 11px; border-radius: 99px

Inactive chip:
  background: rgba(250,246,238,.92); border: 1.5px solid #c4b080; color: #7a5820
  font: system-ui 500 10px; padding: 4px 11px; border-radius: 99px
```

---

## Data Structure (from `data.js`)

```js
// Each village entry
{
  id: 'hl-ja-01',            // unique ID
  chinese: '慶豐部落',        // Chinese name
  amis: 'Ciripunan',         // Amis name (may be empty string)
  county: '花蓮縣',           // '花蓮縣' | '臺東縣'
  township: '吉安鄉',         // township name
  lat: 23.956,               // latitude (approx township-level)
  lng: 121.570,              // longitude
  date: '8/1 六',            // display date string; '未定' | '停辦' for non-confirmed
  venue: '慶豐部落聚會所',     // venue name; '—' if none
  status: 'confirmed',       // 'confirmed' | 'tbd' | 'cancelled'
  src: 'hl_pdf'              // key into SOURCES object
}

// Source lookup
SOURCES['hl_pdf'] = { label: '花蓮縣原民處 PDF 2026', url: 'https://...' }

// General notes array (4 items used in Info view)
GENERAL_NOTES = [{ icon, label, text }, ...]

// Data note string (used in warning box)
DATA_NOTE = '...'
```

**Date parsing:** The `date` field is a display string (e.g., `"8/22 六"`, `"7/26 日"`). For Calendar view, parse month/day from this string to determine which day cell a village belongs to. Treat `"未定"` and `"停辦"` as non-date values. Some entries may have date ranges like `"8/1–8/3"` — parse the start date for positioning, span for multi-day display.

Multi-day ceremony details (if added to data): each village optionally has a `ceremonies` array:
```js
ceremonies: [
  { time: '08:00', description: '報到・集合' },
  { time: '09:00', description: '主祭儀式・男子舞蹈' },
  { time: '12:00', description: '共食・感恩' }
]
```

---

## Interactions & Behavior

### Map
- **Cluster tap:** Leaflet MarkerCluster default (zoom in + spiderfy at max zoom). `maxClusterRadius: 40`, `spiderfyOnMaxZoom: true`, `showCoverageOnHover: false`
- **Single marker tap:** Pan map to marker, show popup above marker, open bottom sheet to half-open state with that village's card
- **Bottom sheet swipe up:** Expand to full-open (all villages in current cluster/area)
- **Bottom sheet swipe down:** Collapse. If half-open → collapsed; if full-open → half-open
- **Deselect:** Tap anywhere on map (not a marker) → collapse sheet, deselect marker

### Calendar Date Strip
- **Day tap:** Update selected day state, update card list below
- **Swipe left/right on strip:** Pan by 1 day, scroll-snap to cells
- **Week arrow tap:** Jump ±7 days, keep selected day relative or snap to first day of new week
- **Multi-day band tap:** Select first day of span, highlight all spanned cells with band background `rgba(191,126,26,.06)`
- **Month tab tap:** Jump to first day of that month with events

### Search
- **Keystroke:** Debounce ~150ms, filter `VILLAGES` array, re-render results
- **Chip tap:** Apply/toggle filter, combine with text query
- **Card "祭儀日程 ▾" tap:** Toggle expanded ceremony schedule inline. Rotate chevron 180°.
- **Result card tap:** Navigate to Map view, select and pan to that marker

### Desktop Detail Panel
- **Marker tap / card tap:** Slide in detail panel (CSS transition: `transform: translateX(0)` from `translateX(100%)`), 200ms ease-out
- **Close (✕):** Slide out, deselect marker
- **Card click within panel:** Pan map to that village's marker, highlight it

---

## State Management

```
globalState = {
  // Map
  activeVillageId: null | string,
  mapCenter: [23.35, 121.32],
  mapZoom: 9,
  countyFilter: 'all' | 'hualien' | 'taitung',
  statusFilter: 'all' | 'confirmed' | 'tbd' | 'cancelled',
  sheetState: 'collapsed' | 'half' | 'full',

  // Calendar
  selectedMonth: 7,           // 6–9
  selectedWeekStart: Date,    // Monday of displayed week
  selectedDate: Date,         // null = no day selected (shouldn't happen on load)

  // Search
  searchQuery: '',
  searchCountyFilter: 'all' | 'hualien' | 'taitung',
  searchStatusFilter: 'all' | 'confirmed' | 'tbd' | 'cancelled',
  expandedCeremonyCardId: null | string,

  // Navigation
  activeTab: 'map' | 'calendar' | 'search' | 'info',  // default: 'calendar'
}
```

**Persistence:** Store `mapCenter`, `mapZoom`, `selectedDate`, `activeTab`, `countyFilter` in `localStorage`. Restore on app load.

---

## PWA Requirements (preserve from existing)

- `manifest.json` — keep as-is (name, colors, icons)
- `sw.js` — keep service worker for offline caching
- `<meta name="theme-color" content="#bf7e1a">` — keep
- Install prompt button (hidden until `beforeinstallprompt` fires) — keep

---

## Assets

| File | Use |
|------|-----|
| `logo.png` | Circular braided millet motif, 512×512px. Used in tab bar active state (consider), sidebar header, Info view header. Always `border-radius: 50%; object-fit: cover`. |
| `icon.svg` | PWA icon (manifest). |

---

## Files in This Package

| File | Description |
|------|-------------|
| `Ilisin PWA Wireframes.dc.html` | Pannable wireframe canvas — open in browser, drag to explore |
| `logo.png` | App logo asset |
| `README.md` | This document |

**Source codebase files** (in the user's local folder `豐年祭 地圖/`, not in this package):
- `index.html` — existing single-file app (417 lines)
- `data.js` — all village data, sources, notes (295 lines)
- `sw.js` — service worker
- `manifest.json` — PWA manifest

---

## Implementation Notes

1. **Data.js is the source of truth.** Don't change the data schema unless adding `ceremonies` array to individual village entries.

2. **Calendar date parsing:** The `date` field is a human-readable string. Write a robust parser that handles `"8/1 六"`, `"8/22–8/24"`, `"未定"`, `"停辦"`, `"8/29 六（暫定）"`.

3. **Leaflet stays.** The map library is appropriate and working. Preserve CartoDB light tiles and MarkerCluster. Only change the CSS overrides for cluster and popup styling.

4. **Bottom sheet gesture:** Use `touchstart`/`touchmove`/`touchend` to detect swipe direction and velocity. A simple threshold (>50px vertical movement) is sufficient.

5. **Desktop breakpoint:** `@media (min-width: 768px)` matches existing code. Consider raising to `1024px` for a proper 3-column layout.

6. **Elderly accessibility checks:** After implementation, verify that all interactive elements (day cells, tab bar, chips, sheet handle, cards) have ≥ 48×48px tap targets. Run with browser accessibility tools.
