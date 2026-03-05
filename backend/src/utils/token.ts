import jwt from 'jsonwebtoken';

const ACCESS_EXP  = process.env['ACCESS_EXP']  ?? '15m';
const REFRESH_EXP = process.env['REFRESH_EXP'] ?? '30d';
const VERIFY_EXP  = process.env['VERIFY_EXP']  ?? '24h';
const EMAIL_CHANGE_EXP   = process.env['EMAIL_CHANGE_EXP']   ?? '1h';
const DELETE_ACCOUNT_EXP = process.env['DELETE_ACCOUNT_EXP'] ?? '1h';
const PASSWORD_RESET_EXP = process.env['PASSWORD_RESET_EXP'] ?? '1h';

const ACCESS_SECRET           = process.env['ACCESS_TOKEN_SECRET']        ?? process.env['JWT_SECRET'] ?? 'access-secret';
const REFRESH_SECRET          = process.env['REFRESH_TOKEN_SECRET']       ?? 'refresh-secret';
const VERIFY_SECRET           = process.env['VERIFY_TOKEN_SECRET']        ?? 'verify-secret';
const EMAIL_CHANGE_SECRET     = process.env['EMAIL_CHANGE_TOKEN_SECRET']  ?? 'email-change-secret';
const DELETE_ACCOUNT_SECRET   = process.env['DELETE_ACCOUNT_TOKEN_SECRET'] ?? 'delete-account-secret';
const PASSWORD_RESET_SECRET   = process.env['PASSWORD_RESET_TOKEN_SECRET'] ?? 'password-reset-secret';

export interface JwtPayload {
  sub?: number | string;
  username?: string;
  email?: string;
  userId?: number | string;
  newEmail?: string;
  [key: string]: unknown;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP } as jwt.SignOptions);
}
export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP } as jwt.SignOptions);
}
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
export function signVerifyToken(payload: JwtPayload): string {
  return jwt.sign(payload, VERIFY_SECRET, { expiresIn: VERIFY_EXP } as jwt.SignOptions);
}
export function verifyVerifyToken(token: string): JwtPayload {
  return jwt.verify(token, VERIFY_SECRET) as JwtPayload;
}
export function signEmailChangeToken(payload: JwtPayload): string {
  return jwt.sign(payload, EMAIL_CHANGE_SECRET, { expiresIn: EMAIL_CHANGE_EXP } as jwt.SignOptions);
}
export function verifyEmailChangeToken(token: string): JwtPayload {
  return jwt.verify(token, EMAIL_CHANGE_SECRET) as JwtPayload;
}
export function signDeleteAccountToken(payload: JwtPayload): string {
  return jwt.sign(payload, DELETE_ACCOUNT_SECRET, { expiresIn: DELETE_ACCOUNT_EXP } as jwt.SignOptions);
}
export function verifyDeleteAccountToken(token: string): JwtPayload {
  return jwt.verify(token, DELETE_ACCOUNT_SECRET) as JwtPayload;
}
export function signPasswordResetToken(payload: JwtPayload): string {
  return jwt.sign(payload, PASSWORD_RESET_SECRET, { expiresIn: PASSWORD_RESET_EXP } as jwt.SignOptions);
}
export function verifyPasswordResetToken(token: string): JwtPayload {
  return jwt.verify(token, PASSWORD_RESET_SECRET) as JwtPayload;
}
