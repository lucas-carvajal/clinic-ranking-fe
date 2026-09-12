"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const legalLinks = [
  { href: "/legal/imprint", label: "Impressum" },
  { href: "/legal/privacy", label: "Datenschutzerklärung" },
  { href: "/legal/terms", label: "AGB" },
] as const;

export function LegalNavLink({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "text-sm transition-colors duration-200",
        active
          ? "text-foreground font-semibold"
          : "text-ink-utility font-normal hover:text-foreground",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-background mt-auto hidden py-6 md:block">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-8 sm:px-6 lg:px-8">
        {legalLinks.map(({ href, label }) => (
          <LegalNavLink key={href} href={href} label={label} />
        ))}
      </div>
    </footer>
  );
}
