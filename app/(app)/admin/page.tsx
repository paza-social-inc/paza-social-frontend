"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
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

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("month");
  const [stats, setStats] = useState<{
    activeCreators: number;
    activeBrands: number;
    pendingApprovals: number;
    activeCampaigns: number;
    escrowHeld: number;
    escrowPending: number;
    pendingPayments: number;
    totalRevenue: number;
    newCreatorsThisMonth: number;
    newBrandsThisMonth: number;
    platformGrowth: number;
    chartData: {
      label: string;
      brands: number;
      creators: number;
      revenue: number;
    }[];
    inReviewCampaigns: number;
    completedCampaigns: number;
    flaggedCampaigns: number;
    flaggedCreators: number;
  } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiFetch("/api/admin/dashboard");
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);
  const creatorsJoined = stats?.newCreatorsThisMonth ?? 0;
  const brandsJoined = stats?.newBrandsThisMonth ?? 0;
  const campaignsJoined = stats?.activeCampaigns ?? 0;
  const revenue = stats?.totalRevenue ?? 0;

  if (!stats) return <p>Loading...</p>;

  const brandsVsCreatorsData = {
    labels: stats.chartData.map((d) => d.label),
    datasets: [
      {
        label: "Brands",
        data: stats.chartData.map((d) => d.brands),
        backgroundColor: "rgba(249, 115, 22, 0.8)",
        borderRadius: 8,
      },
      {
        label: "Creators",
        data: stats.chartData.map((d) => d.creators),
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  const revenueTrendData = {
    labels: stats.chartData.map((d) => d.label),
    datasets: [
      {
        label: "Revenue (KES)",
        data: stats.chartData.map((d) => d.revenue),
        borderColor: "rgba(249, 115, 22, 1)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

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

        </div>

        {/* STATS ROW 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard
            icon={Users}
            label="Active Creators"
            value={stats.activeCreators.toLocaleString()}
            subtext={`+${creatorsJoined} this month`}
            color="orange"
            trend={creatorsJoined > 0 ? "up" : creatorsJoined < 0 ? "down" : "neutral"}
          />

          <StatCard
            icon={Users}
            label="Active Brands"
            value={stats.activeBrands.toLocaleString()}
            subtext={`+${brandsJoined} this month`}
            color="amber"
            trend={ brandsJoined > 0 ? "up" : brandsJoined < 0 ? "down" : "neutral"}
          />

          <StatCard
            icon={Briefcase}
            label="Live Campaigns"
            value={stats.activeCampaigns.toLocaleString()}
            subtext="32 pending approvals"
            color="orange"
            trend={campaignsJoined > 0 ? "up" : campaignsJoined < 0 ? "down" : "neutral"}
          />

          <StatCard
            icon={CreditCard}
            label="Revenue"
            value={`KES ${stats.totalRevenue.toLocaleString()}`}
            subtext="+15% from last month"
            color="amber"
            trend={revenue > 0 ? "up" : revenue < 0 ? "down" : "neutral"}
          />
        </div>

        {/* STATS ROW 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <StatCard
            icon={AlertCircle}
            label="Pending Approvals"
            value={stats.pendingApprovals.toLocaleString()}
            subtext="Awaiting admin review"
            color="orange"
            trend="neutral"
          />

          <StatCard
            icon={BarChart3}
            label="Escrow Held"
            value={`KES ${(stats.escrowHeld).toLocaleString()}`}
            subtext={`${stats.escrowPending} pending releases`}
            color="amber"
            trend="down"
          />

          <StatCard
            icon={TrendingUp}
            label="Platform Growth"
            value={`${stats.platformGrowth > 0 ? "+" : ""}${stats.platformGrowth}%`}
            subtext="vs last month (users + campaigns + revenue)"
            color="orange"
            trend={stats.platformGrowth > 0 ? "up" : stats.platformGrowth < 0 ? "down" : "neutral"}
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard
            title="Brands vs Creators Growth"
            description="Monthly comparison of platform participants"
            type="bar"
            data={brandsVsCreatorsData}
          />

          <ChartCard
            title="Revenue Trend"
            description="Monthly platform revenue"
            type="line"
            data={revenueTrendData}
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
                count={stats.activeCampaigns}
                color="orange"
              />

              <CampaignStatusItem
                name="In Review"
                count={stats.inReviewCampaigns}
                color="amber"
              />

              <CampaignStatusItem
                name="Completed"
                count={stats.completedCampaigns}
                color="green"
              />

              <CampaignStatusItem
                name="Flagged"
                count={stats.flaggedCampaigns}
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
                count={stats.flaggedCreators}
                href="/admin/creators"
              />

              <QuickActionButton
                label="Approve Campaigns"
                icon={CheckCircle2}
                count={0}
                href="/admin/campaigns"
              />

              <QuickActionButton
                label="Release Payments"
                icon={Wallet}
                count= {stats.escrowPending}
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