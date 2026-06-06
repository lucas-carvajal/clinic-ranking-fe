"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
            <select
              id="wouldRecommendHospital"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={field.value === null ? "" : String(field.value)}
              onChange={(e) => {
                if (e.target.value === "") field.onChange(null);
                else field.onChange(e.target.value === "true");
              }}
            >
              <option value="">Keine Angabe</option>
              <option value="true">Ja</option>
              <option value="false">Nein</option>
            </select>
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
            <input
              id="acceptedTerms"
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input accent-[#0a0a0a]"
            />
          )}
        />
        <Label htmlFor="acceptedTerms" className="cursor-pointer leading-snug">
          Ich habe die{" "}
          <Link href="/legal/terms" className="underline underline-offset-2 hover:opacity-70">
            Nutzungsbedingungen
          </Link>{" "}
          gelesen und akzeptiert.{" "}
          <span className="text-destructive">*</span>
        </Label>
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
