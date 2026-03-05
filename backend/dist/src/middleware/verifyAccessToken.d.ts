import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../utils/token.js';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function verifyAccess(req: Request, res: Response, next: NextFunction): void;
