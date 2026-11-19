// Checklist rendering: one card per trophy, with its official name, description
// and grade, its kind and difficulty, and its guide snippet. Spoiler-hidden
// story trophies show a placeholder instead of their name and description.
import { isSpoilerHidden } from './filters.js';

export function gradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = `badge badge-${trophy.grade}`;
  badge.textContent = trophy.grade;
  return badge;
}

export function kindTag(trophy) {
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = trophy.kind === 'side' ? 'Side strand' : trophy.kind;
  return tag;
}

export function difficultyTag(trophy) {
  const tag = document.createElement('span');
  tag.className = 'tag tag-difficulty';
  tag.textContent = `${trophy.difficulty} · ${trophy.time}`;
  return tag;
}

export function missableTag(trophy) {
  const tag = document.createElement('span');
  tag.className = 'tag tag-missable';
  tag.textContent = 'Missable';
  return tag;
}

export function countTag(trophy) {
  if (trophy.count == null) return null;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = `PSN tracks: ${trophy.count.toLocaleString('en-US')}`;
  return tag;
}

export function renderChecklist(listEl, trophies, earned, spoilerOn, selectedName, callbacks) {
  listEl.replaceChildren();
  if (trophies.length === 0) {
    const note = document.createElement('div');
    note.className = 'empty-note';
    note.textContent = 'No trophies match these filters. Try clearing the search or picking another kind — the official list has no online trophies, so the Online filter is always empty.';
    listEl.append(note);
    return;
  }
  for (const trophy of trophies) {
    const hidden = isSpoilerHidden(trophy, earned, spoilerOn);
    const card = document.createElement('article');
    card.className = 'trophy-card';
    if (earned.has(trophy.name)) card.classList.add('earned');
    if (trophy.name === selectedName) card.classList.add('selected');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Mark ${hidden ? 'this story trophy' : trophy.name} as earned`);
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => callbacks.onToggle(trophy, box.checked));

    const body = document.createElement('div');
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy' : trophy.name;
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = hidden
      ? 'Spoilers on — earn this story trophy to reveal its name and description.'
      : trophy.description;
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(gradeBadge(trophy), kindTag(trophy), difficultyTag(trophy));
    if (trophy.missable) meta.append(missableTag(trophy));
    const count = countTag(trophy);
    if (count) meta.append(count);
    body.append(name, desc, meta);
    if (!hidden) {
      const snippet = document.createElement('p');
      snippet.className = 'trophy-guide-snippet';
      snippet.textContent = trophy.guide;
      body.append(snippet);
    } else {
      const note = document.createElement('p');
      note.className = 'trophy-guide-snippet spoiler-hidden';
      note.textContent = 'Its guide stays hidden too until the trophy is earned.';
      body.append(note);
    }

    const side = document.createElement('div');
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'chip';
    openBtn.textContent = 'Guide';
    openBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      callbacks.onSelect(trophy);
    });
    side.append(openBtn);

    card.append(box, body, side);
    card.addEventListener('click', () => callbacks.onSelect(trophy));
    listEl.append(card);
  }
}
