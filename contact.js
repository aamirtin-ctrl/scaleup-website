/* ============================================================
   ScaleUp — contact page
   The form submit + optional HubSpot scheduler, lifted out of
   main.js so this page does not have to load the homepage deck,
   hero rotation and lightbox it will never use. Every lookup is
   guarded, unlike the copy in main.js.
   ============================================================ */
const CONTACT_EMAIL = 'contactus@scaleupflex.com';
const HUBSPOT_MEETING_URL = 'https://meetings-na2.hubspot.com/taaha-motorwala';

/* ---------- inline HubSpot Meetings scheduler ---------- */
(() => {
  const openBtn = document.getElementById('su-book-open');
  const embed = document.getElementById('su-book-embed');
  if (!openBtn || !embed) return;
  let loaded = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    if (!HUBSPOT_MEETING_URL) {
      embed.innerHTML = '<div class="su-book-soon">Online booking is being set up. In the meantime, email <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> or call <a href="tel:+14696281922">(469) 628-1922</a> and we will get you on the calendar.</div>';
      return;
    }
    // hand the name and email across so nobody types them twice
    const form = document.getElementById('su-form');
    const params = new URLSearchParams({ embed: 'true' });
    const nm = ((form && form.querySelector('[name=name]') && form.querySelector('[name=name]').value) || '').trim();
    const em = ((form && form.querySelector('[name=email]') && form.querySelector('[name=email]').value) || '').trim();
    if (nm) {
      const parts = nm.split(/\s+/);
      params.set('firstName', parts[0]);
      if (parts.length > 1) params.set('lastName', parts.slice(1).join(' '));
    }
    if (em) params.set('email', em);

    const head = document.createElement('p');
    head.className = 'su-book-head';
    head.textContent = 'Pick a time that works for you. You will get a calendar invite, and we will come prepared for your size and timeline.';
    embed.appendChild(head);

    const box = document.createElement('div');
    box.className = 'meetings-iframe-container';
    box.setAttribute('data-src', HUBSPOT_MEETING_URL + '?' + params.toString());
    embed.appendChild(box);

    const sc = document.createElement('script');
    sc.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    embed.appendChild(sc);
  };

  openBtn.addEventListener('click', () => {
    const willShow = embed.hidden;
    if (willShow) load();
    embed.hidden = !willShow;
    openBtn.setAttribute('aria-expanded', String(willShow));
  });
})();

/* ---------- inquiry form ---------- */
(() => {
  const form = document.getElementById('su-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
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
          phone: f.get('phone') || 'Not provided',
          park: f.get('dev'),
          message: f.get('message'),
          _subject: `Leasing inquiry — ${f.get('dev')}`,
          _replyto: f.get('email'),
          _template: 'table',
          _autoresponse: `Hi ${f.get('name')},\n\nThanks for reaching out to ScaleUp Flex Parks. We received your inquiry${f.get('dev') !== 'Not sure yet' ? ` about ${f.get('dev')}` : ''} and one of our principals will get back to you within one business day.\n\nIf it's time-sensitive, call us at (469) 628-1922.\n\nScaleUp Flex Parks\nhttps://scaleupflex.com`,
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
})();
