// "use client"
// import React, { useMemo, useState } from "react";
// import { mockCampaigns } from "@/lib/data/campaigns";
// import CampaignCard from "./CampaignCard";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useRouter } from "next/navigation";
// import { RiAddLine, RiCloseLine, RiFilterLine, RiSearchLine } from "@remixicon/react";
//
// export default function CampaignList() {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("recent");
//   const [selectedActive, setSelectedActive] = useState<string[]>([]);
//   const [selectedTeamNames, setSelectedTeamNames] = useState<string[]>([]);
//   const [selectedMilestoneCategories, setSelectedMilestoneCategories] = useState<string[]>([]);
//   const [budgetRange, setBudgetRange] = useState<number[]>([0, 500000]);
//
//   const allTeamNames = useMemo(() => {
//     return Array.from(new Set(mockCampaigns.flatMap(c => (c.teams || []).map(t => t.name))));
//   }, []);
//
//   const allMilestoneCategories = ["Major Milestone", "Minor Milestone"];
//
//   const filteredAndSortedCampaigns = useMemo(() => {
//     let filtered = mockCampaigns.filter(c => {
//       const matchesSearch = !searchTerm ||
//         c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());
//
//       const matchesActive = selectedActive.length === 0 || selectedActive.includes(c.active ? "Active" : "Inactive");
//
//       const matchesTeams = selectedTeamNames.length === 0 ||
//         (c.teams || []).some(t => selectedTeamNames.includes(t.name));
//
//       const matchesMilestoneCategory = selectedMilestoneCategories.length === 0 ||
//         (c.milestones || []).some(m => m.category && selectedMilestoneCategories.includes(m.category));
//
//       const budget = Number(c.budget) || 0;
//       const matchesBudget = budget >= budgetRange[0] && budget <= budgetRange[1];
//
//       return matchesSearch && matchesActive && matchesTeams && matchesMilestoneCategory && matchesBudget;
//     });
//
//     filtered.sort((a, b) => {
//       if (sortBy === 'budget-high') return (Number(b.budget) || 0) - (Number(a.budget) || 0);
//       if (sortBy === 'budget-low') return (Number(a.budget) || 0) - (Number(b.budget) || 0);
//       return 0;
//     });
//
//     return filtered;
//   }, [searchTerm, sortBy, selectedActive, selectedTeamNames, selectedMilestoneCategories, budgetRange]);
//
//   const toggleFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
//     if (arr.includes(value)) setArr(arr.filter(x => x !== value));
//     else setArr([...arr, value]);
//   };
//
//   const clearAll = () => {
//     setSearchTerm("");
//     setSortBy("recent");
//     setSelectedActive([]);
//     setSelectedTeamNames([]);
//     setSelectedMilestoneCategories([]);
//     setBudgetRange([0, 500000]);
//   };
//
//   const activeFiltersCount = selectedActive.length + selectedTeamNames.length + selectedMilestoneCategories.length;
//
//   return (
//     <Tabs defaultValue="all" className="full p-3">
//       <TabsList className="md:min-w-xs h-10">
//         <TabsTrigger value="all">All Campaigns</TabsTrigger>
//         <TabsTrigger value="recommended">Recommended</TabsTrigger>
//       </TabsList>
//
//       {/* Header with search & filters */}
//       <div className="bg-background border sticky top-0 z-10 shadow-sm mt-3">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <h1 className="text-3xl font-bold">Campaigns</h1>
//               <p className="text-muted-foreground mt-1">{filteredAndSortedCampaigns.length} campaigns</p>
//             </div>
//             <Button>
//               <RiAddLine className='h-5 w-5' />
//               Create Campaign
//             </Button>
//           </div>
//
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <RiSearchLine className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//               <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search campaigns..." className="pl-10" />
//             </div>
//
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-[200px]">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="recent">Most Recent</SelectItem>
//                 <SelectItem value="budget-high">Highest Budget</SelectItem>
//                 <SelectItem value="budget-low">Lowest Budget</SelectItem>
//               </SelectContent>
//             </Select>
//
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" className="relative flex items-center">
//                   <RiFilterLine className="w-5 h-5" />
//                   <span className="font-medium">Filters</span>
//                   {activeFiltersCount > 0 && (
//                     <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {activeFiltersCount}
//                     </Badge>
//                   )}
//                 </Button>
//               </SheetTrigger>
//               <SheetContent className="w-full max-w-md p-6  overflow-y-auto ">
//                 <SheetHeader className="mb-6 !px-0">
//                   <SheetTitle className="text-2xl font-bold">Filter Campaigns</SheetTitle>
//                 </SheetHeader>
//
//                 <div className="space-y-8">
//                   {/* Active Status */}
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <Label className="text-lg font-semibold">Status</Label>
//                       {selectedActive.length > 0 && (
//                         <Button variant="ghost" size="sm" onClick={() => setSelectedActive([])}>Clear</Button>
//                       )}
//                     </div>
//                     <div className="space-y-3">
//                       {["Active", "Inactive"].map(s => (
//                         <div key={s} className="flex items-center space-x-3">
//                           <Checkbox id={s} checked={selectedActive.includes(s)} onCheckedChange={() => toggleFilter(selectedActive, setSelectedActive, s)} className="h-5 w-5" />
//                           <Label htmlFor={s} className="cursor-pointer">{s}</Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//
//                   {/* Teams */}
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <Label className="text-lg font-semibold">Teams</Label>
//                       {selectedTeamNames.length > 0 && (
//                         <Button variant="ghost" size="sm" onClick={() => setSelectedTeamNames([])}>Clear</Button>
//                       )}
//                     </div>
//                     <div className="space-y-3">
//                       {allTeamNames.map(name => (
//                         <div key={name} className="flex items-center space-x-3">
//                           <Checkbox id={name} checked={selectedTeamNames.includes(name)} onCheckedChange={() => toggleFilter(selectedTeamNames, setSelectedTeamNames, name)} className="h-5 w-5" />
//                           <Label htmlFor={name} className="cursor-pointer">{name}</Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//
//                   {/* Milestone Category */}
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <Label className="text-lg font-semibold">Milestone Category</Label>
//                       {selectedMilestoneCategories.length > 0 && (
//                         <Button variant="ghost" size="sm" onClick={() => setSelectedMilestoneCategories([])}>Clear</Button>
//                       )}
//                     </div>
//                     <div className="space-y-3">
//                       {allMilestoneCategories.map(cat => (
//                         <div key={cat} className="flex items-center space-x-3">
//                           <Checkbox id={cat} checked={selectedMilestoneCategories.includes(cat)} onCheckedChange={() => toggleFilter(selectedMilestoneCategories, setSelectedMilestoneCategories, cat)} className="h-5 w-5" />
//                           <Label htmlFor={cat} className="cursor-pointer">{cat}</Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//
//                   {/* Budget Range */}
//                   <div>
//                     <Label className="text-lg font-semibold">Budget Range: KSh {budgetRange[0].toLocaleString()} - KSh {budgetRange[1].toLocaleString()}</Label>
//                     <Slider min={0} max={500000} step={5000} value={budgetRange} onValueChange={setBudgetRange} className="mt-4" />
//                   </div>
//
//                   {/* Clear All */}
//                   {activeFiltersCount > 0 && (
//                     <Button onClick={clearAll} variant="outline" className="w-full py-3 border-2">Clear All Filters</Button>
//                   )}
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//
//       {/* Active Filters */}
//       {activeFiltersCount > 0 && (
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex flex-wrap gap-2 items-center">
//             <span className="text-sm text-muted-foreground">Active filters:</span>
//             {selectedActive.map(s => (
//               <Badge key={s} variant="secondary" className="gap-1 p-1">
//                 {s}
//                 <RiCloseLine className='cursor-pointer ml-1 h-4 w-4' onClick={() => toggleFilter(selectedActive, setSelectedActive, s)} />
//               </Badge>
//             ))}
//             {selectedTeamNames.map(n => (
//               <Badge key={n} variant="secondary" className="gap-1 p-1">
//                 {n}
//                 <RiCloseLine className='cursor-pointer ml-1 h-4 w-4' onClick={() => toggleFilter(selectedTeamNames, setSelectedTeamNames, n)} />
//               </Badge>
//             ))}
//             {selectedMilestoneCategories.map(cat => (
//               <Badge key={cat} variant="secondary" className="gap-1 p-1">
//                 {cat}
//                 <RiCloseLine className='cursor-pointer ml-1 h-4 w-4' onClick={() => toggleFilter(selectedMilestoneCategories, setSelectedMilestoneCategories, cat)} />
//               </Badge>
//             ))}
//           </div>
//         </div>
//       )}
//
//       {/* Grids */}
//       <TabsContent value="all">
//         <div className="container mx-auto py-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredAndSortedCampaigns.map(c => (
//               <CampaignCard
//                 key={c._id}
//                 campaign={c}
//                 onEdit={(id) => router.push(`/campaigns/${id}`)}
//                 onDelete={(id) => console.log('delete', id)}
//                 onOpen={(id) => router.push(`/campaigns/${id}`)}
//               />
//             ))}
//           </div>
//         </div>
//       </TabsContent>
//
//       <TabsContent value="recommended">
//         <div className="container mx-auto py-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredAndSortedCampaigns.slice(0, 2).map(c => (
//               <CampaignCard
//                 key={c._id}
//                 campaign={c}
//                 onEdit={(id) => router.push(`/campaigns/${id}`)}
//                 onDelete={(id) => console.log('delete', id)}
//                 onOpen={(id) => router.push(`/campaigns/${id}`)}
//               />
//             ))}
//           </div>
//         </div>
//       </TabsContent>
//     </Tabs>
//   );
// }
//
//
"use client"
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignApi } from "@/lib/data/campaigns";
import { projectProposalsApi } from "@/lib/data/projectProposals";
import { Campaign } from "@/types/campaigns/campaignTypes";
import CampaignCard from "./CampaignCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { RiAddLine, RiCloseLine, RiFilterLine, RiSearchLine } from "@remixicon/react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CreateProjectForm from "@/components/Dashboard/showcase/CreateProjectForm";
import { EditCampaignModal } from "./EditCampaignModal";
import { useAuth } from "@/hooks/store/auth/useAuth";
import {
  canManageCampaign as campaignManageableByUser,
  canSeeCampaignOnDashboardForActor,
} from "@/lib/campaignPermissions";
import {
  decodeJwtPayload,
  getAccountTypeFromPayload,
  getEmailFromPayload,
  getUserIdStringFromPayload,
} from "@/lib/jwtPayload";
import { DASHBOARD_TABS_LIST_TWO_UP_CLASS } from "@/components/layout/DashboardPageShell";

