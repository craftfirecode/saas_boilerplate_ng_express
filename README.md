# SaaS-NG

Ein vollständiges SaaS-Starter-Projekt mit einem **Angular 21 Frontend** und einem **Node.js/Express Backend**, das alle grundlegenden Authentifizierungs- und Benutzerkontofeatures abdeckt.

---

## Tech-Stack

### Backend
| Technologie | Version | Zweck |
|---|---|---|
| Node.js + Express | ^4.19 | REST-API-Server |
| TypeScript | ^5 | Typsicherheit (via `tsx`) |
| Prisma ORM | ^5.12 | Datenbank-Zugriff & Migrationen |
| SQLite | – | Datenbank (via Prisma) |
| Zod | ^4 | Schema-Validierung (Request Bodies) |
| jsonwebtoken | ^9.0 | JWT-Authentifizierung |
| bcrypt | ^5.1 | Passwort-Hashing |
| Nodemailer | ^8.0 | E-Mail-Versand |
| cookie-parser | ^1.4 | Cookie-Handling |
| dotenv | ^16.4 | Umgebungsvariablen |
| Socket.IO | ^4.7 | (installiert, im Server vorbereitet) |

### Frontend
| Technologie | Version | Zweck |
|---|---|---|
| Angular | ^21.0 | SPA-Framework |
| @angular/cdk | ^21.0 | Component Dev Kit |
| @angular/aria | ^21.0 | Barrierefreie UI-Primitives (Accordion) |
| @angular/service-worker | ^21.0 | PWA / Service Worker |
| Tailwind CSS | ^4.2 | Utility-first Styling |
| lucide-angular | ^0.575 | Icon-Bibliothek |
| RxJS | ~7.8 | Reaktive Programmierung |

---

## Projektstruktur

```
saas-ng/
├── backend/          # Node.js / Express REST-API
│   ├── prisma/       # Datenbankschema & Migrationen (SQLite)
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
└── ng/               # Angular 21 Frontend
    └── src/app/
        ├── core/     # Services, Guards, Interceptor
        ├── forms/    # Einstellungs-Formulare
        ├── routes/   # Seiten (auth, protected, testing)
        ├── signal/   # Signal-basierte State-Services
        ├── ui/       # Wiederverwendbare UI-Komponenten
        └── styles/   # Design Tokens (Tailwind v4 @theme)
```

---

## Backend

### Datenbank-Schema (Prisma / SQLite)

**User**
- `id`, `email` (unique), `username` (unique), `password` (bcrypt-Hash)
- `verified` – E-Mail-Verifikationsstatus
- `verifyToken` / `verifyTokenExpiry` – E-Mail-Bestätigung nach Registrierung
- `pendingEmail` / `emailChangeToken` / `emailChangeTokenExpiry` – E-Mail-Änderungsprozess
- `deleteAccountToken` / `deleteAccountTokenExpiry` – Account-Löschprozess
- `passwordResetToken` / `passwordResetTokenExpiry` – Passwort-Reset-Prozess

**Folder**
- `id`, `name`, `userId` (Relation zu User, Cascade-Delete)

**Todo**
- `id`, `name`, `folderId` (Relation zu Folder, Cascade-Delete), `userId` (Relation zu User, Cascade-Delete)

---

### API-Routen

#### Auth (`/auth`)
| Methode | Pfad | Beschreibung | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Benutzer registrieren, Verifikationsmail senden | – |
| `POST` | `/auth/login` | Login, setzt `accessToken`- & `refreshToken`-Cookie | – |
| `POST` | `/auth/refresh` | Access-Token via Refresh-Token erneuern | – |
| `POST` | `/auth/logout` | Cookies löschen | – |
| `GET` | `/auth/me` | Eingeloggten Benutzer abrufen | ✅ JWT |
| `GET` | `/auth/verify-email` | E-Mail-Adresse nach Registrierung bestätigen (`?token=`) | – |

#### User (`/users`)
| Methode | Pfad | Beschreibung | Auth |
|---|---|---|---|
| `PUT` | `/users/me` | Benutzernamen ändern | ✅ JWT |
| `PUT` | `/users/me/password` | Passwort ändern (aktuelles Passwort erforderlich) | ✅ JWT |
| `PUT` | `/users/me/email` | E-Mail-Änderung beantragen, Bestätigungsmail an aktuelle Adresse | ✅ JWT |
| `GET` | `/users/me/confirm-email` | E-Mail-Änderung via Token bestätigen (`?token=`) | – |
| `POST` | `/users/me/request-delete` | Account-Löschung beantragen, Bestätigungsmail senden | ✅ JWT |
| `GET` | `/users/me/confirm-delete` | Account-Löschung via Token bestätigen (`?token=`) | – |
| `POST` | `/users/forgot-password` | Passwort-Reset-Mail anfordern | – |
| `POST` | `/users/reset-password` | Neues Passwort setzen via Token (`?token=`) | – |

