import { PlaceholderPage } from "@/components/layout/placeholder-page";

type AppReviewDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AppReviewDetailPage({
  params,
}: AppReviewDetailPageProps) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title={`Bewertung ${id}`}
      ticket="T19"
    />
  );
}
