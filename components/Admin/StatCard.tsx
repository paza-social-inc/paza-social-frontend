import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext: string;
  color: "amber" | "emerald" | "blue" | "green" | "orange" | "purple" | "cyan";
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  trend = "neutral",
}: StatCardProps) {
  const colorConfig = {
    amber: {
      bg: "bg-amber-500/10 border-amber-500/30",
      icon: "text-amber-400",
    },
    emerald: {
      bg: "bg-emerald-500/10 border-emerald-500/30",
      icon: "text-emerald-400",
    },
    blue: {
      bg: "bg-blue-500/10 border-blue-500/30",
      icon: "text-blue-400",
    },
    green: {
      bg: "bg-green-500/10 border-green-500/30",
      icon: "text-green-400",
    },
    orange: {
      bg: "bg-orange-500/10 border-orange-500/30",
      icon: "text-orange-400",
    },
    purple: {
      bg: "bg-purple-500/10 border-purple-500/30",
      icon: "text-purple-400",
    },
    cyan: {
      bg: "bg-cyan-500/10 border-cyan-500/30",
      icon: "text-cyan-400",
    },
  };

  const config = colorConfig[color];

  return (
    <div
      className={`${config.bg} border rounded-lg p-4 md:p-6 backdrop-blur-sm hover:border-opacity-100 transition group cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
              {label}
            </p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">
            {value}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs md:text-sm text-gray-400">{subtext}</p>
            {trend === "up" && (
              <TrendingUp className="w-4 h-4 text-green-400" />
            )}
            {trend === "down" && (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>

        {/* Icon */}
        <div className={`${config.icon} group-hover:scale-110 transition`}>
          <Icon className="w-8 h-8 md:w-10 md:h-10 opacity-20 group-hover:opacity-30" />
        </div>
      </div>
    </div>
  );
}