import { describe, expect, it } from "vitest";
import { reviewSubmitSchema } from "@/lib/contracts/submit.schema";
import { toReviewApiPayload } from "../mappers";
import { defaultFormState, type ReviewFormState } from "../schema";

function baseForm(overrides: Partial<ReviewFormState> = {}): ReviewFormState {
  return {
    ...defaultFormState(),
    // Minimal valid values for required fields
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
    ...overrides,
  };
}

describe("toReviewApiPayload — isCustom* fields", () => {
  it("passes all four isCustom* booleans through to the payload", () => {
    const payload = toReviewApiPayload(
      baseForm({
        isCustomState: true,
        isCustomCity: false,
        isCustomHospital: true,
        isCustomSpecialty: false,
      }),
    );
    expect(typeof payload.isCustomState).toBe("boolean");
    expect(typeof payload.isCustomCity).toBe("boolean");
    expect(typeof payload.isCustomHospital).toBe("boolean");
    expect(typeof payload.isCustomSpecialty).toBe("boolean");
    expect(payload.isCustomState).toBe(true);
    expect(payload.isCustomCity).toBe(false);
    expect(payload.isCustomHospital).toBe(true);
    expect(payload.isCustomSpecialty).toBe(false);
  });
});

describe("toReviewApiPayload — surgery section", () => {
  it("clears surgery fields (percentage → -1) when surgery rotation is not selected", () => {
    const payload = toReviewApiPayload(
      baseForm({
        rotations: ["generalWard"],
        surgery: {
          surgeryRoles: ["mainSurgeon"],
          surgeryComplexProcedures: true,
          surgeryTimePercentage: 40,
        },
      }),
    );
    expect(payload.surgeryRoles).toEqual([]);
    expect(payload.surgeryComplexProcedures).toBe(false);
    expect(payload.surgeryTimePercentage).toBe(-1);
  });

  it("preserves surgery fields when surgery rotation is selected", () => {
    const payload = toReviewApiPayload(
      baseForm({
        rotations: ["surgery", "generalWard"],
        surgery: {
          surgeryRoles: ["firstAssist", "secondAssist"],
          surgeryComplexProcedures: true,
          surgeryTimePercentage: 30,
        },
      }),
    );
    expect(payload.surgeryRoles).toEqual(["firstAssist", "secondAssist"]);
    expect(payload.surgeryComplexProcedures).toBe(true);
    expect(payload.surgeryTimePercentage).toBe(30);
  });

  it("defaults null surgeryTimePercentage to -1 when surgery is selected", () => {
    const payload = toReviewApiPayload(
      baseForm({
        rotations: ["surgery"],
        surgery: {
          surgeryRoles: [],
          surgeryComplexProcedures: false,
          surgeryTimePercentage: null,
        },
      }),
    );
    expect(payload.surgeryTimePercentage).toBe(-1);
  });

  it("preserves a legitimate 0% surgeryTimePercentage (not the -1 sentinel)", () => {
    const payload = toReviewApiPayload(
      baseForm({
        rotations: ["surgery"],
        surgery: {
          surgeryRoles: ["firstAssist"],
          surgeryComplexProcedures: false,
          surgeryTimePercentage: 0,
        },
      }),
    );
    expect(payload.surgeryTimePercentage).toBe(0);
  });
});

describe("toReviewApiPayload — diagnostics section", () => {
  it("clears diagnostics fields (percentage → -1) when functionaldiagnostics rotation is not selected", () => {
    const payload = toReviewApiPayload(
      baseForm({
        rotations: ["generalWard"],
        diagnostics: { ownExecution: true, diagnosticsTimePercentage: 50 },
      }),
    );
    expect(payload.ownDiagnosticsExecution).toBe(false);
    expect(payload.diagnosticsTimePercentage).toBe(-1);
  });

  it("preserves diagnostics fields when functionaldiagnostics is selected", () => {
    const payload = toReviewApiPayload(
      baseForm({
        rotations: ["functionaldiagnostics"],
        diagnostics: { ownExecution: true, diagnosticsTimePercentage: 60 },
      }),
    );
    expect(payload.ownDiagnosticsExecution).toBe(true);
    expect(payload.diagnosticsTimePercentage).toBe(60);
  });

  it("renames ownExecution → ownDiagnosticsExecution", () => {
    const payload = toReviewApiPayload(baseForm({ rotations: ["functionaldiagnostics"] }));
    expect("ownDiagnosticsExecution" in payload).toBe(true);
    expect("ownExecution" in payload).toBe(false);
  });
});

