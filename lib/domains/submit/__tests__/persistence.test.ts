import { afterEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEYS,
  loadCurrentStep,
  loadDraft,
  resetDraft,
  saveCurrentStep,
  saveDraft,
} from "../persistence";
import { defaultFormState } from "../schema";

afterEach(() => {
  localStorage.clear();
});

describe("STORAGE_KEYS namespace", () => {
  it("draft key is namespaced under clinic-ranking-submit", () => {
    expect(STORAGE_KEYS.draft).toContain("clinic-ranking-submit");
  });

  it("step key is namespaced under clinic-ranking-submit", () => {
    expect(STORAGE_KEYS.step).toContain("clinic-ranking-submit");
  });
});

describe("saveDraft / loadDraft", () => {
  it("round-trips a draft and returns an equivalent object", () => {
    const draft = { ...defaultFormState(), state: "Bayern", city: "München" };
    saveDraft(draft);
    expect(loadDraft()).toEqual(draft);
  });

  it("returns null when nothing has been saved", () => {
    expect(loadDraft()).toBeNull();
  });

  it("overwrites a previous draft", () => {
    saveDraft({ ...defaultFormState(), state: "Berlin" });
    saveDraft({ ...defaultFormState(), state: "Hamburg" });
    expect(loadDraft()?.state).toBe("Hamburg");
  });

  it("does NOT touch unrelated localStorage keys", () => {
    localStorage.setItem("unrelated-key", "should-survive");
    saveDraft(defaultFormState());
    expect(localStorage.getItem("unrelated-key")).toBe("should-survive");
  });
});

describe("publishAtDate persistence", () => {
  it("round-trips publishAtDate as a string — no Date coercion", () => {
    const draft = { ...defaultFormState(), publishAtDate: "2024-12-25" };
    saveDraft(draft);
    const reloaded = loadDraft();
    expect(reloaded?.publishAtDate).toBe("2024-12-25");
    expect(typeof reloaded?.publishAtDate).toBe("string");
  });

  it("round-trips null publishAtDate as null", () => {
    saveDraft(defaultFormState());
    expect(loadDraft()?.publishAtDate).toBeNull();
  });
});

describe("saveCurrentStep / loadCurrentStep", () => {
  it("round-trips a step number", () => {
    saveCurrentStep(3);
    expect(loadCurrentStep()).toBe(3);
  });

  it("returns null when nothing has been saved", () => {
    expect(loadCurrentStep()).toBeNull();
  });
});

describe("resetDraft", () => {
  it("clears both draft and step from storage", () => {
    saveDraft({ ...defaultFormState(), state: "Bayern" });
    saveCurrentStep(4);
    resetDraft();
    expect(loadDraft()).toBeNull();
    expect(loadCurrentStep()).toBeNull();
  });

  it("does NOT clear unrelated localStorage keys", () => {
    localStorage.setItem("other-app-key", "preserved");
    saveDraft(defaultFormState());
    resetDraft();
    expect(localStorage.getItem("other-app-key")).toBe("preserved");
  });
});
