"use client";

import { LucideIcon } from "lucide-react";

// ─── StatusBadge ───────────────────────────────────────────────────────────────
interface BadgeConfig {
  bg: string;
  text: string;
  border: string;
  label: string;
}

const CREATOR_STATUS_CONFIG: Record<string, BadgeConfig> = {
  active: {
    bg: "bg-green-500/10",
    text: "text-green-300",
    border: "border-green-500/20",
    label: "Active",
  },
  verified: {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    border: "border-blue-500/20",
    label: "Verified ✓",
  },
  flagged: {
    bg: "bg-red-500/10",
    text: "text-red-300",
    border: "border-red-500/20",
    label: "Flagged",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = CREATOR_STATUS_CONFIG[status] ?? {
    bg: "bg-zinc-500/10",
    text: "text-zinc-300",
    border: "border-zinc-500/20",
    label: "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.text}`} />
      {config.label}
    </span>
  );
}

// ─── CampaignStatusBadge ───────────────────────────────────────────────────────
const CAMPAIGN_STATUS_CONFIG: Record<string, BadgeConfig> = {
  draft: {
    bg: "bg-gray-500/10",
    text: "text-gray-300",
    border: "border-gray-500/20",
    label: "Draft",
  },
  matching: {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    border: "border-blue-500/20",
    label: "Matching",
  },
  live: {
    bg: "bg-green-500/10",
    text: "text-green-300",
    border: "border-green-500/20",
    label: "Live",
  },
  review: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-300",
    border: "border-yellow-500/20",
    label: "Review",
  },
  completed: {
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    border: "border-purple-500/20",
    label: "Completed",
  },
};

export function CampaignStatusBadge({ status }: { status: string }) {
  const config = CAMPAIGN_STATUS_CONFIG[status] ?? {
    bg: "bg-zinc-500/10",
    text: "text-zinc-300",
    border: "border-zinc-500/20",
    label: "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.text}`} />
      {config.label}
    </span>
  );
}

// ─── ActionButton ──────────────────────────────────────────────────────────────
type ActionVariant = "primary" | "success" | "danger" | "warning";

const ACTION_VARIANT_CLASSES: Record<ActionVariant, string> = {
  primary: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20",
  success: "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20",
  danger: "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20",
  warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20",
};

export function ActionButton({
  icon: Icon,
  label,
  variant,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  variant: ActionVariant;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 border rounded-lg transition text-sm font-medium flex items-center justify-center gap-2 ${ACTION_VARIANT_CLASSES[variant]}`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── InfoItem ──────────────────────────────────────────────────────────────────
export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}

// ─── BudgetCard ────────────────────────────────────────────────────────────────
export function BudgetCard({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-3">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-semibold">KES {(amount / 1000).toFixed(0)}K</p>
    </div>
  );
}

// ─── formatFollowers ──────────────────────────────────────────────────────────
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${(count / 1_000).toFixed(0)}K`;
}
