# Design handoff — ScaleUp leasing landing pages

**Ask:** redesign the *layout and composition* of three new pages. **Do not rebrand.** The site has an established visual identity that must survive intact; these three pages are the only thing that looks wrong, and it's the layout language, not the brand.

**Live pages to redesign**
- https://scaleupflex.com/flex-space-for-lease-dfw.html
- https://scaleupflex.com/rockwall-flex-space-for-lease.html
- https://scaleupflex.com/mckinney-flex-space-for-lease.html

**Reference for the correct brand feel** (these look right — match this world)
- https://scaleupflex.com/ — homepage, scroll-expanding card deck
- https://scaleupflex.com/blog.html and any article under `/blog/`

---

## 1. The problem, stated plainly

The three landing pages were built fast and landed on the default "AI-generated landing page" pattern. Concretely, what's wrong:

| Pattern used | Why it reads as templated |
|---|---|
| Every section is a grid of rounded cards (`border-radius: 12–20px`) with soft drop shadows | The single most recognizable AI-design tell |
| `grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))` for literally every section | One layout mechanism doing all the work; no compositional variety |
| 8 identical boxed "spec" tiles in a uniform grid | Real spec data shouldn't look like a feature-comparison SaaS page |
| Centered CTA panel at the bottom of every page | Stock closer |
| Boxed "fast facts" strip under the hero | Another box in a page made of boxes |
| Uniform vertical rhythm — every section the same visual weight | Nothing leads; the eye has no path |
| Everything floats on the cream; nothing is anchored or ruled | The rest of the site uses hairline rules and typography to structure, not containers |

Net effect: it's *functional and readable* but generic, and it doesn't feel like the same company as the homepage.

---

## 2. Fixed — do not change

### Palette (from `styles.css`, used site-wide)
```
--bg      #F5EFE2   cream ground
--panel   #FFFCF4   raised paper
--ink     #241D13   primary text
--muted   rgba(36,29,19,0.58)
--line    rgba(36,29,19,0.14)
--red     #B83232   accent / CTA
--red-hover #A02A2A
--green   #3E8E63   status: available
--amber   #B8941F   status: under construction
--logo-red #D2232A
```

### Typography
- **Display / headings:** `Lora` (serif) — 600 weight, tight tracking (`-0.02em`), used at large sizes
- **Body / UI / labels:** `Archivo` (sans) — 400/500/600
- Both already loaded via Google Fonts. Keep both. Adding a third face is allowed only if it's genuinely justified (e.g. a mono for dimension/spec figures) — but the brand pair must remain dominant.

### Existing components that should be reused rather than reinvented
The site already has a vocabulary for exactly the things these pages need. Prefer these over new card patterns:
- `.su-eyebrow-row` + `.su-dot-red` + `.su-eyebrow` — small red dot, wide-tracked uppercase label. This is the site's section-label idiom.
- `.su-ministat` / `.su-mini-val` / `.su-mini-label` — a large Lora figure over a tiny tracked caps label, **no box around it**. This is how the site displays stats.
- `.su-units` / `.su-unit` — hairline-ruled rows (`border-bottom: 1px solid rgba(36,29,19,0.16)`) with a hover wash. This is how the site displays the unit schedule. It is a *table*, not cards.
- `.su-chip` — pill-outline tags for feature lists.
- `.su-btn-fill` (red) and `.su-btn-outline` — the site's buttons.
- Background: a faint blueprint grid runs sitewide via `body` background — the pages sit **on** it, so heavy opaque panels fight it.

### Content — must survive verbatim
These pages were built for SEO and are the site's only commercial-intent pages. **Layout may change freely; the following must not be lost:**
- All body copy and every `<h1>`/`<h2>`/`<h3>` — heading text and hierarchy (exactly one `<h1>` per page)
- All three JSON-LD blocks per page (`RealEstateListing`/`CollectionPage`, `FAQPage`, `BreadcrumbList`) — in `<head>`, untouched
- The visible FAQ text must keep matching the `FAQPage` schema word-for-word
- Every internal link (~15 per page) — nav, in-copy links to `/blog/*`, cross-links between the three pages
- `<head>` metadata: title, meta description, canonical, OG tags
- Images keep `width`/`height` attributes, `loading`, and `alt` text
- Word count must not drop (currently ~1,260 / ~1,200 / ~760)

---

## 3. Direction

The subject is **small-bay industrial leasing**: site plans, unit schedules, building letters (A–D, F–I), dimension callouts, clear heights, grade-level doors, plats, offering memoranda. The homepage already leans architectural — there's a blueprint grid under everything and a pencil site-sketch in the About section.

**Pull on that thread.** The composition language should read like a well-set leasing brochure or a drawing set — structured by rules, alignment, and typographic hierarchy — rather than a stack of floating cards.

Some directions worth exploring (not prescriptive):
- **Rules over containers.** Hairlines, baseline alignment, and generous whitespace to separate content, instead of bordered/shadowed boxes.
- **Asymmetry.** The site's homepage is asymmetric and confident. These pages are relentlessly centered and even. Consider a persistent left-hand spec column against a wider editorial column, or hero type that breaks the grid.
- **The unit schedule as the hero moment.** On the Rockwall page the three unit sizes (1,500 / 2,000 / 3,000 SF with building letters) are the most interesting real content. Right now it's three identical photo cards. It could be a genuine schedule — dimension-annotated, comparative, with the photography doing more work.
- **Let numbers be typographic.** 30 units, 5 acres, 18′ clear, 53,700 SF. Currently boxed tiles; the site's own `.su-ministat` treatment (big Lora figure, tiny tracked label, no box) is better and already on-brand.
- **Photography.** There are 17 optimized renders in `/assets/` (exteriors, aerials, interiors for 1,500 and 3,000 SF). Currently used timidly at uniform 16:10 inside cards. They can be larger, bled, or cropped with intent.
- **Vary section weight.** Give two or three moments real scale and let the rest be quiet.

Motion should stay restrained — the homepage already carries the site's one big animated idea (the scroll-expanding deck). These pages shouldn't compete with it.

---

## 4. Technical constraints

- **Static HTML + CSS.** No build step, no framework, no bundler. Deployed on Netlify from a GitHub repo; each page is a standalone `.html` file.
- Page-specific styles live in **`landing.css`**; brand tokens and shared components live in **`styles.css`** — `landing.css` is the file to rewrite, and it may be replaced wholesale. Don't fork `styles.css`.
- No external JS libraries. `logo.js` (injects the logo SVG) is the only script.
- Must be responsive; the site's breakpoints are 900px and 640px.
- Performance budget matters: the site is currently ~440 KB initial load, fully cached, and it's a competitive advantage. No webfont additions beyond what's loaded, no large decorative assets.
- Semantic HTML is non-negotiable — real `<h1>`/`<h2>`, `<table>` for tabular data, `<dl>` where appropriate, `<nav>` with `aria-label`. Google reads this.
- Accessibility: visible focus states, `prefers-reduced-motion` respected, text contrast maintained against the cream ground.

---

## 5. Deliverable

Preferred: a rewritten **`landing.css`** plus whatever markup restructuring the three HTML files need — production-ready, matching the constraints above.

If mockups come first, the Rockwall page is the one to design; it's the most content-rich and the other two follow its system.

**Definition of done:** a leasing prospect landing on `/rockwall-flex-space-for-lease.html` should feel they're on the same site as the homepage, and shouldn't be able to tell which page was designed and which was generated.
