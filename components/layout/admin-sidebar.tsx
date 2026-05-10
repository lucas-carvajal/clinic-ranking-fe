"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/review-requests", label: "Bewertungsanfragen" },
  { href: "/admin/feedback", label: "Feedback" },
] as const;

/** Nav links only — shell (`AdminShell`) wraps this + logout in the `<aside>`. */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/review-requests"
          className="text-foreground text-xl font-bold transition-colors hover:text-brand-red"
        >
          Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1">
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
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-foreground/90 hover:bg-muted/80",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
