"use client";

import { Button } from "@/components/ui/button";
import { computeItems } from "@/lib/domains/reviews/pager/compute-items";

type ReviewsPagerControlsProps = {
  currentPage: number;
  visitedPages: number;
  hasNext: boolean;
  isFetching: boolean;
  onGoToPage: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function ReviewsPagerControls({
  currentPage,
  visitedPages,
  hasNext,
  isFetching,
  onGoToPage,
  onNext,
  onPrev,
}: ReviewsPagerControlsProps) {
  const items = computeItems({ currentPage, visitedPages, hasNext });

  // Hide the pager entirely if there is only one page and no next.
  if (items.length === 1 && !hasNext) return null;

  return (
    <nav
      aria-label="Seitennavigation"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <Button
        type="button"
        variant="outline"
        className="h-12 w-12 bg-surface-lifted text-lg"
        onClick={onPrev}
        disabled={currentPage === 1 || isFetching}
        aria-label="Vorherige Seite"
      >
        ←
      </Button>

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="text-muted-foreground select-none px-1"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={`p-${item.page}`}
            type="button"
            variant={item.page === currentPage ? "default" : "outline"}
            className={
              item.page === currentPage
                ? "h-12 min-w-12 px-3 text-base font-medium"
                : "h-12 min-w-12 bg-surface-lifted px-3 text-base font-medium"
            }
            onClick={() => onGoToPage(item.page)}
            disabled={isFetching && item.page !== currentPage}
            aria-current={item.page === currentPage ? "page" : undefined}
            aria-label={`Seite ${item.page}`}
          >
            {item.page}
          </Button>
        ),
      )}

      <Button
        type="button"
        variant="outline"
        className="h-12 w-12 bg-surface-lifted text-lg"
        onClick={onNext}
        disabled={!hasNext || isFetching}
        aria-label="Nächste Seite"
      >
        →
      </Button>
    </nav>
  );
}
