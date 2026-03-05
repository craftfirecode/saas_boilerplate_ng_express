import { sendMail } from '../services/mail.service.js';

/**
 * GET /mail/test
 * Versendet eine Test-E-Mail an MAIL_TEST_TO aus der .env
 */
export async function sendTestMail(req, res) {
  const to = process.env.MAIL_TEST_TO;

  if (!to) {
    return res.status(500).json({ error: 'MAIL_TEST_TO ist nicht in der .env gesetzt.' });
  }

  try {
    const info = await sendMail({
      to,
      subject: '✅ Test-Mail vom Backend',
      html: `
        <h2>Test erfolgreich!</h2>
        <p>Diese E-Mail wurde automatisch vom CraftFire-Backend versandt.</p>
        <p><small>Zeitstempel: ${new Date().toISOString()}</small></p>
      `,
      text: `Test erfolgreich! Diese E-Mail wurde automatisch vom CraftFire-Backend versandt. (${new Date().toISOString()})`,
    });

    return res.json({
      success: true,
      messageId: info.messageId,
      to,
    });
  } catch (err) {
    console.error('[Mail] Fehler beim Versand:', err);
    return res.status(500).json({ error: err.message });
  }
}
