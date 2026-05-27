"use client";

import { useMemo } from "react";

import type { ReviewRequestSummary } from "@/lib/contracts/admin.schema";
import { adminReviewRequestColumns } from "@/lib/domains/admin/review-requests/table/columns";
import { getCoreRowModel, useReactTable } from "@/lib/table/createTable";

export function useAdminReviewRequestsTable(data: ReviewRequestSummary[]) {
  const columns = useMemo(() => adminReviewRequestColumns, []);

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
  });
}
