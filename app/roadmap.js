// Roadmap and missables views, built from the official descriptions: the
// stages follow the story order the descriptions give, and the missable flags
// are the ones in the trophy data, each with its reason.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Play the story',
    text: 'Start with Gone Fishing and play the story missions in order through Chapters 1 to 4 and the final mission. This stage alone earns the opening trophy, the four chapter trophies, the six named mission trophies and the gold for the final mission — 12 trophies.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    stage: 2,
    title: 'Contacts and strangers',
    text: 'Between story missions, work the side strands: the final missions for Andy, Kenton, Billy, Randy and Tyrone, the hunt for Bret, and 8 stranger strands across Leonida. Start these early — the strangers are scattered across the map, and finishing eight full chains takes a while.',
    ids: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    stage: 3,
    title: 'See all of Leonida',
    text: 'Explore the map and collect as you go: all 52 areas, 100 vehicles, 8 garage properties, 10 Scooter Bros registrations, 18 meditation spots, 3 card sets and WAiNK at 100 locations. Fold this into stages 1 and 2 — stop at a new area, vehicle or spot whenever you pass one.',
    ids: [28, 30, 31, 35, 42, 54, 55],
  },
  {
    stage: 4,
    title: 'Activities and skills',
    text: 'The skill and activity trophies: 250 stunts, gold in all 42 Shooting Range challenges, a drone race win at all 14 locations, 20 different race wins, the fishing challenge against Cal, one arcade game, bowling, a cocktail on Ocean Beach and 50 challenges. The shooting range golds are the hardest skill test on the list — leave them for a focused session.',
    ids: [15, 16, 17, 18, 19, 20, 21, 32, 44, 46],
  },
  {
    stage: 5,
    title: 'Partner, heat and heists — before the finale',
    text: 'Do the partner trophies while the story still pairs you up: lose a 4-star wanted level with your partner, and rob 3 shops back-to-back without losing the heat. Then the heists and one-off feats: 5 bank vaults, an armored truck, the undetected jewelry store, one illegal operation per gang, 5 enemies in one Combat Focus, the VCIA departure, the Rhino trophy, the showroom smash and the melee drive-by.',
    ids: [33, 34, 36, 37, 38, 39, 40, 41, 43, 45, 51],
  },
  {
    stage: 6,
    title: 'Money, choices and 100%',
    text: 'Last comes the long tail: launder $250,000 of Marked Bills, spend $100,000 across the shops, and reach 500 choices — keep choosing at every chance from the start, because choices may stop coming late in the story. Then check the game\'s completion stat and clear whatever is left for 100% completion, and the platinum pops with it.',
    ids: [47, 48, 49, 50, 52, 53, 14, 1],
  },
];

export function renderRoadmap(viewEl, trophies, earned) {
  viewEl.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'view-intro';
  intro.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = 'Roadmap to the platinum. ';
  const rest = document.createTextNode(
    'Six stages, built from the official descriptions: the story first, then the side strands, then the map, then the activities, then the partner and heist trophies before the finale, and the long money-and-choices tail last. Each stage lists the trophies it earns.',
  );
  intro.append(strong, rest);
  viewEl.append(intro);

  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP_STAGES) {
    const box = document.createElement('section');
    box.className = 'stage';
    const head = document.createElement('h3');
    head.textContent = `Stage ${stage.stage} — ${stage.title}`;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const done = stage.ids.filter((id) => byId.get(id) && earned.has(byId.get(id).name)).length;
    const progress = document.createElement('p');
    progress.className = 'stage-progress';
    progress.textContent = `${done} of ${stage.ids.length} earned in this stage`;
    const list = document.createElement('ul');
    list.className = 'stage-trophies';
    for (const id of stage.ids) {
      const trophy = byId.get(id);
      if (!trophy) continue;
      const li = document.createElement('li');
      li.textContent = `${earned.has(trophy.name) ? '✓ ' : ''}${trophy.name} — ${trophy.grade}`;
      list.append(li);
    }
    box.append(head, text, progress, list);
    viewEl.append(box);
  }
}

export function renderMissables(viewEl, trophies, earned) {
  viewEl.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'view-intro';
  const strong = document.createElement('strong');
  strong.textContent = 'Missable trophies — 7 of 55. ';
  const rest = document.createTextNode(
    'These are the trophies the official descriptions suggest you can miss: they need your partner beside you, a choice you can stop being offered, a second attempt, or a rare event. The flags are inferred from the descriptions, not confirmed inside the game — the game is a day old and no guide has played it through yet. Two habits cover most of the risk: make a manual save before the final mission, and do the partner trophies while the story still pairs you up.',
  );
  intro.append(strong, rest);
  viewEl.append(intro);

  const flagged = trophies.filter((t) => t.missable);
  for (const trophy of flagged) {
    const box = document.createElement('section');
    box.className = 'missable-entry';
    const head = document.createElement('h3');
    head.textContent = `${earned.has(trophy.name) ? '✓ ' : ''}${trophy.name} — ${trophy.grade}`;
    const desc = document.createElement('p');
    desc.textContent = trophy.description;
    const why = document.createElement('p');
    const whyStrong = document.createElement('strong');
    whyStrong.textContent = 'Why it can be missed: ';
    why.append(whyStrong, document.createTextNode(trophy.missableNote));
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    box.append(head, desc, why, guide);
    viewEl.append(box);
  }

  const safe = document.createElement('p');
  safe.className = 'view-intro';
  safe.textContent = 'Everything else is safe: story and chapter trophies pop from finishing the story, and the collectible, activity and grind trophies can all be done in free roam after the story ends.';
  viewEl.append(safe);
}
