[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/yi948383-arch/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/yi948383-arch/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

Entry for make.fun bounty `gta6-trophy-guide-01`: an offline web app that
guides and tracks all 55 PlayStation 5 trophies of Grand Theft Auto VI —
every official name, description and grade, a checklist with progress saved
in the browser, a six-stage roadmap to the platinum, the 7 possibly-missable
trophies flagged with their reasons, and a guide for every trophy written
for this entry, in its own words, with its sources named.

## Run

```sh
node serve.ts            # serves app/ on http://localhost:8080
```

Open `app/index.html` in desktop Chrome. No build step, no network: every
file the app loads is a file under `app/`, and it works with the network off.
Progress is saved in localStorage; export it to a JSON file and import it
back from the footer.

## What is in the guide

- **Checklist** — all 55 trophies with official name, description and grade,
  kind (story / side strand / collectible / activity), difficulty and time
  estimate, and the PSN progress target where PSN tracks one (for example 42
  Shooting Range challenges, 100 WAiNK locations, 52 areas of Leonida).
  Tick a trophy off and it stays ticked.
- **Guide for every trophy** — what to do, in what order, and when it can be
  missed, written for this entry from the official description alone. Each
  guide names its sources: the official list on Exophase (name, description,
  grade), PSNProfiles (PSN progress targets), and this entry's own advice.
  Where the official description does not pin down a place, a trigger or a
  method, the guide says so instead of guessing — see Challenging Tank,
  Personal Best, Bad Luck, I Guess and The Truth Is Out There.
- **Roadmap to the platinum** — six stages built from the official
  descriptions: story, contacts and strangers, exploring Leonida,
  activities and skills, partner and heist trophies before the finale, then
  money, choices and 100% completion. Every stage lists the trophies it
  earns and how many of them you hold.
- **Missables** — 7 trophies flagged as possibly missable, each with its
  reason: the two partner trophies (partner availability is story-gated),
  the 500-choice counter, the second-attempt trophy, the rare-event trophy,
  the VCIA departure and the undetected jewelry store. The flags are
  inferred from the descriptions, not confirmed inside the game, and the
  page says so.
- **Filters and spoiler setting** — filter by kind (story, missable,
  collectibles, activities, side strands, online — the official list holds
  no online trophy, so that filter is honestly empty), by grade and by
  earned state; search by trophy, mission or keyword. The spoiler setting
  hides the names and descriptions of story trophies until they are earned.
- **Export / import / reset** — progress as a JSON file, in the footer.

## Screenshots

The four screenshots in `screenshots/` are real renders of this app in
headless Chrome at 1280×800, taken with progress seeded to 13 earned
(`?demo=seed`, which only seeds when no saved progress exists):

1. `1-cover.jpg` — checklist with The Shootist's guide open beside it.
2. `2-roadmap.jpg` — the roadmap to the platinum.
3. `3-missables.jpg` — the missable trophies, flagged with reasons.
4. `4-spoilers.jpg` — the spoiler setting at work (story trophies hidden
   until earned).

`shots.json` records the view each screenshot was taken of.

## Handing it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
`vendor/makefun-frontend.ts` library. The entry is MIT licensed; see
`LICENSE`.

## Honesty note

GTA VI released the day this bounty opened, so no guide has played the
game through yet — including this one. Nothing here claims a location,
step or trigger the official descriptions do not give: where a description
is cryptic, this guide says what it literally says, what it most likely
means, and points at the source lists for the trigger players confirm.
Names, descriptions, grades and PSN counts are the official list as
published. The look is this guide's own; no Rockstar logo or official
artwork is used anywhere.
