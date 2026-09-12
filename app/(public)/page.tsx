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
    numeral: "I.",
    emoji: "🤝",
    title: "Helfe anderen die richtige Entscheidung zu treffen",
    body: "Berichte von deiner Facharztweiterbildung und hilf in fünf Minuten anderen Ärztinnen und Ärzten bei der Wahl der Weiterbildung.",
  },
  {
    numeral: "II.",
    emoji: "😍",
    title: "Finde das richtige Krankenhaus",
    body: "Informiere dich, wo du die nächsten Jahre verbringst und dich für deinen Facharzt ausbilden lässt.",
  },
] as const;

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <article className="mx-auto w-full max-w-xl px-6 py-20 sm:px-8 sm:py-28">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          Das Assistenz Arzt Ranking
        </h1>
        <p className="text-foreground mt-4 text-lg leading-relaxed">
          Ärzte helfen Ärzten.{" "}
          <em className="italic">Für eine faire Facharztweiterbildung.</em>
        </p>

        <section aria-label="Landing page content" className="mt-12 space-y-8">
          {landingSections.map((section) => (
            <div key={section.title} className="flex gap-4">
              <span className="text-ink-muted w-6 shrink-0 pt-0.5 text-sm" aria-hidden>
                {section.numeral}
              </span>
              <div>
                <h2 className="text-foreground font-semibold">
                  <span
                    className="mr-2 inline-block text-2xl leading-none align-[-0.15em]"
                    aria-hidden
                  >
                    {section.emoji}
                  </span>
                  {section.title}
                </h2>
                <p className="text-foreground/80 mt-2 leading-relaxed">{section.body}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button asChild variant="brand" className="h-10 px-5 text-[15px]">
            <Link href="/app/submit">Jetzt bewerten</Link>
          </Button>
          <Button asChild variant="link" className="text-[15px]">
            <Link href="/app/reviews">Bewertungen ansehen</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
