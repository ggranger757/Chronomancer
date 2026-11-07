# CHRONOMANCER

**A Raincaster Mystery · 1888 · 1947 · 1986 · 2026**

November 2026. A girl is found dead in the Hartwell mansion, still warm, with a perfectly round hole through her and a watch stopped at 3:07. She went missing in **1986**. She's still sixteen.

Play as **Augie**, an engineer who escaped a cult of technomancers (staff with swappable heads, two box-droids), or **Jester**, an undercover cop inside the Mantis crew (fists, shotgun, the crew, and the mask). **Mina**, a runaway who can open doors in time, sends you after the killer through Raincaster's history: Halloween 1986, a jazz club in 1947, and the Great Blizzard of 1888.

The killer is a Chronomancer. Her accomplice has held her doors for 79 years. Every clue you need to name them is in front of you from chapter 1.

It's an installable **PWA** that works offline on phones and computers.

## The rules of time
1. **TETHER:** Mina can only open a door to a moment she's holding a piece of.
2. **FIXED:** the past already happened, and if you go there, you were always part of it.
3. **ANCHOR:** someone stays in the present holding the tether, so only one hero travels.
4. **DAWN:** the door closes at sunrise.
5. **ENDS:** whatever comes through a door lands at the opener's end.
6. ...there's a sixth rule. Nobody tells you that one.

## How to play
- **Walk** with ◀ ▶ (A/D or the arrow keys). Press **ACTION** (Space/E) to look, talk, solve or go. The objective box and the arrow always show the next step.
- **Clues, case questions, lie-catching:** find clues, answer what they mean, and call out lies with the clue that proves them.
- **History checks:** in the past, people test you. Say something from the future and your **BLEND** meter drops. If it empties, the law comes for you. (Jester's **COVER** works the same way with the crew in 2026.)
- **Knowledge checks** on real forensics, plus **12 puzzle types**: radio tuning, scene memory, putting photos in date order, memory pairs, the killer's seven-note chime, a decoder ring, setting clock hands, locks, gears, a hidden panel, and a torn drawing.
- **Real-time fights:** move, combo, dodge-roll through wind-ups. Red wind-ups are heavy hits, and some wind-ups are fakes. Keys: J/Space attack, K/Shift dodge, U I O kit, H heal.
  - **Augie:** swap staff heads live (Knocker, Stun Crown, Mower Blade, Thunderclap), drum rounds (taser, flare, ash), Golem I battle mode and Golem II fortress.
  - **Jester:** jab-jab-uppercut, pump shotgun, crew rush, and **the mask** (a berserk flurry).
- **Car chases in every era:** tail a station wagon to the quarry in 1986, run a getaway car off the road in 1947, catch the accomplice's car before 3:07 in 2026. **Raincaster Run** is also playable endlessly from the title screen.
- **Cutscenes:** big story moments play as letterboxed pixel scenes (tap to continue, SKIP to skip).
- **Ask anyone anything:** talk to someone a second time to type your own questions. They can be AI-driven through the optional proxy in `server/`.

## Run it
```bash
python3 -m http.server 8000      # open http://localhost:8000
```
GitHub Pages: upload everything (including `.github/` and `.nojekyll`), then set **Settings → Pages → Source: GitHub Actions**.

## Rebuild the art
```bash
python3 tools/build_all.py <base-template folder> <Step-Quest folder> <SHADOW Series folder>   # characters, Bernard, Chronomancer, Nanomancer
python3 tools/swlist.py chronomancer-vX.Y.Z                                                  # refresh the offline cache list after any change
python3 tools/bgpaint.py assets/bg                                                         # rural-noir / neo-noir backgrounds
```
