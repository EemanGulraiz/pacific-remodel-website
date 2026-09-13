import urllib.request
import re
import os

urls = [
    'http://localhost:8000/project-ipanema.html',
    'http://localhost:8000/before-after.html',
    'http://localhost:8000/projects.html',
    'http://localhost:8000/index.html'
]

print("=== CHECKING HTML URLS ===")
for url in urls:
    try:
        req = urllib.request.urlopen(url)
        print(f'{url} -> {req.status} OK')
    except Exception as e:
        print(f'{url} -> ERROR: {e}')

print("\n=== CHECKING PROJECT-IPANEMA.HTML ASSETS ===")
with open('project-ipanema.html', 'r', encoding='utf-8') as f:
    html = f.read()

img_srcs = set(re.findall(r'src=["\']([^"\']+)["\']', html))
for src in sorted(img_srcs):
    try:
        res = urllib.request.urlopen(f'http://localhost:8000/{src}')
        print(f'  [200 OK] {src}')
    except Exception as e:
        print(f'  [FAIL] {src} -> {e}')
