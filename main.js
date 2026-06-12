/* ============================================================
   ScaleUp — main.js
   Deck swap + scroll-expand/close engine, about, testimonials
   ============================================================ */

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* ---------------- data ---------------- */
const DEVS = [
  {
    name: 'Rockwall', region: 'NORTH TEXAS', location: 'Rockwall, TX',
    address: '4156 N Goliad St, Rockwall, TX',
    status: 'Under Construction', leasing: false, eyebrow: 'UNDER CONSTRUCTION — DELIVERY SUMMER 2027',
    cta: 'Schedule a tour',
    tagline: 'Room to scale up.',
    timeline: [ // placeholder milestones — Aamir will supply real dates/details
      { date: 'March 2026', title: 'Groundbreaking', desc: '5-acre site on N Goliad St.', state: 'done' },
      { date: 'Now', title: 'Site work & foundations', desc: 'Grading, utilities, and building pads.', state: 'current' },
      { date: 'TBD', title: 'Vertical construction' },
      { date: 'TBD', title: 'Finish-out & paving' },
      { date: 'Summer 2027', title: 'Delivery & move-ins' },
    ],
    img: 'assets/rockwall.webp',
    blurb: 'A 5-acre flex park with highway frontage on N Goliad — 30 warehouse, showroom, and flex units with individual HVAC, 3-phase power, LED lighting, and grade-level bays.',
    stats: [
      { label: 'TOTAL UNITS', val: '30' },
      { label: 'RENTABLE AREA', val: '54,000 SF' },
      { label: 'DELIVERY', val: 'Summer 2027' },
    ],
    spaces: {
      minis: [
        ['30', 'UNITS'],
        ['54,000', 'SF TOTAL'],
        ["18'", 'CLEAR HEIGHT'],
        ['12×12', 'GRADE DOORS'],
      ],
      units: [
        { name: 'Showroom unit', sub: 'Bldgs A & E · west end · glass front, open bay', size: '3,000 SF', rate: '$ — / mo' },
        { name: 'Standard bay', sub: 'Bldgs A–D · office front, roll-up rear', size: '1,500 SF', rate: '$ — / mo' },
        { name: 'Large bay', sub: 'Bldgs F–I · office front, roll-up rear', size: '2,000 SF', rate: '$ — / mo' },
      ],
      chips: ['Individual HVAC', '3-phase power', 'LED lighting', 'Concrete paving', 'Landscaping included'],
      note: 'Rates follow the leasing rate plan — PDF available on request.',
    },
    plans: {
      lede: '4156 N Goliad St, Rockwall, TX — five acres of highway frontage, with showroom space in two highway-facing units.',
      cards: [
        { name: 'Showroom unit', size: '3,000 SF', sub: 'Bldgs A/E west end · glass front, open bay', img: 'assets/3000rockwall.webp' },
        { name: 'Standard bay', size: '1,500 SF', sub: 'Bldgs A–D · office front, roll-up rear', img: 'assets/1500rockwall.webp' },
        { name: 'Large bay', size: '2,000 SF', sub: 'Bldgs F–I · office front, roll-up rear', img: 'assets/2000rockwall.webp' },
      ],
      minis: [
        ['5 acres', 'SITE'],
        ['~85%', 'WAREHOUSE MIX'],
        ['3-phase', 'POWER'],
        ['Ample', 'PARKING'],
      ],
    },
  },
  {
    name: 'McKinney', region: 'NORTH TEXAS', location: 'McKinney, TX',
    address: '1990 N McDonald St, McKinney, TX 75071',
    status: 'In Planning', leasing: false, eyebrow: 'IN PLANNING — BREAKING GROUND Q3 2026',
    cta: 'Register interest',
    img: 'assets/mckinney.webp',
    blurb: 'A planned 6.2-acre flex industrial development on N McDonald St — roughly 75,000 SF of warehouse and flex space, including about 20,000 SF of retail and showroom frontage.',
    stats: [
      { label: 'SITE SIZE', val: '6.20 acres' },
      { label: 'PLANNED BUILD', val: '75,000± SF' },
      { label: 'GROUNDBREAKING', val: 'Q3 2026' },
    ],
    outlook: {
      minis: [
        ['6.20', 'ACRES'],
        ['75,000±', 'SF PLANNED'],
        ['~20K', 'SF RETAIL / SHOWROOM'],
        ['Q3 2026', 'GROUNDBREAKING'],
      ],
      rows: [
        { name: 'Site secured', sub: '1990 N McDonald St, McKinney, TX 75071', val: 'Complete', state: 'done' },
        { name: 'Planning & design', sub: 'Site plan, entitlements, and engineering', val: 'In progress', state: 'current' },
        { name: 'Groundbreaking', sub: 'Construction start', val: 'Q3 2026' },
        { name: 'Pre-leasing', sub: 'Unit mix, rates, and floor plans announced', val: 'To be announced' },
      ],
      note: 'Unit mix and rates will be published as planning completes.',
    },
    timeline: [ // placeholder milestones — Aamir will supply real dates/details
      { date: 'Early 2026', title: 'Site secured', desc: '1990 N McDonald St, McKinney, TX 75071', state: 'done' },
      { date: 'Now', title: 'Planning & design', desc: 'Site plan, entitlements, and engineering underway.', state: 'current' },
      { date: 'Q3 2026', title: 'Groundbreaking' },
      { date: 'TBD', title: 'Vertical construction' },
      { date: 'TBD', title: 'Delivery & move-ins' },
    ],
  },
  {
    name: 'Princeton', region: 'NORTH TEXAS', location: 'Princeton, TX',
    status: 'Coming Soon', leasing: false, eyebrow: 'COMING SOON — CONTRACT UNDER REVIEW',
    cta: 'Register interest',
    img: 'assets/princeton.webp',
    blurb: 'Our next North Texas site, along the Highway 380 corridor. The land contract is still under review — plans, specs, and leasing details will be announced once it closes.',
    stats: [
      { label: 'STATUS', val: 'Under review' },
      { label: 'DETAILS', val: 'Coming soon' },
      { label: 'CORRIDOR', val: 'Hwy 380' },
    ],
    timeline: [ // placeholder milestones — Aamir will supply real dates/details
      { date: 'Now', title: 'Contract under review', desc: 'Land contract in negotiation.', state: 'current' },
      { date: 'TBD', title: 'Site announcement' },
      { date: 'TBD', title: 'Planning & design' },
    ],
  },
];

