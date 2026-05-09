# Design philosophy — Assistenz Arzt Ranking (frontend)

This document is the **single source of truth** for intentional visual design in `clinic-ranking-fe`. When changing look-and-feel, **update this file first**, then implement in tokens (`app/globals.css`), primitives (`components/ui/*`), and feature layouts.

---

## Workflow

1. Decide the semantic intent (e.g. “primary marketing CTA” vs “standard app action”).
2. Record it here if it’s a new pattern or rule change.
3. Implement **tokens** in `:root` / `@theme inline` in `app/globals.css` (one source for hex → Tailwind `bg-*` / `text-*`).
4. Implement **behavior** in primitives (`Button`, `Input`, `Table`, etc.) so screens stay thin and consistent.
5. Avoid one-off hex or shadow stacks on feature pages unless documented below.

---

## Color hierarchy

| Role | Intent | Token(s) | Typical Tailwind |
|------|--------|-----------|------------------|
| **Canvas** | Full-page background | `--background` (`#f8f6f0`) | `bg-background` |
| **Brand red** | Highest emphasis: hero title, rare high-impact CTAs | `--brand-red` (`#c8102e`) | `text-brand-red`, `bg-brand-red` |
| **Brand mint / teal** | Secondary emphasis: section subheaders (paired with hero story) | `--brand-mint` (`#0d9488`) | `text-brand-mint` |
| **Primary UI** | Default actions in the app (nav, forms, tables) | `--primary` = foreground black | `Button` **default** variant → black fill |
| **Lifted surface** | Controls and data sitting *on* the canvas—filters, table shells, mobile cards—one step brighter than canvas without pure white tiles | `--surface-lifted` (`color-mix` into white) | `bg-surface-lifted` |
| **Pure white card** | Strong separation where needed (e.g. admin sidebar) | `--cream-surface` / `--card` | `bg-card` |
| **Muted / borders** | Secondary text, chrome | `--text-muted`, `--cream-border` | `text-muted-foreground`, `border-border` |
| **Destructive** | Dangerous actions (delete, irreversible) — **not** marketing red | `--destructive` | `variant="destructive"` |

**Rules of thumb**

- **Red text (`page-title`) + red filled button** = same campaign language (landing hero + landing CTAs via `Button variant="brand"`).
- **Black primary buttons** = normal product UI (`Button` default).
- **Mint (`section-title`)** = subsection headlines on marketing blocks (and placeholder titles using `.section-title`).
- **Lifted cream (`surface-lifted`)** = dense UI (reviews filters, table wrapper, mobile cards)—aligned with Material-style **surface layering**: canvas → one tonal step up for grouped content (see [Material Design – elevation / surfaces](https://m3.material.io/styles/elevation/overview)).

---

## Typography roles

| Class / pattern | Use |
|-----------------|-----|
| `.page-title` | Single hero `<h1>` on key landing moments — `text-brand-red`, responsive scale. |
| `.section-title` | Marketing / section `<h2>`–`<h3>` blocks — `text-brand-mint`. Also used by `PlaceholderPage` titles. |
| `text-foreground` | Primary body and headings where brand colors aren’t needed. |
| `text-muted-foreground` | Supporting copy, descriptions. |

---

## Surfaces & layout

- **Page**: always `bg-background` on `html` / `body`.
- **Sticky footer**: root layout uses viewport-min height so short pages don’t show the footer mid-screen (`min-h-dvh` stack).
- **Data surfaces**: reviews table shell, mobile review cards, combobox triggers → **`bg-surface-lifted`** + border; optional **`shadow-sm`** on containers where we want a single “card” elevation (not per table row).

---

## Buttons (`components/ui/button.tsx`)

| Variant | Fill / intent | Shadow |
|---------|----------------|--------|
| **default** | Black (`bg-primary`) — **default app actions** | `shadow-md` |
| **brand** | Brand red + white label — **landing / rare marketing CTAs** only | `shadow-md` |
| **outline** | Bordered; filters, secondary actions | `shadow-sm` |
| **secondary** | Muted fill | `shadow-sm` |
| **destructive** | Soft red tint — dangerous actions | `shadow-sm` |
| **ghost** / **link** | Minimal chrome | `shadow-none` |

Do **not** use brand red for routine chrome (header “Bewerten” stays **default** unless product decides otherwise).

---

## Elevation (shadows)

- **Filled primaries & brand**: `shadow-md` — clearer lift on cream.
- **Outlined / secondary / destructive**: `shadow-sm` — border already defines edge; lighter shadow avoids noise.
- **Dense tables**: shadow on the **container**, not every row (reduces cognitive load; aligns with common dashboard/table UX — scan lines + hover, not stacked cards).

---

## Accessibility

- **Contrast**: aim for WCAG **AA** minimum for text and interactive labels on `--background`, `--surface-lifted`, and button fills ([WCAG 2.2 Understanding Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)).
- **Focus**: visible `focus-visible` rings on `Button`; keyboard navigation for combobox / tables.
- **Don’t rely on color alone** for state—pair hover tint with cursor / aria where needed.

---

## UX references (concise)

- **WCAG**: perceptible contrast; focus visible; semantic headings.
- **Surface hierarchy** (Material-influenced): background vs surface vs overlay—avoid arbitrary extra grays.
- **Tables**: minimize decoration per row; rely on hover scrim + borders for scan ([NN/g — scanning](https://www.nngroup.com/articles/how-users-read-on-the-web/)).

---

## Improvement suggestions (backlog)

| Idea | Why |
|------|-----|
| **Brand variant** (done) | Removes duplicated utility strings on landing; enforces red = documented pattern. |
| **Dark mode audit** | `:root` only today; add `.dark` tokens and test brand red / mint on dark surfaces. |
| **Visual regression** | Chromatic / Playwright screenshots for landing + reviews row. |
| **Destructive vs brand-red** | Document product language: destructive = harm data; brand = marketing emphasis. |
| **Storybook** | Token swatches + Button variant matrix for reviewers. |

---

## File map

| Concern | Location |
|---------|----------|
| Tokens & semantic colors | `app/globals.css` (`:root`, `@theme inline`, `@layer components` for `.page-title` / `.section-title`) |
| Button semantics | `components/ui/button.tsx` |
| Reviews surfaces | `components/domains/reviews/*`, `components/ui/combobox.tsx` |

---

*Last aligned with codebase: see git history for `docs/design-philosophy.md` introduction.*
