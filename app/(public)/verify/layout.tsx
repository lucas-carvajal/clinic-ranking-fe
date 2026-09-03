import { AppSiteHeader } from "@/components/layout/app-site-header";

export default function VerifyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppSiteHeader />
      {children}
    </>
  );
}
