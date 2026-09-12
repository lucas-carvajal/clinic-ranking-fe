interface LegalPageShellProps {
  title: string;
  children: React.ReactNode;
}

/** Max-width prose wrapper for `/legal/*` static pages (T21). */
export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="text-foreground mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="page-title mb-8 text-3xl sm:text-4xl">{title}</h1>
      <div className="space-y-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
