#!/usr/bin/env python3
"""Stamp local css/js/icon references with a content hash.

Netlify serves HTML with max-age=0 but CSS/JS with max-age=3600 and
/assets/* as immutable-for-a-year. Without a versioned URL a deploy can
take an hour to reach returning visitors — and an overwritten icon under
/assets/ never reaches them at all. The hash changes only when the file
changes, so caching stays aggressive and correctness is immediate.

Run before every commit that touches css/js/icons.
"""
import glob, hashlib, os, re

def h(path):
    return hashlib.sha1(open(path, 'rb').read()).hexdigest()[:8]

TARGETS = ('styles.css', 'park.css', 'investors.css', 'blog.css', 'main.js', 'logo.js',
           'header.js', 'contact.js', 'blog.js', 'investors.js',
           'assets/favicon.svg', 'assets/favicon-48.png', 'assets/favicon-192.png',
           'assets/apple-touch-icon.png')
digest = {f: h(f) for f in TARGETS if os.path.exists(f)}

pat = re.compile(r'((?:href|src)=")((?:\.\./)?)(' +
                 '|'.join(re.escape(f) for f in digest) + r')(?:\?v=[0-9a-f]+)?(")')
changed = 0
for page in glob.glob('*.html') + glob.glob('blog/*.html'):
    s = open(page).read()
    new = pat.sub(lambda m: f'{m.group(1)}{m.group(2)}{m.group(3)}?v={digest[m.group(3)]}{m.group(4)}', s)
    if new != s:
        open(page, 'w').write(new)
        changed += 1
print(f'stamped {changed} pages')
for f, d in sorted(digest.items()):
    print(f'  {f:32} v={d}')
