"use client";

import { useState } from "react";
import { Briefcase, Search, Users, Eye } from "lucide-react";
import AdminNav from "@/components/Admin/AdminNav";
import { CampaignStatusBadge } from "@/components/Admin/ui";
import { CampaignDetailModal } from "./CampaignDetailModal";
import { MOCK_CAMPAIGNS } from "./mockCampaigns";
import { Campaign, CampaignStatusFilter, CampaignSortField } from "./campaign";

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all");
  const [sortBy, setSortBy] = useState<CampaignSortField>("createdAt");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = MOCK_CAMPAIGNS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.statusPipeline === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":      return a.name.localeCompare(b.name);
      case "budget":    return b.budget - a.budget;
      case "createdAt": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:          return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      <AdminNav />

      <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Campaign Management</h1>
          <p className="text-zinc-400">Manage campaigns, assign creators, and track progress</p>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search campaigns or brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CampaignStatusFilter)}
            className="w-full px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="matching">Matching</option>
            <option value="live">Live</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as CampaignSortField)}
            className="w-full px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="createdAt">Newest First</option>
            <option value="name">By Name</option>
            <option value="budget">By Budget</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#262B36] bg-[#0F1115]">
                  {["Campaign", "Brand", "Budget", "Members", "Creators", "Status", "Actions"].map((h) => (
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
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[#242B36] transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{campaign.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-zinc-400">{campaign.brand}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">
                        KES {(campaign.budget / 1000).toFixed(0)}K
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-400" />
                        <span className="text-white">{campaign.members}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">
                        {campaign.creatorsAssigned}{" "}
                        <span className="text-zinc-500">/ {campaign.creatorsNeeded}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <CampaignStatusBadge status={campaign.statusPipeline} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
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

          {filteredCampaigns.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No campaigns found</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-zinc-400">
          Showing {filteredCampaigns.length} of {MOCK_CAMPAIGNS.length} campaigns
        </div>
      </main>

      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}
