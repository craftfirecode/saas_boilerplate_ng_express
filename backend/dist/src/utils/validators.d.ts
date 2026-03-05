import { z } from 'zod';
/**
 * Zentrale Validierungsregeln mit Zod – wiederverwendbar in allen Controllern.
 */
interface ParseResult<T> {
    valid: boolean;
    data?: T;
    error?: string;
}
export declare const usernameSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
/** Schema für die Registrierung (komplettes Body-Objekt) */
export declare const registerSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
/** Schema für den Login */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
/** Schema für das Passwort-Reset-Formular */
export declare const passwordResetSchema: z.ZodObject<{
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
/** Schema für die E-Mail-Änderung */
export declare const emailChangeSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare function validateUsername(username: unknown): ParseResult<string>;
export declare function validatePassword(password: unknown): ParseResult<string>;
export declare function validateEmail(email: unknown): ParseResult<string>;
export {};
