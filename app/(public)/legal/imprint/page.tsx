import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung des Assistenz Arzt Ranking.",
  alternates: { canonical: "/legal/imprint" },
};

export default function LegalImprintPage() {
  return (
    <LegalPageShell title="Impressum">
      <p className="text-muted-foreground">Angaben gemäß § 5 TMG</p>

      <section>
        <h2>Kontakt</h2>
        <p>E-Mail: kontakt@example.de</p>
      </section>

      <section>
        <h2>Verantwortlich für den Inhalt</h2>
        <p>[Name und Adresse einfügen]</p>
      </section>

      <section>
        <h2>Haftungsausschluss</h2>
        <p>
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
          für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten
          sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </section>
    </LegalPageShell>
  );
}
