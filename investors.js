/* ============================================================
   ScaleUp — investors.js
   Access gate, hero entrance, scroll reveals, count-ups
   ============================================================ */

// Client-side gate only — keeps casual visitors out, not a vault.
// Change the code here; share it with investors directly.
const ACCESS_CODE = 'scaleup2026';
const ACCESS_KEY = 'su-investor-access';

const gate = document.getElementById('iv-gate');
const gateForm = document.getElementById('iv-gate-form');
const codeInput = document.getElementById('iv-code');

function unlock(instant) {
  document.body.classList.remove('iv-locked');
  if (instant) gate.style.display = 'none';
  else gate.classList.add('open');
  // kick off hero entrance (flip-in polaroids + rising lines)
  setTimeout(() => document.body.classList.add('iv-unlocked'), 30);
}

if (sessionStorage.getItem(ACCESS_KEY) === '1') {
  unlock(true);
}

gateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (codeInput.value.trim().toLowerCase() === ACCESS_CODE) {
    sessionStorage.setItem(ACCESS_KEY, '1');
    unlock(false);
  } else {
    gateForm.classList.remove('iv-wrong');
    void gateForm.offsetWidth; // restart shake
    gateForm.classList.add('iv-wrong');
    codeInput.select();
  }
});

/* ---------------- meet the team — rotating stage ---------------- */
// img: null renders a monogram placeholder — drop in headshot paths when ready
const TEAM = [
  {
    name: 'Murtuza Tinwala', role: 'PRINCIPAL — INDUSTRIAL & OPERATIONS', initials: 'MT', img: null,
    creds: [
      '38+ years in manufacturing and industrial real estate ownership',
      'Led a team of 50+ installers delivering 200+ projects annually',
      'Manufacturing plant development — from setup to full-scale production',
      'Deep background in international procurement and logistics',
    ],
  },
  {
    name: 'Huzefa Tinwala', role: 'PRINCIPAL — CONSTRUCTION & DESIGN', initials: 'HT', img: null,
    creds: [
      '29+ years in construction project management',
      '200+ commercial design & engineering projects delivered annually',
      'Clients include American Airlines, Toyota, SpaceX, Apple & Schwab',
      'Ground-up tilt-ups in Lewisville (65,000 SF) and Carrollton (14,000 SF), plus a 12-acre campus in Irving',
      'Sector depth across higher ed, high-rise multifamily, and airports',
    ],
  },
  {
    name: 'Khalid Motorwala', role: 'PRINCIPAL — CAPITAL & FINANCE', initials: 'KM', img: null,
    creds: [
      '30+ years across commodities exports (India) and financial services (USA)',
      'Co-founder of Al-Gyas Exports — 6th largest rice exporter from India (2023)',
      'Former Bank of America & Barclays leader — operations, analytics, capital',
      'Scaled residential rental portfolios in Philadelphia and Tampa',
      'Diversified interests in real estate, shipping & logistics across India and the UAE',
    ],
  },
];

const BUBBLE_SLOTS = [
  'left:4%; top:14%; max-width:300px;',
  'left:2%; top:54%; max-width:330px;',
  'right:3%; top:11%; max-width:300px;',
  'right:5%; top:49%; max-width:280px;',
  'left:33%; bottom:1%; max-width:430px;',
];

const stage = document.getElementById('iv-team-stage');
stage.innerHTML = `
  ${BUBBLE_SLOTS.map((pos, i) => `
    <div class="iv-bub" style="${pos} animation-delay:${-(i * 1.3)}s;">
      <div class="iv-bub-in" style="--bd:${i * 0.06}s;"><i></i><span></span></div>
    </div>`).join('')}
  <div class="iv-team-center">
    ${TEAM.map((p, i) => `
      <button type="button" class="iv-head-card" data-person="${i}" aria-label="${p.name}">
        ${p.img ? `<img src="${p.img}" alt="${p.name}">`
                : `<span class="iv-mono">${p.initials}</span><span class="iv-mono-note">PHOTO COMING</span>`}
      </button>`).join('')}
    <div class="iv-team-id">
      <h3 class="iv-team-name"></h3>
      <span class="iv-team-role"></span>
    </div>
    <div class="iv-team-dots">${TEAM.map((p, i) =>
      `<button type="button" class="iv-dot" data-i="${i}" aria-label="${p.name}"></button>`).join('')}</div>
  </div>`;

const bubEls = [...stage.querySelectorAll('.iv-bub')];
const cardEls = [...stage.querySelectorAll('.iv-head-card')];
const nameEl = stage.querySelector('.iv-team-name');
const roleEl = stage.querySelector('.iv-team-role');
const dotEls = [...stage.querySelectorAll('.iv-dot')];
const SLOT_CLASSES = ['iv-slot-main', 'iv-slot-top', 'iv-slot-right'];

let person = 0;
let rotateTimer = null;

