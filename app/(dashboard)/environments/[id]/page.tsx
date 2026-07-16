import { notFound } from 'next/navigation';
import { mockEnvironments } from '@/lib/data/environments';
import { EnvironmentDetail } from '@/components/Environments/EnvironmentDetail';

// For build-time static paths if needed, but we'll use dynamic server component
export default function EnvironmentDetailPage({ params }: { params: { id: string } }) {
  const environment = mockEnvironments.find((e) => e.id === params.id);

  if (!environment) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EnvironmentDetail environment={environment} />
    </div>
  );
}