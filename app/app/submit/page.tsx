import type { Metadata } from "next";

import { SubmitForm } from "@/components/domains/submit/submit-form";

export const metadata: Metadata = {
  title: "Bewertung abgeben",
  description:
    "Teile deine Erfahrungen aus der Facharztweiterbildung in wenigen Schritten und hilf anderen Ärzten bei der Wahl des richtigen Krankenhauses.",
  alternates: { canonical: "/app/submit" },
  openGraph: {
    title: "Bewertung abgeben | Assistenz Arzt Ranking",
    description:
      "Teile deine Erfahrungen aus der Facharztweiterbildung in wenigen Schritten und hilf anderen Ärzten bei der Wahl des richtigen Krankenhauses.",
    url: "/app/submit",
    type: "website",
  },
  twitter: {
    title: "Bewertung abgeben | Assistenz Arzt Ranking",
    description:
      "Teile deine Erfahrungen aus der Facharztweiterbildung in wenigen Schritten und hilf anderen Ärzten bei der Wahl des richtigen Krankenhauses.",
  },
};

export default function AppSubmitPage() {
  return <SubmitForm />;
}
