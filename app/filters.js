// Filter logic: kind chips, grade, earned state, text search, and the spoiler
// rule. Kept apart from rendering so the list and the roadmap share it.
export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  side: 'Side strands',
  online: 'Online',
};

// The official list holds no online trophy: everything here is earned solo.
export function isOnlineTrophy() {
  return false;
}

// A trophy is hidden by the spoiler setting when it is a story trophy the
// player has not earned yet. Earned story trophies always show.
export function isSpoilerHidden(trophy, earned, spoilerOn) {
  if (!spoilerOn) return false;
  if (trophy.kind !== 'story') return false;
  return !earned.has(trophy.name);
}

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return isOnlineTrophy(trophy);
  return trophy.kind === kind;
}

export function matchesSearch(trophy, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    trophy.name,
    trophy.description,
    trophy.guide,
    trophy.kind,
    trophy.grade,
    ...(trophy.steps || []),
  ].join(' ').toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function filterTrophies(trophies, earned, state) {
  return trophies.filter((t) => {
    if (!matchesKind(t, state.kind)) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.showState === 'earned' && !earned.has(t.name)) return false;
    if (state.showState === 'todo' && earned.has(t.name)) return false;
    if (!matchesSearch(t, state.query)) return false;
    return true;
  });
}
