import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
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
        <h2>3. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
          Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
          erhalten. Sie haben außerdem ein Recht, die Berichtigung oder
          Löschung dieser Daten zu verlangen.
        </p>
      </section>

      <section>
        <h2>4. Cookies</h2>
        <p>
          Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die
          auf Ihrem Rechner abgelegt werden und die Ihr Browser speichern. Sie
          dienen dazu, unser Angebot nutzerfreundlicher zu machen.
        </p>
      </section>

      <section>
        <h2>5. Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden.
        </p>
      </section>
    </LegalPageShell>
  );
}
