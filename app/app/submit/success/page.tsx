import type { Metadata } from "next";

import { SubmitSuccessView } from "@/components/domains/submit/submit-success-view";

export const metadata: Metadata = {
  title: "Danke für deine Bewertung",
  description:
    "Deine Bewertung wurde eingereicht. Wir melden uns per E-Mail zur Verifizierung.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/app/submit/success" },
};

export default function AppSubmitSuccessPage() {
  return <SubmitSuccessView />;
}