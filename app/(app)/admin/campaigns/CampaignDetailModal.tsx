
"use client";

import { useState } from "react";
import {
  X,
  GitBranch,
  Target,
  DollarSign,
  Users,
  Clock,
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  AssignedCreator,
  Campaign,
  ContentPipelineItem,
  SuggestedCreator,
} from "./campaign";

type TabId = "overview" | "creators" | "matching" | "budget" | "pipeline";

interface CampaignDetailModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export default function CampaignDetailModal({
  campaign,
  onClose,
}: CampaignDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [expandedMatchIndex, setExpandedMatchIndex] = useState<number | null>(null);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#181C23] border border-[#262B36] rounded-2xl max-w-5xl w-full my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-[#0F1115] border-b border-[#262B36] px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition p-1 hover:bg-[#1B2029] rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TABS */}
        <div className="bg-[#0F1115] border-b border-[#262B36] px-6 py-4 flex gap-2 overflow-x-auto">
          {(
            [
              { id: "overview" as const, label: "Overview", icon: Target },
              { id: "creators" as const, label: "Assigned Creators", icon: Users },
              { id: "matching" as const, label: "Matching Transparency", icon: TrendingUp },
              { id: "budget" as const, label: "Budget", icon: DollarSign },
              { id: "pipeline" as const, label: "Content Pipeline", icon: Clock },
            ] satisfies { id: TabId; label: string; icon: typeof Target }[]
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition border ${
                  activeTab === tab.id
                    ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
                    : "bg-[#1B2029] border-[#2A3140] text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Campaign Brief
                  </h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 hover:bg-orange-500/20 transition text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    {editMode ? "Done" : "Edit"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InfoItem label="Brand" value={campaign.brand} />
                  <InfoItem
                    label="Budget"
                    value={`KES ${campaign.budget.toLocaleString()}`}
                  />
                </div>

                <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4 mb-4">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                    Objectives
                  </p>
                  <p className="text-white">{campaign.brief}</p>
                </div>

                <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                    Requirements
                  </p>
                  <p className="text-white">{campaign.requirements}</p>
                </div>
              </div>

              {/* STATUS PIPELINE */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-orange-400" />
                  Status Pipeline
                </h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {["Draft", "Matching", "Live", "Review", "Completed"].map(
                    (stage, idx) => (
                      <div key={stage} className="flex items-center gap-2">
                        <div
                          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
                            campaign.statusPipeline === stage.toLowerCase()
                              ? "bg-orange-500/20 border border-orange-500/40 text-orange-300"
                              : "bg-[#1B2029] border border-[#2A3140] text-zinc-400"
                          }`}
                        >
                          {stage}
                        </div>
                        {idx < 4 && (
                          <div className="w-4 h-0.5 bg-[#2A3140]" />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ASSIGNED CREATORS TAB */}
          {activeTab === "creators" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Currently Assigned ({campaign.creatorsAssigned}/{campaign.creatorsNeeded})
                </h3>
                {campaign.assignedCreators.length > 0 ? (
                  <div className="space-y-2">
                    {campaign.assignedCreators.map((creator: AssignedCreator) => (
                      <div
                        key={creator.id}
                        className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-white font-medium">{creator.name}</p>
                          <p className="text-xs text-green-400">
                            ● {creator.status}
                          </p>
                        </div>
                        <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm">No creators assigned yet</p>
                )}
              </div>
            </div>
          )}

          {/* MATCHING TRANSPARENCY TAB */}
          {activeTab === "matching" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  Suggested Creators Based on Tags
                </h3>

                <p className="text-sm text-zinc-400 mb-4">
                  Below are creators matched to this campaign based on niche tags, audience
                  alignment, and engagement rates. You can assign, override, or reject each match.
                </p>

                <div className="space-y-4">
                  {campaign.suggestedCreators.map((creator: SuggestedCreator, idx: number) => (
                    <MatchingCreatorCard
                      key={idx}
                      creator={creator}
                      isExpanded={expandedMatchIndex === idx}
                      onToggle={() =>
                        setExpandedMatchIndex(
                          expandedMatchIndex === idx ? null : idx
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {activeTab === "budget" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-400" />
                Budget Tracking
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <BudgetCard
                  label="Total"
                  amount={campaign.budgetTracking.total}
                />
                <BudgetCard
                  label="Allocated"
                  amount={campaign.budgetTracking.allocated}
                />
                <BudgetCard
                  label="Spent"
                  amount={campaign.budgetTracking.spent}
                />
                <BudgetCard
                  label="Remaining"
                  amount={campaign.budgetTracking.remaining}
                />
              </div>

              <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-zinc-400 text-sm">Spending Progress</p>
                  <p className="text-white font-semibold">
                    {Math.round(
                      (campaign.budgetTracking.spent /
                        campaign.budgetTracking.total) *
                        100
                    )}
                    %
                  </p>
                </div>
                <div className="h-3 bg-[#2A3140] rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-orange-500 rounded-full"
                    style={{
                      width: `${
                        (campaign.budgetTracking.spent /
                          campaign.budgetTracking.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PIPELINE TAB */}
          {activeTab === "pipeline" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Content Pipeline
              </h3>

              {campaign.contentPipeline.length > 0 ? (
                <div className="space-y-3">
                  {campaign.contentPipeline.map((content: ContentPipelineItem, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">{content.title}</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Due: {content.dueDate}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-300 text-xs font-medium">
                          {content.deliveredCount} delivered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">No content pipeline set up yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchingCreatorCard({
  creator,
  isExpanded,
  onToggle,
}: {
  creator: SuggestedCreator;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer hover:opacity-80 transition"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-white font-semibold">{creator.name}</p>
              <p className="text-xs text-zinc-500 mt-1">Click to view details</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-orange-400 font-bold text-lg">
              {creator.matchScore}/10
            </p>
            <p className="text-xs text-zinc-500">Match Score</p>
          </div>
          <div
            className={`text-zinc-500 transition ${isExpanded ? "rotate-180" : ""}`}
          >
            ▼
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#2A3140] space-y-4">
          <div>
            <p className="text-sm font-semibold text-zinc-400 mb-3 uppercase">
              Why This Match?
            </p>
            <div className="space-y-2">
              <MatchFactor
                label="Tag Alignment"
                value="Fashion, Lifestyle match campaign requirements"
                status="match"
              />
              <MatchFactor
                label="Audience Age Distribution"
                value="25-34 age group: 40% (matches target demographic)"
                status="match"
              />
              <MatchFactor
                label="Engagement Rate"
                value="4.2% engagement (above platform average 3.5%)"
                status="good"
              />
              <MatchFactor
                label="Geographic Alignment"
                value="Primary audience: US (matches campaign location)"
                status="match"
              />
              <MatchFactor
                label="Growth Trajectory"
                value="+8% monthly growth (consistent audience building)"
                status="good"
              />
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-[#242B36] rounded-lg p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-zinc-500 mb-1">Match Quality</p>
                <p className="text-green-400 font-bold">Excellent</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Confidence Level</p>
                <p className="text-orange-400 font-bold">87%</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 px-3 py-2.5 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 hover:bg-green-500/30 transition text-sm font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Assign
            </button>
            <button className="flex-1 px-3 py-2.5 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-400 hover:bg-blue-500/30 transition text-sm font-medium">
              Override
            </button>
            <button className="flex-1 px-3 py-2.5 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/30 transition text-sm font-medium">
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchFactor({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "match" | "good" | "warning" | "mismatch";
}) {
  const statusConfig = {
    match: {
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      icon: "✓",
      color: "text-green-300",
    },
    good: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: "→",
      color: "text-blue-300",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: "!",
      color: "text-yellow-300",
    },
    mismatch: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: "✕",
      color: "text-red-300",
    },
  }[status];

  return (
    <div
      className={`${statusConfig.bg} border ${statusConfig.border} rounded-lg p-3 flex items-start gap-3`}
    >
      <span className={`font-bold text-lg ${statusConfig.color}`}>
        {statusConfig.icon}
      </span>
      <div>
        <p className={`font-medium text-sm ${statusConfig.color}`}>{label}</p>
        <p className="text-xs text-zinc-400 mt-1">{value}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}

function BudgetCard({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-3">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-white font-semibold">
        KES {(amount / 1000).toFixed(0)}K
      </p>
    </div>
  );
}