import { redirect } from "next/navigation";

/** `/admin` is not a standalone screen; send admins straight to the main queue. */
export default function AdminIndexRedirect() {
  redirect("/admin/review-requests");
}
