/* ============================================================
   ScaleUp — promo banner
   Scrolling strip above every page for the current leasing
   special. Edit PROMO to change the wording, link, or end date;
   after PROMO.ends the banner (and anything marked
   data-promo-until) disappears on its own. Loaded right after
   <body> so the strip is in place before the page paints.
   ============================================================ */
const PROMO = {
  ends: '2026-11-30T23:59:59-06:00',   // end of Nov 30, Central time
  href: '/rockwall-flex-space-for-lease.html#leasing-specials',
  label: 'Early bird: up to 5 months free rent at Rockwall. 3, 4 or 5-year leases. Offer ends Nov 30, 2026.',
  items: [
    'Early bird: up to <b>5 months free rent</b> at Rockwall',
    '3, 4 or 5-year leases',
    'Offer ends Nov 30, 2026',
  ],
};

(() => {
  const expired = Date.now() > new Date(PROMO.ends).getTime();
  if (expired) {
    document.documentElement.classList.add('su-promo-over');
    return;
  }
  if (document.querySelector('.su-promo')) return;

  const one = PROMO.items.map((t) => `<span class="su-promo-item">${t}<i class="su-promo-dot"></i></span>`).join('');
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
