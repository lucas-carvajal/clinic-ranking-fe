"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OffsetPagination } from "@/lib/contracts/pagination.schema";
import type { AdminFeedback } from "@/lib/contracts/admin.schema";
import {
  adminFeedbackUrlNeedsCoercion,
  buildAdminFeedbackHref,
  type AdminFeedbackUrlParams,
} from "@/lib/domains/admin/feedback/feedback-url";
import { useAdminFeedbackTable } from "@/lib/domains/admin/feedback/table/use-admin-feedback-table";
import { flexRender } from "@/lib/table/createTable";

type AdminFeedbackTableProps = {
  rows: AdminFeedback[];
  pagination: OffsetPagination;
  urlParams: AdminFeedbackUrlParams;
};

export function AdminFeedbackTable({
  rows,
  pagination,
  urlParams,
}: Readonly<AdminFeedbackTableProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const table = useAdminFeedbackTable(rows);

  const urlKey = searchParams.toString();
  const needsCoercion = useMemo(() => {
    const sp = new URLSearchParams(urlKey);
    return adminFeedbackUrlNeedsCoercion(sp, urlParams);
  }, [urlKey, urlParams]);

  useLayoutEffect(() => {
    if (needsCoercion) {
      router.replace(buildAdminFeedbackHref(urlParams), { scroll: false });
    }
  }, [needsCoercion, router, urlParams]);

  const goToPage = (page: number) => {
    router.push(buildAdminFeedbackHref({ page, pageSize: urlParams.pageSize }));
  };

  const showPager = pagination.totalPages > 1 || pagination.hasNext || pagination.hasPrev;

  return (
    <div className="text-foreground max-w-7xl">
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
        <p className="text-muted-foreground mt-1 text-sm">
          Seite {pagination.page} von {Math.max(pagination.totalPages, 1)}
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">Kein Feedback vorhanden.</p>
      ) : (
        <div className="border-border bg-surface-lifted overflow-hidden rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const href = `/admin/feedback/${row.original.id}`;
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    tabIndex={0}
                    role="link"
                    aria-label={`Feedback von ${row.original.email || "unbekannt"}: Details`}
                    onClick={() => router.push(href)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(href);
                      }
                    }}
                    onMouseEnter={() => router.prefetch(href)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {showPager ? (
        <nav
          aria-label="Seitennavigation"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-10 bg-surface-lifted"
            onClick={() => goToPage(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            aria-label="Vorherige Seite"
          >
            ←
          </Button>
          <span className="text-muted-foreground px-2 text-sm tabular-nums">
            {pagination.page} / {Math.max(pagination.totalPages, 1)}
          </span>
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-10 bg-surface-lifted"
            onClick={() => goToPage(pagination.page + 1)}
            disabled={!pagination.hasNext}
            aria-label="Nächste Seite"
          >
            →
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
