/* ============================================================
   ScaleUp — leasing inquiry form (homepage #contact and /contact)
   Delivers to contactus@scaleupflex.com via FormSubmit; falls back
   to the visitor's mail client if the request fails. Ticking the
   SMS consent box makes the phone number required (10DLC).
   ============================================================ */
(() => {
  const CONTACT_EMAIL = 'contactus@scaleupflex.com';
  const form = document.getElementById('su-form');
  if (!form) return;

  const phone = form.querySelector('[name=phone]');
  const consent = form.querySelector('[name=sms_consent]');
  const phoneHint = form.querySelector('[data-phone-hint]');
  const syncPhone = () => {
    const need = !!(consent && consent.checked);
    phone.required = need;
    if (phoneHint) phoneHint.textContent = need ? '(required for texts)' : '(optional)';
  };
  if (consent && phone) { consent.addEventListener('change', syncPhone); syncPhone(); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const smsYes = f.get('sms_consent') === 'yes';
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
          sms_consent: smsYes ? 'Yes — opted in to Customer Care and Marketing SMS' : 'No',
          page: location.pathname,
          _subject: `Leasing inquiry — ${f.get('dev')}`,
          _replyto: f.get('email'),
          _template: 'table',
          _autoresponse: `Hi ${f.get('name')},\n\nThanks for reaching out to ScaleUp. We received your inquiry${f.get('dev') !== 'Not sure yet' ? ` about ${f.get('dev')}` : ''} and one of our principals will get back to you within one business day.\n\nIf it's time-sensitive, call us at (469) 628-1922.\n\nScaleUp Developments\nhttps://scaleupflex.com`,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || String(data.success) !== 'true') throw new Error('send failed');
      form.reset();
      syncPhone();
      btn.textContent = 'Inquiry sent ✓';
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 4000);
    } catch {
      const subject = encodeURIComponent(`Leasing inquiry — ${f.get('dev')}`);
      const body = encodeURIComponent(`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nPhone: ${f.get('phone') || 'Not provided'}\nDevelopment: ${f.get('dev')}\nSMS consent: ${smsYes ? 'Yes' : 'No'}\n\n${f.get('message')}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      btn.innerHTML = original;
      btn.disabled = false;
    }
  });
})();
