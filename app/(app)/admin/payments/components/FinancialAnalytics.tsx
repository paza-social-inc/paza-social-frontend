"use client";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#9CA3AF",
        font: { size: 12 },
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#FFF",
      bodyColor: "#9CA3AF",
      borderColor: "rgba(71, 85, 105, 0.5)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
};

export default function FinancialAnalytics() {
  const paymentBreakdown = {
    labels: ["Creator Payouts (90%)", "Platform Commission (10%)"],
    datasets: [
      {
        data: [1845000, 247890],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(249, 115, 22, 0.8)"],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(249, 115, 22, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const transactionStatus = {
    labels: [
      "Completed (245)",
      "Pending (42)",
      "Held (18)",
      "Refunded (3)",
    ],
    datasets: [
      {
        data: [245, 42, 18, 3],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(99, 102, 241, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const monthlyRevenue = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Brand Payments",
        data: [200000, 250000, 280000, 320000, 380000, 450000],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
      {
        label: "Creator Payouts",
        data: [180000, 225000, 252000, 288000, 342000, 405000],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
      {
        label: "Platform Fee",
        data: [20000, 25000, 28000, 32000, 38000, 45000],
        backgroundColor: "rgba(249, 115, 22, 0.8)",
      },
    ],
  };

  const escrowBreakdown = {
    labels: [
      "Pending Release (48%)",
      "On Hold (32%)",
      "Flagged (20%)",
    ],
    datasets: [
      {
        data: [1200000, 800000, 500000],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
        ],
        borderColor: [
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(249, 115, 22, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* REVENUE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Monthly Revenue Breakdown
          </h3>
          <div className="relative h-80">
            <Bar
              data={monthlyRevenue}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    grid: { color: "rgba(71, 85, 105, 0.2)" },
                    ticks: { color: "#9CA3AF" },
                  },
                  x: { grid: { display: false }, ticks: { color: "#9CA3AF" } },
                },
              }}
            />
          </div>
        </div>

        {/* Payment Split Pie */}
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Payment Distribution
          </h3>
          <div className="relative h-80">
            <Pie data={paymentBreakdown} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* TRANSACTION & ESCROW ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Status Pie */}
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Transaction Status Distribution
          </h3>
          <div className="relative h-80">
            <Pie data={transactionStatus} options={chartOptions} />
          </div>
        </div>

        {/* Escrow Breakdown Pie */}
        <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Escrow Breakdown
          </h3>
          <div className="relative h-80">
            <Pie data={escrowBreakdown} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Avg Transaction"
          value="KES 102K"
          trend="+5% from last month"
        />
        <MetricCard
          label="Processing Time"
          value="2.3 hrs"
          trend="Avg pending time"
        />
        <MetricCard
          label="Success Rate"
          value="99.8%"
          trend="All transactions"
        />
        <MetricCard
          label="Pending Payouts"
          value="42"
          trend="Worth KES 1.2M"
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-[#181C23] border border-[#262B36] rounded-2xl p-6">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-zinc-500">{trend}</p>
    </div>
  );
}