// Detail pane: the full guide for one trophy — official description, the guide
// in this entry's own words, its steps, its sources as links, and the earned
// toggle. Spoiler-hidden story trophies show a placeholder here too.
import { isSpoilerHidden } from './filters.js';
import { gradeBadge, kindTag, difficultyTag, missableTag, countTag } from './checklist.js';

export function renderDetail(detailEl, trophy, allTrophies, earned, spoilerOn, sourceLinks, callbacks) {
  detailEl.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('div');
    empty.className = 'detail-empty';
    empty.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = 'Pick a trophy';
    const text = document.createElement('p');
    text.textContent = 'Click any trophy in the list to read its full guide here — what to do, when it can be missed, and where each fact comes from. Your progress is ticked off on the left and saved in this browser.';
    empty.append(title, text);
    detailEl.append(empty);
    return;
  }

  const hidden = isSpoilerHidden(trophy, earned, spoilerOn);
  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  detailEl.append(title);

  const facts = document.createElement('div');
  facts.className = 'detail-facts';
  facts.append(gradeBadge(trophy), kindTag(trophy), difficultyTag(trophy));
  if (trophy.missable) facts.append(missableTag(trophy));
  const count = countTag(trophy);
  if (count) facts.append(count);
  detailEl.append(facts);

  const official = document.createElement('p');
  official.className = 'detail-official';
  official.textContent = hidden
    ? 'Official name and description hidden while spoilers are on — earn it to reveal them.'
    : `Official description: “${trophy.description}”`;
  detailEl.append(official);

  if (trophy.missable && !hidden) {
    const box = document.createElement('div');
    box.className = 'missable-box';
    const strong = document.createElement('strong');
    strong.textContent = 'Possibly missable — read this first';
    const note = document.createElement('span');
    note.textContent = trophy.missableNote;
    box.append(strong, note);
    detailEl.append(box);
  }

  if (!hidden) {
    const guideSection = document.createElement('div');
    guideSection.className = 'detail-section';
    const guideHead = document.createElement('h3');
    guideHead.textContent = 'Guide';
    const guideText = document.createElement('p');
    guideText.textContent = trophy.guide;
    guideSection.append(guideHead, guideText);
    detailEl.append(guideSection);

    const stepsSection = document.createElement('div');
    stepsSection.className = 'detail-section';
    const stepsHead = document.createElement('h3');
    stepsHead.textContent = 'Steps';
    const stepsList = document.createElement('ol');
    for (const step of trophy.steps || []) {
      const li = document.createElement('li');
      li.textContent = step;
      stepsList.append(li);
    }
    stepsSection.append(stepsHead, stepsList);
    detailEl.append(stepsSection);
  }

  const sourcesSection = document.createElement('div');
  sourcesSection.className = 'detail-section';
  const sourcesHead = document.createElement('h3');
  sourcesHead.textContent = 'Sources';
  const sourcesList = document.createElement('ul');
  sourcesList.className = 'source-list';
  for (const source of trophy.sources || []) {
    const li = document.createElement('li');
    li.textContent = source;
    sourcesList.append(li);
  }
  for (const link of sourceLinks || []) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = link.label;
    li.append(a);
    sourcesList.append(li);
  }
  sourcesSection.append(sourcesHead, sourcesList);
  detailEl.append(sourcesSection);

  const honesty = document.createElement('p');
  honesty.className = 'honesty-note';
  honesty.textContent = 'Written for this guide, in its own words, from the official description. Anything the description does not pin down — a place, a trigger, a method — is flagged as not yet checked in the game rather than guessed at.';
  detailEl.append(honesty);

  const earnedRow = document.createElement('label');
  earnedRow.className = 'detail-earned';
  const earnedBox = document.createElement('input');
  earnedBox.type = 'checkbox';
  earnedBox.checked = earned.has(trophy.name);
  earnedBox.addEventListener('change', () => callbacks.onToggle(trophy, earnedBox.checked));
  earnedRow.append(earnedBox, document.createTextNode('Earned'));
  detailEl.append(earnedRow);

  const index = allTrophies.findIndex((t) => t.name === trophy.name);
  const nav = document.createElement('div');
  nav.className = 'detail-nav';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.textContent = '← Previous trophy';
  prev.disabled = index <= 0;
  prev.addEventListener('click', () => callbacks.onSelect(allTrophies[index - 1]));
  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next trophy →';
  next.disabled = index < 0 || index >= allTrophies.length - 1;
  next.addEventListener('click', () => callbacks.onSelect(allTrophies[index + 1]));
  nav.append(prev, next);
  detailEl.append(nav);
}
