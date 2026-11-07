/* =========================================================================
   CHRONOMANCER — 02-story.js
   A killer who walks through time. Raincaster, Maryland: 2026 · 1986 · 1947 · 1888.
   Everything the player reads lives here: heroes and their kits, enemies,
   clues, case questions, history checks, chapters, dialogue, files, feats.
   Plain words. *word* = magenta highlight. Text: string or {a:'Augie', j:'Jester'}.

   THE RULES OF TIME (Mina says the first five out loud in chapter 1; none of them bend):
   1. TETHER — a door only opens into a moment you hold a piece of: a stopped watch,
      a matchbook, a gear. It opens on the minute that piece stopped.
   2. FIXED — the past already happened, and if you go there, you were always part
      of it. You can't save anyone back there. You CAN find out what really happened.
   3. ANCHOR — someone stays in the present holding the tether, or the traveler can't
      come back. That's why only one of you goes.
   4. DAWN — a door closes at the first dawn after you arrive.
   5. ENDS — whatever comes through a door lands at the OPENER's end.
      (Ivy's body landed in the 2026 attic. Who was in the attic?)
   6. ONE SELF — nobody can stand in the same minute twice. (Mina never says this one.
      It's why the Chronomancer couldn't fetch the mainspring herself: she was already
      in the 1888 tower at 3:07. History says strangers took it. So she waited for you.)

   THE TRUTH: "Mina" is WREN HARTWELL, Bernard's twin. She followed him into the Hour
   in 1888 and came out with light where her eyes were, unable to age, able to open
   doors. Every door she opens THROUGH a person pulls a little more of Bernard home.
   SILAS MORROW has held her doors since he was twelve: "Si" the shoeshine boy (1947),
   "Eli Ward" the arcade owner (1986), the archivist "Collector" (2026).
   ========================================================================= */
'use strict';
window.TM = window.TM || {};

/* ------------------------------------------------------------ HEROES + KITS */
TM.HEROES = {
  augie: {
    name: 'AUGIE', spr: 'augie', tag: 'The Engineer',
    blurb: 'Escaped a cult of technomancers as a kid. Builds everything she owns out of scrap. Her staff takes eight different heads, and her two box-droids go everywhere she goes.',
    hp: 110, atk: 11, perks: ['HUSH CROOK: swap staff heads mid-fight', 'GOLEM I & II: two droids that fight, shield and heal', 'Finds extra details on clues (droid scan)'],
    meds: 2,
  },
  jester: {
    name: 'JESTER', spr: 'jester', tag: 'The Undercover Cop',
    blurb: 'Baltimore\'s best detective until it wrecked him. Now he\'s deep undercover in the Mantis crew. Hits hard, reads liars, and when it gets bad... he puts on the mask.',
    hp: 135, atk: 13, perks: ['SHOTGUN + fists', 'CREW RUSH: the Mantis crew attacks all at once', 'THE MASK: a berserk flurry when rage is full', 'Spots liars (street sense)'],
    meds: 2,
  },
};
// Augie: the Hush Crook Mk III (sheet 11–13). Push · quarter-turn · click. Two seconds.
TM.HEADS = {
  knocker: { name: 'KNOCKER', icon: '🔨', text: 'Sledgehammer head. Solid hit that cracks guards.', mult: 1.1, breakGuard: true, col: '#6f7887' },
  stun: { name: 'STUN CROWN', icon: '⚡', text: 'Copper studs dump the capacitor. Small hit, good chance to STUN.', mult: .7, stun: .5, col: '#e0752d' },
  mower: { name: 'MOWER BLADE', icon: '🗡', text: 'Spear point on a steel wire. Big damage and bleeding, but it leaves you open.', mult: 1.55, bleed: 3, open: .3, col: '#c8d0d8' },
  thunder: { name: 'THUNDERCLAP', icon: '📯', text: 'Dumps the air tank in one sonic boom. Interrupts a big attack. Recharges after 2 turns.', mult: .9, interrupt: true, cooldown: 2, col: '#9aa4b2' },
};
TM.ROUNDS = {   // the six-shot drum
  taser: { name: 'TASER ROUND', icon: '🔌', n: 2, text: 'Barbs on a wire. Guaranteed stun for one turn.' },
  flare: { name: 'FLARE', icon: '🔥', n: 1, text: 'Blinds it — its next two attacks will probably miss.' },
  ash: { name: 'ASH ROUND', icon: '✴', n: 1, text: 'Chamber six. The one that kills. Massive damage.' },
};
TM.DROIDS = {   // Golem I & II (sheets 14–16)
  golem1: { name: 'GOLEM I · BATTLE', icon: '🤖', text: 'Legs out, T-rex arms out. Three quick punches.', uses: 2 },
  golem2: { name: 'GOLEM II · FORTRESS', icon: '🛡', text: 'Panels telescope into a 1.1 m shield. Blocks the next hit, patches you up.', uses: 2 },
};

/* ------------------------------------------------------------ ENEMIES
   Fights are not readable anymore: each turn the enemy shows a TELL, and tells
   can lie (feints). Heavy attacks wind up first. Timing your strikes and dodges
   matters. moves: kind hit | heavy (winds up a turn) | guard | drain | multi | blind */
TM.FOES = {
  thug: { name: 'SAINTS THUG', spr: 'grunt', hp: 52, atk: 9, kind: 'Street muscle', feint: .25,
    moves: [{ k: 'hit', name: 'HAYMAKER', tell: 'rolls his shoulder' }, { k: 'hit', name: 'PIPE SWING', tell: 'grips his pipe low', dmg: 12 }, { k: 'guard', name: 'COVER UP', tell: 'raises his arms' }] },
  mantis: { name: 'MANTIS CREW', spr: 'crew2', hp: 70, atk: 11, kind: 'Your own crew. They know you\'re a cop.', feint: .3,
    moves: [{ k: 'multi', name: 'GANG UP', tell: 'whistles for the others', hits: 2 }, { k: 'hit', name: 'STREET JAB', tell: 'bounces on his feet' }, { k: 'heavy', name: 'BLINDSIDE', tell: 'circles behind you', dmg: 20 }] },
  hourling: { name: 'HOURLING', spr: 'grunt', shadow: true, hp: 58, atk: 10, kind: 'A person-shaped hole where an hour leaked out', feint: .35,
    moves: [{ k: 'drain', name: 'TAKE A MINUTE', tell: 'reaches for your watch', dmg: 9 }, { k: 'hit', name: 'SKIP', tell: 'flickers', dmg: 11 }, { k: 'heavy', name: 'LOST HOUR', tell: 'goes perfectly still', dmg: 22 }] },
  deputy: { name: 'DEPUTY HOLLIS', spr: 'deputy', hp: 60, atk: 10, kind: '1986. He thinks you\'re a drifter.', feint: .2,
    moves: [{ k: 'hit', name: 'NIGHTSTICK', tell: 'pulls his nightstick' }, { k: 'guard', name: 'RADIO IT IN', tell: 'grabs his radio' }, { k: 'heavy', name: 'TACKLE', tell: 'lowers his weight', dmg: 18 }] },
  goon: { name: 'ORCHID GOON', spr: 'goon', hp: 66, atk: 11, kind: '1947. Vinnie\'s muscle.', feint: .3,
    moves: [{ k: 'hit', name: 'BRASS KNUCKLES', tell: 'cracks his knuckles' }, { k: 'heavy', name: 'BOTTLE', tell: 'grabs a bottle off the bar', dmg: 19 }, { k: 'guard', name: 'BOB AND WEAVE', tell: 'starts weaving' }] },
  constable: { name: 'CONSTABLE', spr: 'constable', hp: 64, atk: 10, kind: '1888. Doing his rounds in a blizzard.', feint: .2,
    moves: [{ k: 'hit', name: 'TRUNCHEON', tell: 'lifts his truncheon' }, { k: 'heavy', name: 'WHISTLE + CHARGE', tell: 'raises his whistle', dmg: 18 }, { k: 'guard', name: 'BRACE', tell: 'plants his boots in the snow' }] },
  silas: { name: 'SILAS MORROW', spr: 'silas26', hp: 110, atk: 12, kind: 'Ninety-one. Moving on years she lent him.', boss: 'silas', feint: .4,
    moves: [{ k: 'hit', name: 'CANE', tell: 'shifts his grip on the cane' }, { k: 'drain', name: 'BORROWED TIME', tell: 'opens his pocket watch', dmg: 12 }, { k: 'heavy', name: 'SHOESHINE', tell: 'swings the iron kit box', dmg: 22 }, { k: 'guard', name: 'REWIND', tell: 'checks the time', rewind: true }] },
  wren: { name: 'THE CHRONOMANCER', spr: 'chrono', hp: 135, atk: 14, kind: 'Wren Hartwell. Twelve, for 138 years.', boss: 'wren', feint: .5,
    moves: [{ k: 'hit', name: 'SECOND HAND', tell: 'draws a line of light', dmg: 12 }, { k: 'multi', name: 'SKIPPED MINUTE', tell: 'flickers out of time', hits: 3, dmg: 6 }, { k: 'heavy', name: 'A DOOR THROUGH YOU', tell: 'traces a circle on your chest', dmg: 28 }, { k: 'blind', name: 'THE HOUR', tell: 'her band of light flares' }, { k: 'guard', name: 'REWIND', tell: 'turns her wrist back', rewind: true }] },
  bernard: { name: 'BERNARD', spr: 'bernard', hp: 150, atk: 15, kind: 'What came back.', boss: 'bernard', feint: .45,
    moves: [{ k: 'multi', name: 'TOO MANY HANDS', tell: 'unfolds its arms', hits: 3, dmg: 7 }, { k: 'heavy', name: 'THE STILL HOUR', tell: 'its chest-eyes close', dmg: 30 }, { k: 'drain', name: 'GRIEF', tell: 'whispers your name', dmg: 12 }, { k: 'blind', name: 'STARLIGHT', tell: 'opens where it\'s missing' }] },
};

/* ------------------------------------------------------------ CLUES */
TM.CLUES = {
  // 2026
  news: { t: 'Police Scanner', i: '📻', d: 'A girl found dead at the old Hartwell mansion. "Wound is perfectly round." Then the cops switch channels.' },
  ivy_body: { t: 'The Girl', i: '🧍', d: 'A teenage girl. Teal windbreaker, jeans, a Walkman. No ID. She has been dead less than an hour.' },
  wound: { t: 'Perfect Circle', i: '⭕', d: 'A hole exactly 7 cm wide through her body. The edges are melted smooth, like glass.' },
  watch: { t: 'Stopped Watch', i: '⌚', d: 'Her plastic watch stopped at 3:07. The date window says OCT 31.', extra: 'Golem\'s scan: the battery is from 1986. It has never been opened.' },
  tape: { t: 'Mixtape', i: '📼', d: 'In her Walkman: a tape labeled "IVY\'S HALLOWEEN MIX 86". It\'s not a retro copy. It\'s the real thing.' },
  warm: { t: 'Still Warm', i: '🌡', d: 'Her skin is still warm and her muscles haven\'t stiffened yet. She died tonight.' },
  poster: { t: 'Missing Poster', i: '📄', d: 'MISSING: IVY CALDER, 16. Last seen October 31, 1986. The girl on the poster is the girl in the mansion.' },
  file86: { t: 'Old Police File', i: '🗂', d: 'The 1986 case file on Ivy. One page is an anonymous tip: "Look at the arcade owner. He hums the same song every night."', extra: 'The handwriting looks... like yours.' },
  chime: { t: 'The Chime', i: '🎵', d: 'Seven notes. You\'ve heard them tonight: the Historical Society clock plays them on the hour.' },
  mina_rules: { t: 'The Rules of Time', i: '⏳', d: '1 TETHER: Mina can only go to a moment she\'s holding a piece of. 2 FIXED: the past can\'t be changed. 3 ANCHOR: someone stays behind holding the tether. 4 DAWN: the door closes at sunrise.' },
  watches: { t: 'Stolen Watches', i: '⌚', d: 'The Mantis crew has been stealing antique pocket watches for a buyer called "the Collector". Every watch is stopped at 3:07.' },
  // 1986
  ivy_alive: { t: 'Ivy, Alive', i: '🎧', d: 'You talked to her. She\'s funny and scared. She draws two things over and over: something tall with antlers and a face in its chest — and a little girl who never gets older.' },
  sketch: { t: 'Ivy\'s Sketchbook', i: '📓', d: 'Pages of the antlered thing: "HE SAYS HIS NAME IS BERNARD. HE SAYS HE\'S LOST." Then a small hooded girl with light over her eyes: "HIS SISTER. SHE\'S IN GRANDMA\'S OLD PHOTOS TOO. SAME AGE."' },
  ray_said: { t: 'Ray\'s Story', i: '💬', d: 'Ivy\'s stepdad Ray says he was home all Halloween night.' },
  bar_tab: { t: 'Bar Tab', i: '🧾', d: 'Lucky\'s Tavern, Oct 31, 1986: R. CALDER, 9:10 PM to 2:45 AM. Ray was at the bar all night.' },
  arcade_man: { t: 'Mr. Ward', i: '👴', d: 'Eli Ward runs the Starport arcade. Gray before his time, walks with a cane. Burgundy scarf, gold watch chain. He hums seven notes while he counts quarters.' },
  scar: { t: 'Burned Palm', i: '✋', d: 'When Mr. Ward shook your hand, you felt it: an old round burn scar in the middle of his left palm.' },
  matchbook: { t: 'Black Orchid Matchbook', i: '🔥', d: 'Dropped by Eli Ward: "THE BLACK ORCHID · RAINCASTER". Inside, in a child\'s pencil: "Oct 24 1947 — V.L. — 3:07 — I KEEP THE DOOR."' },
  door_seen: { t: 'The Door in the Woods', i: '🌀', d: 'At 3:07 a circle of light opened in the air. Eli Ward walked Ivy into it. On the other side, holding the door open, stood a small hooded figure with a band of cyan light where her eyes should be.' },
  // 1947
  vera_body: { t: 'Vera Lune', i: '🎤', d: 'The Black Orchid\'s singer. Same round wound. Same stopped watch: 3:07.' },
  vinnie_said: { t: 'Vinnie\'s Story', i: '💬', d: 'Vinnie, who owns the club, says he was "right here at the bar all night".' },
  booking: { t: 'Booking Sheet', i: '📋', d: 'Raincaster PD, Oct 24, 1947, 11:40 PM: Vincent Moretti, held overnight for illegal gambling. Vinnie was in a cell.' },
  hart: { t: 'Si, the Shoeshine Boy', i: '👞', d: 'Twelve. Flat cap, burgundy scarf, a gold watch chain far too nice for him. Shines shoes by the Orchid\'s back door. Hums seven notes.' },
  si_burn: { t: 'Si\'s Hand', i: '✋', d: 'After 3:07, Si is crying in the alley, holding his left hand. A fresh round burn in the middle of his palm. He held the door.' },
  photo47: { t: 'Club Photograph', i: '📷', d: 'A flash photo of the club, Oct 24, 1947. By the back door: Si, and a small hooded girl with light where her eyes should be. At the edge of the frame: a blurry figure in a 2026 jacket. You.' },
  ledger: { t: 'Si\'s Notebook', i: '📒', d: 'A kid\'s handwriting: "Miss Wren says if I keep the door, Mama gets more time. V.L. 1947 · I.C. 1986 · 2026: THE STRANGERS COME. Then the spring. Then he comes home."' },
  gear: { t: 'Brass Gear', i: '⚙', d: 'Left on the back seat of the getaway car: a brass clock gear stamped "HARTWELL CLOCKWORKS · MARCH 12 1888". Left for you.' },
  // 1888
  elias: { t: 'The Hartwell Portrait', i: '🖼', d: 'ELIAS HARTWELL AND HIS CHILDREN, 1887. The father looks a little like Silas — gray beard, scarf. But the girl. Bernard\'s twin, WREN. You know that face.' },
  bernard_boy: { t: 'Bernard Hartwell', i: '👦', d: 'Elias\'s son, twelve. Coughing blood. The doctor gives him days. His twin sister Wren won\'t leave the clock tower.' },
  plan: { t: 'Elias\'s Plan', i: '📐', d: 'Drawings of the great clock. A room "between the seconds" where time does not pass — where a dying boy could wait until a cure exists.' },
  agnes_saw: { t: 'What Agnes Saw', i: '👁', d: 'Miss Wren sneaks up the clock tower every night humming the chime. "She says wherever Bernard goes, she goes. She made her father promise."' },
  wren_out: { t: 'What Came Out', i: '👁', d: 'Two things came back out of the Hour. Something tall wearing Bernard\'s face — and Wren, a band of light where her eyes had been. She is Mina. She has not aged a day since.' },
  mainspring: { t: 'The Mainspring', i: '🌀', d: 'The great clock\'s mainspring. History says it was "lost in the blizzard". It was you. You took it.' },
  // 2026 return
  palm2026: { t: 'Silas\'s Glove', i: '🧤', d: 'A spare glove in Silas\'s desk. The palm lining is scorched in a perfect circle — like Eli Ward\'s scar. Like Si\'s.' },
  anagram: { t: 'The Shoeshine Kit', i: '👞', d: 'Under the desk: a battered shoeshine kit. Burned into the lid: "SI MORROW · 1947". Inside: a Starport token stamped "E. WARD". Si. Eli. Silas.' },
  one_self: { t: 'One Minute, One Self', i: '⏳', d: 'Silas\'s notes: "She can\'t go back for the spring. She was already standing in that minute. Nobody stands in the same minute twice. The records say strangers took it. So she waited 138 years for them."' },
};

