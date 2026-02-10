// "use client"
// import { useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { mockCampaigns } from "@/lib/data/campaigns";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { CopyButton } from "@/components/ui/shadcn-io/copy-button";
// import { RiSearch2Line } from "@remixicon/react";
// import FeedBackTab from "./feedBack";
//
// export default function CampaignDetails({ id }: { id: string }) {
//   const router = useRouter();
//
//   const { campaign, index } = useMemo(() => {
//     const idx = mockCampaigns.findIndex(c => c._id === id);
//     return { campaign: idx >= 0 ? mockCampaigns[idx] : mockCampaigns[0], index: idx >= 0 ? idx : 0 };
//   }, [id]);
//
//   if (!campaign) return null;
//
//   const shareUrl = `https://paza.com/campaigns/${campaign._id}`;
//
//   const percentComplete = (() => {
//     const milestones = campaign.milestones || [];
//     if (milestones.length === 0) return 0;
//     const completed = milestones.filter(m => m.status === 'Completed').length;
//     return Math.round((completed / milestones.length) * 100);
//   })();
//
//   return (
//     <div className="space-y-4 pb-3">
//       <div className="relative h-80 w-full overflow-hidden border-b">
//         <img src={`https://picsum.photos/seed/${campaign._id}/1200/400`} alt={campaign.title} className="h-full w-full object-cover" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
//         <div className="absolute bottom-0 left-0 right-0 p-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl md:text-3xl font-bold text-white">{campaign.title}</h1>
//             <Badge className="bg-primary text-white">{campaign.active ? 'Active' : 'Inactive'}</Badge>
//           </div>
//         </div>
//       </div>
//
//       <div className="grid grid-cols-1 px-3 lg:grid-cols-3 gap-6">
//         {/* Left column */}
//         <div className="lg:col-span-2 space-y-4">
//           <Tabs defaultValue="description">
//             <TabsList className="h-12 mb-2">
//               <TabsTrigger value="description">Description</TabsTrigger>
//               <TabsTrigger value="tasks">Tasks</TabsTrigger>
//               <TabsTrigger value="feedback">Feedback</TabsTrigger>
//             </TabsList>
//
//             <TabsContent value="description">
//               <Card className="!p-0">
//                 <CardContent className="p-6">
//                   <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
//                   {campaign.goals && campaign.goals.length > 0 && (
//                     <div className="mt-4">
//                       <h3 className="font-semibold mb-2">Goals</h3>
//                       <div className="flex flex-wrap gap-2">
//                         {campaign.goals.map((g, i) => (<Badge key={i} variant="secondary">{g}</Badge>))}
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//
//             <TabsContent value="tasks">
//               <Card className="!p-0">
//                 <CardContent className="p-6 space-y-3">
//                   {(campaign.milestones || []).map((m, i) => (
//                     <div key={i} className="border rounded-md p-3">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-semibold">{m.title}</p>
//                           <p className="text-xs text-muted-foreground">{m.description}</p>
//                         </div>
//                         <Badge variant={m.status === 'Completed' ? 'default' : 'secondary'}>{m.status || 'In Progress'}</Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//
//             <TabsContent value="feedback">
//               <Card className="!p-0">
//                 <CardContent className="p-6 space-y-4">
//                   {(campaign.feedback || []).length === 0 && (
//                     <p className="text-sm text-muted-foreground">No feedback yet.</p>
//                   )}
//                   {(campaign.feedback || []).map((f, i) => (
//                     <div key={i} className="border rounded-md p-3">
//                       <p className="text-sm">{f.feedback}</p>
//                       <p className="text-xs text-muted-foreground mt-1">{f.name} {f.email ? `• ${f.email}` : ''}</p>
//                     </div>
//                   ))}
//                   <FeedBackTab />
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//
//         {/* Right column */}
//         <div className="space-y-4">
//           <Card className="!p-0">
//             <CardContent className="p-6 space-y-4">
//               <div>
//                 <p className="text-sm font-medium">Completion</p>
//                 <Progress value={percentComplete} />
//                 <p className="text-xs text-muted-foreground mt-1">{percentComplete}% complete</p>
//               </div>
//               <Button className="w-full">Link Campaign</Button>
//
//               <Tabs defaultValue="teams">
//                 <TabsList className="w-full">
//                   <TabsTrigger value="teams" className="flex-1">Teams</TabsTrigger>
//                   <TabsTrigger value="referral" className="flex-1">Referral</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="teams">
//                   <div className="space-y-2 pt-2">
//                     {(campaign.teams || []).map((t, i) => (
//                       <div key={i} className="border rounded-md p-3">
//                         <p className="font-semibold">{t.name}</p>
//                         <p className="text-xs text-muted-foreground">{t.members?.length || 0} member(s)</p>
//                       </div>
//                     ))}
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="referral">
//                   <div className="space-y-2 pt-2">
//                     <h1>Refferals</h1>
//                     <p className="text-sm text-muted-foreground">Invite your partners or share referral links.</p>
//                     <div className="flex items-center gap-2 relative">
//                       <RiSearch2Line className="absolute left-3 text-muted-foreground h-4 w-4"/>
//                       <input className="flex-1  ps-8 py-2 border rounded-md" placeholder="Search for a partner"/>
//                     </div>
//                     <p className="text-sm text-muted-foreground">Share referral links.</p>
//                     <div className="flex items-center gap-2">
//                       <input 
//                         value={shareUrl} 
//                         readOnly 
//                         className="flex-1 px-3 py-2 border rounded-md"
//                       />
//                       <CopyButton 
//                         content={shareUrl}
//                         className="h-10 w-10"
//                         onCopy={() => console.log("Link copied!")}
//                       />
//                     </div>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
//
//

