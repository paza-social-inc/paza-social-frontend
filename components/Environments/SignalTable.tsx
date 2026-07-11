'use client';

import { EnvironmentSignal } from '@/types/environment';

interface SignalTableProps {
  signals: EnvironmentSignal[];
}

export function SignalTable({ signals }: SignalTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Author</th>
            <th className="px-4 py-2 text-left font-medium">Snippet</th>
            <th className="px-4 py-2 text-left font-medium">Classification</th>
            <th className="px-4 py-2 text-right font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal) => (
            <tr key={signal.id} className="border-t hover:bg-muted/20">
              <td className="px-4 py-2 text-muted-foreground">{signal.date}</td>
              <td className="px-4 py-2">{signal.anonymizedAuthor}</td>
              <td className="px-4 py-2 max-w-xs truncate">{signal.snippet}</td>
              <td className="px-4 py-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                  {signal.classification}
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    signal.confidence >= 85
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {signal.confidence}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}