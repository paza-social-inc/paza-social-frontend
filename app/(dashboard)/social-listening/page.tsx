// app/(dashboard)/social-listening/page.tsx

'use client';

import { useSocialListeningSearch } from '@/hooks/useSocialListeningSearch';
import { SearchBar } from '@/components/SocialListening/SearchBar';
import { ReportLayout } from '@/components/SocialListening/ReportLayout';

export default function SocialListeningPage() {
  const { startSearch, report, isLoading, status, error } = useSocialListeningSearch();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Social Listening</h2>
        <p className="text-muted-foreground">
          Discover creators, communities, and demand signals for any product or topic.
        </p>
      </div>

      <SearchBar onSearch={startSearch} isLoading={isLoading} />

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">{status}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {report && !isLoading && <ReportLayout report={report} />}

      {!report && !isLoading && (
        <div className="text-center text-muted-foreground py-12">
          Enter a product, brand, or topic to start listening.
        </div>
      )}
    </div>
  );
}