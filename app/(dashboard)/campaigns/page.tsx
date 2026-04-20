"use client";

import { useState } from "react";
import CampaignList from "@/components/Dashboard/Campaigns/CampaignList";
import { CreateCampaignModal } from "@/components/Dashboard/Campaigns/CreateCampaignModal";

export default function Page() {
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);

  return (
    <>
      <CampaignList onOpenCreateCampaign={() => setCreateCampaignModalOpen(true)} />
      <CreateCampaignModal open={createCampaignModalOpen} onOpenChange={setCreateCampaignModalOpen} />
    </>
  );
}
