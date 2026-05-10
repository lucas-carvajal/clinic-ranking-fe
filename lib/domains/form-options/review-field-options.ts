import type { LabeledValue } from "@/lib/domains/form-options/display-labels";

export const ROTATION_OPTIONS: readonly LabeledValue[] = [
  { label: "Normalstation", value: "generalWard" },
  { label: "Überwachungsstation / IMC", value: "intermediateCare" },
  { label: "Intensivstation", value: "icu" },
  { label: "Notaufnahme", value: "emergencyRoom" },
  { label: "Ambulanz & Sprechstunde", value: "ambulatoryCare" },
  { label: "Funktionsdiagnostik", value: "functionaldiagnostics" },
  { label: "OP", value: "surgery" },
  { label: "Notarztdienst", value: "preClinic" },
  { label: "Konsildienst", value: "consultations" },
  { label: "Studiendienst", value: "studyNurse" },
  { label: "Weitere", value: "misc" },
];

export const SURGERY_ROLE_OPTIONS: readonly LabeledValue[] = [
  { label: "Hauptoperateur", value: "mainSurgeon" },
  { label: "Erste Assistenz", value: "firstAssist" },
  { label: "Zweite Assistenz", value: "secondAssist" },
  { label: "Hakenhalter", value: "retractorHolder" },
  { label: "Anästhesist ;)", value: "anesthesiologist" },
];

export const TRAINING_QUALITY_OPTIONS: readonly LabeledValue[] = [
  { label: "Ausreichende Einarbeitung", value: "structuredOnboarding" },
  { label: "Persönlicher Mentor", value: "mentor" },
  { label: "Gute Oberarztbetreuung", value: "seniorDoctorTeaching" },
  { label: "Regelmäßige interne Fortbildungen", value: "internalTraining" },
  { label: "Teilnahme an externen Fortbildungen", value: "externalTrainingSupported" },
  { label: "Skills Labs", value: "skillsLabs" },
];

export const WORK_STRUCTURE_OPTIONS: readonly LabeledValue[] = [
  { label: "Strukturiertes Weiterbildungsprogramm", value: "structuredTrainingProgram" },
  /** Legacy typo preserved for label parity */
  {
    label: "Facharzt in Regelzeit möglichArbeitsat",
    value: "specialistInRegularTime",
  },
  { label: "Auslandsrotation möglich", value: "internationalRotation" },
  { label: "Forschung erwartet", value: "researchExpected" },
];

export const WORK_ATMOSPHERE_OPTIONS: readonly LabeledValue[] = [
  { label: "Nette Kollegen", value: "niceColleagues" },
  { label: "Guter Kaffee", value: "goodCoffee" },
  { label: "Flache Hierarchien", value: "flatHierarchies" },
  { label: "Entspannte Stimmung", value: "relaxedAtmosphere" },
  { label: "Stressfreie Arbeit", value: "stressFreeWork" },
  { label: "Unterbesetzung", value: "understaffed" },
  { label: "Wertschätzung der Arbeit", value: "valuedWork" },
];

export const OVERTIME_COMPENSATION_OPTIONS: readonly LabeledValue[] = [
  { value: "freeTimeCompensation", label: "Freizeitausgleich" },
  { value: "monetaryCompensation", label: "Bezahlung" },
  { value: "flexibleCompensation", label: "Flexibel" },
  { value: "noCompensation", label: "Gar nicht" },
];
