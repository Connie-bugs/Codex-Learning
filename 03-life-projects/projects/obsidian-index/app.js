(function () {
  const grid = document.querySelector('#newsGrid');
  const resultCount = document.querySelector('#resultCount');
  const searchInput = document.querySelector('#searchInput');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const menuButton = document.querySelector('#menuButton');
  const nav = document.querySelector('#mainNav');
  let activeFilter = 'all';

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

  function matchesFilter(item) {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'adjacent') return item.brand === 'ADJACENT SIGNAL';
    return item.brand.toLowerCase().replaceAll(' ', '-') === activeFilter;
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const items = window.fashionItems.filter((item) => {
      const haystack = [item.brand, item.title, item.summary, item.source].join(' ').toLowerCase();
      return matchesFilter(item) && (!query || haystack.includes(query));
    }).sort((a, b) => b.date.localeCompare(a.date));
    resultCount.textContent = String(items.length).padStart(2, '0');
    grid.innerHTML = items.length ? items.map((item, index) => `
      <article class="news-card ${item.featured ? 'is-featured' : ''}" data-tone="${escapeHTML(item.tone)}">
        <a class="card-image" href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer" aria-label="打开 ${escapeHTML(item.title)} 来源">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.brand)} 的编辑配图" loading="lazy">
          <span class="card-index">${String(index + 1).padStart(2, '0')}</span>
          <span class="card-signal">${item.featured ? 'SIGNAL / 01' : 'INDEXED'}</span>
        </a>
        <div class="card-body">
          <div class="card-meta"><span>${escapeHTML(item.brand)}</span><span>${escapeHTML(item.dateLabel)}</span></div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.summary)}</p>
          <a class="source-link" href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer">${escapeHTML(item.source)} <span>↗</span></a>
        </div>
      </article>`).join('') : '<div class="empty-state">没有匹配的信号。尝试换一个关键词或回到全部。</div>';
  }

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    render();
  }));
  searchInput.addEventListener('input', render);
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('is-open')));
  render();
})();
