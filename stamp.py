#!/usr/bin/env python3
"""Stamp every local asset reference with a content hash.

Netlify serves HTML with max-age=0, CSS/JS with max-age=3600, and
/assets/* as immutable for a year. Overwriting a file in place therefore
never reaches anyone who already has it — `immutable` means the browser
will not even revalidate. Content-hashed URLs are the correct pairing for
an immutable cache: the URL changes exactly when the bytes change, so
updates are instant and unchanged files stay cached forever.

Covers stylesheets, scripts, and everything under assets/ (images, PDFs,
icons). Absolute https:// references — og:image and friends — are left
alone so social scrapers keep a stable URL.

Run before every commit that touches any of them.
"""
import glob, hashlib, os, re

CODE = ('styles.css', 'park.css', 'investors.css', 'blog.css',
        'main.js', 'logo.js', 'header.js', 'contact.js', 'blog.js', 'investors.js')
ASSET_RE = re.compile(
    r'((?:\.\./|/)?assets/[A-Za-z0-9._/-]+?\.(?:webp|png|jpe?g|svg|pdf|mp4|mov|webm))(\?v=[0-9a-f]{8})?')
CODE_RE = re.compile(r'((?:\.\./)?(' + '|'.join(re.escape(c) for c in CODE) + r'))(\?v=[0-9a-f]{8})?')
ABS = 'https://scaleupflex.com/assets/'
MASK = '\x00ABS\x00'

cache = {}
def digest(path):
    if path not in cache:
        cache[path] = hashlib.sha1(open(path, 'rb').read()).hexdigest()[:8] if os.path.isfile(path) else None
    return cache[path]

def stamp(m):
    ref = m.group(1)
    path = re.sub(r'^(\.\./|/)', '', ref)
    d = digest(path)
    return f'{ref}?v={d}' if d else ref

targets = (glob.glob('*.html') + glob.glob('blog/*.html') + list(CODE)
           + ['site.webmanifest'])
changed = 0
for f in targets:
    if not os.path.exists(f):
        continue
    src = open(f).read()
    out = src.replace(ABS, MASK)
    out = ASSET_RE.sub(stamp, out)
    out = CODE_RE.sub(stamp, out)
    out = out.replace(MASK, ABS)
    if out != src:
        open(f, 'w').write(out)
        changed += 1
print(f'stamped {changed} files')
missing = sorted(p for p, d in cache.items() if d is None)
if missing:
    print('  referenced but not on disk:')
    for p in missing:
        print('   ', p)
