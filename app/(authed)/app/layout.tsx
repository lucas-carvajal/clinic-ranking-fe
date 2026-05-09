import { AppSiteHeader } from "@/components/layout/app-site-header";
import { ReviewsPagerProvider } from "@/lib/domains/reviews/pager/reviews-pager-context";

export default function AppAreaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppSiteHeader />
      <div className="flex min-h-0 flex-1 flex-col">
        <ReviewsPagerProvider>{children}</ReviewsPagerProvider>
      </div>
    </div>
  );
}
