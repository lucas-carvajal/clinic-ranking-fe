import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  STORAGE_KEYS,
  loadCurrentStep,
  loadDraft,
  saveCurrentStep,
  saveDraft,
} from "../persistence";
import { defaultFormState, type ReviewFormState } from "../schema";

const { push } = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/api/client", () => ({
  post: vi.fn().mockResolvedValue({ id: "review-1" }),
}));

import { useSubmitReview } from "../use-submit-review";

function validFormState(): ReviewFormState {
  return {
    ...defaultFormState(),
    state: "Bayern",
    city: "München",
    hospital: "Klinikum A",
    specialty: "Innere Medizin",
    gradeTheoreticalKnowledge: 2,
    gradePracticalKnowledge: 3,
    gradeAtmosphere: 4,
    gradeFacilities: 2,
    gradeWorkingConditions: 3,
    gradeFamilyFriendliness: 5,
    totalGrade: 3,
    email: "doctor@example.com",
    acceptedTerms: true,
  };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

afterEach(() => {
  localStorage.clear();
  push.mockReset();
});

describe("useSubmitReview", () => {
  it("clears submit draft keys before navigating to success", async () => {
    push.mockImplementation(() => {
      expect(localStorage.getItem(STORAGE_KEYS.draft)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.step)).toBeNull();
    });

    saveDraft(validFormState());
    saveCurrentStep(4);
    expect(loadDraft()).not.toBeNull();
    expect(loadCurrentStep()).toBe(4);

    const { result } = renderHook(() => useSubmitReview(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(validFormState());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(push).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/app/submit/success");
    expect(loadDraft()).toBeNull();
    expect(loadCurrentStep()).toBeNull();
  });
});