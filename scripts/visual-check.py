"""Generate a visual fixture using real CSS, JS and content (NOT a Jekyll build).
Uses Python standard library only. Output is excluded from deployment.
"""
from pathlib import Path
from html import escape as e
import json, re, shutil
root = Path(__file__).resolve().parents[1]
out = root / '_preview'
out.mkdir(exist_ok=True)
def record(path):
    _, front, body = path.read_text(encoding='utf-8').split('---',2)
    data = {}
    for line in front.splitlines():
        if ':' not in line or line.startswith('#'): continue
        key,value = line.split(':',1)
        try: value=json.loads(value.strip())
        except ValueError: value=value.strip()
        data[key]=value
    data['body']=body.strip()
    return data
def prose(body):
    return '<p>'+re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', e(body))+'</p>'
def card(data):
    return '<article class="record">'+(f'<span class="eyebrow">{e(data["label"])}</span>' if 'label' in data else '')+f'<h3>{e(data.get("name",data.get("title","")))}</h3>'+prose(data['body'])+'</article>'
ids=['home','research','people','publications','news','teaching','opportunities','contact']
html='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Visual fixture — Space Systems & Energy</title><link rel="stylesheet" href="assets/css/research.css"><style>:root{--accent:#c82032;--ink:#17191b;--paper:#f5f4f0;--muted:#595d61;--heading:Arial, sans-serif;--body:'Segoe UI',Arial,sans-serif}</style><script src="assets/js/research.js" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="brand" href="#home"><span class="brand-mark">↗</span><span>Space Systems & Energy<small>Jesus David Gonzalez Llorente</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu ☰</button><nav id="navigation" aria-label="Main navigation">'''
html+=''.join(f'<a href="#{id}">{id.title()}</a>' for id in ids)
html+='''</nav></div></header><main id="main"><section id="home" class="hero"><div class="hero-copy"><p class="eyebrow"><span class="red-dot"></span>ÉTS MONTRÉAL / AEROSPACE ENGINEERING</p><h1>Engineering what comes next. <span>Beyond Earth.</span></h1><div class="hero-description prose"><p>From spacecraft design to intelligent systems, connecting aerospace engineering, energy, and autonomy.</p></div><div class="actions"><a class="button" href="#research">Explore the research ↗</a><a class="text-link" href="#people">Meet the professor ↗</a></div></div><div class="hero-art"><img src="assets/images/orbit.svg" alt="Conceptual satellite in Earth orbit" width="700" height="700"><span class="art-label">SPACE SYSTEMS / INTELLIGENT ENERGY</span><span class="art-coordinate">45.495° N &nbsp; 73.563° W<br>MONTRÉAL → BEYOND</span></div><div class="hero-bottom"><span>SPACECRAFT · ENERGY · AUTONOMY</span><span>Research with a wider perspective ↓</span></div></section>'''
for i,id in enumerate(ids[1:],1):
    intro=record(root/f'content/_sections/{id}.md')
    kind=id if id in ['research','people','publications','contact'] else 'cards'
    html+=f'<section id="{id}" class="section section-{kind}"><div class="section-heading"><p class="eyebrow section-label"><span>0{i}</span> / {id.title()}</p><div><h2>{e(intro["title"])}</h2><div class="section-intro prose">{prose(intro["body"])}</div></div></div>'
    if id=='people':
        html+='''<article class="professor"><div class="portrait-wrap"><img src="assets/images/people/jesus-david-gonzalez.png" alt="Jesus David Gonzalez Llorente" width="480" height="540"><span>Professor / ÉTS MONTRÉAL</span></div><div class="professor-copy"><p class="eyebrow">Meet the professor</p><h3>Jesus David Gonzalez Llorente</h3><p class="meta">Department of Aerospace Engineering<br>École de technologie supérieure</p><p>Professor Gonzalez Llorente’s expertise spans spacecraft and small-satellite engineering, qualification, power systems, AI/ML in space, control, energy conversion and storage, and cyber-physical systems.</p><ul class="degrees"><li><strong>B.Eng.</strong><span>UNAL, Colombia</span></li><li><strong>M.Sc.</strong><span>UPRM, Puerto Rico</span></li><li><strong>Ph.D.</strong><span>Kyutech, Japan</span></li></ul><a class="text-link" href="https://www.etsmtl.ca/en/study-at-ets/professors/jgonzalez-llorente">Official ÉTS profile ↗</a></div></article><div class="subheading"><h3>Students & supervision</h3><span>From the official faculty profile</span></div><div class="cards">'''+card(record(root/'content/_students/saavan-ravindranath.md'))+'</div>'
    elif id=='publications':
        html+='''<div class="publication-tools" hidden><label for="publication-search">Find a publication<input id="publication-search" type="search" placeholder="Search title, author, or year"></label><label for="publication-type">Publication type<select id="publication-type"><option value="all">All publications</option><option value="Journal article">Journal articles</option><option value="Conference contribution">Conference contributions</option></select></label><span id="publication-count" role="status" aria-live="polite"></span></div><div class="publication-list" data-limit="5">'''
        for pub in sorted([record(p) for p in (root/'content/_publications').glob('*.md')],key=lambda p:p['year'],reverse=True):
            html+=f'<article class="publication" data-type="{e(pub["type"])}"><span class="pub-year">{pub["year"]}</span><div><span class="eyebrow">{e(pub["type"])}</span><h3><a href="{e(pub["link"])}">{e(pub["title"])} ↗</a></h3><p class="authors">{e(pub["authors"])}</p><p class="venue">{e(pub["venue"])}</p></div></article>'
        html+='</div><button id="show-publications" class="button button-outline" hidden>Show all publications</button>'
    elif id=='contact':
        html+='''<div class="contact-grid"><div><span class="eyebrow">Research & collaboration</span><a class="contact-email" href="mailto:Jesus-David.Gonzalez-Llorente@etsmtl.ca">Jesus-David.Gonzalez-Llorente@etsmtl.ca ↗</a><p>Department of Aerospace Engineering<br>École de technologie supérieure<br>Montréal, Québec, Canada</p></div><div class="contact-links"><a href="https://scholar.google.com/citations?user=pBC8EsoAAAAJ">Google Scholar ↗</a><a href="https://orcid.org/0000-0001-6525-7657">ORCID ↗</a></div></div>'''
    else:
        records=[record(p) for p in (root/f'content/_{id}').glob('*.md')]
        html+=f'<div class="cards {"research-grid" if id=="research" else ""}">'+''.join(card(p) for p in sorted(records,key=lambda p:p.get('order',0)))+'</div>'
    html+='</section>'
html+='</main><footer><a class="footer-brand" href="#home">Space Systems & Energy ↗</a><div><p>Independent academic research website. Not an official ÉTS website.</p><p>Working research-group name — replace when confirmed.</p></div><a href="#main">Back to top ↑</a></footer></body></html>'
(out/'index.html').write_text(html,encoding='utf-8')
for folder in ['css','js','images']:
    shutil.copytree(root/'assets'/folder,out/'assets'/folder,dirs_exist_ok=True)
print('Visual fixture generated at _preview/index.html. This does not verify Jekyll/Liquid execution.')
