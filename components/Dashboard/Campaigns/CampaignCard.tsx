"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/types/campaigns/campaignTypes";
import { RiCalendarLine, RiEdit2Line, RiDeleteBin6Line, RiTeamLine, RiFileList3Line, RiMoneyDollarCircleLine } from "@remixicon/react";

interface Props {
  campaign: Campaign;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onOpen: (id: number) => void;
  onAddProject?: (campaignId: number) => void;
  /** Label for the left primary action (e.g. brands: "Create a job", creators: "Create Project"). */
  primaryCtaLabel?: string;
}

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onOpen,
  onAddProject,
  primaryCtaLabel = "Create Project",
}: Props) {
  const creators = campaign.teams?.find(t => t.name.toLowerCase().includes("creator"))?.members?.length || 0;
  const milestoneDeliverables = campaign.milestones?.reduce((acc, m) => acc + (m.objectives?.length || 0), 0) || 0;
  const deliverables = milestoneDeliverables > 0 ? milestoneDeliverables : (campaign.goals?.length || 0);
  const amountSpent = Number(campaign.budget) || campaign.milestones?.reduce((acc, m) => acc + (Number(m.budget) || 0), 0) || 0;
  const postedRaw =
    (campaign as { startDate?: string }).startDate ??
    campaign.milestones?.[0]?.start;
  const posted = postedRaw ? new Date(postedRaw) : undefined;

  return (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary" onClick={() => onOpen(campaign.id)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg line-clamp-1">{campaign.title}</h3>
          {(campaign.active ?? true) ? (
            <Badge className="bg-green-600 text-white">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <RiTeamLine className="h-4 w-4" />
            <span className="font-medium">{creators}</span>
            <span className="text-muted-foreground">creators</span>
          </div>
          <div className="flex items-center gap-2">
            <RiFileList3Line className="h-4 w-4" />
            <span className="font-medium">{deliverables}</span>
            <span className="text-muted-foreground">deliverables</span>
          </div>
          <div className="flex items-center gap-2">
            <RiMoneyDollarCircleLine className="h-4 w-4" />
            <span className="font-medium">KSh {amountSpent.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <RiCalendarLine className="h-4 w-4" />
            <span className="text-muted-foreground">{posted ? posted.toLocaleDateString() : "—"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between gap-2">
        {onAddProject ? (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddProject(campaign.id);
            }}
          >
            {primaryCtaLabel}
          </Button>
        ) : (
          <div />
        )}
        {(onEdit || onDelete) ? (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(campaign.id);
                }}
              >
                <RiEdit2Line className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(campaign.id);
                }}
              >
                <RiDeleteBin6Line className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
        ) : (
          <div />
        )}
      </CardFooter>
    </Card>
  );
}