/* ============================================================
   DEVELOPMENTS DECK
   ============================================================ */
const scene = document.getElementById('su-scene');
const deckRoot = document.getElementById('su-deck-root');
const leftPanel = document.getElementById('su-left');
const hintEl = document.getElementById('su-hint');
const tabsRoot = document.getElementById('su-tabs');
const devsSection = document.getElementById('developments');

let active = 0; // start on Rockwall (the fully built-out card)
let swapping = false;

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

function buildCard(d, idx) {
  const card = el('div', 'su-card');
  card.appendChild(Object.assign(el('img', 'su-card-img'), { src: d.img, alt: d.name + ' development', decoding: 'async' }));
  card.appendChild(el('div', 'su-card-grad'));

  // back-of-deck label
  const backlabel = el('span', 'su-backlabel', d.name);
  card.appendChild(backlabel);

  // compact face
  const dot = d.leasing ? 'var(--green)' : 'var(--amber)';
  const face = el('div', 'su-face', `
    <div class="su-pill"><span class="su-pill-dot" style="background:${dot}"></span><span>${d.status}</span></div>
    <div class="su-face-bottom">
      <div class="su-face-id">
        <span class="su-face-name">${d.name}</span>
        <span class="su-face-loc"><i></i>${d.location}</span>
      </div>
      <span class="su-face-go">&#8594;</span>
    </div>`);
  card.appendChild(face);

  // detail layer — 1 to 3 inner pages the scroll steps through
  const detail = el('div', 'su-detail');
  const inner = el('div', 'su-detail-inner');
  const pageCount = 1 + (d.spaces ? 1 : 0) + (d.plans ? 1 : 0) + (d.outlook ? 1 : 0);
  inner.style.height = (pageCount * 100) + '%';
  const pageH = (100 / pageCount) + '%';

  const statsHtml = d.stats.map(s =>
    `<div class="su-spec"><span class="su-spec-label">${s.label}</span><span class="su-spec-val">${s.val}</span></div>`).join('');
  const moreLabel = d.spaces ? 'SPACES &amp; RATES' : 'THE PLAN';
  const moreHint = pageCount > 1
    ? `<span class="su-detail-more">${moreLabel} <span class="su-hint-arrow">&#8595;</span></span>` : '';
  const tagline = d.tagline ? `<span class="su-detail-tag">${d.tagline}</span>` : '';

  const page1 = el('div', 'su-page', `
    <div class="su-detail-top">
      <div class="su-crumb">
        <span class="su-logo-mark su-logo-mark-sm"><i></i><i></i><i></i></span>
        <span class="su-crumb-path">ScaleUp / Developments /</span>
        <span class="su-crumb-here">${d.name}</span>
      </div>
      <div class="su-pill-outline"><span class="su-pill-dot" style="background:${dot}"></span><span>${d.status}</span></div>
    </div>
    <div class="su-detail-bottom">
      <div class="su-detail-id">
        <span class="su-detail-eyebrow">${d.eyebrow}</span>
        <h3 class="su-detail-name">${d.name}</h3>
        <span class="su-detail-loc"><i></i>${d.address || d.location}</span>
        ${tagline}
      </div>
      <div class="su-detail-row">
        <p class="su-detail-blurb">${d.blurb}</p>
        <div class="su-specs">${statsHtml}</div>
      </div>
      <div class="su-detail-ctas">
        <a href="#contact" class="su-btn-fill">${d.cta || 'Schedule a tour'} <span class="su-arr">&#8594;</span></a>
        <button type="button" class="su-btn-ghost su-progress-btn">View progress</button>
        ${moreHint}
      </div>
    </div>`);
  page1.style.height = pageH;
  inner.appendChild(page1);

  if (d.outlook) {
    const minisHtml = d.outlook.minis.map(([v, l]) =>
      `<div class="su-ministat"><span class="su-mini-val">${v}</span><span class="su-mini-label">${l}</span></div>`).join('');
    const rowsHtml = d.outlook.rows.map(r => `
      <div class="su-unit su-phase">
        <div class="su-unit-id">
          <span class="su-unit-name">${r.name}</span>
          <span class="su-unit-sub">${r.sub}</span>
        </div>
        <span class="su-phase-status${r.state ? ' ' + r.state : ''}">${r.val}</span>
      </div>`).join('');

    const planPage = el('div', 'su-page', `
      <div class="su-subpage">
        <div class="su-sub-head">
          <div>
            <span class="su-sub-eyebrow">${d.name.toUpperCase()} — PROJECT OUTLOOK</span>
            <h3 class="su-sub-title">The plan</h3>
          </div>
          <div class="su-ministats">${minisHtml}</div>
        </div>
        <div class="su-units">${rowsHtml}</div>
        <div class="su-sub-foot">
          <span class="su-sub-note">${d.outlook.note || ''}</span>
          <span class="su-sub-exit">KEEP SCROLLING TO CLOSE <span class="su-hint-arrow">&#8595;</span></span>
        </div>
      </div>`);
    planPage.style.height = pageH;
    inner.appendChild(planPage);
  }

  if (d.spaces) {
    const minisHtml = d.spaces.minis.map(([v, l]) =>
      `<div class="su-ministat"><span class="su-mini-val">${v}</span><span class="su-mini-label">${l}</span></div>`).join('');
    const unitsHtml = d.spaces.units.map(u => `
      <div class="su-unit">
        <div class="su-unit-id">
          <span class="su-unit-name">${u.name}</span>
          <span class="su-unit-sub">${u.sub}</span>
        </div>
        <span class="su-unit-size">${u.size}</span>
        <span class="su-unit-rate">${u.rate}</span>
        <a href="#contact" class="su-link-red">Inquire &#8594;</a>
      </div>`).join('');
    const chipsHtml = d.spaces.chips.map(c => `<span class="su-chip">${c}</span>`).join('');

    const page2 = el('div', 'su-page', `
      <div class="su-subpage">
        <div class="su-sub-head">
          <div>
            <span class="su-sub-eyebrow">${d.name.toUpperCase()} FLEX PARK</span>
            <h3 class="su-sub-title">Spaces &amp; rates</h3>
          </div>
          <div class="su-ministats">${minisHtml}</div>
        </div>
        <div class="su-units">${unitsHtml}</div>
        <div class="su-sub-foot">
          <div class="su-chips">${chipsHtml}</div>
          <span class="su-sub-note">${d.spaces.note}</span>
          <span class="su-sub-exit">PLANS &amp; THE SITE <span class="su-hint-arrow">&#8595;</span></span>
        </div>
      </div>`);
    page2.style.height = pageH;
    inner.appendChild(page2);
  }

  if (d.plans) {
    const planCardsHtml = d.plans.cards.map(pc => `
      <div class="su-plancard">
        <div class="su-plan-thumb${pc.img ? ' su-plan-thumb-img' : ''}">
          ${pc.img
            ? `<img src="${pc.img}" alt="${pc.name} — ${pc.size} interior" loading="lazy"><span class="su-plan-size">${pc.size}</span>`
            : `<span>FLOOR PLAN</span><span>${pc.size}</span>`}
        </div>
        <div class="su-plan-body">
          <span class="su-plan-name">${pc.name}</span>
          <span class="su-plan-sub">${pc.sub}</span>
          <a href="#contact" class="su-link-red">Request plan &#8594;</a>
        </div>
      </div>`).join('');
    const siteMinisHtml = d.plans.minis.map(([v, l]) =>
      `<div class="su-ministat"><span class="su-mini-val">${v}</span><span class="su-mini-label">${l}</span></div>`).join('');

    const page3 = el('div', 'su-page', `
      <div class="su-subpage">
        <div class="su-sub-head">
          <div>
            <span class="su-sub-eyebrow">FLOOR PLANS &amp; SITE PLAN</span>
            <h3 class="su-sub-title">Plans &amp; the site</h3>
          </div>
          <p class="su-sub-lede">${d.plans.lede}</p>
        </div>
        <div class="su-plans">${planCardsHtml}</div>
        <div class="su-sub-foot">
          <div class="su-ministats">${siteMinisHtml}</div>
          <span class="su-sub-exit">KEEP SCROLLING TO CLOSE <span class="su-hint-arrow">&#8595;</span></span>
        </div>
      </div>`);
    page3.style.height = pageH;
    inner.appendChild(page3);
  }

  detail.appendChild(inner);
  card.appendChild(detail);

  card.addEventListener('click', () => {
    if (state.t > 0.05) return;
    if (idx !== active) { select(idx); return; }
    // clicking the front card scrolls into the expanded detail view
    const track = devsSection.offsetHeight - window.innerHeight;
    window.scrollTo({ top: devsSection.offsetTop + track * 0.36, behavior: 'smooth' });
  });

  card.querySelector('.su-progress-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openProgress(idx);
  });

  return { el: card, face, backlabel, detail, inner, pageCount, data: d };
}

