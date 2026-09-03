export type AdminVerificationEmailContext = {
  hospital: string;
  city: string;
  email: string;
  verificationUrl?: string | null;
};

export function verificationEmailSubject(ctx: AdminVerificationEmailContext): string {
  return `Verifizierung deiner Bewertung für ${ctx.hospital}`;
}

export function verificationEmailContent(ctx: AdminVerificationEmailContext): string {
  const hospitalSlug = ctx.hospital.toLowerCase().replace(/\s+/g, "");
  const looksOfficial = ctx.email.toLowerCase().includes(hospitalSlug);

  const linkBlock = ctx.verificationUrl
    ? `Bitte öffne diesen Link, um dein Postfach zu bestätigen:
${ctx.verificationUrl}

`
    : "";

  return `Hallo,

vielen Dank für deine eingereichte Bewertung für ${ctx.hospital} in ${ctx.city}!

Um deine Bewertung veröffentlichen zu können, müssen wir zunächst deine E-Mail-Adresse und deine Zugehörigkeit zum Krankenhaus verifizieren.

${linkBlock}${!looksOfficial ? `Da deine E-Mail-Adresse keine offizielle Krankenhaus-E-Mail zu sein scheint, bitten wir dich, uns einen Nachweis zu senden, dass du dort tätig warst (z.B. Arbeitsvertrag, Gehaltsabrechnung, Mitarbeiterausweis - gerne geschwärzt).

` : ""}Nach erfolgreicher Verifizierung wird deine Bewertung von uns geprüft und bei Freigabe veröffentlicht. Du erhältst eine weitere E-Mail, sobald deine Bewertung freigeschaltet wurde.

Übrigens: Wenn du Kolleg:innen kennst, die ebenfalls ihre Erfahrungen teilen möchten, leite ihnen gerne den Link zu unserer Plattform weiter. Je mehr Bewertungen wir haben, desto hilfreicher wird die Plattform für alle!

Beste Grüße`;
}

export function affiliationEmailSubject(ctx: AdminVerificationEmailContext): string {
  return `Nachweis der Zugehörigkeit für deine Bewertung - ${ctx.hospital}`;
}

export function affiliationEmailContent(ctx: AdminVerificationEmailContext): string {
  return `Hallo,

vielen Dank für die Verifizierung deiner E-Mail-Adresse!

Da deine E-Mail-Adresse keine offizielle Krankenhaus-E-Mail-Adresse ist, benötigen wir einen zusätzlichen Nachweis, dass du tatsächlich bei ${ctx.hospital} in ${ctx.city} tätig warst.

Bitte sende uns einen der folgenden Nachweise (gerne mit geschwärzten persönlichen Daten):
- Arbeitsvertrag
- Gehaltsabrechnung
- Mitarbeiterausweis
- Rotationsplan / Dienstplan mit deinem Namen
- Oder ein anderes Dokument, das deine Tätigkeit dort belegt

Nach Erhalt des Nachweises werden wir deine Bewertung prüfen und bei Freigabe veröffentlichen. Du erhältst dann eine Bestätigungsmail.

Beste Grüße`;
}
