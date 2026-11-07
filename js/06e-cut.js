/* =========================================================================
   CHRONOMANCER — 06e-cut.js
   Cutscenes: letterboxed, animated shots built from the game's own pixel
   backgrounds and sprites. Data lives in TM.CUTS (02b-cuts.js).
   A dialogue node with  cut:'id'  plays the cutscene before its line.

   cut  = { loc:'1986 · QUARRY WOODS', shots:[shot...] }
   shot = { bg, era, tint, rain, snow, pan:[x0,x1], dur, cap, music, sfx,
            actors:[{ spr, anim, x, to, dir, alpha, fade:'in'|'out', shadow, glow, dy, scale }],
            fx:[{ k:'flash'|'portal'|'close'|'shake'|'dust'|'stars'|'clock'|'lights', at, x, y, r, col }] }
   Tap: finish the caption / next shot. SKIP: end the whole thing.
   ========================================================================= */
'use strict';
TM.Cut = (() => {
  const C = {}; let st = null, raf = 0, last = 0;
  const imgs = {}; const img = (s) => { if (!imgs[s]) { const i = new Image(); i.src = s; imgs[s] = i; } return imgs[s]; };
  const W = 480;

  C.play = (id, done) => {
    const cut = (TM.CUTS || {})[id];
    if (!cut || (TM.S.profile.settings && TM.S.profile.settings.cuts === false)) { done && done(); return; }
    const ov = document.getElementById('cut');
    ov.innerHTML = `<div class="cbar top"><span class="cloc"></span></div><canvas id="cutcv"></canvas><div class="cbar bot"><p class="ccap"></p></div><button class="cskip">SKIP ▸▸</button>`;
    ov.className = 'cut on';
    st = { cut, done, i: -1, t: 0, typed: 0, fx: [], parts: [] };
    ov.querySelector('.cskip').onclick = (e) => { e.stopPropagation(); end(); };
    ov.onclick = () => tap();
    window.addEventListener('keydown', key, true);
    ov.querySelector('.cloc').textContent = cut.loc || '';
    shot(0); last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  };
  C.active = () => !!st;
  function key(e) { if (!st) return; if (['Space', 'Enter', 'KeyE', 'ArrowRight'].includes(e.code)) { e.preventDefault(); e.stopPropagation(); tap(); } if (e.code === 'Escape') { e.preventDefault(); e.stopPropagation(); end(); } }
  function shot(i) {
    const S = st.cut.shots[i]; if (!S) return end();
    st.i = i; st.t = 0; st.typed = 0; st.S = S; st.fx = (S.fx || []).map((f) => ({ ...f, on: false }));
    const bg = TM.BG[S.bg] || { h: 270 }; const cv = document.getElementById('cutcv'); cv.width = W; cv.height = bg.h;
    fit();
    if (S.music) TM.Audio.setMood(S.music);
    if (S.sfx) TM.Audio.play(S.sfx);
    document.getElementById('cut').dataset.era = S.era || '';
    const cap = document.querySelector('#cut .ccap'); cap.textContent = '';
  }
  function fit() {
    const cv = document.getElementById('cutcv'); if (!cv) return;
    const bars = 2 * Math.max(54, innerHeight * .13);
    const s = Math.min(innerWidth / cv.width, (innerHeight - bars) / cv.height);
    cv.style.width = Math.round(cv.width * s) + 'px'; cv.style.height = Math.round(cv.height * s) + 'px';
  }
  function tap() {
    if (!st) return; const S = st.S; const L = (S.cap || '').length;
    if (st.typed < L) { st.typed = L; return; }
    TM.Audio.play('ui'); shot(st.i + 1);
  }
  function end() {
    if (!st) return; const cb = st.done; st = null; cancelAnimationFrame(raf);
    window.removeEventListener('keydown', key, true);
    const ov = document.getElementById('cut'); ov.className = 'cut'; ov.innerHTML = ''; ov.onclick = null;
    if (TM.W && TM.W.state && TM.W.state.sc) TM.Audio.setMood(TM.W.sceneMusic());
    cb && cb();
  }
  function loop(ts) {
    if (!st) return; const dt = Math.min(.05, (ts - last) / 1000); last = ts;
    update(dt); if (st) draw(); raf = requestAnimationFrame(loop);
  }
  function update(dt) {
    const S = st.S; st.t += dt;
    const L = (S.cap || '').length; if (st.typed < L) { const n = st.typed; st.typed = Math.min(L, st.typed + dt * 46 * ((TM.S.profile.settings || {}).textSpeed || 1)); if ((st.typed | 0) % 5 === 0 && (n | 0) !== (st.typed | 0)) TM.Audio.play('blip'); }
    const cap = document.querySelector('#cut .ccap'); if (cap) cap.textContent = (S.cap || '').slice(0, Math.floor(st.typed));
    for (const f of st.fx) if (!f.on && st.t >= (f.at || 0)) { f.on = true; f.t0 = st.t; if (f.k === 'flash') TM.Audio.play('nova'); if (f.k === 'portal') TM.Audio.play('portal'); if (f.k === 'shake') { TM.Audio.play('explode'); TM.U.vibrate(60); } if (f.k === 'dust') for (let i = 0; i < 40; i++) st.parts.push({ x: f.x + (Math.random() - .5) * 20, y: f.y - Math.random() * 50, vx: (Math.random() - .3) * 30, vy: -10 - Math.random() * 30, t: 0, life: 1.5 + Math.random(), c: Math.random() < .5 ? '#2a2030' : '#5a4a60' }); }
    st.parts = st.parts.filter((p) => (p.t += dt) < p.life);
    // auto-advance once the caption has been readable for a while
    const hold = (S.dur || 3) + L / 22;
    if (st.typed >= L && st.t > hold && !S.wait) shot(st.i + 1);
  }
  const ease = (k) => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  function draw() {
    const S = st.S; const cv = document.getElementById('cutcv'); if (!cv) return; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    const H = cv.height, t = st.t, k = Math.min(1, t / (S.dur || 3));
    x.save(); x.clearRect(0, 0, W, H);
    const shk = st.fx.find((f) => f.k === 'shake' && f.on && t - f.t0 < .6); if (shk) x.translate((Math.random() - .5) * 8, (Math.random() - .5) * 5);
    // background (parallax pan)
    const bg = TM.BG[S.bg]; const pan = S.pan || [0, 0]; const cam = pan[0] + (pan[1] - pan[0]) * ease(k);
    if (bg) { const n = bg.layers.length; for (let i = 0; i < n; i++) { const im = img(`assets/bg/${S.bg}/${bg.layers[i]}.png`); if (!im.complete || !im.width) continue; const f = i === 0 ? .02 : i === n - 1 ? 1 : .1 + .75 * Math.pow(i / (n - 1), 1.4); const lw = im.width, off = ((cam * f) % lw + lw) % lw; for (let px = -off; px < W; px += lw) x.drawImage(im, Math.round(px), H - im.height); } }
    else { x.fillStyle = '#05030a'; x.fillRect(0, 0, W, H); }
    const ground = (TM.GROUND || {})[S.bg] || H - 30;
    // stars (the Hour Between)
    const stars = st.fx.find((f) => f.k === 'stars' && f.on);
    if (stars) { for (let i = 0; i < 120; i++) { const sx = (i * 97.3) % W, sy = (i * 53.7) % (H - 20); x.fillStyle = `rgba(${i % 3 ? '220,230,255' : '120,240,255'},${.3 + .7 * Math.abs(Math.sin(t * 1.3 + i))})`; x.fillRect(sx, sy, i % 7 ? 1 : 2, i % 7 ? 1 : 2); } }
    // portals behind actors
    for (const f of st.fx) if (f.on && (f.k === 'portal' || f.k === 'close')) portal(x, f, t - f.t0, ground);
    // actors
    for (const a of S.actors || []) actor(x, a, t, k, ground);
    // weather
    if (S.rain) { x.strokeStyle = 'rgba(170,185,210,.35)'; x.beginPath(); for (let i = 0; i < 110; i++) { const rx = (i * 53 + t * 60) % (W + 40) - 20, ry = (i * 97 + t * 420) % H; x.moveTo(rx, ry); x.lineTo(rx - 3, ry - 9); } x.stroke(); }
    if (S.snow) { for (let i = 0; i < 140; i++) { const sx = (i * 61 + Math.sin(t + i) * 8 + t * 14) % W, sy = (i * 37 + t * (22 + i % 9 * 3)) % H; x.fillStyle = 'rgba(240,244,255,.8)'; x.fillRect(sx, sy, i % 4 ? 1 : 2, i % 4 ? 1 : 2); } }
    if (S.tint) { x.fillStyle = S.tint; x.fillRect(0, 0, W, H); }
    for (const p of st.parts) { x.fillStyle = p.c; x.globalAlpha = 1 - p.t / p.life; x.fillRect(p.x + p.vx * p.t, p.y + p.vy * p.t, 2, 2); } x.globalAlpha = 1;
    // clock face overlay
    const clk = st.fx.find((f) => f.k === 'clock' && f.on);
    if (clk) { const cx = clk.x || W / 2, cy = clk.y || H / 2, r = clk.r || 40, el = t - clk.t0; x.globalAlpha = Math.min(.85, el); x.strokeStyle = '#40f0ff'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke(); for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283; x.fillStyle = '#b8fbff'; x.fillRect(Math.round(cx + Math.cos(an) * (r - 5)) - 1, Math.round(cy + Math.sin(an) * (r - 5)) - 1, 2, 2); } const m = (clk.m != null ? clk.m : 7) / 60 * 6.283 - 1.571 + Math.max(0, 1 - el) * -3, h = ((clk.h != null ? clk.h : 3) + 7 / 60) / 12 * 6.283 - 1.571; x.strokeStyle = '#ff4fd8'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(m) * (r - 8), cy + Math.sin(m) * (r - 8)); x.stroke(); x.strokeStyle = '#fff'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(h) * (r - 18), cy + Math.sin(h) * (r - 18)); x.stroke(); x.lineWidth = 1; x.globalAlpha = 1; }
    // police lights
    const lights = st.fx.find((f) => f.k === 'lights' && f.on);
    if (lights) { const on = (t * 5 | 0) % 2; x.fillStyle = on ? 'rgba(255,40,60,.16)' : 'rgba(40,90,255,.16)'; x.fillRect(0, 0, W, H); }
    // flash
    for (const f of st.fx) if (f.on && f.k === 'flash') { const el = t - f.t0; if (el < .7) { x.fillStyle = `rgba(${f.col || '255,255,255'},${1 - el / .7})`; x.fillRect(0, 0, W, H); } }
    x.restore();
    // fade in from black at the start of a shot
    if (t < .35) { x.fillStyle = `rgba(0,0,0,${1 - t / .35})`; x.fillRect(0, 0, W, H); }
  }
  function portal(x, f, el, ground) {
    const cx = f.x || W / 2, cy = f.y || ground - 40, R = f.r || 34;
    const grow = f.k === 'close' ? Math.max(0, 1 - el / 1.2) : Math.min(1, el / .8);
    const r = R * grow; if (r < 1) return;
    for (let i = 4; i >= 0; i--) { x.fillStyle = ['rgba(5,3,12,.95)', 'rgba(64,240,255,.55)', 'rgba(255,79,216,.35)', 'rgba(168,85,247,.25)', 'rgba(64,240,255,.12)'][i]; x.beginPath(); x.ellipse(cx, cy, r * (1 + i * .16), r * 1.35 * (1 + i * .16), 0, 0, 7); x.fill(); }
    x.fillStyle = '#05030a'; x.beginPath(); x.ellipse(cx, cy, r * .82, r * 1.12, 0, 0, 7); x.fill();
    for (let i = 0; i < 16; i++) { const an = el * 2 + i / 16 * 6.283, rr = r * (1.02 + .1 * Math.sin(el * 5 + i)); x.fillStyle = i % 2 ? '#40f0ff' : '#ff4fd8'; x.fillRect(Math.round(cx + Math.cos(an) * rr), Math.round(cy + Math.sin(an) * rr * 1.35), 2, 2); }
  }
  function actor(x, a, t, k, ground) {
    let id = a.spr; const run = TM.S.run || { hero: 'augie' };
    if (id === 'HERO') id = TM.HEROES[run.hero].spr; else if (id === 'PARTNER') id = TM.HEROES[run.hero === 'augie' ? 'jester' : 'augie'].spr;
    const m = TM.SPR[id]; if (!m) return; const an = m.anims[a.anim] || m.anims.idle; const im = img('assets/sprites/' + id + '.png'); if (!im.complete) return;
    const kk = a.from != null || a.until != null ? Math.max(0, Math.min(1, (t - (a.from || 0)) / ((a.until || 3) - (a.from || 0)))) : k;
    if (a.from != null && t < a.from && a.hideBefore) return;
    const px = a.to != null ? a.x + (a.to - a.x) * ease(kk) : a.x;
    const moving = a.to != null && kk > 0 && kk < 1;
    const A = moving && m.anims[a.walk || 'walk'] ? m.anims[a.walk || 'walk'] : an;
    const f = a.frame != null ? Math.min(a.frame, A.n - 1) : (a.once ? Math.min(A.n - 1, Math.floor(t * 8)) : Math.floor(t * (A === m.anims.idle ? 5 : 9)) % A.n);
    const s = (m.scale || 1) * (a.scale || 1); const fw = m.fw, fh = m.fh;
    const dx = Math.round(px - fw * s / 2), dy = Math.round(ground + (a.dy || 0) - (A.b[1] + A.b[3]) * s);
    const dir = a.dir || 1; const flip = m.face === 'left' ? dir > 0 : dir < 0;
    let alpha = a.alpha != null ? a.alpha : 1;
    if (a.fade === 'in') alpha *= Math.min(1, t / 1.2); if (a.fade === 'out') alpha *= Math.max(0, 1 - t / ((a.until || 2))); if (alpha <= 0) return;
    x.save(); x.globalAlpha = alpha;
    if (a.shadow) x.filter = 'brightness(0)';
    if (flip) { x.translate(dx + fw * s, dy); x.scale(-1, 1); x.drawImage(im, f * fw, A.r * fh, fw, fh, 0, 0, fw * s, fh * s); }
    else x.drawImage(im, f * fw, A.r * fh, fw, fh, dx, dy, fw * s, fh * s);
    x.restore();
    if (a.glow) { x.save(); x.globalAlpha = .25 + .15 * Math.sin(t * 6); x.fillStyle = a.glow; x.beginPath(); x.ellipse(px, dy + (A.b[1] + A.b[3] * .5) * s, A.b[2] * s * .9, A.b[3] * s * .6, 0, 0, 7); x.fill(); x.restore(); }
  }
  window.addEventListener('resize', () => st && fit());
  return C;
})();
