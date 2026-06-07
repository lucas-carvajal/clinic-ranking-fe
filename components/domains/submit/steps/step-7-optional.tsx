"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step7Optional({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Freiwilliges</legend>

      <div className="space-y-2">
        <Label htmlFor="wouldRecommendHospital">
          Würdest du dieses Krankenhaus weiterempfehlen?
        </Label>
        <Controller
          control={form.control}
          name="wouldRecommendHospital"
          render={({ field }) => (
            <Select
              id="wouldRecommendHospital"
              value={field.value === null ? "" : String(field.value)}
              onChange={(e) => {
                if (e.target.value === "") field.onChange(null);
                else field.onChange(e.target.value === "true");
              }}
            >
              <option value="">Keine Angabe</option>
              <option value="true">Ja</option>
              <option value="false">Nein</option>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="textReviewTraining">Wie war deine Weiterbildung?</Label>
        <Textarea
          id="textReviewTraining"
          placeholder="Beschreibe deine Erfahrungen mit der Weiterbildung..."
          {...form.register("textReviewTraining")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="textReviewApplication">Wie war dein Bewerbungsprozess?</Label>
        <Textarea
          id="textReviewApplication"
          placeholder="Beschreibe deinen Bewerbungsprozess..."
          {...form.register("textReviewApplication")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="publishAtDate">Veröffentlichungsdatum</Label>
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

      <div className="space-y-2">
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

      <div className="flex items-start gap-3">
        <Controller
          control={form.control}
          name="acceptedTerms"
          render={({ field }) => (
            <Checkbox
              id="acceptedTerms"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-0.5"
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

      <Button
        type="submit"
        disabled
        title="T19B"
        className="w-full"
      >
        Bewertung abschicken
      </Button>
    </fieldset>
  );
}