/* ------------------------------------------------------------ CASE QUESTIONS · HISTORY CHECKS · KNOWLEDGE CHECKS */
TM.QUESTIONS = {
  // KNOWLEDGE (forensics)
  k_warm: { kind: 'know', q: 'The girl is still warm and her muscles are still loose. What does that tell you?', hint: 'Bodies stiffen a few hours after death.',
    a: [{ t: 'She died less than a few hours ago.', ok: true }, { t: 'She died days ago and was kept cold.' }, { t: 'Nothing. Bodies always stay warm.' }],
    why: 'Stiffness (rigor mortis) usually starts 2 to 6 hours after death. She died tonight.' },
  q_how: { q: 'A girl missing since 1986 died TONIGHT, still 16, in her 1986 clothes. What\'s the only answer that fits every clue?', hint: 'Her tape and watch battery are really from 1986.',
    a: [{ t: 'She came from 1986 to tonight — through time.', ok: true }, { t: 'Someone kept her hidden for 40 years.' }, { t: 'It\'s a different girl wearing old clothes.' }],
    why: 'A 16-year-old can\'t hide for 40 years without aging. Her things are original. She was brought here from 1986.' },
  k_door: { kind: 'know', q: 'Mina says the past can\'t be changed. So what CAN you do back there?', hint: 'Think about the old police file.',
    a: [{ t: 'Find out what really happened — and maybe leave the clues you already found.', ok: true }, { t: 'Save Ivy before she\'s taken.' }, { t: 'Nothing at all.' }],
    why: 'The tip in the 1986 file is in your handwriting. You wrote it. You just haven\'t written it yet.' },
  // 1986
  h_series: { kind: 'history', era: '1986', q: 'Danny asks: "Did you see the World Series this week? Who won?"', hint: 'October 1986. A famous ball rolled through someone\'s legs.',
    a: [{ t: 'The Mets.', ok: true }, { t: 'The Red Sox.' }, { t: 'The Yankees.' }],
    why: 'The New York Mets beat the Boston Red Sox in seven games. October 27, 1986.' },
  h_shuttle: { kind: 'history', era: '1986', q: 'Rosa says "Ever since the shuttle blew up, my mom won\'t let me watch the news." Which shuttle?', hint: 'January 1986. A teacher was on board.',
    a: [{ t: 'Challenger.', ok: true }, { t: 'Columbia.' }, { t: 'Apollo 13.' }],
    why: 'Space Shuttle Challenger broke apart on January 28, 1986. (Columbia was lost in 2003 — careful, that hasn\'t happened yet.)' },
  q_ray: { q: 'Could Ray Calder have taken Ivy at 3:07 AM?', hint: 'Check the bar tab.',
    a: [{ t: 'No. He was at Lucky\'s Tavern until 2:45 AM and drove home drunk — he couldn\'t have been in the woods.', ok: true }, { t: 'Yes. He has a rifle.' }, { t: 'Yes. He lied about being home.' }],
    why: 'He lied to hide his drinking, not a murder. The tab clears him.' },
  q_ward: { q: 'Who led Ivy through the door at 3:07?', hint: 'Cane. Scarf. Seven notes.',
    a: [{ t: 'Eli Ward, the arcade owner.', ok: true }, { t: 'Ray Calder.' }, { t: 'Deputy Hollis.' }],
    why: 'Ward\'s scarf, chain and song. But he wasn\'t alone — someone held the door open from the other side.' },
  // 1947
  h_robinson: { kind: 'history', era: '1947', q: 'The barkeep says: "Biggest news in baseball this year?"', hint: 'April 1947. Brooklyn.',
    a: [{ t: 'Jackie Robinson playing for the Dodgers.', ok: true }, { t: 'Babe Ruth\'s 60 home runs.' }, { t: 'The first night game.' }],
    why: 'Jackie Robinson broke Major League Baseball\'s color line on April 15, 1947.' },
  h_yeager: { kind: 'history', era: '1947', q: 'A pilot at the bar says nobody will ever fly faster than sound. What do you say?', hint: 'It DID happen in October 1947 — but it was top secret for months.',
    a: [{ t: '"Maybe someday." (Say nothing about it.)', ok: true }, { t: '"Chuck Yeager already did it last week."' }, { t: '"Planes go five times that fast."' }],
    why: 'Yeager broke the sound barrier on Oct 14, 1947, but the Air Force kept it secret until 1948. Knowing it would make you a spy — or a time traveler.' },
  q_vinnie: { q: 'Did Vinnie kill Vera?', hint: 'Where was he at 3:07?',
    a: [{ t: 'No. He was locked in a police cell from 11:40 PM.', ok: true }, { t: 'Yes. He threatened her last week.' }, { t: 'Yes. It\'s his club.' }],
    why: 'The booking sheet puts him in a cell all night.' },
  q_same: { q: 'Eli Ward in 1986. Si the shoeshine boy in 1947. What connects them?', hint: 'Look at their left hands.',
    a: [{ t: 'Same person, 39 years apart — same scarf, same song, and the round burn Si got holding the door.', ok: true }, { t: 'Father and son.' }, { t: 'Just a coincidence.' }],
    why: 'Si grew up. He\'s been holding doors for someone his whole life — someone who never got any older.' },
  // 1888
  h_president: { kind: 'history', era: '1888', q: 'The constable squints at you. "Who\'s President, stranger?"', hint: 'March 1888. His first term.',
    a: [{ t: 'Grover Cleveland.', ok: true }, { t: 'Abraham Lincoln.' }, { t: 'Theodore Roosevelt.' }],
    why: 'Grover Cleveland was in his first term (1885–1889).' },
  h_ripper: { kind: 'history', era: '1888', q: 'Agnes asks if you\'ve heard any news from London. What do you say?', hint: 'It\'s March 1888. The Whitechapel murders start in August.',
    a: [{ t: '"Nothing much, ma\'am."', ok: true }, { t: '"Just Jack the Ripper."' }, { t: '"The Titanic sank."' }],
    why: 'Jack the Ripper\'s killings began in August 1888 — five months from now. The Titanic is 1912.' },
  q_why: { q: 'Why does the Chronomancer kill?', hint: 'What came out of the Hour — and what didn\'t?',
    a: [{ t: 'To bring Bernard all the way home. Every door she opens through a person pulls a little more of him out.', ok: true }, { t: 'For money.' }, { t: 'Because Elias told her to.' }],
    why: 'Wren followed her twin into the Hour. Only part of him came back. She\'s spent 138 years pulling the rest through, one life at a time.' },
  // 2026 return
  k_ends: { kind: 'know', q: 'Rule five: whatever comes through a door lands at the OPENER\'s end. Ivy\'s body landed in the 2026 attic. What does that mean?', hint: 'Who was in the attic when you got there?',
    a: [{ t: 'The Chronomancer was standing in that attic when Ivy came through.', ok: true }, { t: 'Ivy opened the door herself.' }, { t: 'Nothing — doors land anywhere.' }],
    why: 'Doors drop you at the opener\'s end. The only person in that attic was "Mina".' },
  q_killer: { q: 'Who is the Chronomancer?', hint: 'The attic. The portrait. The girl in Ivy\'s sketchbook.',
    a: [{ t: 'Mina. She is Wren Hartwell — Bernard\'s twin.', ok: true }, { t: 'Silas Morrow.' }, { t: 'Elias Hartwell.' }],
    why: 'Ivy landed where Mina stood. The 1887 portrait has her face. She came out of the Hour in 1888 and never aged.' },
  q_next: { q: 'Who has been holding her doors?', hint: 'Three names, one burned palm.',
    a: [{ t: 'Silas Morrow — Si in 1947, Eli Ward in 1986.', ok: true }, { t: 'Chief Hale.' }, { t: 'Marquis.' }],
    why: 'Same scar, same song, same scarf for 79 years. She promised his mother more time. He\'s been paying ever since.' },
};

/* ------------------------------------------------------------ PUZZLES (data for 06b-puzzles.js) */
TM.PUZZLES = {
  scanner: { type: 'tune', title: 'POLICE SCANNER', how: 'Slide the dial until the signal locks.', hint: 'Police bands sit high. Try past 150.', min: 140, max: 170, target: 155.4, unit: 'MHz', lock: '"...female, teens, Hartwell mansion... wound is perfectly round..."' },
  scene: { type: 'recall', title: 'REMEMBER THE SCENE', how: 'Study the scene. Then pick what you saw.', hint: 'Four things. A watch, a tape, a sneaker, a flower.', shown: ['⌚ stopped watch', '📼 cassette', '👟 one sneaker', '🌸 pink scrunchie'], decoys: ['🔑 car keys', '📱 phone', '💵 cash', '🕯 candle', '🧤 glove', '🔦 flashlight'] },
  archive: { type: 'order', title: 'THE ARCHIVE DRAWER', how: 'Put the Historical Society photos in order, oldest first.', hint: 'Horse carts come before cars. Color photos are newest.', items: [['🐎', 'Clocktower opening, horse carts'], ['🎷', 'Jazz club, men in fedoras'], ['🕹', 'Arcade, kids with a Walkman'], ['📱', 'Selfie by the clocktower']] },
  walkie: { type: 'tune', title: 'WALKIE-TALKIE', how: 'Find the kids\' channel.', hint: 'Danny said "channel 14". Each channel is a step.', min: 1, max: 22, step: 1, target: 14, unit: 'CH', lock: '"Static Kids, come in. It\'s Ivy. Meet at the quarry. Bring the flashlight."' },
  hiscore: { type: 'match', title: 'HIGH-SCORE TABLE', how: 'Flip two at a time. Match the initials.', hint: 'Remember where each set flipped.', icons: ['IVY', 'DAN', 'ROS', 'LEO', 'EW_', '307'] },
  chime: { type: 'sequence', title: 'THE SEVEN NOTES', how: 'Listen. Play the chime back.', hint: 'It climbs, drops, and climbs again. Watch which keys light up.', notes: [0, 2, 4, 2, 5, 4, 6] },
  lockbox: { type: 'wheels', title: 'VERA\'S DRESSING ROOM', how: 'Turn the wheels to open her jewelry box.', hint: 'Her mirror: "Opening night — 3rd of the 7th, 1946." Day, month, last digit?', code: '376', clueText: 'Lipstick on the mirror: <b>Opening night 3 · 7 · 46</b>' },
  safe47: { type: 'keypad', title: 'SI\'S SHOESHINE BOX', how: 'A padlocked kit. Type the 3-digit code.', hint: 'Every door opens at the same minute.', code: '307', clueText: 'Scratched on the lid: <b>"Always the same minute."</b>' },
  telegraph: { type: 'cipher', title: 'TELEGRAM', how: 'Turn the decoder ring until the telegram makes sense.', hint: 'The message starts with a word you know: DOOR.', plain: 'DOOR OPENS AT THREE OH SEVEN', shift: 7 },
  clocktower: { type: 'clock', title: 'THE GREAT CLOCK', how: 'Set the clock hands to the minute the first door opened.', hint: 'Every watch you found stopped at the same time.', h: 3, m: 7 },
  gears: { type: 'circuit', title: 'THE ESCAPEMENT', how: 'Turn the gears so the drive reaches the mainspring.', hint: 'Start at the crank and follow one piece at a time.' },
  wall88: { type: 'spot', title: 'THE WORKSHOP WALL', how: 'One panel is hollow. Find it.', hint: 'Watch closely — the hollow one flickers.' },
  torn: { type: 'torn', title: 'IVY\'S LAST DRAWING', how: 'Tap each piece to turn it. Make the drawing whole.', hint: 'Line up the antlers first.' },
};

