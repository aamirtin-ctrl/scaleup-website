/* ============================================================
   ScaleUp — promo banner
   Scrolling strip above every page. Edit PROMO to change the
   wording or link. Set PROMO.ends to an ISO date to have the
   banner (and anything marked data-promo-until) disappear on its
   own after that moment; null keeps it up. Loaded right after
   <body> so the strip is in place before the page paints.
   No pricing or promotional offers here — leasing message only.
   ============================================================ */
const PROMO = {
  ends: null,
  href: '/contact.html#su-book',
  label: 'Rockwall Flex Park: Vertical construction has begun. Model units open December 2026. Pre-leasing is now open. Book a tour.',
  items: [
    'Rockwall Flex Park is rising: <b>Vertical construction has begun</b>',
    'Model units open <b>December 2026</b>',
    'Pre-leasing is now open: <b>get first pick of the bays</b>',
    'Book your tour &rarr;',
  ],
};

(() => {
  const expired = PROMO.ends && Date.now() > new Date(PROMO.ends).getTime();
  if (expired) {
    document.documentElement.classList.add('su-promo-over');
    return;
  }
  if (document.querySelector('.su-promo')) return;

  const one = PROMO.items.map((t) => `<span class="su-promo-item"><span>${t}</span><i class="su-promo-dot"></i></span>`).join('');
  const bar = document.createElement('a');
  bar.className = 'su-promo';
  bar.href = PROMO.href;
  bar.setAttribute('aria-label', PROMO.label);
  // the strip is the readable copy x4 so the loop is seamless; screen readers get aria-label instead
  bar.innerHTML = `<span class="su-promo-track" aria-hidden="true">${one.repeat(4)}</span>`;
  document.body.prepend(bar);
  document.body.classList.add('has-promo');

  // pinned headers ([data-stick]) sit below the strip at the top of the
  // page and slide up to the edge as the strip scrolls away
  const root = document.documentElement;
  let ticking = false;
  const sync = () => {
    ticking = false;
    const h = bar.offsetHeight;
    root.style.setProperty('--promo-h', h + 'px');
    root.style.setProperty('--promo-off', Math.max(0, h - window.scrollY) + 'px');
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(sync); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  sync();
})();
