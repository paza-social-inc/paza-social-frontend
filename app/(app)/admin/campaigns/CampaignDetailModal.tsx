"use client";

import { useState } from "react";
import {
  X,
  Target,
  GitBranch,
  DollarSign,
  Users,
  Clock,
  Edit,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Campaign } from "./campaign";
import { BudgetCard, ActionButton } from "@/components/Admin/ui";

interface CampaignDetailModalProps {
  campaign: Campaign;
  onClose: () => void;
}

const PIPELINE_STAGES = ["Draft", "Matching", "Live", "Review", "Completed"] as const;

export function CampaignDetailModal({ campaign, onClose }: CampaignDetailModalProps) {
  const [editMode, setEditMode] = useState(false);

  const spendPercent = Math.round(
    (campaign.budgetTracking.spent / campaign.budgetTracking.total) * 100
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#181C23] border border-[#262B36] rounded-2xl max-w-5xl w-full my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0F1115] border-b border-[#262B36] px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition p-1 hover:bg-[#1B2029] rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-80px)] overflow-y-auto">

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
              <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Brand</p>
                <p className="text-white text-lg font-semibold">{campaign.brand}</p>
              </div>
              <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Budget</p>
                <p className="text-white text-lg font-semibold">
                  KES {campaign.budget.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4 mb-4">
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Objectives</p>
              <p className="text-white">{campaign.brief}</p>
            </div>

            <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Requirements</p>
              <p className="text-white">{campaign.requirements}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-orange-400" />
              Status Pipeline
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {PIPELINE_STAGES.map((stage, idx) => (
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
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
              ))}
            </div>
            {editMode && (
              <div className="mt-4 flex gap-2">
                <select className="px-3 py-2 bg-[#1A1F29] border border-[#2B3240] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Force status to...</option>
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button className="px-3 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-lg text-sm hover:bg-orange-500/30 transition">
                  Update
                </button>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-400" />
              Budget Tracking
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <BudgetCard label="Total" amount={campaign.budgetTracking.total} />
              <BudgetCard label="Allocated" amount={campaign.budgetTracking.allocated} />
              <BudgetCard label="Spent" amount={campaign.budgetTracking.spent} />
              <BudgetCard label="Remaining" amount={campaign.budgetTracking.remaining} />
            </div>
            <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-zinc-400 text-sm">Spending Progress</p>
                <p className="text-white font-semibold">{spendPercent}%</p>
              </div>
              <div className="h-3 bg-[#2A3140] rounded-full overflow-hidden">
                <div
                  className="h-3 bg-orange-500 rounded-full"
                  style={{ width: `${spendPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                Assigned Creators ({campaign.creatorsAssigned}/{campaign.creatorsNeeded})
              </h3>
              {editMode && (
                <button className="text-orange-400 text-sm hover:text-orange-300 flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              )}
            </div>

            <div className="space-y-2 mb-6">
              {campaign.assignedCreators.length > 0 ? (
                campaign.assignedCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-medium">{creator.name}</p>
                      <p className="text-xs text-green-400">● {creator.status}</p>
                    </div>
                    {editMode && (
                      <button className="text-red-400 hover:text-red-300">
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">No creators assigned yet</p>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-blue-300 font-medium mb-3">
                Suggested Creators Based on Tags
              </p>
              <div className="space-y-2">
                {campaign.suggestedCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex justify-between items-center p-3 bg-[#1B2029] rounded-lg"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-orange-400">
                        Match Score: {creator.matchScore}/10
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/30 transition">
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {campaign.contentPipeline.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Content Pipeline
              </h3>
              <div className="space-y-3">
                {campaign.contentPipeline.map((content, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{content.title}</p>
                        <p className="text-xs text-zinc-500 mt-1">Due: {content.dueDate}</p>
                      </div>
                      <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-300 text-xs font-medium">
                        {content.deliveredCount} delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
            <p className="text-zinc-400 text-sm mb-4 uppercase tracking-wider">Actions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ActionButton icon={Plus} label="Add Creators" variant="primary" />
              <ActionButton icon={Edit} label="Edit Campaign" variant="primary" />
              <ActionButton icon={Trash2} label="Cancel Campaign" variant="danger" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
