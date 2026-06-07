"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BooleanCombobox } from "@/components/domains/submit/boolean-combobox";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step7Optional({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Freiwilliges</legend>

      {/* Weiterempfehlung */}
      <div className="space-y-2">
        <Label htmlFor="wouldRecommendHospital">
          Würdest du dieses Krankenhaus weiterempfehlen?
        </Label>
        <Controller
          control={form.control}
          name="wouldRecommendHospital"
          render={({ field }) => (
            <BooleanCombobox
              id="wouldRecommendHospital"
              value={field.value}
              onChange={field.onChange}
              nullable
            />
          )}
        />
      </div>

      {/* Weiterbildung */}
      <div className="space-y-2 border-t border-border pt-6">
        <h3 className="text-base font-semibold">Wie bewertest du deine Weiterbildung insgesamt?</h3>
        <p className="text-sm text-muted-foreground">
          Schreibe kurz, was dir bei deiner Weiterbildung gefallen hat und was nicht. Erwähne gerne alles, was anderen helfen könnte :)
        </p>
        <Textarea
          id="textReviewTraining"
          placeholder="Deine Bewertung..."
          rows={3}
          className="resize-y"
          {...form.register("textReviewTraining")}
        />
      </div>

      {/* Bewerbungsprozess */}
      <div className="space-y-2 border-t border-border pt-6">
        <h3 className="text-base font-semibold">Wie war der Bewerbungsprozess?</h3>
        <p className="text-sm text-muted-foreground">
          Schreibe kurz, wie du dich beworben hast und wie der Bewerbungsprozess ablief. Gibt es irgendwelche Tipps, die anderen helfen könnten? :)
        </p>
        <Textarea
          id="textReviewApplication"
          placeholder="Deine Bewerbung..."
          rows={3}
          className="resize-y"
          {...form.register("textReviewApplication")}
        />
      </div>

      {/* Veröffentlichungsdatum */}
      <div className="space-y-2 border-t border-border pt-6">
        <h3 className="text-base font-semibold">Datum der Freigabe <span className="text-muted-foreground font-normal text-sm">(Optional)</span></h3>
        <p className="text-sm text-muted-foreground">
          Du willst, dass deine Bewertung erst nach einem bestimmten Datum sichtbar wird? Dann gebe es hier an.
        </p>
        <Label htmlFor="publishAtDate" className="sr-only">Freigabedatum</Label>
        <Controller
          control={form.control}
          name="publishAtDate"
          render={({ field }) => (
            <Input
              id="publishAtDate"
              type="date"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
            />
          )}
        />
      </div>

      {/* E-Mail */}
      <div className="space-y-2 border-t border-border pt-6">
        <Label htmlFor="email">
          E-Mail <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="deine@email.de"
          {...form.register("email")}
        />
      </div>

      {/* Terms */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Controller
            control={form.control}
            name="acceptedTerms"
            render={({ field }) => (
              <input
                id="acceptedTerms"
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-input accent-[#0a0a0a]"
              />
            )}
          />
          <label htmlFor="acceptedTerms" className="cursor-pointer text-sm font-medium leading-snug select-none">
            Ich habe die{" "}
            <Link href="/legal/terms" className="underline underline-offset-2 hover:opacity-70">
              Nutzungsbedingungen
            </Link>{" "}
            gelesen und akzeptiert.{" "}
            <span className="text-destructive">*</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Informationen zur Verarbeitung deiner Daten findest du in unserer{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:opacity-70">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
    </fieldset>
  );
}
