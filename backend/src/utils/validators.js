/**
 * Zentrale Validierungsregeln – wiederverwendbar in allen Controllern.
 */

// ─── Username ────────────────────────────────────────────────────────────────

/**
 * Validiert einen Username.
 * @param {string} username
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUsername(username) {
  if (!username || username.trim() === '') {
    return { valid: false, error: 'Benutzername darf nicht leer sein.' };
  }
  if (/\s/.test(username)) {
    return { valid: false, error: 'Benutzername darf keine Leerzeichen enthalten.' };
  }
  return { valid: true };
}

// ─── Password (für später) ────────────────────────────────────────────────────

/**
 * Validiert ein Passwort.
 * @param {string} password
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePassword(password) {
  if (!password || password.trim() === '') {
    return { valid: false, error: 'Passwort darf nicht leer sein.' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Passwort muss mindestens 8 Zeichen lang sein.' };
  }
  return { valid: true };
}
