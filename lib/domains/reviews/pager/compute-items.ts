/**
 * Pure function: given the current page, the number of pages we have cursors for,
 * and whether the API says there's another page beyond the frontier, return the
 * list of buttons + ellipses to render in the pager.
 *
 * - We always show page 1.
 * - We always show the last reachable page (= visitedPages, or visitedPages + 1
 *   when sitting at the frontier with `hasNext`).
 * - We show a window of {currentPage - 1, currentPage, currentPage + 1}
 *   (clamped to the reachable range).
 * - Gaps between rendered pages collapse into a single "…" ellipsis.
 */
export type PagerItem = "ellipsis" | { page: number };

export function computeReachableLastPage(
  currentPage: number,
  visitedPages: number,
  hasNext: boolean,
): number {
  const isFrontier = currentPage === visitedPages;
  return visitedPages + (isFrontier && hasNext ? 1 : 0);
}

export function computeItems({
  currentPage,
  visitedPages,
  hasNext,
}: {
  currentPage: number;
  visitedPages: number;
  hasNext: boolean;
}): PagerItem[] {
  const lastPage = computeReachableLastPage(currentPage, visitedPages, hasNext);
  if (lastPage <= 1) return [{ page: 1 }];

  const set = new Set<number>([1, lastPage]);
  for (let p = currentPage - 1; p <= currentPage + 1; p += 1) {
    if (p >= 1 && p <= lastPage) set.add(p);
  }

  const sorted = [...set].sort((a, b) => a - b);
  const items: PagerItem[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    items.push({ page: sorted[i] });
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      items.push("ellipsis");
    }
  }
  return items;
}
