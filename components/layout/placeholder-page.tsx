type PlaceholderPageProps = {
  title: string;
  ticket: string;
};

export function PlaceholderPage({ title, ticket }: PlaceholderPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="section-title">{title}</h1>
      <p className="mt-4 text-muted-foreground">
        Diese Seite wird in {ticket} umgesetzt.
      </p>
    </main>
  );
}
