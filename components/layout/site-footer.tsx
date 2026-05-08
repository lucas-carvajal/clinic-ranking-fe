import Link from "next/link";

const links = [
  { href: "/legal/imprint", label: "Impressum" },
  { href: "/legal/privacy", label: "Datenschutzerklärung" },
  { href: "/legal/terms", label: "AGB" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-8 sm:px-6 lg:px-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
