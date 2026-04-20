"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import JobBoard from "@/components/Dashboard/Jobs/sections/AllJobsTab";
import MyJobBoard from "@/components/Dashboard/Jobs/sections/MyJobsTab";
import { CreateJobModal } from "@/components/Dashboard/Jobs/CreateJobModal";
import { SelectCampaignForJobModal } from "@/components/Dashboard/tasks/SelectCampaignForJobModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Campaign } from "@/types/campaigns/campaignTypes";
import { campaignApi, parseCampaignId } from "@/lib/data/campaigns";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { fetchAuthMe } from "@/lib/data/auth";
import { decodeJwtPayload, getAccountTypeFromPayload } from "@/lib/jwtPayload";
import { DASHBOARD_TABS_LIST_TWO_UP_CLASS } from "@/components/layout/DashboardPageShell";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const effectiveToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const tokenPayload = useMemo(
    () => decodeJwtPayload(effectiveToken),
    [effectiveToken]
  );
  const { data: authMe } = useQuery({
    queryKey: ["auth-me"],
    queryFn: fetchAuthMe,
    enabled: !!effectiveToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const accountType = useMemo(() => {
    if (authMe?.accountType) return String(authMe.accountType).trim();
    const userAny = user as { accountType?: string; account?: { accountType?: string } } | null;
    const direct = userAny?.accountType ?? userAny?.account?.accountType;
    if (direct) return String(direct).trim();
    return getAccountTypeFromPayload(tokenPayload);
  }, [authMe, user, tokenPayload]);
  const isCreatorAccount = accountType.toLowerCase() === "creator";

  const [selectCampaignModalOpen, setSelectCampaignModalOpen] = useState(false);
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleStartCreateJob = () => {
    if (isCreatorAccount) return;
    setCreateJobModalOpen(false);
    setSelectCampaignModalOpen(true);
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setSelectCampaignModalOpen(false);
    setCreateJobModalOpen(true);
  };

  useEffect(() => {
    if (isCreatorAccount) {
      const create = searchParams.get("createJob") === "1";
      const cid = searchParams.get("campaignId");
      if (create || cid != null) {
        router.replace("/jobs");
      }
      return;
    }

    const create = searchParams.get("createJob") === "1";
    if (!create) return;

    const raw = searchParams.get("campaignId");
    const cid = raw != null ? parseCampaignId(raw) : null;

    if (cid != null) {
      let cancelled = false;
      void (async () => {
        try {
          const c = await campaignApi.getById(cid);
          if (cancelled) return;
          setSelectedCampaign(c);
          setSelectCampaignModalOpen(false);
          setCreateJobModalOpen(true);
        } catch {
          if (!cancelled) {
            setCreateJobModalOpen(false);
            setSelectCampaignModalOpen(true);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    setCreateJobModalOpen(false);
    setSelectCampaignModalOpen(true);
  }, [searchParams, isCreatorAccount, router]);

  if (isCreatorAccount) {
    return (
      <div className="w-full min-w-0">
        <JobBoard syncUrl />
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="myjobs" className="w-full min-w-0 space-y-4">
        <TabsList className={DASHBOARD_TABS_LIST_TWO_UP_CLASS}>
          <TabsTrigger value="myjobs" className="text-xs sm:text-sm">
            My Jobs
          </TabsTrigger>
          <TabsTrigger value="alljobs" className="text-xs sm:text-sm">
            All Jobs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="myjobs">
          <MyJobBoard onOpenCreateJob={handleStartCreateJob} />
        </TabsContent>
        <TabsContent value="alljobs">
          <JobBoard syncUrl onOpenCreateJob={handleStartCreateJob} />
        </TabsContent>
      </Tabs>
      <SelectCampaignForJobModal
        open={selectCampaignModalOpen}
        onOpenChange={setSelectCampaignModalOpen}
        onSelect={handleSelectCampaign}
      />
      <CreateJobModal
        open={createJobModalOpen}
        onOpenChange={(open) => {
          setCreateJobModalOpen(open);
          if (!open) setSelectedCampaign(null);
        }}
        campaignId={selectedCampaign?.id}
        campaignTitle={selectedCampaign?.title}
      />
    </>
  );
}

