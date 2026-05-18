"use client";

import { useState } from "react";
import {
  X,
  Shield,
  Zap,
  Users,
  Filter,
  Flag,
  Edit,
  CheckCircle2,
  Lock,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Creator } from "../creator";
import { InfoItem, ActionButton, formatFollowers } from "@/components/Admin/ui";
import { PlatformCard } from "./PlatformCard";
import { TagCategory } from "./TagCategory";

interface CreatorDetailModalProps {
  creator: Creator;
  onClose: () => void;
}

export function CreatorDetailModal({ creator, onClose }: CreatorDetailModalProps) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#181C23] border border-[#262B36] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-[#0F1115] border-b border-[#262B36] px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{creator.name}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition p-1 hover:bg-[#1B2029] rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* BASIC INFO */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                Full Profile
              </h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 hover:bg-orange-500/20 transition text-sm"
              >
                <Edit className="w-4 h-4" />
                {editMode ? "Done Editing" : "Edit Fields"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem label="Email" value={creator.email} />
              <InfoItem label="Shard ID" value={creator.shardId} />
              <InfoItem label="Completion Rate" value={`${creator.averageCompletionRate}%`} />
            </div>
          </div>

          {/* PLATFORM CONNECTIONS */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Platform Connections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlatformCard
                name="Instagram"
                username={creator.platforms.instagram.username}
                followers={creator.platforms.instagram.followers}
                verified={creator.platforms.instagram.verified}
              />
              <PlatformCard
                name="TikTok"
                username={creator.platforms.tiktok.username}
                followers={creator.platforms.tiktok.followers}
                verified={creator.platforms.tiktok.verified}
              />
              <PlatformCard
                name="YouTube"
                username={creator.platforms.youtube.username}
                followers={creator.platforms.youtube.followers}
                verified={creator.platforms.youtube.verified}
              />
            </div>
          </div>

          {/* AUDIENCE BREAKDOWN */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Audience Breakdown (Structured Fields)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Engagement & Growth */}
              <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-3">Engagement Rate</p>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-white">
                    {creator.audienceData.engagementRate}%
                  </p>
                  <p className="text-green-400 text-sm mt-1">
                    +{creator.audienceData.growthRate}% monthly growth
                  </p>
                </div>
                <p className="text-zinc-400 text-sm mb-2">Total Followers</p>
                <p className="text-2xl font-bold text-white">
                  {formatFollowers(creator.audienceData.totalFollowers)}
                </p>
              </div>

              {/* Top Locations */}
              <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-3">Top Locations</p>
                <div className="space-y-2">
                  {creator.audienceData.topLocations.map((location) => (
                    <div
                      key={location}
                      className="flex justify-between items-center px-2 py-2 bg-[#242B36] rounded"
                    >
                      <span className="text-white text-sm">{location}</span>
                      <span className="text-orange-400 text-sm font-semibold">
                        {Math.floor(Math.random() * 30) + 15}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Age Distribution */}
            <div className="mt-4 bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
              <p className="text-zinc-400 text-sm mb-3">Age Distribution</p>
              <div className="space-y-3">
                {Object.entries(creator.audienceData.ageRanges).map(([age, percentage]) => (
                  <div key={age} className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm w-12">{age}</span>
                    <div className="h-2 bg-[#2A3140] rounded-full flex-1 mx-4">
                      <div
                        className="h-2 bg-orange-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT SAMPLES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📸 Content Samples
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {creator.contentSamples.map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-[#1B2029] border border-[#2A3140] rounded-xl flex items-center justify-center hover:border-orange-500/50 transition cursor-pointer"
                >
                  <div className="text-center">
                    <p className="text-2xl mb-2">🖼️</p>
                    <p className="text-xs text-zinc-500">Content {idx + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAMPAIGN HISTORY */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              Campaign History
            </h3>
            <div className="space-y-3">
              {creator.campaignHistory.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4 flex justify-between items-center hover:border-[#3A4350] transition"
                >
                  <div>
                    <p className="text-white font-medium">{campaign.name}</p>
                    <p className="text-sm text-zinc-500">{campaign.brand}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-xs font-medium">
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TAGS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-orange-400" />
                Tags
              </h3>
              {editMode && (
                <button className="text-orange-400 text-sm hover:text-orange-300">
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Tag
                </button>
              )}
            </div>
            <div className="space-y-4">
              <TagCategory title="Niche" tags={creator.tags.niche} editable={editMode} />
              <TagCategory title="Style" tags={creator.tags.style} editable={editMode} />
              <TagCategory title="Audience Type" tags={creator.tags.audience} editable={editMode} />
              <TagCategory title="Values" tags={creator.tags.values} editable={editMode} />
              <TagCategory title="Narrative" tags={creator.tags.narrative} editable={editMode} />
            </div>
          </div>

          {/* FLAGS */}
          {creator.flags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-400" />
                Flags & Issues ({creator.flags.length})
              </h3>
              <div className="space-y-3">
                {creator.flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-red-300 font-medium capitalize">
                        {flag.type.replace(/_/g, " ")}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          flag.severity === "high"
                            ? "bg-red-500/20 text-red-300"
                            : flag.severity === "medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
            <p className="text-zinc-400 text-sm mb-4 uppercase tracking-wider">Actions</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ActionButton icon={Flag} label="Flag Creator" variant="danger" />
              <ActionButton icon={CheckCircle2} label="Verify" variant="success" />
              <ActionButton icon={Lock} label="Suspend" variant="warning" />
              <ActionButton icon={RefreshCw} label="Refresh Data" variant="primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
