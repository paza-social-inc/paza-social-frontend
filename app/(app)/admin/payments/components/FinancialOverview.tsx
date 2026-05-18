"use client";

import { DollarSign, TrendingUp, Lock, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

// dummy data
const OVERVIEW_DATA = {
  totalRevenue: 2478900,
  escrowHeld: 2500000,
  pendingPayouts: 1200000,
  completedTransactions: 245,
  platformCommission: 247890,
  creatorPayouts: 1845000,
  brandPayments: 2500000,
  suspiciousTransactions: 3,
};

export default function FinancialOverview() {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          icon={DollarSign}
          label="Total Revenue"
          value={`KES ${(OVERVIEW_DATA.totalRevenue / 1000000).toFixed(1)}M`}
          subtext="Platform commission (10%)"
          color="orange"
          trend="+15% from last month"
        />
        <OverviewCard
          icon={Lock}
          label="Escrow Held"
          value={`KES ${(OVERVIEW_DATA.escrowHeld / 1000000).toFixed(1)}M`}
          subtext="In secure hold"
          color="blue"
          trend="31 pending releases"
        />
        <OverviewCard
          icon={Clock}
          label="Pending Payouts"
          value={`KES ${(OVERVIEW_DATA.pendingPayouts / 1000000).toFixed(1)}M`}
          subtext="Awaiting release"
          color="yellow"
          trend="42 transactions"
        />
        <OverviewCard
          icon={CheckCircle2}
          label="Completed Transactions"
          value={OVERVIEW_DATA.completedTransactions.toLocaleString()}
          subtext="Total processed"
          color="green"
          trend="100% success rate"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Platform Commission
            </h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            KES {(OVERVIEW_DATA.platformCommission / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-zinc-400">10% of all transactions</p>
          <div className="mt-4 pt-4 border-t border-[#2A3140]">
            <p className="text-xs text-zinc-500 mb-2">Monthly Breakdown</p>
            <div className="h-2 bg-[#2A3140] rounded-full overflow-hidden">
              <div className="h-2 bg-orange-500 rounded-full" style={{ width: "65%" }} />
            </div>
            <p className="text-xs text-zinc-500 mt-2">65% of Q2 target</p>
          </div>
        </div>

        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Creator Payouts
          </h3>
          <p className="text-3xl font-bold text-white mb-2">
            KES {(OVERVIEW_DATA.creatorPayouts / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-zinc-400">90% of transaction value</p>
          <div className="mt-4 pt-4 border-t border-[#2A3140]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Released</span>
                <span className="text-xs text-green-400 font-semibold">
                  KES {(OVERVIEW_DATA.creatorPayouts * 0.85 / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Pending</span>
                <span className="text-xs text-yellow-400 font-semibold">
                  KES {(OVERVIEW_DATA.creatorPayouts * 0.15 / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            Brand Payments
          </h3>
          <p className="text-3xl font-bold text-white mb-2">
            KES {(OVERVIEW_DATA.brandPayments / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-zinc-400">Total paid by brands</p>
          <div className="mt-4 pt-4 border-t border-[#2A3140]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Active Campaigns</span>
                <span className="text-xs text-white font-semibold">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Avg. Payment</span>
                <span className="text-xs text-blue-400 font-semibold">
                  KES {(OVERVIEW_DATA.brandPayments / OVERVIEW_DATA.completedTransactions).toFixed(0)}K
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" />
          Financial Health Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthItem
            label="Suspicious Transactions"
            value={String(OVERVIEW_DATA.suspiciousTransactions)}
            status="warning"
            action="Review"
          />
          <HealthItem
            label="Average Processing Time"
            value="2.3 hours"
            status="good"
            action="Details"
          />
          <HealthItem
            label="Payment Reliability"
            value="99.8%"
            status="good"
            action="History"
          />
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext: string;
  color: string;
  trend: string;
}) {
  const colorClass = {
    orange: "bg-orange-500/10 border-orange-500/20",
    blue: "bg-blue-500/10 border-blue-500/20",
    yellow: "bg-yellow-500/10 border-yellow-500/20",
    green: "bg-green-500/10 border-green-500/20",
  }[color];

  const iconColor = {
    orange: "text-orange-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
  }[color];

  return (
    <div className={`${colorClass} border rounded-2xl p-6 backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          {label}
        </h3>
        <Icon className={`w-5 h-5 ${iconColor} opacity-50`} />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-zinc-400 mb-3">{subtext}</p>
      <p className="text-xs font-medium text-zinc-500">{trend}</p>
    </div>
  );
}

function HealthItem({
  label,
  value,
  status,
  action,
}: {
  label: string;
  value: string;
  status: "good" | "warning" | "danger";
  action: string;
}) {
  const statusColor = {
    good: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
  }[status];

  const statusBg = {
    good: "bg-green-500/10 border-green-500/20",
    warning: "bg-yellow-500/10 border-yellow-500/20",
    danger: "bg-red-500/10 border-red-500/20",
  }[status];

  return (
    <div className={`${statusBg} border rounded-xl p-4`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-zinc-400">{label}</p>
        <button className={`text-xs font-medium ${statusColor} hover:opacity-80 transition`}>
          {action}
        </button>
      </div>
      <p className={`text-2xl font-bold ${statusColor}`}>{value}</p>
    </div>
  );
}