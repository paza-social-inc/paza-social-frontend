//
import CampaignDetails from "@/components/Dashboard/Campaigns/CampaignDetails";
//
// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   return (
//     <div>
//       <CampaignDetails id={params.id} />
//     </div>
//   )
// }


// import CampaignDetails from "@/components/Dashboard/Campaigns/CampaignDetails";
//
// export default async function Page({
//   params
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params;
//
//   return (
//     <div>
//       <CampaignDetails id={id} />
//     </div>
//   );
// }
//


// app/campaigns/[id]/page.tsx
// import CampaignDetails from "@/components/campaigns/CampaignDetails";

export default function CampaignPage({ params }: { params: { id: string } }) {
  return <CampaignDetails id={params.id} />;
}
