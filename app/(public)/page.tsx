import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Startseite",
  description:
    "Das Assistenz Arzt Ranking: Finde das richtige Krankenhaus für deine Facharztweiterbildung und teile deine Erfahrungen mit anderen Ärzten.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Assistenz Arzt Ranking",
    description:
      "Ärzte helfen Ärzten: Finde das richtige Krankenhaus für deine Facharztweiterbildung.",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "Assistenz Arzt Ranking",
    description:
      "Ärzte helfen Ärzten: Finde das richtige Krankenhaus für deine Facharztweiterbildung.",
  },
};

const landingSections = [
  {
    title: "Helfe anderen die richtige Entscheidung zu treffen",
    body: "Berichte von deiner Facharztweiterbildung und hilf in fünf Minuten anderen Ärztinnen und Ärzten bei der Wahl der Weiterbildung.",
  },
  {
    title: "Finde das richtige Krankenhaus",
    body: "Informiere dich, wo du die nächsten Jahre verbringst und dich für deinen Facharzt ausbilden lässt.",
  },
] as const;

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <article className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 sm:px-8 sm:py-24">
        <p className="landing-kicker">Ärzte helfen Ärzten</p>
        <h1 className="page-title mt-4">Das Assistenz Arzt Ranking</h1>
        <p className="text-ink-utility font-serif mt-6 text-xl leading-relaxed sm:text-2xl">
          Für eine faire Facharztweiterbildung.
        </p>

        <section aria-label="Landing page content" className="mt-16 space-y-12">
          {landingSections.map((section) => (
            <div key={section.title}>
              <h2 className="section-title">{section.title}</h2>
              <p className="text-ink-utility font-serif mt-3 text-lg leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </section>

        <div className="mt-14 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            asChild
            variant="brand"
            size="lg"
            className="h-12 w-full px-8 text-base sm:h-14 sm:w-auto sm:min-w-48 sm:px-10 sm:text-lg"
          >
            <Link href="/app/submit">Jetzt bewerten</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 w-full px-8 text-base sm:h-14 sm:w-auto sm:min-w-48 sm:px-10 sm:text-lg"
          >
            <Link href="/app/reviews">Bewertungen ansehen</Link>
          </Button>
        </div>
      </article>

      <aside className="bg-muted text-ink-utility mt-auto px-6 py-10 text-center text-sm leading-relaxed sm:px-8">
        Über 5000 Ärztinnen und Ärzte nutzen diese Berichte bei der Wahl ihrer
        Weiterbildung.
      </aside>
    </main>
  );
}
