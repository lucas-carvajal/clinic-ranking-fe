import { useCallback, useMemo, useRef, useState } from "react";

export type CursorPaginationState = {
  cursor?: string;
};

export type CursorPaginationUpdate = {
  cursor?: string;
  replace?: boolean;
};

export type InvalidCursorResolution = {
  didReset: boolean;
  message?: string;
};

type Options = {
  cursor?: string;
  isCursorLikelyValid?: (cursor: string) => boolean;
};

/**
 * Cursor pagination helper for forward-only cursor chains.
 *
 * - Keeps an in-memory visited cursor stack for "previous page" within the session.
 * - Does not persist the visited stack to the URL (shareable state stays in URL).
 * - Signals invalid cursor so callers can reset URL state and show a recoverable message.
 */
export function useCursorPagination(options: Options) {
  const cursor = options.cursor;
  const isCursorLikelyValid = options.isCursorLikelyValid;

  const visitedRef = useRef<string[]>([]);
  const [canGoPrev, setCanGoPrev] = useState(false);

  const resolveInvalidCursor = useCallback((): InvalidCursorResolution => {
    if (!cursor) {
      return { didReset: false };
    }

    const isValid = isCursorLikelyValid ? isCursorLikelyValid(cursor) : true;
    if (isValid) {
      return { didReset: false };
    }

    return {
      didReset: true,
      message: "Der Seitenzeiger ist ungültig oder abgelaufen. Du bist wieder auf Seite 1.",
    };
  }, [cursor, isCursorLikelyValid]);

  const goPrev = useCallback((): CursorPaginationUpdate | null => {
    if (visitedRef.current.length === 0) {
      return null;
    }

    const prevCursor = visitedRef.current.pop();
    setCanGoPrev(visitedRef.current.length > 0);
    return { cursor: prevCursor, replace: true };
  }, []);

  const goNext = useCallback(
    (nextCursor?: string | null): CursorPaginationUpdate | null => {
      if (!nextCursor) {
        return null;
      }

      if (cursor) {
        visitedRef.current.push(cursor);
        setCanGoPrev(true);
      }

      return { cursor: nextCursor };
    },
    [cursor],
  );

  const reset = useCallback((): CursorPaginationUpdate => {
    visitedRef.current.length = 0;
    setCanGoPrev(false);
    return { cursor: undefined, replace: true };
  }, []);

  return useMemo(
    () => ({
      cursor,
      canGoPrev,
      goPrev,
      goNext,
      reset,
      resolveInvalidCursor,
    }),
    [cursor, canGoPrev, goPrev, goNext, reset, resolveInvalidCursor],
  );
}

