(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Typewriter */
  const roles = ['AI Engineer', 'Computer Science Student', 'Competitive Programmer'];
  const tw = $('#tw');
  if (tw && !reduce) {
    let r = 0, c = 0, del = false;
    const tick = () => {
      const word = roles[r];
      c += del ? -1 : 1;
      tw.textContent = word.slice(0, c);
      let wait = del ? 45 : 90;
      if (!del && c === word.length) { del = true; wait = 1600; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    };
    tw.textContent = '';
    setTimeout(tick, 500);
  }

  /* Mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.firstElementChild.className = open ? 'fas fa-xmark' : 'fas fa-bars';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Active nav link */
  const links = $$('a', menu);
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.classList.toggle('on', l.hash === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));

  /* Certificate tabs */
  const tabs = $$('.tab'), certs = $$('.cert');
  const pick = tab => {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    certs.forEach(c => { c.hidden = tab.dataset.f !== 'all' && c.dataset.c !== tab.dataset.f; });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pick(t));
    t.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); pick(n);
    });
  });

  /* Contact form */
  const form = $('#form'), status = $('#status'), send = $('#send');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    send.disabled = true;
    status.textContent = 'Sending your message…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) { status.textContent = 'Message sent. I’ll reply by email soon.'; form.reset(); }
      else status.textContent = data.message || 'The message was not sent. Please try again.';
    } catch {
      status.textContent = 'No connection. Check your internet and try again.';
    } finally { send.disabled = false; }
  });

  $('#yr').textContent = new Date().getFullYear();
})();
