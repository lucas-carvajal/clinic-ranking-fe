"use client";

import { useMemo } from "react";

import type { ReviewSummary } from "@/lib/contracts/reviews.schema";
import { reviewColumns } from "@/lib/domains/reviews/table/columns";
import { getCoreRowModel, useReactTable } from "@/lib/table/createTable";

export function useReviewsTable(data: ReviewSummary[]) {
  const columns = useMemo(() => reviewColumns, []);

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });
}
