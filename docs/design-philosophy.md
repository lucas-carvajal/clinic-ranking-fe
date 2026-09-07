# Design philosophy — Assistenz Arzt Ranking (frontend)

This document is the source of truth for intentional visual design in `clinic-ranking-fe`. When changing look-and-feel, update this file first, then implement in tokens (`app/globals.css`), primitives (`components/ui/*`), and feature layouts.

Public pages use **Paper Minimalism**: white paper, near-black ink, one medical-red product accent. Admin keeps the older cream theme via `[data-shell="admin"]`.

---

## Workflow

1. Decide the semantic intent (for example “primary product CTA” vs “nav chrome”).
2. Record it here if it is a new pattern or a rule change.
3. Implement tokens in `:root` / `@theme inline` in `app/globals.css`.
4. Implement behavior in primitives (`Button`, `Input`, `Table`) so screens stay thin.
5. Avoid one-off hex or shadow stacks on feature pages unless documented below.

---

## Color hierarchy

| Role | Intent | Token(s) | Typical Tailwind |
|------|--------|----------|------------------|
| **Canvas** | Page background | `--background` (`#FFFFFF`) | `bg-background` |
| **Ink** | Text and chrome actions | `--foreground` (`#151515`) | `text-foreground`, `Button` default |
| **Utility** | Secondary labels, inactive nav | `--ink-utility` (~64% ink) | `text-ink-utility` |
| **Muted** | Kickers, placeholders | `--ink-muted` (~36% ink) | `text-ink-muted` |
| **Brand / product accent** | Primary product CTAs only | `--brand` / `--brand-red` (`#C41E3A`) | `bg-brand`, `Button variant="brand"` |
| **Primary UI** | Default actions, nav `Bewerten` | `--primary` = ink | `Button` default |
| **Soft surface** | Cards only where needed | `--card` / `--cream-surface` (white) | `bg-card` |
| **Hairline** | Quiet edges | `--cream-border` (12% ink on white) | `border-border` |
| **Destructive** | Dangerous actions, not marketing red | `--destructive` | `variant="destructive"` |

**Rules of thumb**

- **Red fill** is for product actions (`Jetzt bewerten`, `Abschicken`, `Feedback absenden`). It is not a title color and not the nav selected state.
- **Black fill** is chrome (`Bewerten` in the header).
- **Outline pill** is the secondary landing action (`Bewertungen ansehen`).
- **Selected nav** is black weight and color. It is not red and has no underline bar.
- Public UI stays mono besides the red product CTA. Do not use mint as a second brand color on public pages.
- Admin (`[data-shell="admin"]`) restores the cream / mint tokens and is out of scope for this language.

---

## Typography roles

| Class / pattern | Use |
|-----------------|-----|
| `.landing-kicker` | Small marketing kicker. Inter, muted ink. |
| `.page-title` | Landing `<h1>`. Source Serif 4, ink, not red. |
| `.section-title` | Marketing section headings. Source Serif 4, ink. |
| `font-sans` / Inter | UI chrome: nav, buttons, filters, forms, tables. |
| `font-serif` / Source Serif 4 | Editorial marketing headings and landing body. |
| `text-foreground` | Primary app headings and body. |
| `text-muted-foreground` | Supporting copy (utility ink, readable). |

Do not hotlink paid Tiempos files. Inter + Source Serif 4 approximate Million’s Tiempos + Inter.

---

## Surfaces and layout

- **Page**: `bg-background` on `html` / `body` (`#FFFFFF` on public).
- **Nav**: white bar, gray links, selected black, pulsating ❤️ wordmark, black pill `Bewerten` on desktop, hamburger on mobile.
- **Landing**: Million letter. Small kicker, short H1, stacked short sections, then the two CTAs. Desktop CTAs sit side by side. Mobile CTAs stack full width. No gray footnotes band.
- **Reviews**: table on `md+`, cards on small viewports. Keep that split.
- **Sticky footer**: root layout uses viewport-min height (`min-h-dvh` stack).
- Prefer whitespace over dividers and heavy shadows. Soft cards only where they earn the box.

---

## Buttons (`components/ui/button.tsx`)

| Variant | Fill / intent | Radius |
|---------|----------------|--------|
| **default** | Black (`bg-primary`) — chrome and in-flow actions, including nav `Bewerten` | `--button-radius` (100px on public) |
| **brand** | Medical red + white label — primary product submits | `--button-radius` |
| **outline** | Transparent fill, 2px `#151515` border, black label. Hover fills ink. Secondary landing CTA. | `--button-radius` |
| **secondary** | Quiet fill | `--button-radius` |
| **destructive** | Soft red tint — dangerous actions | `--button-radius` |
| **ghost** / **link** | Minimal chrome | `--button-radius` |

---

## Elevation (shadows)

- Public paper uses hairline borders or no edge. Do not stack `shadow-md` on marketing CTAs.
- Dense tables: hover via `--row-hover`, not a second cream layer.
- Admin keeps the older lifted-cream + scrim treatment through `[data-shell="admin"]`.

---

## Accessibility

- Contrast: WCAG AA for text and interactive labels. Utility ink (~64%) is the readable secondary color. Muted (~36%) is only for kickers and placeholders.
- Focus: visible `focus-visible` rings on `Button`.
- Do not encode state with color alone.

---

## File map

| Concern | Location |
|---------|----------|
| Tokens and semantic colors | `app/globals.css` (`:root`, `[data-shell="admin"]`, `@theme inline`) |
| Fonts | `app/layout.tsx` (`Inter`, `Source_Serif_4`) |
| Button semantics | `components/ui/button.tsx` |
| Public nav | `components/layout/app-site-header.tsx` |
| Reviews surfaces | `components/domains/reviews/*` |

---

*Last aligned with the Paper Minimalism public remap.*
