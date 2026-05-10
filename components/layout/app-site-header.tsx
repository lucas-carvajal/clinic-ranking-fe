"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/app/reviews", label: "Alle Bewertungen" },
  { href: "/app/ranking", label: "Das Ranking" },
  { href: "/app/feedback", label: "Feedback" },
] as const;

function isHeaderNavPath(path: string): boolean {
  return navLinks.some(({ href }) => path === href || path.startsWith(`${href}/`));
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative text-base font-medium transition-colors duration-200",
        active ? "text-foreground" : "text-foreground/80 hover:text-foreground",
      )}
    >
      {label}
      {active ? (
        <span className="bg-brand-red absolute -bottom-1 left-0 h-0.5 w-full rounded-full" />
      ) : null}
    </Link>
  );
}

const HEART_PULSE_MS = 600;

export function AppSiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);
  const pulseClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathnameRef = useRef<string | null>(null);
  const prevMobileOpenRef = useRef<boolean | null>(null);

  /** Toggle pulse class briefly so CSS `@keyframes` re-run (Svelte Navbar parity); avoids hydrate issues from a permanently-mounted animation class. */
  const pulseHeart = useCallback(() => {
    if (pulseClearRef.current) clearTimeout(pulseClearRef.current);
    setHeartPulsing(true);
    pulseClearRef.current = setTimeout(() => {
      setHeartPulsing(false);
      pulseClearRef.current = null;
    }, HEART_PULSE_MS);
  }, []);

  useEffect(() => {
    // Defer so the linter allows it and the pulse runs after first paint / hydration settles.
    const id = window.setTimeout(() => {
      pulseHeart();
    }, 0);
    return () => {
      window.clearTimeout(id);
      if (pulseClearRef.current) clearTimeout(pulseClearRef.current);
    };
  }, [pulseHeart]);

  /** Pulse when switching between main header destinations (reviews / ranking / feedback). */
  useEffect(() => {
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (prevPathnameRef.current === pathname) return;
    const previous = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    if (isHeaderNavPath(previous) && isHeaderNavPath(pathname)) {
      pulseHeart();
    }
  }, [pathname, pulseHeart]);

  /** Pulse when the mobile sandwich menu opens or closes. */
  useEffect(() => {
    if (prevMobileOpenRef.current === null) {
      prevMobileOpenRef.current = mobileOpen;
      return;
    }
    if (prevMobileOpenRef.current !== mobileOpen) {
      prevMobileOpenRef.current = mobileOpen;
      pulseHeart();
    }
  }, [mobileOpen, pulseHeart]);

  return (
    <>
      <header className="border-border bg-background/95 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-sm">
        <nav
          aria-label="Hauptnavigation"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-foreground flex items-center gap-2 text-xl font-bold"
              onClick={pulseHeart}
            >
              <span
                className={cn("text-2xl", heartPulsing && "heart-pulse")}
                aria-hidden
              >
                ❤️
              </span>
            </Link>
            <div className="hidden items-center gap-10 md:flex">
              {navLinks.map(({ href, label }) => (
                <NavLink key={href} href={href} label={label} />
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <Button
              asChild
              size="lg"
              className="h-auto min-h-11 px-5 text-base font-medium md:text-lg md:px-6"
            >
              <Link href="/app/submit">Bewerten</Link>
            </Button>
          </div>
          <button
            type="button"
            className="text-foreground hover:bg-muted md:hidden rounded-lg p-2 transition"
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {mobileOpen ? (
        <div
          className="bg-background fixed inset-0 z-40 flex flex-col items-center justify-center px-6 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="text-foreground hover:bg-muted absolute top-4 right-4 rounded-lg p-2"
            aria-label="Menü schließen"
            onClick={() => setMobileOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="max-w-sm space-y-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-center text-3xl font-bold text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <hr className="border-border border-t" />
            <Button
              asChild
              size="lg"
              className="h-auto min-h-11 w-full px-6 py-3.5 text-lg font-medium"
            >
              <Link href="/app/submit" onClick={() => setMobileOpen(false)}>
                Bewerten
              </Link>
            </Button>
          </div>
        </div>
      ) : null}

      <div className="h-16 shrink-0" aria-hidden />
    </>
  );
}
