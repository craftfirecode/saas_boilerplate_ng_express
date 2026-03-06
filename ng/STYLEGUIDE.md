# Styleguide – Design Tokens & Komponenten

> **Stack:** Angular 19 · Tailwind CSS v4 · SCSS  
> **Datei:** `ng/src/styles/base/theme.scss` (Tokens), `ng/src/styles/base/typography.scss` (Typo)

---

## Inhaltsverzeichnis

1. [Color Tokens](#1-color-tokens)
2. [Typography](#2-typography)
3. [Spacing & Sizing](#3-spacing--sizing)
4. [Border Radius](#4-border-radius)
5. [Shadows](#5-shadows)
6. [Komponenten – Button](#6-komponenten--button)
7. [Komponenten – Input](#7-komponenten--input)
8. [Komponenten – Card / Section](#8-komponenten--card--section)
9. [Layout](#9-layout)
10. [Feedback-Zustände](#10-feedback-zustände)
11. [Figma Token-Referenz (JSON-Format)](#11-figma-token-referenz-json-format)

---

## 1. Color Tokens

Alle Farben sind in `@theme` definiert und werden von Tailwind v4 direkt als Utility-Klassen verfügbar gemacht.  
Schema: `bg-{token}`, `text-{token}`, `border-{token}`

### 1.1 Surfaces

| Token                     | Klasse                  | Hex       | Tailwind Ref | Verwendung                          |
|---------------------------|-------------------------|-----------|--------------|-------------------------------------|
| `--color-surface-app`     | `bg-surface-app`        | `#fcfcfc` | —            | App-Hintergrund, Sidebar            |
| `--color-surface-card`    | `bg-surface-card`       | `#ffffff` | white        | Cards, Inputs, Modals               |
| `--color-surface-subtle`  | `bg-surface-subtle`     | `#f9fafb` | gray-50      | Read-only Felder, Code-Blöcke       |
| `--color-surface-muted`   | `bg-surface-muted`      | `#f3f4f6` | gray-100     | Hover-States                        |
| `--color-surface-dark`    | `bg-surface-dark`       | `#030712` | gray-950     | Verify-Seiten Hintergrund           |

### 1.2 Border

| Token                     | Klasse                  | Hex       | Tailwind Ref | Verwendung                          |
|---------------------------|-------------------------|-----------|--------------|-------------------------------------|
| `--color-border`          | `border-border`         | `#d1d5db` | gray-300     | Standard-Rahmen                     |
| `--color-border-subtle`   | `border-border-subtle`  | `#e5e7eb` | gray-200     | Trennlinien, Card-Ränder            |
| `--color-border-faint`    | `border-border-faint`   | `#f3f4f6` | gray-100     | Card-interne Trennlinie             |

### 1.3 Content / Text

| Token                          | Klasse                         | Hex       | Tailwind Ref | Verwendung                    |
|--------------------------------|--------------------------------|-----------|--------------|-------------------------------|
| `--color-content-primary`      | `text-content-primary`         | `#111827` | gray-900     | Überschriften, Labels         |
| `--color-content-secondary`    | `text-content-secondary`       | `#374151` | gray-700     | Body-Text                     |
| `--color-content-muted`        | `text-content-muted`           | `#6b7280` | gray-500     | Beschreibungen, Hints         |
| `--color-content-placeholder`  | `text-content-placeholder`     | `#9ca3af` | gray-400     | Input-Placeholder             |

### 1.4 Brand (Primary Action)

| Token                  | Klasse              | Hex       | Tailwind Ref | Verwendung                       |
|------------------------|---------------------|-----------|--------------|----------------------------------|
| `--color-brand`        | `bg-brand`          | `#111827` | gray-900     | Buttons, Akzente                 |
| `--color-brand-hover`  | `bg-brand-hover`    | `#1f2937` | gray-800     | Button Hover-State               |
| `--color-brand-fg`     | `text-brand-fg`     | `#ffffff` | white        | Text auf Brand-Hintergrund       |

### 1.5 Feedback: Danger

| Token                       | Klasse                    | Hex       | Tailwind Ref | Verwendung                    |
|-----------------------------|---------------------------|-----------|--------------|-------------------------------|
| `--color-danger-bg`         | `bg-danger-bg`            | `#fef2f2` | red-50       | Alert-Hintergrund             |
| `--color-danger-border`     | `border-danger-border`    | `#fecaca` | red-200      | Alert-Rahmen                  |
| `--color-danger-text`       | `text-danger-text`        | `#b91c1c` | red-700      | Alert-Text, destruktive Labels|
| `--color-danger-text-soft`  | `text-danger-text-soft`   | `#dc2626` | red-600      | Inline-Fehlermeldungen        |

### 1.6 Feedback: Success

| Token                     | Klasse                  | Hex       | Tailwind Ref | Verwendung          |
|---------------------------|-------------------------|-----------|--------------|---------------------|
| `--color-success-bg`      | `bg-success-bg`         | `#f0fdf4` | green-50     | Success-Alert BG    |
| `--color-success-border`  | `border-success-border` | `#bbf7d0` | green-200    | Success-Alert Rahmen|
| `--color-success-text`    | `text-success-text`     | `#15803d` | green-700    | Success-Text        |

### 1.7 Feedback: Warning

| Token                       | Klasse                    | Hex       | Tailwind Ref | Verwendung              |
|-----------------------------|---------------------------|-----------|--------------|-------------------------|
| `--color-warning-bg`        | `bg-warning-bg`           | `#fffbeb` | amber-50     | Warning-Alert BG        |
| `--color-warning-border`    | `border-warning-border`   | `#fde68a` | amber-200    | Warning-Alert Rahmen    |
| `--color-warning-text`      | `text-warning-text`       | `#b45309` | amber-700    | Warning-Text (fett)     |
| `--color-warning-text-soft` | `text-warning-text-soft`  | `#d97706` | amber-600    | Warning-Text (weich)    |

---

## 2. Typography

**Font-Familie:** `Inter`, `Segoe UI`, `system-ui`, `sans-serif`  
**Quelle:** `ng/src/styles/base/typography.scss`

### 2.0 Body / Fließtext

| Token (SCSS)       | Wert                                          | Verwendung              |
|--------------------|-----------------------------------------------|-------------------------|
| `$font-size-body`  | `1rem` (16px)                                 | Alle Body-Elemente      |
| `$font-weight-body`| `400` (Regular)                               | p, li, label, input … |
| `$line-height-body`| `1.6`                                         | Optimale Lesbarkeit     |
| `$font-body`       | `Inter, Segoe UI, system-ui, sans-serif`      | Globaler Body-Font      |

Betrifft: `body`, `p`, `li`, `td`, `label`, `input`, `textarea`, `select`, `button`

### 2.1 Fixed Type Scale

Alle Headings verwenden **feste px-Werte** (kein Fluid/clamp). Alle Headings sind einheitlich **Bold (700)**.

| Tag | Größe (rem) | Größe (px) | Font-Weight | Line-Height | Letter-Spacing | Margin-Bottom |
|-----|-------------|------------|-------------|-------------|----------------|---------------|
| h1  | 2.25rem     | 36px       | **700**     | 1.2         | −0.02em        | 1.25rem       |
| h2  | 1.875rem    | 30px       | **700**     | 1.3         | −0.015em       | 1rem          |
| h3  | 1.5rem      | 24px       | **700**     | 1.35        | −0.01em        | 0.875rem      |
| h4  | 1.25rem     | 20px       | **700**     | 1.4         | −0.005em       | 0.75rem       |
| h5  | 1.125rem    | 18px       | **700**     | 1.45        | 0em            | 0.625rem      |
| h6  | 1rem        | 16px       | **700**     | 1.5         | 0em            | 0.5rem        |

### 2.2 Heading Colors

| Token (SCSS)               | Hex       | Tailwind Ref | Verwendung              |
|----------------------------|-----------|--------------|-------------------------|
| `$color-heading-primary`   | `#0f172a` | slate-900    | Standard Heading-Farbe  |
| `$color-heading-muted`     | `#475569` | slate-600    | `.heading--muted`       |
| `$color-heading-accent`    | `#6366f1` | indigo-500   | `.heading--accent`      |

### 2.3 Modifier-Klassen

```html
<!-- Farb-Varianten -->
<h2 class="heading--muted">Gedämpft</h2>
<h2 class="heading--accent">Akzent (Indigo)</h2>
<h2 class="heading--white">Weiß</h2>

<!-- Gewicht-Varianten -->
<h2 class="heading--light">300</h2>
<h2 class="heading--medium">500</h2>
<h2 class="heading--bold">700</h2>
<h2 class="heading--black">900</h2>

<!-- Semantische Größenklassen (unabhängig vom Tag) -->
<p class="text-h3">Paragraph mit H3-Größe</p>

<!-- Spezial -->
<h1 class="heading--gradient">Gradient-Text (Indigo → Violet → Pink)</h1>
<p class="heading--overline">OVERLINE LABEL</p>
```

### 2.4 In-App Typography Patterns

| Klasse                                         | Verwendung                    |
|------------------------------------------------|-------------------------------|
| `text-2xl font-semibold text-content-primary`  | Page-Titel (h1)               |
| `text-base font-semibold text-content-primary` | Card-Überschrift (h2)         |
| `text-sm text-content-muted`                   | Untertitel, Beschreibungen    |
| `text-sm font-medium text-content-secondary`   | Form-Labels                   |
| `text-xs text-danger-text-soft`                | Inline-Fehlermeldungen        |

---

## 3. Spacing & Sizing

Tailwind-Standard-Skala (0.25rem / 4px Raster). Häufig verwendete Werte im Projekt:

| Token | px    | Verwendung                                |
|-------|-------|-------------------------------------------|
| 1     | 4px   | `gap-1` (Nav-Items)                       |
| 1.5   | 6px   | `gap-1.5` (Form-Fields Label↔Input)       |
| 2     | 8px   | `gap-2`, `px-2` (kleine Abstände)         |
| 3     | 12px  | `px-3` (Input-Padding), `gap-3`           |
| 4     | 16px  | `px-4`, `gap-4` (Form-Felder)             |
| 5     | 20px  | `p-5` (Sidebar Nav, App-Padding)          |
| 6     | 24px  | `px-6`, `py-6` (Card-Body)               |
| 8     | 32px  | `gap-8` (Login Card Sektionen), `px-8`   |
| 10    | 40px  | `py-10` (Settings-Page Padding)           |
| 16    | 64px  | `h-16` (Top-Navigation Bar)              |

---

## 4. Border Radius

| Klasse       | Wert    | Verwendung                           |
|--------------|---------|--------------------------------------|
| `rounded-md` | 6px     | Inputs, Buttons, kleine Elemente     |
| `rounded-xl` | 12px    | Cards, Modals, Brand-Icon            |

---

## 5. Shadows

| Klasse       | Verwendung                         |
|--------------|------------------------------------|
| `shadow-sm`  | Cards, Sections (dezenter Schatten)|

---

## 6. Komponenten – Button

**Selector:** `button[uiButton]`, `a[uiButton]`  
**Quelle:** `ng/src/app/ui/base/button/button.ts`

### Varianten

| Variant        | Hintergrund          | Text             | Hover                    | Rahmen                     |
|----------------|----------------------|------------------|--------------------------|----------------------------|
| `default`      | `#18181b` (zinc-900) | white            | zinc-900/90              | —                          |
| `destructive`  | transparent          | red-500          | red-500/90 + white Text  | `border border-red-500`    |
| `outline`      | white                | zinc-900         | zinc-100                 | `border border-zinc-200`   |
| `secondary`    | zinc-100             | zinc-900         | zinc-100/80              | —                          |
| `ghost`        | transparent          | inherit          | zinc-100                 | —                          |
| `link`         | transparent          | zinc-900         | underline                | —                          |

### Größen

| Size      | Höhe  | Padding   | Klasse                    |
|-----------|-------|-----------|---------------------------|
| `default` | 40px  | px-4 py-2 | `h-10 px-4 py-2`          |
| `sm`      | 36px  | px-3      | `h-9 rounded-md px-3`     |
| `lg`      | 44px  | px-8      | `h-11 rounded-md px-8`    |
| `icon`    | 40px  | —         | `h-10 w-10`               |

### Base-Klassen (immer aktiv)

```
inline-flex items-center justify-center whitespace-nowrap
rounded-md text-sm font-medium
ring-offset-white transition-colors
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-zinc-950 focus-visible:ring-offset-2
disabled:pointer-events-none disabled:opacity-50
```

### Mit Icon (`icon="true"`)

Fügt `gap-5` zum Base hinzu → Icon + Label mit 20px Abstand.

### Verwendungsbeispiele

```html
<!-- Primary -->
<button uiButton type="submit" class="w-full">Anmelden</button>

<!-- Destructive -->
<button uiButton variant="destructive" size="sm" class="w-full">Account löschen</button>

<!-- Ghost mit Icon (Navigation) -->
<a uiButton variant="ghost" icon="true" class="w-full justify-start" routerLink="/protected">
  <lucide-icon name="house"/>
  Home
</a>

<!-- Icon-Button -->
<button uiButton variant="ghost" size="icon">
  <lucide-icon name="settings" class="size-5"/>
</button>
```

---

## 7. Komponenten – Input

**Selector:** `input[uiInput]`  
**Quelle:** `ng/src/app/ui/base/input/input.ts`

### Varianten

| Variant   | Rahmen            | Focus Ring              |
|-----------|-------------------|-------------------------|
| `default` | `border-border`   | `ring-brand`            |
| `error`   | `border-danger-border` | `ring-danger-text-soft` |

### Größen

| Size      | Höhe  | Textgröße |
|-----------|-------|-----------|
| `default` | 40px  | text-sm   |
| `sm`      | 32px  | text-xs   |
| `lg`      | 48px  | text-base |

### Base-Klassen

```
rounded-md border bg-surface-card px-3 py-2 text-sm transition-colors
placeholder:text-content-placeholder
focus:outline-none focus:ring-2 focus:ring-offset-0
disabled:pointer-events-none disabled:opacity-50
w-full  (default, abschaltbar via [full]="false")
```

### Verwendungsbeispiele

```html
<!-- Standard -->
<input uiInput type="email" placeholder="deine@email.de" />

<!-- Mit Fehler-State -->
<input uiInput variant="error" type="text" />

<!-- Klein, nicht full-width -->
<input uiInput size="sm" [full]="false" type="text" />
```

---

## 8. Komponenten – Card / Section

Kein separater Component – Pattern aus Tailwind-Klassen.

### Normales Card-Pattern

```html
<div class="bg-surface-card rounded-xl border border-border-subtle shadow-sm overflow-hidden">
  <!-- Card Header -->
  <div class="px-6 py-5 border-b border-border-faint">
    <h2 class="text-base font-semibold text-content-primary">Titel</h2>
    <p class="text-sm text-content-muted mt-0.5">Beschreibung</p>
  </div>
  <!-- Card Body -->
  <div class="px-6 py-6">
    <!-- Inhalt -->
  </div>
</div>
```

### Danger-Card (z. B. Account löschen)

```html
<div class="bg-surface-card rounded-xl border border-danger-border shadow-sm overflow-hidden">
  <div class="px-6 py-5 border-b border-danger-border/40">
    <h2 class="text-base font-semibold text-danger-text">Gefährliche Aktion</h2>
    <p class="text-sm text-content-muted mt-0.5">Beschreibung der Konsequenz.</p>
  </div>
  <div class="px-6 py-6">
    <!-- Inhalt -->
  </div>
</div>
```

### Auth-Card (Login / Register)

```html
<div class="min-h-screen bg-surface-app flex items-center justify-center px-4">
  <div class="w-full max-w-sm flex flex-col gap-8">
    <!-- Brand Logo -->
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="size-10 rounded-xl bg-brand flex items-center justify-center">
        <span class="text-brand-fg text-lg font-bold leading-none">S</span>
      </div>
      <h1 class="text-2xl font-semibold text-content-primary">Titel</h1>
      <p class="text-sm text-content-muted">Untertitel</p>
    </div>
    <!-- Formular-Card -->
    <div class="bg-surface-card rounded-xl border border-border-subtle shadow-sm px-8 py-8 flex flex-col gap-6">
      <!-- … -->
    </div>
  </div>
</div>
```

---

## 9. Layout

### App-Shell

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (250px, sticky, h-screen)  │  Main Content      │
│  bg-surface-app                     │  bg-surface-app    │
│  border-r border-border             │                    │
│  ┌─────────────────────────┐        │  ┌──────────────┐  │
│  │ Nav (p-5)               │        │  │ Topbar (h-16)│  │
│  │  logo + nav-items       │        │  │ border-b     │  │
│  ├─────────────────────────┤        │  └──────────────┘  │
│  │ Footer (p-5)            │        │  <router-outlet>   │
│  │  user info + logout     │        │  px-5              │
│  └─────────────────────────┘        └────────────────────┘
└─────────────────────────────────────────────────────────┘
```

| Element            | Klassen                                                          |
|--------------------|------------------------------------------------------------------|
| Outer Container    | `container-full mx-auto`                                         |
| Grid               | `layout-grid min-h-screen` (CSS Grid, toggled per Signal)        |
| Sidebar Open       | `grid-template-columns: 250px 1fr`                               |
| Sidebar Closed     | `grid-template-columns: 0px 1fr`                                 |
| Sidebar            | `flex flex-col justify-between h-screen border-r border-border bg-surface-app sticky top-0` |
| Topbar             | `border-b border-border mb-5 flex items-center px-5 gap-2 h-16` |
| Page Content       | `px-5`                                                           |
| Settings-Page Max-W| `max-w-3xl mx-auto px-4 py-10`                                  |

### Transitions

| Element        | Transition                                               |
|----------------|----------------------------------------------------------|
| Grid-Spalten   | `transition: grid-template-columns 300ms ease-in-out`   |
| Sidebar Breite | `transition: width 300ms ease-in-out, padding 300ms ease-in-out, opacity 300ms ease-in-out` |

---

## 10. Feedback-Zustände

### Alert / Banner

```html
<!-- Error -->
<div role="alert" class="p-3 bg-danger-bg text-danger-text rounded-md text-sm border border-danger-border">
  Fehlermeldung
</div>

<!-- Warning (z. B. E-Mail nicht bestätigt) -->
<div role="alert" aria-live="assertive"
     class="p-3 bg-warning-bg text-warning-text rounded-md text-sm border border-warning-border flex flex-col gap-1">
  <p class="font-semibold">📧 Titel</p>
  <p class="text-warning-text-soft">Details</p>
</div>

<!-- Success -->
<div role="alert" class="p-3 bg-success-bg text-success-text rounded-md text-sm border border-success-border">
  Erfolgsmeldung
</div>
```

### Inline-Fehler (unter Input)

```html
<p id="field-error" role="alert" class="text-xs text-danger-text-soft">
  Pflichtfeld
</p>
```

---

## 11. Figma Token-Referenz (JSON-Format)

Dieses JSON kann direkt in Figma über das **Tokens Studio** Plugin (ehemals Figma Tokens) importiert werden.

```json
{
  "global": {
    "color": {
      "surface": {
        "app":    { "value": "#fcfcfc", "type": "color", "description": "App-Hintergrund, Sidebar" },
        "card":   { "value": "#ffffff", "type": "color", "description": "Cards, Inputs, Modals" },
        "subtle": { "value": "#f9fafb", "type": "color", "description": "Read-only Felder, Code-Blöcke" },
        "muted":  { "value": "#f3f4f6", "type": "color", "description": "Hover-States" },
        "dark":   { "value": "#030712", "type": "color", "description": "Verify-Seiten Hintergrund" }
      },
      "border": {
        "DEFAULT": { "value": "#d1d5db", "type": "color", "description": "Standard-Rahmen (gray-300)" },
        "subtle":  { "value": "#e5e7eb", "type": "color", "description": "Trennlinien, Cards (gray-200)" },
        "faint":   { "value": "#f3f4f6", "type": "color", "description": "Card-interne Trennlinie (gray-100)" }
      },
      "content": {
        "primary":     { "value": "#111827", "type": "color", "description": "Überschriften, Labels (gray-900)" },
        "secondary":   { "value": "#374151", "type": "color", "description": "Body-Text (gray-700)" },
        "muted":       { "value": "#6b7280", "type": "color", "description": "Beschreibungen (gray-500)" },
        "placeholder": { "value": "#9ca3af", "type": "color", "description": "Input Placeholder (gray-400)" }
      },
      "brand": {
        "DEFAULT": { "value": "#111827", "type": "color", "description": "Buttons, Akzente (gray-900)" },
        "hover":   { "value": "#1f2937", "type": "color", "description": "Button Hover (gray-800)" },
        "fg":      { "value": "#ffffff", "type": "color", "description": "Text auf Brand-BG" }
      },
      "danger": {
        "bg":       { "value": "#fef2f2", "type": "color", "description": "Alert BG (red-50)" },
        "border":   { "value": "#fecaca", "type": "color", "description": "Alert Rahmen (red-200)" },
        "text":     { "value": "#b91c1c", "type": "color", "description": "Alert Text (red-700)" },
        "textSoft": { "value": "#dc2626", "type": "color", "description": "Inline-Fehler (red-600)" }
      },
      "success": {
        "bg":     { "value": "#f0fdf4", "type": "color", "description": "Success BG (green-50)" },
        "border": { "value": "#bbf7d0", "type": "color", "description": "Success Rahmen (green-200)" },
        "text":   { "value": "#15803d", "type": "color", "description": "Success Text (green-700)" }
      },
      "warning": {
        "bg":       { "value": "#fffbeb", "type": "color", "description": "Warning BG (amber-50)" },
        "border":   { "value": "#fde68a", "type": "color", "description": "Warning Rahmen (amber-200)" },
        "text":     { "value": "#b45309", "type": "color", "description": "Warning Text (amber-700)" },
        "textSoft": { "value": "#d97706", "type": "color", "description": "Warning Text weich (amber-600)" }
      },
      "heading": {
        "primary": { "value": "#0f172a", "type": "color", "description": "Heading Default (slate-900)" },
        "muted":   { "value": "#475569", "type": "color", "description": "Heading Muted (slate-600)" },
        "accent":  { "value": "#6366f1", "type": "color", "description": "Heading Accent (indigo-500)" }
      }
    },
    "typography": {
      "fontFamily": {
        "heading": { "value": "Inter, Segoe UI, system-ui, sans-serif", "type": "fontFamilies" },
        "body":    { "value": "Inter, Segoe UI, system-ui, sans-serif", "type": "fontFamilies" }
      },
      "fontSize": {
        "h1": { "value": "36", "type": "fontSizes", "description": "2.25rem" },
        "h2": { "value": "30", "type": "fontSizes", "description": "1.875rem" },
        "h3": { "value": "24", "type": "fontSizes", "description": "1.5rem" },
        "h4": { "value": "20", "type": "fontSizes", "description": "1.25rem" },
        "h5": { "value": "18", "type": "fontSizes", "description": "1.125rem" },
        "h6": { "value": "16", "type": "fontSizes", "description": "1rem = body size" },
        "body": { "value": "16", "type": "fontSizes", "description": "1rem – $font-size-body" },
        "sm":   { "value": "14", "type": "fontSizes", "description": "text-sm (Tailwind)" },
        "xs":   { "value": "12", "type": "fontSizes", "description": "text-xs (Tailwind)" },
        "base": { "value": "16", "type": "fontSizes", "description": "text-base (Tailwind)" },
        "2xl":  { "value": "24", "type": "fontSizes", "description": "text-2xl – Page Title" }
      },
      "fontWeight": {
        "regular":   { "value": "400", "type": "fontWeights", "description": "Body ($font-weight-body)" },
        "medium":    { "value": "500", "type": "fontWeights" },
        "semibold":  { "value": "600", "type": "fontWeights" },
        "bold":      { "value": "700", "type": "fontWeights", "description": "Alle Headings h1–h6" },
        "extrabold": { "value": "800", "type": "fontWeights" },
        "black":     { "value": "900", "type": "fontWeights" }
      },
      "lineHeight": {
        "body":    { "value": "1.6",  "type": "lineHeights", "description": "Body ($line-height-body)" },
        "h1":      { "value": "1.2",  "type": "lineHeights" },
        "h2":      { "value": "1.3",  "type": "lineHeights" },
        "h3":      { "value": "1.35", "type": "lineHeights" },
        "h4":      { "value": "1.4",  "type": "lineHeights" },
        "h5":      { "value": "1.45", "type": "lineHeights" },
        "h6":      { "value": "1.5",  "type": "lineHeights" }
      },
      "letterSpacing": {
        "h1":     { "value": "-0.02em",  "type": "letterSpacing" },
        "h2":     { "value": "-0.015em", "type": "letterSpacing" },
        "h3":     { "value": "-0.01em",  "type": "letterSpacing" },
        "h4":     { "value": "-0.005em", "type": "letterSpacing" },
        "h5-h6":  { "value": "0em",      "type": "letterSpacing" },
        "normal": { "value": "0em",      "type": "letterSpacing" },
        "wide":   { "value": "0.1em",    "type": "letterSpacing", "description": "Overline" }
      }
    },
    "spacing": {
      "1":   { "value": "4",  "type": "spacing" },
      "1.5": { "value": "6",  "type": "spacing" },
      "2":   { "value": "8",  "type": "spacing" },
      "3":   { "value": "12", "type": "spacing" },
      "4":   { "value": "16", "type": "spacing" },
      "5":   { "value": "20", "type": "spacing" },
      "6":   { "value": "24", "type": "spacing" },
      "8":   { "value": "32", "type": "spacing" },
      "10":  { "value": "40", "type": "spacing" },
      "16":  { "value": "64", "type": "spacing" }
    },
    "borderRadius": {
      "md": { "value": "6",  "type": "borderRadius", "description": "Inputs, Buttons" },
      "xl": { "value": "12", "type": "borderRadius", "description": "Cards, Modals" }
    },
    "sizing": {
      "input-default": { "value": "40", "type": "sizing", "description": "Input / Button default height" },
      "input-sm":      { "value": "32", "type": "sizing" },
      "input-lg":      { "value": "48", "type": "sizing" },
      "button-sm":     { "value": "36", "type": "sizing" },
      "button-lg":     { "value": "44", "type": "sizing" },
      "topbar":        { "value": "64", "type": "sizing" },
      "sidebar":       { "value": "250","type": "sizing" }
    },
    "boxShadow": {
      "sm": { "value": "0 1px 2px 0 rgba(0,0,0,0.05)", "type": "boxShadow", "description": "Cards, Sections" }
    }
  }
}
```

---

> **Hinweis für Figma:** Importiere das JSON in **Tokens Studio** → *Load from file* → `global`.  
> Alle Tokens werden dann als Figma-Variablen verfügbar und können direkt auf Frames, Text und Komponenten angewendet werden.  
> Für `color`-Tokens empfiehlt es sich, in Figma **Color Styles** oder **Variables (Collections)** zu erstellen.
