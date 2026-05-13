import { reviewDetailSchema } from "@/lib/contracts/reviews.schema";
import type { ReviewRequest } from "@/lib/contracts/admin.schema";

/**
 * Maps an admin {@link ReviewRequest} to the public review-detail shape for reuse of
 * {@link ReviewDetailView} (submit payload without moderation metadata).
 */
export function reviewRequestToReviewDetail(request: ReviewRequest) {
  return reviewDetailSchema.parse({
    id: request.id,
    dateTime: request.createdAt,
    state: request.state,
    city: request.city,
    hospital: request.hospital,
    specialty: request.specialty,
    yearOfTraining: request.yearOfTraining,
    yearAtHospital: request.yearAtHospital,
    homeUniversity: request.homeUniversity,
    trainingHospitalChanged: request.trainingHospitalChanged,
    rotations: request.rotations,
    otherRotations: request.otherRotations,
    surgeryRoles: request.surgeryRoles,
    surgeryComplexProcedures: request.surgeryComplexProcedures,
    surgeryTimePercentage: request.surgeryTimePercentage,
    ownDiagnosticsExecution: request.ownDiagnosticsExecution,
    diagnosticsTimePercentage: request.diagnosticsTimePercentage,
    trainingQuality: request.trainingQuality,
    workStructure: request.workStructure,
    averageTrainingTimeYears: request.averageTrainingTimeYears,
    workAtmosphere: request.workAtmosphere,
    weeklyHours: request.weeklyHours,
    contractualHours: request.contractualHours,
    overtimeCompensationType: request.overtimeCompensationType,
    correctOvertimeLogging: request.correctOvertimeLogging,
    onCallShiftsPerMonth: request.onCallShiftsPerMonth,
    gradeTheoreticalKnowledge: request.gradeTheoreticalKnowledge,
    gradePracticalKnowledge: request.gradePracticalKnowledge,
    gradeAtmosphere: request.gradeAtmosphere,
    gradeFacilities: request.gradeFacilities,
    gradeWorkingConditions: request.gradeWorkingConditions,
    gradeFamilyFriendliness: request.gradeFamilyFriendliness,
    totalGrade: request.totalGrade,
    wouldRecommendHospital: request.wouldRecommendHospital,
    textReviewTraining: request.textReviewTraining,
    textReviewApplication: request.textReviewApplication,
  });
}
