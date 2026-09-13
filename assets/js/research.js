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

// Each directory is independent; filters combine and do not require a server.
document.querySelectorAll('[data-people-directory]').forEach(directory => {
 const cards = [...directory.querySelectorAll('[data-person]')];
 const search = directory.querySelector('[data-people-search]');
 const role = directory.querySelector('[data-people-role]');
 const status = directory.querySelector('[data-people-status]');
 const count = directory.querySelector('[data-people-count]');
 const empty = directory.querySelector('[data-people-empty]');
 const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
 const searchable = new Map(cards.map(card => [card, normalize(card.textContent)]));
 // Include custom roles/statuses as well as the choices in the site configuration.
 [[role, 'role'], [status, 'status']].forEach(([select, key]) => {
  [...new Set(cards.map(card => card.dataset[key]))].filter(value => value && ![...select.options].some(option => option.value === value)).forEach(value => {
   const option = document.createElement('option'); option.value = value; option.textContent = value; select.append(option);
  });
 });
 function filterPeople() {
  const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
  let visible = 0;
  cards.forEach(card => {
   const matches = words.every(word => searchable.get(card).includes(word)) && (role.value === 'all' || card.dataset.role === role.value) && (status.value === 'all' || card.dataset.status === status.value);
   card.hidden = !matches; if (matches) visible++;
  });
  count.textContent = `${visible} of ${cards.length} people`;
  empty.hidden = visible > 0 || cards.length === 0;
 }
 if (cards.length) directory.querySelector('.people-filters').hidden = false;
 count.hidden = false;
 search.addEventListener('input', filterPeople);
 role.addEventListener('change', filterPeople);
 status.addEventListener('change', filterPeople);
 directory.querySelector('[data-people-reset]').addEventListener('click', () => {
  search.value = ''; role.value = 'all'; status.value = 'all'; filterPeople(); search.focus();
 });
 filterPeople();
});
