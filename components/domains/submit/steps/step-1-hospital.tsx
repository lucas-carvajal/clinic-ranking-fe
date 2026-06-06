"use client";

import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step1Hospital({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Dein Krankenhaus</legend>

      <p className="text-muted-foreground text-sm">
        Dynamic options coming soon (T19B)
      </p>

      <div className="space-y-2">
        <Label htmlFor="state">Bundesland</Label>
        <Input
          id="state"
          type="text"
          placeholder="z. B. Bayern"
          {...form.register("state")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Stadt</Label>
        <Input
          id="city"
          type="text"
          placeholder="z. B. München"
          {...form.register("city")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hospital">Krankenhaus</Label>
        <Input
          id="hospital"
          type="text"
          placeholder="z. B. Klinikum Rechts der Isar"
          {...form.register("hospital")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">Fachrichtung</Label>
        <Input
          id="specialty"
          type="text"
          placeholder="z. B. Innere Medizin"
          {...form.register("specialty")}
        />
      </div>
    </fieldset>
  );
}
