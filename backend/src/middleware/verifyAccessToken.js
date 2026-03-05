import { verifyAccessToken } from '../utils/token.js';

export function verifyAccess(req, res, next) {
  // prefer cookie named 'accessToken'
  const cookieToken = req.cookies?.accessToken;
  const auth = req.headers.authorization;
  const token = cookieToken || (auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
