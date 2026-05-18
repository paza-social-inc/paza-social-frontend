"use client";

import { Shield } from "lucide-react";
import { formatFollowers } from "@/components/Admin/ui";

interface PlatformCardProps {
  name: string;
  username: string;
  followers: number;
  verified: boolean;
}

export function PlatformCard({ name, username, followers, verified }: PlatformCardProps) {
  return (
    <div className="bg-[#1B2029] border border-[#2A3140] rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-white font-semibold">{name}</h4>
        {verified && <Shield className="w-4 h-4 text-orange-400" />}
      </div>
      <p className="text-sm text-zinc-400 mb-2">{username}</p>
      {followers > 0 ? (
        <>
          <p className="text-2xl font-bold text-white">{formatFollowers(followers)}</p>
          <p className="text-zinc-500 text-xs mt-1">followers</p>
        </>
      ) : (
        <p className="text-zinc-500 text-sm">Not connected</p>
      )}
    </div>
  );
}
