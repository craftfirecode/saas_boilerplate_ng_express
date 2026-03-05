import { verifyAccessToken } from '../utils/token.js';
export function verifyAccess(req, res, next) {
    const cookieToken = req.cookies?.['accessToken'];
    const auth = req.headers.authorization;
    const token = cookieToken ?? (auth?.startsWith('Bearer ') ? auth.split(' ')[1] : undefined);
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
