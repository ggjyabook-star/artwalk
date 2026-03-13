// api/contact.js — Vercel Serverless Function
// Receives form submission and sends email via Resend (resend.com)
// Environment variable required: RESEND_API_KEY

const RECIPIENTS = [
  'ggj.yabook@gmail.com',
  'francisco@mexlife.com',
  'pedro@mexlife.com',
];

const FROM = 'ARTWALK Leads <onboarding@resend.dev>';

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { name, email, phone, source, tourPreference } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Build a clean subject
  const subject = `🏠 New Lead — ${source || 'ARTWALK Website'}`;

  // Build readable HTML email body
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FBF9F6; border-radius: 8px;">
      <div style="border-left: 4px solid #A4D61C; padding-left: 16px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 22px; color: #1C252C;">New Lead — ARTWALK Residences</h1>
        <p style="margin: 4px 0 0; color: #888; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
          📍 Source: <strong style="color: #1C252C;">${source || 'Website form'}</strong>
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #888; font-size: 13px; width: 140px;">Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #1C252C; font-size: 15px; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #888; font-size: 13px;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #1C252C; font-size: 15px;">
            <a href="mailto:${email}" style="color: #A4D61C;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #888; font-size: 13px;">WhatsApp / Phone</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #1C252C; font-size: 15px;">
            <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color: #A4D61C;">${phone}</a>
          </td>
        </tr>
        ${tourPreference ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #888; font-size: 13px;">Tour Preference</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5E5E5; color: #1C252C; font-size: 15px;">${tourPreference}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 10px 0; color: #888; font-size: 13px;">Timestamp</td>
          <td style="padding: 10px 0; color: #1C252C; font-size: 13px; font-family: monospace;">${new Date().toISOString()} (UTC)</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding: 12px 16px; background: #A4D61C22; border-radius: 6px; font-size: 12px; color: #4D4D4D; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em;">
        Submitted via artwalk-gold.vercel.app — ${source || 'Website'}
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: RECIPIENTS,
        subject,
        html,
        reply_to: email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email', detail: data });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Network error sending email' });
  }
}
