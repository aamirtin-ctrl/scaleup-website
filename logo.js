/* ScaleUp logo mark — isometric chevron building, recreated as SVG
   Injected into every .su-logo-mark so the mark lives in one place. */
const SU_MARK_SVG = `
<svg viewBox="0 0 122 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- underside walls -->
  <polygon fill="#171310" points="7,47 29,61 29,87 7,73"/>
  <polygon fill="#171310" points="29,61 59,43 59,69 29,87"/>
  <polygon fill="#C7C2BB" points="59,43 93,63 93,89 59,69"/>
  <polygon fill="#C7C2BB" points="93,63 115,49 115,75 93,89"/>
  <!-- roof chevron (white gap via stroke) -->
  <polygon fill="#D2232A" stroke="#FBF8F3" stroke-width="3" stroke-linejoin="round"
    points="7,47 59,15 115,49 93,63 59,43 29,61"/>
</svg>`;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.su-logo-mark').forEach((m) => { m.innerHTML = SU_MARK_SVG; });
});