describe("toReviewApiPayload — publishAtDate", () => {
  it("converts YYYY-MM-DD to a full RFC-3339 timestamp with timezone", () => {
    const payload = toReviewApiPayload(baseForm({ publishAtDate: "2024-12-25" }));
    // Must not be a bare date string; must be a valid RFC-3339 datetime
    expect(payload.publishAtDate).not.toBe("2024-12-25");
    expect(
      reviewSubmitSchema.shape.publishAtDate.safeParse(payload.publishAtDate).success,
    ).toBe(true);
  });

  it("emits null when publishAtDate is null", () => {
    const payload = toReviewApiPayload(baseForm({ publishAtDate: null }));
    expect(payload.publishAtDate).toBeNull();
  });
});

describe("toReviewApiPayload — overtimeCompensationType", () => {
  it("converts empty string to null (Go *string omitempty)", () => {
    const payload = toReviewApiPayload(baseForm({ overtimeCompensationType: "" }));
    expect(payload.overtimeCompensationType).toBeNull();
  });

  it("passes a non-empty value through", () => {
    const payload = toReviewApiPayload(
      baseForm({ overtimeCompensationType: "freeTimeCompensation" }),
    );
    expect(payload.overtimeCompensationType).toBe("freeTimeCompensation");
  });
});

describe("toReviewApiPayload — otherRotations", () => {
  it("clears otherRotations when misc rotation is not selected", () => {
    const payload = toReviewApiPayload(
      baseForm({ rotations: ["generalWard"], otherRotations: "Some text" }),
    );
    expect(payload.otherRotations).toBe("");
  });

  it("preserves otherRotations when misc rotation is selected", () => {
    const payload = toReviewApiPayload(
      baseForm({ rotations: ["misc"], otherRotations: "Notaufnahme extern" }),
    );
    expect(payload.otherRotations).toBe("Notaufnahme extern");
  });
});

describe("toReviewApiPayload — acceptedTerms dropped", () => {
  it("does not include acceptedTerms in the output", () => {
    const payload = toReviewApiPayload(baseForm({ acceptedTerms: true }));
    expect("acceptedTerms" in payload).toBe(false);
  });
});

describe("toReviewApiPayload — null numeric defaults", () => {
  it("maps unknown (null) numerics to the -1 sentinel", () => {
    const payload = toReviewApiPayload(
      baseForm({
        yearOfTraining: null,
        yearAtHospital: null,
        averageTrainingTimeYears: null,
        weeklyHours: null,
        contractualHours: null,
        onCallShiftsPerMonth: null,
      }),
    );
    expect(payload.yearOfTraining).toBe(-1);
    expect(payload.yearAtHospital).toBe(-1);
    expect(payload.averageTrainingTimeYears).toBe(-1);
    expect(payload.weeklyHours).toBe(-1);
    expect(payload.contractualHours).toBe(-1);
    expect(payload.onCallShiftsPerMonth).toBe(-1);
  });

  it("preserves a legitimate 0 (e.g. zero on-call shifts) instead of the -1 sentinel", () => {
    expect(
      toReviewApiPayload(baseForm({ onCallShiftsPerMonth: 0 })).onCallShiftsPerMonth,
    ).toBe(0);
  });

  it("maps null grade to 0 (caught by contract validation min:1)", () => {
    const payload = toReviewApiPayload(baseForm({ totalGrade: null }));
    expect(payload.totalGrade).toBe(0);
    // Contract validation correctly rejects the 0 grade
    expect(reviewSubmitSchema.safeParse(payload).success).toBe(false);
  });
});

describe("toReviewApiPayload — full contract validation", () => {
  it("passes reviewSubmitSchema when all required fields are present and valid", () => {
    const payload = toReviewApiPayload(
      baseForm({
        yearOfTraining: 2,
        yearAtHospital: 1,
        trainingHospitalChanged: false,
        weeklyHours: 50,
        contractualHours: 42,
        onCallShiftsPerMonth: 3,
        averageTrainingTimeYears: 6,
        correctOvertimeLogging: true,
      }),
    );
    const result = reviewSubmitSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});
