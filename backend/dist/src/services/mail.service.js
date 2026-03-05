import nodemailer from 'nodemailer';
import dns from 'dns';
import { promisify } from 'util';
const dnsLookup = promisify(dns.lookup);
async function createTransporter() {
    const host = process.env['MAIL_HOST'] ?? '';
    // DNS-Lookup: IP ermitteln, damit TLS-Hostname korrekt gesetzt bleibt.
    let resolvedHost = host;
    try {
        const { address } = await dnsLookup(host, { family: 4 });
        resolvedHost = address;
    }
    catch (dnsErr) {
        console.warn(`[Mail] DNS-Lookup für "${host}" fehlgeschlagen, verwende Hostname direkt:`, dnsErr.message);
    }
    return nodemailer.createTransport({
        host: resolvedHost,
        port: Number(process.env['MAIL_PORT']) || 587,
        secure: process.env['MAIL_SECURE'] === 'true',
        requireTLS: true,
        tls: { servername: host },
        auth: {
            user: process.env['MAIL_USER'],
            pass: process.env['MAIL_PASS'],
        },
        logger: process.env['MAIL_DEBUG'] === 'true',
        debug: process.env['MAIL_DEBUG'] === 'true',
    });
}
export async function sendMail(options, attempt = 1) {
    const { to, subject, text, html, from } = options;
    try {
        const transporter = await createTransporter();
        if (process.env['MAIL_VERIFY'] === 'true') {
            await transporter.verify();
        }
        const info = await transporter.sendMail({
            from: from ?? process.env['MAIL_FROM'],
            to,
            subject,
            text,
            html,
        });
        return info;
    }
    catch (err) {
        const e = err;
        console.error('[Mail] sendMail fehlgeschlagen:', {
            message: e?.['message'],
            code: e?.['code'],
            command: e?.['command'],
            response: e?.['response'],
            responseCode: e?.['responseCode'],
        });
        if (e?.['code'] === 'ECONNREFUSED' && attempt < 2) {
            console.warn('[Mail] ECONNREFUSED – neuer Versuch (#2)...');
            return sendMail(options, 2);
        }
        throw err;
    }
}
export async function sendVerificationMail(to, username, token) {
    const appUrl = process.env['APP_URL'] ?? 'http://localhost:4200';
    const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
            <tr><td style="background:#111827;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">E-Mail bestätigen</p>
            </td></tr>
            <tr><td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hallo <strong>${username}</strong>,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                Vielen Dank für deine Registrierung! Bitte bestätige deine E-Mail-Adresse, indem du auf den Button klickst.
                Der Link ist <strong>24 Stunden</strong> gültig.
              </p>
              <a href="${verifyUrl}" style="display:inline-block;padding:14px 28px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                E-Mail bestätigen
              </a>
              <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;">
                Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.
              </p>
            </td></tr>
            <tr><td style="padding:20px 40px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                Falls der Button nicht funktioniert, kopiere diesen Link:<br />
                <a href="${verifyUrl}" style="color:#6b7280;word-break:break-all;">${verifyUrl}</a>
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
    const text = `Hallo ${username},\n\nbitte bestätige deine E-Mail-Adresse:\n${verifyUrl}\n\nDer Link ist 24 Stunden gültig.`;
    return sendMail({ to, subject: 'E-Mail-Adresse bestätigen', html, text });
}
export async function sendEmailChangeMail(to, username, newEmail, token) {
    const appUrl = process.env['APP_URL'] ?? 'http://localhost:4200';
    const confirmUrl = `${appUrl}/verify-email-change?token=${encodeURIComponent(token)}`;
    const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
            <tr><td style="background:#111827;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">E-Mail-Adresse ändern</p>
            </td></tr>
            <tr><td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hallo <strong>${username}</strong>,</p>
              <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">Neue E-Mail-Adresse: <strong>${newEmail}</strong></p>
              <a href="${confirmUrl}" style="display:inline-block;padding:14px 28px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                Neue E-Mail bestätigen
              </a>
              <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;">Falls du diese Änderung nicht angefordert hast, ignoriere diese E-Mail.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
    const text = `Hallo ${username},\n\nNeue E-Mail: ${newEmail}\nBestätigen: ${confirmUrl}`;
    return sendMail({ to, subject: 'E-Mail-Adresse ändern – Bitte bestätigen', html, text });
}
export async function sendDeleteAccountMail(to, username, token) {
    const appUrl = process.env['APP_URL'] ?? 'http://localhost:4200';
    const confirmUrl = `${appUrl}/confirm-delete-account?token=${encodeURIComponent(token)}`;
    const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
            <tr><td style="background:#7f1d1d;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Account löschen</p>
            </td></tr>
            <tr><td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hallo <strong>${username}</strong>,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">⚠️ Diese Aktion ist <strong>unwiderruflich</strong>. Alle Daten werden dauerhaft gelöscht.</p>
              <a href="${confirmUrl}" style="display:inline-block;padding:14px 28px;background:#991b1b;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                Account endgültig löschen
              </a>
              <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;">Falls du diese Löschung nicht angefordert hast, ignoriere diese E-Mail.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
    const text = `Hallo ${username},\n\n⚠️ Account löschen (unwiderruflich):\n${confirmUrl}`;
    return sendMail({ to, subject: '⚠️ Account löschen – Bestätigung erforderlich', html, text });
}
export async function sendPasswordResetMail(to, username, token) {
    const appUrl = process.env['APP_URL'] ?? 'http://localhost:4200';
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
            <tr><td style="background:#111827;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Passwort zurücksetzen</p>
            </td></tr>
            <tr><td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hallo <strong>${username}</strong>,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                Klicke auf den Button, um ein neues Passwort zu vergeben. Der Link ist <strong>1 Stunde</strong> gültig.
              </p>
              <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                Passwort zurücksetzen
              </a>
              <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;">Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
    const text = `Hallo ${username},\n\nPasswort zurücksetzen:\n${resetUrl}\n\nDer Link ist 1 Stunde gültig.`;
    return sendMail({ to, subject: 'Passwort zurücksetzen', html, text });
}
