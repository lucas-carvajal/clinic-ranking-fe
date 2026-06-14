import type { ReviewSubmit } from "@/lib/contracts/submit.schema";
import type { ReviewFormState } from "./schema";

/**
 * Maps the UI form state to the backend ReviewSubmit payload.
 *
 * Responsibilities:
 * - Flattens nested surgery/diagnostics objects.
 * - Renames ownExecution → ownDiagnosticsExecution.
 * - Sets surgery/diagnostics fields to the "unknown" sentinel (-1) when the
 *   corresponding rotation is absent.
 * - Converts null numerics to the backend "unknown" sentinel (-1). The backend
 *   uses -1 (not 0) for "not provided" because 0 is a legitimate value for
 *   fields like onCallShiftsPerMonth and the OP/diagnostics time percentages.
 *   Grades are the exception: null → 0, which the contract's min(1) rejects.
 * - Converts null booleans to false (Go bool zero value).
 * - Converts publishAtDate "YYYY-MM-DD" → RFC-3339 UTC timestamp; null → null.
 * - Converts empty overtimeCompensationType → null (Go *string omitempty).
 * - Drops acceptedTerms (UI-only; not part of the backend contract).
 */
export function toReviewApiPayload(form: ReviewFormState): ReviewSubmit {
  const surgerySelected = form.rotations.includes("surgery");
  const diagnosticsSelected = form.rotations.includes("functionaldiagnostics");

  return {
    // Step 1
    state: form.state,
    city: form.city,
    hospital: form.hospital,
    specialty: form.specialty,
    isCustomState: form.isCustomState,
    isCustomCity: form.isCustomCity,
    isCustomHospital: form.isCustomHospital,
    isCustomSpecialty: form.isCustomSpecialty,

    // Step 2 — null ints default to the "unknown" sentinel (-1)
    yearOfTraining: form.yearOfTraining ?? -1,
    yearAtHospital: form.yearAtHospital ?? -1,
    homeUniversity: form.homeUniversity,
    trainingHospitalChanged: form.trainingHospitalChanged ?? false,

    // Step 3
    // ReviewFormState stores string[] while ReviewSubmit expects enum arrays.
    // Runtime validation via reviewSubmitSchema.parse() enforces correctness.
    rotations: form.rotations as ReviewSubmit["rotations"],
    // Clear free-text when the misc rotation is not selected
    otherRotations: form.rotations.includes("misc") ? form.otherRotations : "",
    surgeryRoles: (surgerySelected ? form.surgery.surgeryRoles : []) as ReviewSubmit["surgeryRoles"],
    surgeryComplexProcedures: surgerySelected ? form.surgery.surgeryComplexProcedures : false,
    // -1 ("unknown") when surgery wasn't selected, or selected but left blank
    surgeryTimePercentage: surgerySelected ? (form.surgery.surgeryTimePercentage ?? -1) : -1,
    ownDiagnosticsExecution: diagnosticsSelected ? form.diagnostics.ownExecution : false,
    diagnosticsTimePercentage: diagnosticsSelected
      ? (form.diagnostics.diagnosticsTimePercentage ?? -1)
      : -1,

    // Step 4
    trainingQuality: form.trainingQuality as ReviewSubmit["trainingQuality"],
    workStructure: form.workStructure as ReviewSubmit["workStructure"],
    averageTrainingTimeYears: form.averageTrainingTimeYears ?? -1,
    workAtmosphere: form.workAtmosphere as ReviewSubmit["workAtmosphere"],

    // Step 5
    weeklyHours: form.weeklyHours ?? -1,
    contractualHours: form.contractualHours ?? -1,
    // empty string → null so Go *string omitempty works correctly
    overtimeCompensationType: form.overtimeCompensationType || null,
    correctOvertimeLogging: form.correctOvertimeLogging,
    onCallShiftsPerMonth: form.onCallShiftsPerMonth ?? -1,

    // Step 6 — null grades map to 0; reviewSubmitSchema min(1) will catch this
    gradeTheoreticalKnowledge: form.gradeTheoreticalKnowledge ?? 0,
    gradePracticalKnowledge: form.gradePracticalKnowledge ?? 0,
    gradeAtmosphere: form.gradeAtmosphere ?? 0,
    gradeFacilities: form.gradeFacilities ?? 0,
    gradeWorkingConditions: form.gradeWorkingConditions ?? 0,
    gradeFamilyFriendliness: form.gradeFamilyFriendliness ?? 0,
    totalGrade: form.totalGrade ?? 0,

    // Step 7
    wouldRecommendHospital: form.wouldRecommendHospital,
    textReviewTraining: form.textReviewTraining,
    textReviewApplication: form.textReviewApplication,
    // Single conversion point: "YYYY-MM-DD" → UTC midnight RFC-3339 timestamp
    publishAtDate: form.publishAtDate ? new Date(form.publishAtDate).toISOString() : null,
    email: form.email,
    // acceptedTerms intentionally omitted — UI-only consent field
  };
}
