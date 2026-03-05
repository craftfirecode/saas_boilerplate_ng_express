import { checkUsernameExists, updateUsername, changePassword, checkEmailExists, requestEmailChange, getUserByEmailChangeToken, confirmEmailChange, requestDeleteAccount, getUserByDeleteToken, deleteUserById, getUserById, getUserByEmail, requestPasswordReset, getUserByPasswordResetToken, resetPassword, } from '../services/user.service.js';
import { usernameSchema, emailSchema, passwordResetSchema, emailChangeSchema, } from '../utils/validators.js';
import { signEmailChangeToken, verifyEmailChangeToken, signDeleteAccountToken, verifyDeleteAccountToken, signPasswordResetToken, verifyPasswordResetToken, } from '../utils/token.js';
import { sendEmailChangeMail, sendDeleteAccountMail, sendPasswordResetMail, } from '../services/mail.service.js';
// ─── Benutzername ─────────────────────────────────────────────────────────────
export async function updateProfile(req, res) {
    const userId = Number(req.user?.sub);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const parsed = usernameSchema.safeParse(req.body.username?.trim());
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues[0]?.message });
    const username = parsed.data;
    const isTaken = await checkUsernameExists(username, userId);
    if (isTaken)
        return res.status(409).json({ error: 'Name ist vergeben.' });
    try {
        const updatedUser = await updateUsername(userId, username);
        return res.json({ user: { id: updatedUser.id, username: updatedUser.username } });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Fehler bei der Übertragung.' });
    }
}
// ─── Passwort ─────────────────────────────────────────────────────────────────
export async function updatePassword(req, res) {
    const userId = Number(req.user?.sub);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword)
        return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
    const parsed = passwordResetSchema.safeParse({ newPassword, confirmPassword });
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues[0]?.message });
    const result = await changePassword(userId, currentPassword, parsed.data.newPassword);
    if (result.error === 'wrong_password')
        return res.status(422).json({ error: 'Das aktuelle Passwort ist falsch.' });
    if (result.error === 'not_found')
        return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
    return res.json({ message: 'Passwort erfolgreich geändert.' });
}
// ─── E-Mail ändern – Schritt 1 ────────────────────────────────────────────────
export async function requestEmailUpdate(req, res) {
    const userId = Number(req.user?.sub);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const parsed = emailChangeSchema.safeParse({
        email: req.body.email?.trim().toLowerCase(),
    });
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues[0]?.message });
    const newEmail = parsed.data.email;
    const taken = await checkEmailExists(newEmail, userId);
    if (taken)
        return res.status(409).json({ error: 'Diese E-Mail-Adresse wird bereits verwendet.' });
    const token = signEmailChangeToken({ userId, newEmail });
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    try {
        const user = await requestEmailChange(userId, newEmail, token, expiry);
        sendEmailChangeMail(user.email, user.username, newEmail, token).catch((err) => console.error('[Mail] E-Mail-Änderungsmail fehlgeschlagen:', err));
        return res.json({ message: 'Bestätigungslink wurde an deine aktuelle E-Mail-Adresse gesendet.' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Fehler beim Speichern der Anfrage.' });
    }
}
// ─── E-Mail ändern – Schritt 2 ────────────────────────────────────────────────
export async function confirmEmailUpdate(req, res) {
    const token = req.query['token'];
    if (!token)
        return res.status(400).json({ error: 'Kein Token angegeben.' });
    try {
        verifyEmailChangeToken(token);
    }
    catch {
        return res.status(400).json({ error: 'Der Bestätigungslink ist ungültig oder abgelaufen.' });
    }
    const user = await getUserByEmailChangeToken(token);
    if (!user)
        return res.status(400).json({ error: 'Der Link ist ungültig oder wurde bereits verwendet.' });
    if (user.emailChangeTokenExpiry && new Date(user.emailChangeTokenExpiry) < new Date())
        return res.status(400).json({ error: 'Der Bestätigungslink ist abgelaufen. Bitte starte die Änderung erneut.' });
    const taken = await checkEmailExists(user.pendingEmail, user.id);
    if (taken)
        return res.status(409).json({ error: 'Diese E-Mail-Adresse wird bereits von einem anderen Account verwendet.' });
    try {
        await confirmEmailChange(user.id);
        return res.json({ message: 'E-Mail-Adresse erfolgreich geändert.' });
    }
    catch (err) {
        if (err?.code === 'P2002')
            return res.status(409).json({ error: 'Diese E-Mail-Adresse wird bereits verwendet.' });
        console.error(err);
        return res.status(500).json({ error: 'Fehler beim Bestätigen der E-Mail.' });
    }
}
// ─── Account löschen – Schritt 1 ─────────────────────────────────────────────
export async function requestAccountDeletion(req, res) {
    const userId = Number(req.user?.sub);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const user = await getUserById(userId);
    if (!user)
        return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
    const confirmedEmail = req.body.email?.trim().toLowerCase();
    if (!confirmedEmail || confirmedEmail !== user.email.toLowerCase())
        return res.status(422).json({ error: 'Die eingegebene E-Mail-Adresse stimmt nicht überein.' });
    const token = signDeleteAccountToken({ userId });
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    try {
        await requestDeleteAccount(userId, token, expiry);
        sendDeleteAccountMail(user.email, user.username, token).catch((err) => console.error('[Mail] Account-Löschmail fehlgeschlagen:', err));
        return res.json({ message: 'Bestätigungslink wurde an deine E-Mail-Adresse gesendet.' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Fehler beim Speichern der Anfrage.' });
    }
}
// ─── Account löschen – Schritt 2 ─────────────────────────────────────────────
export async function confirmAccountDeletion(req, res) {
    const token = req.query['token'];
    if (!token)
        return res.status(400).json({ error: 'Kein Token angegeben.' });
    let payload;
    try {
        payload = verifyDeleteAccountToken(token);
    }
    catch {
        return res.status(400).json({ error: 'Der Bestätigungslink ist ungültig oder abgelaufen.' });
    }
    const user = await getUserByDeleteToken(token);
    if (!user) {
        const alreadyGone = payload?.userId && !(await getUserById(Number(payload.userId)));
        if (alreadyGone)
            return res.json({ message: 'Dein Account wurde erfolgreich gelöscht.', alreadyDeleted: true });
        return res.status(400).json({ error: 'Der Bestätigungslink ist ungültig oder wurde bereits verwendet.' });
    }
    if (user.deleteAccountTokenExpiry && new Date(user.deleteAccountTokenExpiry) < new Date())
        return res.status(400).json({ error: 'Der Bestätigungslink ist abgelaufen. Bitte starte die Löschung erneut.' });
    try {
        await deleteUserById(user.id);
        return res.json({ message: 'Dein Account wurde erfolgreich gelöscht.' });
    }
    catch (err) {
        console.error('[DELETE] deleteUserById fehlgeschlagen:', err);
        return res.status(500).json({ error: 'Beim Löschen deines Accounts ist ein Fehler aufgetreten.' });
    }
}
// ─── Passwort vergessen – Schritt 1 ──────────────────────────────────────────
export async function requestPasswordResetHandler(req, res) {
    const parsed = emailSchema.safeParse(req.body.email?.trim().toLowerCase());
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues[0]?.message });
    const email = parsed.data;
    const user = await getUserByEmail(email);
    if (user) {
        const token = signPasswordResetToken({ userId: user.id });
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        await requestPasswordReset(user.id, token, expiry).catch(console.error);
        sendPasswordResetMail(user.email, user.username, token).catch((err) => console.error('[Mail] Passwort-Reset-Mail fehlgeschlagen:', err));
    }
    return res.json({ message: 'Falls ein Account mit dieser E-Mail existiert, wurde ein Link gesendet.' });
}
// ─── Passwort vergessen – Schritt 2 ──────────────────────────────────────────
export async function confirmPasswordResetHandler(req, res) {
    const token = req.query['token'];
    if (!token)
        return res.status(400).json({ error: 'Kein Token angegeben.' });
    try {
        verifyPasswordResetToken(token);
    }
    catch {
        return res.status(400).json({ error: 'Der Link ist ungültig oder abgelaufen.' });
    }
    const user = await getUserByPasswordResetToken(token);
    if (!user)
        return res.status(400).json({ error: 'Der Link ist ungültig oder wurde bereits verwendet.' });
    if (user.passwordResetTokenExpiry && new Date(user.passwordResetTokenExpiry) < new Date())
        return res.status(400).json({ error: 'Der Link ist abgelaufen. Bitte fordere einen neuen an.' });
    const { newPassword, confirmPassword } = req.body;
    const parsed = passwordResetSchema.safeParse({ newPassword, confirmPassword });
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues[0]?.message });
    try {
        await resetPassword(user.id, parsed.data.newPassword);
        return res.json({ message: 'Passwort erfolgreich zurückgesetzt. Du kannst dich jetzt einloggen.' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Fehler beim Zurücksetzen des Passworts.' });
    }
}
