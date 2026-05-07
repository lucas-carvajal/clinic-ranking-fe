import { Button } from "@/components/ui/button";

const landingBlocks = [
  {
    title: "Weiterbildung sichtbar machen",
    body: "Dummy-Text für den ersten Inhaltsblock. Hier steht später, wie Erfahrungsberichte Assistenzärzten bei der Orientierung helfen.",
    button: "Ranking ansehen",
  },
  {
    title: "Eigene Erfahrung teilen",
    body: "Dummy-Text für den zweiten Inhaltsblock. Dieser Bereich erklärt später, wie Ärztinnen und Ärzte ihre Weiterbildung fair bewerten können.",
    button: "Bewertung abgeben",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-10">
      <section className="max-w-4xl">
        <h1 className="page-title">Das Assistenz Arzt Ranking</h1>
        <h2 className="mt-6 text-2xl leading-tight font-medium text-foreground sm:text-4xl">
          <span className="block">Ärzte helfen Ärzten</span>
          <span className="block">Für eine faire Facharztweiterbildung</span>
        </h2>
        <div className="mint-accent-bar mt-10" />
      </section>

      <section
        aria-label="Landing page content"
        className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {landingBlocks.map((block) => (
          <article
            key={block.title}
            className="flex min-h-64 flex-col justify-between rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
          >
            <div>
              <h3 className="section-title">{block.title}</h3>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                {block.body}
              </p>
            </div>
            <Button className="mt-8 w-fit">{block.button}</Button>
          </article>
        ))}
      </section>
    </main>
  );
}
