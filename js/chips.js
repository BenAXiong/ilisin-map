/* ═══════════════════════════════════════════════════
   FILTER CHIPS — shared DOM-sync mechanics for the
   single-select (map county/time/cluster, timeline
   county/township) and multi-select-with-exclusion
   (search) chip rows. Click delegation and filter state
   itself stay in each tab file — this only owns the
   repeated ".active" class bookkeeping.
   ═══════════════════════════════════════════════════ */

// Sets `.active` on exactly the chips in `container` matching `selector` for
// which `isActive(chip)` is true, clearing it from every other match first.
function syncActiveChips(container, selector, isActive) {
  container.querySelectorAll(selector).forEach(c => c.classList.toggle('active', isActive(c)));
}

// Toggles `key` in `stateSet` (a Set the caller owns) and syncs the clicked
// chip's `.active` class to match. If `key` belongs to one of
// `exclusionGroups` (an array of Sets), selecting it first evicts every other
// key already selected from that same group — both from `stateSet` and from
// that key's own chip's `.active` class, looked up via `[data-filter="k"]`
// inside `container`. Returns true if `key` ended up selected, false if it
// was deselected (e.g. to decide whether to fire an analytics event only on
// selection, not deselection).
function toggleChipInSet(stateSet, chip, key, container, chipSelector, exclusionGroups) {
  if (stateSet.has(key)) {
    stateSet.delete(key);
    chip.classList.remove('active');
    return false;
  }
  const group = exclusionGroups && exclusionGroups.find(g => g.has(key));
  if (group) {
    group.forEach(k => {
      if (k === key) return;
      stateSet.delete(k);
      container.querySelector(`${chipSelector}[data-filter="${k}"]`)?.classList.remove('active');
    });
  }
  stateSet.add(key);
  chip.classList.add('active');
  return true;
}
