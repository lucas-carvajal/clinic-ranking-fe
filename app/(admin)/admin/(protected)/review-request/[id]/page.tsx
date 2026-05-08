import { PlaceholderPage } from "@/components/layout/placeholder-page";

type AdminReviewRequestDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminReviewRequestDetailPage({
  params,
}: AdminReviewRequestDetailPageProps) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title={`Bewertungsanfrage ${id}`}
      ticket="T15"
    />
  );
}
