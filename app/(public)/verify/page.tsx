import type { Metadata } from "next";

import { VerifyResultView } from "@/components/domains/verify/verify-result-view";
import { consumeReviewVerification } from "@/lib/domains/verify/consume-review-verification";
import { parseVerifyTokenParam } from "@/lib/domains/verify/parse-verify-token";

export const metadata: Metadata = {
  title: "E-Mail bestätigen",
  robots: { index: false, follow: false },
};

type VerifyPageProps = {
  searchParams?: Promise<{ token?: string | string[] }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const sp = searchParams ? await searchParams : undefined;
  const token = parseVerifyTokenParam(sp?.token);

  if (!token) {
    return <VerifyResultView result={{ kind: "dead_link" }} />;
  }

  const result = await consumeReviewVerification(token);
  return <VerifyResultView result={result} />;
}