/* ------------------------------------------------------------ CHAPTERS
   era drives the look, the music and the meters: COVER (Jester, 2026) · BLEND (any past era).
   thing types: clue, npc, door, foe, puzzle, prop, hide, cop, med, glyph */
TM.CHAPTERS = [
  { id: 'ch1', n: 1, era: '2026', title: 'THE GIRL WHO DIDN\'T AGE', mood: 'Raincaster. November 6, 2026. Raining.', music: 'present', intro: 'intro1', outro: 'outro1',
    scenes: {
      alley: { bg: 'nn_alley', w: 1300, tint: 'night', rain: true, start: 70, music: 'street', things: [
        { id: 'scanner', type: 'puzzle', puzzle: 'scanner', x: 170, icon: '📻', then: { clue: 'news' }, label: 'POLICE SCANNER' },
        { id: 'rico', type: 'npc', x: 520, spr: 'crew1', dlg: 'rico', label: 'TALK' },
        { id: 'saint', type: 'foe', x: 900, foe: 'thug', fight: 'f_saint', tut: true },
        { id: 'to_ave', type: 'door', x: 1260, to: 'avenue', label: 'MAIN AVENUE' },
        { type: 'glyph', x: 380, y: 60 }, { type: 'glyph', x: 1100, y: 80 }, { type: 'med', x: 760 },
      ] },
      avenue: { bg: 'nn_city', w: 1500, tint: 'neon', rain: true, start: 60, music: 'street', things: [
        { id: 'to_alley', type: 'door', x: 30, to: 'alley', label: 'ALLEY', back: true },
        { id: 'marquis', type: 'npc', x: 420, spr: 'marquis', dlg: 'marquis1', label: 'TALK', only: 'jester' },
        { id: 'dre', type: 'npc', x: 560, spr: 'crew2', dlg: 'dre1', label: 'TALK' },
        { type: 'prop', x: 240, art: 'car:taxi' }, { type: 'prop', x: 1180, art: 'car:police' },
        { id: 'society', type: 'door', x: 900, to: 'society', label: 'HISTORICAL SOCIETY' },
        { id: 'to_mansion', type: 'door', x: 1460, to: 'yard', label: 'HARTWELL MANSION' },
        { type: 'glyph', x: 700, y: 70 },
      ] },
      society: { bg: 'cold', w: 900, tint: 'dark', start: 60, music: 'chime', things: [
        { id: 'soc_out', type: 'door', x: 30, to: 'avenue', label: 'STREET', back: true },
        { id: 'silas', type: 'npc', x: 330, spr: 'silas26', dlg: 'silas1', label: 'TALK' },
        { id: 'archive', type: 'puzzle', puzzle: 'archive', x: 560, icon: '🗄', then: { clue: 'poster' }, label: 'ARCHIVE DRAWER', hidden: 'need_archive' },
        { id: 'file86', type: 'clue', x: 700, clue: 'file86', label: 'CASE FILE', hidden: 'need_file' },
        { id: 'clock', type: 'clue', x: 820, clue: 'chime', label: 'TOWER CLOCK' },
      ] },
      yard: { bg: 'b4', w: 1000, tint: 'night', rain: true, start: 60, music: 'present', things: [
        { id: 'yard_out', type: 'door', x: 30, to: 'avenue', label: 'AVENUE', back: true },
        { type: 'prop', x: 180, art: 'car:police' }, { type: 'prop', x: 760, art: 'car:sedan' },
        { id: 'seung', type: 'npc', x: 330, spr: 'seung', dlg: 'seung1', label: 'TALK' },
        { id: 'hale', type: 'npc', x: 560, spr: 'hale', dlg: 'hale1', label: 'TALK' },
        { id: 'hall_in', type: 'door', x: 950, to: 'hall', label: 'GO INSIDE' },
        { type: 'glyph', x: 760, y: 60 },
      ] },
      hall: { bg: 'cold', w: 1200, tint: 'dark', start: 60, music: 'horror', things: [
        { id: 'hall_out', type: 'door', x: 30, to: 'yard', label: 'OUTSIDE', back: true },
        { id: 'body', type: 'clue', x: 420, clue: 'ivy_body', label: 'LOOK' },
        { id: 'corpse', type: 'prop', x: 480, art: 'corpse' },
        { id: 'wound', type: 'clue', x: 480, clue: 'wound', label: 'LOOK' },
        { id: 'watch', type: 'clue', x: 540, clue: 'watch', label: 'LOOK' },
        { id: 'tape', type: 'clue', x: 600, clue: 'tape', label: 'LOOK' },
        { id: 'warm', type: 'clue', x: 360, clue: 'warm', label: 'TOUCH' },
        { id: 'scene', type: 'puzzle', puzzle: 'scene', x: 700, icon: '📸', then: { flag: 'recalled' }, label: 'PHOTOGRAPH' },
        { id: 'attic', type: 'door', x: 1150, to: 'attic', label: 'ATTIC STAIRS' },
        { type: 'med', x: 820 },
      ] },
      attic: { bg: 'bulk', w: 900, tint: 'dark', start: 60, music: 'horror', things: [
        { id: 'attic_down', type: 'door', x: 30, to: 'hall', label: 'DOWNSTAIRS', back: true },
        { id: 'hour1', type: 'foe', x: 420, foe: 'hourling', fight: 'f_hour1' },
        { id: 'mina', type: 'npc', x: 700, spr: 'chrono', dlg: 'mina1', label: '???', gone: 'mina1' },
        { type: 'glyph', x: 820, y: 60 },
      ] },
    },
    steps: [
      { text: 'Tune the police scanner', need: { clue: 'news' }, target: 'scanner' },
      { text: 'Check in with Rico (keep your cover)', need: { flag: 'cover1' }, target: 'rico', only: 'jester' },
      { text: 'Get past the Saints thug', need: { fight: 'f_saint' }, target: 'saint' },
      { text: 'Report to Marquis on the avenue', need: { flag: 'marquis1' }, target: 'marquis', only: 'jester' },
      { text: 'Get to the Hartwell mansion', need: { flag: 'seen_yard' }, target: 'to_mansion' },
      { text: { a: 'Talk your way past Seung (crime lab)', j: 'Talk to Seung — he owes you' }, need: { flag: 'seung1' }, target: 'seung' },
      { text: 'Go inside', need: { flag: 'seen_hall' }, target: 'hall_in' },
      { text: 'Examine the girl (5 clues)', need: { clue: ['ivy_body', 'wound', 'watch', 'tape', 'warm'] }, target: ['body', 'wound', 'watch', 'tape', 'warm'] },
      { text: 'KNOWLEDGE CHECK: how long has she been dead?', need: { q: 'k_warm' } },
      { text: 'Photograph the scene before the cops move her', need: { flag: 'recalled' }, target: 'scene' },
      { text: 'Something is moving in the attic', need: { fight: 'f_hour1' }, target: 'hour1' },
      { text: 'Someone is hiding up here...', need: { flag: 'mina1' }, target: 'mina' },
      { text: 'Take Mina to the Historical Society', need: { flag: 'silas1' }, target: 'silas' },
      { text: 'Search the archive drawer', need: { clue: 'poster' }, target: 'archive' },
      { text: 'Read the 1986 case file', need: { clue: 'file86' }, target: 'file86' },
      { text: 'SOLVE: How is she 16 tonight?', need: { q: 'q_how' } },
      { text: 'Let Mina explain the rules', need: { flag: 'rules' }, target: 'mina_soc' },
    ] },

  { id: 'ch2', n: 2, era: '1986', title: 'HALLOWEEN, 1986', mood: 'October 31, 1986. The night Ivy vanished.', music: 'synth86', intro: 'intro2', outro: 'outro2',
    scenes: {
      main: { bg: 'rn_town86', w: 1500, tint: 'dusk', start: 60, music: 'synth86', things: [
        { type: 'prop', x: 120, art: 'car:wagon' }, { type: 'prop', x: 1060, art: 'car:cruiser86' }, { type: 'prop', x: 1340, art: 'car:hatch' },
        { id: 'danny', type: 'npc', x: 260, spr: 'danny', dlg: 'danny', label: 'TALK' },
        { id: 'leon', type: 'npc', x: 330, spr: 'leon', dlg: 'leon', label: 'TALK' },
        { id: 'arcade', type: 'door', x: 640, to: 'arcade', label: 'STARPORT ARCADE' },
        { id: 'deputy', type: 'npc', x: 980, spr: 'deputy', dlg: 'deputy', label: 'TALK' },
        { id: 'to_burbs', type: 'door', x: 1240, to: 'burbs', label: 'CALDER FARM ROAD' },
        { id: 'tail', type: 'chase', x: 1380, car: 'sedan', chase: 'quarry86', then: { flag: 'tailed', dlg: 'tailed' }, label: 'FOLLOW WARD', hidden: 'woods_open' },
        { id: 'to_woods', type: 'door', x: 1460, to: 'woods', label: 'QUARRY WOODS', hidden: 'tailed' },
        { id: 'to_tavern', type: 'door', x: 1120, to: 'tavern', label: 'LUCKY\'S TAVERN', hidden: 'tavern_open' },
        { type: 'glyph', x: 820, y: 70 }, { type: 'med', x: 880 },
      ] },
      arcade: { bg: 'neoncity', w: 1000, tint: 'club', start: 60, music: 'hyper86', things: [
        { id: 'arc_out', type: 'door', x: 30, to: 'main', label: 'MAIN STREET', back: true },
        { id: 'rosa', type: 'npc', x: 300, spr: 'rosa', dlg: 'rosa', label: 'TALK' },
        { id: 'hiscore', type: 'puzzle', puzzle: 'hiscore', x: 520, icon: '🕹', then: { flag: 'hiscore' }, label: 'HIGH SCORES' },
        { id: 'ward', type: 'npc', x: 780, spr: 'silas86', dlg: 'ward', label: 'TALK' },
        { type: 'glyph', x: 900, y: 60 },
      ] },
      burbs: { bg: 'rn_fields', w: 1100, tint: 'night', start: 60, music: 'synth86', things: [
        { id: 'burbs_out', type: 'door', x: 30, to: 'main', label: 'MAIN STREET', back: true },
        { id: 'ivy', type: 'npc', x: 360, spr: 'ivy', dlg: 'ivy', label: 'TALK' },
        { id: 'sketch', type: 'clue', x: 470, clue: 'sketch', label: 'SKETCHBOOK', hidden: 'ivy_talked' },
        { type: 'prop', x: 640, art: 'car:wagon' },
        { id: 'ray', type: 'npc', x: 760, spr: 'ray', dlg: 'ray', label: 'TALK' },
        { id: 'walkie', type: 'puzzle', puzzle: 'walkie', x: 960, icon: '📟', then: { flag: 'woods_open' }, label: 'WALKIE-TALKIE', hidden: 'ivy_talked' },
        { type: 'glyph', x: 600, y: 60 },
      ] },
      tavern: { bg: 'c3', w: 800, tint: 'neon', start: 60, music: 'synth86', things: [
        { id: 'tav_out', type: 'door', x: 30, to: 'main', label: 'MAIN STREET', back: true },
        { id: 'bar_tab', type: 'clue', x: 520, clue: 'bar_tab', label: 'BAR TABS' },
      ] },
      woods: { bg: 'nfa', w: 1400, tint: 'ritual', start: 60, music: 'horror', things: [
        { id: 'woods_out', type: 'door', x: 30, to: 'main', label: 'TOWN', back: true },
        { id: 'hour2', type: 'foe', x: 520, foe: 'hourling', fight: 'f_hour2' },
        { id: 'door_seen', type: 'clue', x: 980, clue: 'door_seen', dlg: 'woods307', label: 'WATCH' },
        { id: 'matchbook', type: 'clue', x: 1120, clue: 'matchbook', label: 'SOMETHING IN THE MUD', hidden: 'saw_door' },
        { type: 'glyph', x: 760, y: 80 },
      ] },
    },
    steps: [
      { text: 'Blend in: talk to the kids on Main Street', need: { flag: 'danny' }, target: 'danny' },
      { text: 'Find Ivy out at the Calder farm', need: { clue: 'ivy_alive' }, target: 'ivy' },
      { text: 'Look at her sketchbook', need: { clue: 'sketch' }, target: 'sketch' },
      { text: 'Talk to Ivy\'s stepdad, Ray', need: { clue: 'ray_said' }, target: 'ray' },
      { text: 'The arcade: talk to Rosa', need: { flag: 'rosa' }, target: 'rosa' },
      { text: 'Check the high-score table', need: { flag: 'hiscore' }, target: 'hiscore' },
      { text: 'Meet the arcade owner', need: { clue: 'arcade_man' }, target: 'ward' },
      { text: 'Write the anonymous tip (you already know what it says)', need: { flag: 'tip' }, target: 'deputy' },
      { text: 'Check Lucky\'s Tavern for Ray\'s alibi', need: { clue: 'bar_tab' }, target: 'bar_tab' },
      { text: 'Talk to Ray again — catch the lie', need: { flag: 'ray_broke' }, target: 'ray' },
      { text: 'SOLVE: Could Ray have done it?', need: { q: 'q_ray' } },
      { text: 'Find the kids\' channel on the walkie', need: { flag: 'woods_open' }, target: 'walkie' },
      { text: 'Ward\'s wagon just pulled out with Ivy in it. FOLLOW IT.', need: { flag: 'tailed' }, target: 'tail' },
      { text: 'Into the quarry woods before 3:07', need: { flag: 'seen_woods' }, target: 'to_woods' },
      { text: 'Get through the woods', need: { fight: 'f_hour2' }, target: 'hour2' },
      { text: '3:07 AM', need: { clue: 'door_seen' }, target: 'door_seen' },
      { text: 'He dropped something', need: { clue: 'matchbook' }, target: 'matchbook' },
      { text: 'SOLVE: Who took Ivy?', need: { q: 'q_ward' } },
    ] },

  { id: 'ch3', n: 3, era: '1947', title: 'THE BLACK ORCHID', mood: 'October 24, 1947. A singer is about to die.', music: 'noir47', intro: 'intro3', outro: 'outro3',
    scenes: {
      street: { bg: 'rn_town47', w: 1400, tint: 'noir', rain: true, start: 60, music: 'noir47', things: [
        { type: 'prop', x: 180, art: 'car:c47' }, { type: 'prop', x: 1180, art: 'car:c47' },
        { id: 'calloway', type: 'npc', x: 340, spr: 'calloway', dlg: 'calloway', label: 'TALK' },
        { id: 'goon1', type: 'foe', x: 760, foe: 'goon', fight: 'f_goon' },
        { id: 'club', type: 'door', x: 1000, to: 'club', label: 'THE BLACK ORCHID' },
        { id: 'to_pd', type: 'door', x: 1360, to: 'precinct', label: 'POLICE PRECINCT' },
        { id: 'getaway', type: 'chase', x: 1180, car: 'c47', chase: 'getaway47', then: { flag: 'chased47', clue: 'gear' }, label: 'CHASE THE CAR', hidden: 'si_seen' },
        { type: 'glyph', x: 560, y: 70 }, { type: 'med', x: 1200 },
      ] },
      club: { bg: 'c3', w: 1300, tint: 'club', start: 60, music: 'swing47', things: [
        { id: 'club_out', type: 'door', x: 30, to: 'street', label: 'STREET', back: true },
        { id: 'barkeep', type: 'npc', x: 260, spr: 'barkeep', dlg: 'barkeep', label: 'TALK' },
        { id: 'vinnie', type: 'npc', x: 520, spr: 'vinnie', dlg: 'vinnie', label: 'TALK' },
        { id: 'vera', type: 'npc', x: 760, spr: 'vera', dlg: 'vera', label: 'TALK', hidden: 'vera_alive', gone: 'vera_dead' },
        { id: 'hart', type: 'npc', x: 1060, spr: 'silaskid', dlg: 'hart', label: 'TALK', hidden: 'vera_talked', gone: 'vera_dead' },
        { id: 'siburn', type: 'clue', x: 1060, clue: 'si_burn', label: 'THE BACK DOOR', hidden: 'vera_dead' },
        { id: 'safe47', type: 'puzzle', puzzle: 'safe47', x: 1140, icon: '👞', then: { clue: 'ledger' }, label: 'SHOESHINE BOX', hidden: 'chased47' },
        { id: 'dressing', type: 'door', x: 1250, to: 'dressing', label: 'BACKSTAGE' },
        { type: 'glyph', x: 900, y: 60 },
      ] },
      dressing: { bg: 'cold', w: 800, tint: 'noir', start: 60, music: 'noir47', things: [
        { id: 'dr_out', type: 'door', x: 30, to: 'club', label: 'CLUB', back: true },
        { id: 'lockbox', type: 'puzzle', puzzle: 'lockbox', x: 360, icon: '💄', then: { clue: 'photo47' }, label: 'JEWELRY BOX' },
        { id: 'vera_body', type: 'clue', x: 620, clue: 'vera_body', label: 'LOOK', hidden: 'vera_dead' },
        { id: 'corpse2', type: 'prop', x: 620, art: 'corpse', hidden: 'vera_dead' },
      ] },
      precinct: { bg: 'skyline', w: 900, tint: 'noir', start: 60, music: 'noir47', things: [
        { id: 'pd_out', type: 'door', x: 30, to: 'street', label: 'STREET', back: true },
        { id: 'booking', type: 'clue', x: 420, clue: 'booking', label: 'BOOKING DESK' },
        { id: 'telegraph', type: 'puzzle', puzzle: 'telegraph', x: 680, icon: '📠', then: { flag: 'telegram' }, label: 'TELEGRAM' },
      ] },
    },
    steps: [
      { text: 'Talk to the detective outside the club', need: { flag: 'calloway1' }, target: 'calloway' },
      { text: 'Get past the doorman', need: { fight: 'f_goon' }, target: 'goon1' },
      { text: 'Blend in at the bar', need: { flag: 'barkeep' }, target: 'barkeep' },
      { text: 'Talk to Vera Lune before her last song', need: { flag: 'vera_talked' }, target: 'vera' },
      { text: 'Talk to Vinnie, the owner', need: { clue: 'vinnie_said' }, target: 'vinnie' },
      { text: 'Who\'s the kid shining shoes by the back door?', need: { clue: 'hart' }, target: 'hart' },
      { text: '3:07 AM. Backstage.', need: { clue: 'vera_body' }, target: 'vera_body' },
      { text: 'Check the back door', need: { clue: 'si_burn' }, target: 'siburn' },
      { text: 'A black car is pulling away from the alley. CHASE IT with Calloway.', need: { flag: 'chased47' }, target: 'getaway' },
      { text: 'Open Vera\'s jewelry box', need: { clue: 'photo47' }, target: 'lockbox' },
      { text: 'Check the booking desk at the precinct', need: { clue: 'booking' }, target: 'booking' },
      { text: 'Decode the telegram on the desk', need: { flag: 'telegram' }, target: 'telegraph' },
      { text: 'Talk to Vinnie again — catch the lie', need: { flag: 'vinnie_broke' }, target: 'vinnie' },
      { text: 'SOLVE: Did Vinnie do it?', need: { q: 'q_vinnie' } },
      { text: 'Open Si\'s shoeshine box', need: { clue: 'ledger' }, target: 'safe47' },
      { text: 'SOLVE: Who is Si?', need: { q: 'q_same' } },
    ] },

  { id: 'ch4', n: 4, era: '1888', title: 'THE GREAT BLIZZARD', mood: 'March 12, 1888. Three feet of snow and still falling.', music: 'box1888', intro: 'intro4', outro: 'outro4',
    scenes: {
      road: { bg: 'pfor', w: 1300, tint: 'snow', snow: true, start: 60, music: 'box1888', things: [
        { id: 'constable', type: 'npc', x: 420, spr: 'constable', dlg: 'constable', label: 'TALK' },
        { id: 'to_town', type: 'door', x: 1260, to: 'town', label: 'RAINCASTER' },
        { type: 'glyph', x: 640, y: 80 },
      ] },
      town: { bg: 'rn_town88', w: 1400, tint: 'snow', snow: true, start: 60, music: 'box1888', things: [
        { id: 'town_back', type: 'door', x: 30, to: 'road', label: 'ROAD', back: true },
        { type: 'prop', x: 200, art: 'car:buggy' },
        { id: 'agnes', type: 'npc', x: 360, spr: 'agnes', dlg: 'agnes', label: 'TALK' },
        { id: 'house', type: 'door', x: 700, to: 'house', label: 'HARTWELL HOUSE' },
        { id: 'works', type: 'door', x: 1350, to: 'works', label: 'CLOCKWORKS' },
        { type: 'glyph', x: 1000, y: 60 }, { type: 'med', x: 560 },
      ] },
      house: { bg: 'cold', w: 900, tint: 'candle', start: 60, music: 'strings1888', things: [
        { id: 'house_out', type: 'door', x: 30, to: 'town', label: 'STREET', back: true },
        { id: 'bernboy', type: 'npc', x: 380, spr: 'bernboy', dlg: 'bernboy', label: 'TALK' },
        { id: 'elias', type: 'npc', x: 620, spr: 'silas88', dlg: 'elias', label: 'TALK' },
        { id: 'portrait88', type: 'clue', x: 820, clue: 'elias', label: 'PORTRAIT' },
      ] },
      works: { bg: 'ind', w: 1300, tint: 'snowdark', start: 60, music: 'strings1888', things: [
        { id: 'works_out', type: 'door', x: 30, to: 'town', label: 'STREET', back: true },
        { id: 'foreman', type: 'npc', x: 300, spr: 'foreman', dlg: 'foreman', label: 'TALK' },
        { id: 'wall88', type: 'puzzle', puzzle: 'wall88', x: 560, icon: '🧱', then: { clue: 'plan' }, label: 'WORKSHOP WALL' },
        { id: 'hour3', type: 'foe', x: 820, foe: 'hourling', fight: 'f_hour3' },
        { id: 'gears', type: 'puzzle', puzzle: 'gears', x: 1020, icon: '⚙', then: { flag: 'gears' }, label: 'ESCAPEMENT' },
        { id: 'tower', type: 'door', x: 1250, to: 'tower', label: 'CLOCK TOWER', hidden: 'gears' },
      ] },
      tower: { bg: 'lab', w: 900, tint: 'ritual', snow: true, start: 60, music: 'horror', things: [
        { id: 'tower_down', type: 'door', x: 30, to: 'works', label: 'STAIRS', back: true },
        { id: 'clocktower', type: 'puzzle', puzzle: 'clocktower', x: 360, icon: '🕰', then: { dlg: 'first_door' }, label: 'THE GREAT CLOCK' },
        { id: 'mainspring', type: 'clue', x: 620, clue: 'mainspring', label: 'MAINSPRING', hidden: 'first_door' },
        { type: 'glyph', x: 800, y: 70 },
      ] },
    },
    steps: [
      { text: 'Blend in with the constable', need: { flag: 'constable' }, target: 'constable' },
      { text: 'Get into Raincaster', need: { flag: 'seen_town' }, target: 'to_town' },
      { text: 'Talk to the Hartwells\' maid', need: { flag: 'agnes' }, target: 'agnes' },
      { text: 'Go into the Hartwell house', need: { flag: 'seen_house' }, target: 'house' },
      { text: 'Talk to the sick boy upstairs', need: { clue: 'bernard_boy' }, target: 'bernboy' },
      { text: 'Look at the portrait', need: { clue: 'elias' }, target: 'portrait88' },
      { text: 'Meet Elias Hartwell', need: { flag: 'elias' }, target: 'elias' },
      { text: 'Search the Clockworks', need: { flag: 'seen_works' }, target: 'works' },
      { text: 'Talk to the foreman', need: { flag: 'foreman' }, target: 'foreman' },
      { text: 'Find what\'s behind the workshop wall', need: { clue: 'plan' }, target: 'wall88' },
      { text: 'Something followed you through the Hour', need: { fight: 'f_hour3' }, target: 'hour3' },
      { text: 'Fix the escapement', need: { flag: 'gears' }, target: 'gears' },
      { text: 'Climb the tower', need: { flag: 'seen_tower' }, target: 'tower' },
      { text: 'Set the great clock to the first minute', need: { flag: 'first_door' }, target: 'clocktower' },
      { text: 'Take the mainspring (history says a stranger did)', need: { clue: 'mainspring' }, target: 'mainspring' },
      { text: 'SOLVE: Why does Elias kill?', need: { q: 'q_why' } },
    ] },

  { id: 'ch5', n: 5, era: '2026', title: 'THE HOUR BETWEEN', mood: 'November 7, 2026. The clock tower comes down at dawn.', music: 'present', intro: 'intro5',
    scenes: {
      society2: { bg: 'cold', w: 1100, tint: 'dark', start: 60, music: 'chime', things: [
        { id: 'to_street5', type: 'door', x: 40, to: 'street5', label: 'STREET', back: true },
        { id: 'partner5', type: 'npc', x: 220, spr: 'PARTNER', dlg: 'partner5', label: 'TALK' },
        { id: 'glove', type: 'clue', x: 400, clue: 'palm2026', label: 'SILAS\'S DESK' },
        { id: 'anagram', type: 'clue', x: 540, clue: 'anagram', label: 'UNDER THE DESK' },
        { id: 'notes', type: 'clue', x: 640, clue: 'one_self', label: 'SILAS\'S NOTES' },
        { id: 'torn', type: 'puzzle', puzzle: 'torn', x: 820, icon: '📄', then: { flag: 'drawing' }, label: 'TORN DRAWING' },
        { id: 'chime_box', type: 'puzzle', puzzle: 'chime', x: 1000, icon: '🎵', then: { flag: 'tower_open' }, label: 'MUSIC BOX' },
      ] },
      street5: { bg: 'nn_city', w: 1200, tint: 'neon', rain: true, start: 60, music: 'boombap', things: [
        { id: 'marquis5', type: 'npc', x: 460, spr: 'marquis', dlg: 'marquis5', label: 'TALK' },
        { id: 'ruth', type: 'npc', x: 820, spr: 'ruth', dlg: 'ruth', label: 'TALK' },
        { id: 's5_soc', type: 'door', x: 40, to: 'society2', label: 'HISTORICAL SOCIETY', back: true },
        { id: 'drive', type: 'chase', x: 1000, car: 'hatch', chase: 'tower', then: { flag: 'arrived', dlg: 'arrived' }, label: 'CHASE SILAS', hidden: 'tower_open' },
        { id: 'to_tower', type: 'door', x: 1150, to: 'tower26', label: 'THE CLOCKWORKS TOWER', hidden: 'arrived' },
      ] },
      tower26: { bg: 'lab', w: 900, tint: 'ritual', start: 60, music: 'boss', things: [
        { id: 't26_down', type: 'door', x: 30, to: 'street5', label: 'DOWN', back: true },
        { id: 'silas_final', type: 'npc', x: 420, spr: 'silas26', dlg: 'silas_final', label: 'CONFRONT', gone: 'silas_fight' },
        { id: 'silas_boss', type: 'foe', x: 620, foe: 'silas', fight: 'f_silas', hidden: 'silas_fight' },
        { id: 'hourdoor', type: 'door', x: 860, to: 'between', label: 'THE HOUR BETWEEN', hidden: 'silas_beaten' },
      ] },
      between: { bg: 's4n', w: 1000, tint: 'between', start: 60, music: 'boss', things: [
        { id: 'wren', type: 'npc', x: 420, spr: 'chrono', dlg: 'wren_final', label: 'WREN', gone: 'wren_fight' },
        { id: 'wren_boss', type: 'foe', x: 560, foe: 'wren', fight: 'f_wren', hidden: 'wren_fight' },
        { id: 'bernard', type: 'foe', x: 760, foe: 'bernard', fight: 'f_bernard', hidden: 'wren_beaten' },
      ] },
    },
    steps: [
      { text: 'Mina took the spring. Find your partner.', need: { flag: 'partner5' }, target: 'partner5' },
      { text: 'KNOWLEDGE CHECK: where do doors land?', need: { q: 'k_ends' } },
      { text: 'SOLVE: Who is the Chronomancer?', need: { q: 'q_killer' } },
      { text: 'Search Silas\'s desk', need: { clue: 'palm2026' }, target: 'glove' },
      { text: 'Look under the desk', need: { clue: 'anagram' }, target: 'anagram' },
      { text: 'Read Silas\'s notes', need: { clue: 'one_self' }, target: 'notes' },
      { text: 'SOLVE: Who has been helping her?', need: { q: 'q_next' } },
      { text: 'Fix Ivy\'s last drawing', need: { flag: 'drawing' }, target: 'torn' },
      { text: { a: 'Ask Ivy\'s mother for help', j: 'Get the crew — and tell Ivy\'s mother' }, need: { flag: 'ruth' }, target: 'ruth' },
      { text: 'Settle it with Marquis', need: { flag: 'marquis5' }, target: 'marquis5', only: 'jester' },
      { text: 'Play the seven notes — they\'re the tower\'s lock', need: { flag: 'tower_open' }, target: 'chime_box' },
      { text: 'Silas is driving her to the Clockworks. CATCH HIM before 3:07', need: { flag: 'arrived' }, target: 'drive' },
      { text: 'Climb the tower', need: { flag: 'seen_tower26' }, target: 'to_tower' },
      { text: 'Confront Silas', need: { flag: 'silas_fight' }, target: 'silas_final' },
      { text: 'Get past him', need: { fight: 'f_silas' }, target: 'silas_boss' },
      { text: 'Go through the door', need: { flag: 'seen_between' }, target: 'hourdoor' },
      { text: 'Face Wren', need: { flag: 'wren_fight' }, target: 'wren' },
      { text: 'STOP THE CHRONOMANCER', need: { fight: 'f_wren' }, target: 'wren_boss' },
      { text: 'BERNARD', need: { fight: 'f_bernard' }, target: 'bernard' },
    ] },

  { id: 'ch6', n: 6, era: '2026', title: 'DAWN', mood: 'The rain stops.', music: 'calm', intro: 'intro6', epilogue: true,
    scenes: {
      dawn: { bg: 'skyline', w: 900, tint: 'dawn', start: 60, music: 'calm', things: [
        { id: 'ruth6', type: 'npc', x: 300, spr: 'ruth', dlg: 'ruth6', label: 'TALK' },
        { id: 'mina6', type: 'npc', x: 560, spr: 'marquis', dlg: 'mina6', label: 'TALK' },
        { id: 'partner6', type: 'npc', x: 760, spr: 'PARTNER', dlg: 'partner6', label: 'TALK' },
      ] },
    },
    steps: [
      { text: 'Talk to Mrs. Calder', need: { flag: 'ruth6' }, target: 'ruth6' },
      { text: { a: 'Talk to Marquis', j: 'Face Marquis' }, need: { flag: 'mina6' }, target: 'mina6' },
      { text: 'Walk to your partner', need: { flag: 'case_done' }, target: 'partner6' },
    ] },
];
/* ------------------------------------------------------------ CAR CHASES (06d-chase.js)
   target: a car to CATCH (pursuit). No target: reach the finish before the clock runs out. */
