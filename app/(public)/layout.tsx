import { AppSiteHeader } from "@/components/layout/app-site-header";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppSiteHeader />
      {children}
    </>
  );
}
