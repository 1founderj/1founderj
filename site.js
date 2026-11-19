/* ============================================================
   CONFIGURA AQUÍ el correo donde quieres recibir los mensajes.
   Ejemplo: const CONTACT_EMAIL = "hola@tudominio.com";
   ============================================================ */
const CONTACT_EMAIL = "";

(function () {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  document.querySelectorAll('form[data-subject]').forEach(function (form) {
    const out = form.querySelector('[role=status]');
    const btn = form.querySelector('button[type=submit]');
    const say = function (t) { out.textContent = t; };

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (form.elements.website && form.elements.website.value) return; // honeypot

      // validación
      const required = form.querySelectorAll('[required]');
      for (const el of required) {
        const ok = el.type === 'checkbox' ? el.checked : el.value.trim();
        if (!ok) { say(el.dataset.error || 'Completa los campos obligatorios.'); el.focus(); return; }
      }
      const group = form.querySelector('fieldset[data-required]');
      if (group && !group.querySelector(':checked')) {
        say('Elige al menos un servicio.'); group.querySelector('input').focus(); return;
      }
      if (!CONTACT_EMAIL) { say('Falta configurar el correo de destino (CONTACT_EMAIL en site.js).'); return; }

      // datos
      const data = {};
      new FormData(form).forEach(function (v, k) {
        if (k === 'website' || !String(v).trim()) return;
        data[k] = data[k] ? data[k] + ', ' + v : v;
      });
      const subject = form.dataset.subject + (data.Nombre ? ' — ' + data.Nombre : '');

      btn.disabled = true; say('Enviando…');
      try {
        const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(CONTACT_EMAIL), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.assign({ _subject: subject, _template: 'table', _captcha: 'false' }, data))
        });
        const json = await res.json();
        if (!res.ok || String(json.success) !== 'true') throw new Error('send');
        form.reset();
        say('Recibido. Te responderé por correo con los siguientes pasos.');
      } catch (err) {
        const body = Object.keys(data).map(function (k) { return k + ': ' + data[k]; }).join('\n');
        out.textContent = 'No se pudo enviar automáticamente. ';
        const a = document.createElement('a');
        a.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        a.textContent = 'Envíalo desde tu correo.';
        out.appendChild(a);
      } finally {
        btn.disabled = false;
      }
    });
  });
})();
