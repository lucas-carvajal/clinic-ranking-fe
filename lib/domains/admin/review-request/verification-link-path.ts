/** Admin generate. Existing `/admin/review-requests/:id/…` prefix. */
export function adminVerificationLinkPath(id: string): string {
  return `/admin/review-requests/${id}/verification-link`;
}
