'use client';

import { useState } from 'react';
import { useEnvironments } from '@/hooks/useEnvironments';
import { Card, CardContent } from '@/components/ui/card';
import { ERIBadge } from '@/components/Environments/ERIBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

export default function EnvironmentsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('eri');

  const { data: environments, isLoading } = useEnvironments({
    type: typeFilter || undefined,
    location: locationFilter || undefined,
  });

  const sortedEnvironments = environments
    ? [...environments].sort((a, b) => {
        if (sortBy === 'eri') return b.eriScore - a.eriScore;
        if (sortBy === 'activity')
          return b.recentActivityTrend - a.recentActivityTrend;
        if (sortBy === 'newest')
          return (
            new Date(b.lastScanned).getTime() -
            new Date(a.lastScanned).getTime()
          );
        return 0;
      })
    : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Environment Intelligence
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Meetup Group">Meetup Group</SelectItem>
            <SelectItem value="Telegram Channel">Telegram Channel</SelectItem>
            <SelectItem value="Facebook Group">Facebook Group</SelectItem>
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Mombasa">Mombasa</SelectItem>
            <SelectItem value="Nairobi">Nairobi</SelectItem>
            <SelectItem value="Nationwide">Nationwide</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eri">Highest ERI</SelectItem>
            <SelectItem value="activity">Most Active</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-4">Loading environments...</CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Environment</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">ERI</th>
                <th className="px-4 py-2 text-left font-medium">Topics</th>
                <th className="px-4 py-2 text-left font-medium">Activity (30d)</th>
                <th className="px-4 py-2 text-left font-medium">Last Signal</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEnvironments.map((env) => (
                <tr key={env.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-2">
                    <Link
                      href={`/environments/${env.id}`}
                      className="font-medium hover:underline"
                    >
                      {env.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {env.location}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {env.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <ERIBadge score={env.eriScore} />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {env.topics.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1">
                      {env.recentActivityTrend > 0 ? (
                        <ArrowUpIcon className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 text-red-500" />
                      )}
                      {env.recentActivityTrend}%
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {env.signals[0]?.date || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/environments/${env.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}