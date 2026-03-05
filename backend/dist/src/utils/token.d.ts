export interface JwtPayload {
    sub?: number | string;
    username?: string;
    email?: string;
    userId?: number | string;
    newEmail?: string;
    [key: string]: unknown;
}
export declare function signAccessToken(payload: JwtPayload): string;
export declare function signRefreshToken(payload: JwtPayload): string;
export declare function verifyAccessToken(token: string): JwtPayload;
export declare function verifyRefreshToken(token: string): JwtPayload;
export declare function signVerifyToken(payload: JwtPayload): string;
export declare function verifyVerifyToken(token: string): JwtPayload;
export declare function signEmailChangeToken(payload: JwtPayload): string;
export declare function verifyEmailChangeToken(token: string): JwtPayload;
export declare function signDeleteAccountToken(payload: JwtPayload): string;
export declare function verifyDeleteAccountToken(token: string): JwtPayload;
export declare function signPasswordResetToken(payload: JwtPayload): string;
export declare function verifyPasswordResetToken(token: string): JwtPayload;
