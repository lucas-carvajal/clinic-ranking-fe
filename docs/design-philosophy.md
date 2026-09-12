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
- **Underlined text** is the secondary CTA (`Button variant="link"`, weight 600). Landing uses it for `Bewertungen ansehen`. Nav links stay their own component.
- **Selected nav** is black at 800. Idle nav is utility gray at 600. It is not red and has no underline bar.
- Public UI stays mono besides the red product CTA. Do not use mint as a second brand color on public pages.
- Admin (`[data-shell="admin"]`) restores the cream / mint tokens and is out of scope for this language.

---

## Typography roles

| Class / pattern | Use |
|-----------------|-----|
| `.landing-kicker` | Small marketing kicker. Nunito, muted ink. |
| `.page-title` | Landing `<h1>`. Nunito, ink, not red. |
| `.section-title` | Marketing section headings. Nunito, ink. |
| `font-sans` / Nunito | All public type: nav, buttons, filters, forms, tables, headings, body. |
| `text-foreground` | Primary app headings and body. |
| `text-muted-foreground` | Supporting copy (utility ink, readable). |

One family on public pages. Nunito is SIL OFL. Do not hotlink paid Tiempos files.

---

## Surfaces and layout

- **Page**: `bg-background` on `html` / `body` (`#FFFFFF` on public).
- **Nav**: white bar with no hairline, gray links, selected black, pulsating ❤️ wordmark, black pill `Bewerten` on desktop, hamburger on mobile.
- **Footer**: legal links on the same white sheet. No hairline. Idle utility gray at 400. Selected black at 600. Desktop only. On mobile those links live in the hamburger menu.
- **Landing**: Million letter. Title first (`Das Assistenz Arzt Ranking`). Subhead below (`Ärzte helfen Ärzten` plus the fair-training line). Short numbered sections. One red pill (`Jetzt bewerten`) and an underlined text link (`Bewertungen ansehen`). No kicker above the title. No gray footnotes band.
- **Reviews**: table on `md+`, cards on small viewports. Keep that split. Pager is text like the nav: idle 600 utility, current 800 black. `Zurück` / `Weiter`. No circles.
- **Sticky footer**: root layout uses viewport-min height (`min-h-dvh` stack). Extra bottom padding on the page stack (`pb-20` mobile, `pb-14` desktop) so the last control is not on the edge.
- Prefer whitespace over dividers and heavy shadows. Soft cards only where they earn the box.

---

## Buttons (`components/ui/button.tsx`)

| Variant | Fill / intent | Radius |
|---------|----------------|--------|
| **default** | Black (`bg-primary`) — chrome, nav `Bewerten` | `--button-radius` (100px on public) |
| **brand** | Medical red + white label — important product CTAs (`Jetzt bewerten`, `Abschicken`, `Feedback absenden`) | `--button-radius` |
| **outline** | Transparent fill, 2px `#151515` border, black label | `--button-radius` |
| **secondary** | Quiet fill | `--button-radius` |
| **destructive** | Soft red tint — dangerous actions | `--button-radius` |
| **ghost** | Minimal chrome | `--button-radius` |
| **link** | Underlined ink, no pill, weight 600 — secondary CTAs (`Bewertungen ansehen`) | none |

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
| Fonts | `app/layout.tsx` (`Nunito`) |
| Button semantics | `components/ui/button.tsx` |
| Public nav | `components/layout/app-site-header.tsx` |
| Reviews surfaces | `components/domains/reviews/*` |

---

*Last aligned with the Paper Minimalism public remap.*