/* ---- construction progress modal ---- */
const modal = el('div', 'su-modal', `
  <div class="su-modal-back"></div>
  <div class="su-modal-panel">
    <button type="button" class="su-modal-close" aria-label="Close">&#10005;</button>
    <span class="su-modal-eyebrow">CONSTRUCTION PROGRESS</span>
    <h3 class="su-modal-title"></h3>
    <p class="su-modal-sub"></p>
    <div class="su-tl"></div>
  </div>`);
document.body.appendChild(modal);

function openProgress(i) {
  const d = DEVS[i];
  modal.querySelector('.su-modal-title').textContent = d.name;
  modal.querySelector('.su-modal-sub').textContent = d.address || d.location;
  modal.querySelector('.su-tl').innerHTML = (d.timeline || []).map(m => `
    <div class="su-tl-item${m.state ? ' ' + m.state : ''}">
      <span class="su-tl-dot"></span>
      <span class="su-tl-date">${m.date.toUpperCase()}</span>
      <div class="su-tl-name">${m.title}</div>
      ${m.desc ? `<p class="su-tl-desc">${m.desc}</p>` : ''}
    </div>`).join('');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProgress() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
modal.querySelector('.su-modal-back').addEventListener('click', closeProgress);
modal.querySelector('.su-modal-close').addEventListener('click', closeProgress);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProgress(); });

