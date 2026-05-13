import { describe, expect, it } from "vitest";

import {
  reviewRequestSchema,
  reviewRequestsResponseSchema,
} from "@/lib/contracts/admin.schema";

describe("admin contracts", () => {
  it("parses paginated review-request list", () => {
    const parsed = reviewRequestsResponseSchema.parse({
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440010",
          requestStatus: "SUBMITTED",
          dateTime: "2026-05-07T14:32:11.000Z",
          state: "Bayern",
          city: "Muenchen",
          hospital: "Klinikum A",
          specialty: "Innere Medizin",
          totalGrade: 3,
          extra: "ignored",
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    });

    expect(parsed.data[0].requestStatus).toBe("SUBMITTED");
  });

  it("parses list dateTime with numeric timezone offset (Go default JSON)", () => {
    const parsed = reviewRequestsResponseSchema.parse({
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440010",
          requestStatus: "SUBMITTED",
          dateTime: "2026-05-07T14:32:11.000+02:00",
          state: "Bayern",
          city: "Muenchen",
          hospital: "Klinikum A",
          specialty: "Innere Medizin",
          totalGrade: 3,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    });

    expect(parsed.data[0].dateTime).toBe("2026-05-07T14:32:11.000+02:00");
  });

  it("parses full review request shape", () => {
    const parsed = reviewRequestSchema.parse({
      id: "550e8400-e29b-41d4-a716-446655440011",
      createdAt: "2026-05-07T14:32:11.000Z",
      updatedAt: "2026-05-07T14:33:11.000Z",
      requestStatus: "EMAIL_VERIFIED",
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
      publishAtDate: null,
      email: "doctor@example.com",
      extra: "ignored",
    });

    expect(parsed.email).toBe("doctor@example.com");
  });

  it("fails when status is invalid", () => {
    expect(() =>
      reviewRequestSchema.parse({
        id: "550e8400-e29b-41d4-a716-446655440011",
        createdAt: "2026-05-07T14:32:11.000Z",
        updatedAt: "2026-05-07T14:33:11.000Z",
        requestStatus: "UNKNOWN",
      }),
    ).toThrow();
  });
});