TM.CHASES = {
  quarry86: { era: '1986', bg: 'rn_town86', car: 'sedan', target: 'wagon', traffic: ['hatch', 'sedan', 'cruiser86', 'wagon'], cop: 'cruiser86', cops: 1, rain: false, leaves: true,
    from: 171, to: 187, secs: 70, music: 'hyper86', finish: 'WARD\'S WAGON', msg: 'Ray\'s pickup. Ward\'s wagon. Don\'t lose him!', copMsg: 'Deputy Hollis is on your tail!',
    winT: 'THE QUARRY GATE', win: 'You stay on Ward\'s bumper all the way to the quarry.', loseT: 'YOU LOST HIM', lose: 'The wagon\'s taillights vanish into the dark.' },
  getaway47: { era: '1947', bg: 'rn_town47', car: 'c47', target: 'limo', traffic: ['c47', 'taxi', 'c47', 'sedan'], cops: 0, rain: true,
    from: 189, to: 205, secs: 70, music: 'noir47', finish: 'THE BLACK CAR', msg: 'Calloway\'s cruiser. The black car from the alley. GO.',
    winT: 'RUN OFF THE ROAD', win: 'You force the black car into a lamppost by the river. The driver is a stranger paid in cash. The back seat is empty except for one thing.', loseT: 'GONE', lose: 'The black car turns onto the bridge and disappears in the rain.' },
  tower: { era: '2026', bg: 'nn_city', car: 'hatch', target: 'sedan', cops: 2, rain: true, from: 164, to: 187, secs: 82, finish: 'SILAS\'S CAR',
    msg: 'Ruth\'s car. Silas has a head start. Catch him before 3:07!', winT: 'CAUGHT HIM', win: 'You ram Silas\'s car into the Clockworks fence.', loseT: 'TOO LATE', lose: 'Silas\'s taillights cross the bridge without you.' },
};

