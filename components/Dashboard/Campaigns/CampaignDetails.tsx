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
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { campaignApi, parseCampaignId } from "@/lib/data/campaigns";
import { fetchAuthMe } from "@/lib/data/auth";
import { jobsApi } from "@/lib/data/jobs";
import { projectsApi } from "@/lib/data/projects";
import { usersApi } from "@/lib/data/users";
import { messagesApi } from "@/lib/data/messages";
import { tasksApi } from "@/lib/data/tasks";
import { EscrowListItem, escrowPaymentsApi } from "@/lib/data/escrowPayments";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { decodeJwtPayload, getAccountTypeFromPayload } from "@/lib/jwtPayload";
import type { Job } from "@/types/jobs/jobTypes";
import type { Project } from "@/types/projects/projectTypes";
import type {
  Campaign,
  CampaignFeedback,
  CampaignGoalDetail,
  CampaignTeam,
  CampaignTeamMember,
} from "@/types/campaigns/campaignTypes";
import type { Message as ApiMessage } from "@/types/messages/messageTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/ui/shadcn-io/copy-button";
import { RiArrowRightSLine, RiSearch2Line, RiHandCoinLine, RiHistoryLine } from "@remixicon/react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Loader2,
  MessageCircle,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import FeedBackTab from "./feedBack";
import CreateProjectForm from "@/components/Dashboard/showcase/CreateProjectForm";
import { CampaignTasksBoard } from "./CampaignTasksBoard";
import { EditCampaignModal } from "./EditCampaignModal";
import {
  CampaignTargetDeadlineModal,
  formatCampaignDeadlineDisplay,
} from "./CampaignTargetDeadlineModal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import EscrowDetailsModal from "@/components/Dashboard/payments/EscrowDetailsModal";

/** Active tab: thin orange outline + inset left bar (readable in dark mode). */
const CAMPAIGN_TAB_TRIGGER_CLASS =
  "relative shrink-0 whitespace-nowrap rounded-lg border border-transparent px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all sm:flex-1 sm:text-sm " +
  "data-[state=inactive]:opacity-75 " +
  "data-[state=active]:z-10 data-[state=active]:border-orange-500/90 data-[state=active]:!bg-orange-500/15 data-[state=active]:!text-foreground " +
  "data-[state=active]:font-semibold data-[state=active]:shadow-[inset_4px_0_0_0_rgb(249_115_22)] " +
  "dark:data-[state=active]:!bg-orange-500/20 dark:data-[state=active]:!text-white " +
  "dark:data-[state=active]:shadow-[inset_4px_0_0_0_rgb(251_146_60)]";

/**
 * For brand views we show campaign.creator in Members even when not on team.members; keep the
 * team card count aligned with that list.
 */
function displayedTeamMemberCount(
  team: CampaignTeam,
  campaign: Campaign | null | undefined,
  addVirtualCampaignCreator: boolean
): number {
  const raw = team.members?.length ?? 0;
  if (!addVirtualCampaignCreator) return raw;
  const crEmail = String(campaign?.creator?.email ?? "").trim().toLowerCase();
  if (!crEmail) return raw;
  const creatorOnRoster = (team.members ?? []).some(
    (m) => String(m.email ?? "").trim().toLowerCase() === crEmail
  );
  return creatorOnRoster ? raw : raw + 1;
}

function feedbackAuthorInitials(displayName: string, email?: string): string {
  const n = displayName.trim();
  if (n && n !== "Anonymous") {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  }
  const e = email?.trim();
  if (e) return e.slice(0, 2).toUpperCase();
  return "?";
}

