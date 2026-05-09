import { describe, expect, it } from "vitest";

import {
  reviewDetailSchema,
  reviewSubmitResponseSchema,
  reviewsListResponseSchema,
} from "@/lib/contracts/reviews.schema";

describe("reviews contracts", () => {
  it("parses paginated review list", () => {
    const parsed = reviewsListResponseSchema.parse({
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          dateTime: "2026-05-07T14:32:11.000Z",
          state: "Bayern",
          city: "Muenchen",
          hospital: "Klinikum A",
          specialty: "Innere Medizin",
          totalGrade: 3,
          extraField: "ignored",
        },
      ],
      pagination: {
        pageSize: 20,
        hasNext: false,
      },
    });

    expect(parsed.data[0].city).toBe("Muenchen");
    expect(parsed.pagination.nextCursor).toBeUndefined();
  });

  it("accepts Go-style datetimes with numeric timezone offset", () => {
    const parsed = reviewsListResponseSchema.parse({
      data: [
        {
          id: "0078adf4-e623-4115-a4e2-e009f7d7f218",
          dateTime: "2026-01-27T20:57:20.216975+01:00",
          state: "Bayern",
          city: "München",
          hospital: "Test",
          specialty: "Biochemie",
          totalGrade: 2,
        },
      ],
      pagination: {
        nextCursor: "abc",
        pageSize: 20,
        hasNext: true,
      },
    });

    expect(parsed.data[0].dateTime).toContain("+01:00");
  });

  it("parses review detail and create response", () => {
    const detail = reviewDetailSchema.parse({
      id: "550e8400-e29b-41d4-a716-446655440001",
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
      unknown: "ignored",
    });
    expect(detail.id).toBe("550e8400-e29b-41d4-a716-446655440001");

    expect(
      reviewSubmitResponseSchema.parse({
        id: "550e8400-e29b-41d4-a716-446655440002",
        createdAt: "2026-05-07T14:32:11.000Z",
      }).id,
    ).toBe("550e8400-e29b-41d4-a716-446655440002");
  });

  it("fails on invalid review list payload", () => {
    expect(() =>
      reviewsListResponseSchema.parse({
        data: [{ dateTime: "2026-05-07T14:32:11.000Z" }],
        pagination: { pageSize: 20, hasNext: true },
      }),
    ).toThrow();
  });
});
