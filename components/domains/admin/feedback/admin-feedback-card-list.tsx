"use client";

import { useState } from "react";

import { AdminFeedbackCard } from "@/components/domains/admin/feedback/admin-feedback-card";
import { Button } from "@/components/ui/button";
import { CenteredSpinner } from "@/components/ui/spinner";
import {
  adminFeedbackListResponseSchema,
  type AdminFeedback,
} from "@/lib/contracts/admin.schema";
import type { OffsetPagination } from "@/lib/contracts/pagination.schema";

const PAGE_SIZE = 20;

type Props = {
  initialItems: AdminFeedback[];
  initialPagination: OffsetPagination;
};

export function AdminFeedbackCardList({ initialItems, initialPagination }: Props) {
  const [items, setItems] = useState<AdminFeedback[]>(initialItems);
  const [pagination, setPagination] = useState<OffsetPagination>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    setLoading(true);
    setError(null);
    try {
      const nextPage = pagination.page + 1;
      const url = `/api/proxy/admin/feedback?page=${nextPage}&page_size=${PAGE_SIZE}`;
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) {
        throw new Error(`Fehler beim Laden (${res.status})`);
      }
      const json = await res.json();
      const parsed = adminFeedbackListResponseSchema.parse(json);
      setItems((prev) => [...prev, ...parsed.data]);
      setPagination(parsed.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        Kein Feedback vorhanden.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {items.map((fb) => (
          <AdminFeedbackCard key={fb.id} feedback={fb} />
        ))}
      </div>

      {error && (
        <p className="text-destructive mt-4 text-center text-sm" role="alert">
          {error}
        </p>
      )}

      {pagination.hasNext && (
        <div className="mt-6 flex justify-center">
          {loading ? (
            <CenteredSpinner label="Lade weitere Einträge…" />
          ) : (
            <Button type="button" variant="outline" onClick={loadMore}>
              Mehr laden
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
