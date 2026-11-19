// Progress store: the earned set lives in localStorage under one key, so the
// checklist survives reloads. Export writes it to a JSON file; import reads one
// back. Nothing leaves the browser.
export const STORE_KEY = 'gta6-trophy-guide-v1';

// The demo seed: 13 trophies a player plausibly holds mid-story. Only used when
// the page is opened with ?demo=seed and no saved progress exists yet — it lets
// screenshots show the tracker with progress on it.
export const DEMO_SEED_IDS = [2, 3, 4, 5, 8, 9, 10, 11, 16, 21, 44, 46, 51];

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => typeof n === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...earned]));
  } catch {
    // Private mode or full storage: progress just does not persist.
  }
}

// Names the demo seed applies to, once the trophy list is loaded. Used by the
// boot code when the page is opened with ?demo=seed and no saved progress exists.
export function demoSeedNames(trophies) {
  const byId = new Map(trophies.map((t) => [t.id, t.name]));
  return DEMO_SEED_IDS.map((id) => byId.get(id)).filter(Boolean);
}

export function exportProgress(earned) {
  const payload = {
    guide: 'Leonida Legend — GTA VI trophy progress',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function parseProgressFile(text) {
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  return new Set(names.filter((n) => typeof n === 'string'));
}

export function gradeCounts(trophies, earned) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    if (!counts[t.grade]) counts[t.grade] = [0, 0];
    counts[t.grade][1] += 1;
    if (earned.has(t.name)) counts[t.grade][0] += 1;
  }
  return counts;
}
