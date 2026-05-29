"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/review-requests", label: "Bewertungsanfragen" },
  { href: "/admin/feedback", label: "Feedback" },
] as const;

export function AdminHeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin-Navigation" className="flex items-center gap-6">
      {navItems.map((item) => {
        const active =
          item.href === "/admin/review-requests"
            ? pathname.startsWith("/admin/review-requests") ||
              pathname.startsWith("/admin/review-request/")
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-foreground/80 hover:text-foreground",
            )}
          >
            {item.label}
            {active ? (
              <span className="bg-brand-red absolute -bottom-1 left-0 h-0.5 w-full rounded-full" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