// story hooks: finding a clue / solving a question can open new things
TM.ONCLUE = { poster: ['need_file'], door_seen: ['saw_door'], si_burn: ['si_seen'], vera_body: [], sketch: [] };
TM.ONSOLVE = {};
// Mina is at the Society once you've met her (chapter 1)
TM.CHAPTERS[0].scenes.society.things.push({ id: 'mina_soc', type: 'npc', x: 470, spr: 'chrono', dlg: 'rules', label: 'TALK', hidden: 'mina1' });

/* ------------------------------------------------------------ WHO */
TM.WHO = {
  augie: 'AUGIE', jester: 'JESTER', narr: '', card: '', radio: 'SCANNER',
  mina: 'MINA', chrono: 'MINA', wren: 'WREN HARTWELL', silas26: 'SILAS MORROW', silas86: 'ELI WARD', silaskid: 'SI', silas88: 'ELIAS HARTWELL',
  crew1: 'RICO (MANTIS)', crew2: 'DRE (MANTIS)', crew3: 'GHOST (MANTIS)', marquis: 'MARQUIS', seung: 'SEUNG LEE', hale: 'CHIEF HALE', ruth: 'RUTH CALDER',
  ivy: 'IVY CALDER', rosa: 'ROSA', danny: 'DANNY', leon: 'LEON', ray: 'RAY CALDER', deputy: 'DEPUTY HOLLIS',
  calloway: 'DET. JACK CALLOWAY', vinnie: 'VINNIE MORETTI', vera: 'VERA LUNE', barkeep: 'SAL', goon: 'DOORMAN',
  agnes: 'AGNES', foreman: 'MR. PIKE', constable: 'CONSTABLE', bernboy: 'BERNARD', bernard: 'BERNARD',
};

// speakers drawn with another speaker's sprite
TM.WHOSPR = { mina: 'chrono', wren: 'chrono' };

/* ------------------------------------------------------------ DIALOGUE
   node: {who, text, next | choices:[{t, do, go, say}] | lie:{proof, choices, ok}, do:[...], tell, if}
   acts: clue:x  flag:x  xp:n  cover:-1  blend:-1  ach:x  q:id (opens a check) */
