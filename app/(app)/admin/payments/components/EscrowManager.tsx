"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  AlertCircle,
  Clock,
  Search,
  RefreshCw,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";

type FinancialStats = {
  escrowHeld: number;
  escrowCountHeld: number;
  totalRevenue: number;
  completedTransactions: number;
  totalFundsReleased: number;
  totalFundsPending: number;
  activeCampaigns: number;
  suspiciousTransactions: number;
  pendingRelease: number;
  onHold: number;
};

type EscrowTransaction = {
  id: number;
  creator: string;
  amount: number;
  held: number;
  reason: string;
  status: "pending" | "held" | "flagged";
};

export default function EscrowManager() {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowTransaction | null>(null);

  const transactions: EscrowTransaction[] = [
    { id: 1, creator: "Sarah Johnson", amount: 250000, held: 15, reason: "Verification pending", status: "pending" },
    { id: 2, creator: "Mike Chen", amount: 180000, held: 8, reason: "Content review", status: "pending" },
    { id: 3, creator: "Emma Wilson", amount: 320000, held: 22, reason: "Suspicious engagement", status: "flagged" },
    { id: 4, creator: "Alex Rodriguez", amount: 150000, held: 5, reason: "Admin hold", status: "held" },
  ];

  async function fetchStats() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/admin/payments");
      setStats(data.stats);
    } catch (err) {
      console.error(err);
      setError("Failed to load financial stats.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredTransactions = transactions.filter((tx) =>
    tx.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        Loading escrow data...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <p>{error ?? "Something went wrong."}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 hover:bg-orange-500/20 transition text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ESCROW SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <EscrowCard
          icon={Lock}
          label="Total Escrow Held"
          amount={stats.escrowHeld}
          color="blue"
        />
        <EscrowCard
          icon={Clock}
          label="Pending Release"
          amount={stats.totalFundsPending}
          color="orange"
          count={stats.pendingRelease}
        />
        <EscrowCard
          icon={AlertCircle}
          label="On Hold"
          amount={stats.onHold}
          color="yellow"
          isCount
        />
        <EscrowCard
          icon={AlertCircle}
          label="Suspicious"
          amount={stats.suspiciousTransactions}
          color="red"
          isCount
        />
      </div>

      {/* SECONDARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wide">Total Revenue</p>
          <p className="text-white text-xl font-bold">
            KES {(stats.totalRevenue / 100).toLocaleString()}
          </p>
        </div>
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wide">Funds Released</p>
          <p className="text-emerald-400 text-xl font-bold">
            KES {(stats.totalFundsReleased / 100).toLocaleString()}
          </p>
        </div>
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wide">Completed Transactions</p>
          <p className="text-white text-xl font-bold">
            {stats.completedTransactions.toLocaleString()}
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by creator name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-3">
        {filteredTransactions.map((escrow) => (
          <div
            key={escrow.id}
            className="bg-[#181C23] border border-[#262B36] rounded-2xl p-4 hover:border-[#3A4350] transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-white font-semibold">{escrow.creator}</p>
                <p className="text-xs text-zinc-500 mt-1">{escrow.reason}</p>
              </div>
              <StatusBadge status={escrow.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-[#1B2029] rounded-lg p-3">
                <p className="text-zinc-500 text-xs mb-1">Amount Held</p>
                <p className="text-white font-bold">
                  KES {escrow.amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#1B2029] rounded-lg p-3">
                <p className="text-zinc-500 text-xs mb-1">Days Held</p>
                <p className="text-white font-bold">{escrow.held}</p>
              </div>
              <div className="bg-[#1B2029] rounded-lg p-3">
                <p className="text-zinc-500 text-xs mb-1">Pending Since</p>
                <p className="text-white font-bold">
                  {new Date(Date.now() - escrow.held * 86400000).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedEscrow(escrow)}
                  className="flex-1 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition text-sm font-medium"
                >
                  Release
                </button>
                <button className="flex-1 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition text-sm font-medium">
                  Refund
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RELEASE MODAL */}
      {selectedEscrow && (
        <ReleaseEscrowModal
          escrow={selectedEscrow}
          onClose={() => setSelectedEscrow(null)}
        />
      )}
    </div>
  );
}

function EscrowCard({
  icon: Icon,
  label,
  amount,
  color,
  count,
  isCount = false,
}: {
  icon: LucideIcon;
  label: string;
  amount: number;
  color: string;
  count?: number;
  isCount?: boolean;
}) {
  const colorClass = {
    blue: "bg-blue-500/10 border-blue-500/20",
    orange: "bg-orange-500/10 border-orange-500/20",
    yellow: "bg-yellow-500/10 border-yellow-500/20",
    red: "bg-red-500/10 border-red-500/20",
  }[color];

  const iconColor = {
    blue: "text-blue-400",
    orange: "text-orange-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  }[color];

  const displayValue = isCount
    ? amount.toLocaleString()
    : `KES ${(amount / 100).toLocaleString()}`;

  return (
    <div className={`${colorClass} border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          {label}
        </h3>
        <Icon className={`w-5 h-5 ${iconColor} opacity-50`} />
      </div>
      <p className="text-2xl font-bold text-white">{displayValue}</p>
      {count !== undefined && (
        <p className="text-xs text-zinc-500 mt-1">{count} transactions</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: {
      bg: "bg-orange-500/10",
      text: "text-orange-300",
      border: "border-orange-500/20",
      label: "Pending",
    },
    held: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-300",
      border: "border-yellow-500/20",
      label: "Held",
    },
    flagged: {
      bg: "bg-red-500/10",
      text: "text-red-300",
      border: "border-red-500/20",
      label: "Flagged",
    },
  }[status] ?? {
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

function ReleaseEscrowModal({
  escrow,
  onClose,
}: {
  escrow: EscrowTransaction;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#181C23] border border-[#262B36] rounded-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0F1115] border-b border-[#262B36] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Release Escrow</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-300 mb-2">⚠️ Confirm Release</p>
            <p className="text-sm text-zinc-300">
              Releasing escrow for <strong>{escrow.creator}</strong> will transfer{" "}
              <strong>KES {escrow.amount.toLocaleString()}</strong> to their account.
            </p>
          </div>

          <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
            <p className="text-zinc-500 text-sm mb-2">Held for</p>
            <p className="text-white font-bold">{escrow.held} days</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#1B2029] border border-[#2A3140] rounded-lg text-white hover:bg-[#242B36] transition font-medium"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2.5 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 hover:bg-green-500/30 transition font-medium">
              Confirm Release
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}