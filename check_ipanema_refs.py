import re

for fn in ['project-ipanema.html', 'before-after.html', 'projects.html']:
    print(f'=== {fn} ===')
    with open(fn, 'r', encoding='utf-8') as f:
        html = f.read()
    for match in re.finditer(r'assets/ipanema-[^\s"\'>]+', html):
        print(match.group(0))
