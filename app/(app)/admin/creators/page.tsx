"use client";

import { useState } from "react";
import { Users, Search, TrendingUp, Eye } from "lucide-react";
import AdminNav from "@/components/Admin/AdminNav";
import { StatusBadge, formatFollowers } from "@/components/Admin/ui";
import { CreatorDetailModal } from "./components/CreatorDetailModal";
import { MOCK_CREATORS } from "./mockCreators";
import { Creator, CreatorSortField, CreatorStatusFilter } from "./creator";

// ─── Platform SVG Icons ────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 24 15" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="22" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <polygon points="9.5,4 9.5,11 16,7.5" fill="currentColor" />
    </svg>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CreatorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CreatorStatusFilter>("all");
  const [sortBy, setSortBy] = useState<CreatorSortField>("name");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const filteredCreators = MOCK_CREATORS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shardId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":       return a.name.localeCompare(b.name);
      case "engagement": return b.audienceData.engagementRate - a.audienceData.engagementRate;
      case "followers":  return b.audienceData.totalFollowers - a.audienceData.totalFollowers;
      case "earnings":   return b.totalEarnings - a.totalEarnings;
      default:           return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      <AdminNav />

      <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Creators Control</h1>
          <p className="text-zinc-400">Manage creators, verify profiles, and monitor engagement</p>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, email, or shard ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CreatorStatusFilter)}
            className="w-full px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as CreatorSortField)}
            className="w-full px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="name">Sort by Name</option>
            <option value="engagement">Sort by Engagement</option>
            <option value="followers">Sort by Followers</option>
            <option value="earnings">Sort by Earnings</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#262B36] bg-[#0F1115]">
                  {["Creator", "Platforms", "Followers", "Engagement", "Status", "Last Verified", "Tags", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B36]">
                {filteredCreators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-[#242B36] transition">
                    {/* Creator */}
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{creator.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{creator.shardId}</p>
                    </td>

                    {/* Platforms */}
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {creator.platforms.instagram.followers > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 border border-purple-500/25 text-purple-300">
                            <InstagramIcon />
                            {formatFollowers(creator.platforms.instagram.followers)}
                          </span>
                        )}
                        {creator.platforms.tiktok.followers > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-500/10 border border-zinc-500/25 text-zinc-300">
                            <TikTokIcon />
                            {formatFollowers(creator.platforms.tiktok.followers)}
                          </span>
                        )}
                        {creator.platforms.youtube.followers > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/25 text-red-400">
                            <YouTubeIcon />
                            {formatFollowers(creator.platforms.youtube.followers)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Followers */}
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">
                        {formatFollowers(creator.audienceData.totalFollowers)}
                      </p>
                      <p className="text-xs text-zinc-500">+{creator.audienceData.growthRate}% growth</p>
                    </td>

                    {/* Engagement */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{creator.audienceData.engagementRate}%</span>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={creator.status} />
                    </td>

                    {/* Last Verified */}
                    <td className="px-6 py-4">
                      <p className="text-zinc-400 text-sm">{creator.lastVerified}</p>
                    </td>

                    {/* Tags */}
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {creator.tags.niche.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-300 text-xs">
                            {tag}
                          </span>
                        ))}
                        {Object.values(creator.tags).flat().length > 2 && (
                          <span className="px-2 py-1 bg-zinc-700 rounded text-zinc-400 text-xs">
                            +{Object.values(creator.tags).flat().length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCreator(creator)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 hover:bg-orange-500/20 transition text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCreators.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No creators found</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-zinc-400">
          Showing {filteredCreators.length} of {MOCK_CREATORS.length} creators
        </div>
      </main>

      {selectedCreator && (
        <CreatorDetailModal
          creator={selectedCreator}
          onClose={() => setSelectedCreator(null)}
        />
      )}
    </div>
  );
}