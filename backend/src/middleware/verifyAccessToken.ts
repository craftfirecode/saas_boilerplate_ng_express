import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/token.js';

// Express Request um `user` erweitern
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function verifyAccess(req: Request, res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.['accessToken'] as string | undefined;
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
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
