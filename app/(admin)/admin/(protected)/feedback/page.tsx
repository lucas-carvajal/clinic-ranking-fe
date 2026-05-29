import Link from "next/link";

import { AdminFeedbackCardList } from "@/components/domains/admin/feedback/admin-feedback-card-list";
import { adminFeedbackListResponseSchema } from "@/lib/contracts/admin.schema";
import { serverGet } from "@/lib/api/server";

export default async function AdminFeedbackPage() {
  const data = await serverGet("/admin/feedback?page=1&page_size=20", {
    responseSchema: adminFeedbackListResponseSchema,
  });

  return (
    <div className="text-foreground max-w-3xl">
      <nav className="text-muted-foreground mb-4 text-sm">
        <Link href="/admin" className="hover:text-foreground underline-offset-4 hover:underline">
          Admin
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">Feedback</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
        {data.pagination.totalItems > 0 && (
          <p className="text-muted-foreground mt-1 text-sm">
            {data.pagination.totalItems} Einträge insgesamt
          </p>
        )}
      </header>

      <AdminFeedbackCardList
        initialItems={data.data}
        initialPagination={data.pagination}
      />
    </div>
  );
}
