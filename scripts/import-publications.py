"""Usage: python scripts/import-publications.py profile-source.html"""
from html import unescape
from pathlib import Path
import re, json, sys
root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]).read_text(encoding='utf-8')
def clean(value):
    return ' '.join(unescape(re.sub('<[^>]+>', '', value)).split())
count = 0
for match in re.finditer(r'<li>(.*?)</li>', source, re.S):
    item = match.group(1)
    link = re.search(r'<a[^>]+href="(https://espace2\.etsmtl\.ca/[^\"]+)"[^>]*>(.*?)</a>', item, re.S)
    if not link: continue
    before = clean(item[:link.start()])
    year = re.search(r'(\d{4})\s*«', before)
    if not year: continue
    headings = re.findall(r'<h[234][^>]*>(.*?)</h[234]>', source[:match.start()], re.S)
    heading = clean(headings[-1]) if headings else ''
    kind = 'Journal article' if 'journal' in heading.lower() else 'Book' if 'book' in heading.lower() else 'Conference contribution'
    data = {'title': clean(link.group(2)), 'authors': before[:year.start()].rstrip('. '), 'year': int(year.group(1)), 'type': kind, 'venue': clean(item[link.end():]).lstrip(' » .'), 'link': unescape(link.group(1))}
    dest = root / 'content' / '_publications' / f"{data['year']}-{link.group(1).rstrip('/').split('/')[-1]}.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists(): dest.write_text('---\n' + '\n'.join(f'{key}: {json.dumps(value, ensure_ascii=False)}' for key,value in data.items()) + '\n---\n', encoding='utf-8')
    count += 1
print(f'Imported {count} bibliographic records.')
