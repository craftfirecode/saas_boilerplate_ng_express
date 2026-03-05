import { Request, Response } from 'express';
import { sendMail } from '../services/mail.service.js';

export async function sendTestMail(_req: Request, res: Response) {
  const to = process.env['MAIL_TEST_TO'];

  if (!to) {
    return res.status(500).json({ error: 'MAIL_TEST_TO ist nicht in der .env gesetzt.' });
  }

  try {
    const info = await sendMail({
      to,
      subject: '✅ Test-Mail vom Backend',
      html: `
        <h2>Test erfolgreich!</h2>
        <p>Diese E-Mail wurde automatisch vom Backend versandt.</p>
        <p><small>Zeitstempel: ${new Date().toISOString()}</small></p>
      `,
      text: `Test erfolgreich! (${new Date().toISOString()})`,
    });

    return res.json({ success: true, messageId: info.messageId, to });
  } catch (err) {
    console.error('[Mail] Fehler beim Versand:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
}