#### Folders (`/folders`)
| Methode | Pfad | Beschreibung | Auth |
|---|---|---|---|
| `GET` | `/folders` | Alle Folder abrufen (inkl. Todos) | ✅ JWT |
| `GET` | `/folders/:id` | Einzelnen Folder abrufen | ✅ JWT |
| `POST` | `/folders` | Neuen Folder erstellen | ✅ JWT |
| `PUT` | `/folders/:id` | Folder aktualisieren | ✅ JWT |
| `DELETE` | `/folders/:id` | Folder löschen (Cascade auf Todos) | ✅ JWT |

#### Mail (`/mail`)
| Methode | Pfad | Beschreibung | Auth |
|---|---|---|---|
| `GET` | `/mail/test` | Test-E-Mail versenden (an `MAIL_TEST_TO`) | ✅ JWT |

---

### Authentifizierung & Sicherheit

- **JWT-Strategie**: Zwei separate Tokens mit unterschiedlichen Secrets und Laufzeiten:
  - `accessToken` – 15 Minuten, in HttpOnly-Cookie
  - `refreshToken` – 30 Tage, in HttpOnly-Cookie
- **Separate JWT-Secrets** für jeden Anwendungsfall: Access, Refresh, E-Mail-Verifikation, E-Mail-Änderung, Account-Löschung, Passwort-Reset
- **Cookies**: `httpOnly: true`, `secure: true` in Production, `sameSite: lax`
- **Passwort-Hashing** mit bcrypt
- **Anti-Enumeration** beim Passwort-Reset: Endpunkt antwortet immer mit HTTP 200, unabhängig davon ob die E-Mail existiert
- **Defense in Depth**: Token-Ablaufzeit wird sowohl im JWT als auch in der Datenbank geprüft
- **Middleware** `verifyAccess`: Akzeptiert Token aus Cookie oder `Authorization: Bearer`-Header

### Validierung

- Zentrale Validierungslogik in `src/utils/validators.ts` via **Zod**
- Exportierte Schemas:
  - `usernameSchema` – Darf nicht leer sein, keine Leerzeichen
  - `passwordSchema` – Mindestens 8 Zeichen, darf nicht leer sein
  - `emailSchema` – Muss eine gültige E-Mail-Adresse sein
  - `registerSchema` – Kombiniert username + email + password (für Registrierung)
  - `loginSchema` – Kombiniert email + password (für Login)
  - `passwordResetSchema` – newPassword + confirmPassword inkl. Übereinstimmungs-Check
  - `emailChangeSchema` – E-Mail-Änderungsanfrage
- Alle Controller nutzen `schema.safeParse()` direkt – der erste Fehler wird als `{ error: "..." }` mit HTTP 400 zurückgegeben

### E-Mail-System (Nodemailer)

