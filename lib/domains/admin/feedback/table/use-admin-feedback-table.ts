"use client";

import { useMemo } from "react";

import type { AdminFeedback } from "@/lib/contracts/admin.schema";
import { adminFeedbackColumns } from "@/lib/domains/admin/feedback/table/columns";
import { getCoreRowModel, useReactTable } from "@/lib/table/createTable";

export function useAdminFeedbackTable(data: AdminFeedback[]) {
  const columns = useMemo(() => adminFeedbackColumns, []);

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
  });
}
