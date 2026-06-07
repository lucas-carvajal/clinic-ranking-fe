"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { post } from "@/lib/api/client";
import { toReviewApiPayload } from "./mappers";
import { reviewSubmitSchema } from "@/lib/contracts/submit.schema";
import { resetDraft } from "./persistence";
import type { ReviewFormState } from "./schema";

export function useSubmitReview() {
  const router = useRouter();
  return useMutation({
    mutationFn: (values: ReviewFormState) => {
      const payload = toReviewApiPayload(values);
      return post("/review", payload, { requestSchema: reviewSubmitSchema });
    },
    onSuccess: () => {
      resetDraft();
      router.push("/app/submit/success");
    },
  });
}
