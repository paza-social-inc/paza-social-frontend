"use client";

import { useState } from "react";
import AdminNav from "@/components/Admin/AdminNav";
import FinancialOverview from "./components/FinancialOverview";
import TransactionTable from "./components/TransactionTable";
import EscrowManager from "./components/EscrowManager";
import FinancialAnalytics from "./components/FinancialAnalytics";

type TabId = "overview" | "transactions" | "escrow" | "analytics";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "transactions", label: "Transactions" },
  { id: "escrow", label: "Escrow Manager" },
  { id: "analytics", label: "Analytics" },
];

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* NAVBAR */}
      <AdminNav />

      {/* MAIN CONTENT */}
      <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Financial Control Center
          </h1>
          <p className="text-zinc-400">
            Monitor transactions, manage escrow, and track platform finances
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
                  : "bg-[#1B2029] border-[#2A3140] text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === "overview" && <FinancialOverview />}
        {activeTab === "transactions" && <TransactionTable />}
        {activeTab === "escrow" && <EscrowManager />}
        {activeTab === "analytics" && <FinancialAnalytics />}
      </main>
    </div>
  );
}