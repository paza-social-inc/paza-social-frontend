"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Edit,
  Flag,
  // Lock,
  CheckCircle2,
  DollarSign,
  User,
} from "lucide-react";
import AdminNav from "@/components/Admin/AdminNav";

const MOCK_ACTIVITY_LOGS = [
  {
    id: 1,
    timestamp: "2024-06-20 10:30 AM",
    admin: "Alice Mwangi",
    action: "edit_creator",
    actionLabel: "Edited Creator Tags",
    entityType: "creator",
    entityName: "Sarah Johnson",
    changes: [
      { field: "Tags", oldValue: "Fashion, Lifestyle", newValue: "Fashion, Lifestyle, Beauty" },
    ],
    notes: "Added Beauty tag based on new content",
  },
  {
    id: 2,
    timestamp: "2024-06-20 10:45 AM",
    admin: "Bob Kiplagat",
    action: "release_payment",
    actionLabel: "Released Payment",
    entityType: "transaction",
    entityName: "Nike x Sarah Johnson",
    changes: [{ field: "Status", oldValue: "Pending", newValue: "Released" }],
    notes: "Content verification complete",
  },
  {
    id: 3,
    timestamp: "2024-06-20 11:00 AM",
    admin: "Carol Patel",
    action: "flag_creator",
    actionLabel: "Flagged Creator",
    entityType: "creator",
    entityName: "Emma Wilson",
    changes: [{ field: "Flag", oldValue: "None", newValue: "Suspicious Engagement" }],
    notes: "Engagement spike detected: +300% in 3 days",
  },
  {
    id: 4,
    timestamp: "2024-06-20 11:15 AM",
    admin: "David Kamau",
    action: "update_campaign_status",
    actionLabel: "Updated Campaign Status",
    entityType: "campaign",
    entityName: "Summer Collection 2024",
    changes: [{ field: "Status", oldValue: "Draft", newValue: "Matching" }],
    notes: "Admin force transition",
  },
  {
    id: 5,
    timestamp: "2024-06-20 11:30 AM",
    admin: "Alice Mwangi",
    action: "verify_creator",
    actionLabel: "Verified Creator",
    entityType: "creator",
    entityName: "Mike Chen",
    changes: [{ field: "Status", oldValue: "Active", newValue: "Verified" }],
    notes: "Manual verification after audit",
  },
];

type FilterType = "all" | "creator" | "campaign" | "transaction" | "payment";

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  const filteredLogs = MOCK_ACTIVITY_LOGS.filter((log) => {
    const matchesSearch =
      log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || log.entityType === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      <AdminNav />

      <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Activity Log & Audit Trail
          </h1>
          <p className="text-zinc-400">
            Track all admin actions and system changes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by admin or entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Actions</option>
            <option value="creator">Creator Actions</option>
            <option value="campaign">Campaign Actions</option>
            <option value="transaction">Transaction Actions</option>
          </select>

          <button className="px-4 py-2.5 bg-[#1A1F29] border border-[#2B3240] rounded-xl text-white hover:border-orange-500 transition flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <ActivityLogItem
              key={log.id}
              log={log}
              isExpanded={expandedLog === log.id}
              onToggle={() =>
                setExpandedLog(expandedLog === log.id ? null : log.id)
              }
            />
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="bg-[#181C23] border border-[#262B36] rounded-2xl px-6 py-12 text-center">
            <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No activity logs found</p>
          </div>
        )}

        <div className="mt-4 text-sm text-zinc-400">
          Showing {filteredLogs.length} of {MOCK_ACTIVITY_LOGS.length} activity logs
        </div>
      </main>
    </div>
  );
}

function ActivityLogItem({
  log,
  isExpanded,
  onToggle,
}: {
  log: (typeof MOCK_ACTIVITY_LOGS)[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const actionConfig = {
    edit_creator: { icon: Edit, color: "blue" },
    release_payment: { icon: DollarSign, color: "green" },
    flag_creator: { icon: Flag, color: "red" },
    update_campaign_status: { icon: CheckCircle2, color: "orange" },
    verify_creator: { icon: CheckCircle2, color: "green" },
  }[log.action] || { icon: Clock, color: "gray" };

  const ActionIcon = actionConfig.icon;

  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    gray: "bg-gray-500/10 border-gray-500/20 text-gray-400",
  }[actionConfig.color];

  return (
    <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-4 hover:border-[#3A4350] transition cursor-pointer">
      <div onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">

            <div
              className={`${colorClasses} border rounded-lg p-3 flex-shrink-0 mt-1`}
            >
              <ActionIcon className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h4 className="text-white font-semibold">{log.actionLabel}</h4>
                <span className="text-xs text-zinc-500 w-fit">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {log.timestamp}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {log.admin}
                </div>
                <div>•</div>
                <div>{log.entityType}</div>
                <div>•</div>
                <div className="text-orange-400 font-medium">{log.entityName}</div>
              </div>
            </div>
          </div>

          <div
            className={`text-zinc-500 transition ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            ▼
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#2A3140] space-y-4">
          {log.changes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-zinc-400 mb-2">CHANGES</p>
              <div className="space-y-2">
                {log.changes.map((change, idx) => (
                  <div key={idx} className="bg-[#1B2029] rounded-lg p-3">
                    <p className="text-white text-sm font-medium mb-2">
                      {change.field}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-zinc-500 mb-1">Before</p>
                        <p className="text-red-400">{change.oldValue}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 mb-1">After</p>
                        <p className="text-green-400">{change.newValue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {log.notes && (
            <div>
              <p className="text-sm font-semibold text-zinc-400 mb-2">NOTES</p>
              <p className="text-zinc-300 text-sm bg-[#1B2029] rounded-lg p-3">
                {log.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}