TM.DLG = {
  intro1: [
    { who: 'card', cut: 'cold_open', text: 'RAINCASTER, MARYLAND\nNOVEMBER 6, 2026 · 11:48 PM' },
    { who: 'narr', text: { a: 'You are AUGIE. When you were nine, you escaped the Children of Zyxth — a cult of masked technomancers. You built everything you own from scrap. Your two box-droids, GOLEM I and II, roll along behind you.', j: 'You are JESTER. Four years undercover inside the Mantis crew. Nobody in the crew knows you\'re a cop. Tonight the scanner says a girl was found dead in the Hartwell mansion — with a hole through her that no weapon makes.' } },
    { who: 'narr', text: 'You\'re UNDERCOVER. The *COVER* meter is top-right. Talk like a gangster around the crew, not like a cop. If your cover runs out, they attack.', if: { hero: 'jester' } },
    { who: 'narr', text: 'Walk with ◀ ▶. Press ACTION to look, talk, and go. The *pink arrow* shows your next move. Take your time — nothing here is on a clock. Yet.' },
  ],
  rico: [
    { who: 'crew1', text: 'Keep walking, lady. Mantis turf.', if: { hero: 'augie' }, end: true },
    { who: 'crew1', text: 'J! You hear? Dead girl at the Hartwell place. Cops everywhere.', choices: [
      { t: '"Cops everywhere means product nowhere. Bad night."', do: ['xp:15'] },
      { t: '"I should secure the scene before evidence walks."', do: ['cover:-1'], say: ['crew1', '...Secure the scene? Who says that, J?'] }] },
    { who: 'crew1', text: 'Marquis is on the avenue. He\'s got a job — more of them old watches for the Collector.', do: ['flag:cover1', 'clue:watches'] },
  ],
  marquis1: [
    { who: 'marquis', text: 'J. The Collector wants three more pocket watches by Sunday. Old ones. He pays like they\'re diamonds.' },
    { who: 'marquis', text: 'Weird thing is, every watch we bring him is stopped at the same time. Three-oh-seven.', choices: [
      { t: '"Rich people are weird. Money\'s money."', do: ['xp:15'] },
      { t: '"Have you logged where each watch came from?"', do: ['cover:-1'], say: ['marquis', '"Logged"? Do I look like a detective to you?'] },
      { t: '"Three-oh-seven. Like the dead girl\'s watch?"', do: ['xp:20'], say: ['marquis', '...How do YOU know what was on her watch?'] }] },
    { who: 'marquis', text: 'Go see what the cops know at the Hartwell place. Quiet.', do: ['flag:marquis1'] },
  ],
  dre1: [
    { who: 'crew2', text: 'Don\'t look at me, I\'m working.', if: { hero: 'augie' }, end: true },
    { who: 'crew2', text: 'That old dude at the Historical Society buys antiques too, J. Talks to himself. Hums.' },
  ],
  seung1: [
    { who: 'seung', text: { a: 'Ma\'am, this is a crime sce— wait. You\'re the one who fixed my daughter\'s laptop for free. Okay. Five minutes. Touch nothing.', j: 'Jester? God. Okay. I didn\'t see you. Five minutes. The Chief\'s in a mood.' } },
    { who: 'seung', text: 'I\'ve worked thirty bodies. I\'ve never seen a wound like this. It\'s like something... opened her.', do: ['flag:seung1'] },
  ],
  hale1: [
    { who: 'hale', text: 'This is a closed scene. Who let you through? Doesn\'t matter. It\'s a runaway, it\'s tragic, it\'s done by morning.' },
    { who: 'hale', text: 'Go home. Raincaster doesn\'t need ghost stories.' },
  ],
  mina1: [
    { who: 'narr', text: 'A kid. Maybe twelve. Hood up. Where her eyes should be, a band of *cyan light* — like a strip of sky. Little brass dials tick on her wrists.' },
    { who: 'player', text: { a: 'That light... is that Children tech? Zyxth? I wore their mask once.', j: 'Hey. Hey, I\'m not gonna hurt you. What are you doing up here?' } },
    { who: 'mina', text: 'I felt her come through. A door opened down there at seven past eleven — from a long time ago. She was already hurt.' },
    { who: 'mina', text: 'I\'m Mina. I can open doors in time. People want me for it. I ran. Please don\'t give me back.' },
    { who: 'narr', text: { a: 'Your Golem scans her gauntlets. No Zyxth signature. Just brass. Very old brass.', j: 'She says it all without a single "um". Like she\'s said it before.' } },
    { who: 'player', text: { a: 'Nobody\'s giving you back. Golem — fortress mode. She\'s with us.', j: 'Nobody\'s giving anybody back. Come on. I know a guy who knows old things.' } },
    { who: 'narr', text: 'Downstairs, the police are carrying the girl out. Her watch is in your pocket. Mina is humming something. Seven notes.', do: ['flag:mina1', 'flag:need_archive'] },
  ],
  silas1: [
    { who: 'silas26', text: 'Visitors at midnight. And a little one. Silas Morrow — I keep Raincaster\'s memories. Come in out of the rain.' },
    { who: 'narr', text: 'Ninety-one, and he moves like sixty. A burgundy scarf. A gold watch chain. A glove on his left hand. He doesn\'t ask the girl a single question.' },
    { who: 'silas26', text: 'A girl in a teal windbreaker? Oh... oh, dear. There\'s a drawer you should see.', do: ['flag:silas1', 'flag:need_archive'] },
    { who: 'silas26', text: 'Our tower clock plays the Hartwell Chime every hour. Seven notes, since 1888. They tear the tower down at dawn tomorrow. Progress.' },
  ],
  rules: [
    { who: 'mina', text: 'Okay. Listen, because these don\'t bend.' },
    { who: 'mina', text: 'ONE. A door only opens into a moment you\'re holding a piece of. Her watch stopped at 3:07 on October 31, 1986. So that\'s where it goes.' },
    { who: 'mina', text: 'TWO. What happened, happened. If you go back, you were always there. You can\'t save her. But you can SEE.' },
    { who: 'mina', text: 'THREE. Someone stays here holding the tether, or the traveler can\'t get back. FOUR. The door closes at dawn.' },
    { who: 'mina', text: 'FIVE. Whatever comes through a door lands at the end of whoever opened it. That\'s how I bring you home: you come back to me.' },
    { who: 'player', text: { a: 'Then I go. Jester holds the watch.', j: 'Then I go. Augie holds the watch.' } },
    { who: 'narr', text: 'Silas watches from the doorway. He and Mina hum the same seven notes, at the same time, without looking at each other.', do: ['flag:rules', 'clue:mina_rules'] },
  ],
  outro1: [
    { who: 'card', cut: 'first_jump', text: 'Mina twists the dials on her wrists.\nThe air tears open like wet paper.\n\nOn the other side, someone is playing a synth.' },
  ],
  intro2: [
    { who: 'card', text: 'THE STORY SO FAR\n\nA girl who vanished in 1986 was found dead tonight — still 16.\nA runaway named Mina can open doors in time.\nHer watch stopped at 3:07, Oct 31, 1986. That\'s where you\'re going.' },
    { who: 'card', text: 'OCTOBER 31, 1986 · 7:40 PM\nRAINCASTER, MARYLAND' },
    { who: 'narr', text: 'You\'re a stranger in 1986. People will test you. Say something from the future and they get suspicious — watch your *BLEND* meter. Lose it and the deputy comes for you.' },
    { who: 'narr', text: 'Ivy vanishes at 3:07 AM. You can\'t stop it. Find out who.' },
  ],
  danny: [
    { who: 'danny', text: 'Whoa, cool jacket. You new? We\'re the Static Kids. Me, Leon, Rosa, and Ivy. Ivy\'s the artist.' },
    { who: 'danny', text: 'Hey, quick — who won the World Series this week? Leon thinks I\'m lying.', choices: [
      { t: '"The Mets. Ball went right through Buckner\'s legs."', do: ['xp:20'] },
      { t: '"The Red Sox."', do: ['blend:-1'], say: ['danny', 'Ha! Are you from Boston or Mars?'] },
      { t: '"Who cares, I stream it later."', do: ['blend:-1'], say: ['danny', '...You stream it? What does that even mean?'] }] },
    { who: 'danny', text: 'Ivy\'s out at her farm on the edge of town. We\'re all going out later. She says something\'s been following her.', do: ['flag:danny'] },
  ],
  leon: [
    { who: 'leon', text: 'Ivy keeps drawing this tall antler guy. She says he talks to her at night. I think it\'s cool. Rosa thinks it\'s creepy.' },
    { who: 'leon', text: 'Mr. Ward at the arcade gives Ivy free tokens. Says she has "a gift". Old dudes are weird.' },
  ],
  ivy: [
    { who: 'narr', text: 'You know how this night ends. She doesn\'t.' },
    { who: 'ivy', text: 'Hi? You\'re staring. Do I have paint on my face again?' },
    { who: 'ivy', text: 'You want to see something weird? There\'s a man made of antlers and hands and he says his name is Bernard. He says he\'s lost. He\'s not scary. He\'s sad.' },
    { who: 'ivy', text: 'And there\'s a girl. Little. Light where her eyes go. She says she\'s his sister and she\'s bringing him home. She\'s in my grandma\'s photos from 1947. Same age. Same hood.' },
    { who: 'ivy', text: 'Oh — what year do you think the world ends? Rosa says 2000. Computers or something.', choices: [
      { t: '"Nothing happens in 2000. I promise."', do: ['xp:20'] },
      { t: '"Ask me in 2026."', do: ['blend:-1'], say: ['ivy', '...Okay, weirdo. That\'s like a thousand years from now.'] }] },
    { who: 'ivy', text: 'Mr. Ward\'s driving us to the quarry later. Here — look at my sketchbook. Tell me I\'m not crazy.', do: ['clue:ivy_alive', 'flag:ivy_talked'] },
  ],
  ray: [
    { who: 'ray', text: 'You lost? This is my property.', if: { nclue: 'ray_said' } },
    { who: 'ray', text: 'Tonight? I\'m home all night. Ivy\'s got a curfew. Somebody in this house has to have rules.', do: ['clue:ray_said'], if: { nclue: 'bar_tab' }, tell: 'He looked at the rifle by the door when he said "home". He\'s hiding something.' },
    { who: 'narr', text: 'Ray drinks somewhere, by the smell of him. Maybe Lucky\'s Tavern on Main.', if: { nclue: 'bar_tab' }, do: ['flag:tavern_open'], end: true },
    { who: 'ray', text: 'I told you. I was home all night.', lie: { proof: 'bar_tab', choices: ['bar_tab', 'sketch', 'matchbook'], ok: 'ray_ok' }, if: { nflag: 'ray_broke' } },
  ],
  ray_ok: [
    { who: 'ray', text: '...Fine. I go to Lucky\'s. I drink till close. I drive home stupid. Her mom left. I\'m not good at this.', do: ['flag:ray_broke'] },
    { who: 'ray', text: 'If something happens to that kid tonight, it\'s on me for not being here. You hear me? That\'s on me.' },
  ],
  rosa: [
    { who: 'rosa', text: 'You\'re not from here. Nobody wears shoes like that. What year are you from, the future?', choices: [
      { t: '"Baltimore. Same thing."', do: ['xp:15'] },
      { t: '"Yeah, actually."', do: ['blend:-1'], say: ['rosa', 'Ha ha. Very funny. Weirdo.'] }] },
    { who: 'rosa', text: 'Ever since the shuttle blew up in January, my mom won\'t let me watch the news. Like I\'m a baby.', choices: [
      { t: '"Challenger. That was awful."', do: ['xp:15'] },
      { t: '"Columbia? Yeah, that was bad."', do: ['blend:-1'], say: ['rosa', 'Columbia\'s fine. It was CHALLENGER. Were you under a rock?'] }] },
    { who: 'rosa', text: 'Mr. Ward watches Ivy play. Every night. Hums the same weird song. Check the high scores — he plays too.', do: ['flag:rosa'] },
  ],
  ward: [
    { who: 'silas86', text: 'Tokens are four for a dollar, friend. Eli Ward. I run this little spaceport.' },
    { who: 'narr', text: 'Gray before his time — can\'t be much past fifty. Burgundy scarf. Gold watch chain. You saw that scarf and that chain tonight — on a ninety-one-year-old man, forty years from now.', do: ['clue:arcade_man'] },
    { who: 'silas86', text: 'Ivy? Remarkable girl. She sees things the rest of us have forgotten how to see. I\'m giving the kids a ride out to the quarry tonight.' },
    { who: 'narr', text: 'He offers his hand. You shake it. Your thumb finds a round, hard scar in the middle of his palm.', do: ['clue:scar'] },
    { who: 'silas86', text: 'Ha. Old burn. I held a door I shouldn\'t have. I was twelve.' },
  ],
  deputy: [
    { who: 'deputy', text: 'Evening. Halloween\'s for kids. You\'re not a kid.' },
    { who: 'narr', text: 'You remember the 1986 file. The anonymous tip. The handwriting that looked like yours.', if: { nflag: 'tip' } },
    { who: 'deputy', text: 'Something to report, drifter?', if: { nflag: 'tip' }, choices: [
      { t: 'Hand him a note: "Look at the arcade owner. He hums the same song every night."', do: ['flag:tip', 'xp:40'], say: ['deputy', 'Uh huh. I\'ll file it. Sure.'] },
      { t: '"Nothing, officer."' }] },
    { who: 'narr', text: 'He files it. In forty years you\'ll read it in a drawer. It already happened.', if: { flag: 'tip' }, do: ['flag:tavern_open'] },
  ],
  tailed: [
    { who: 'narr', text: 'Ward\'s wagon is parked crooked at the quarry gate, doors open, engine ticking. Footprints — his, and Ivy\'s sneakers — lead into the trees.' },
    { who: 'narr', text: 'You were close enough to see her face in the back window. She was laughing. She thought it was an adventure.' },
  ],
  woods307: [
    { who: 'narr', cut: 'woods307', text: '3:07 AM. The air in the clearing folds open into a circle of light.' },
    { who: 'narr', text: 'Eli Ward walks Ivy to the edge of it. On the far side, holding the door open from somewhere else entirely, stands a small hooded figure with a band of cyan light where her eyes should be.' },
    { who: 'player', text: 'That light where her eyes should be... No. Mina\'s forty years away, holding the door for ME. ...Isn\'t she?' },
    { who: 'narr', text: 'Ivy steps through. The circle snaps shut. Ward stands alone in the dark, holding his left hand, crying. Something falls out of his coat into the mud.', do: ['clue:door_seen'] },
  ],
  outro2: [
    { who: 'card', text: 'The door closes at dawn.\nYou land back in 2026 — at Mina\'s feet on the Historical Society floor — holding a matchbook from 1947.' },
    { who: 'mina', text: 'You were gone four hours. For me it was a minute. Did you see who took her?' },
    { who: 'player', text: 'Eli Ward. And someone small holding the door from the other side.' },
    { who: 'mina', text: '...Then we follow the matchbook. 1947. Hold it tight.' },
    { who: 'narr', text: 'Silas\'s office door is closed. Behind it, someone is humming.' },
  ],
  intro3: [
    { who: 'card', text: 'THE STORY SO FAR\n\nEli Ward walked Ivy into a door of light at 3:07.\nSomeone small held it open from the other side.\nWard dropped a matchbook: The Black Orchid, 1947.' },
    { who: 'card', text: 'OCTOBER 24, 1947 · 10:15 PM\nTHE BLACK ORCHID CLUB' },
    { who: 'narr', text: 'Vera Lune sings her last song tonight. The matchbook says 3:07 — in a child\'s handwriting. "I KEEP THE DOOR."' },
  ],
  calloway: [
    { who: 'calloway', text: 'Jack Calloway, Raincaster PD. You\'re dressed like a Martian, pal.' },
    { who: 'calloway', text: 'Did you read the papers in July? Flying saucer in Roswell. Army says it was a weather balloon.', choices: [
      { t: '"A weather balloon. Sure."', do: ['xp:15'] },
      { t: '"That gets argued about for the next eighty years."', do: ['blend:-1'], say: ['calloway', '...Eighty years. Okay, Nostradamus.'] }] },
    { who: 'calloway', text: 'I\'m watching the Orchid. Vinnie Moretti runs card games in the back. And somebody\'s been leaving the singer flowers. Clock-faced orchids. The shoeshine kid delivers them.', do: ['flag:calloway1'] },
  ],
  barkeep: [
    { who: 'barkeep', text: 'What\'ll it be? Biggest news in baseball this year — name it and the first one\'s on me.', choices: [
      { t: '"Jackie Robinson. Brooklyn Dodgers."', do: ['xp:20'], say: ['barkeep', 'Darn right. Kid can MOVE.'] },
      { t: '"Babe Ruth\'s 60 home runs."', do: ['blend:-1'], say: ['barkeep', 'That was 1927, pal. Where you been?'] }] },
    { who: 'barkeep', text: 'A pilot came in last week, swore nobody\'ll ever fly faster than sound. What do you think?', choices: [
      { t: '"Maybe someday."', do: ['xp:20'] },
      { t: '"Chuck Yeager already did it."', do: ['blend:-1'], say: ['barkeep', 'Yeager? Never heard of him. You a spy or something?'] }] },
    { who: 'barkeep', text: 'Vera goes on at eleven. Vinnie\'s at the bar. Little Si shines shoes out back — sweet kid. Mama\'s sick.', do: ['flag:barkeep', 'flag:vera_alive'] },
  ],
  vera: [
    { who: 'vera', text: 'You\'re the first person tonight who looked at my face and not my dress.' },
    { who: 'vera', text: 'There\'s a little girl who comes to every show. Hood up, never takes it off. She asks for one song — seven notes, no words. She asked me to sing it backstage after the last set. At three.' },
    { who: 'narr', text: 'You can\'t warn her. You try anyway. The words come out wrong, like the night won\'t let them through.' },
    { who: 'vera', text: 'Sweet of you. Don\'t worry about me, sugar. I\'ve handled worse than a kid in a hood.', do: ['flag:vera_talked'] },
  ],
  vinnie: [
    { who: 'vinnie', text: 'You\'re in my club. Buy a drink or get lost.', if: { nclue: 'vinnie_said' } },
    { who: 'vinnie', text: 'Tonight? I\'m right here at this bar all night. Ask anybody.', do: ['clue:vinnie_said'], if: { nclue: 'booking' }, tell: 'He keeps glancing at the door. He\'s expecting someone. Cops?' },
    { who: 'narr', text: 'Calloway mentioned gambling raids. Maybe the precinct knows where Vinnie really goes.', if: { nclue: 'booking' }, end: true },
    { who: 'vinnie', text: 'I told you. Right here. All night.', lie: { proof: 'booking', choices: ['booking', 'hart', 'photo47'], ok: 'vinnie_ok' }, if: { nflag: 'vinnie_broke' } },
  ],
  vinnie_ok: [
    { who: 'vinnie', text: '...Alright, alright. Cops pinched my card game at half past eleven. I spent the night in a cell. Happy?', do: ['flag:vinnie_broke'] },
    { who: 'vinnie', text: 'And the shoeshine kid? Si? He asked me for the back door key. Said a little girl wanted to hear Vera sing up close. I figured, what\'s the harm.' },
  ],
  hart: [
    { who: 'silaskid', text: 'Shine, mister? Nickel. I\'m Si. ...Your shoes are weird.' },
    { who: 'narr', text: 'Twelve years old. Burgundy scarf. A gold watch chain far too nice for a shoeshine boy. He hums seven notes while he works.', do: ['clue:hart'] },
    { who: 'silaskid', text: 'My mama\'s real sick. But a friend of mine says she can get her more time. Lots more. I just gotta keep a door for her.' },
    { who: 'narr', text: 'At 2:58 AM, Si packs up his kit, looks at the back door, and swallows hard. Then he goes to hold it open.' },
    { who: 'narr', cut: 'orchid307', text: 'You run for the dressing room. You already know you\'re too late. It already happened.', do: ['flag:hart_left', 'flag:vera_dead'] },
  ],
  outro3: [
    { who: 'card', text: 'Dawn closes the door.\nIn your hand: a brass gear somebody left for you.\nHARTWELL CLOCKWORKS · MARCH 12, 1888.' },
    { who: 'mina', text: 'That\'s the oldest one. If he started there, that\'s where the first door is.' },
    { who: 'mina', text: '...My hands are shaking. Going that far will hurt. Hold the gear tight, okay?' },
  ],

  intro4: [
    { who: 'card', text: 'THE STORY SO FAR\n\nSi, a shoeshine boy, held the door for a hooded girl. Vera died.\nSi grew up to be Eli Ward.\nThe getaway car left you a gear: Hartwell Clockworks, 1888. The oldest door.' },
    { who: 'card', text: 'MARCH 12, 1888 · 11:20 PM\nTHE GREAT BLIZZARD' },
    { who: 'narr', text: 'Snow to your knees. Gas lamps. No phones in pockets — no pockets you\'d recognize. Blend in, or the constable will take you in for vagrancy.' },
  ],
  constable: [
    { who: 'constable', text: 'You there! What fool walks the road in this? Name your business.' },
    { who: 'constable', text: 'And who\'s President, stranger? Quick now.', choices: [
      { t: '"Mr. Cleveland."', do: ['xp:20'], say: ['constable', 'Aye. Pass, then, before you freeze.'] },
      { t: '"Lincoln?"', do: ['blend:-1'], say: ['constable', 'Lincoln\'s been dead twenty-three years! You\'re coming with me.'] },
      { t: '"Theodore Roosevelt."', do: ['blend:-1'], say: ['constable', 'The New York dandy? You\'re drunk. Come along.'] }] },
    { who: 'constable', text: 'The Hartwell clockworks are lit all night. Old Elias hasn\'t slept since the boy took sick.', do: ['flag:constable'] },
  ],
  agnes: [
    { who: 'agnes', text: 'Oh! You startled me. I\'m Agnes, I keep house for Mr. Hartwell. Any news from abroad, from London?', choices: [
      { t: '"Nothing much, ma\'am."', do: ['xp:20'] },
      { t: '"Just Jack the Ripper."', do: ['blend:-1'], say: ['agnes', 'Jack the... who? What a horrid name. You frighten me.'] }] },
    { who: 'agnes', text: 'The young master is dying. Consumption. Mr. Hartwell says he\'s building something to "give him more time". He talks to the great clock like it\'s a person.' },
    { who: 'agnes', text: 'And Miss Wren — Bernard\'s twin — sneaks up the tower every night, humming the clock\'s tune. She says wherever Bernard goes, she goes. She made her father promise.', do: ['flag:agnes', 'clue:agnes_saw'] },
  ],
  bernboy: [
    { who: 'bernboy', text: '*cough* ...Are you a doctor? Father says a new doctor is coming. A doctor from far away.' },
    { who: 'bernboy', text: 'Father says I\'m going to wait in a room where time stops, until there\'s medicine. He says it won\'t hurt. Wren says she\'s coming with me. She always does.' },
    { who: 'bernboy', text: 'Will you tell her I\'m not scared? I\'m a little scared.', do: ['clue:bernard_boy'] },
  ],
  elias: [
    { who: 'silas88', text: 'You\'ve come for the boy? No. You\'re not the doctor. You have the look of someone who\'s been somewhere they shouldn\'t.' },
    { who: 'silas88', text: 'I have found a space between the seconds, stranger. A room where nothing grows older. I will put my son in it, and when the world has a cure, I will bring him out.' },
    { who: 'silas88', text: 'My daughter wants to go with him. She can\'t. ...She doesn\'t listen. At seven minutes past three, the great clock opens.', do: ['flag:elias'] },
  ],
  foreman: [
    { who: 'foreman', text: 'Pike. Foreman. You\'re not one of mine. Doesn\'t matter — nobody\'s working, we\'re snowed in.' },
    { who: 'foreman', text: 'The old man\'s had me take the escapement apart three times. Says the clock must strike EXACTLY right. There\'s a wall in his workshop he won\'t let anyone near.', do: ['flag:foreman'] },
  ],
  first_door: [
    { who: 'narr', cut: 'first_door', text: 'Three o\'clock. The great clock shudders. Seven notes ring out over the snow — the Hartwell Chime.' },
    { who: 'narr', text: 'Elias carries his son into the circle of light. A small girl in a hood breaks from the stairs and runs in after them. "WREN — NO!"' },
    { who: 'narr', text: 'The circle closes. Silence. Then something on the other side begins to *knock*.' },
    { who: 'narr', text: 'The light tears open a little. What reaches out is too tall, with too many hands, wearing Bernard\'s face in its chest. Then the girl walks out under its arm.' },
    { who: 'narr', text: 'Where Wren\'s eyes were, there\'s a band of cyan light. She turns that light on you. And you know her. *Mina.*', do: ['flag:first_door', 'clue:wren_out'] },
    { who: 'mina', text: '...Oh. It\'s you. It was always going to be you. Take the spring, stranger. The records say you did.' },
  ],
  outro4: [
    { who: 'card', cut: 'stolen_spring', text: 'You come back through the door with the mainspring of the great clock in your hands.' },
    { who: 'mina', text: 'Thank you. I\'ve waited a hundred and thirty-eight years for you two.' },
    { who: 'narr', text: 'She takes the mainspring out of your hands like it\'s a gift. Silas is in the doorway with his car keys. Your partner is on the floor, out cold.' },
    { who: 'mina', text: 'Don\'t follow us. You\'ve done enough. You did exactly enough.' },
  ],
  intro5: [
    { who: 'card', text: 'THE STORY SO FAR\n\nIn 1888, Wren Hartwell followed her dying twin into the Hour — and came out as Mina.\nShe needed you to steal the mainspring. You did.\nNow she and Silas have it. 3:07 is coming.' },
    { who: 'card', text: 'NOVEMBER 7, 2026 · 2:31 AM\nTHE TOWER COMES DOWN AT DAWN' },
    { who: 'narr', text: 'Thirty-six minutes until 3:07. The Chronomancer has the spring. With it, the great clock can open the biggest door she\'s ever made.' },
  ],
  partner5: [
    { who: 'PARTNER', text: { a: 'She was so small. She just walked past me and Silas hit me with the cane. She didn\'t even look back.', j: 'Silas swung that cane like a twenty-year-old. The kid took the spring and said "thank you". THANK YOU.' } },
    { who: 'player', text: 'She\'s Wren Hartwell. She\'s been twelve since 1888. Let\'s prove it — and stop her before 3:07.', do: ['flag:partner5'] },
  ],
  marquis5: [
    { who: 'marquis', text: 'Word is the Collector is the old archivist. The guy buying our watches. And word is you\'re a cop, J.' },
    { who: 'marquis', text: 'So which is it?', choices: [
      { t: '"I\'m a cop. And those watches you sold him were keys. A kid\'s been using them to kill people since 1888. I need the crew."', do: ['xp:40'] },
      { t: '"I\'m Mantis. Always."', say: ['marquis', 'Don\'t. Lie. To me. Not tonight.'] }] },
    { who: 'marquis', text: '...Four years at my table. You eat with us. You laugh with us.' },
    { who: 'marquis', text: 'Fine. Tonight the Mantis crew hunts the Collector. Tomorrow we talk about what you are. Whistle and we come.', do: ['flag:marquis5', 'flag:crew_ready'] },
  ],
  ruth: [
    { who: 'ruth', text: 'They said they found my Ivy. Forty years I left the porch light on. Forty years.' },
    { who: 'ruth', text: 'They said she was still sixteen. How can that be? How can my baby still be sixteen?' },
    { who: 'player', text: 'Someone took her out of her time. I saw her, Mrs. Calder. She was brave. She was funny. She felt sorry for the thing she drew.' },
    { who: 'ruth', text: 'That sounds like her. ...Silas Morrow\'s big black car just went by toward the Clockworks, with a child in it. Take my car. Drive fast.', do: ['flag:ruth'] },
  ],
  arrived: [
    { who: 'narr', text: 'Silas\'s car spins out against the Clockworks fence. The passenger door is already open. A small hooded figure is climbing the tower stairs with the mainspring under her arm.' },
    { who: 'narr', text: 'Silas gets out slowly, cane first. He doesn\'t run. He stands between you and the stairs.' },
  ],
  silas_final: [
    { who: 'silas26', text: 'You caught up. Of course you did. You always do — she showed me the records when I was twelve.' },
    { who: 'silas26', text: 'Do you know what she gave me? My mother lived to 1990. Forty-three extra years. Wren keeps her promises.' },
    { who: 'player', text: 'She paid for them with Vera. With Ivy. With everyone in that ledger.' },
    { who: 'silas26', text: 'And tonight she pays with all of Raincaster, and her brother comes home. I hold the door. That\'s all I\'ve ever done. ...It\'s 3:05.', do: ['flag:silas_fight'] },
  ],
  silas_end: [
    { who: 'narr', text: 'Silas goes down hard. The borrowed years she lent him slide off him like a coat — and he\'s just ninety-one again, gasping on the floorboards.' },
    { who: 'silas26', text: 'She\'s... through there. Don\'t hurt her. She was only ever twelve.' },
    { who: 'narr', text: 'Behind him, a door of light hangs in the tower, the great clock grinding around it.', do: ['flag:silas_beaten'] },
  ],
  wren_final: [
    { who: 'narr', cut: 'between', text: 'Stars, all the way down. The great clock\'s face floats in the dark like a moon.' },
    { who: 'wren', text: 'You came all this way. Through four centuries. For people you never met.' },
    { who: 'wren', text: 'He\'s right there. Can you hear him knocking? One more door — the whole town at once — and Bernard comes home. ALL of him.' },
    { who: 'player', text: 'Wren. That thing isn\'t your brother. Your brother waved goodbye in 1888.' },
    { who: 'wren', text: 'He waved at ME. ...It\'s 3:07.', do: ['flag:wren_fight'] },
  ],
  wren_end: [
    { who: 'narr', text: 'The dials on Wren\'s wrists crack. The band of light over her eyes flickers — and for a second there are just a girl\'s eyes under it. Gray. Tired.' },
    { who: 'wren', text: 'I\'m so tired. A hundred and thirty-eight years tired.' },
    { who: 'narr', text: 'Behind her, the stars move. Something very tall stands up out of the dark with a face in its chest, and the face is crying.', do: ['flag:wren_beaten'] },
  ],
  bernard_end: [
    { who: 'narr', text: 'Bernard stops. The hands fold. The face in its chest looks at you — and for one second it\'s just a boy.' },
    { who: 'bernard', text: '...is... father... coming...' },
    { who: 'narr', text: 'The mainspring is in your hand. You can stop the great clock forever and let him rest — or wind it, and open the door all the way.', choices: [{ t: 'LET HIM REST. Stop the clock.', go: 'end_rest' }, { t: 'BRING HIM HOME. Wind it.', go: 'end_home' }] },
  ],
  end_rest: [
    { who: 'player', text: 'He\'s not coming back, Wren. Neither of you have to wait anymore.' },
    { who: 'narr', cut: 'end_rest', text: 'You break the mainspring. The stars go out one by one. Wren takes her brother\'s hand — just a boy\'s hand now — and two children walk into the light, waving.', do: ['flag:rested', 'ach:rest'] },
  ],
  end_home: [
    { who: 'narr', text: 'You wind the spring. The door opens wide. Bernard steps through into 2026 — all of him — with his sister holding his hand.', do: ['flag:home', 'ach:home'] },
    { who: 'narr', text: 'Your partner grabs your arm. "Close it. NOW." You do. Barely. Somewhere in Raincaster, a girl with light for eyes is walking her very tall brother home.' },
  ],
  intro6: [{ who: 'card', text: 'NOVEMBER 7, 2026 · 6:51 AM\nDAWN' }, { who: 'narr', text: 'The tower comes down at seven. For the first time in forty-one days, it isn\'t raining.' }],
  ruth6: [{ who: 'ruth', text: 'I don\'t understand any of it. But I understand this.' }, { who: 'narr', text: 'She holds up Ivy\'s last drawing. A tall, sad shape with antlers — and a little boy, waving, walking away from it into the light.' }, { who: 'ruth', text: 'Thank you for bringing her home.', do: ['flag:ruth6'] }],
  mina6: [
    { who: 'marquis', text: { a: 'So the old man\'s watches were keys to dead people. And J\'s a cop. Long night.', j: 'Four years, J. Four years.' } },
    { who: 'marquis', text: { a: 'Tell him he\'s got till Monday.', j: '...You came back for the town. Not the badge. I\'ll think about that. You got till Monday.' }, do: ['flag:mina6'] },
  ],
  partner6: [
    { who: 'PARTNER', text: { a: 'Marquis gave me till Monday to explain myself. Seung already wants to see the mainspring. And Hale wants to know who wrecked his crime scene.', j: 'Silas asked for you. From the hospital. He said to say thank you. He didn\'t say for what.' } },
    { who: 'card', text: 'The tower falls at 7:00 AM exactly.\n\nIn the rubble, a construction worker finds a pocket watch.\nIt is stopped at 3:07.\nThe engraving says: CASE 02.', do: ['flag:case_done'] },
  ],
};

