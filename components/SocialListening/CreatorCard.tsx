// import { Creator } from '@/types/social-listener';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// components/SocialListening/CreatorCard.tsx

interface Creator {
  handle: string;
  source: string;
  topic: string;
  postCount: number;
  totalEngagement: number;
  avgEngagement: number;
  sampleContent: string[];
}

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">@{creator.handle}</h3>
          <p className="text-sm text-muted-foreground">{creator.source}</p>
          <p className="text-sm text-muted-foreground">Topic: {creator.topic}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Posts: {creator.postCount}</p>
          <p className="text-sm font-medium">
            Engagement: {creator.totalEngagement.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Avg: {creator.avgEngagement.toLocaleString()}
          </p>
        </div>
      </div>

      {creator.sampleContent && creator.sampleContent.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Sample content:</p>
          <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground">
            {creator.sampleContent.slice(0, 2).map((content, idx) => (
              <li key={idx} className="truncate">{content}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}