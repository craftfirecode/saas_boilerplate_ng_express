import jwt from 'jsonwebtoken';

const ACCESS_EXP  = process.env.ACCESS_EXP  || '15m';
const REFRESH_EXP = process.env.REFRESH_EXP || '30d';
const VERIFY_EXP  = process.env.VERIFY_EXP  || '24h';
const EMAIL_CHANGE_EXP    = process.env.EMAIL_CHANGE_EXP    || '1h';
const DELETE_ACCOUNT_EXP  = process.env.DELETE_ACCOUNT_EXP  || '1h';
const PASSWORD_RESET_EXP  = process.env.PASSWORD_RESET_EXP  || '1h';

const ACCESS_SECRET             = process.env.ACCESS_TOKEN_SECRET  || process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET            = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const VERIFY_SECRET             = process.env.VERIFY_TOKEN_SECRET  || 'verify-secret';
const EMAIL_CHANGE_SECRET       = process.env.EMAIL_CHANGE_TOKEN_SECRET   || 'email-change-secret';
const DELETE_ACCOUNT_SECRET     = process.env.DELETE_ACCOUNT_TOKEN_SECRET || 'delete-account-secret';
const PASSWORD_RESET_SECRET     = process.env.PASSWORD_RESET_TOKEN_SECRET || 'password-reset-secret';

export function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}
export function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
export function signVerifyToken(payload) {
  return jwt.sign(payload, VERIFY_SECRET, { expiresIn: VERIFY_EXP });
}
export function verifyVerifyToken(token) {
  return jwt.verify(token, VERIFY_SECRET);
}
export function signEmailChangeToken(payload) {
  return jwt.sign(payload, EMAIL_CHANGE_SECRET, { expiresIn: EMAIL_CHANGE_EXP });
}
export function verifyEmailChangeToken(token) {
  return jwt.verify(token, EMAIL_CHANGE_SECRET);
}
export function signDeleteAccountToken(payload) {
  return jwt.sign(payload, DELETE_ACCOUNT_SECRET, { expiresIn: DELETE_ACCOUNT_EXP });
}
export function verifyDeleteAccountToken(token) {
  return jwt.verify(token, DELETE_ACCOUNT_SECRET);
}
export function signPasswordResetToken(payload) {
  return jwt.sign(payload, PASSWORD_RESET_SECRET, { expiresIn: PASSWORD_RESET_EXP });
}
export function verifyPasswordResetToken(token) {
  return jwt.verify(token, PASSWORD_RESET_SECRET);
}