/* ------------------------------------------------------------ FIGHTS */
TM.FIGHTS = {
  f_saint: { foe: 'thug', tip: 'Fights are LIVE. Move with ◀ ▶. Tap ATTACK in rhythm for a 3-hit combo. When a wind-up shows over its head, DODGE through it — you can\'t be hit mid-roll. RED wind-ups are heavy hits. Some wind-ups are fakes.' },
  f_hour1: { foe: 'hourling', tip: 'HOURLINGS go perfectly still before a big hit. Interrupt it — Augie: swap to THUNDERCLAP or fire a TASER round · Jester: SHOTGUN — or roll through it.' },
  f_hour2: { foe: 'hourling' }, f_hour3: { foe: 'hourling' },
  f_goon: { foe: 'goon' }, f_constable: { foe: 'constable' },
  f_law86: { foe: 'deputy', tip: 'You blew your cover in 1986. Get out of this.' },
  f_law47: { foe: 'goon', tip: 'You blew your cover in 1947. The doorman doesn\'t like you.' },
  f_law88: { foe: 'constable', tip: 'You blew your cover in 1888. The constable is taking you in.' },
  f_blown: { foe: 'mantis', tip: 'YOUR COVER IS BLOWN! The Mantis crew knows you\'re a cop.' },
  f_silas: { foe: 'silas', boss: true, end: 'silas_end', tip: 'Silas fights on borrowed years. When he checks his watch, he REWINDS — hit him hard before and after.' },
  f_wren: { foe: 'wren', boss: true, end: 'wren_end', tip: 'The Chronomancer skips through time: she blinks behind you, rewinds once, and her circle-trace is a killing blow. DODGE THE CIRCLE.' },
  f_bernard: { foe: 'bernard', boss: true, end: 'bernard_end' },
};

/* ------------------------------------------------------------ FILES */
TM.FILES = {
  augie: ['AUGIE', 'Escaped the Children of Zyxth at nine. Engineer. Builds from scrap. Carries the Hush Crook Mk III — a 186 cm rifle-built staff that takes eight heads — and two box-droids, Golem I and II.'],
  jester: ['JESTER', 'Former Baltimore detective, four years undercover in the Mantis crew. Keeps a jester mask from his old life — blue, red and yellow. When he puts it on, he stops thinking.'],
  mina: ['MINA', 'Says she\'s twelve and a runaway. Opens doors in time with two brass wrist dials. A band of cyan light where her eyes should be. Hums the Hartwell Chime.'],
  wren: ['WREN HARTWELL', 'Bernard\'s twin, born 1876. Followed him into the Hour Between on March 12, 1888. Came out unable to age, able to open doors through time — and through people. Has called herself many names. Lately: Mina.'],
  rules: ['THE RULES OF TIME', 'TETHER: you go where an object from that moment takes you. FIXED: the past already happened, with you in it. ANCHOR: someone holds the tether in the present. DAWN: the door closes at sunrise.'],
  ivy: ['IVY CALDER', '16. Artist. Vanished October 31, 1986. Found November 6, 2026 — still sixteen. She could see Bernard. She felt sorry for him.'],
  vera: ['VERA LUNE', 'Singer at the Black Orchid. Died October 24, 1947, backstage, 3:07 AM. The police called it "an unusual wound".'],
  silas: ['SILAS MORROW', 'Archivist, 91. As a boy, "Si" shined shoes at the Black Orchid and held the back door for a girl who promised his mother more time. As "Eli Ward" he drove Ivy Calder to the quarry. Buys 3:07 watches through the Mantis crew: keys to her doors.'],
  elias: ['ELIAS HARTWELL', 'Master clockmaker, 1888. Built the great clock to hide his dying son between the seconds. Lost both his children to it in one minute.'],
  bernard: ['BERNARD', 'Bernard Hartwell, 12, dying of consumption, carried into the Hour Between in 1888. Something came back wearing his face. His sister has been feeding it lives ever since.'],
  zyxth: ['THE CHILDREN OF ZYXTH', 'A cult of masked technomancers. Masks turn the skin light blue. Every member carries an OmniBox — a living computer — on their back.'],
  golems: ['GOLEM I & II', 'Two 16 kg box-droids on treads. Modes: drone, battle, fortress, camouflage, medic, detective, and self-destruct (Augie\'s code only).'],
  mask: ['THE JESTER MASK', 'Blue and red horns, gold bells, a white face. Jester\'s mother made it for a Mardi Gras parade. He hasn\'t said what happened the last time he wore it.'],
  raincaster: ['RAINCASTER, MD', 'A river town that floods every forty years. The Hartwell clock tower has played the same seven notes every hour since 1888.'],
};

