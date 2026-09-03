import { describe, expect, it } from "vitest";
import { reviewFormSchema, defaultFormState } from "../schema";
import { isStepComplete } from "../steps";

const completeStep1 = {
  ...defaultFormState(),
  state: "Bayern",
  city: "München",
  hospital: "Klinikum A",
  specialty: "Innere Medizin",
};

const completeStep6 = {
  ...defaultFormState(),
  gradeTheoreticalKnowledge: 2,
  gradePracticalKnowledge: 3,
  gradeAtmosphere: 4,
  gradeFacilities: 2,
  gradeWorkingConditions: 3,
  gradeFamilyFriendliness: 5,
  totalGrade: 3,
};

const completeStep7 = {
  ...defaultFormState(),
  email: "doctor@example.com",
  acceptedTerms: true as const,
};

describe("reviewFormSchema — grade fields", () => {
  it("accepts grades 1–6", () => {
    const result = reviewFormSchema.pick({ gradeAtmosphere: true }).safeParse({
      gradeAtmosphere: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects grade 0 (below min)", () => {
    expect(
      reviewFormSchema.pick({ gradeAtmosphere: true }).safeParse({ gradeAtmosphere: 0 }).success,
    ).toBe(false);
  });

  it("rejects grade 7 (above max)", () => {
    expect(
      reviewFormSchema.pick({ gradeAtmosphere: true }).safeParse({ gradeAtmosphere: 7 }).success,
    ).toBe(false);
  });

  it("rejects null grade (null is not a number)", () => {
    expect(
      reviewFormSchema
        .pick({ gradeTheoreticalKnowledge: true })
        .safeParse({ gradeTheoreticalKnowledge: null }).success,
    ).toBe(false);
  });
});

describe("reviewFormSchema — publishAtDate", () => {
  it("accepts a valid YYYY-MM-DD string", () => {
    expect(
      reviewFormSchema.pick({ publishAtDate: true }).safeParse({ publishAtDate: "2024-12-25" })
        .success,
    ).toBe(true);
  });

  it("rejects a non-date string", () => {
    expect(
      reviewFormSchema.pick({ publishAtDate: true }).safeParse({ publishAtDate: "not-a-date" })
        .success,
    ).toBe(false);
  });

  it("accepts null", () => {
    expect(
      reviewFormSchema.pick({ publishAtDate: true }).safeParse({ publishAtDate: null }).success,
    ).toBe(true);
  });
});

describe("reviewFormSchema — acceptedTerms", () => {
  it("accepts literal true", () => {
    expect(
      reviewFormSchema.pick({ acceptedTerms: true }).safeParse({ acceptedTerms: true }).success,
    ).toBe(true);
  });

  it("rejects false", () => {
    expect(
      reviewFormSchema.pick({ acceptedTerms: true }).safeParse({ acceptedTerms: false }).success,
    ).toBe(false);
  });
});

describe("reviewFormSchema — boolean-as-valid-answer regression", () => {
  // Regression: the legacy generic helper treated `false` as "empty" for boolean fields.
  // z.boolean() correctly accepts false as a real answer.
  it("correctOvertimeLogging=false passes pick schema (false is a valid answer, not empty)", () => {
    const result = reviewFormSchema
      .pick({ correctOvertimeLogging: true })
      .safeParse({ correctOvertimeLogging: false });
    expect(result.success).toBe(true);
  });
});

describe("isStepComplete — step 1", () => {
  it("is complete when all required string fields are non-empty", () => {
    expect(isStepComplete(1, completeStep1)).toBe(true);
  });

  it("is incomplete when any required field is empty", () => {
    expect(isStepComplete(1, { ...completeStep1, city: "" })).toBe(false);
  });

  it("is incomplete when hospital is missing", () => {
    expect(isStepComplete(1, { ...completeStep1, hospital: "" })).toBe(false);
  });
});

describe("isStepComplete — steps with no required fields", () => {
  it("step 2 is always complete", () => {
    expect(isStepComplete(2, defaultFormState())).toBe(true);
  });

  it("step 3 is always complete", () => {
    expect(isStepComplete(3, defaultFormState())).toBe(true);
  });

  it("step 4 is always complete", () => {
    expect(isStepComplete(4, defaultFormState())).toBe(true);
  });

  it("step 5 is always complete", () => {
    expect(isStepComplete(5, defaultFormState())).toBe(true);
  });
});

describe("isStepComplete — step 6", () => {
  it("is complete when all grades are set (1–6)", () => {
    expect(isStepComplete(6, completeStep6)).toBe(true);
  });

  it("is incomplete when any grade is null", () => {
    expect(isStepComplete(6, { ...completeStep6, totalGrade: null })).toBe(false);
  });

  it("is incomplete when a grade is out of range", () => {
    expect(isStepComplete(6, { ...completeStep6, gradeAtmosphere: 8 })).toBe(false);
  });
});

describe("isStepComplete — step 7", () => {
  it("is complete when email is valid and acceptedTerms is true", () => {
    expect(isStepComplete(7, completeStep7)).toBe(true);
  });

  it("is incomplete when acceptedTerms is false", () => {
    expect(isStepComplete(7, { ...completeStep7, acceptedTerms: false })).toBe(false);
  });

  it("is incomplete when email is invalid", () => {
    expect(isStepComplete(7, { ...completeStep7, email: "not-an-email" })).toBe(false);
  });

  it("is incomplete when email is empty", () => {
    expect(isStepComplete(7, { ...completeStep7, email: "" })).toBe(false);
  });

  it("accepts a private Gmail address", () => {
    expect(isStepComplete(7, { ...completeStep7, email: "name@gmail.com" })).toBe(true);
  });
});

describe("isStepComplete — unknown step", () => {
  it("returns false for an unknown step number", () => {
    expect(isStepComplete(99, defaultFormState())).toBe(false);
  });
});
