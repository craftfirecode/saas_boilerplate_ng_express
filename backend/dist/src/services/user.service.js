import { prisma } from '../utils/prisma.js';
import bcrypt from 'bcrypt';
export async function getUserByUsernameAndPassword(username, password) {
    const usernameLower = username.toLowerCase();
    const users = await prisma.$queryRaw `SELECT * FROM User WHERE LOWER(username) = ${usernameLower} LIMIT 1`;
    const user = users[0] ?? null;
    if (!user)
        return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
        return null;
    return user;
}
export async function getUserByEmailAndPassword(email, password) {
    const emailLower = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailLower } });
    if (!user)
        return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
        return null;
    return user;
}
export async function getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
}
export async function getUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}
export async function checkUsernameExists(username, excludeUserId = null) {
    const usernameLower = username.toLowerCase();
    if (excludeUserId) {
        const id = Number(excludeUserId);
        const users = await prisma.$queryRaw `SELECT 1 as exists_flag FROM User WHERE LOWER(username) = ${usernameLower} AND id != ${id} LIMIT 1`;
        return users.length > 0;
    }
    const users = await prisma.$queryRaw `SELECT 1 as exists_flag FROM User WHERE LOWER(username) = ${usernameLower} LIMIT 1`;
    return users.length > 0;
}
export async function updateUsername(id, username) {
    return prisma.user.update({ where: { id }, data: { username } });
}
export async function createUser({ email, username, password, verifyToken, verifyTokenExpiry }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: { email, username, password: hashedPassword, verified: false, verifyToken, verifyTokenExpiry },
    });
}
export async function getUserByVerifyToken(token) {
    return prisma.user.findUnique({ where: { verifyToken: token } });
}
export async function changePassword(id, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
        return { error: 'not_found' };
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
        return { error: 'wrong_password' };
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { password: hashed } });
    return { ok: true };
}
export async function confirmUserVerified(id) {
    return prisma.user.update({
        where: { id },
        data: { verified: true, verifyToken: null, verifyTokenExpiry: null },
    });
}
export async function checkEmailExists(email, excludeUserId = null) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return false;
    if (excludeUserId && user.id === Number(excludeUserId))
        return false;
    return true;
}
export async function requestEmailChange(id, pendingEmail, emailChangeToken, emailChangeTokenExpiry) {
    return prisma.user.update({
        where: { id },
        data: { pendingEmail, emailChangeToken, emailChangeTokenExpiry },
    });
}
export async function getUserByEmailChangeToken(token) {
    return prisma.user.findUnique({ where: { emailChangeToken: token } });
}
export async function confirmEmailChange(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user?.pendingEmail)
        return null;
    return prisma.user.update({
        where: { id },
        data: { email: user.pendingEmail, pendingEmail: null, emailChangeToken: null, emailChangeTokenExpiry: null },
    });
}
export async function requestDeleteAccount(id, deleteAccountToken, deleteAccountTokenExpiry) {
    return prisma.user.update({
        where: { id },
        data: { deleteAccountToken, deleteAccountTokenExpiry },
    });
}
export async function getUserByDeleteToken(token) {
    return prisma.user.findUnique({ where: { deleteAccountToken: token } });
}
export async function deleteUserById(id) {
    return prisma.$transaction([
        prisma.todo.deleteMany({ where: { userId: id } }),
        prisma.folder.deleteMany({ where: { userId: id } }),
        prisma.user.delete({ where: { id } }),
    ]);
}
export async function requestPasswordReset(id, passwordResetToken, passwordResetTokenExpiry) {
    return prisma.user.update({
        where: { id },
        data: { passwordResetToken, passwordResetTokenExpiry },
    });
}
export async function getUserByPasswordResetToken(token) {
    return prisma.user.findUnique({ where: { passwordResetToken: token } });
}
export async function resetPassword(id, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
        where: { id },
        data: { password: hashed, passwordResetToken: null, passwordResetTokenExpiry: null },
    });
}
