"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/review-requests", label: "Bewertungsanfragen" },
  { href: "/admin/feedback", label: "Feedback" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="border-border bg-card flex w-64 shrink-0 flex-col border-r p-4"
      aria-label="Administration"
    >
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-foreground text-xl font-bold transition-colors hover:text-brand-red"
        >
          Admin
        </Link>
      </div>
      <nav className="space-y-1">
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
    </aside>
  );
}
