import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen für die Nutzung des Assistenz Arzt Ranking.",
  alternates: { canonical: "/legal/terms" },
};

export default function LegalTermsPage() {
  return (
    <LegalPageShell title="Allgemeine Geschäftsbedingungen (AGB)">
      <section>
        <h2>§ 1 Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung dieser
          Website und aller damit verbundenen Dienste.
        </p>
      </section>

      <section>
        <h2>§ 2 Nutzungsbedingungen</h2>
        <p>
          Die Nutzung unserer Dienste erfolgt auf eigene Verantwortung. Wir
          behalten uns das Recht vor, Nutzer bei Verstoß gegen diese Bedingungen
          auszuschließen.
        </p>
      </section>

      <section>
        <h2>§ 3 Haftung</h2>
        <p>
          Wir übernehmen keine Haftung für die Richtigkeit, Vollständigkeit und
          Aktualität der bereitgestellten Informationen, soweit nicht
          vorsätzliches oder grob fahrlässiges Verhalten vorliegt.
        </p>
      </section>

      <section>
        <h2>§ 4 Urheberrecht</h2>
        <p>
          Alle Inhalte dieser Website sind urheberrechtlich geschützt. Eine
          Vervielfältigung oder Verwendung bedarf der vorherigen schriftlichen
          Zustimmung.
        </p>
      </section>

      <section>
        <h2>§ 5 Schlussbestimmungen</h2>
        <p>
          Es gilt deutsches Recht. Sollten einzelne Bestimmungen dieser AGB
          unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen
          unberührt.
        </p>
      </section>
    </LegalPageShell>
  );
}