// each card permanently holds one person; rotating reassigns slots so the
// cards physically glide clockwise (top -> main -> right -> top)
function placeCards() {
  cardEls.forEach((card, idx) => {
    const slot = (idx - person + TEAM.length) % TEAM.length; // 0 main, 1 top, 2 right
    card.classList.remove(...SLOT_CLASSES);
    card.classList.add(SLOT_CLASSES[slot]);
  });
}

function fillText(i) {
  const p = TEAM[i];
  nameEl.textContent = p.name;
  roleEl.textContent = p.role;
  bubEls.forEach((b, k) => {
    const text = p.creds[k];
    b.style.display = text ? '' : 'none';
    b.querySelector('span').textContent = text || '';
  });
}

function setDots(i) {
  dotEls.forEach((d, k) => {
    d.classList.toggle('active', k === i);
    // restart the 5s progress fill on the active dot
    if (k === i) { d.classList.remove('filling'); void d.offsetWidth; d.classList.add('filling'); }
    else d.classList.remove('filling');
  });
}

function setPerson(i, animate = true) {
  if (i === person && animate) { scheduleRotate(); return; }
  person = i;
  placeCards(); // cards start gliding to their new slots immediately
  setDots(i);
  if (!animate) { fillText(i); scheduleRotate(); return; }
  stage.classList.add('iv-switching'); // bubbles + name fade out…
  setTimeout(() => {
    fillText(i); // …swap mid-glide…
    stage.classList.remove('iv-switching'); // …and fade back in
  }, 380);
  scheduleRotate();
}

function scheduleRotate() {
  clearTimeout(rotateTimer);
  rotateTimer = setTimeout(() => setPerson((person + 1) % TEAM.length), 5000);
}

cardEls.forEach((card) => card.addEventListener('click', () => {
  const i = parseInt(card.dataset.person, 10);
  if (i !== person) setPerson(i);
}));
dotEls.forEach((d) => d.addEventListener('click', () => setPerson(parseInt(d.dataset.i, 10))));
stage.addEventListener('mouseenter', () => clearTimeout(rotateTimer));
stage.addEventListener('mouseleave', scheduleRotate);

placeCards();
fillText(0);
setDots(0);

// auto-rotate only while the stage is on screen
const stageIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) scheduleRotate(); else clearTimeout(rotateTimer); });
}, { threshold: 0.3 });
stageIO.observe(stage);

/* ---------------- active markets ---------------- */
const MARKETS = [
  { name: 'Rockwall Flex Park', loc: 'Rockwall, TX', status: 'Under construction', dot: '#C9A227', delivery: 'Summer 2027' },
  { name: 'McKinney Flex Park', loc: 'McKinney, TX', status: 'In planning', dot: '#C9A227', delivery: 'Breaking ground Q4 2026' },
  { name: 'Princeton Flex Park', loc: 'Princeton, TX', status: 'Contract under review', dot: 'rgba(36,29,19,0.35)', delivery: 'Future phase' },
  { name: 'Pipeline', loc: 'DFW + Sun Belt', status: 'Sourcing', dot: '#4FB477', delivery: 'Ongoing' },
];

document.getElementById('iv-markets').innerHTML = MARKETS.map((m, i) => `
  <div class="iv-market iv-reveal" style="--d:${i * 0.08}s;">
    <span class="iv-market-name">${m.name}</span>
    <span class="iv-market-loc">${m.loc}</span>
    <span class="iv-market-status"><i style="background:${m.dot}"></i>${m.status}</span>
    <span class="iv-market-delivery">${m.delivery}</span>
  </div>`).join('');

/* ---------------- scroll reveals ---------------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('.iv-stat-val[data-count]').forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: 0.25 });
document.querySelectorAll('.iv-reveal, .iv-bars').forEach((n) => io.observe(n));

/* ---------------- count-up numbers ---------------- */
function countUp(node) {
  if (node.dataset.done) return;
  node.dataset.done = '1';
  const target = parseFloat(node.dataset.count);
  const prefix = node.dataset.prefix || '';
  const suffix = node.dataset.suffix || '';
  const dec = parseInt(node.dataset.dec || '0', 10);
  const dur = 1300;
  let start = null;
  const tick = (ts) => {
    if (!start) start = ts;
    const k = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - k, 3);
    node.textContent = prefix + (target * eased).toFixed(dec) + suffix;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------------- hero polaroid parallax ---------------- */
const polaroids = document.querySelectorAll('.iv-polaroid');
const hero = document.querySelector('.iv-hero');
hero.addEventListener('mousemove', (e) => {
  if (!document.body.classList.contains('iv-unlocked')) return;
  const dx = (e.clientX / window.innerWidth - 0.5);
  const dy = (e.clientY / window.innerHeight - 0.5);
  polaroids.forEach((p, i) => {
    const depth = i % 2 === 0 ? 14 : 26;
    p.style.translate = `${-dx * depth}px ${-dy * depth}px`;
  });
});
