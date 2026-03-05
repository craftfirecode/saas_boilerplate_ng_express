import { signAccessToken, signRefreshToken, verifyRefreshToken, signVerifyToken, verifyVerifyToken } from '../utils/token.js';
import {
  getUserByEmailAndPassword,
  getUserById,
  checkUsernameExists,
  createUser,
  getUserByVerifyToken,
  confirmUserVerified,
} from '../services/user.service.js';
import { sendVerificationMail } from '../services/mail.service.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const ACCESS_MS = 15 * 60 * 1000;
const COOKIE_ACCESS = 'accessToken';
const COOKIE_REFRESH = 'refreshToken';

function cookieOptions({ httpOnly = true, maxAge = THIRTY_DAYS_MS } = {}) {
  return {
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  };
}

export async function register(req, res) {
  const parsed = registerSchema.safeParse({
    username: req.body.username?.trim(),
    email: req.body.email,
    password: req.body.password,
  });
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const { username, email, password } = parsed.data;

  const isTaken = await checkUsernameExists(username);
  if (isTaken) return res.status(409).json({ error: 'Name ist vergeben.' });

  try {
    // Verifikations-Token generieren (24h gültig)
    const verifyToken = signVerifyToken({ email });
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await createUser({ email, username, password, verifyToken, verifyTokenExpiry });

    // Verifikationsmail asynchron senden – Fehler blockieren nicht die Antwort
    sendVerificationMail(email, username, verifyToken).catch((err) =>
      console.error('[Mail] Verifikationsmail fehlgeschlagen:', err)
    );

    return res.status(201).json({
      message: 'Registrierung erfolgreich. Bitte bestätige deine E-Mail-Adresse.',
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'E-Mail ist bereits registriert.' });
    console.error(err);
    return res.status(500).json({ error: 'Registrierung fehlgeschlagen.' });
  }
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse({
    email: req.body.email,
    password: req.body.password,
  });
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const { email, password } = parsed.data;

  const user = await getUserByEmailAndPassword(email, password);
  if (!user) return res.status(401).json({ error: 'Ungültige Zugangsdaten.' });

  if (!user.verified) {
    return res.status(403).json({
      error: 'E-Mail nicht bestätigt.',
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Bitte bestätige zunächst deine E-Mail-Adresse. Schau in dein Postfach und klicke auf den Bestätigungslink.',
    });
  }

  const payload = { sub: user.id, username: user.username };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie(COOKIE_ACCESS, accessToken, cookieOptions({ maxAge: ACCESS_MS }));
  res.cookie(COOKIE_REFRESH, refreshToken, cookieOptions({ maxAge: THIRTY_DAYS_MS }));

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      pendingEmail: user.pendingEmail ?? null,
    },
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Kein Token angegeben.' });

  // JWT strukturell prüfen
  try {
    verifyVerifyToken(token);
  } catch {
    return res.status(400).json({ error: 'Der Bestätigungslink ist ungültig oder abgelaufen.' });
  }

  const user = await getUserByVerifyToken(token);
  if (!user) return res.status(400).json({ error: 'Der Bestätigungslink ist ungültig oder wurde bereits verwendet.' });

  // Ablaufzeit zusätzlich prüfen (Defense in Depth)
  if (user.verifyTokenExpiry && new Date(user.verifyTokenExpiry) < new Date()) {
    return res.status(400).json({ error: 'Der Bestätigungslink ist abgelaufen. Bitte registriere dich erneut.' });
  }

  if (user.verified) {
    return res.status(200).json({ message: 'E-Mail-Adresse wurde bereits bestätigt. Du kannst dich jetzt einloggen.' });
  }

  await confirmUserVerified(user.id);

  return res.status(200).json({ message: 'E-Mail-Adresse erfolgreich bestätigt. Du kannst dich jetzt einloggen.' });
}

export async function refresh(req, res) {
  const token = req.cookies?.[COOKIE_REFRESH];
  if (!token) return res.status(401).json({ error: 'No refresh token' });
  try {
    const payload = verifyRefreshToken(token);
    const newAccess = signAccessToken({ sub: payload.sub, username: payload.username });
    res.cookie(COOKIE_ACCESS, newAccess, cookieOptions({ maxAge: ACCESS_MS }));
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}

export async function me(req, res) {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      pendingEmail: user.pendingEmail ?? null,
    },
  });
}


export function logout(req, res) {
  res.clearCookie(COOKIE_ACCESS, { path: '/' });
  res.clearCookie(COOKIE_REFRESH, { path: '/' });
  return res.json({ ok: true });
}
