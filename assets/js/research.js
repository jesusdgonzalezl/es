document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { nav.querySelectorAll('a').forEach(a => { if(a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); } }); }, {rootMargin:'-15% 0px -65% 0px'});
 document.querySelectorAll('main>section').forEach(section => observer.observe(section));
}
const list = document.querySelector('.publication-list');
if (list) {
 const entries = [...list.querySelectorAll('.publication')];
 const search = document.querySelector('#publication-search');
 const type = document.querySelector('#publication-type');
 const more = document.querySelector('#show-publications');
 const count = document.querySelector('#publication-count');
 const limit = Math.max(1, Number(list.dataset.limit) || 5);
 let expanded = false;
 [...new Set(entries.map(entry => entry.dataset.type))].filter(value => ![...type.options].some(option => option.value === value)).forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; type.append(option); });
 document.querySelector('.publication-tools').hidden = false;
 function filter() {
  const query = search.value.trim().toLocaleLowerCase();
  const filtering = query !== '' || type.value !== 'all';
  const matches = entries.filter(entry => entry.textContent.toLocaleLowerCase().includes(query) && (type.value === 'all' || entry.dataset.type === type.value));
  entries.forEach(entry => { entry.hidden = true; });
  const visible = filtering || expanded ? matches : matches.slice(0,limit);
  visible.forEach(entry => { entry.hidden = false; });
  count.textContent = `${visible.length} of ${matches.length} publications`;
  more.hidden = filtering || matches.length <= limit;
  more.textContent = expanded ? 'Show selected publications' : `Show all ${matches.length} publications`;
  more.setAttribute('aria-expanded', String(expanded));
 }
 search.addEventListener('input', filter); type.addEventListener('change', filter);
 more.addEventListener('click', () => { expanded = !expanded; filter(); }); filter();
}
