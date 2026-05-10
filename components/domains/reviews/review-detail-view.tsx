import type { ReactNode } from "react";
import Link from "next/link";

import type { ReviewDetail } from "@/lib/contracts/reviews.schema";
import { labelFor, labelsFor } from "@/lib/domains/form-options/display-labels";
import {
  OVERTIME_COMPENSATION_OPTIONS,
  ROTATION_OPTIONS,
  SURGERY_ROLE_OPTIONS,
  TRAINING_QUALITY_OPTIONS,
  WORK_ATMOSPHERE_OPTIONS,
  WORK_STRUCTURE_OPTIONS,
} from "@/lib/domains/form-options/review-field-options";

function formatDetailDate(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function DetailChip({ children }: { children: ReactNode }) {
  return (
    <span className="border-border bg-muted/50 text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

function YesNo({ value }: { value: boolean | null | undefined }) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  const positive = (
    <span className="text-green-700 dark:text-green-400 font-medium">Ja</span>
  );
  const negative = (
    <span className="text-destructive font-medium">Nein</span>
  );

  return value ? positive : negative;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-border bg-surface-lifted mb-4 rounded-lg border p-6 shadow-sm">
      <h2 className="text-foreground mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function GradeCell({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="bg-muted/40 rounded-lg p-3 text-center">
      <p className="text-muted-foreground mb-1 text-xs">{label}</p>
      <p className="text-brand-mint text-2xl font-bold tabular-nums">
        {value ?? "–"}
      </p>
    </div>
  );
}

function trainingYearLabel(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value === 99) return "Fertig";
  return String(value);
}