const cards = DEVS.map(buildCard);
cards.forEach(c => deckRoot.appendChild(c.el));

/* ---- tabs ---- */
const tabEls = DEVS.map((d, i) => {
  const b = el('button', 'su-tab', `
    <span class="su-tab-bar"></span>
    <span class="su-tab-text">
      <span class="su-tab-name">${d.name}</span>
      <span class="su-tab-region">${d.region}</span>
    </span>
    <span class="su-tab-status ${d.leasing ? 'leasing' : 'soon'}">${d.status}</span>`);
  b.addEventListener('click', () => select(i));
  tabsRoot.appendChild(b);
  return b;
});

function updateTabs() {
  tabEls.forEach((t, i) => t.classList.toggle('active', i === active));
}

/* ---- card swap (no reload — cards physically trade places) ---- */
function select(i) {
  if (i === active || swapping || state.t > 0.05) return;
  active = i;
  swapping = true;
  cards.forEach(c => c.el.classList.add('swapping'));
  updateTabs();
  applyFrame();
  setTimeout(() => {
    cards.forEach(c => c.el.classList.remove('swapping'));
    swapping = false;
  }, 680);
}

/* ---- scroll-driven state ---- */
const state = { p: 0, t: 0 };

function computeState() {
  const vh = window.innerHeight;
  const total = devsSection.offsetHeight - vh;
  const top = devsSection.getBoundingClientRect().top;
  const p = total > 0 ? clamp(-top / total, 0, 1) : 0;

  const cpRaw = clamp((p - 0.08) / 0.22, 0, 1);   // expand
  const ccRaw = clamp((p - 0.74) / 0.18, 0, 1);   // close
  state.p = p;
  state.t = ease(cpRaw) * (1 - ease(ccRaw));      // 0 = in deck, 1 = fullscreen
}