- Konfigurierbar via `.env` (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`, etc.)
- DNS-Lookup zur IP-Auflösung mit Fallback auf direkten Hostnamen
- SNI-Support (`tls.servername` immer mit Originalhost)
- Optionales SMTP-Debug-Logging (`MAIL_DEBUG=true`)
- Optionaler SMTP-Handshake-Test vor dem Versand (`MAIL_VERIFY=true`)
- Automatischer Retry bei `ECONNREFUSED` (1 Wiederholungsversuch)
- Folgende E-Mail-Typen sind implementiert:
  - **Registrierung**: E-Mail-Bestätigungslink (24h gültig)
  - **E-Mail-Änderung**: Bestätigungslink an aktuelle Adresse (1h gültig)
  - **Account-Löschung**: Bestätigungslink (1h gültig)
  - **Passwort-Reset**: Reset-Link (1h gültig)
  - **Test-Mail**: Manuell auslösbar über `/mail/test`

---

### Starten (Backend)

```bash
cd backend
cp .env.exp .env        # .env anpassen
npm install
npm run db:init         # Erstmalig: Prisma-Migrationen ausführen
npm run dev             # Entwicklungsserver mit tsx (Port 4000)
npm run build           # TypeScript nach dist/ kompilieren
npm run start:dist      # Kompilierten Build starten
```

#### Erforderliche `.env`-Variablen

```env
PORT=4000
NODE_ENV=development

# App-URL (wird in Mail-Links verwendet)
APP_URL=http://localhost:4200

# JWT Secrets
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
VERIFY_TOKEN_SECRET=
EMAIL_CHANGE_TOKEN_SECRET=
DELETE_ACCOUNT_TOKEN_SECRET=
PASSWORD_RESET_TOKEN_SECRET=

# JWT Expiry (optional, Defaults vorhanden)
ACCESS_EXP=15m
REFRESH_EXP=30d
VERIFY_EXP=24h
EMAIL_CHANGE_EXP=1h
DELETE_ACCOUNT_EXP=1h
PASSWORD_RESET_EXP=1h

# Mail
MAIL_HOST=
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
MAIL_TEST_TO=
MAIL_DEBUG=false
MAIL_VERIFY=false
```

---

## Frontend (Angular 21)

### Architektur

- **Standalone Components** (kein NgModule)
- **Zoneless Change Detection** (`provideZonelessChangeDetection()`)
- **Signals** für State-Management (`signal()`, `computed()`)
- **Lazy Loading** für alle Routen (`loadComponent`)
- **`OnPush` Change Detection** in allen Komponenten
- **Reactive Forms** (kein Template-Driven)
- **PWA** mit Service Worker (`@angular/service-worker`)

### Routen

| Pfad | Komponente | Guard |
|---|---|---|
| `/login` | `LoginComponent` | `guestGuard` |
| `/register` | `RegisterComponent` | `guestGuard` |
| `/verify-email` | `VerifyEmailComponent` | – |
| `/verify-email-change` | `VerifyEmailChangeComponent` | – |
| `/forgot-password` | `ForgotPasswordComponent` | `guestGuard` |
| `/reset-password` | `ResetPasswordComponent` | – |
| `/confirm-delete-account` | `ConfirmDeleteAccountComponent` | – |
| `/protected` | `RootComponent` | `authGuard` |
| `/protected/settings` | `SettingsComponent` | `authGuard` |
| `/testing/email` | `EmailTestComponent` | `authGuard` |
| `/` | Redirect → `/protected` | – |

### Guards

- **`authGuard`**: Wartet auf `auth.ready()`, leitet nicht-authentifizierte Nutzer zu `/login` um
- **`guestGuard`**: Wartet auf `auth.ready()`, leitet bereits eingeloggte Nutzer zu `/protected` um
- Beide Guards sind SSR-sicher (überspringen Redirects auf dem Server)

### Core Services

#### `AuthService`
- Initialisiert sich automatisch beim App-Start: versucht `/auth/me`, bei 401 automatisch Token-Refresh via `/auth/refresh`
- `user` als `signal<AuthUser | null>`
- `ready()` – Promise, das auf die Initialisierung wartet (für Guards)
- Methoden: `signUp()`, `signIn()`, `signOut()`, `refresh()`, `reloadUserObject()`

#### `UserService`
- Alle Benutzerkontooperationen:
  - `updateProfile()` – Benutzername ändern
  - `changePassword()` – Passwort ändern
  - `requestEmailChange()` / `confirmEmailChange()` – E-Mail-Änderung (2-Schritt)
  - `requestAccountDeletion()` / `confirmAccountDeletion()` – Account-Löschung (2-Schritt)
  - `requestPasswordReset()` / `confirmPasswordReset()` – Passwort-Reset (2-Schritt)

#### `MailService`
- `sendTestMail()` – löst `/mail/test` aus

#### `FolderSignalService`
- Lädt alle Folder beim Start und hält sie in `folderList = signal<any[]>([])`
- `folderID = signal<number | null>(null)` – aktiv ausgewählter Folder

### HTTP-Interceptor (`AuthInterceptor`)

- Fügt automatisch `withCredentials: true` an alle Requests an
- Bei HTTP 401: Automatischer Token-Refresh-Versuch, danach Request-Wiederholung
- Bei erneutem Fehler: Error wird weitergegeben

### Seiten

#### Authentifizierung
- **Login** (`/login`): Reactive Form, Inline-Fehlervalidierung, separater Hinweis bei nicht bestätigter E-Mail, Link zu "Passwort vergessen"
- **Registrierung** (`/register`): Reactive Form (E-Mail, Benutzername, Passwort), Erfolgs-State sperrt Formular und zeigt Bestätigungshinweis
- **E-Mail bestätigen** (`/verify-email`): Token aus URL-Parameter, Status-Anzeige (loading/success/error)
- **Passwort vergessen** (`/forgot-password`): E-Mail-Eingabe, Anti-Enumeration (immer Erfolg-State nach Submit)
- **Passwort zurücksetzen** (`/reset-password`): Token aus URL-Parameter, Formular mit Passwort-Bestätigung, Client-seitiger Mismatch-Check
- **E-Mail-Änderung bestätigen** (`/verify-email-change`): Token aus URL, aktualisiert `AuthService.user` nach Erfolg
- **Account-Löschung bestätigen** (`/confirm-delete-account`): Token aus URL, setzt `auth.user` auf `null` nach Erfolg

#### Geschützter Bereich
- **Root** (`/protected`): Platzhalter-Seite
- **Einstellungen** (`/protected/settings`): Vier Einstellungs-Sektionen + FAQ-Bereich

### Einstellungs-Formulare (`/forms/settings/user/`)

| Komponente | Funktion |
|---|---|
| `UsernameChange` | Benutzernamen ändern, vorbelegt mit aktuellem Wert via `effect()` |
| `PasswordChange` | Passwort ändern (aktuelles + neues + Bestätigung), Gruppen-Validator für Mismatch |
| `EmailChange` | E-Mail-Änderung beantragen, zeigt `pendingEmail` aus computed Signal |
| `DeleteAccount` | Account löschen, zeigt Bestätigungsformular erst nach Klick, E-Mail-Abgleich serverseitig |

### UI-Komponenten (`/ui/`)

#### Base-Komponenten
- **`UiButton`** (`button[uiButton], a[uiButton]`): Attribute-Selector-Direktive für Buttons und Links
  - Varianten: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
  - Größen: `default`, `sm`, `lg`, `icon`
  - Active-State-Erkennung für RouterLink-Elemente
- **`UiInput`** (`input[uiInput]`): Attribute-Selector-Direktive für Eingabefelder
  - Varianten: `default`, `error`
  - Größen: `default`, `sm`, `lg`

#### ARIA-Komponenten
- **`Accordion`** (`app-accordion`): Wraps `@angular/aria/accordion` Primitives (AccordionGroup, AccordionPanel, AccordionTrigger, AccordionContent)
  - Input: `items: AccordionItem[]` (`{ title: string, content: string }`)

#### Layout-Komponenten
- **`NavBrand`** (`layout-nav-brand`): Markenlogo-Bereich in der Sidebar

### App-Layout

Das Haupt-Template (`app.html`) rendert zwei Modi:

1. **Eingeloggt** (`ready() && user`): Sidebar-Layout mit
   - Collapsible Sidebar (Zustand in `localStorage` gespeichert)
   - Navigation: Home (`/protected`), Settings (`/protected/settings`)
   - Anzeige des eingeloggten Benutzernamens
   - Logout-Button
   - Toggle-Button in der Topbar mit Lucide-Icons
2. **Nicht eingeloggt / Lade-Zustand**: Nur `<router-outlet>` (für Auth-Seiten)

### Design-System (Tailwind CSS v4)

Custom Design Tokens via `@theme` in `styles/base/theme.scss`:

| Token-Gruppe | Beschreibung |
|---|---|
| `surface-app/card/subtle/muted/dark` | Hintergrundflächen |
| `border/border-subtle/border-faint` | Rahmenfarben |
| `content-primary/secondary/muted/placeholder` | Textfarben |
| `brand/brand-hover/brand-fg` | Primäre Aktionsfarbe |
| `danger-bg/border/text/text-soft` | Fehler-Feedback |
| `success-bg/border/text` | Erfolgs-Feedback |
| `warning-bg/border/text/text-soft` | Warn-Feedback |

### Barrierefreiheit (Accessibility)

- `aria-label` auf allen Formularen
- `aria-invalid` auf Inputs bei Validierungsfehlern
- `aria-describedby` verknüpft Inputs mit Fehlermeldungen
- `role="alert"` + `aria-live` auf Fehler- und Statusmeldungen
- `focus-visible`-Styles auf allen interaktiven Elementen
- ARIA-konforme Accordion-Komponente via `@angular/aria`

### PWA

- Service Worker konfiguriert via `ngsw-config.json`
  - App-Assets (HTML, CSS, JS) werden beim Install **prefetched**
  - Statische Assets (Bilder, Fonts) werden **lazy** geladen und bei Updates prefetched
- `manifest.webmanifest` vorhanden
- App-Icons in den Größen: 72×72, 96×96, 128×128, 144×144, 152×152, 192×192, 384×384, 512×512

### Starten (Frontend)

```bash
cd ng
npm install
npm start           # Dev-Server auf http://localhost:4200
npm run build       # Production-Build
```

> **Hinweis**: Die API-URL ist in `src/app/environment.ts` konfiguriert (Dev: `http://localhost:4001`).

---

## Lizenz

Siehe [LICENSE](LICENSE).
