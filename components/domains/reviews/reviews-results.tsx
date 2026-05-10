"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReviewSummary } from "@/lib/contracts/reviews.schema";
import { useReviewsTable } from "@/lib/domains/reviews/table/useReviewsTable";
import { flexRender } from "@/lib/table/createTable";

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function ReviewsResults({ data }: Readonly<{ data: ReviewSummary[] }>) {
  const router = useRouter();
  const table = useReviewsTable(data);

  return (
    <>
      <div className="space-y-4 md:hidden">
        {data.map((review) => (
          <Link
            key={review.id}
            href={`/app/review/${review.id}`}
            className="border-border bg-surface-lifted shadow-sm block w-full overflow-hidden rounded-lg border p-3 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-foreground">
                  {review.hospital}
                </h3>
                <dl className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-foreground/80">Stadt:</dt>
                    <dd className="truncate">{review.city}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-foreground/80">Fachrichtung:</dt>
                    <dd className="truncate">{review.specialty}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="shrink-0 font-medium text-foreground/80">Datum:</dt>
                    <dd>{formatReviewDate(review.dateTime)}</dd>
                  </div>
                </dl>
              </div>
              <div className="w-12 shrink-0 text-center">
                <div className="text-brand-mint text-xl font-bold">{review.totalGrade}</div>
                <div className="text-muted-foreground text-xs">Note</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="border-border bg-surface-lifted shadow-sm hidden overflow-hidden rounded-md border md:block">
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
              const href = `/app/review/${row.original.id}`;
              return (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="link"
                  aria-label={`Bewertung ${row.original.hospital}: Details anzeigen`}
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
    </>
  );
}