// inner page progress: 0..(n-1), linear with scroll — sections slide freely
// under the finger instead of stepping/holding
function innerProgress(p, n) {
  if (n <= 1) return 0;
  const start = 0.32, end = 0.72;
  return clamp((p - start) / (end - start), 0, 1) * (n - 1);
}

const SLOT_TRANSFORMS = [
  null, // front (rotation computed per-frame)
  'rotate(6.5deg) translate(11%, 5%) scale(0.95)',
  'rotate(-7deg) translate(-11%, 7%) scale(0.92)',
];

const styleCache = new WeakMap();
function setStyles(node, styles) {
  let cache = styleCache.get(node);
  if (!cache) { cache = {}; styleCache.set(node, cache); }
  for (const k in styles) {
    const v = styles[k];
    if (cache[k] !== v) { cache[k] = v; node.style[k] = v; }
  }
}

function applyFrame() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { p, t } = state;

  // resting rect of the deck (right side of scene; below the tabs on phones)
  const mobile = vw < 700;
  const restL = mobile ? 0.06 * vw : 0.50 * vw;
  const restT = mobile ? 0.40 * vh : 0.13 * vh;
  const restW = mobile ? 0.88 * vw : 0.44 * vw;
  const restH = mobile ? 0.50 * vh : 0.74 * vh;

  // front card geometry: deck rect -> fullscreen -> back again
  const fL = lerp(restL, 0, t);
  const fT = lerp(restT, 0, t);
  const fW = lerp(restW, vw, t);
  const fH = lerp(restH, vh, t);
  const fRadius = lerp(20, 0, t);
  const fRot = lerp(-1.6, 0, clamp(t * 1.6, 0, 1));

  const panelO = clamp(1 - t / 0.30, 0, 1);
  const backO = clamp(1 - t / 0.22, 0, 1);
  const hintO = clamp(1 - p / 0.05, 0, 1);
  const faceO = clamp(1 - (t - 0.30) / 0.25, 0, 1);
  const detailO = clamp((t - 0.62) / 0.30, 0, 1);

  // left panel + hint
  setStyles(leftPanel, {
    opacity: panelO.toFixed(3),
    transform: (mobile ? '' : 'translateY(-50%) ') + `translateX(${(-30 * (1 - panelO)).toFixed(2)}px)`,
    pointerEvents: panelO < 0.2 ? 'none' : 'auto',
  });
  setStyles(hintEl, { opacity: hintO.toFixed(3) });

  cards.forEach((c, idx) => {
    const slot = (idx - active + 3) % 3; // 0 = front, 1 = backA, 2 = backB

    if (slot === 0) {
      setStyles(c.el, {
        left: fL.toFixed(2) + 'px',
        top: fT.toFixed(2) + 'px',
        width: fW.toFixed(2) + 'px',
        height: fH.toFixed(2) + 'px',
        borderRadius: fRadius.toFixed(2) + 'px',
        transform: `rotate(${fRot.toFixed(3)}deg)`,
        zIndex: '6',
        opacity: '1',
        boxShadow: t < 0.9 ? '0 50px 100px rgba(74,56,30,0.35)' : 'none',
      });
      c.el.classList.remove('is-back');

      setStyles(c.face, { opacity: faceO.toFixed(3) });
      setStyles(c.backlabel, { opacity: '0' });
      setStyles(c.detail, {
        opacity: detailO.toFixed(3),
        pointerEvents: detailO > 0.5 ? 'auto' : 'none',
      });
      if (c.pageCount > 1) setStyles(c.inner, {
        transform: `translateY(${(-innerProgress(p, c.pageCount) * (100 / c.pageCount)).toFixed(4)}%)`,
      });
    } else {
      setStyles(c.el, {
        left: restL.toFixed(2) + 'px',
        top: restT.toFixed(2) + 'px',
        width: restW.toFixed(2) + 'px',
        height: restH.toFixed(2) + 'px',
        borderRadius: '18px',
        transform: SLOT_TRANSFORMS[slot],
        zIndex: slot === 1 ? '2' : '1',
        opacity: backO.toFixed(3),
        boxShadow: '0 30px 60px rgba(74,56,30,0.25)',
      });
      c.el.classList.add('is-back');

      setStyles(c.face, { opacity: '0' });
      setStyles(c.backlabel, { opacity: '1' });
      setStyles(c.detail, { opacity: '0', pointerEvents: 'none' });
      if (c.pageCount > 1) setStyles(c.inner, { transform: 'translateY(0)' });
    }
  });
}

