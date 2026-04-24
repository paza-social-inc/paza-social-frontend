import CampaignDetails from "@/components/Dashboard/Campaigns/CampaignDetails";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  return (
    <div>
      <CampaignDetails id={id} />
    </div>
  );
}
