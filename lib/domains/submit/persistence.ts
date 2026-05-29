import { type ReviewFormState } from "./schema";

export const STORAGE_KEYS = {
  draft: "clinic-ranking-submit:form-draft",
  step: "clinic-ranking-submit:current-step",
} as const;

export function saveDraft(data: ReviewFormState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode, quota exceeded, etc.) — silently ignore.
  }
}

export function loadDraft(): ReviewFormState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.draft);
    if (!raw) return null;
    return JSON.parse(raw) as ReviewFormState;
  } catch {
    return null;
  }
}

export function saveCurrentStep(step: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.step, String(step));
  } catch {
    // ignore
  }
}

export function loadCurrentStep(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.step);
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

/**
 * Removes both storage keys. Does NOT clear unrelated localStorage entries.
 */
export function resetDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.draft);
    localStorage.removeItem(STORAGE_KEYS.step);
  } catch {
    // ignore
  }
}
