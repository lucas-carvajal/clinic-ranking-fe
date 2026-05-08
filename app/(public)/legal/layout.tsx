import { AppSiteHeader } from "@/components/layout/app-site-header";

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppSiteHeader />
      {children}
    </>
  );
}
