# Submit a review

Submit lets a visitor walk a seven-step form, keep a local draft, and send a review. Success is a dedicated thank-you page.

## Sub-features

- `submit-open` opens step 1 from each supported entry point.
- `submit-steps` moves with `Weiter` / `Zurück` and the sidebar, showing `N / 7`.
- `submit-draft` persists values across reload in this browser profile.
- `submit-validate` blocks `Abschicken` when required fields are missing.
- `submit-success` reaches `/app/submit/success` after a real POST (backend required).

## How to get to it (user POV)

- Choose `Jetzt Berichten` on `/`.
- Choose `Bewerten` in the header (desktop) or in the mobile menu.
- Open `/app/submit` directly.
- After a successful submit, the app navigates to `/app/submit/success` (also reachable as a screen, `noindex`).

## Driving it with control-clinic-ranking

Preconditions:

- Clinic Ranking FE is healthy at the origin from `control-clinic-ranking origin`.
- `control-clinic-ranking doctor` reports `ok=true`.
- Desktop (≥1024px) to use navigation `Formular-Schritte`; narrower uses the mobile progressbar instead of the sidebar.
- Clear `localStorage` keys `clinic-ranking-submit:form-draft` and `clinic-ranking-submit:current-step` before a clean run (or use a fresh profile).
- `submit-success` needs `launch --mock` or a live backend. Without either, prove `submit-validate` and the visible POST error, then mark success `verified-unreachable`.

- **Open form.** Choose `Jetzt Berichten` or open `/app/submit`. Run `control-clinic-ranking screenshot /app/submit`. Heading `Dein Krankenhaus` is visible. Footer legal links are **absent**. Counter shows `1 / 7`. Button `Zurück` is disabled. Button `Weiter` is enabled.
- **Step fields.** Labels `Bundesland`, `Stadt`, `Krankenhaus`, `Fachrichtung` are present. Without a backend the combobox lists may be empty or error; the custom option (`ANDERES BUNDESLAND…` and siblings) still opens a free-text field.
- **Next step.** Choose `Weiter`. Counter becomes `2 / 7` and heading `Deine Weiterbildung` is visible. Sidebar (desktop) marks the current step with `aria-current="step"`.
- **Sidebar jump.** On desktop, choose `Dein Krankenhaus` in `Formular-Schritte`. Counter returns to `1 / 7`.
- **Draft.** Fill at least one field (custom Bundesland text is enough), wait about 300ms, reload `/app/submit`. The value and the last step number return.
- **Validate submit.** Jump to step 7 (`Freiwilliges`) via sidebar or six times `Weiter`. Choose `Abschicken` with required fields empty. Alert `Bitte fülle alle Pflichtfelder aus.` appears (`aria-live="assertive"`) and the form does **not** go to `/app/submit/success`.
- **Backend POST failure.** With required fields filled but no API, `Abschicken` shows `Fehler beim Absenden. Deine Eingaben wurden gespeichert – bitte versuche es erneut.` Draft keys remain.
- **Success (backend).** Complete required fields (step 1 location + specialty, step 6 all grades, step 7 email + terms checkbox `acceptedTerms`), choose `Abschicken`. URL becomes `/app/submit/success`. Heading `Danke für deine Bewertung! ❤️` is visible. Draft keys are gone. Link `Feedback geben!` goes to `/app/feedback?type=submission_feedback`.
- **Proof.** Capture step 1, the validation alert after `Abschicken`, and (if backend) the success heading. Reloading submit after a draft edit is the second view for `submit-draft`.

## Gotchas

- Footer is intentionally missing on submit routes; do not treat that as a broken legal feature.
- Combobox option lists come from `/api/proxy/types/…`. Empty lists without a backend are expected. Free-text / `ANDERE…` is the backend-free way to fill step 1.
- `Weiter` does not validate the current step; incomplete steps can be visited. Completeness shows as `Fehlende Pflichtfelder` on visited sidebar items.
- Step 7 copy says “Freiwilliges” but email and terms are required by the schema. Empty email/terms fail `Abschicken`.
- Grades are 1–6 with 1 best (German school scale). The success JSON-LD on detail uses the same scale; do not assert a 5-star widget.
- Success is `noindex`. Direct GET `/app/submit/success` still renders the thank-you view without having submitted — that is **not** proof of `submit-success`. Proof is the navigation after `Abschicken`.
