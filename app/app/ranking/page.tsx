import type { Metadata } from "next";

import { RankingComingSoon } from "@/components/domains/ranking/ranking-coming-soon";

export const metadata: Metadata = {
  title: "Das Ranking",
  description:
    "Das Krankenhaus-Ranking für Assistenzärzte — demnächst mit sortierbaren Bewertungen nach Fachrichtung und Region.",
  alternates: { canonical: "/app/ranking" },
};

export default function AppRankingPage() {
  return <RankingComingSoon />;
}
