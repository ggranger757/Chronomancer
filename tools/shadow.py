"""SHADOW Series bases -> the Chronomancer (The Blind Huntress) and the Nanomancer (Shadeflit).
usage: python3 tools/shadow.py <SHADOW folder> <assets/sprites out>   -> writes chrono.png, nano.png and _shadow_meta.json"""
import sys, os, json
from PIL import Image, ImageDraw

SRC, OUT = sys.argv[1], sys.argv[2]
HU = os.path.join(SRC, 'SHADOW Series - The Blind Huntress', 'Sprite Sheet')
SF = os.path.join(SRC, 'SHADOW Series - Shadeflit (Free)')


def hx(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def frames(path, fw):
    im = Image.open(path).convert('RGBA')
    return [im.crop((i * fw, 0, (i + 1) * fw, im.height)) for i in range(im.width // fw)]


def recolor(fr, cmap, white=None):
    px = fr.load()
    for y in range(fr.height):
        for x in range(fr.width):
            r, g, b, a = px[x, y]
            if not a: continue
            k = '#%02x%02x%02x' % (r, g, b)
            if k in cmap: px[x, y] = hx(cmap[k]) + (a,)
            elif white and r > 200 and g > 200 and b > 200: px[x, y] = hx(white) + (a,)
    return fr


def sheet(anims, box, cid):
    """anims: {name: [frames]} -> one sheet cropped to box, meta in the engine's format"""
    x0, y0, x1, y1 = box; fw, fh = x1 - x0, y1 - y0
    n = max(len(v) for v in anims.values())
    im = Image.new('RGBA', (fw * n, fh * len(anims)))
    meta = {}
    idle_bb = anims['idle'][0].crop(box).getbbox()
    b = [idle_bb[0], idle_bb[1], idle_bb[2] - idle_bb[0], idle_bb[3] - idle_bb[1]]
    for r, (k, fs) in enumerate(anims.items()):
        for i, f in enumerate(fs): im.paste(f.crop(box), (i * fw, r * fh))
        meta[k] = dict(r=r, n=len(fs), b=b)
    im.save(os.path.join(OUT, cid + '.png'), optimize=True)
    return fw, fh, meta


# ---------------------------------------------------------------- the Chronomancer
CH = {'#2b321c': '#3a1f5c', '#232817': '#2a1646', '#434d2c': '#5e3490',          # cloak: deep violet
      '#1d1b18': '#5a1238', '#24211e': '#7a1a4e', '#161513': '#3e0c28',          # muffler: crimson
      '#868686': '#40f0ff', '#8b8b8b': '#b8fbff', '#747474': '#1fb8d0',          # the blindfold glows: she sees the Hour
      '#a3825d': '#d2c4cf', '#8b6f4f': '#9e8ea6'}                                # pallid skin


def hu(name, n=None):
    fs = frames(os.path.join(HU, name), 240)
    return [recolor(f, CH, '#9ff6ff') for f in fs[:n]]


def gauntlet(fs):
    """a brass clock dial on the forward wrist; it ticks"""
    for i, f in enumerate(fs):
        bb = f.getbbox()
        if not bb: continue
        px = f.load()
        # the forward-most dark pixel in the arm band (rows 52..64) is the hand
        best = None
        for y in range(60, 70):
            for x in range(bb[2] - 1, bb[0], -1):
                if px[x, y][3] and sum(px[x, y][:3]) < 330 and px[x, y][2] < 200 and x < 132: best = (x, y); break
            if best: break
        if not best: continue
        x, y = best; d = ImageDraw.Draw(f)
        d.rectangle([x - 2, y - 1, x + 1, y + 2], fill=(16, 10, 20, 255)); d.rectangle([x - 1, y, x, y + 1], fill=hx('#c8a040'))
        d.point((x - 1 + (i % 2), y), fill=hx('#40f0ff'))
    return fs


idle = gauntlet(hu('1 - Idle.png'))
run = gauntlet(hu('2 - Run.png'))
hit = hu('14 - hit.png'); hit = [hit[0], idle[0], idle[1]]
chrono = dict(idle=idle, walk=run, run=run, attack=hu('11 - attack 3.png'), attack2=hu('10 - attack 1.png'),
              dash=hu('13 - spetial dash.png'), crouch=hu('6 - dash.png'), hurt=hit, death=hu('15 - death.png'))
fw, fh, an = sheet(chrono, (60, 16, 220, 96), 'chrono')
META = {'chrono': dict(fw=fw, fh=fh, anims=an, scale=1.45, face='right')}

# ---------------------------------------------------------------- the Nanomancer
NA = {'#2b3838': '#1f3a46', '#202325': '#152530', '#3f524d': '#2f6a7a', '#7ec686': '#4fd1ff'}


def sf(name):
    return [recolor(f, NA, '#9ff0ff') for f in frames(os.path.join(SF, name), 277)]


n_idle, n_run = sf('idle.png'), sf('run.png')


def lunge(base, dxs, streak):
    out = []
    for i, dx in enumerate(dxs):
        f = Image.new('RGBA', base[0].size); src = base[i % len(base)]
        f.paste(src, (dx, 0), src)
        if streak[i]:
            px = f.load(); bb = f.getbbox(); tx = bb[2] - 1
            ty = next(y for y in range(f.height) if px[tx, y][3])
            d = ImageDraw.Draw(f)
            d.line([(tx - 6, ty + 1), (tx + streak[i], ty - 1)], fill=hx('#9ff0ff'), width=1)
            d.line([(tx - 10, ty + 2), (tx + streak[i] * 2 // 3, ty)], fill=hx('#4fd1ff'), width=1)
            d.point((tx + streak[i] + 1, ty - 1), fill=(255, 255, 255, 255))
        out.append(f)
    return out


def tint(fs, col, k=.45):
    c = hx(col); out = []
    for f in fs:
        g = f.copy(); px = g.load()
        for y in range(g.height):
            for x in range(g.width):
                r, gg, b, a = px[x, y]
                if a: px[x, y] = (int(r + (c[0] - r) * k), int(gg + (c[1] - gg) * k), int(b + (c[2] - b) * k), a)
        out.append(g)
    return out


nano = dict(idle=n_idle, walk=n_run, run=n_run,
            attack=lunge(n_idle, [0, -3, 6, 12, 12, 6], [0, 0, 8, 22, 14, 0]),
            attack2=lunge(n_run, [0, 4, 10, 16, 10, 0], [0, 6, 18, 30, 18, 0]),
            dash=n_run[:6], crouch=n_idle[:4], hurt=[n_idle[0].transform(n_idle[0].size, Image.AFFINE, (1, 0, 3, 0, 1, 0)), tint(n_idle[:1], '#ff4f6a')[0]],
            death=[tint([n_idle[0]], '#ff4f6a')[0]] + [tint([n_idle[0].transform(n_idle[0].size, Image.AFFINE, (1, 0, 0, 0, 1, -k))], '#000000', .3 + k / 20)[0] for k in (4, 8, 12)])
fw, fh, an = sheet(nano, (20, 40, 200, 120), 'nano')
META['nano'] = dict(fw=fw, fh=fh, anims=an, scale=1.65, face='right')
json.dump(META, open(os.path.join(OUT, '_shadow_meta.json'), 'w'))
print('shadow:', ', '.join(META))