"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { campaignApi } from "@/lib/data/campaigns";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/shadcn-io/copy-button";
import { RiSearch2Line } from "@remixicon/react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import FeedBackTab from "./feedBack";

interface CampaignDetailsProps {
  id: string;
}
export default function CampaignDetails({ id }: CampaignDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const campaignId = parseInt(id); // Convert string ID to number

  // Fetch campaign details
  const { data: campaign, isLoading, isError } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => campaignApi.getById(campaignId),
    enabled: !isNaN(campaignId), // Only fetch if ID is valid
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: (active: boolean) => campaignApi.toggleActive(campaignId, active),
    onSuccess: () => {
      toast.success("Campaign status updated");
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (isError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">Campaign not found</p>
        <Button onClick={() => router.push('/campaigns')}>Back to Campaigns</Button>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/campaigns/${campaign.id}`;

  // Calculate completion percentage
  const percentComplete = (() => {
    const milestones = campaign.milestones || [];
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'Completed').length;
    return Math.round((completed / milestones.length) * 100);
  })();

  return (
    <div className="space-y-4 pb-3">
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden border-b">
        <img
          src={`https://picsum.photos/seed/${campaign.id}/1200/400`}
          alt={campaign.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{campaign.title}</h1>
            <Badge
              className={`cursor-pointer ${campaign.active ? 'bg-green-600' : 'bg-gray-600'} text-white`}
              onClick={() => toggleActiveMutation.mutate(!campaign.active)}
            >
              {toggleActiveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                campaign.active ? 'Active' : 'Inactive'
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 px-3 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="description">
            <TabsList className="h-12 mb-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="tasks">Tasks ({campaign.milestones?.length || 0})</TabsTrigger>
              <TabsTrigger value="feedback">Feedback ({campaign.feedback?.length || 0})</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description">
              <Card className="!p-0">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {campaign.description || "No description provided."}
                  </p>

                  {campaign.goals && campaign.goals.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Goals</h3>
                      <div className="flex flex-wrap gap-2">
                        {campaign.goals.map((g, i) => (
                          <Badge key={i} variant="secondary">{g}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-semibold">
                          KSh {campaign.budget ? Number(campaign.budget).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-semibold">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <Card className="!p-0">
                <CardContent className="p-6 space-y-3">
                  {campaign.milestones && campaign.milestones.length > 0 ? (
                    campaign.milestones.map((m) => (
                      <div key={m.id} className="border rounded-md p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{m.title}</p>
                              {m.category && (
                                <Badge variant="outline" className="text-xs">
                                  {m.category}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{m.description}</p>
                          </div>
                          <Badge variant={m.status === 'Completed' ? 'default' : 'secondary'}>
                            {m.status}
                          </Badge>
                        </div>

                        {m.objectives && m.objectives.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-1">Objectives:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {m.objectives.map((obj, i) => (
                                <li key={i}>• {obj}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          {m.start && (
                            <span>Start: {new Date(m.start).toLocaleDateString()}</span>
                          )}
                          {m.end && (
                            <span>End: {new Date(m.end).toLocaleDateString()}</span>
                          )}
                          {m.budget && (
                            <span>Budget: KSh {Number(m.budget).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No milestones added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <Card className="!p-0">
                <CardContent className="p-6 space-y-4">
                  {campaign.feedback && campaign.feedback.length > 0 ? (
                    campaign.feedback.map((f) => (
                      <div key={f.id} className="border rounded-md p-4">
                        <p className="text-sm mb-2">{f.feedback}</p>
                        {f.desc && (
                          <p className="text-xs text-muted-foreground mb-2">{f.desc}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {f.name && <span>{f.name}</span>}
                          {f.email && <span>• {f.email}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No feedback yet.
                    </p>
                  )}
                  <FeedBackTab campaignId={campaignId} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="!p-0">
            <CardContent className="p-6 space-y-4">
              {/* Completion Progress */}
              <div>
                <p className="text-sm font-medium mb-2">Completion</p>
                <Progress value={percentComplete} />
                <p className="text-xs text-muted-foreground mt-1">
                  {percentComplete}% complete • {campaign.milestones?.filter(m => m.status === 'Completed').length || 0} of {campaign.milestones?.length || 0} milestones
                </p>
              </div>

              <Button
                className="w-full"
                onClick={() => router.push(`/campaigns/${campaign.id}/link`)}
              >
                Link Campaign
              </Button>

              {/* Teams & Referral Tabs */}
              <Tabs defaultValue="teams">
                <TabsList className="w-full">
                  <TabsTrigger value="teams" className="flex-1">
                    Teams ({campaign.teams?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="referral" className="flex-1">Referral</TabsTrigger>
                </TabsList>

                {/* Teams Tab */}
                <TabsContent value="teams">
                  <div className="space-y-2 pt-2">
                    {campaign.teams && campaign.teams.length > 0 ? (
                      campaign.teams.map((t) => (
                        <div key={t.id} className="border rounded-md p-3">
                          <p className="font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.members?.length || 0} member(s)
                          </p>
                          {t.members && t.members.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {t.members.map((member) => (
                                <div key={member.id} className="text-xs flex items-center gap-2">
                                  <span>{member.name}</span>
                                  <span className="text-muted-foreground">• {member.email}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No teams added yet.
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Referral Tab */}
                <TabsContent value="referral">
                  <div className="space-y-2 pt-2">
                    <h1 className="font-semibold">Referrals</h1>
                    <p className="text-sm text-muted-foreground">
                      Invite your partners or share referral links.
                    </p>

                    <div className="flex items-center gap-2 relative">
                      <RiSearch2Line className="absolute left-3 text-muted-foreground h-4 w-4" />
                      <input
                        className="flex-1 ps-8 py-2 border rounded-md"
                        placeholder="Search for a partner"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground pt-2">Share referral link:</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <CopyButton
                        content={shareUrl}
                        className="h-10 w-10"
                        onCopy={() => toast.success("Link copied to clipboard!")}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