let raf = null;
function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = null;
    computeState();
    applyFrame();
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
computeState();
updateTabs();
applyFrame();

/* ============================================================
   TESTIMONIALS — symmetric arch, floating cards, hover popups
   ============================================================ */
const TESTIMONIALS = [
  { img: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Marcus Bell', role: 'Owner, Bell Cabinet Co.',
    quote: 'We outgrew two shops before finding ScaleUp. The 3,000 SF unit with grade-level doors changed how we run deliveries — trucks back right in, no dock games.' },
  { img: 'https://randomuser.me/api/portraits/women/44.jpg', name: 'Priya Nair', role: 'Founder, Nair Wellness Group',
    quote: 'The leasing process was the easiest I’ve ever been through. One walkthrough, straight answers on pricing, and we signed the same week.' },
  { img: 'https://randomuser.me/api/portraits/men/15.jpg', name: 'Tom Garrity', role: 'Principal, Garrity Engineering',
    quote: 'Our McKinney suite looks like it costs twice the rent. Clients comment on the building before we even get to the conference room.' },
  { img: 'https://randomuser.me/api/portraits/women/68.jpg', name: 'Dana Whitfield', role: 'Owner, Whitfield Interiors',
    quote: 'We took one of the highway-facing showroom units and our walk-in traffic tripled. The visibility alone pays the lease.' },
  { img: 'https://randomuser.me/api/portraits/men/52.jpg', name: 'Luis Herrera', role: 'CEO, Herrera Logistics',
    quote: '3-phase power and 20-foot clears at this price point doesn’t exist anywhere else in Rockwall. We pre-leased before they broke ground.' },
  { img: 'https://randomuser.me/api/portraits/women/65.jpg', name: 'Grace Chen', role: 'CFO, Brightline Dental Partners',
    quote: 'ScaleUp worked with our buildout schedule instead of against it. We opened two weeks early — that never happens.' },
  { img: 'https://randomuser.me/api/portraits/men/76.jpg', name: 'Ray Thompson', role: 'Owner, Thompson HVAC',
    quote: 'Warehouse in the back, office in the front, our name on the door. It’s exactly the setup a trades business needs to look established.' },
  { img: 'https://randomuser.me/api/portraits/women/12.jpg', name: 'Elena Vasquez', role: 'Managing Partner, Vasquez Law',
    quote: 'Private entry, real parking, and none of the shared-lobby feel of a big office tower. Our clients love it and so does our team.' },
  { img: 'https://randomuser.me/api/portraits/men/41.jpg', name: 'Sean O’Donnell', role: 'Founder, ODL Sports Performance',
    quote: 'Finding 6,000 SF with high ceilings that didn’t look industrial-grim was impossible until this. The space sells memberships for us.' },
  { img: 'https://randomuser.me/api/portraits/women/33.jpg', name: 'Aisha Roberts', role: 'Owner, Roberts & Co. Accounting',
    quote: 'We were month-to-month in a strip center for years. Owning our presence in a building like this changed how seriously prospects take us.' },
  { img: 'https://randomuser.me/api/portraits/men/22.jpg', name: 'Jake Mills', role: 'GM, Mills Distribution',
    quote: 'The bay door spacing and truck court actually work — you can tell the people who designed it have operated buildings, not just drawn them.' },
  { img: 'https://randomuser.me/api/portraits/women/57.jpg', name: 'Karen Ito', role: 'Director, Ito Design Studio',
    quote: 'A showroom on the highway side and production in the back. One address, one lease, the whole business under one roof.' },
  { img: 'https://randomuser.me/api/portraits/men/64.jpg', name: 'Victor Adebayo', role: 'CEO, VA Medical Supply',
    quote: 'We toured eight flex parks across DFW. ScaleUp was the only one where the finish level matched the renderings.' },
  { img: 'https://randomuser.me/api/portraits/women/26.jpg', name: 'Holly Brandt', role: 'Owner, Brandt Event Rentals',
    quote: 'Inventory in the warehouse, client meetings in the showroom, and we can load three trailers at once. It just works.' },
  { img: 'https://randomuser.me/api/portraits/men/85.jpg', name: 'Paul Nguyen', role: 'Principal, Nguyen Commercial Group',
    quote: 'I place tenants all over North Texas. ScaleUp’s spaces lease faster than anything else I show — people walk in and stop comparing.' },
];