function formatLinkedCampaignBudget(c: Campaign): string {
  const b = c.budget;
  if (b == null || b === "") return "—";
  const n = typeof b === "number" ? b : Number(b);
  if (!Number.isFinite(n)) return String(b);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function linkedCampaignCreatorLabel(c: Campaign): string {
  const raw = [c.creator?.firstName, c.creator?.lastName].filter(Boolean).join(" ").trim();
  if (raw) return raw;
  if (c.creator?.email) return c.creator.email;
  return "—";
}

interface CampaignDetailsProps {
  id: string;
}

type DraftTeamMember = {
  name: string;
  email: string;
  role: "Lead" | "Admin" | "Member";
  /** Backend sends a signup email after the team is created if no user exists for this address. */
  sendSignupInvite?: boolean;
};

export default function CampaignDetails({ id }: CampaignDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  const campaignId = parseInt(id); // Convert string ID to number
  const [shareUrl, setShareUrl] = useState("");
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamMemberQuery, setNewTeamMemberQuery] = useState("");
  const [newTeamMembers, setNewTeamMembers] = useState<DraftTeamMember[]>([]);
  const [inviteNonUserName, setInviteNonUserName] = useState("");
  const [inviteNonUserEmail, setInviteNonUserEmail] = useState("");
  const [editTeamOpen, setEditTeamOpen] = useState(false);
  const [editTeamId, setEditTeamId] = useState<number | null>(null);
  const [editTeamNameValue, setEditTeamNameValue] = useState("");
  const [teamDetailOpen, setTeamDetailOpen] = useState(false);
  const [teamDetailTeam, setTeamDetailTeam] = useState<CampaignTeam | null>(null);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [editingGoalDetailIndex, setEditingGoalDetailIndex] = useState<number | null>(null);
  const [editingGoalTargetValue, setEditingGoalTargetValue] = useState("");
  const [editingGoalDeadlineValue, setEditingGoalDeadlineValue] = useState("");
  const [editingGoalDescriptionValue, setEditingGoalDescriptionValue] = useState("");
  const [goalTargetModalOpen, setGoalTargetModalOpen] = useState(false);
  const budgetSectionRef = useRef<HTMLDivElement>(null);
  const [budgetBreakdownOpen, setBudgetBreakdownOpen] = useState(false);
  const [selectedEscrowId, setSelectedEscrowId] = useState<number | null>(null);
  const [escrowDetailsOpen, setEscrowDetailsOpen] = useState(false);
  const [editCampaignOpen, setEditCampaignOpen] = useState(false);
  const [addMemberQuery, setAddMemberQuery] = useState("");
  const [addInviteName, setAddInviteName] = useState("");
  const [addInviteEmail, setAddInviteEmail] = useState("");
  const [memberChatOpen, setMemberChatOpen] = useState(false);
  const [memberChatDraft, setMemberChatDraft] = useState("");
  const [memberChatConversationId, setMemberChatConversationId] = useState<string | null>(null);
  const [memberChatTarget, setMemberChatTarget] = useState<{
    name: string;
    email: string;
    userId?: string;
  } | null>(null);

  const effectiveToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const tokenPayload = useMemo(
    () => decodeJwtPayload(effectiveToken),
    [effectiveToken]
  );

  const ownerId =
    user?.id != null && String(user.id).trim() !== ""
      ? Number(user.id)
      : NaN;

  const { data: authMe } = useQuery({
    queryKey: ["auth-me"],
    queryFn: fetchAuthMe,
    enabled: !!effectiveToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  /** DB (/api/auth/me) first — fixes old JWTs without accountType; then store, then JWT. */
  const accountType = useMemo(() => {
    if (authMe?.accountType) return String(authMe.accountType).trim();
    const userAny = user as { accountType?: string; account?: { accountType?: string } } | null;
    const direct = userAny?.accountType ?? userAny?.account?.accountType;
    if (direct) return String(direct).trim();
    return getAccountTypeFromPayload(tokenPayload);
  }, [authMe, user, tokenPayload]);

  const isCreatorAccount = accountType.toLowerCase() === "creator";

  // Fetch campaign details (needed for owner + creator.accountType fallback)
  const { data: campaign, isLoading, isError } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => campaignApi.getById(campaignId),
    enabled: !isNaN(campaignId),
  });

  /** Dedicated list so owner always sees everyone’s feedback (same rows as GET /campaigns/:id/feedback). */
  const { data: feedbackEntries } = useQuery({
    queryKey: ["campaign-feedback", campaignId],
    queryFn: () => campaignApi.getFeedback(campaignId),
    enabled: !Number.isNaN(campaignId) && campaignId > 0,
    placeholderData: campaign?.feedback,
  });

  const sortedFeedback = useMemo(() => {
    const raw: CampaignFeedback[] = Array.isArray(feedbackEntries)
      ? feedbackEntries
      : campaign?.feedback ?? [];
    return [...raw].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
    );
  }, [feedbackEntries, campaign?.feedback]);

  const viewerOwnsCampaign = useMemo(() => {
    if (!campaign || !Number.isFinite(ownerId)) return false;
    if (campaign.creatorId != null && Number(campaign.creatorId) === ownerId) return true;
    const cb = campaign.createdby;
    if (cb != null && String(cb).trim() !== "") {
      const n = Number(String(cb).trim());
      return Number.isFinite(n) && n === ownerId;
    }
    return false;
  }, [campaign, ownerId]);

  const showGoalsTargetSection = useMemo(() => {
    if (!campaign) return false;
    const details = campaign.goalDetails ?? [];
    const hasGoals = details.length > 0 || (campaign.goals?.length ?? 0) > 0;
    const hasGoalMeta = details.some(
      (g) =>
        g.targetNumber != null ||
        (g.deadline != null && String(g.deadline).trim() !== "") ||
        (g.targetDescription != null && String(g.targetDescription).trim() !== "")
    );
    return viewerOwnsCampaign || hasGoals || hasGoalMeta;
  }, [campaign, viewerOwnsCampaign]);

  const normalizedGoals = useMemo(() => {
    const details = campaign?.goalDetails ?? [];
    if (details.length > 0) {
      return details
        .map((g) => {
          const rawTarget: unknown = g?.targetNumber;
          const targetNumber =
            rawTarget == null ||
              (typeof rawTarget === "string" && rawTarget.trim() === "")
              ? null
              : Number.isFinite(Number(rawTarget))
                ? Math.trunc(Number(rawTarget))
                : null;
          return {
            goal: String(g?.goal ?? "").trim(),
            targetNumber,
            deadline:
              g?.deadline == null || String(g.deadline).trim() === ""
                ? null
                : String(g.deadline),
            targetDescription:
              g?.targetDescription == null || String(g.targetDescription).trim() === ""
                ? null
                : String(g.targetDescription).trim(),
          };
        })
        .filter((g) => g.goal.length > 0);
    }
    return (campaign?.goals ?? [])
      .map((goal) => String(goal ?? "").trim())
      .filter(Boolean)
      .map((goal) => ({
        goal,
        targetNumber: campaign?.targetNumber ?? null,
        deadline: campaign?.deadline ?? null,
        targetDescription:
          campaign?.targetDescription != null && String(campaign.targetDescription).trim() !== ""
            ? String(campaign.targetDescription).trim()
            : null,
      }));
  }, [campaign?.goalDetails, campaign?.goals, campaign?.targetNumber, campaign?.deadline, campaign?.targetDescription]);
  const visibleGoalsData = normalizedGoals.map((goalDetail, index) => ({ goalDetail, index }));

  useEffect(() => {
    setEditingGoalDetailIndex(null);
    setEditingGoalTargetValue("");
    setEditingGoalDeadlineValue("");
    setEditingGoalDescriptionValue("");
  }, [campaignId, normalizedGoals.length]);

  const campaignOwnerIsCreatorUser = campaign?.creator?.accountType === "Creator";

  /**
   * Projects (tiles): any logged-in Creator, OR viewer owns this campaign and it was created by a Creator user.
   * Jobs on overview: campaign owner sees jobs linked to this campaign (brand or creator owner).
   */
  const showProjectsSection =
    isCreatorAccount || (viewerOwnsCampaign && campaignOwnerIsCreatorUser);

  const creatorDisplayName = useMemo(() => {
    if (authMe?.firstName || authMe?.lastName) {
      return [authMe.firstName, authMe.lastName].filter(Boolean).join(" ").trim() || "Creator";
    }
    const u = user as { firstname?: string; lastname?: string; email?: string } | null;
    if (!u) return "Creator";
    const parts = [u.firstname, u.lastname].filter(Boolean);
    if (parts.length) return parts.join(" ");
    if (u.email) return u.email.split("@")[0] ?? "Creator";
    return "Creator";
  }, [authMe, user]);

  const { data: ownerJobs } = useQuery({
    queryKey: ["jobs", "owner", ownerId],
    queryFn: () => jobsApi.getByOwner(ownerId),
    enabled:
      !Number.isNaN(campaignId) &&
      viewerOwnsCampaign &&
      !isCreatorAccount &&
      Number.isFinite(ownerId) &&
      ownerId > 0,
  });

  const jobsForCampaign = useMemo(() => {
    const list = Array.isArray(ownerJobs) ? ownerJobs : [];
    return list.filter((j: Job) => {
      const cid =
        j.campaign_id ??
        j.campaignId ??
        j.sourceCampaignId ??
        j.values?.campaignId;
      return cid != null && Number(cid) === campaignId;
    });
  }, [ownerJobs, campaignId]);

  const { data: campaignEscrows = [] } = useQuery({
    queryKey: ["campaign-escrows", campaignId],
    queryFn: () => escrowPaymentsApi.getByCampaign(campaignId),
    enabled: !!campaignId,
  });

  const hiredCreators = useMemo(() => {
    // Collect all accepted proposals from all jobs linked to this campaign
    const hired: Array<{
      id: number;
      name: string;
      proposalTitle: string;
      budget: number;
      creatorId: number;
      jobId: number;
      escrow?: EscrowListItem;
    }> = [];

    jobsForCampaign.forEach(job => {
      job.proposals?.forEach(p => {
        if (p.status === "accepted") {
          const creatorId = p.proposer?.id;
          const escrow = campaignEscrows.find(e => e.seller?.id === Number(creatorId));
          hired.push({
            id: p.id!,
            name: [p.proposer?.firstname, p.proposer?.lastname].filter(Boolean).join(" ") || "Creator",
            proposalTitle: p.title || "Proposal",
            budget: Number(p.proposedBudget || 0),
            creatorId: Number(creatorId),
            jobId: job.id!,
            escrow
          });
        }
      });
    });
    return hired;
  }, [jobsForCampaign, campaignEscrows]);

  const createEscrowMutation = useMutation({
    mutationFn: ({ sellerId, milestoneIds }: { sellerId: number; milestoneIds?: number[] }) =>
      escrowPaymentsApi.createFromCampaign(campaignId, sellerId, milestoneIds),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.success("Escrow created");
        queryClient.invalidateQueries({ queryKey: ["campaign-escrows", campaignId] });
      }
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to create escrow");
    },
  });

  const jobRateLabel = useMemo(() => {
    const jobs = jobsForCampaign;
    if (!jobs.length) return "Rate on request";
    const pays = jobs
      .map((j) => {
        const extended = j as Job & { values?: { payment?: string }; payment?: string };
        return extended.values?.payment ?? extended.payment;
      })
      .filter((p): p is string => Boolean(p && String(p).trim()));
    if (!pays.length) return "Rate on request";
    return pays[0];
  }, [jobsForCampaign]);

  const { data: allProjects } = useQuery({
    queryKey: ["creator-projects"],
    queryFn: () => projectsApi.getAll(),
    enabled: !Number.isNaN(campaignId) && showProjectsSection,
  });

  const projectsForCampaign = useMemo(() => {
    const list = Array.isArray(allProjects) ? allProjects : [];
    return list.filter((p: Project) => {
      const sc = p.sourceCampaignId ?? p.campaign_id;
      return sc != null && String(sc) === String(campaignId);
    });
  }, [allProjects, campaignId]);

  /** Campaign id stored on `cocampaign` (this campaign → other). */
  const linkedOutCampaignId = useMemo(() => {
    const raw = campaign?.cocampaign;
    if (raw == null || String(raw).trim() === "") return null;
    const n = parseCampaignId(
      typeof raw === "number" ? raw : String(raw).trim()
    );
    if (n == null || n === campaignId) return null;
    return n;
  }, [campaign?.cocampaign, campaignId]);

  const {
    data: linkedOutCampaign,
    isLoading: loadingLinkedOut,
    isError: linkedOutError,
  } = useQuery({
    queryKey: ["campaign", linkedOutCampaignId],
    queryFn: () => campaignApi.getById(linkedOutCampaignId!),
    enabled:
      linkedOutCampaignId != null &&
      !Number.isNaN(campaignId) &&
      campaignId > 0,
  });

  const { data: allCampaignsForIncoming = [], isLoading: loadingIncomingCampaignLinks } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignApi.getAll(),
    enabled:
      viewerOwnsCampaign && !Number.isNaN(campaignId) && campaignId > 0,
  });

  const campaignsLinkingHere = useMemo(() => {
    const list = Array.isArray(allCampaignsForIncoming) ? allCampaignsForIncoming : [];
    return list.filter((c) => {
      if (c.id === campaignId) return false;
      const target = String(c.cocampaign ?? "").trim();
      return target !== "" && target === String(campaignId);
    });
  }, [allCampaignsForIncoming, campaignId]);

  const linkedSectionEmpty =
    !linkedOutCampaignId &&
    campaignsLinkingHere.length === 0 &&
    !loadingLinkedOut &&
    !(viewerOwnsCampaign && loadingIncomingCampaignLinks);

  /**
   * Creators who own this campaign or have a showcase project linked to it are not always on
   * `team.members` (brands are). They still need the full team list and collaborator roster.
   */
  const creatorSeesAllTeams = useMemo(() => {
    if (!isCreatorAccount) return false;
    if (viewerOwnsCampaign) return true;
    return projectsForCampaign.length > 0;
  }, [isCreatorAccount, viewerOwnsCampaign, projectsForCampaign.length]);

  const viewerEmail = useMemo(
    () => String(authMe?.email ?? user?.email ?? "").trim().toLowerCase(),
    [authMe?.email, user?.email]
  );

  /** Brands: only teams they are on. Eligible creators: every team on the campaign. */
  const myTeams = useMemo(() => {
    const all = campaign?.teams ?? [];
    if (creatorSeesAllTeams) return all;
    if (!viewerEmail) return [];
    return all.filter((team) =>
      (team.members ?? []).some(
        (m) => String(m.email ?? "").trim().toLowerCase() === viewerEmail
      )
    );
  }, [campaign?.teams, viewerEmail, creatorSeesAllTeams]);

  /**
   * Creators: all team members (deduped), minus self. Brands: selected team’s members, plus the
   * campaign creator when not already on a team (brands expect to see the creator as a member).
   */
  const membersForDisplay = useMemo(() => {
    const teams = myTeams;
    const selectedTeam =
      teams.find((t) => t.id != null && t.id === selectedTeamId) ??
      teams[0] ??
      null;
    const selectedTeamMembers = selectedTeam?.members ?? [];
    const projectMembersTeam =
      teams.find((t) => String(t.name ?? "").toLowerCase() === "project members") ?? null;

    const unionMembers: CampaignTeamMember[] = [];
    const seenEmail = new Set<string>();
    for (const team of teams) {
      for (const m of team.members ?? []) {
        const email = String(m.email ?? "").trim().toLowerCase();
        if (!email || seenEmail.has(email)) continue;
        seenEmail.add(email);
        unionMembers.push(m);
      }
    }

    let base: CampaignTeamMember[];
    if (isCreatorAccount) {
      base = unionMembers;
    } else if (selectedTeamMembers.length > 0) {
      base = selectedTeamMembers;
    } else {
      base = projectMembersTeam?.members ?? [];
    }

    /** Brands / business: always show the campaign creator in Members when API provides them. */
    if (!isCreatorAccount) {
      const cr = campaign?.creator;
      const crEmail = String(cr?.email ?? "").trim().toLowerCase();
      if (cr && crEmail) {
        const already = base.some(
          (m) => String(m.email ?? "").trim().toLowerCase() === crEmail
        );
        if (!already) {
          const u = cr as {
            firstName?: string;
            lastName?: string;
            firstname?: string;
            lastname?: string;
            email?: string;
          };
          const name =
            [u.firstName ?? u.firstname, u.lastName ?? u.lastname]
              .filter(Boolean)
              .join(" ")
              .trim() ||
            crEmail.split("@")[0] ||
            "Creator";
          base = [{ name, email: cr.email ?? crEmail }, ...base];
        }
      }
    }

    /** Hide self only for creator accounts (collaborator list). Brands must see themselves if listed. */
    if (!viewerEmail || !isCreatorAccount) return base;
    return base.filter((m) => String(m.email ?? "").trim().toLowerCase() !== viewerEmail);
  }, [
    myTeams,
    campaign?.creator,
    selectedTeamId,
    isCreatorAccount,
    viewerEmail,
  ]);

  /** Members shown in team detail modal (brand: include campaign creator when not on roster). */
  const teamDetailMembers = useMemo((): CampaignTeamMember[] => {
    if (!teamDetailTeam) return [];
    const list = [...(teamDetailTeam.members ?? [])];
    if (!isCreatorAccount && campaign?.creator) {
      const cr = campaign.creator as {
        email?: string;
        firstName?: string;
        lastName?: string;
        firstname?: string;
        lastname?: string;
      };
      const crEmail = String(cr.email ?? "").trim().toLowerCase();
      if (crEmail && !list.some((m) => String(m.email ?? "").trim().toLowerCase() === crEmail)) {
        const name =
          [cr.firstName ?? cr.firstname, cr.lastName ?? cr.lastname].filter(Boolean).join(" ").trim() ||
          crEmail.split("@")[0] ||
          "Creator";
        list.unshift({ name, email: cr.email ?? crEmail });
      }
    }
    return list;
  }, [teamDetailTeam, campaign, isCreatorAccount]);

  const { data: campaignTasks = [] } = useQuery({
    queryKey: ["tasks", "campaign", campaignId],
    queryFn: () => tasksApi.getByCampaign(campaignId),
    enabled: !Number.isNaN(campaignId),
  });

  const overviewTaskStats = useMemo(() => {
    const list = campaignTasks ?? [];
    const completed = list.filter((t) => {
      const s = String(t.status ?? "").toLowerCase();
      return s === "done" || s === "completed";
    }).length;
    return { overall: list.length, pending: Math.max(0, list.length - completed), completed };
  }, [campaignTasks]);

  const uniqueCampaignMemberCount = useMemo(() => {
    const seen = new Set<string>();
    for (const team of myTeams) {
      for (const m of team.members ?? []) {
        const e = String(m.email ?? "").trim().toLowerCase();
        if (e) seen.add(e);
      }
    }
    if (!isCreatorAccount && campaign?.creator?.email) {
      const e = String(campaign.creator.email).trim().toLowerCase();
      if (e) seen.add(e);
    }
    return seen.size;
  }, [myTeams, campaign, isCreatorAccount]);

  const activeTeammatesOnTasks = useMemo(() => {
    const people = new Set<string>();
    for (const t of campaignTasks ?? []) {
      const st = String(t.status ?? "").toLowerCase();
      if (st === "done" || st === "completed") continue;
      const em = t.assignee?.email;
      if (em) people.add(String(em).trim().toLowerCase());
    }
    return people.size;
  }, [campaignTasks]);

  const inactiveTeammatesCount = Math.max(0, uniqueCampaignMemberCount - activeTeammatesOnTasks);

  const budgetNumbers = useMemo(() => {
    const total = Math.max(0, Number(campaign?.budget ?? 0));
    const assigned = (campaignTasks ?? []).reduce((sum, t) => {
      const raw = String(t.budgetKsh ?? "").replace(/,/g, "").trim();
      const n = parseFloat(raw);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
    const unassigned = Math.max(0, total - assigned);
    const pct = total > 0 ? Math.min(100, Math.round((assigned / total) * 100)) : 0;
    return { total, assigned, unassigned, pct };
  }, [campaign?.budget, campaignTasks]);

  const taskBudgetRows = useMemo(() => {
    const list = campaignTasks ?? [];
    return list.map((t) => {
      const raw = String(t.budgetKsh ?? "").replace(/,/g, "").trim();
      const n = parseFloat(raw);
      const amount = Number.isFinite(n) ? n : 0;

      // Extract assignee name
      const a = t.assignee;
      const firstName = a?.firstName ?? a?.firstname ?? "";
      const lastName = a?.lastName ?? a?.lastname ?? "";
      const name = [firstName, lastName].filter(Boolean).join(" ").trim() || a?.email || "Unassigned";

      return {
        id: t.id,
        title: (t.title ?? "").trim() || "Untitled task",
        status: String(t.status ?? "—"),
        amount,
        assigneeName: name,
        assigneeEmail: a?.email,
        assigneeAvatar: a?.avatar,
      };
    });
  }, [campaignTasks]);

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (active: boolean) => {
      await campaignApi.update(campaignId, { active });
      return true;
    },
    onSuccess: () => {
      toast.success("Campaign status updated");
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ teamId, name }: { teamId: number; name: string }) =>
      campaignApi.updateTeam(campaignId, teamId, { name }),
    onSuccess: () => {
      toast.success("Team name saved");
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Failed to update team");
    },
  });

  const removeTeamMemberMutation = useMutation({
    mutationFn: ({ teamId, memberId }: { teamId: number; memberId: number }) =>
      campaignApi.removeTeamMember(campaignId, teamId, memberId),
    onSuccess: () => {
      toast.success("Removed from team");
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaign-available-team-members", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Could not remove member");
    },
  });

  const addTeamMemberToTeamMutation = useMutation({
    mutationFn: (payload: {
      teamId: number;
      name: string;
      email: string;
      sendSignupInvite?: boolean;
    }) =>
      campaignApi.addTeamMember(campaignId, payload.teamId, {
        name: payload.name,
        email: payload.email,
        sendSignupInvite: payload.sendSignupInvite,
      }),
    onSuccess: () => {
      toast.success("Member added");
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaign-available-team-members", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Failed to add member");
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async () => {
      const cleanName = newTeamName.trim();
      if (!cleanName) {
        throw new Error("Team name is required");
      }
      return campaignApi.addTeam(campaignId, {
        name: cleanName,
        members: newTeamMembers.map((m) => ({
          name: m.name,
          email: m.email,
          ...(m.sendSignupInvite ? { sendSignupInvite: true } : {}),
        })),
      });
    },
    onSuccess: () => {
      toast.success("Team created");
      setNewTeamName("");
      setNewTeamMemberQuery("");
      setNewTeamMembers([]);
      setInviteNonUserName("");
      setInviteNonUserEmail("");
      setCreateTeamOpen(false);
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-available-team-members", campaignId] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Failed to create team");
    },
  });

  const inlineGoalEditMutation = useMutation({
    mutationFn: (nextGoalDetails: CampaignGoalDetail[]) =>
      campaignApi.update(campaignId, {
        goals: nextGoalDetails.map((g) => g.goal),
        goalDetails: nextGoalDetails,
      }),
    onSuccess: () => {
      toast.success("Goal updated");
      setEditingGoalDetailIndex(null);
      setEditingGoalTargetValue("");
      setEditingGoalDeadlineValue("");
      setEditingGoalDescriptionValue("");
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Could not update goal";
      toast.error(msg);
    },
  });

  const startGoalDetailEdit = (index: number) => {
    const row = normalizedGoals[index];
    if (!row) return;
    setEditingGoalDetailIndex(index);
    setEditingGoalTargetValue(
      row.targetNumber != null && Number.isFinite(Number(row.targetNumber))
        ? String(Math.trunc(Number(row.targetNumber)))
        : ""
    );
    setEditingGoalDeadlineValue(
      row.deadline != null && String(row.deadline).trim() !== ""
        ? String(row.deadline).slice(0, 10)
        : ""
    );
    setEditingGoalDescriptionValue(
      row.targetDescription != null && String(row.targetDescription).trim() !== ""
        ? String(row.targetDescription)
        : ""
    );
  };

  const cancelGoalDetailEdit = () => {
    setEditingGoalDetailIndex(null);
    setEditingGoalTargetValue("");
    setEditingGoalDeadlineValue("");
    setEditingGoalDescriptionValue("");
  };

  const saveGoalDetailEdit = (index: number) => {
    const row = normalizedGoals[index];
    if (!row) return;
    const rawTarget = editingGoalTargetValue.trim();
    const nextTarget =
      rawTarget === ""
        ? null
        : Number.isFinite(Number(rawTarget))
          ? Math.trunc(Number(rawTarget))
          : null;
    if (rawTarget !== "" && nextTarget == null) {
      toast.error("Enter a valid target number");
      return;
    }
    const nextDetails = [...normalizedGoals];
    nextDetails[index] = {
      ...row,
      targetNumber: nextTarget,
      deadline: editingGoalDeadlineValue.trim() === "" ? null : editingGoalDeadlineValue.trim(),
      targetDescription:
        editingGoalDescriptionValue.trim() === ""
          ? null
          : editingGoalDescriptionValue.trim().slice(0, 2000),
    };
    inlineGoalEditMutation.mutate(nextDetails, {
      onSuccess: () => {
        cancelGoalDetailEdit();
      },
    });
  };

  const { data: candidateUsers = [], isLoading: searchingTeamMembers } = useQuery({
    queryKey: ["create-team-users-search", newTeamMemberQuery],
    queryFn: () => usersApi.search(newTeamMemberQuery),
    enabled: createTeamOpen && newTeamMemberQuery.trim().length >= 2,
  });

  const { data: availableTeamMembers = [], isLoading: loadingAvailableTeamMembers } = useQuery({
    queryKey: ["campaign-available-team-members", campaignId],
    queryFn: () => campaignApi.getAvailableTeamMembers(campaignId),
    enabled: (createTeamOpen || editTeamOpen) && !Number.isNaN(campaignId),
  });

  const { data: addMemberSearchResults = [], isLoading: searchingAddMembers } = useQuery({
    queryKey: ["add-team-members-user-search", addMemberQuery],
    queryFn: () => usersApi.search(addMemberQuery),
    enabled: editTeamOpen && addMemberQuery.trim().length >= 2,
  });

  const editDialogTeam = useMemo(() => {
    if (editTeamId == null || !campaign?.teams) return null;
    return campaign.teams.find((t) => t.id === editTeamId) ?? null;
  }, [campaign?.teams, editTeamId]);

  const emailsOnEditTargetTeam = useMemo(() => {
    const set = new Set<string>();
    for (const m of editDialogTeam?.members ?? []) {
      const e = String(m.email ?? "").trim().toLowerCase();
      if (e) set.add(e);
    }
    return set;
  }, [editDialogTeam]);

  const availableForAddDialog = useMemo(() => {
    return availableTeamMembers.filter((u) => {
      const e = String(u.email ?? "").trim().toLowerCase();
      return e && !emailsOnEditTargetTeam.has(e);
    });
  }, [availableTeamMembers, emailsOnEditTargetTeam]);

  const openMemberChatMutation = useMutation({
    mutationFn: async (member: { name: string; email: string }) => {
      const matches = await usersApi.search(member.email);
      const exact = matches.find(
        (u) => String(u.email ?? "").trim().toLowerCase() === member.email.trim().toLowerCase()
      );
      const participantId = exact?.id ? String(exact.id) : null;
      if (!participantId) {
        throw new Error("Could not resolve user for this member");
      }
      const conv = await messagesApi.getOrCreateConversation(participantId);
      return { conversationId: conv._id, participantId };
    },
    onSuccess: ({ conversationId, participantId }, member) => {
      setMemberChatConversationId(conversationId);
      setMemberChatTarget({
        name: member.name,
        email: member.email,
        userId: participantId,
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign-member-chat-messages", conversationId],
      });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not open chat");
    },
  });

  const { data: memberChatMessages = [], isLoading: memberChatLoading } = useQuery({
    queryKey: ["campaign-member-chat-messages", memberChatConversationId],
    queryFn: () => messagesApi.getMessages(memberChatConversationId!),
    enabled: memberChatOpen && !!memberChatConversationId,
    refetchInterval: memberChatOpen && !!memberChatConversationId ? 5000 : false,
    refetchIntervalInBackground: false,
  });

  const sendMemberChatMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!memberChatConversationId) {
        throw new Error("Conversation not ready");
      }
      return messagesApi.sendMessage(memberChatConversationId, text);
    },
    onSuccess: () => {
      setMemberChatDraft("");
      if (memberChatConversationId) {
        queryClient.invalidateQueries({
          queryKey: ["campaign-member-chat-messages", memberChatConversationId],
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && campaign?.id) {
      setShareUrl(`${window.location.origin}/campaigns/${campaign.id}`);
    }
  }, [campaign?.id]);

  useEffect(() => {
    if (!myTeams || myTeams.length === 0) {
      setSelectedTeamId(null);
      return;
    }
    if (selectedTeamId && myTeams.some((t) => t.id === selectedTeamId)) {
      return;
    }
    setSelectedTeamId(myTeams[0]?.id ?? null);
  }, [myTeams, selectedTeamId]);

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

  // Calculate completion percentage
  const percentComplete = (() => {
    const milestones = campaign.milestones || [];
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'Completed').length;
    return Math.round((completed / milestones.length) * 100);
  })();

  const teams = myTeams;
  const selectedTeam =
    teams.find((t) => t.id != null && t.id === selectedTeamId) ??
    teams[0] ??
    null;
  const viewerId = user?.id != null ? String(user.id) : "";

  return (
    <div className="space-y-4 pb-3">
      <div className="px-3 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-1.5"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Return
        </Button>
      </div>
      {/* Hero — title, Open / Posted, rate (design: dark campaign header) */}
      <div className="relative min-h-[280px] w-full overflow-hidden border-b border-border md:min-h-[320px]">
        <Image
          src={`https://picsum.photos/seed/${campaign.id}/1200/400`}
          alt={campaign.title || "Campaign"}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                  {campaign.title}
                </h1>
                {viewerOwnsCampaign && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white"
                    onClick={() => setEditCampaignOpen(true)}
                    title="Edit campaign"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge
                  className={`cursor-pointer border-0 ${campaign.active
                    ? "bg-emerald-600 text-white hover:bg-emerald-600"
                    : "bg-zinc-600 text-white hover:bg-zinc-600"
                    }`}
                  onClick={() => toggleActiveMutation.mutate(!campaign.active)}
                >
                  {toggleActiveMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : campaign.active ? (
                    "Open"
                  ) : (
                    "Closed"
                  )}
                </Badge>
                {campaign.createdAt ? (
                  <span className="text-white/80">
                    Posted {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                  </span>
                ) : null}
              </div>
            </div>
            {!isCreatorAccount ? (
              <div className="shrink-0 text-left md:text-right">
                <p className="text-base font-semibold text-orange-400 md:text-lg">{jobRateLabel}</p>
                <p className="text-[11px] text-white/50">linked jobs / rate</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 px-2 pb-8 sm:px-4 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="overview">
            <TabsList className="mb-2 flex h-auto w-full gap-1 overflow-x-auto rounded-lg border border-border bg-muted/50 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <TabsTrigger value="overview" className={CAMPAIGN_TAB_TRIGGER_CLASS}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="tasks" className={CAMPAIGN_TAB_TRIGGER_CLASS}>
                Tasks ({campaignTasks.length})
              </TabsTrigger>
              <TabsTrigger value="feedback" className={CAMPAIGN_TAB_TRIGGER_CLASS}>
                Feedback ({sortedFeedback.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-6">
              {/* Campaign overview — stat tiles */}
              <section>
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                  Campaign overview
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/30 p-4 dark:bg-zinc-900/70">
                    <p className="text-sm font-semibold text-foreground">Tasks</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-foreground">
                          {overviewTaskStats.overall}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Overall</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-foreground">
                          {overviewTaskStats.pending}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Pending</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                          {overviewTaskStats.completed}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4 dark:bg-zinc-900/70">
                    <p className="text-sm font-semibold text-foreground">Assignees</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-foreground">
                          {uniqueCampaignMemberCount}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Overall</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                          {activeTeammatesOnTasks}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Active</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-foreground">
                          {inactiveTeammatesCount}
                        </p>
                        <p className="text-[11px] text-muted-foreground">In-Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Campaign brief */}
              <section className="rounded-xl border border-border bg-card p-5 dark:bg-zinc-900/50">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                  Campaign brief
                </h2>
                <div className="relative">
                  <div
                    className={cn(
                      "text-sm leading-relaxed text-muted-foreground transition-all",
                      !briefExpanded && "line-clamp-6"
                    )}
                  >
                    <p className="whitespace-pre-wrap">
                      {campaign.description || "No description provided."}
                    </p>
                  </div>
                  {!briefExpanded && (campaign.description?.length ?? 0) > 280 ? (
                    <div className="pointer-events-none absolute bottom-8 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent dark:from-zinc-900/50" />
                  ) : null}
                  {(campaign.description?.length ?? 0) > 200 ? (
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-400"
                      onClick={() => setBriefExpanded((v) => !v)}
                    >
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", briefExpanded && "rotate-180")}
                      />
                      {briefExpanded ? "Show less" : "Show more"}
                    </button>
                  ) : null}
                </div>
                {Array.isArray(campaign.attachments) && campaign.attachments.length > 0 ? (
                  <div className="mt-4 border-t border-border pt-4">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Attachments</h3>
                    <ul className="space-y-2">
                      {campaign.attachments.map((url, idx) => {
                        const safeUrl = String(url ?? "").trim();
                        if (!safeUrl) return null;
                        const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(safeUrl);
                        const fileName = (() => {
                          try {
                            const pathname = new URL(safeUrl).pathname;
                            const last = pathname.split("/").filter(Boolean).pop();
                            return decodeURIComponent(last || "Attachment");
                          } catch {
                            return "Attachment";
                          }
                        })();
                        const displayName = (() => {
                          const noExt = fileName.replace(/\.[^/.]+$/u, "");
                          const withoutPrefix = noExt.replace(/^\d+-/u, "");
                          return withoutPrefix.replace(/[_-]+/g, " ").trim() || fileName;
                        })();
                        const extLabel = fileName.split(".").pop()?.toUpperCase() ?? "FILE";
                        return (
                          <li
                            key={`${safeUrl}-${idx}`}
                            className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/20 p-2"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              {isImage ? (
                                <Image
                                  src={safeUrl}
                                  alt={fileName}
                                  width={44}
                                  height={44}
                                  unoptimized
                                  className="h-11 w-11 rounded object-cover"
                                />
                              ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded border border-border text-xs">
                                  File
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm text-foreground">{displayName}</p>
                                <p className="truncate text-xs text-muted-foreground">{extLabel} document</p>
                              </div>
                            </div>
                            <a
                              href={safeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-orange-500 hover:text-orange-400"
                            >
                              Open
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
                {showGoalsTargetSection && campaign != null && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">Goals & target</h3>
                      {viewerOwnsCampaign ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-400"
                          onClick={() => setGoalTargetModalOpen(true)}
                        >
                          Add goal target
                        </Button>
                      ) : null}
                    </div>
                    {normalizedGoals.length === 0 && viewerOwnsCampaign ? (
                      <p className="text-sm text-muted-foreground">
                        No goals yet. Use &quot;Add goal target&quot; to add goals and set your KPI target.
                      </p>
                    ) : null}

                    {normalizedGoals.length > 0 ? (
                      <div
                        className={cn(
                          "mt-4 grid grid-cols-1 gap-3 md:grid-cols-2",
                          normalizedGoals.length > 4 && "max-h-[21rem] overflow-y-auto pr-1"
                        )}
                      >
                        {visibleGoalsData.map(({ goalDetail, index }) => (
                          <div
                            key={`goal-metrics-${goalDetail.goal}-${index}`}
                            className="rounded-lg border border-border bg-muted/20 p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-foreground line-clamp-1">{goalDetail.goal}</p>
                              {viewerOwnsCampaign ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={() => startGoalDetailEdit(index)}
                                  disabled={inlineGoalEditMutation.isPending}
                                >
                                  Edit
                                </Button>
                              ) : null}
                            </div>
                            {viewerOwnsCampaign && editingGoalDetailIndex === index ? (
                              <div className="mt-3 space-y-2">
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                  <Input
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    className="h-8 text-xs"
                                    placeholder="Target no."
                                    value={editingGoalTargetValue}
                                    onChange={(e) => setEditingGoalTargetValue(e.target.value)}
                                    disabled={inlineGoalEditMutation.isPending}
                                  />
                                  <Input
                                    type="date"
                                    className="h-8 text-xs"
                                    value={editingGoalDeadlineValue}
                                    onChange={(e) => setEditingGoalDeadlineValue(e.target.value)}
                                    disabled={inlineGoalEditMutation.isPending}
                                  />
                                </div>
                                <Textarea
                                  className="min-h-[70px] resize-y text-xs"
                                  placeholder="Target description"
                                  value={editingGoalDescriptionValue}
                                  onChange={(e) =>
                                    setEditingGoalDescriptionValue(e.target.value.slice(0, 2000))
                                  }
                                  disabled={inlineGoalEditMutation.isPending}
                                  maxLength={2000}
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-[11px]"
                                    onClick={cancelGoalDetailEdit}
                                    disabled={inlineGoalEditMutation.isPending}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-[11px]"
                                    onClick={() => saveGoalDetailEdit(index)}
                                    disabled={inlineGoalEditMutation.isPending}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  Target no.:{" "}
                                  <span className="text-foreground tabular-nums">
                                    {goalDetail.targetNumber != null ? String(goalDetail.targetNumber) : "—"}
                                  </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Deadline:{" "}
                                  <span className="text-foreground">
                                    {formatCampaignDeadlineDisplay(goalDetail.deadline ?? undefined)}
                                  </span>
                                </p>
                                {goalDetail.targetDescription ? (
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
                                    {goalDetail.targetDescription}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}

                {viewerOwnsCampaign && campaign != null && (
                  <CampaignTargetDeadlineModal
                    campaignId={campaignId}
                    open={goalTargetModalOpen}
                    onOpenChange={setGoalTargetModalOpen}
                    existingGoals={campaign.goals ?? []}
                    goalDetails={campaign.goalDetails}
                  />
                )}
              </section>

              {/* Jobs linked to this campaign (brand / business owners only — creators use projects, not job posts) */}
              {viewerOwnsCampaign && !isCreatorAccount && (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
                    <Button
                      className="rounded-lg bg-orange-500 px-5 font-semibold text-black hover:bg-orange-600"
                      onClick={() => router.push(`/jobs?createJob=1&campaignId=${campaign.id}`)}
                    >
                      Create Job
                    </Button>
                  </div>
                  {jobsForCampaign.length === 0 ? (
                    <p className="text-sm text-muted-foreground rounded-xl border border-border bg-muted/30 px-4 py-8 text-center">
                      No jobs linked to this campaign yet. Create a job to find creators.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {jobsForCampaign.map((job) => {
                        const jid = job.id ?? (job._id ? Number(job._id) : undefined);
                        const title =
                          job.title ?? job.values?.title ?? "Job";
                        const desc = (
                          job.description ??
                          job.values?.description ??
                          ""
                        ).slice(0, 160);
                        const skills = (job.skills ?? []).slice(0, 2);
                        const pending =
                          (job.proposals?.filter((p) => p.status === "pending")
                            .length ?? 0) > 0;
                        return (
                          <Card
                            key={jid ?? title}
                            className="border-border bg-card/80 overflow-hidden dark:bg-zinc-900/60"
                          >
                            <CardContent className="space-y-3 p-4">
                              <div className="flex gap-3">
                                <div
                                  className="h-14 w-14 shrink-0 rounded-lg bg-muted ring-1 ring-border"
                                  aria-hidden
                                />
                                <div className="min-w-0 flex-1 space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-semibold line-clamp-1">{title}</p>
                                    <Badge
                                      variant="secondary"
                                      className="shrink-0 bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30"
                                    >
                                      {pending ? "Pending" : "Open"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-3">
                                    {desc || "No description."}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    {skills.map((s) => (
                                      <Badge key={s} variant="outline" className="text-xs">
                                        {s}
                                      </Badge>
                                    ))}
                                    <RiArrowRightSLine
                                      className="h-4 w-4 text-muted-foreground"
                                      aria-hidden
                                    />
                                  </div>
                                  {jid != null && (
                                    <div className="flex justify-end pt-1">
                                      <Button
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600 text-white"
                                        asChild
                                      >
                                        <Link href={`/jobs/${jid}`}>View</Link>
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Hired Creators Section */}
              {viewerOwnsCampaign && !isCreatorAccount && hiredCreators.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">Hired Creators</h2>
                    <p className="text-sm text-muted-foreground">
                      Creators with accepted proposals. Manage their escrow payments here.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {hiredCreators.map((hired) => {
                      const hasEscrow = hired.escrow != null;
                      const escrowStatus = hired.escrow?.status?.toLowerCase() || "none";

                      return (
                        <Card key={hired.id} className="border-border bg-card/80 dark:bg-zinc-900/60 transition-all hover:shadow-md">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-600">
                                  {hired.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold truncate text-sm">{hired.name}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{hired.proposalTitle}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">Ksh {hired.budget.toLocaleString()}</p>
                                {hasEscrow ? (
                                  <Badge className={cn(
                                    "mt-1 text-[10px] uppercase font-bold",
                                    escrowStatus === "funded" || escrowStatus === "released" ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" : "bg-amber-500/20 text-amber-600 border-amber-500/30"
                                  )} variant="outline">
                                    {escrowStatus.replace("_", " ")}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="mt-1 text-[10px] uppercase opacity-60">No Escrow</Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              {hasEscrow ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs border-orange-500/40 text-orange-600 hover:bg-orange-500/10"
                                  onClick={() => {
                                    if (hired.escrow) {
                                      setSelectedEscrowId(hired.escrow.id);
                                      setEscrowDetailsOpen(true);
                                    }
                                  }}
                                >
                                  <RiHistoryLine className="h-3.5 w-3.5 mr-1.5" />
                                  Escrow Details
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                  disabled={createEscrowMutation.isPending}
                                  onClick={() => {
                                    if (confirm(`Initialize escrow for ${hired.name} (Ksh ${hired.budget.toLocaleString()})?`)) {
                                      createEscrowMutation.mutate({ sellerId: hired.creatorId });
                                    }
                                  }}
                                >
                                  {createEscrowMutation.isPending ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                  ) : (
                                    <RiHandCoinLine className="h-3.5 w-3.5 mr-1.5" />
                                  )}
                                  Fund Escrow
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 rounded-full p-0"
                                asChild
                              >
                                <Link href={`/inbox?user=${hired.creatorId}`} title="Message Creator">
                                  <MessageCircle className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Your Campaign Budget */}
              <section
                ref={budgetSectionRef}
                id="campaign-budget"
                className="rounded-xl border border-border bg-card p-5 dark:bg-zinc-900/50"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Your Campaign Budget
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-orange-500/50 text-orange-600 hover:bg-orange-500/10 dark:text-orange-400"
                    onClick={() => setBudgetBreakdownOpen(true)}
                  >
                    View Budget
                  </Button>
                </div>
                <div className="mb-3 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground">
                    Campaign budget:{" "}
                    <span className="font-semibold text-foreground">
                      Kes {budgetNumbers.total.toLocaleString()}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Unassigned:{" "}
                    <span className="font-semibold text-foreground">
                      Kes {budgetNumbers.unassigned.toLocaleString()}
                    </span>
                  </span>
                </div>
                <Progress
                  value={budgetNumbers.pct}
                  className="h-2.5 bg-muted [&>div]:bg-emerald-600"
                />
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {budgetNumbers.pct}% allocated across tasks (from task budgets). Total campaign budget
                  in settings.
                </p>
              </section>

              <Dialog open={budgetBreakdownOpen} onOpenChange={setBudgetBreakdownOpen}>
                <DialogContent className="flex max-h-[min(85vh,640px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                  <DialogHeader className="border-b border-border px-6 py-4 text-left">
                    <DialogTitle>Campaign budget</DialogTitle>
                    <DialogDescription>
                      Total budget for this campaign and each task&apos;s budget (from campaign tasks).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 px-6 py-4">
                    <div className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 px-3 py-3 text-sm dark:bg-zinc-900/50">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Total campaign budget</span>
                        <span className="font-semibold tabular-nums text-foreground">
                          Kes {budgetNumbers.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Assigned to tasks</span>
                        <span className="font-medium tabular-nums text-foreground">
                          Kes {budgetNumbers.assigned.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Unassigned</span>
                        <span className="font-medium tabular-nums text-foreground">
                          Kes {budgetNumbers.unassigned.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tasks
                    </p>
                    <div className="max-h-[min(40vh,280px)] overflow-y-auto rounded-md border border-border/60">
                      {taskBudgetRows.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No tasks on this campaign yet. Task budgets appear here when you set a budget on
                          each task.
                        </p>
                      ) : (
                        <ul className="divide-y divide-border/60">
                          {taskBudgetRows.map((row) => (
                            <li
                              key={row.id}
                              className="flex items-start justify-between gap-3 px-4 py-3 text-sm"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-medium leading-snug text-foreground line-clamp-2">
                                  {row.title}
                                </p>
                                <div className="mt-1.5 flex items-center gap-2">
                                  <div className="h-5 w-5 rounded-full bg-orange-500/10 flex items-center justify-center overflow-hidden border border-orange-500/20">
                                    {row.assigneeAvatar ? (
                                      <Image
                                        src={row.assigneeAvatar}
                                        alt={row.assigneeName || "Assignee"}
                                        width={20}
                                        height={20}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="text-[10px] font-bold text-orange-600">
                                        {(row.assigneeName || "U")[0].toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {row.assigneeName} • {row.status}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 font-medium tabular-nums text-foreground">
                                {row.amount > 0
                                  ? `Kes ${Math.round(row.amount).toLocaleString()}`
                                  : "—"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="border-t border-border px-6 py-3 sm:justify-end">
                    <Button type="button" variant="outline" onClick={() => setBudgetBreakdownOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Linked campaigns (cocampaign) */}
              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Linked campaigns</h2>
                  {viewerOwnsCampaign ? (
                    <Button
                      type="button"
                      className="rounded-lg bg-orange-500 px-5 font-semibold text-black hover:bg-orange-600"
                      onClick={() => router.push(`/campaigns/${campaign.id}/link`)}
                    >
                      Link campaign
                    </Button>
                  ) : null}
                </div>
                {linkedSectionEmpty ? (
                  <p className="text-sm text-muted-foreground rounded-xl border border-border bg-muted/30 px-4 py-8 text-center">
                    No linked campaigns yet.
                    {viewerOwnsCampaign
                      ? " Use Link campaign to connect another campaign you own that has an accepted creator hire."
                      : ""}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {linkedOutCampaignId ? (
                      loadingLinkedOut ? (
                        <div className="col-span-full flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/20 py-10 text-sm text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading linked campaign…
                        </div>
                      ) : linkedOutCampaign && !linkedOutError ? (
                        <article className="flex min-h-[220px] flex-col rounded-xl border border-border/70 bg-muted/35 p-4 shadow-sm dark:bg-zinc-900/55">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                                You link to
                              </p>
                              <h3 className="line-clamp-2 pr-1 text-base font-bold leading-snug text-foreground">
                                {linkedOutCampaign.title}
                              </h3>
                            </div>
                            <Badge
                              className={`shrink-0 border-0 text-[10px] font-semibold uppercase tracking-wide ${linkedOutCampaign.active !== false
                                ? "bg-amber-500/90 text-black hover:bg-amber-500"
                                : "bg-zinc-600 text-white hover:bg-zinc-600"
                                }`}
                            >
                              {linkedOutCampaign.active !== false ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </div>
                          <p className="mb-2 text-sm text-muted-foreground">
                            {linkedCampaignCreatorLabel(linkedOutCampaign)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Budget:{" "}
                            <span className="font-medium text-foreground">
                              Kes {formatLinkedCampaignBudget(linkedOutCampaign)}
                            </span>
                          </p>
                          <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-foreground/90">
                            {(linkedOutCampaign.description ?? "").trim() ||
                              "No description on this campaign yet."}
                          </p>
                          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                              {linkedOutCampaign.goals?.[0] ? (
                                <Badge
                                  variant="secondary"
                                  className="max-w-[160px] truncate bg-muted/80 text-xs font-normal text-foreground"
                                  title={linkedOutCampaign.goals[0]}
                                >
                                  {linkedOutCampaign.goals[0].length > 24
                                    ? `${linkedOutCampaign.goals[0].slice(0, 24)}…`
                                    : linkedOutCampaign.goals[0]}
                                </Badge>
                              ) : null}
                            </div>
                            <Button
                              size="sm"
                              className="shrink-0 rounded-md bg-orange-500 px-4 font-semibold text-black hover:bg-orange-600"
                              asChild
                            >
                              <Link href={`/campaigns/${linkedOutCampaign.id}`}>View</Link>
                            </Button>
                          </div>
                        </article>
                      ) : (
                        <article className="flex min-h-[120px] flex-col justify-center rounded-xl border border-dashed border-border bg-muted/25 p-4 dark:bg-zinc-900/40">
                          <p className="text-sm font-medium text-foreground">
                            Linked campaign (#{linkedOutCampaignId})
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {linkedOutError
                              ? "Could not load details. You may still open the campaign if you have access."
                              : "Details unavailable."}
                          </p>
                          <div className="mt-3 flex justify-end">
                            <Button
                              size="sm"
                              className="rounded-md bg-orange-500 px-4 font-semibold text-black hover:bg-orange-600"
                              asChild
                            >
                              <Link href={`/campaigns/${linkedOutCampaignId}`}>View</Link>
                            </Button>
                          </div>
                        </article>
                      )
                    ) : null}

                    {campaignsLinkingHere.map((c) => {
                      const firstGoal = c.goals?.[0];
                      return (
                        <article
                          key={c.id}
                          className="flex min-h-[220px] flex-col rounded-xl border border-border/70 bg-muted/35 p-4 shadow-sm dark:bg-zinc-900/55"
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                Links here
                              </p>
                              <h3 className="line-clamp-2 pr-1 text-base font-bold leading-snug text-foreground">
                                {c.title}
                              </h3>
                            </div>
                            <Badge
                              className={`shrink-0 border-0 text-[10px] font-semibold uppercase tracking-wide ${c.active !== false
                                ? "bg-amber-500/90 text-black hover:bg-amber-500"
                                : "bg-zinc-600 text-white hover:bg-zinc-600"
                                }`}
                            >
                              {c.active !== false ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </div>
                          <p className="mb-2 text-sm text-muted-foreground">{linkedCampaignCreatorLabel(c)}</p>
                          <p className="text-xs text-muted-foreground">
                            Budget:{" "}
                            <span className="font-medium text-foreground">Kes {formatLinkedCampaignBudget(c)}</span>
                          </p>
                          <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-foreground/90">
                            {(c.description ?? "").trim() || "No description on this campaign yet."}
                          </p>
                          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                              {firstGoal ? (
                                <Badge
                                  variant="secondary"
                                  className="max-w-[160px] truncate bg-muted/80 text-xs font-normal text-foreground"
                                  title={firstGoal}
                                >
                                  {firstGoal.length > 24 ? `${firstGoal.slice(0, 24)}…` : firstGoal}
                                </Badge>
                              ) : null}
                            </div>
                            <Button
                              size="sm"
                              className="shrink-0 rounded-md bg-orange-500 px-4 font-semibold text-black hover:bg-orange-600"
                              asChild
                            >
                              <Link href={`/campaigns/${c.id}`}>View</Link>
                            </Button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Creator: projects for this campaign */}
              {showProjectsSection && (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                    <Button
                      className="rounded-lg bg-orange-500 px-5 font-semibold text-black hover:bg-orange-600"
                      onClick={() => setShowProjectWizard(true)}
                    >
                      Add Projects
                    </Button>
                  </div>
                  {projectsForCampaign.length === 0 ? (
                    <p className="text-sm text-muted-foreground rounded-xl border border-border bg-muted/30 px-4 py-8 text-center">
                      No showcase projects linked to this campaign yet. Use Add Projects to create one for
                      this campaign.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {projectsForCampaign.map((project) => {
                        const pid = project.id ?? project._id ?? "";
                        const desc = (project.description ?? "").trim();
                        const goals = project.goals ?? [];
                        const firstGoal = goals[0];
                        const isComplete =
                          goals.length > 0 && Boolean(desc) && (project.mediaUrls?.length ?? 0) > 0;
                        return (
                          <article
                            key={String(pid)}
                            className="flex min-h-[260px] flex-col rounded-xl border border-border/70 bg-muted/35 p-4 shadow-sm dark:bg-zinc-900/55"
                          >
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <h3 className="line-clamp-2 pr-1 text-base font-bold leading-snug text-foreground">
                                {project.title ?? "Project name goes here…"}
                              </h3>
                              <Badge
                                className={`shrink-0 border-0 text-[10px] font-semibold uppercase tracking-wide ${isComplete
                                  ? "bg-emerald-600 text-white hover:bg-emerald-600"
                                  : "bg-amber-500/90 text-black hover:bg-amber-500"
                                  }`}
                              >
                                {isComplete ? "Complete" : "Active"}
                              </Badge>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">{creatorDisplayName}</p>
                            <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-foreground/90">
                              {desc ||
                                "Add a description to your project to tell collaborators what this campaign project is about."}
                            </p>
                            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                                {firstGoal ? (
                                  <Badge
                                    variant="secondary"
                                    className="max-w-[140px] truncate bg-muted/80 text-xs font-normal text-foreground"
                                    title={firstGoal}
                                  >
                                    {firstGoal.length > 22 ? `${firstGoal.slice(0, 22)}…` : firstGoal}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-muted/80 text-xs font-normal">
                                    Tags
                                  </Badge>
                                )}
                                {project.category?.trim() ? (
                                  <Badge variant="secondary" className="bg-muted/80 text-xs font-normal">
                                    {project.category.trim()}
                                  </Badge>
                                ) : null}
                              </div>
                              {pid ? (
                                <Button
                                  size="sm"
                                  className="shrink-0 rounded-md bg-orange-500 px-4 font-semibold text-black hover:bg-orange-600"
                                  asChild
                                >
                                  <Link href={`/showcase/projects/${pid}`}>View</Link>
                                </Button>
                              ) : null}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Tasks Tab — Kanban (To-Do / In Progress / Completed) */}
            <TabsContent value="tasks">
              <Card className="!p-0">
                <CardContent className="p-4 md:p-6">
                  <CampaignTasksBoard
                    campaignId={campaignId}
                    milestones={campaign.milestones ?? []}
                    teams={myTeams}
                    restrictToAssignedOnly={isCreatorAccount}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="mt-4 space-y-4">
              <Card className="overflow-hidden border-border bg-card dark:bg-zinc-900/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                        Feedback
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Messages from teammates, collaborators, and visitors. Newest first.
                      </p>
                    </div>
                    <FeedBackTab campaignId={campaignId} />
                  </div>
                </CardContent>
              </Card>

              <section aria-label="Feedback list" className="space-y-3">
                <div className="flex flex-col gap-1 px-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h4 className="text-base font-semibold text-foreground">
                    What others have shared
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {sortedFeedback.length}{" "}
                    {sortedFeedback.length === 1 ? "message" : "messages"}
                  </span>
                </div>

                {sortedFeedback.length > 0 ? (
                  <ul className="space-y-2 sm:space-y-3">
                    {sortedFeedback.map((f) => {
                      const viewerEmail = authMe?.email?.trim().toLowerCase();
                      const fbEmail = f.email?.trim().toLowerCase();
                      const isYou = Boolean(viewerEmail && fbEmail && viewerEmail === fbEmail);
                      const nameTrim = f.name?.trim();
                      const emailTrim = f.email?.trim();
                      const author = nameTrim || emailTrim || "Anonymous";
                      const showEmailUnderName = Boolean(nameTrim && emailTrim);
                      const initials = feedbackAuthorInitials(author, emailTrim);
                      return (
                        <li
                          key={f.id ?? `${fbEmail ?? "anon"}-${f.feedback.slice(0, 24)}`}
                          className="list-none"
                        >
                          <article className="rounded-2xl border border-border bg-muted/25 p-4 sm:p-5 dark:bg-zinc-900/40">
                            <div className="flex gap-3 sm:gap-4">
                              <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-semibold uppercase tracking-wide text-orange-800 dark:text-orange-200 sm:h-12 sm:w-12 sm:text-sm"
                                aria-hidden
                              >
                                {initials}
                              </div>
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2 gap-y-1">
                                  <span className="text-base font-semibold text-foreground">
                                    {author}
                                  </span>
                                  {isYou ? (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] font-normal uppercase tracking-wide"
                                    >
                                      You
                                    </Badge>
                                  ) : null}
                                </div>
                                {showEmailUnderName ? (
                                  <p className="text-xs text-muted-foreground sm:text-sm">
                                    {emailTrim}
                                  </p>
                                ) : null}
                                <p className="text-base leading-relaxed text-foreground wrap-anywhere">
                                  {f.feedback}
                                </p>
                                {f.desc ? (
                                  <p className="text-sm leading-relaxed text-muted-foreground wrap-anywhere">
                                    {f.desc}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center sm:py-12">
                    <p className="mx-auto max-w-sm text-base leading-relaxed text-muted-foreground">
                      No feedback yet. Tap{" "}
                      <span className="font-medium text-foreground">Leave feedback</span> above to add
                      the first note—everyone on this campaign will see it here.
                    </p>
                  </div>
                )}
              </section>
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

              {/* Add Projects lives in the Projects tiles section for creators */}

              {/* Teams & Referral Tabs */}
              <Tabs defaultValue="teams">
                <TabsList className="w-full gap-1 rounded-lg border border-border bg-muted/50 p-1">
                  <TabsTrigger value="teams" className={CAMPAIGN_TAB_TRIGGER_CLASS}>
                    Teams ({myTeams.length})
                  </TabsTrigger>
                  <TabsTrigger value="referral" className={CAMPAIGN_TAB_TRIGGER_CLASS}>
                    Referral
                  </TabsTrigger>
                </TabsList>

                {/* Teams Tab */}
                <TabsContent value="teams">
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">On Teams</h4>
                      <p className="text-xs text-muted-foreground">
                        You are currently on these teams
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      className="w-full bg-orange-500 text-white hover:bg-orange-600"
                      disabled={!viewerOwnsCampaign}
                      onClick={() => setCreateTeamOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create team
                    </Button>

                    {viewerOwnsCampaign && teams.length > 0 ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border"
                          disabled={!selectedTeam?.id}
                          onClick={() => {
                            if (!selectedTeam?.id) return;
                            setEditTeamId(selectedTeam.id);
                            setEditTeamNameValue(selectedTeam.name ?? "");
                            setEditTeamOpen(true);
                          }}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Edit team
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border"
                          disabled={!selectedTeam?.id}
                          onClick={() => {
                            if (!selectedTeam?.id) return;
                            setEditTeamId(selectedTeam.id);
                            setEditTeamNameValue(selectedTeam.name ?? "");
                            setAddMemberQuery("");
                            setAddInviteName("");
                            setAddInviteEmail("");
                            setEditTeamOpen(true);
                          }}
                        >
                          <Users className="mr-1.5 h-3.5 w-3.5" />
                          Add members
                        </Button>
                      </div>
                    ) : null}

                    {teams.length > 0 ? (
                      <div className="space-y-2">
                        {teams.map((team) => {
                          const isActive = selectedTeam?.id != null && selectedTeam.id === team.id;
                          const membersCount = displayedTeamMemberCount(
                            team,
                            campaign,
                            !isCreatorAccount
                          );
                          return (
                            <div
                              key={team.id ?? team.name}
                              className={`flex w-full items-stretch gap-0 overflow-hidden rounded-lg border transition-colors ${isActive
                                ? "border-orange-500/70 bg-orange-500/10"
                                : "border-border bg-card"
                                }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTeamId(team.id ?? null);
                                  setTeamDetailTeam(team);
                                  setTeamDetailOpen(true);
                                }}
                                className="min-w-0 flex-1 px-3 py-2 text-left hover:bg-muted/30"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                      {team.name}
                                    </p>
                                    <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                                      <span className="inline-flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {membersCount} members
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        Team
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${isActive ? "bg-orange-500" : "bg-muted-foreground/60"
                                      }`}
                                    aria-hidden
                                  />
                                </div>
                              </button>
                              {viewerOwnsCampaign && team.id != null ? (
                                <button
                                  type="button"
                                  className="shrink-0 border-l border-border px-2.5 hover:bg-muted/40"
                                  aria-label="Edit team"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEditTeamId(team.id!);
                                    setEditTeamNameValue(team.name ?? "");
                                    setEditTeamOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4 text-muted-foreground" />
                                </button>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-lg border border-border bg-muted/30 px-3 py-4 text-center text-sm text-muted-foreground">
                        {(campaign.teams?.length ?? 0) > 0
                          ? "You’re not on any team for this campaign. Only teams you belong to are shown here."
                          : "No teams added yet."}
                      </p>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Members</h4>
                      <p className="text-xs text-muted-foreground">
                        {isCreatorAccount
                          ? "Collaborators on this campaign (accepted proposals & teams)"
                          : "Manage your team members and inbox"}
                      </p>
                    </div>

                    {selectedTeam ? (
                      membersForDisplay.length > 0 ? (
                        <div className="space-y-2">
                          {membersForDisplay.map((member, idx) => (
                            <div
                              key={`${member.email}-${idx}`}
                              className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                            >
                              <div className="min-w-0 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-xs font-semibold text-orange-500">
                                  {(member.name?.[0] ?? "?").toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-foreground">
                                    {member.name}
                                  </p>
                                  <p className="truncate text-[11px] text-muted-foreground">
                                    {member.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <button
                                  type="button"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted"
                                  aria-label="Message member"
                                  onClick={() => {
                                    setMemberChatOpen(true);
                                    setMemberChatTarget({ name: member.name, email: member.email });
                                    setMemberChatConversationId(null);
                                    setMemberChatDraft("");
                                    openMemberChatMutation.mutate({
                                      name: member.name,
                                      email: member.email,
                                    });
                                  }}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted"
                                  aria-label="More options"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-lg border border-border bg-muted/30 px-3 py-4 text-center text-sm text-muted-foreground">
                          No members in this team yet.
                        </p>
                      )
                    ) : (
                      <p className="rounded-lg border border-border bg-muted/30 px-3 py-4 text-center text-sm text-muted-foreground">
                        {teams.length === 0
                          ? "Join or be added to a team to see members here."
                          : "Select a team to view members."}
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

      {showProjectWizard && (
        <CreateProjectForm
          initialCampaignId={campaign.id}
          mode="embedded"
          onClose={() => setShowProjectWizard(false)}
        />
      )}

      <Dialog
        open={teamDetailOpen}
        onOpenChange={(open) => {
          setTeamDetailOpen(open);
          if (!open) setTeamDetailTeam(null);
        }}
      >
        <DialogContent className="max-w-md border-border bg-card sm:max-w-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-left text-xl font-bold">
              {teamDetailTeam?.name ?? "Team"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {teamDetailTeam?.id != null
                ? `Team #${teamDetailTeam.id} · ${teamDetailMembers.length} member${teamDetailMembers.length === 1 ? "" : "s"
                }`
                : "Members on this team."}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[min(60vh,420px)] overflow-y-auto rounded-md border border-border/80">
            {teamDetailMembers.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No members on this team yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {teamDetailMembers.map((m, idx) => (
                  <li key={`${m.email}-${idx}`} className="flex items-center gap-3 px-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-sm font-semibold text-orange-600">
                      {(m.name?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {viewerOwnsCampaign && teamDetailTeam?.id != null ? (
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setTeamDetailOpen(false);
                  setEditTeamId(teamDetailTeam.id!);
                  setEditTeamNameValue(teamDetailTeam.name ?? "");
                  setAddMemberQuery("");
                  setAddInviteName("");
                  setAddInviteEmail("");
                  setEditTeamOpen(true);
                }}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit team
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {viewerOwnsCampaign ? (
      <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
        <DialogContent className="max-w-md border-border bg-card">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-bold">Create a new team</DialogTitle>
            <DialogDescription>Create a pool of professionals to work on</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Team name</label>
              <input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Safaricom Jazz 2024 Edition"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Members</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={newTeamMemberQuery}
                  onChange={(e) => setNewTeamMemberQuery(e.target.value)}
                  placeholder="Add Members to a team by name or email"
                  className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>
              {newTeamMemberQuery.trim().length >= 2 ? (
                <div className="max-h-32 overflow-y-auto rounded-md border border-border bg-muted/20 p-1">
                  {searchingTeamMembers ? (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : candidateUsers.length > 0 ? (
                    candidateUsers.map((u) => {
                      const email = String(u.email ?? "").trim().toLowerCase();
                      const name =
                        [u.firstname, u.lastname].filter(Boolean).join(" ").trim() || email;
                      const exists = newTeamMembers.some(
                        (m) => m.email.trim().toLowerCase() === email
                      );
                      return (
                        <button
                          key={`${email}-${u.id ?? "x"}`}
                          type="button"
                          disabled={exists || !email}
                          className="hover:bg-muted flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm disabled:opacity-50"
                          onClick={() => {
                            if (!email || exists) return;
                            setNewTeamMembers((prev) => [
                              ...prev,
                              { name, email, role: "Member" },
                            ]);
                            setNewTeamMemberQuery("");
                          }}
                        >
                          <span className="truncate">{name}</span>
                          <span className="text-xs text-muted-foreground">
                            {exists ? "Added" : "Add"}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-2 py-2 text-xs text-muted-foreground">No users found.</p>
                  )}
                </div>
              ) : null}

              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-medium text-muted-foreground">Not on a team yet</p>
                <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-muted/10 p-1">
                  {loadingAvailableTeamMembers ? (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : availableTeamMembers.length === 0 ? (
                    <p className="px-2 py-2 text-xs text-muted-foreground">
                      Everyone tied to this campaign is already on a team, or there are no linked collaborators yet.
                    </p>
                  ) : (
                    availableTeamMembers.map((u) => {
                      const email = String(u.email ?? "").trim().toLowerCase();
                      const name =
                        [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || email;
                      const exists = newTeamMembers.some(
                        (m) => m.email.trim().toLowerCase() === email
                      );
                      return (
                        <button
                          key={`avail-${u.id}-${email}`}
                          type="button"
                          disabled={exists || !email}
                          className="hover:bg-muted flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm disabled:opacity-50"
                          onClick={() => {
                            if (!email || exists) return;
                            setNewTeamMembers((prev) => [
                              ...prev,
                              { name, email, role: "Member" },
                            ]);
                          }}
                        >
                          <span className="truncate">{name}</span>
                          <span className="text-xs text-muted-foreground">
                            {exists ? "Added" : "Add"}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Invite by email (no Paza account yet)
                </p>
                <p className="text-xs text-muted-foreground">
                  They are added to this team now; when you create the team, we email them a link to sign up with this address.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="min-w-0 flex-1 space-y-1">
                    <label className="sr-only" htmlFor="invite-nonuser-name">
                      Name (optional)
                    </label>
                    <input
                      id="invite-nonuser-name"
                      value={inviteNonUserName}
                      onChange={(e) => setInviteNonUserName(e.target.value)}
                      placeholder="Name (optional)"
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <label className="sr-only" htmlFor="invite-nonuser-email">
                      Email
                    </label>
                    <input
                      id="invite-nonuser-email"
                      type="email"
                      value={inviteNonUserEmail}
                      onChange={(e) => setInviteNonUserEmail(e.target.value)}
                      placeholder="Email address"
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 shrink-0 border-orange-500/40 text-orange-700 hover:bg-orange-500/10"
                    onClick={() => {
                      const email = inviteNonUserEmail.trim().toLowerCase();
                      const simple =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email);
                      if (!simple) {
                        toast.error("Enter a valid email address.");
                        return;
                      }
                      const exists = newTeamMembers.some(
                        (m) => m.email.trim().toLowerCase() === email
                      );
                      if (exists) {
                        toast.error("That address is already on this team list.");
                        return;
                      }
                      const name =
                        inviteNonUserName.trim() ||
                        email.split("@")[0] ||
                        "Member";
                      setNewTeamMembers((prev) => [
                        ...prev,
                        { name, email, role: "Member", sendSignupInvite: true },
                      ]);
                      setInviteNonUserName("");
                      setInviteNonUserEmail("");
                      toast.success(
                        "Added. A signup invite will be sent when you create the team (if they do not already have an account)."
                      );
                    }}
                  >
                    Add &amp; invite
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {newTeamMembers.map((m, idx) => (
                <div key={`${m.email}-${idx}`} className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-2 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-xs font-semibold text-orange-500">
                    {(m.name?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    {m.sendSignupInvite ? (
                      <p className="truncate text-[11px] text-orange-700/90">
                        Signup invite email when team is created
                      </p>
                    ) : null}
                  </div>
                  <select
                    value={m.role}
                    onChange={(e) => {
                      const role = e.target.value as DraftTeamMember["role"];
                      setNewTeamMembers((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, role } : x))
                      );
                    }}
                    className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted"
                    aria-label="Remove member"
                    onClick={() =>
                      setNewTeamMembers((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateTeamOpen(false);
                  setNewTeamName("");
                  setNewTeamMemberQuery("");
                  setNewTeamMembers([]);
                  setInviteNonUserName("");
                  setInviteNonUserEmail("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-orange-500 text-white hover:bg-orange-600"
                disabled={createTeamMutation.isPending || newTeamName.trim().length === 0}
                onClick={() => createTeamMutation.mutate()}
              >
                {createTeamMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      ) : null}

      <Dialog
        open={editTeamOpen}
        onOpenChange={(open) => {
          setEditTeamOpen(open);
          if (!open) {
            setEditTeamId(null);
            setAddMemberQuery("");
            setAddInviteName("");
            setAddInviteEmail("");
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-border bg-card">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-bold">Edit team</DialogTitle>
            <DialogDescription>
              Update the name for{" "}
              <span className="font-medium text-foreground">
                {editDialogTeam?.name ?? "this team"}
              </span>
              . Adding or removing members applies immediately; use <span className="font-medium">Save</span> only
              for the team name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Team name</label>
              <input
                value={editTeamNameValue}
                onChange={(e) => setEditTeamNameValue(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Current members</p>
              {(editDialogTeam?.members ?? []).length === 0 ? (
                <p className="rounded-md border border-border bg-muted/20 px-3 py-3 text-xs text-muted-foreground">
                  No one on this team yet. Add people below.
                </p>
              ) : (
                <ul className="max-h-40 space-y-1.5 overflow-y-auto rounded-md border border-border bg-muted/10 p-2">
                  {(editDialogTeam?.members ?? []).map((m) => {
                    const email = String(m.email ?? "").trim().toLowerCase();
                    const canRemove =
                      m.id != null &&
                      editTeamId != null &&
                      !removeTeamMemberMutation.isPending &&
                      !addTeamMemberToTeamMutation.isPending;
                    return (
                      <li
                        key={m.id ?? email}
                        className="flex items-center justify-between gap-2 rounded-md bg-background/80 px-2 py-1.5 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{m.name || email}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{email}</p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive disabled:opacity-40"
                          disabled={!canRemove}
                          title={m.id == null ? "Cannot remove (missing id)" : "Remove from team"}
                          aria-label={`Remove ${m.name ?? email}`}
                          onClick={() => {
                            if (editTeamId == null || m.id == null) return;
                            removeTeamMemberMutation.mutate({
                              teamId: editTeamId,
                              memberId: m.id,
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Search users</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={addMemberQuery}
                  onChange={(e) => setAddMemberQuery(e.target.value)}
                  placeholder="Name or email (min. 2 characters)"
                  className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>
              {addMemberQuery.trim().length >= 2 ? (
                <div className="max-h-32 overflow-y-auto rounded-md border border-border bg-muted/20 p-1">
                  {searchingAddMembers ? (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : addMemberSearchResults.length > 0 ? (
                    addMemberSearchResults.map((u) => {
                      const email = String(u.email ?? "").trim().toLowerCase();
                      const name =
                        [u.firstname, u.lastname].filter(Boolean).join(" ").trim() || email;
                      const onTeam = emailsOnEditTargetTeam.has(email);
                      return (
                        <button
                          key={`add-${email}-${u.id ?? "x"}`}
                          type="button"
                          disabled={
                            !email ||
                            onTeam ||
                            editTeamId == null ||
                            addTeamMemberToTeamMutation.isPending
                          }
                          className="hover:bg-muted flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm disabled:opacity-50"
                          onClick={() => {
                            if (!email || onTeam || editTeamId == null) return;
                            addTeamMemberToTeamMutation.mutate({
                              teamId: editTeamId,
                              name,
                              email,
                            });
                            setAddMemberQuery("");
                          }}
                        >
                          <span className="truncate">{name}</span>
                          <span className="text-xs text-muted-foreground">
                            {onTeam ? "Already on team" : "Add"}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-2 py-2 text-xs text-muted-foreground">No users found.</p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Not on a team yet</p>
              <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-muted/10 p-1">
                {loadingAvailableTeamMembers ? (
                  <div className="flex items-center justify-center py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : availableForAddDialog.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-muted-foreground">
                    No one left to add from this list, or everyone is already on a team.
                  </p>
                ) : (
                  availableForAddDialog.map((u) => {
                    const email = String(u.email ?? "").trim().toLowerCase();
                    const name =
                      [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || email;
                    const onTeam = emailsOnEditTargetTeam.has(email);
                    return (
                      <button
                        key={`add-avail-${u.id}-${email}`}
                        type="button"
                        disabled={
                          !email ||
                          onTeam ||
                          editTeamId == null ||
                          addTeamMemberToTeamMutation.isPending
                        }
                        className="hover:bg-muted flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm disabled:opacity-50"
                        onClick={() => {
                          if (!email || onTeam || editTeamId == null) return;
                          addTeamMemberToTeamMutation.mutate({
                            teamId: editTeamId,
                            name,
                            email,
                          });
                        }}
                      >
                        <span className="truncate">{name}</span>
                        <span className="text-xs text-muted-foreground">Add</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Invite by email (no Paza account yet)
              </p>
              <p className="text-xs text-muted-foreground">
                Adds them to this team and sends a signup link if they do not already have an account.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <input
                    value={addInviteName}
                    onChange={(e) => setAddInviteName(e.target.value)}
                    placeholder="Name (optional)"
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <input
                    type="email"
                    value={addInviteEmail}
                    onChange={(e) => setAddInviteEmail(e.target.value)}
                    placeholder="Email address"
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 shrink-0 border-orange-500/40 text-orange-700 hover:bg-orange-500/10"
                  disabled={editTeamId == null || addTeamMemberToTeamMutation.isPending}
                  onClick={() => {
                    const email = addInviteEmail.trim().toLowerCase();
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
                      toast.error("Enter a valid email address.");
                      return;
                    }
                    if (emailsOnEditTargetTeam.has(email)) {
                      toast.error("That address is already on this team.");
                      return;
                    }
                    if (editTeamId == null) return;
                    const name =
                      addInviteName.trim() || email.split("@")[0] || "Member";
                    addTeamMemberToTeamMutation.mutate({
                      teamId: editTeamId,
                      name,
                      email,
                      sendSignupInvite: true,
                    });
                    setAddInviteName("");
                    setAddInviteEmail("");
                  }}
                >
                  Add &amp; invite
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={() => setEditTeamOpen(false)}>
                Close
              </Button>
              <Button
                type="button"
                className="bg-orange-500 text-white hover:bg-orange-600"
                disabled={
                  updateTeamMutation.isPending ||
                  !editTeamNameValue.trim() ||
                  editTeamId == null
                }
                onClick={() => {
                  if (editTeamId == null) return;
                  updateTeamMutation.mutate({
                    teamId: editTeamId,
                    name: editTeamNameValue.trim(),
                  });
                }}
              >
                {updateTeamMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save name
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={memberChatOpen}
        onOpenChange={(open) => {
          setMemberChatOpen(open);
          if (!open) setMemberChatDraft("");
        }}
      >
        <DialogContent className="max-w-lg border-border bg-card p-0">
          <DialogHeader className="border-b border-border px-4 py-3">
            <DialogTitle className="text-base">
              Chat with {memberChatTarget?.name ?? "member"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {memberChatTarget?.email ?? "Loading member..."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex h-[420px] flex-col">
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {openMemberChatMutation.isPending || (memberChatLoading && !memberChatConversationId) ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : memberChatConversationId ? (
                memberChatMessages.length > 0 ? (
                  (memberChatMessages as ApiMessage[]).map((msg) => {
                    const mine = String(msg.sender) === viewerId;
                    return (
                      <div
                        key={msg._id ?? `${msg.sender}-${msg.createdAt}-${msg.text}`}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${mine ? "bg-orange-500 text-white" : "bg-muted text-foreground"
                            }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          {msg.createdAt ? (
                            <p
                              className={`mt-1 text-[10px] ${mine ? "text-orange-50/80" : "text-muted-foreground"
                                }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No messages yet. Say hello.
                  </p>
                )
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Could not open conversation for this member.
                </p>
              )}
            </div>

            <div className="border-t border-border p-3">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = memberChatDraft.trim();
                  if (!text || !memberChatConversationId || sendMemberChatMutation.isPending) return;
                  sendMemberChatMutation.mutate(text);
                }}
              >
                <input
                  value={memberChatDraft}
                  onChange={(e) => setMemberChatDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
                  disabled={!memberChatConversationId || sendMemberChatMutation.isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 bg-orange-500 text-white hover:bg-orange-600"
                  disabled={
                    !memberChatConversationId ||
                    sendMemberChatMutation.isPending ||
                    memberChatDraft.trim().length === 0
                  }
                >
                  {sendMemberChatMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <EditCampaignModal
        open={editCampaignOpen}
        onOpenChange={setEditCampaignOpen}
        campaignId={campaignId}
      />
      <EscrowDetailsModal
        escrowId={selectedEscrowId}
        open={escrowDetailsOpen}
        onOpenChange={setEscrowDetailsOpen}
        viewerUserId={Number(viewerId)}
      />
    </div>
  );
}
