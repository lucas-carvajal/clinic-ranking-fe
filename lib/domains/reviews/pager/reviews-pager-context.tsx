"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  initialReviewsPagerState,
  reviewsPagerReducer,
  type ReviewsPagerState,
} from "@/lib/domains/reviews/pager/reviews-pager-reducer";

type ContextValue = {
  state: ReviewsPagerState;
  reset: (filtersKey: string) => void;
  setCursorAt: (pageIndex: number, cursor: string) => void;
};

const ReviewsPagerContext = createContext<ContextValue | null>(null);

export function ReviewsPagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reviewsPagerReducer, initialReviewsPagerState);

  const reset = useCallback((filtersKey: string) => {
    dispatch({ type: "RESET", filtersKey });
  }, []);

  const setCursorAt = useCallback((pageIndex: number, cursor: string) => {
    dispatch({ type: "SET_CURSOR_AT", pageIndex, cursor });
  }, []);

  const value = useMemo(
    () => ({ state, reset, setCursorAt }),
    [state, reset, setCursorAt],
  );

  return (
    <ReviewsPagerContext.Provider value={value}>{children}</ReviewsPagerContext.Provider>
  );
}

export function useReviewsPagerContext(): ContextValue {
  const ctx = useContext(ReviewsPagerContext);
  if (!ctx) {
    throw new Error(
      "useReviewsPagerContext must be used within a <ReviewsPagerProvider>",
    );
  }
  return ctx;
}
