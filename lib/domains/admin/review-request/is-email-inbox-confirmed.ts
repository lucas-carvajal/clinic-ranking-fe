import type { ReviewRequestStatus } from "@/lib/contracts/submit.schema";

/** True after the reviewer opened a valid verify link (or an equivalent status). */
export function isEmailInboxConfirmed(status: ReviewRequestStatus): boolean {
  switch (status) {
    case "EMAIL_VERIFIED":
    case "AFFILIATION_VERIFIED":
    case "APPROVED":
    case "PUBLISHED":
      return true;
    case "SUBMITTED":
    case "REJECTED":
      return false;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