export function ReviewDetailView({ review }: Readonly<{ review: ReviewDetail }>) {
  const rotationLabels = labelsFor([...ROTATION_OPTIONS], review.rotations);
  const surgeryRoleLabels = labelsFor([...SURGERY_ROLE_OPTIONS], review.surgeryRoles);
  const trainingLabels = labelsFor([...TRAINING_QUALITY_OPTIONS], review.trainingQuality);
  const structureLabels = labelsFor([...WORK_STRUCTURE_OPTIONS], review.workStructure);
  const atmosphereLabels = labelsFor([...WORK_ATMOSPHERE_OPTIONS], review.workAtmosphere);

  const overtimeType = review.overtimeCompensationType?.trim();
  const overtimeLabel =
    overtimeType && overtimeType !== ""
      ? labelFor([...OVERTIME_COMPENSATION_OPTIONS], overtimeType)
      : null;

  return (
    <div className="text-foreground mx-auto max-w-4xl overflow-x-hidden px-3 py-4 md:p-4">
      <nav className="text-muted-foreground mb-6 text-sm">
        <Link href="/app/reviews" className="hover:text-foreground underline-offset-4 hover:underline">
          Alle Bewertungen
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">Details</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{review.hospital}</h1>
        <p className="text-muted-foreground mt-1">
          Bewertung vom {formatDetailDate(review.dateTime)}
        </p>
      </header>

      <SectionCard title="Überblick">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
            <DetailField label="Stadt" value={review.city} />
            <DetailField label="Bundesland" value={review.state} />
            <DetailField label="Fachrichtung" value={review.specialty} />
            <DetailField label="Heimat-Uni" value={displayText(review.homeUniversity)} />
            <DetailField
              label="Wechsel der Weiterbildungsstätte"
              value={<YesNo value={review.trainingHospitalChanged} />}
            />
            <DetailField
              label="Weiterbildungsjahr"
              value={trainingYearLabel(review.yearOfTraining)}
            />
            <DetailField label="Jahr am Krankenhaus" value={review.yearAtHospital ?? "—"} />
            <DetailField
              label="Weiterempfehlung"
              value={
                review.wouldRecommendHospital === null ? (
                  "—"
                ) : review.wouldRecommendHospital ? (
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Ja
                  </span>
                ) : (
                  <span className="text-destructive font-medium">Nein</span>
                )
              }
            />
          </div>
          <aside className="border-border flex w-full shrink-0 flex-row items-center justify-center gap-2 border-t pt-4 text-center md:mt-0 md:w-40 md:flex-col md:justify-start md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-muted-foreground text-sm md:mb-1">Gesamtnote</p>
            <p className="text-brand-mint text-4xl font-bold tabular-nums">
              {review.totalGrade}
            </p>
          </aside>
        </div>
        {review.otherRotations.trim() !== "" ? (
          <div className="border-border mt-5 border-t pt-5">
            <p className="text-muted-foreground mb-2 text-sm">Weitere Rotationen</p>
            <p className="text-base whitespace-pre-wrap">{review.otherRotations}</p>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Rotationen und Einsatzbereiche">
        <div className="space-y-5">
          {rotationLabels.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Einsatzbereiche</p>
              <div className="flex flex-wrap gap-2">
                {rotationLabels.map((label) => (
                  <DetailChip key={label}>{label}</DetailChip>
                ))}
              </div>
            </div>
          ) : null}

          {review.surgeryRoles.length > 0 ? (
            <>
              <div>
                <p className="text-muted-foreground mb-2 text-sm">Rollen im OP</p>
                <div className="flex flex-wrap gap-2">
                  {surgeryRoleLabels.map((label) => (
                    <DetailChip key={label}>{label}</DetailChip>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-sm">Komplexe Eingriffe</p>
                  <YesNo value={review.surgeryComplexProcedures} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Anteil OP-Zeit</p>
                  <p className="text-base font-medium">{review.surgeryTimePercentage}%</p>
                </div>
              </div>
            </>
          ) : null}

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">Eigenständige Diagnostik</p>
              <YesNo value={review.ownDiagnosticsExecution} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Anteil Diagnostik-Zeit</p>
              <p className="text-base font-medium">{review.diagnosticsTimePercentage}%</p>
            </div>
          </div>

        </div>
      </SectionCard>

      <SectionCard title="Weiterbildungsqualität und Arbeitsbedingungen">
        <div className="space-y-5">
          {trainingLabels.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Weiterbildungsqualität</p>
              <div className="flex flex-wrap gap-2">
                {trainingLabels.map((label) => (
                  <DetailChip key={label}>{label}</DetailChip>
                ))}
              </div>
            </div>
          ) : null}
          {structureLabels.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Weiterbildungsstruktur</p>
              <div className="flex flex-wrap gap-2">
                {structureLabels.map((label) => (
                  <DetailChip key={label}>{label}</DetailChip>
                ))}
              </div>
            </div>
          ) : null}
          {atmosphereLabels.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Arbeitsatmosphäre</p>
              <div className="flex flex-wrap gap-2">
                {atmosphereLabels.map((label) => (
                  <DetailChip key={label}>{label}</DetailChip>
                ))}
              </div>
            </div>
          ) : null}

          <hr className="border-border" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
            <DetailStat label="Weiterbildungsdauer" value={`${review.averageTrainingTimeYears} Jahre`} />
            <DetailStat label="Vertragsstunden/Woche" value={`${review.contractualHours}h`} />
            <DetailStat label="Tatsächliche Stunden" value={`${review.weeklyHours}h`} />
            <DetailStat label="Dienste/Monat" value={String(review.onCallShiftsPerMonth)} />
            {overtimeLabel ? (
              <div>
                <p className="text-muted-foreground text-sm">Überstundenausgleich</p>
                <p className="text-base font-medium">{overtimeLabel}</p>
              </div>
            ) : null}
            <div>
              <p className="text-muted-foreground text-sm">Überstunden korrekt erfasst</p>
              <YesNo value={review.correctOvertimeLogging} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Noten">
        <p className="text-muted-foreground mb-4 text-sm">
          Schulnoten von 1 (beste) bis 6 (schlechteste)
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <GradeCell label="Theoretisches Wissen" value={review.gradeTheoreticalKnowledge} />
          <GradeCell label="Praktisches Wissen" value={review.gradePracticalKnowledge} />
          <GradeCell label="Arbeitsatmosphäre" value={review.gradeAtmosphere} />
          <GradeCell label="Klinikausstattung" value={review.gradeFacilities} />
          <GradeCell label="Arbeitsbedingungen" value={review.gradeWorkingConditions} />
          <GradeCell label="Familienfreundlichkeit" value={review.gradeFamilyFriendliness} />
        </div>
      </SectionCard>

      {review.textReviewApplication.trim() !== "" ? (
        <SectionCard title="Bewerbungsprozess">
          <p className="text-foreground whitespace-pre-wrap text-base leading-relaxed">
            {review.textReviewApplication}
          </p>
        </SectionCard>
      ) : null}

      {review.textReviewTraining.trim() !== "" ? (
        <SectionCard title="Bewertung der Weiterbildung">
          <p className="text-foreground whitespace-pre-wrap text-base leading-relaxed">
            {review.textReviewTraining}
          </p>
        </SectionCard>
      ) : null}
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}

function displayText(value: string | null | undefined): string {
  const t = value?.trim();
  return t && t !== "" ? t : "—";
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="text-base font-medium break-words">{value}</div>
    </div>
  );
}
