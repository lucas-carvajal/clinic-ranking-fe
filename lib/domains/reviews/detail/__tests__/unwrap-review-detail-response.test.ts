import { describe, expect, it } from "vitest";

import { reviewDetailSchema } from "@/lib/contracts/reviews.schema";
import { unwrapReviewDetailResponse } from "@/lib/domains/reviews/detail/unwrap-review-detail-response";

const minimalDetail = {
  id: "550e8400-e29b-41d4-a716-446655440001",
};

describe("unwrapReviewDetailResponse", () => {
  it("unwraps nested review payload before schema parse", () => {
    const wrapped = {
      review: {
        ...minimalDetail,
        dateTime: "2026-05-07T14:32:11.000Z",
        state: "Bayern",
        city: "Muenchen",
        hospital: "Klinikum A",
        specialty: "Innere Medizin",
        yearOfTraining: 2,
        yearAtHospital: 1,
        homeUniversity: "LMU",
        trainingHospitalChanged: false,
        rotations: ["generalWard"],
        otherRotations: "",
        surgeryRoles: ["firstAssist"],
        surgeryComplexProcedures: false,
        surgeryTimePercentage: 20,
        ownDiagnosticsExecution: true,
        diagnosticsTimePercentage: 25,
        trainingQuality: ["structuredOnboarding"],
        workStructure: ["structuredTrainingProgram"],
        averageTrainingTimeYears: 6,
        workAtmosphere: ["niceColleagues"],
        weeklyHours: 50,
        contractualHours: 42,
        overtimeCompensationType: null,
        correctOvertimeLogging: true,
        onCallShiftsPerMonth: 2,
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
      },
    };

    const unwrapped = unwrapReviewDetailResponse(wrapped);
    expect(reviewDetailSchema.safeParse(unwrapped).success).toBe(true);
  });

  it("leaves flat payloads unchanged when already the detail object", () => {
    const flat = unwrapReviewDetailResponse({
      ...minimalDetail,
      dateTime: "2026-05-07T14:32:11.000Z",
      hospital: "Klinik",
      specialty: "X",
      state: "S",
      city: "C",
      yearOfTraining: 1,
      yearAtHospital: 1,
      homeUniversity: "",
      trainingHospitalChanged: false,
      rotations: [],
      otherRotations: "",
      surgeryRoles: [],
      surgeryComplexProcedures: false,
      surgeryTimePercentage: 0,
      ownDiagnosticsExecution: false,
      diagnosticsTimePercentage: 0,
      trainingQuality: [],
      workStructure: [],
      averageTrainingTimeYears: 1,
      workAtmosphere: [],
      weeklyHours: 40,
      contractualHours: 40,
      overtimeCompensationType: null,
      correctOvertimeLogging: true,
      onCallShiftsPerMonth: 0,
      gradeTheoreticalKnowledge: 3,
      gradePracticalKnowledge: 3,
      gradeAtmosphere: 3,
      gradeFacilities: 3,
      gradeWorkingConditions: 3,
      gradeFamilyFriendliness: 3,
      totalGrade: 3,
      wouldRecommendHospital: null,
      textReviewTraining: "",
      textReviewApplication: "",
    });
    expect((flat as { id?: string }).id).toBeDefined();
    expect(reviewDetailSchema.safeParse(flat).success).toBe(true);
  });

  it("does not unwrap arbitrary data objects lacking hospital", () => {
    const wrapped = {
      review: {
        id: "550e8400-e29b-41d4-a716-446655440002",
      },
    };
    expect(unwrapReviewDetailResponse(wrapped)).toEqual(wrapped);
  });
});
