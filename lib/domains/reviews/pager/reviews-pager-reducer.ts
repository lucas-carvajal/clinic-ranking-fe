/**
 * Reducer for the reviews pager context.
 *
 * State holds the cursor needed to fetch each page of the current filter set:
 *   - `cursors[0]` is always `null` (page 1, no cursor)
 *   - `cursors[i]` is the cursor required to fetch page `i + 1`
 *   - `filtersKey` is a stable string for the current filter combination so we
 *     can detect filter changes and discard the cursor list.
 */

export type ReviewsPagerState = {
  cursors: (string | null)[];
  /** `null` means uninitialized — first effect tick will populate it. */
  filtersKey: string | null;
};

export type ReviewsPagerAction =
  | { type: "RESET"; filtersKey: string }
  | { type: "SET_CURSOR_AT"; pageIndex: number; cursor: string };

export const initialReviewsPagerState: ReviewsPagerState = {
  cursors: [null],
  filtersKey: null,
};

export function reviewsPagerReducer(
  state: ReviewsPagerState,
  action: ReviewsPagerAction,
): ReviewsPagerState {
  switch (action.type) {
    case "RESET": {
      if (state.filtersKey === action.filtersKey && state.cursors.length === 1) {
        return state;
      }
      return { cursors: [null], filtersKey: action.filtersKey };
    }
    case "SET_CURSOR_AT": {
      const { pageIndex, cursor } = action;
      if (pageIndex < 1) return state;
      if (state.cursors[pageIndex] === cursor) return state;
      const next = state.cursors.slice();
      while (next.length < pageIndex) next.push(null);
      next[pageIndex] = cursor;
      return { ...state, cursors: next };
    }
    default:
      return state;
  }
}
