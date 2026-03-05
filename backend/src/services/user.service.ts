import { prisma } from '../utils/prisma.js';
import bcrypt from 'bcrypt';

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  verifyToken: string;
  verifyTokenExpiry: Date;
}

export interface ChangePasswordResult {
  ok?: boolean;
  error?: 'not_found' | 'wrong_password';
}

export async function getUserByUsernameAndPassword(username: string, password: string) {
  const usernameLower = username.toLowerCase();
  const users = await prisma.$queryRaw<{ password: string }[]>`SELECT * FROM User WHERE LOWER(username) = ${usernameLower} LIMIT 1`;
  const user = users[0] ?? null;
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  return user;
}

export async function getUserByEmailAndPassword(email: string, password: string) {
  const emailLower = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: emailLower } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  return user;
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function checkUsernameExists(username: string, excludeUserId: number | null = null): Promise<boolean> {
  const usernameLower = username.toLowerCase();
  if (excludeUserId) {
    const id = Number(excludeUserId);
    const users = await prisma.$queryRaw<unknown[]>`SELECT 1 as exists_flag FROM User WHERE LOWER(username) = ${usernameLower} AND id != ${id} LIMIT 1`;
    return users.length > 0;
  }
  const users = await prisma.$queryRaw<unknown[]>`SELECT 1 as exists_flag FROM User WHERE LOWER(username) = ${usernameLower} LIMIT 1`;
  return users.length > 0;
}

export async function updateUsername(id: number, username: string) {
  return prisma.user.update({ where: { id }, data: { username } });
}

export async function createUser({ email, username, password, verifyToken, verifyTokenExpiry }: CreateUserInput) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, username, password: hashedPassword, verified: false, verifyToken, verifyTokenExpiry },
  });
}

export async function getUserByVerifyToken(token: string) {
  return prisma.user.findUnique({ where: { verifyToken: token } });
}

export async function changePassword(id: number, currentPassword: string, newPassword: string): Promise<ChangePasswordResult> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { error: 'not_found' };
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return { error: 'wrong_password' };
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id }, data: { password: hashed } });
  return { ok: true };
}

export async function confirmUserVerified(id: number) {
  return prisma.user.update({
    where: { id },
    data: { verified: true, verifyToken: null, verifyTokenExpiry: null },
  });
}

export async function checkEmailExists(email: string, excludeUserId: number | null = null): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  if (excludeUserId && user.id === Number(excludeUserId)) return false;
  return true;
}

export async function requestEmailChange(id: number, pendingEmail: string, emailChangeToken: string, emailChangeTokenExpiry: Date) {
  return prisma.user.update({
    where: { id },
    data: { pendingEmail, emailChangeToken, emailChangeTokenExpiry },
  });
}

export async function getUserByEmailChangeToken(token: string) {
  return prisma.user.findUnique({ where: { emailChangeToken: token } });
}

export async function confirmEmailChange(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user?.pendingEmail) return null;
  return prisma.user.update({
    where: { id },
    data: { email: user.pendingEmail, pendingEmail: null, emailChangeToken: null, emailChangeTokenExpiry: null },
  });
}

export async function requestDeleteAccount(id: number, deleteAccountToken: string, deleteAccountTokenExpiry: Date) {
  return prisma.user.update({
    where: { id },
    data: { deleteAccountToken, deleteAccountTokenExpiry },
  });
}

export async function getUserByDeleteToken(token: string) {
  return prisma.user.findUnique({ where: { deleteAccountToken: token } });
}

export async function deleteUserById(id: number) {
  return prisma.$transaction([
    prisma.todo.deleteMany({ where: { userId: id } }),
    prisma.folder.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);
}

export async function requestPasswordReset(id: number, passwordResetToken: string, passwordResetTokenExpiry: Date) {
  return prisma.user.update({
    where: { id },
    data: { passwordResetToken, passwordResetTokenExpiry },
  });
}

export async function getUserByPasswordResetToken(token: string) {
  return prisma.user.findUnique({ where: { passwordResetToken: token } });
}

export async function resetPassword(id: number, newPassword: string) {
  const hashed = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id },
    data: { password: hashed, passwordResetToken: null, passwordResetTokenExpiry: null },
  });
}
