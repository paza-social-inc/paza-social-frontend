// // components/SocialListening/ReportLayout.tsx

// 'use client';

// import { useRef } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { CreatorCard } from './CreatorCard';
// import { NarrativeReportDocument, NarrativeReport } from './NarrativeReportDocument';

// // --- Types (matching the FullReport from the hook)
// type Creator = {
//   handle: string;
//   source: string;
//   topic: string;
//   postCount: number;
//   totalEngagement: number;
//   avgEngagement: number;
//   sampleContent: string[];
// };

// type SignalMetadata = {
//   topic?: string;
//   seedTopic?: string;
//   [key: string]: unknown;
// };

// type SignalEngagement = {
//   views?: number;
//   likes?: number;
//   comments?: number;
//   shares?: number;
// };

// type Signal = {
//   id: string;
//   author: string;
//   source: string;
//   content: string;
//   engagement?: number; 
//   timestamp: string;
//   metadata?: SignalMetadata & { engagement?: SignalEngagement };
// };

// type Classification = {
//   id: string;
//   category: string; // e.g., friction type
//   label: string; // e.g., "positive", "negative", "question", etc.
//   confidence: number;
// };

// type CommunityLead = {
//   id: string;
//   handle: string;
//   source: string;
//   discoveredViaTopic: string;
// };

// type Environment = {
//   sentiment: string;
//   riskScore?: number;
// };

// type FullReport = {
//   summary: {
//     totalCreators: number;
//     totalSignals: number;
//     totalEngagement: number;
//     topSources: { source: string; count: number }[];
//     avgEngagementPerCreator: number;
//   };
//   creators: Creator[];
//   signals: Signal[];
//   classifications: Classification[];
//   communityLeads: CommunityLead[];
//   environments?: Environment[];
//   sentimentBreakdown?: { positive: number; neutral: number; negative: number };
//   topTopics?: { topic: string; count: number }[];
//   competitorMentions?: { competitor: string; count: number }[];
//   narrativeReport?: NarrativeReport | null;
// };

// function getSignalEngagementScore(signal: Signal): number {
//   if (typeof signal.engagement === 'number') return signal.engagement;

//   const eng = signal.metadata?.engagement;
//   if (!eng) return 0;

//   const { views = 0, likes = 0, comments = 0, shares = 0 } = eng;
//   return views + likes * 5 + comments * 10 + shares * 8;
// }
// // Helper: group signals by date (for timeline)
// function groupByDate(signals: Signal[]) {
//   const map: Record<string, number> = {};
//   signals.forEach(s => {
//     const date = new Date(s.timestamp).toLocaleDateString();
//     map[date] = (map[date] || 0) + 1;
//   });
//   return Object.entries(map)
//     .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
//     .slice(-7); // Last 7 days
// }

// // Helper: get top positive/negative posts based on classification label
// function getTopPostsBySentiment(signals: Signal[], classifications: Classification[], label: string, limit = 3) {
//   const signalIds = classifications.filter(c => c.label.toLowerCase().includes(label)).map(c => c.id);
//   const filtered = signals.filter(s => signalIds.includes(s.id));
//   return filtered
//     .sort((a, b) => getSignalEngagementScore(b) - getSignalEngagementScore(a))
//     .slice(0, limit);
// }

// export function ReportLayout({ report }: { report: FullReport }) {
//   const {
//     summary,
//     creators,
//     signals,
//     classifications,
//     sentimentBreakdown,
//     topTopics,
//     competitorMentions,
//     narrativeReport,
//   } = report;

//   const topPlatform = summary.topSources.length > 0 ? summary.topSources[0] : null;
//   const timelineData = groupByDate(signals);
//   const topPositive = getTopPostsBySentiment(signals, classifications, 'positive');
//   const topNegative = getTopPostsBySentiment(signals, classifications, 'negative');

