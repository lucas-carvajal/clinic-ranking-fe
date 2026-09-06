# Feedback

Feedback lets a visitor send product feedback or process feedback, with email, and see a thank-you state after a successful send.

## Sub-features

- `feedback-open` opens the default product-feedback form.
- `feedback-process` opens the submission-process variant.
- `feedback-validate` shows field errors without calling the backend.
- `feedback-error` shows a form alert when the backend is missing or down.
- `feedback-success` shows the thank-you state after a real send (backend required).

## How to get to it (user POV)

- Choose `Feedback` in `Hauptnavigation`.
- Open `/app/feedback`.
- Open `/app/feedback?type=submission_feedback`.
- Choose `Feedback geben!` on `/app/submit/success` (lands on the process variant).
- After success, the page is `/app/feedback?success=true`; choose `Weiteres Feedback geben` to return to the form.

## Driving it with control-clinic-ranking

Preconditions:

- Clinic Ranking FE is healthy at the origin from `control-clinic-ranking origin`.
- `control-clinic-ranking doctor` reports `ok=true`.
- `feedback-success` needs a live backend that accepts `POST /feedback`. Without it, prove validate + error and mark success `verified-unreachable`.

- **Open default.** Go to `/app/feedback` (or click `Feedback` in `Hauptnavigation`). Run `control-clinic-ranking screenshot /app/feedback`. Heading `Feedback geben` is visible. Fields `Dein Feedback` (`#feedback`) and `Deine E-Mail-Adresse` (`#email`) are present. Submit is `Feedback absenden`.
- **Process variant.** Open `/app/feedback?type=submission_feedback`. Heading `Feedback zum Bewertungsprozess` is visible and the textarea placeholder is `Dein Feedback zum Bewertungsprozess...`.
- **Validate empty.** Choose `Feedback absenden` with both fields empty. Alerts `Bitte gib Feedback ein.` and `Bitte gib eine E-Mail-Adresse ein.` appear. URL stays on the form (no `success=true`).
- **Validate email.** Fill feedback text, set email to `not-an-email`, submit. The field is `type="email"`: the browser’s native constraint tooltip appears (Chrome: `Please include an '@' in the email address.`) and the server action does **not** run. The zod alert `Bitte gib eine gültige E-Mail-Adresse ein.` is the action-path message; it will not replace the native tooltip for a value that fails HTML email. Empty-submit field errors can linger if native validation blocks the next submit (`useActionState` is stale until a new action).
- **Backend error.** Fill valid feedback and email, submit, with no API. A `role="alert"` explains the send failed (connection or “kann gerade nicht verschickt werden”). URL still has no `success=true`.
- **Success (backend).** Submit valid fields against a live API. URL becomes `/app/feedback?success=true`. Heading `Vielen Dank für dein Feedback ❤️` is visible. Link `Weiteres Feedback geben` returns to `/app/feedback`.
- **Proof.** Capture the empty-submit field errors (action) and either the success heading or the real form alert (result). Direct GET `?success=true` without submitting is **not** proof of `feedback-success`.

## Gotchas

- Empty-field zod messages run in the server action; empty submit never needs a backend. The email input is `type="email"`, so Chrome/Firefox stop `not-an-email` with a native tooltip before zod runs.
- `?type=` values other than `submission_feedback` fall back to product feedback. Do not treat a typo type as a third form.
- Submit button label becomes `Wird gesendet…` while pending; wait for the alert or the success heading.
- Header `Feedback` is not on `/`. Open an `/app/*` route first, or use the direct URL.
