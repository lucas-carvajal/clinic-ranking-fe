/**
 * Placeholder UI for `/app/ranking` (T12). When a backend `/ranking` (or equivalent)
 * exists, replace this with data fetching + table/cards — see legacy reference:
 * `clinic-ranking-frontend/src/routes/app/ranking/+page.svelte` (commented implementation).
 */
export function RankingComingSoon() {
  return (
    <div className="text-foreground mx-auto max-w-full overflow-x-hidden px-3 py-4 md:p-4">
      <h1 className="mb-6 text-3xl font-bold">Krankenhaus Ranking</h1>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 text-6xl" aria-hidden>
          🏗️
        </div>
        <h2 className="mb-3 text-2xl font-semibold text-foreground/90">
          Demnächst verfügbar
        </h2>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          Wir arbeiten fleißig an dieser Funktion. Das Krankenhaus-Ranking wird
          bald hier erscheinen!
        </p>
      </div>
    </div>
  );
}
