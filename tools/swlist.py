"""Regenerate sw.js ASSETS from the files on disk and bump VERSION.
usage: python3 tools/swlist.py <version>"""
import os, sys, json, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = ['./']
for d in ('assets', 'css', 'icons', 'js'):
    for dp, _, fs in os.walk(os.path.join(ROOT, d)):
        for f in fs:
            if f.startswith('.') or f.endswith('.json'): continue
            out.append(os.path.relpath(os.path.join(dp, f), ROOT).replace(os.sep, '/'))
out += ['index.html', 'manifest.webmanifest']
p = os.path.join(ROOT, 'sw.js'); s = open(p).read()
s = re.sub(r"const VERSION = '[^']*';", "const VERSION = '%s';" % sys.argv[1], s)
s = re.sub(r"const ASSETS = \[.*?\];", 'const ASSETS = ' + json.dumps(sorted(set(out), key=lambda x: (x != './', x))) + ';', s, flags=re.S)
s = s.replace('/* TECHNOMANCERS', '/* CHRONOMANCER')
open(p, 'w').write(s); print(len(out), 'assets')