//   const categoryMap: Record<string, number> = {};
//   classifications.forEach(c => {
//     const cat = c.category || 'uncategorized';
//     categoryMap[cat] = (categoryMap[cat] || 0) + 1;
//   });
//   const categoryData = Object.entries(categoryMap)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5);

//   return (
//     <div className="space-y-8">

//       {/* 1️⃣ Executive Summary */}
//       <section>
//         <h3 className="text-2xl font-bold mb-4">Executive Summary</h3>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm text-muted-foreground">Total Creators</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{summary.totalCreators}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm text-muted-foreground">Total Posts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{summary.totalSignals}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm text-muted-foreground">Total Engagement</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{summary.totalEngagement.toLocaleString()}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm text-muted-foreground">Top Platform</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{topPlatform?.source || 'N/A'}</p>
//               <p className="text-xs text-muted-foreground">{topPlatform?.count || 0} creators</p>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* 2️⃣ Sentiment & Category Breakdown */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {sentimentBreakdown && (
//           <Card>
//             <CardHeader>
//               <CardTitle>💬 Sentiment Distribution</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span>Positive</span>
//                   <span>{sentimentBreakdown.positive}%</span>
//                 </div>
//                 <Progress value={sentimentBreakdown.positive} className="h-2 bg-green-100" />
//               </div>
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span>Neutral</span>
//                   <span>{sentimentBreakdown.neutral}%</span>
//                 </div>
//                 <Progress value={sentimentBreakdown.neutral} className="h-2 bg-gray-100" />
//               </div>
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span>Negative</span>
//                   <span>{sentimentBreakdown.negative}%</span>
//                 </div>
//                 <Progress value={sentimentBreakdown.negative} className="h-2 bg-red-100" />
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {categoryData.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>📂 Post Categories</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {categoryData.map(([cat, count]) => (
//                 <div key={cat}>
//                   <div className="flex justify-between text-sm">
//                     <span className="capitalize">{cat}</span>
//                     <span>{count}</span>
//                   </div>
//                   <Progress value={(count / classifications.length) * 100} className="h-2" />
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* 3️⃣ Competitor Analysis */}
//       {competitorMentions && competitorMentions.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>🏆 Competitor Mentions</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {competitorMentions.slice(0, 5).map((comp) => {
//               const max = competitorMentions[0]?.count || 1;
//               return (
//                 <div key={comp.competitor}>
//                   <div className="flex justify-between text-sm">
//                     <span>{comp.competitor}</span>
//                     <span className="font-medium">{comp.count} mentions</span>
//                   </div>
//                   <Progress value={(comp.count / max) * 100} className="h-2" />
//                 </div>
//               );
//             })}
//           </CardContent>
//         </Card>
//       )}

//       {/* 4️⃣ Top Topics / Hashtags */}
//       {topTopics && topTopics.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>🔍 Trending Topics & Hashtags</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               {topTopics.map((topic) => (
//                 <Badge key={topic.topic} variant="secondary" className="px-3 py-1 text-sm">
//                   #{topic.topic} ({topic.count})
//                 </Badge>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* 5️⃣ Deep Dive: Top Positive & Negative Posts */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {topPositive.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>👍 Top Positive Posts</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {topPositive.map((post) => (
//                 <div key={post.id} className="border-b pb-2 last:border-b-0">
//                   <p className="text-sm italic">&quot;{post.content.slice(0, 150)}...&quot;</p>
//                   <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                     <span>@{post.author}</span>
//                     <span>{getSignalEngagementScore(post).toLocaleString()} engagements</span>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         )}

//         {topNegative.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>👎 Top Negative Posts</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {topNegative.map((post) => (
//                 <div key={post.id} className="border-b pb-2 last:border-b-0">
//                   <p className="text-sm italic">&quot;{post.content.slice(0, 150)}...&quot;</p>
//                   <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                     <span>@{post.author}</span>
//                     <span>{getSignalEngagementScore(post).toLocaleString()} engagements</span>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* 6️⃣ Engagement Timeline */}
//       {timelineData.length > 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>📈 Activity Timeline (Last 7 Days)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-end gap-2 h-32">
//               {timelineData.map(([date, count]) => {
//                 const max = Math.max(...timelineData.map(d => d[1]), 1);
//                 const height = (count / max) * 100;
//                 return (
//                   <div key={date} className="flex-1 flex flex-col items-center">
//                     <div className="w-full bg-primary rounded-t" style={{ height: `${height}px` }} />
//                     <span className="text-xs text-muted-foreground mt-1">{date}</span>
//                     <span className="text-xs font-medium">{count}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* 7️⃣ Creators List (Top 10 by Engagement) */}
//       <Tabs defaultValue="all" className="w-full">
//         <TabsList>
//           <TabsTrigger value="all">All Creators ({creators.length})</TabsTrigger>
//           <TabsTrigger value="top">Top by Engagement</TabsTrigger>
//         </TabsList>
//         <TabsContent value="all" className="mt-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             {creators.map((creator) => (
//               <CreatorCard key={creator.handle} creator={creator} />
//             ))}
//           </div>
//         </TabsContent>
//         <TabsContent value="top" className="mt-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             {[...creators]
//               .sort((a, b) => b.totalEngagement - a.totalEngagement)
//               .slice(0, 10)
//               .map((creator) => (
//                 <CreatorCard key={creator.handle} creator={creator} />
//               ))}
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* 8️⃣ Key Findings & Recommendations */}
//       <Card>
//         <CardHeader>
//           <CardTitle>💡 Key Findings & Recommendations</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <ul className="list-disc pl-5 space-y-1 text-sm">
//             <li>
//               <strong>{summary.totalCreators}</strong> creators are discussing the product, generating{' '}
//               <strong>{summary.totalEngagement.toLocaleString()}</strong> total engagements.
//             </li>
//             <li>
//               The dominant platform is <strong>{topPlatform?.source || 'Unknown'}</strong> with{' '}
//               {topPlatform?.count || 0} creators.
//             </li>
//             {sentimentBreakdown && (
//               <li>
//                 Sentiment is <strong>{sentimentBreakdown.positive}% positive</strong> – indicating
//                 strong brand affinity.
//               </li>
//             )}
//             {topNegative.length > 0 && (
//               <li>
//                 Top negative concerns revolve around: &quot;{topNegative[0]?.content.slice(0, 60)}...&quot;
//                 – consider addressing these points.
//               </li>
//             )}
//             {competitorMentions && competitorMentions.length > 0 && (
//               <li>
//                 Competitors {competitorMentions.map(c => c.competitor).slice(0, 3).join(', ')}
//                 {' '}are mentioned less frequently – you have a competitive edge.
//               </li>
//             )}
//             <li>
//               Recommended action: <strong>engage with top creators</strong> (e.g., @{creators[0]?.handle})
//               to amplify positive sentiment.
//             </li>
//           </ul>
//         </CardContent>
//       </Card>

//       {/* 9️⃣ Full Narrative Intelligence Report */}
//       {narrativeReport && (
//         <section className="pt-4">
//           <h3 className="text-2xl font-bold mb-4">Full Intelligence Report</h3>
//           <NarrativeReportDocument report={narrativeReport} />
//         </section>
//       )}
//     </div>
//   );
// }

// components/SocialListening/ReportLayout.tsx

'use client';

import { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreatorCard } from './CreatorCard';
import { NarrativeReportDocument, NarrativeReportDocumentHandle, NarrativeReport } from './NarrativeReportDocument';

// --- Types (matching the FullReport from the hook) ---
type Creator = {
  handle: string;
  source: string;
  topic: string;
  postCount: number;
  totalEngagement: number;
  avgEngagement: number;
  sampleContent: string[];
};

type SignalMetadata = {
  topic?: string;
  seedTopic?: string;
  [key: string]: unknown;
};

type SignalEngagement = {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
};

type Signal = {
  id: string;
  author: string;
  source: string;
  content: string;
  engagement?: number;
  timestamp: string;
  metadata?: SignalMetadata & { engagement?: SignalEngagement };
};

type Classification = {
  id: string;
  category: string;
  label: string;
  confidence: number;
};

type CommunityLead = {
  id: string;
  handle: string;
  source: string;
  discoveredViaTopic: string;
};

type Environment = {
  sentiment: string;
  riskScore?: number;
};

type FullReport = {
  summary: {
    totalCreators: number;
    totalSignals: number;
    totalEngagement: number;
    topSources: { source: string; count: number }[];
    avgEngagementPerCreator: number;
  };
  creators: Creator[];
  signals: Signal[];
  classifications: Classification[];
  communityLeads: CommunityLead[];
  environments?: Environment[];
  sentimentBreakdown?: { positive: number; neutral: number; negative: number };
  topTopics?: { topic: string; count: number }[];
  competitorMentions?: { competitor: string; count: number }[];
  narrativeReport?: NarrativeReport | null;
};

function getSignalEngagementScore(signal: Signal): number {
  if (typeof signal.engagement === 'number') return signal.engagement;
  const eng = signal.metadata?.engagement;
  if (!eng) return 0;
  const { views = 0, likes = 0, comments = 0, shares = 0 } = eng;
  return views + likes * 5 + comments * 10 + shares * 8;
}

function groupByDate(signals: Signal[]) {
  const map: Record<string, number> = {};
  signals.forEach(s => {
    const date = new Date(s.timestamp).toLocaleDateString();
    map[date] = (map[date] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-7);
}

function getTopPostsBySentiment(
  signals: Signal[],
  classifications: Classification[],
  label: string,
  limit = 3
) {
  const signalIds = classifications.filter(c => c.label.toLowerCase().includes(label)).map(c => c.id);
  const filtered = signals.filter(s => signalIds.includes(s.id));
  return filtered
    .sort((a, b) => getSignalEngagementScore(b) - getSignalEngagementScore(a))
    .slice(0, limit);
}

export function ReportLayout({ report }: { report: FullReport }) {
  const {
    summary,
    creators,
    signals,
    classifications,
    sentimentBreakdown,
    topTopics,
    competitorMentions,
    narrativeReport,
  } = report;

  const reportRef = useRef<NarrativeReportDocumentHandle>(null);
  const topPlatform = summary.topSources.length > 0 ? summary.topSources[0] : null;
  const timelineData = groupByDate(signals);
  const topPositive = getTopPostsBySentiment(signals, classifications, 'positive');
  const topNegative = getTopPostsBySentiment(signals, classifications, 'negative');

  const categoryMap: Record<string, number> = {};
  classifications.forEach(c => {
    const cat = c.category || 'uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleDownload = () => {
    if (reportRef.current) {
      reportRef.current.download();
    }
  };

  return (
    <div className="space-y-8">
      {/* 1️⃣ Executive Summary */}
      <section>
        <h3 className="text-2xl font-bold mb-4">Executive Summary</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.totalCreators}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.totalSignals}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.totalEngagement.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Top Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{topPlatform?.source || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{topPlatform?.count || 0} creators</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2️⃣ Sentiment & Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sentimentBreakdown && (
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Positive</span>
                  <span>{sentimentBreakdown.positive}%</span>
                </div>
                <Progress value={sentimentBreakdown.positive} className="h-2 bg-green-100" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Neutral</span>
                  <span>{sentimentBreakdown.neutral}%</span>
                </div>
                <Progress value={sentimentBreakdown.neutral} className="h-2 bg-gray-100" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Negative</span>
                  <span>{sentimentBreakdown.negative}%</span>
                </div>
                <Progress value={sentimentBreakdown.negative} className="h-2 bg-red-100" />
              </div>
            </CardContent>
          </Card>
        )}

        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Post Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryData.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{cat}</span>
                    <span>{count}</span>
                  </div>
                  <Progress value={(count / classifications.length) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 3️⃣ Competitor Analysis */}
      {competitorMentions && competitorMentions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Competitor Mentions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {competitorMentions.slice(0, 5).map((comp) => {
              const max = competitorMentions[0]?.count || 1;
              return (
                <div key={comp.competitor}>
                  <div className="flex justify-between text-sm">
                    <span>{comp.competitor}</span>
                    <span className="font-medium">{comp.count} mentions</span>
                  </div>
                  <Progress value={(comp.count / max) * 100} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* 4️⃣ Top Topics / Hashtags */}
      {topTopics && topTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trending Topics & Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topTopics.map((topic) => (
                <Badge key={topic.topic} variant="secondary" className="px-3 py-1 text-sm">
                  #{topic.topic} ({topic.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5️⃣ Deep Dive: Top Positive & Negative Posts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {topPositive.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Positive Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPositive.map((post) => (
                <div key={post.id} className="border-b pb-2 last:border-b-0">
                  <p className="text-sm italic">&quot;{post.content.slice(0, 150)}...&quot;</p>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>@{post.author}</span>
                    <span>{getSignalEngagementScore(post).toLocaleString()} engagements</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {topNegative.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Negative Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topNegative.map((post) => (
                <div key={post.id} className="border-b pb-2 last:border-b-0">
                  <p className="text-sm italic">&quot;{post.content.slice(0, 150)}...&quot;</p>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>@{post.author}</span>
                    <span>{getSignalEngagementScore(post).toLocaleString()} engagements</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 6️⃣ Engagement Timeline */}
      {timelineData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {timelineData.map(([date, count]) => {
                const max = Math.max(...timelineData.map(d => d[1]), 1);
                const height = (count / max) * 100;
                return (
                  <div key={date} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-primary rounded-t" style={{ height: `${height}px` }} />
                    <span className="text-xs text-muted-foreground mt-1">{date}</span>
                    <span className="text-xs font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7️⃣ Creators List (Top 10 by Engagement) */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Creators ({creators.length})</TabsTrigger>
          <TabsTrigger value="top">Top by Engagement</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {creators.map((creator) => (
              <CreatorCard key={creator.handle} creator={creator} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="top" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[...creators]
              .sort((a, b) => b.totalEngagement - a.totalEngagement)
              .slice(0, 10)
              .map((creator) => (
                <CreatorCard key={creator.handle} creator={creator} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 8️⃣ Key Findings & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Key Findings & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              <strong>{summary.totalCreators}</strong> creators are discussing the product, generating{' '}
              <strong>{summary.totalEngagement.toLocaleString()}</strong> total engagements.
            </li>
            <li>
              The dominant platform is <strong>{topPlatform?.source || 'Unknown'}</strong> with{' '}
              {topPlatform?.count || 0} creators.
            </li>
            {sentimentBreakdown && (
              <li>
                Sentiment is <strong>{sentimentBreakdown.positive}% positive</strong> – indicating
                strong brand affinity.
              </li>
            )}
            {topNegative.length > 0 && (
              <li>
                Top negative concerns revolve around: &quot;{topNegative[0]?.content.slice(0, 60)}...&quot;
                – consider addressing these points.
              </li>
            )}
            {competitorMentions && competitorMentions.length > 0 && (
              <li>
                Competitors {competitorMentions.map(c => c.competitor).slice(0, 3).join(', ')}
                {' '}are mentioned less frequently – you have a competitive edge.
              </li>
            )}
            <li>
              Recommended action: <strong>engage with top creators</strong> (e.g., @{creators[0]?.handle})
              to amplify positive sentiment.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 9️⃣ Full Narrative Intelligence Report */}
      {narrativeReport && (
        <section className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Full Intelligence Report</h3>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </div>
          <NarrativeReportDocument ref={reportRef} report={narrativeReport} />
        </section>
      )}
    </div>
  );
}