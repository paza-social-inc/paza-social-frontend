"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Lock,
  Unlock,
  RefreshCw,
  MoreVertical,
  Eye,
  DollarSign,
  AlertCircle,
} from "lucide-react";

// Mock transactions data
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    brand: "Nike",
    creator: "Sarah Johnson",
    campaign: "Summer Collection 2024",
    task: "Product Photos",
    brandPayment: 100000,
    platformFee: 10000,
    creatorPayout: 90000,
    status: "pending",
    createdAt: "2024-06-20",
    dueDate: "2024-06-30",
  },
  {
    id: 2,
    brand: "Adidas",
    creator: "Mike Chen",
    campaign: "Spring Launch",
    task: "Review Content",
    brandPayment: 75000,
    platformFee: 7500,
    creatorPayout: 67500,
    status: "released",
    createdAt: "2024-06-15",
    dueDate: "2024-06-25",
  },
  {
    id: 3,
    brand: "Puma",
    creator: "Emma Wilson",
    campaign: "Wellness Series",
    task: "Content Creation",
    brandPayment: 120000,
    platformFee: 12000,
    creatorPayout: 108000,
    status: "held",
    createdAt: "2024-06-18",
    dueDate: "2024-06-28",
  },
  {
    id: 4,
    brand: "Nike",
    creator: "Alex Rodriguez",
    campaign: "Gaming Gear Launch",
    task: "Video Review",
    brandPayment: 85000,
    platformFee: 8500,
    creatorPayout: 76500,
    status: "completed",
    createdAt: "2024-06-10",
    dueDate: "2024-06-20",
  },
];

type StatusFilter = "all" | "pending" | "held" | "released" | "completed";

export default function TransactionTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<(typeof MOCK_TRANSACTIONS)[0] | null>(null);

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      tx.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.campaign.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search brand, creator, or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Transactions</option>
          <option value="pending">Pending</option>
          <option value="held">Held</option>
          <option value="released">Released</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm hover:border-orange-500 transition flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-[#181C23] border border-[#262B36] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262B36] bg-[#0F1115]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262B36]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#242B36] transition">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{tx.brand}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{tx.creator}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white text-sm">{tx.campaign}</p>
                      <p className="text-xs text-zinc-500">{tx.task}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-semibold">
                        KES {tx.brandPayment.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Payout: KES {tx.creatorPayout.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TransactionStatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-400 text-sm">{tx.dueDate}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {tx.status === "pending" && (
                        <>
                          <button
                            onClick={() => setSelectedTransaction(tx)}
                            title="Release payment"
                            className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                          <button
                            title="Hold payment"
                            className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 hover:bg-yellow-500/20 transition"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {tx.status === "held" && (
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          title="Release payment"
                          className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        title="View details"
                        className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <DollarSign className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No transactions found</p>
          </div>
        )}
      </div>

      {/* RELEASE MODAL */}
      {selectedTransaction && (
        <ReleasePaymentModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

function TransactionStatusBadge({ status }: { status: string }) {
  const config = {
    pending: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-300",
      border: "border-yellow-500/20",
      label: "Pending",
    },
    held: {
      bg: "bg-red-500/10",
      text: "text-red-300",
      border: "border-red-500/20",
      label: "Held",
    },
    released: {
      bg: "bg-blue-500/10",
      text: "text-blue-300",
      border: "border-blue-500/20",
      label: "Released",
    },
    completed: {
      bg: "bg-green-500/10",
      text: "text-green-300",
      border: "border-green-500/20",
      label: "Completed",
    },
  }[status] || {
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

function ReleasePaymentModal({
  transaction,
  onClose,
}: {
  transaction: (typeof MOCK_TRANSACTIONS)[0];
  onClose: () => void;
}) {
  const [notes, setNotes] = useState("");

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
          <h2 className="text-xl font-bold text-white">Release Payment</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
            <p className="text-zinc-500 text-sm mb-1">Creator</p>
            <p className="text-white font-semibold">{transaction.creator}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-3 text-center">
              <p className="text-zinc-500 text-xs mb-1">Brand Pays</p>
              <p className="text-white font-bold">
                KES {transaction.brandPayment.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-3 text-center">
              <p className="text-zinc-500 text-xs mb-1">Platform Fee</p>
              <p className="text-orange-400 font-bold">
                KES {transaction.platformFee.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-3 text-center">
              <p className="text-zinc-500 text-xs mb-1">Creator Gets</p>
              <p className="text-green-400 font-bold">
                KES {transaction.creatorPayout.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this payout..."
              className="w-full px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#1B2029] border border-[#2A3140] rounded-lg text-white hover:bg-[#242B36] transition font-medium"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2.5 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 hover:bg-green-500/30 transition font-medium">
              Release Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}