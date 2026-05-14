"use client";

import { useState } from "react";
import {
  Users,
  Briefcase,
  CreditCard,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Settings,
  ShieldAlert,
  CheckCircle2,
  Wallet,
  Activity,
  LucideIcon,
} from "lucide-react";

import AdminNav from "@/components/Admin/AdminNav";
import StatCard from "@/components/Admin/StatCard";
import ChartCard from "@/components/Admin/ChartCard";

// MOCK DATA
const MOCK_STATS = {
  totalCreators: 3542,
  totalBrands: 256,
  liveCampaigns: 128,
  activeCampaigns: 45,
  inReviewCampaigns: 23,
  completedCampaigns: 891,
  flaggedCampaigns: 8,
  flaggedCreators: 12,
  pendingApprovals: 15,
  escrowHeld: 2500000,
  pendingPayments: 31,
  totalRevenue: 247890,
};

const MOCK_CHART_DATA = {
  brandsVsCreators: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Brands",
        data: [32, 45, 52, 68, 76, 85],
        backgroundColor: "rgba(249, 115, 22, 0.8)",
        borderRadius: 8,
      },
      {
        label: "Creators",
        data: [128, 156, 201, 285, 342, 398],
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderRadius: 8,
      },
    ],
  },

  revenueTrend: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue (KES)",
        data: [45000, 52000, 61000, 78000, 92000, 124000],
        borderColor: "rgba(249, 115, 22, 1)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* NAVBAR */}
      <AdminNav />

      {/* MAIN CONTENT */}
      <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            {/* <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Admin Dashboard
            </h1> */}

            <h2 className="text-zinc-400 mt-2 text-sm">
              Real-time platform overview and analytics
            </h2>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm hover:border-orange-400 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* STATS ROW 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard
            icon={Users}
            label="Active Creators"
            value={MOCK_STATS.totalCreators.toLocaleString()}
            subtext="+425 this month"
            color="orange"
            trend="up"
          />

          <StatCard
            icon={Users}
            label="Active Brands"
            value={MOCK_STATS.totalBrands.toLocaleString()}
            subtext="+21 this month"
            color="amber"
            trend="up"
          />

          <StatCard
            icon={Briefcase}
            label="Live Campaigns"
            value={MOCK_STATS.liveCampaigns.toLocaleString()}
            subtext="32 pending approvals"
            color="orange"
            trend="up"
          />

          <StatCard
            icon={CreditCard}
            label="Revenue"
            value={`KES ${(MOCK_STATS.totalRevenue * 1000).toLocaleString()}`}
            subtext="+15% from last month"
            color="amber"
            trend="up"
          />
        </div>

        {/* STATS ROW 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <StatCard
            icon={AlertCircle}
            label="Pending Approvals"
            value={MOCK_STATS.pendingApprovals.toLocaleString()}
            subtext="Awaiting admin review"
            color="orange"
            trend="neutral"
          />

          <StatCard
            icon={BarChart3}
            label="Escrow Held"
            value={`KES ${(MOCK_STATS.escrowHeld / 1000000).toFixed(1)}M`}
            subtext={`${MOCK_STATS.pendingPayments} pending releases`}
            color="amber"
            trend="down"
          />

          <StatCard
            icon={TrendingUp}
            label="Platform Growth"
            value="+24%"
            subtext="YoY growth rate"
            color="orange"
            trend="up"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard
            title="Brands vs Creators Growth"
            description="Monthly comparison of platform participants"
            type="bar"
            data={MOCK_CHART_DATA.brandsVsCreators}
          />

          <ChartCard
            title="Revenue Trend"
            description="Monthly platform revenue"
            type="line"
            data={MOCK_CHART_DATA.revenueTrend}
          />
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CAMPAIGN STATUS */}
          <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-400" />
              Campaign Status Overview
            </h3>

            <div className="space-y-3">
              <CampaignStatusItem
                name="Active Campaigns"
                count={MOCK_STATS.activeCampaigns}
                color="orange"
              />

              <CampaignStatusItem
                name="In Review"
                count={MOCK_STATS.inReviewCampaigns}
                color="amber"
              />

              <CampaignStatusItem
                name="Completed"
                count={MOCK_STATS.completedCampaigns}
                color="green"
              />

              <CampaignStatusItem
                name="Flagged"
                count={MOCK_STATS.flaggedCampaigns}
                color="red"
              />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-400" />
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickActionButton
                label="Review Flagged Items"
                icon={ShieldAlert}
                count={MOCK_STATS.flaggedCreators}
                href="/admin/creators"
              />

              <QuickActionButton
                label="Approve Campaigns"
                icon={CheckCircle2}
                count={MOCK_STATS.pendingApprovals}
                href="/admin/campaigns"
              />

              <QuickActionButton
                label="Release Payments"
                icon={Wallet}
                count={MOCK_STATS.pendingPayments}
                href="/admin/payments"
              />

              <QuickActionButton
                label="View Activity Log"
                icon={Activity}
                count={0}
                href="/admin/activity"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// COMPONENTS

function CampaignStatusItem({
  name,
  count,
  color,
}: {
  name: string;
  count: number;
  color: string;
}) {
  const colorClass = {
    orange:
      "bg-orange-500/15 text-orange-300 border border-orange-500/20",

    amber: "bg-amber-500/15 text-amber-300 border border-amber-500/20",

    green:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",

    red: "bg-red-500/15 text-red-300 border border-red-500/20",
  }[color];

  return (
    <div className="flex justify-between items-center p-4 bg-[#1B2029] border border-[#2A3140] rounded-xl hover:bg-[#242B36] transition">
      <p className="text-zinc-300 text-sm">{name}</p>

      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
      >
        {count}
      </span>
    </div>
  );
}

function QuickActionButton({
  label,
  icon: Icon,
  count,
  href,
}: {
  label: string;
  icon: LucideIcon;
  count: number;
  href: string;
}) {
  return (
    <a href={href}>
      <div className="bg-[#1B2029] hover:bg-[#242B36] border border-[#2A3140] rounded-2xl p-4 transition cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-orange-400" />
          </div>

          <div className="flex-1">
            <p className="text-white text-sm font-semibold">{label}</p>

            {count > 0 && (
              <p className="text-orange-400 text-xs font-medium mt-1">
                {count} pending
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}