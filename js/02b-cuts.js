/* =========================================================================
   CHRONOMANCER — 02b-cuts.js
   Cutscenes (played by 06e-cut.js). A dialogue node with cut:'id' plays one.
   Actors use sprite ids; 'HERO' and 'PARTNER' mean whoever you're playing.
   ========================================================================= */
'use strict';
window.TM = window.TM || {};
TM.CUTS = {
  cold_open: { loc: '2026 · RAINCASTER, MD', shots: [
    { bg: 'nn_city', rain: true, pan: [0, 160], dur: 3.4, music: 'street', cap: 'Raincaster, Maryland. 11:06 PM. It has rained for forty days.' },
    { bg: 'bulk', pan: [0, 30], dur: 3, music: 'horror', cap: 'The old Hartwell mansion. The attic. Nobody has lived here in years.',
      actors: [{ spr: 'chrono', x: 340, dir: -1, shadow: true, glow: '#40f0ff' }] },
    { bg: 'bulk', pan: [30, 30], dur: 3.2, cap: '11:07 PM. Something opens in the air.',
      actors: [{ spr: 'chrono', x: 340, dir: -1, shadow: true, glow: '#40f0ff', anim: 'attack', once: true }, { spr: 'ivy', x: 200, anim: 'death', once: true, from: 1.7, hideBefore: true }],
      fx: [{ k: 'portal', x: 200, at: .4, r: 30 }, { k: 'flash', at: 1.6, col: '64,240,255' }, { k: 'shake', at: 1.7 }] },
    { bg: 'bulk', pan: [30, 50], dur: 3.4, cap: 'A girl who vanished in 1986 falls out of it — still sixteen. And not breathing.',
      actors: [{ spr: 'ivy', x: 200, anim: 'death', frame: 99 }, { spr: 'chrono', x: 340, to: 300, dir: -1, shadow: true, glow: '#40f0ff' }],
      fx: [{ k: 'close', x: 200, at: 0, r: 30 }] },
  ] },
  first_jump: { loc: '2026 · THE HISTORICAL SOCIETY', shots: [
    { bg: 'cold', dur: 2.6, music: 'chime', cap: 'Mina twists the brass dials on her wrists.',
      actors: [{ spr: 'HERO', x: 180 }, { spr: 'chrono', x: 320, dir: -1, anim: 'attack', once: true, glow: '#40f0ff' }],
      fx: [{ k: 'clock', at: .3, x: 250, y: 80, r: 34, h: 3, m: 7 }] },
    { bg: 'cold', dur: 2.8, cap: 'The air tears open like wet paper.',
      actors: [{ spr: 'HERO', x: 180, to: 250, until: 2.2, fade: 'out' }, { spr: 'chrono', x: 320, dir: -1, glow: '#40f0ff' }],
      fx: [{ k: 'portal', x: 250, at: 0, r: 36 }, { k: 'flash', at: 2.2, col: '255,79,216' }] },
  ] },
  woods307: { loc: '1986 · QUARRY WOODS · 3:07 AM', shots: [
    { bg: 'nfa', era: '1986', pan: [0, 60], dur: 3.4, music: 'horror', cap: 'Eli Ward walks Ivy into the clearing like he\'s taking her to see the stars.',
      actors: [{ spr: 'silas86', x: 90, to: 220 }, { spr: 'ivy', x: 60, to: 190 }],
      fx: [{ k: 'clock', at: .2, x: 420, y: 48, r: 22, h: 3, m: 7 }] },
    { bg: 'nfa', era: '1986', pan: [60, 60], dur: 3.6, cap: 'The air folds open. On the far side, someone small is holding the door.',
      actors: [{ spr: 'silas86', x: 220 }, { spr: 'ivy', x: 190, to: 300, from: 1.8, until: 3.4 }, { spr: 'chrono', x: 330, dir: -1, shadow: true, glow: '#40f0ff', alpha: .9, from: 1, hideBefore: true, fade: 'in' }],
      fx: [{ k: 'portal', x: 320, at: .5, r: 38 }] },
    { bg: 'nfa', era: '1986', pan: [60, 60], dur: 3, cap: 'Then the light snaps shut, and Ward is alone, holding his hand.',
      actors: [{ spr: 'silas86', x: 220, anim: 'hurt' }],
      fx: [{ k: 'close', x: 320, at: 0, r: 38 }, { k: 'flash', at: .1, col: '64,240,255' }] },
  ] },
  orchid307: { loc: '1947 · THE BLACK ORCHID · 3:07 AM', shots: [
    { bg: 'c3', era: '1947', pan: [0, 40], dur: 3.2, music: 'noir47', cap: 'Si holds the back door open. A small hooded girl walks in out of the rain.',
      actors: [{ spr: 'silaskid', x: 400, dir: -1 }, { spr: 'chrono', x: 470, to: 330, dir: -1, glow: '#40f0ff' }, { spr: 'vera', x: 200 }] },
    { bg: 'c3', era: '1947', pan: [40, 40], dur: 3, cap: 'Vera starts to sing seven notes. She never finishes the song.',
      actors: [{ spr: 'vera', x: 200, anim: 'death', once: true, from: 1.5 }, { spr: 'chrono', x: 330, dir: -1, anim: 'attack', once: true, glow: '#40f0ff' }, { spr: 'silaskid', x: 400, dir: -1, anim: 'hurt' }],
      fx: [{ k: 'clock', at: 0, x: 240, y: 60, r: 26, h: 3, m: 7 }, { k: 'portal', x: 205, at: 1, r: 18 }, { k: 'flash', at: 1.5, col: '64,240,255' }, { k: 'close', x: 205, at: 1.8, r: 18 }] },
  ] },
  first_door: { loc: '1888 · THE CLOCK TOWER · 3:07 AM', shots: [
    { bg: 'lab', era: '1888', snow: true, dur: 3.4, music: 'strings1888', cap: 'Elias Hartwell walks his dying son into a circle of light.',
      actors: [{ spr: 'silas88', x: 90, to: 240 }, { spr: 'bernboy', x: 70, to: 270 }],
      fx: [{ k: 'portal', x: 290, at: .3, r: 40 }, { k: 'clock', at: .1, x: 240, y: 56, r: 30, h: 3, m: 7 }] },
    { bg: 'lab', era: '1888', snow: true, dur: 2.8, cap: '"WREN — NO!" A little girl in a hood runs in after her brother.',
      actors: [{ spr: 'silas88', x: 240, dir: -1, anim: 'hurt' }, { spr: 'chrono', x: 40, to: 290, anim: 'run', walk: 'run', until: 2.2, fade: 'out' }],
      fx: [{ k: 'portal', x: 290, at: 0, r: 40 }, { k: 'flash', at: 2.2 }, { k: 'close', x: 290, at: 2.3, r: 40 }] },
    { bg: 'lab', era: '1888', dur: 4.2, music: 'horror', cap: 'The light tears open again. Something too tall reaches out — wearing Bernard\'s face in its chest. And Wren walks out under its arm.',
      actors: [{ spr: 'bernard', x: 330, dir: -1, scale: .62, alpha: .85, fade: 'in', shadow: false }, { spr: 'chrono', x: 300, to: 230, from: 1.6, until: 3.6, dir: -1, glow: '#40f0ff', hideBefore: true }],
      fx: [{ k: 'portal', x: 310, at: 0, r: 46 }, { k: 'stars', at: 0 }, { k: 'shake', at: .5 }] },
  ] },
  stolen_spring: { loc: '2026 · THE HISTORICAL SOCIETY · 2:29 AM', shots: [
    { bg: 'cold', dur: 2.6, music: 'tension', cap: 'You fall back through the door with the mainspring in your arms.',
      actors: [{ spr: 'HERO', x: 220, fade: 'in' }, { spr: 'PARTNER', x: 110, anim: 'death', frame: 99 }],
      fx: [{ k: 'close', x: 220, at: 0, r: 36 }, { k: 'flash', at: 0, col: '255,79,216' }] },
    { bg: 'cold', dur: 3.2, cap: 'Mina is waiting. So is Silas — with his car keys, and a cane with blood on the knob.',
      actors: [{ spr: 'HERO', x: 220 }, { spr: 'PARTNER', x: 110, anim: 'death', frame: 99 }, { spr: 'chrono', x: 330, to: 260, dir: -1, glow: '#40f0ff' }, { spr: 'silas26', x: 420, dir: -1 }] },
  ] },
  between: { loc: 'THE HOUR BETWEEN', shots: [
    { bg: 's4n', dur: 3.6, music: 'boss', cap: 'Stars all the way down. The great clock floats in the dark like a moon. Something behind it is knocking.',
      actors: [{ spr: 'bernard', x: 400, dir: -1, scale: .7, shadow: true, alpha: .55 }, { spr: 'chrono', x: 300, dir: -1, glow: '#40f0ff' }],
      fx: [{ k: 'stars', at: 0 }, { k: 'clock', at: .4, x: 330, y: 70, r: 48, h: 3, m: 6 }] },
  ] },
  end_rest: { loc: 'THE HOUR BETWEEN · 3:08 AM', shots: [
    { bg: 's4n', dur: 4, music: 'calm', cap: 'The stars go out one by one. Two children walk into the last of the light, holding hands.',
      actors: [{ spr: 'chrono', x: 210, to: 330, until: 3.6, fade: 'out' }, { spr: 'bernboy', x: 240, to: 360, until: 3.6, fade: 'out' }],
      fx: [{ k: 'stars', at: 0 }, { k: 'flash', at: 3.5 }] },
  ] },
};