interface CampaignListProps {
  onOpenCreateCampaign?: () => void;
}

export default function CampaignList({ onOpenCreateCampaign }: CampaignListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedTeamNames, setSelectedTeamNames] = useState<string[]>([]);
  const [selectedMilestoneCategories, setSelectedMilestoneCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 500000]);
  const [projectWizardCampaignId, setProjectWizardCampaignId] = useState<number | null>(null);
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);

  /** Store may be empty on first paint; axios still reads localStorage — match that for ownership checks. */
  const effectiveToken =
    token ??
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const tokenPayload = useMemo(
    () => decodeJwtPayload(effectiveToken),
    [effectiveToken]
  );

  const campaignActor = useMemo(
    () => ({
      userId: String(user?.id ?? getUserIdStringFromPayload(tokenPayload) ?? "").trim(),
      emailLower: String(user?.email ?? getEmailFromPayload(tokenPayload) ?? "")
        .trim()
        .toLowerCase(),
    }),
    [user?.id, user?.email, tokenPayload]
  );

  const canManageCampaign = (campaign: Campaign) =>
    campaignManageableByUser(campaign, campaignActor);

  const accountType = useMemo(() => {
    const userAny = user as { accountType?: string; account?: { accountType?: string } } | null;
    const direct = userAny?.accountType ?? userAny?.account?.accountType;
    if (direct) return String(direct).trim();
    return getAccountTypeFromPayload(tokenPayload);
  }, [user, tokenPayload]);
  /** Business / Individual / other non-creator → job flow; Creator → project flow. */
  const isCreatorAccount = accountType.toLowerCase() === "creator";
  const usePrimaryCreateJob = !isCreatorAccount;

  const { data: mySentProposals = [] } = useQuery({
    queryKey: ["my-showcase-proposals"],
    queryFn: () => projectProposalsApi.getMine(),
    enabled: !isCreatorAccount,
    staleTime: 0,
    refetchOnMount: true,
  });

  const acceptedProposalCampaignIds = useMemo(() => {
    const ids = new Set<number>();
    if (isCreatorAccount) return ids;
    for (const p of mySentProposals) {
      if (String(p.status ?? "").toLowerCase() !== "accepted") continue;
      if (!p.project?.id) continue;
      const raw = p.project.campaign_id ?? p.project.campaignId;
      if (raw == null || raw === "") continue;
      const cid = Number(raw);
      if (Number.isFinite(cid) && cid > 0) ids.add(Math.floor(cid));
    }
    return ids;
  }, [mySentProposals, isCreatorAccount]);

  const handleCampaignPrimaryCta = (campaignId: number) => {
    if (isCreatorAccount) {
      setProjectWizardCampaignId(campaignId);
      return;
    }
    router.push(`/jobs?createJob=1&campaignId=${campaignId}`);
  };

  // Fetch campaigns from backend
  const {
    data: campaigns = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignApi.getAll(),
    staleTime: 0,
    // Ensure ownership changes in DB show up immediately (avoid stale cache
    // causing "modal shows more than list" discrepancies).
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // If ownership identity becomes available after first paint (rehydration),
  // force a fresh fetch so edit/delete buttons are consistent.
  useEffect(() => {
    void refetch();
  }, [refetch, campaignActor.userId, campaignActor.emailLower]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: campaignApi.delete,
    onSuccess: () => {
      toast.success("Campaign deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to delete campaign");
    }
  });

  // Extract unique team names from actual data (new campaigns may omit teams[])
  const allTeamNames = useMemo(() => {
    return Array.from(
      new Set(campaigns.flatMap((c) => (c.teams ?? []).map((t) => t.name)))
    );
  }, [campaigns]);

  const allMilestoneCategories = ["Major Milestone", "Minor Milestone"];

  // Filter and sort campaigns (client-side)
  const filteredAndSortedCampaigns = useMemo(() => {
    const filtered = campaigns.filter(c => {
      /**
       * Creators: own campaign or team roster.
       * Brands: own campaign, or campaign id tied to an accepted showcase proposal (project.campaign_id).
       */
      const isMineOrCollaborator = canSeeCampaignOnDashboardForActor(c, campaignActor, {
        isCreatorAccount,
        acceptedProposalCampaignIds,
      });

      const matchesSearch = !searchTerm ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Treat missing `active` as true (matches new API rows / partial payloads)
      const activeLabel = (c.active ?? true) ? "Active" : "Inactive";
      const matchesActive =
        isMineOrCollaborator ||
        selectedActive.length === 0 ||
        selectedActive.includes(activeLabel);

      const teams = c.teams ?? [];
      const milestones = c.milestones ?? [];

      const matchesTeams =
        isMineOrCollaborator ||
        selectedTeamNames.length === 0 ||
        teams.some((t) => selectedTeamNames.includes(t.name));

      const matchesMilestoneCategory =
        isMineOrCollaborator ||
        selectedMilestoneCategories.length === 0 ||
        milestones.some(
          (m) => m.category && selectedMilestoneCategories.includes(m.category)
        );

      const budget = Number(c.budget) || 0;
      const matchesBudget =
        isMineOrCollaborator ||
        (budget >= budgetRange[0] && budget <= budgetRange[1]);

      return matchesSearch && matchesActive && matchesTeams && matchesMilestoneCategory && matchesBudget;
    });

    const sortTime = (c: Campaign) => {
      const t = c.createdAt ? new Date(c.createdAt).getTime() : NaN;
      return Number.isFinite(t) ? t : 0;
    };

    // Sort campaigns
    filtered.sort((a, b) => {
      if (sortBy === "budget-high")
        return (Number(b.budget) || 0) - (Number(a.budget) || 0);
      if (sortBy === "budget-low")
        return (Number(a.budget) || 0) - (Number(b.budget) || 0);
      if (sortBy === "recent") return sortTime(b) - sortTime(a) || b.id - a.id;
      return 0;
    });

    return filtered;
  }, [
    campaigns,
    campaignActor,
    isCreatorAccount,
    acceptedProposalCampaignIds,
    searchTerm,
    sortBy,
    selectedActive,
    selectedTeamNames,
    selectedMilestoneCategories,
    budgetRange,
  ]);

  const toggleFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (arr.includes(value)) setArr(arr.filter(x => x !== value));
    else setArr([...arr, value]);
  };

  const clearAll = () => {
    setSearchTerm("");
    setSortBy("recent");
    setSelectedActive([]);
    setSelectedTeamNames([]);
    setSelectedMilestoneCategories([]);
    setBudgetRange([0, 500000]);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      deleteMutation.mutate(id);
    }
  };

  const activeFiltersCount = selectedActive.length + selectedTeamNames.length + selectedMilestoneCategories.length;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">Failed to load campaigns</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['campaigns'] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full min-w-0 space-y-3">
      <TabsList className={DASHBOARD_TABS_LIST_TWO_UP_CLASS}>
        <TabsTrigger value="all" className="text-xs sm:text-sm">
          All Campaigns
        </TabsTrigger>
        <TabsTrigger value="recommended" className="text-xs sm:text-sm">
          Recommended
        </TabsTrigger>
      </TabsList>

      {/* Header with search & filters */}
      <div className="sticky top-0 z-10 mt-1 border-b border-border/80 bg-background/95 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:mt-3">
        <div className="w-full max-w-full px-0 py-0 sm:px-0">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Campaigns</h1>
              <p className="mt-1 text-muted-foreground">{filteredAndSortedCampaigns.length} campaigns</p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
              {usePrimaryCreateJob && (
                <Button variant="outline" onClick={() => router.push("/jobs?createJob=1")}>
                  Create Job
                </Button>
              )}
              <Button onClick={() => (onOpenCreateCampaign ? onOpenCreateCampaign() : router.push('/campaigns/new'))}>
                <RiAddLine className='h-5 w-5' />
                Create Campaign
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <RiSearchLine className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campaigns..."
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="budget-high">Highest Budget</SelectItem>
                <SelectItem value="budget-low">Lowest Budget</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative flex items-center">
                  <RiFilterLine className="w-5 h-5" />
                  <span className="font-medium">Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full max-w-md p-6 overflow-y-auto">
                <SheetHeader className="mb-6 px-0!">
                  <SheetTitle className="text-2xl font-bold">Filter Campaigns</SheetTitle>
                </SheetHeader>

                <div className="space-y-8">
                  {/* Active Status */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg font-semibold">Status</Label>
                      {selectedActive.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedActive([])}>Clear</Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {["Active", "Inactive"].map(s => (
                        <div key={s} className="flex items-center space-x-3">
                          <Checkbox
                            id={s}
                            checked={selectedActive.includes(s)}
                            onCheckedChange={() => toggleFilter(selectedActive, setSelectedActive, s)}
                            className="h-5 w-5"
                          />
                          <Label htmlFor={s} className="cursor-pointer">{s}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teams */}
                  {allTeamNames.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-lg font-semibold">Teams</Label>
                        {selectedTeamNames.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTeamNames([])}>Clear</Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {allTeamNames.map(name => (
                          <div key={name} className="flex items-center space-x-3">
                            <Checkbox
                              id={name}
                              checked={selectedTeamNames.includes(name)}
                              onCheckedChange={() => toggleFilter(selectedTeamNames, setSelectedTeamNames, name)}
                              className="h-5 w-5"
                            />
                            <Label htmlFor={name} className="cursor-pointer">{name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestone Category */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg font-semibold">Milestone Category</Label>
                      {selectedMilestoneCategories.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMilestoneCategories([])}>Clear</Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {allMilestoneCategories.map(cat => (
                        <div key={cat} className="flex items-center space-x-3">
                          <Checkbox
                            id={cat}
                            checked={selectedMilestoneCategories.includes(cat)}
                            onCheckedChange={() => toggleFilter(selectedMilestoneCategories, setSelectedMilestoneCategories, cat)}
                            className="h-5 w-5"
                          />
                          <Label htmlFor={cat} className="cursor-pointer">{cat}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <Label className="text-lg font-semibold">
                      Budget Range: KSh {budgetRange[0].toLocaleString()} - KSh {budgetRange[1].toLocaleString()}
                    </Label>
                    <Slider
                      min={0}
                      max={500000}
                      step={5000}
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      className="mt-4"
                    />
                  </div>

                  {/* Clear All */}
                  {activeFiltersCount > 0 && (
                    <Button onClick={clearAll} variant="outline" className="w-full py-3 border-2">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedActive.map(s => (
              <Badge key={s} variant="secondary" className="gap-1 p-1">
                {s}
                <RiCloseLine
                  className='cursor-pointer ml-1 h-4 w-4'
                  onClick={() => toggleFilter(selectedActive, setSelectedActive, s)}
                />
              </Badge>
            ))}
            {selectedTeamNames.map(n => (
              <Badge key={n} variant="secondary" className="gap-1 p-1">
                {n}
                <RiCloseLine
                  className='cursor-pointer ml-1 h-4 w-4'
                  onClick={() => toggleFilter(selectedTeamNames, setSelectedTeamNames, n)}
                />
              </Badge>
            ))}
            {selectedMilestoneCategories.map(cat => (
              <Badge key={cat} variant="secondary" className="gap-1 p-1">
                {cat}
                <RiCloseLine
                  className='cursor-pointer ml-1 h-4 w-4'
                  onClick={() => toggleFilter(selectedMilestoneCategories, setSelectedMilestoneCategories, cat)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Grids */}
      <TabsContent value="all">
        <div className="container mx-auto py-6">
          {filteredAndSortedCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No campaigns found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedCampaigns.map(c => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onEdit={canManageCampaign(c) ? (id) => setEditingCampaignId(id) : undefined}
                  onDelete={canManageCampaign(c) ? handleDelete : undefined}
                  onOpen={(id) => router.push(`/campaigns/${id}`)}
                  onAddProject={canManageCampaign(c) ? handleCampaignPrimaryCta : undefined}
                  primaryCtaLabel={usePrimaryCreateJob ? "Create a job" : "Create Project"}
                />
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="recommended">
        <div className="container mx-auto py-6">
          {filteredAndSortedCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recommended campaigns</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedCampaigns.slice(0, 3).map(c => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onEdit={canManageCampaign(c) ? (id) => setEditingCampaignId(id) : undefined}
                  onDelete={canManageCampaign(c) ? handleDelete : undefined}
                  onOpen={(id) => router.push(`/campaigns/${id}`)}
                  onAddProject={canManageCampaign(c) ? handleCampaignPrimaryCta : undefined}
                  primaryCtaLabel={usePrimaryCreateJob ? "Create a job" : "Create Project"}
                />
              ))}
            </div>
          )}
        </div>
      </TabsContent>
      {/* Project creation modal scoped to campaign list */}
      {projectWizardCampaignId !== null && (
        <CreateProjectForm
          initialCampaignId={projectWizardCampaignId}
          mode="embedded"
          onClose={() => setProjectWizardCampaignId(null)}
        />
      )}
      {/* Edit campaign modal */}
      <EditCampaignModal
        open={editingCampaignId !== null}
        onOpenChange={(open) => !open && setEditingCampaignId(null)}
        campaignId={editingCampaignId}
      />
    </Tabs>
  );
}
