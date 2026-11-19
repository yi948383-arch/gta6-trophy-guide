// Boot: loads the trophy data, owns the page state, and renders the shell —
// progress header, filters, checklist, roadmap, missables and detail pane.
// The app fetches one local file, data/trophies.json, and nothing else.
import { loadEarned, saveEarned, demoSeedNames, exportProgress, parseProgressFile, gradeCounts } from './store.js';
import { filterTrophies, KIND_LABELS } from './filters.js';
import { renderChecklist } from './checklist.js';
import { renderDetail } from './detail.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const SPOILER_KEY = 'gta6-trophy-spoiler';

const state = {
  kind: 'all',
  grade: 'all',
  showState: 'all',
  query: '',
  spoilerOn: false,
  view: 'checklist',
  selectedId: null,
};

let trophies = [];
let sourceLinks = [];
let earned = new Set();

const $ = (id) => document.getElementById(id);

function applyDemoSeed() {
  const params = new URLSearchParams(location.search);
  if (params.get('demo') !== 'seed') return;
  if (earned.size > 0) return;
  earned = new Set(demoSeedNames(trophies));
  saveEarned(earned);
}

function applySpoilerParam() {
  const params = new URLSearchParams(location.search);
  if (params.get('spoiler') === '1') {
    state.spoilerOn = true;
    return;
  }
  try {
    state.spoilerOn = localStorage.getItem(SPOILER_KEY) === '1';
  } catch {
    state.spoilerOn = false;
  }
}

function parseHash() {
  const hash = location.hash || '#/';
  const parts = hash.slice(2).split('/');
  if (parts[0] === 'roadmap') return { view: 'roadmap', selectedId: null };
  if (parts[0] === 'missables') return { view: 'missables', selectedId: null };
  if (parts[0] === 'trophy' && parts[1]) {
    const id = Number(parts[1]);
    return { view: 'checklist', selectedId: Number.isInteger(id) ? id : null };
  }
  return { view: 'checklist', selectedId: null };
}

function selectedTrophy() {
  if (state.selectedId == null) return null;
  return trophies.find((t) => t.id === state.selectedId) || null;
}

function renderProgress() {
  $('earnedCount').textContent = String(earned.size);
  const pct = Math.round((earned.size / trophies.length) * 100);
  $('progressFill').style.width = `${pct}%`;
  $('progressNote').textContent = `${pct}% to the platinum · ${trophies.length - earned.size} to go`;
  const counts = gradeCounts(trophies, earned);
  $('gradeCounts').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${g} ${counts[g][0]}/${counts[g][1]}`)
    .join(' · ');
  $('missableCount').textContent = String(trophies.filter((t) => t.missable).length);
}

function renderTabs() {
  $('tabChecklist').classList.toggle('active', state.view === 'checklist');
  $('tabRoadmap').classList.toggle('active', state.view === 'roadmap');
  $('tabMissables').classList.toggle('active', state.view === 'missables');
}

function renderMain() {
  const listEl = $('trophyList');
  const roadmapEl = $('roadmapView');
  const missablesEl = $('missablesView');
  const layout = document.querySelector('.layout');
  const detailPane = $('detailPane');

  if (state.view === 'roadmap') {
    listEl.hidden = true;
    roadmapEl.hidden = false;
    missablesEl.hidden = true;
    layout.classList.add('single-column');
    detailPane.hidden = true;
    renderRoadmap(roadmapEl, trophies, earned);
    $('listStatus').textContent = 'Six stages from the first mission to the platinum.';
    return;
  }
  if (state.view === 'missables') {
    listEl.hidden = true;
    roadmapEl.hidden = true;
    missablesEl.hidden = false;
    layout.classList.add('single-column');
    detailPane.hidden = true;
    renderMissables(missablesEl, trophies, earned);
    $('listStatus').textContent = '7 trophies flagged as possibly missable, each with its reason.';
    return;
  }

  listEl.hidden = false;
  roadmapEl.hidden = true;
  missablesEl.hidden = true;
  layout.classList.remove('single-column');
  detailPane.hidden = false;

  const visible = filterTrophies(trophies, earned, state);
  $('listStatus').textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earned.size} earned`;
  const selected = selectedTrophy();
  renderChecklist(listEl, visible, earned, state.spoilerOn, selected ? selected.name : null, {
    onToggle: toggleEarned,
    onSelect: selectTrophy,
  });
  renderDetail($('detailBody'), selected, trophies, earned, state.spoilerOn, sourceLinks, {
    onToggle: toggleEarned,
    onSelect: selectTrophy,
  });
}

function render() {
  renderProgress();
  renderTabs();
  renderMain();
}

function toggleEarned(trophy, checked) {
  if (checked) earned.add(trophy.name);
  else earned.delete(trophy.name);
  saveEarned(earned);
  render();
}

function selectTrophy(trophy) {
  if (!trophy) return;
  location.hash = `#/trophy/${trophy.id}`;
}

function wireToolbar() {
  document.querySelectorAll('#kindChips .chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.kind === state.kind);
    chip.addEventListener('click', () => {
      state.kind = chip.dataset.kind;
      document.querySelectorAll('#kindChips .chip').forEach((c) =>
        c.classList.toggle('active', c === chip));
      renderMain();
    });
  });
  $('grade').addEventListener('change', (e) => {
    state.grade = e.target.value;
    renderMain();
  });
  $('showState').addEventListener('change', (e) => {
    state.showState = e.target.value;
    renderMain();
  });
  $('search').addEventListener('input', (e) => {
    state.query = e.target.value;
    renderMain();
  });
  const spoilerBox = $('spoiler');
  spoilerBox.checked = state.spoilerOn;
  spoilerBox.addEventListener('change', () => {
    state.spoilerOn = spoilerBox.checked;
    try {
      localStorage.setItem(SPOILER_KEY, state.spoilerOn ? '1' : '0');
    } catch {
      // Storage unavailable: the setting just lasts for this visit.
    }
    renderMain();
  });
}

function wireFooter() {
  $('exportBtn').addEventListener('click', () => exportProgress(earned));
  $('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      earned = parseProgressFile(await file.text());
      saveEarned(earned);
      render();
    } catch {
      alert('That file is not a trophy progress export from this guide.');
    }
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies? This cannot be undone — export first if you want a copy.')) return;
    earned = new Set();
    saveEarned(earned);
    render();
  });
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  trophies = doc.trophies || doc;
  sourceLinks = doc.sourceLinks || [];
  earned = loadEarned();
  applyDemoSeed();
  applySpoilerParam();
  const route = parseHash();
  state.view = route.view;
  state.selectedId = route.selectedId;
  window.addEventListener('hashchange', () => {
    const next = parseHash();
    state.view = next.view;
    state.selectedId = next.selectedId;
    render();
  });
  wireToolbar();
  wireFooter();
  render();
}

boot();
