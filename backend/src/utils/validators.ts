import { z } from 'zod';

/**
 * Zentrale Validierungsregeln mit Zod – wiederverwendbar in allen Controllern.
 */

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const usernameSchema = z
  .string({ error: 'Benutzername darf nicht leer sein.' })
  .min(1, 'Benutzername darf nicht leer sein.')
  .regex(/^\S+$/, 'Benutzername darf keine Leerzeichen enthalten.');

export const passwordSchema = z
  .string({ error: 'Passwort darf nicht leer sein.' })
  .min(1, 'Passwort darf nicht leer sein.')
  .min(8, 'Passwort muss mindestens 8 Zeichen lang sein.');

export const emailSchema = z
  .string({ error: 'E-Mail-Adresse darf nicht leer sein.' })
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