// symmetric arch: 11 columns, x in %, y stacks in px (mirrored around center)
const T_COLS = [
  { x: 1.0,  ys: [215, 445] },
  { x: 10.0, ys: [135, 365] },
  { x: 19.0, ys: [235] },
  { x: 28.0, ys: [120] },
  { x: 37.0, ys: [200] },
  { x: 46.0, ys: [85] },
  { x: 55.0, ys: [200] },
  { x: 64.0, ys: [120] },
  { x: 73.0, ys: [235] },
  { x: 82.0, ys: [135, 365] },
  { x: 91.0, ys: [215, 445] },
];
const T_GHOSTS = [
  { x: 1.0,  y: 35 },  { x: 10.0, y: -45 }, { x: 19.0, y: 55 },
  { x: 28.0, y: -60 }, { x: 37.0, y: 20 },  { x: 46.0, y: -95 },
  { x: 55.0, y: 20 },  { x: 64.0, y: -60 }, { x: 73.0, y: 55 },
  { x: 82.0, y: -45 }, { x: 91.0, y: 35 },
];

// section is hidden for now — skip building it entirely
if (!document.getElementById('testimonials').hidden) {

const stage = document.getElementById('su-testi-stage');

T_GHOSTS.forEach(g => {
  const ghost = el('div', 't-ghost');
  ghost.style.cssText = `left:${g.x}%; top:${g.y}px; width:8%; height:150px;`;
  stage.appendChild(ghost);
});

let ti = 0;
T_COLS.forEach(col => {
  col.ys.forEach(y => {
    const t = TESTIMONIALS[ti % TESTIMONIALS.length];
    const card = el('div', 't-card');
    card.style.cssText =
      `left:${col.x}%; top:${y}px; width:8%; min-width:92px; aspect-ratio:3.1/4;` +
      `animation-duration:${4.5 + (ti % 3) * 0.9}s; animation-delay:${-((ti * 0.83) % 5).toFixed(2)}s;`;

    let popCls = 't-pop';
    if (y < 170) popCls += ' pop-below';
    if (col.x < 10) popCls += ' pop-left';
    else if (col.x > 82) popCls += ' pop-right';

    card.innerHTML = `
      <div class="t-card-photo"><img src="${t.img}" alt="${t.name}" loading="lazy"></div>
      <div class="${popCls}">
        <div class="t-pop-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="t-pop-quote">&ldquo;${t.quote}&rdquo;</p>
        <div class="t-pop-who">
          <span class="t-pop-name">${t.name}</span>
          <span class="t-pop-role">${t.role}</span>
        </div>
      </div>`;
    stage.appendChild(card);
    ti++;
  });
});

}

/* ============================================================
   CONTACT — delivers to contactus@scaleupflex.com via FormSubmit;
   falls back to the visitor's mail client if the request fails
   ============================================================ */
const CONTACT_EMAIL = 'contactus@scaleupflex.com';

document.getElementById('su-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const f = new FormData(form);
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Sending…';
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: f.get('name'),
        email: f.get('email'),
        development: f.get('dev'),
        message: f.get('message'),
        _subject: `Leasing inquiry — ${f.get('dev')}`,
        _replyto: f.get('email'),
        _template: 'table',
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || String(data.success) !== 'true') throw new Error('send failed');
    form.reset();
    btn.textContent = 'Inquiry sent ✓';
    setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 4000);
  } catch {
    const subject = encodeURIComponent(`Leasing inquiry — ${f.get('dev')}`);
    const body = encodeURIComponent(`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nDevelopment: ${f.get('dev')}\n\n${f.get('message')}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    btn.innerHTML = original;
    btn.disabled = false;
  }
});
