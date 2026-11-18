const allowedAreas = new Set(["desarrollo", "qgshield"]);

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const { RESEND_API_KEY, CONTACT_EMAIL, FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_EMAIL || !FROM_EMAIL) {
    return res.status(503).json({ error: "El envío de correo todavía no está configurado." });
  }

  const body = req.body || {};
  // Honeypot: bots often fill hidden fields. Return success without sending.
  if (typeof body.website === "string" && body.website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const area = String(body.area || "");
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const service = String(body.service || "").trim();
  const company = String(body.company || "").trim();

  if (!allowedAreas.has(area) || name.length < 2 || name.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180 ||
      message.length < 10 || message.length > 4000 ||
      service.length > 150 || company.length > 120) {
    return res.status(400).json({ error: "Revisa los campos e inténtalo nuevamente." });
  }

  const label = area === "qgshield" ? "QGShield — solicitud de ciberseguridad" : "Founder Journey — proyecto de desarrollo";
  const safe = (s) => s.replace(/[<>&"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[c]));
  const html = `
    <h2>${safe(label)}</h2>
    <p><strong>Nombre:</strong> ${safe(name)}</p>
    <p><strong>Correo:</strong> ${safe(email)}</p>
    ${company ? `<p><strong>Empresa:</strong> ${safe(company)}</p>` : ""}
    ${service ? `<p><strong>Servicio:</strong> ${safe(service)}</p>` : ""}
    <p><strong>Mensaje:</strong></p><p>${safe(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: label,
        html
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend error:", detail);
      return res.status(502).json({ error: "No pudimos enviar el mensaje. Inténtalo más tarde." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact handler error:", error);
    return res.status(500).json({ error: "Error temporal al enviar el mensaje." });
  }
};
