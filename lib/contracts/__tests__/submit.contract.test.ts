import { describe, expect, it } from "vitest";

import { reviewSubmitSchema } from "@/lib/contracts/submit.schema";

const validSubmit = {
  state: "Bayern",
  city: "Muenchen",
  hospital: "Klinikum A",
  specialty: "Innere Medizin",
  isCustomState: false,
  isCustomCity: false,
  isCustomHospital: false,
  isCustomSpecialty: false,
  yearOfTraining: 2,
  yearAtHospital: 1,
  homeUniversity: "LMU",
  trainingHospitalChanged: false,
  rotations: ["generalWard", "icu"],
  otherRotations: "",
  surgeryRoles: ["firstAssist"],
  surgeryComplexProcedures: false,
  surgeryTimePercentage: 30,
  ownDiagnosticsExecution: true,
  diagnosticsTimePercentage: 40,
  trainingQuality: ["structuredOnboarding"],
  workStructure: ["structuredTrainingProgram"],
  averageTrainingTimeYears: 6,
  workAtmosphere: ["niceColleagues"],
  weeklyHours: 50,
  contractualHours: 42,
  overtimeCompensationType: null,
  correctOvertimeLogging: true,
  onCallShiftsPerMonth: 3,
  gradeTheoreticalKnowledge: 2,
  gradePracticalKnowledge: 2,
  gradeAtmosphere: 3,
  gradeFacilities: 2,
  gradeWorkingConditions: 3,
  gradeFamilyFriendliness: 4,
  totalGrade: 3,
  wouldRecommendHospital: true,
  textReviewTraining: "Gut",
  textReviewApplication: "Schnell",
  publishAtDate: null,
  email: "doctor@example.com",
};

describe("submit contracts", () => {
  it("parses valid review submit payload", () => {
    expect(reviewSubmitSchema.parse(validSubmit).email).toBe("doctor@example.com");
  });

  it("fails when required fields are missing", () => {
    const invalid = { ...validSubmit };
    // @ts-expect-error test case
    delete invalid.state;
    expect(() => reviewSubmitSchema.parse(invalid)).toThrow();
  });

  it("fails for invalid grades", () => {
    expect(() =>
      reviewSubmitSchema.parse({
        ...validSubmit,
        gradeFacilities: 8,
      }),
    ).toThrow();
  });

  it("allows unknown fields without failing", () => {
    expect(
      reviewSubmitSchema.parse({
        ...validSubmit,
        backendAddedField: "ignored",
      }).state,
    ).toBe("Bayern");
  });
});