/* ------------------------------------------------------------ FEATS */
TM.FEATS = {
  first_clue: ['First Clue', 'Find your first clue.', 20],
  first_solve: ['Detective', 'Answer your first case question right.', 30],
  historian: ['Time Tourist', 'Pass 6 history checks without a slip.', 80],
  lie1: ['Liar Liar', 'Catch your first lie.', 30],
  lie5: ['Human Lie Detector', 'Catch 5 lies.', 80],
  crit5: ['Combo Artist', 'Finish 10 three-hit combos.', 60],
  dodge5: ['Untouchable', 'Dodge through 5 attacks.', 60],
  swap: ['Push · Turn · Click', 'Swap all four staff heads in one fight.', 60],
  mask: ['Mardi Gras', 'Put on the mask.', 40],
  crew: ['Whistle', 'Call the Mantis crew.', 40],
  blend: ['Ghost of Christmas Past', 'Finish a past era without slipping once.', 80],
  perfect: ['Perfect Chapter', 'Get 3 stars on a chapter.', 60],
  allstars: ['Gold Badge', 'Get 3 stars on every chapter.', 300],
  glyphs: ['Lost Seconds', 'Find every lost second (◆) in a chapter.', 40],
  noko: ['Still Standing', 'Finish a chapter without getting knocked out.', 40],
  silas: ['Door Closed', 'Get past Silas.', 120],
  wren: ['Time\'s Up', 'Defeat the Chronomancer.', 200],
  boss: ['Wrong Body', 'Face Bernard.', 200],
  rest: ['Let Him Rest', 'Stop the clock.', 30],
  home: ['Bring Him Home', 'Wind the clock.', 30],
  case1: ['Case Closed', 'Finish the story.', 200],
  both: ['Two Sides', 'Finish as Augie AND Jester.', 300],
  puzzler: ['Puzzle Master', 'Solve every puzzle.', 150],
  chatty: ['People Person', 'Have a real conversation with 5 different people.', 60],
  daily1: ['Daily Detective', 'Solve a Daily Case.', 30],
  streak3: ['On a Roll', '3-day Daily Case streak.', 80],
  streak7: ['Habit', '7-day Daily Case streak.', 200],
};
TM.RANKS = [[0, 'ROOKIE'], [200, 'DETECTIVE'], [500, 'INSPECTOR'], [900, 'CASE BREAKER'], [1400, 'TIME TRACKER'], [2100, 'CHRONO HUNTER'], [3000, 'LEGEND']];

/* ------------------------------------------------------------ DAILY CASE pool (deduction + history) */
TM.DAILY = [
  { s: 'A man says he walked home in the rain. His shoes and jacket are bone dry.', q: 'What proves he\'s lying?', a: ['His dry clothes', 'His tone of voice', 'He looks tired'], ok: 0 },
  { s: 'A letter is dated 1943. It mentions a "TV dinner" for supper.', q: 'Why is the letter suspicious?', a: ['TV dinners came out in 1953', 'People didn\'t eat supper', 'Nothing is wrong'], ok: 0 },
  { s: 'A diary from 1910 says "I watched the comet tonight."', q: 'Could that be real?', a: ['Yes — Halley\'s Comet came by in 1910', 'No — comets weren\'t visible then', 'No — diaries didn\'t exist'], ok: 0 },
  { s: 'A store clerk says the robber was tall. The camera shows him barely reaching a 5-foot sign.', q: 'Who\'s right?', a: ['The camera — the robber was short', 'The clerk', 'You can\'t tell'], ok: 0 },
  { s: 'A "1920s" photo shows a man holding a ballpoint pen.', q: 'What\'s off?', a: ['Ballpoint pens became common in the 1940s–50s', 'Men didn\'t write', 'Nothing'], ok: 0 },
  { s: 'Glass from a broken window is on the INSIDE floor.', q: 'Where was it broken from?', a: ['The outside', 'The inside', 'You can\'t tell'], ok: 0 },
  { s: 'A witness says the getaway car was red. It was 2 AM on a street with no lights.', q: 'Why double-check?', a: ['Color is hard to see in the dark', 'Red cars are rare', 'Witnesses always lie'], ok: 0 },
  { s: 'A man claims he was on the Titanic in 1915.', q: 'Why is that impossible?', a: ['It sank in 1912', 'It never sailed', 'It sank in 1920'], ok: 0 },
  { s: 'A painter says she hasn\'t been in her studio in a week. Her newest canvas is still wet.', q: 'What proves she was there?', a: ['The wet paint', 'The clean floor', 'Her brushes'], ok: 0 },
  { s: 'Footprints in the snow go TO the shed. None come back.', q: 'Best guess?', a: ['Whoever made them may still be inside', 'They flew', 'The prints are fake'], ok: 0 },
  { s: 'A 1985 "home video" shows a kid texting on a smartphone.', q: 'What gives it away?', a: ['Smartphones came decades later', 'Kids didn\'t have homes', 'Video wasn\'t invented'], ok: 0 },
  { s: 'A body is stiff all over. A doctor says stiffness peaks about 12 hours after death.', q: 'Roughly when did they die?', a: ['About half a day ago', 'Five minutes ago', 'A month ago'], ok: 0 },
  { s: 'Three neighbors heard the gunshot at 11 PM; one was watching a show that ends at 11. One man says 10 PM.', q: 'Which time is stronger?', a: ['11 PM', '10 PM', 'Neither'], ok: 0 },
  { s: 'A man says he\'s never been to the beach town. His car has a beach parking pass dated yesterday.', q: 'What proves he was there?', a: ['The parking pass', 'His tan', 'He likes beaches'], ok: 0 },
];

/* ------------------------------------------------------------ AI CHARACTERS (06c-talk.js) */
TM.MINDS = {
  rico: { name: 'Rico', gang: true, who: 'Young Mantis lookout, jumpy, loyal, talks a lot.', knows: 'A dead girl was found at the Hartwell mansion; the crew steals antique watches for "the Collector".', hides: 'Nothing.',
    lines: { greet: 'Yo.', victim: 'Dead girl at the Hartwell place. Creepy.', watch: 'We grab old watches for the Collector. All stopped at 3:07. Weird, right?', fallback: ['I\'m just watching the street, J.', 'Marquis don\'t like questions.'] } },
  marquis: { name: 'Marquis', gang: true, who: 'Leader of the Mantis crew. Big, calm, dangerous, protective.', knows: 'The Collector pays huge money for antique watches stopped at 3:07.', hides: 'Whether he suspects Jester.',
    lines: { greet: 'Talk.', watch: 'The Collector wants watches. I want his money. Simple.', fallback: ['I don\'t pay you to ask questions.', 'Get me those watches.'] } },
  seung: { name: 'Seung Lee', who: 'Nervous crime-lab tech, two kids, honest.', knows: 'The wound is a perfect 7 cm circle with glassy edges; the girl died within the hour.', hides: 'He\'s scared of the Chief.',
    lines: { greet: 'Keep your voice down.', victim: 'Teenage girl. No ID. Died tonight. And her clothes look forty years old.', wound: 'Seven centimeters. Perfect circle. Edges like melted glass. Nothing makes that.', chief: 'The Chief wants it closed by morning.', fallback: ['I just work the lab.', 'Be careful. Please.'] } },
  hale: { name: 'Chief Hale', who: 'Smug, lazy police chief who wants the case gone.', knows: 'Very little.', hides: 'He\'s embarrassed he can\'t explain the body.',
    lines: { greet: 'This is a closed scene.', victim: 'Runaway. Tragic. Done.', fallback: ['Go home.', 'Raincaster doesn\'t need ghost stories.'] } },
  mina: { name: 'Mina', who: 'Seems to be a scared 12-year-old runaway who can open doors in time. Secretly Wren Hartwell, 150 years old, the Chronomancer. Calm, polite, a little too precise; never lies outright, only leaves things out.', knows: 'The five rules of time; exactly when every door opened; the heroes will fetch the mainspring because the records say so.', hides: 'That she is the killer, that she opened the door that killed Ivy from the attic, and that Silas works for her. Deflects to the rules and to being scared.',
    lines: { greet: 'Hi. Sorry. I\'m jumpy.', time: 'Tether, fixed, anchor, dawn — and you come back to whoever opened the door. They don\'t bend.', victim: 'She came through at seven past eleven. She was already hurt.', cult: 'People want what I can do. That\'s all you need to know.', bernard: 'Bernard? ...That\'s a sad name. Why do you ask?', fallback: ['I can only go where I\'m holding a piece of.', 'Whatever happened back there already happened.', 'You\'ll understand when you get to the oldest door.'] } },
  silas: { name: 'Silas Morrow', who: 'Kind, old-fashioned 91-year-old archivist with a cane and a glove on his left hand. Secretly the Chronomancer\'s accomplice since he was 12; he buys 3:07 watches as door keys.', knows: 'Everything about Raincaster history.', hides: 'That he works for Mina/Wren, that he was Si (1947) and Eli Ward (1986). Deflects warmly and steers toward history.',
    lines: { greet: 'Come in out of the rain.', time: 'Time is just a very patient river.', victim: 'Poor child. Poor, poor child.', history: 'The tower clock was built in 1888 by Elias Hartwell. He had twins, you know. Tragic family.', glove: 'Arthritis. Old hands.', watch: 'I collect a little. Every old watch is a door to somewhere.', fallback: ['Would you like tea?', 'Raincaster remembers everything, if you know where to look.'] } },
  hart: { name: 'Si', who: '12-year-old shoeshine boy in 1947. Polite, nervous, loves his sick mother.', knows: 'A girl in a hood promised his mama more time if he keeps the back door.', hides: 'That the girl asked him to unlock the back door at three.',
    lines: { greet: 'Shine, mister?', victim: 'Miss Vera\'s real nice to me.', fallback: ['Mama\'s sick.', 'I just keep the door. That\'s all.'] } },
  danny: { name: 'Danny', who: '13-year-old in 1986, one of the Static Kids. Talks fast about baseball and arcade games.', knows: 'Ivy says something follows her; the Mets won the World Series.', hides: 'Nothing.',
    lines: { greet: 'Whoa, cool jacket.', victim: 'Ivy? She\'s the best artist in school.', fallback: ['Wanna play Galaga later?', 'Ivy\'s out at the farm.'] } },
  ivy: { name: 'Ivy Calder', who: '16-year-old artist in 1986. Funny, a little sad, sees Bernard and feels sorry for him.', knows: 'Bernard says he\'s lost; Mr. Ward gives her free tokens.', hides: 'Her stepdad drinks.',
    lines: { greet: 'Hi? You\'re staring.', bernard: 'He\'s not scary. He\'s sad. He keeps asking if his dad is coming.', fallback: ['Want to see my sketchbook?', 'Rosa thinks I\'m crazy.'] } },
  ray: { name: 'Ray Calder', who: 'Ivy\'s stepdad in 1986. Defensive, drinks, ashamed.', knows: 'He spends nights at Lucky\'s Tavern.', hides: 'His drinking — until shown the bar tab.',
    lines: { greet: 'You lost?', fallback: ['I was home.', 'Mind your business.'] } },
  rosa: { name: 'Rosa', who: '13-year-old in 1986, sharp and suspicious.', knows: 'Mr. Ward watches Ivy every night and hums a song.', hides: 'Nothing.',
    lines: { greet: 'You\'re not from here.', fallback: ['Mr. Ward is creepy.', 'Check the high scores.'] } },
  calloway: { name: 'Det. Jack Calloway', who: 'Honest, tired 1947 detective with a fedora and a pistol.', knows: 'Vinnie runs card games; Mr. Hart sends Vera clock-faced orchids.', hides: 'He\'s sweet on Vera.',
    lines: { greet: 'Evening, pal.', fallback: ['Keep your nose clean.', 'Watch the man in the back booth.'] } },
  vera: { name: 'Vera Lune', who: '1947 nightclub singer, smart, tough, warm.', knows: 'Mr. Hart wants to meet her backstage at three.', hides: 'She\'s tired of men who want something.',
    lines: { greet: 'You\'re looking at my face. That\'s new.', fallback: ['I go on at eleven.', 'Don\'t worry about me, sugar.'] } },
  vinnie: { name: 'Vinnie Moretti', who: '1947 club owner, blustery small-time gangster.', knows: 'Hart paid him to leave the back door unlocked.', hides: 'He was arrested at 11:40 PM — until shown the booking sheet.',
    lines: { greet: 'Buy a drink or get lost.', fallback: ['I was right here.', 'Mind your business.'] } },
  agnes: { name: 'Agnes', who: '1888 housemaid, kind, superstitious.', knows: 'Bernard is dying; she saw an older Elias appear in the snow with a boy.', hides: 'Nothing.',
    lines: { greet: 'Oh! You startled me.', fallback: ['The young master is so ill.', 'Mr. Hartwell talks to the clock.'] } },
  elias: { name: 'Elias Hartwell', who: '1888 master clockmaker, desperate father of twins Bernard and Wren, brilliant and cold.', knows: 'He has found a room between seconds.', hides: 'He is afraid it won\'t work, and afraid Wren will follow her brother.',
    lines: { greet: 'You\'re not the doctor.', fallback: ['At seven past three, the clock will open it.', 'Wren must stay out of the tower.'] } },
  ruth: { name: 'Ruth Calder', who: 'Ivy\'s mother, 70s, in 2026. Grieving, gentle, stubborn.', knows: 'Her husband worked the tower clock.', hides: 'Nothing.',
    lines: { greet: 'They found my Ivy.', fallback: ['Forty years I left the light on.', 'Go get him.'] } },
};
