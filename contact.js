/* ============================================================
   ScaleUp — scheduling page
   This page does one thing: put the HubSpot Meetings picker on
   screen. It is not linked from the site nav; it is the target
   for "schedule" buttons elsewhere.
   ============================================================ */
const CONTACT_EMAIL = 'contactus@scaleupflex.com';
const HUBSPOT_MEETING_URL = 'https://meetings-na2.hubspot.com/taaha-motorwala';

(() => {
  const embed = document.getElementById('su-book-embed');
  if (!embed) return;
  const openBtn = document.getElementById('su-book-open');
  let loaded = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    if (!HUBSPOT_MEETING_URL) {
      embed.innerHTML = '<div class="su-book-soon">Online booking is being set up. In the meantime, email <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> or call <a href="tel:+14696281922">(469) 628-1922</a> and we will get you on the calendar.</div>';
      return;
    }
    const box = document.createElement('div');
    box.className = 'meetings-iframe-container';
    box.setAttribute('data-src', HUBSPOT_MEETING_URL + '?embed=true');
    embed.appendChild(box);

    const sc = document.createElement('script');
    sc.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    embed.appendChild(sc);
  };

  // data-auto: the picker is the page, so load it straight away
  if (embed.hasAttribute('data-auto')) { load(); embed.hidden = false; return; }

  if (!openBtn) return;
  openBtn.addEventListener('click', () => {
    const willShow = embed.hidden;
    if (willShow) load();
    embed.hidden = !willShow;
    openBtn.setAttribute('aria-expanded', String(willShow));
  });
})();
