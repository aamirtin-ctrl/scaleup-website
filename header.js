/* ============================================================
   ScaleUp — sticky header morph
   Flat and transparent at the top of the page; condenses into a
   floating pill (cream, blurred, shadowed) as you scroll.
   Modeled on the Novum / Lark header. Drives one CSS custom
   property (--hp, 0→1) so CSS does the interpolation.
   ============================================================ */
(() => {
  const wrap = document.querySelector('[data-stick]');
  if (!wrap) return;

  const RANGE = 120;              // px of scroll to fully condense
  let ticking = false, last = -1;

  const apply = () => {
    ticking = false;
    const p = Math.min(window.scrollY / RANGE, 1);
    const e = 1 - Math.pow(1 - p, 2);        // ease-out, matches Novum
    const v = Math.round(e * 1000) / 1000;
    if (v === last) return;
    last = v;
    wrap.style.setProperty('--hp', v);
    wrap.classList.toggle('is-stuck', v > 0.01);
  };

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  apply();
})();
