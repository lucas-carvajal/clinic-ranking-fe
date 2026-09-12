"use client";

import { computeItems } from "@/lib/domains/reviews/pager/compute-items";
import { cn } from "@/lib/utils";

type ReviewsPagerControlsProps = {
  currentPage: number;
  visitedPages: number;
  hasNext: boolean;
  isFetching: boolean;
  onGoToPage: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

const pagerLinkClass =
  "cursor-pointer text-[15px] transition-colors duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40";

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
      className="mt-10 flex items-center justify-center gap-6"
    >
      <button
        type="button"
        className={cn(
          pagerLinkClass,
          "text-ink-utility font-semibold hover:text-foreground",
        )}
        onClick={onPrev}
        disabled={currentPage === 1 || isFetching}
        aria-label="Vorherige Seite"
      >
        Zurück
      </button>

      <div className="flex items-center gap-4">
        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="text-ink-muted select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={`p-${item.page}`}
              type="button"
              className={cn(
                pagerLinkClass,
                item.page === currentPage
                  ? "text-foreground font-extrabold"
                  : "text-ink-utility font-semibold hover:text-foreground",
              )}
              onClick={() => onGoToPage(item.page)}
              disabled={isFetching && item.page !== currentPage}
              aria-current={item.page === currentPage ? "page" : undefined}
              aria-label={`Seite ${item.page}`}
            >
              {item.page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={cn(
          pagerLinkClass,
          "text-ink-utility font-semibold hover:text-foreground",
        )}
        onClick={onNext}
        disabled={!hasNext || isFetching}
        aria-label="Nächste Seite"
      >
        Weiter
      </button>
    </nav>
  );
}
