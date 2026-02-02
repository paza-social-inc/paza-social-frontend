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
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignApi } from "@/lib/data/campaigns";
import { Campaign } from "@/types/campaign";
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

export default function CampaignList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedTeamNames, setSelectedTeamNames] = useState<string[]>([]);
  const [selectedMilestoneCategories, setSelectedMilestoneCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 500000]);

  // Fetch campaigns from backend
  const { data: campaigns = [], isLoading, isError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignApi.getAll(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: campaignApi.delete,
    onSuccess: () => {
      toast.success("Campaign deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete campaign");
    }
  });

  // Extract unique team names from actual data
  const allTeamNames = useMemo(() => {
    return Array.from(new Set(campaigns.flatMap(c => c.teams.map(t => t.name))));
  }, [campaigns]);

  const allMilestoneCategories = ["Major Milestone", "Minor Milestone"];

  // Filter and sort campaigns (client-side)
  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns.filter(c => {
      const matchesSearch = !searchTerm ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesActive = selectedActive.length === 0 || 
        selectedActive.includes(c.active ? "Active" : "Inactive");

      const matchesTeams = selectedTeamNames.length === 0 ||
        c.teams.some(t => selectedTeamNames.includes(t.name));

      const matchesMilestoneCategory = selectedMilestoneCategories.length === 0 ||
        c.milestones.some(m => m.category && selectedMilestoneCategories.includes(m.category));

      const budget = Number(c.budget) || 0;
      const matchesBudget = budget >= budgetRange[0] && budget <= budgetRange[1];

      return matchesSearch && matchesActive && matchesTeams && matchesMilestoneCategory && matchesBudget;
    });

    // Sort campaigns
    filtered.sort((a, b) => {
      if (sortBy === 'budget-high') return (Number(b.budget) || 0) - (Number(a.budget) || 0);
      if (sortBy === 'budget-low') return (Number(a.budget) || 0) - (Number(b.budget) || 0);
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return filtered;
  }, [campaigns, searchTerm, sortBy, selectedActive, selectedTeamNames, selectedMilestoneCategories, budgetRange]);

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
    <Tabs defaultValue="all" className="full p-3">
      <TabsList className="md:min-w-xs h-10">
        <TabsTrigger value="all">All Campaigns</TabsTrigger>
        <TabsTrigger value="recommended">Recommended</TabsTrigger>
      </TabsList>

      {/* Header with search & filters */}
      <div className="bg-background border sticky top-0 z-10 shadow-sm mt-3">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <p className="text-muted-foreground mt-1">{filteredAndSortedCampaigns.length} campaigns</p>
            </div>
            <Button onClick={() => router.push('/campaigns/create')}>
              <RiAddLine className='h-5 w-5' />
              Create Campaign
            </Button>
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
                <SheetHeader className="mb-6 !px-0">
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
                  onEdit={(id) => router.push(`/campaigns/${id}/edit`)}
                  onDelete={handleDelete}
                  onOpen={(id) => router.push(`/campaigns/${id}`)}
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
                  onEdit={(id) => router.push(`/campaigns/${id}/edit`)}
                  onDelete={handleDelete}
                  onOpen={(id) => router.push(`/campaigns/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
