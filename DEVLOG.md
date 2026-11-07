# DEVLOG

## v4.0 — The Chronomancer is the villain
- **Story:** "Mina" is Wren Hartwell, Bernard's twin, who came out of the Hour in 1888 unable to age. Silas Morrow is her accomplice: Si the shoeshine boy (1947), Eli Ward (1986), the watch-buying "Collector" (2026). Fair-play clue in chapter 1 (rule 5: a body lands at the opener's end). Hidden rule 6 (one self per minute) explains why she needed the heroes to steal the mainspring. Chapter 5: Silas fight, then the Chronomancer boss (blinks, rewinds, circle-trace), then Bernard. "Story so far" cards open chapters 2–5.
- **Cutscenes** (`js/06e-cut.js`, data in `js/02b-cuts.js`): eight letterboxed scenes built from the game's own backgrounds and sprites, with portals, clock faces, flashes and weather.
- **Chases are data** (`TM.CHASES`): pursuit mode (catch a target car), era backgrounds, era filters, period cars, falling leaves. Three story chases.
- **Sprites:** Chronomancer from SHADOW's Blind Huntress (cyan light where her eyes were), Nanomancer from Shadeflit, Calloway carries a pistol, Jester's shotgun sits in his hands.
- **UI:** Step Quest skin. Notched pixel boxes, bevelled buttons, Silkscreen labels, Courier reading text, smaller type, every label fits its button.

## v2.1: simplified for players, Step Quest style
- Switched from a top-down game with many systems to a **side-view** game with one ACTION button, one objective at a time, and a guidance arrow.
- Removed all code-based content: no casting-code puzzles and no code in the daily challenge.
- Replaced the free-form evidence board with **case questions** (3 choices, hints on a wrong answer) and **"That's a lie!"** (pick the clue that proves it).
- Replaced real-time combat with **turn-based** fights. Every enemy shows its next move and weakness in plain words.
- Characters are built from Step Quest sprites, recolored and redrawn to the reference sheets and photos. Bernard is drawn from scratch.
- Added 6 puzzles and 2 memory games, Jester's undercover **COVER** system (the Mantis gang attacks only if his cover is blown), free-text **AI conversations** with an offline fallback, a Daily Case with streaks, stars, ranks and trophies.

## Ideas for next
- Voice acting for key lines; more Daily Case scenarios; Case 02 · The Scientist.

## v3.0 — CHRONOMANCER
- New story: a killer across 2026, 1986, 1947 and 1888 with fixed-timeline time travel; 6 chapters, 50 dialogues, 33 clues, history and knowledge checks, 12 puzzle types.
- Characters rebuilt on the owner's base templates (tools/dress.py); shorter characters use the mini template; Bernard redone as Ritual-style cosmic horror.
- Real-time combat with hero kits (Augie's staff heads with swap animation, drum rounds and Golems; Jester's shotgun, crew rush and the mask).
- Original synthesized soundtrack (17 tracks); rural-noir and neo-noir painted backgrounds; era looks; time-jump cinematic.
- Raincaster Run car chase (story and arcade); neon cyberpunk UI in Courier.
