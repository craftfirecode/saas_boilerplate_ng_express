import { z } from 'zod';

/**
 * Zentrale Validierungsregeln mit Zod – wiederverwendbar in allen Controllern.
 */

// ─── Hilfsfunktion ────────────────────────────────────────────────────────────

/**
 * Führt ein Zod-Schema gegen einen Wert aus und gibt
 * das gewohnte { valid, error } Format zurück.
 * @template T
 * @param {z.ZodSchema<T>} schema
 * @param {unknown} value
 * @returns {{ valid: boolean, data?: T, error?: string }}
 */
function parseSchema(schema, value) {
  const result = schema.safeParse(value);
  if (result.success) return { valid: true, data: result.data };
  return { valid: false, error: result.error.errors[0].message };
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const usernameSchema = z
  .string({ required_error: 'Benutzername darf nicht leer sein.' })
  .min(1, 'Benutzername darf nicht leer sein.')
  .regex(/^\S+$/, 'Benutzername darf keine Leerzeichen enthalten.');

export const passwordSchema = z
  .string({ required_error: 'Passwort darf nicht leer sein.' })
  .min(1, 'Passwort darf nicht leer sein.')
  .min(8, 'Passwort muss mindestens 8 Zeichen lang sein.');

export const emailSchema = z
  .string({ required_error: 'E-Mail-Adresse darf nicht leer sein.' })
  .email('Ungültige E-Mail-Adresse.');

/** Schema für die Registrierung (komplettes Body-Objekt) */
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

/** Schema für den Login */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Passwort darf nicht leer sein.'),
});

/** Schema für das Passwort-Reset-Formular */
export const passwordResetSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Passwortbestätigung darf nicht leer sein.'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Die Passwörter stimmen nicht überein.',
    path: ['confirmPassword'],
  });

/** Schema für die E-Mail-Änderung */
export const emailChangeSchema = z.object({
  email: emailSchema,
});

// ─── Kompatibilitäts-Wrapper (bestehende Controller bleiben unverändert) ──────

/**
 * Validiert einen Username.
 * @param {string} username
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUsername(username) {
  return parseSchema(usernameSchema, username);
}

/**
 * Validiert ein Passwort.
 * @param {string} password
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePassword(password) {
  return parseSchema(passwordSchema, password);
}

/**
 * Validiert eine E-Mail-Adresse.
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  return parseSchema(emailSchema, email);
}
