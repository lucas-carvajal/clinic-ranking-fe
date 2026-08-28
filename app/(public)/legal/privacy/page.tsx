import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung des Assistenz Arzt Ranking.",
  alternates: { canonical: "/legal/privacy" },
};

export default function LegalPrivacyPage() {
  return (
    <LegalPageShell title="Datenschutzerklärung">
      <section>
        <h2>1. Datenschutz auf einen Blick</h2>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was
          mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
          besuchen.
        </p>
      </section>

      <section>
        <h2>2. Datenerfassung auf dieser Website</h2>
        <p>
          Die Datenverarbeitung auf dieser Website erfolgt durch den
          Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser
          Website entnehmen.
        </p>
      </section>

      <section>
        <h2>3. Hosting</h2>
        <p>
          Die Website und die dort gespeicherten personenbezogenen Daten
          (insbesondere Bewertungen und E-Mail-Adressen zur Verifizierung)
          werden bei einem Hosting-Anbieter als Auftragsverarbeiter (Art. 28
          DSGVO) verarbeitet. Die Anwendung und die Datenspeicher liegen in der
          EU, in Amsterdam (Niederlande). Für den Betrieb der Plattform werden
          personenbezogene Daten auch in ein Drittland übermittelt. Das ist
          durch die Standardvertragsklauseln der EU-Kommission abgesichert.
          Eine Kopie der Klauseln stellen wir auf Anfrage zur Verfügung.
        </p>
      </section>

      <section>
        <h2>4. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
          Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
          erhalten. Sie haben außerdem ein Recht, die Berichtigung oder
          Löschung dieser Daten zu verlangen.
        </p>
      </section>

      <section>
        <h2>5. Cookies</h2>
        <p>
          Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die
          auf Ihrem Rechner abgelegt werden und die Ihr Browser speichern. Sie
          dienen dazu, unser Angebot nutzerfreundlicher zu machen.
        </p>
      </section>

      <section>
        <h2>6. Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden.
        </p>
      </section>
    </LegalPageShell>
  );
}
