//
// import CampaignDetails from "@/components/Dashboard/Campaigns/CampaignDetails";
//
// export default function Page({ params }: { params: { id: string } }) {
//     return (
//         <div>
//             <CampaignDetails id={params.id} />
//         </div>
//     )
// }
//

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
