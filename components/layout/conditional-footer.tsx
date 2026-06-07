"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";

const FOOTER_HIDDEN_PREFIXES = ["/app/submit"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (FOOTER_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }
  return <SiteFooter />;
}
