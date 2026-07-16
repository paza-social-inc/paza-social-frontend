// 'use client';

// import { useState } from 'react';
// import { socialListenerApi } from '@/lib/socialListenerApi';
// import { SocialListeningReport } from '@/types/social-listener';
// import { useAuth } from '@/hooks/useAuth';

// interface BriefPayload {
//   businessId: string;
//   title: string;
//   objective: string;
//   industry?: string;
//   country?: string;
//   topics: string[];
//   behaviors?: string[];
//   conditions?: string[];
//   status?: string;
// }

// async function createBrief(payload: BriefPayload): Promise<string> {
//   const { data } = await socialListenerApi.post('/api/v1/briefs', payload);
//   return data.data.id;  
// }

// async function activateBrief(briefId: string): Promise<string> {
//   const { data } = await socialListenerApi.post(`/api/v1/briefs/${briefId}/activate`);
//   return data.data.id;   
// }
// async function getJobStatus(briefId: string, jobId: string): Promise<{ status: string }> {
//   const { data } = await socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}`);
//   return data.data;      
// }

// async function fetchReport(briefId: string, jobId: string): Promise<SocialListeningReport> {
//   const { data } = await socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/creator-report`);
//   return data.data;     
// }
// export function useSocialListeningSearch() {
//   // Cast useAuth return to expect optional businessId
//   const { user } = useAuth() as { user?: { businessId?: string } };
//   const [report, setReport] = useState<SocialListeningReport | null>(null);
//   const [status, setStatus] = useState<string>('idle');
//   const [error, setError] = useState<string | null>(null);

//   const startSearch = async (query: string) => {
//     setReport(null);
//     setError(null);
//     setStatus('creating brief...');
//     try {
//       const payload: BriefPayload = {
//         businessId: user?.businessId || 'default',   // No TypeScript error now
//         title: query,
//         objective: `Analyze market demand and communities for ${query}`,
//         country: 'Kenya',
//         topics: [query],
//         status: 'DRAFT',                             // Required status field
//       };
//       const briefId = await createBrief(payload);
//       setStatus('activating job...');
//       const { jobId } = await activateBrief(briefId);
//       setStatus('running data collection...');
//       await runJob(briefId, jobId);

//       let jobStatus = 'RUNNING';
//       while (jobStatus === 'PENDING' || jobStatus === 'RUNNING') {
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         const jobData = await getJobStatus(briefId, jobId);
//         jobStatus = jobData.status;
//         setStatus(`collecting data... (${jobStatus})`);
//       }

//       if (jobStatus === 'COMPLETED') {
//         setStatus('generating report...');
//         const reportData = await fetchReport(briefId, jobId);
//         setReport(reportData);
//         setStatus('done');
//       } else {
//         setError('Job failed. Please try again.');
//         setStatus('idle');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Something went wrong');
//       setStatus('idle');
//     }
//   };

//   return { startSearch, report, isLoading: status !== 'idle' && status !== 'done', status, error };
// }
// 'use client';

// import { useState } from 'react';
// import { socialListenerApi } from '@/lib/socialListenerApi';
// import { SocialListeningReport } from '@/types/social-listener';
// import { useAuth } from '@/hooks/useAuth';

// interface BriefPayload {
//   businessId: string;
//   title: string;
//   objective: string;
//   industry?: string;
//   country?: string;
//   topics: string[];
//   behaviors?: string[];
//   conditions?: string[];
//   status?: string;
// }

// async function createBrief(payload: BriefPayload): Promise<string> {
//   const { data } = await socialListenerApi.post('/api/v1/briefs', payload);
//   return data.data.id;
// }

// async function activateBrief(briefId: string): Promise<string> {
//   const { data } = await socialListenerApi.post(`/api/v1/briefs/${briefId}/activate`);
//   return data.data.id; // jobId
// }

// async function runJob(briefId: string, jobId: string): Promise<void> {
//   // this blocks until collection is fully done — no polling needed after it resolves
//   await socialListenerApi.post(`/api/v1/briefs/${briefId}/jobs/${jobId}/run`);
// }

// async function fetchReport(briefId: string, jobId: string): Promise<SocialListeningReport> {
//   const { data } = await socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/creator-report`);
//   return data.data;
// }

// export function useSocialListeningSearch() {
//   const { user } = useAuth() as { user?: { businessId?: string } };
//   const [report, setReport] = useState<SocialListeningReport | null>(null);
//   const [status, setStatus] = useState<string>('idle');
//   const [error, setError] = useState<string | null>(null);

//   const startSearch = async (query: string) => {
//     setReport(null);
//     setError(null);
//     try {
//       setStatus('creating brief...');
//       const payload: BriefPayload = {
//         businessId: user?.businessId || 'default',
//         title: query,
//         objective: `Analyze market demand and communities for ${query}`,
//         country: 'Kenya',
//         topics: [query],
//         status: 'DRAFT',
//       };
//       const briefId = await createBrief(payload);

//       setStatus('activating job...');
//       const jobId = await activateBrief(briefId);

//       setStatus('collecting data... this may take a minute');
//       await runJob(briefId, jobId);

//       setStatus('generating report...');
//       const reportData = await fetchReport(briefId, jobId);
//       setReport(reportData);
//       setStatus('done');
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message || 'Something went wrong');
//       setStatus('idle');
//     }
//   };

//   return {
//     startSearch,
//     report,
//     isLoading: status !== 'idle' && status !== 'done',
//     status,
//     error,
//   };
// }

// 'use client';

// import { useState } from 'react';
// import { socialListenerApi } from '@/lib/socialListenerApi';
// import { SocialListeningReport } from '@/types/social-listener';
// import { useAuth } from '@/hooks/useAuth';

// interface BriefPayload {
//   businessId: string;
//   title: string;
//   objective: string;
//   industry?: string;
//   country?: string;
//   topics: string[];
//   behaviors?: string[];
//   conditions?: string[];
//   status?: string;
//   // handle?: string;
// }

// async function createBrief(payload: BriefPayload): Promise<string> {
//   const { data } = await socialListenerApi.post('/api/v1/briefs', payload);
//   return data.data.id;
// }

// async function activateBrief(briefId: string): Promise<string> {
//   const { data } = await socialListenerApi.post(`/api/v1/briefs/${briefId}/activate`);
//   return data.data.id; // jobId
// }

// async function runJob(briefId: string, jobId: string): Promise<void> {
//   await socialListenerApi.post(`/api/v1/briefs/${briefId}/jobs/${jobId}/run`);
// }

// async function fetchReport(briefId: string, jobId: string): Promise<SocialListeningReport> {
//   const { data } = await socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/creator-report`);
//   return data.data;
// }

// export function useSocialListeningSearch() {
//   const { user } = useAuth() as { user?: { businessId?: string } };
//   const [report, setReport] = useState<SocialListeningReport | null>(null);
//   const [status, setStatus] = useState<string>('idle');
//   const [error, setError] = useState<string | null>(null);

//   const startSearch = async (query: string) => {
//     setReport(null);
//     setError(null);
//     try {
//       setStatus('creating brief...');
//       const payload: BriefPayload = {
//         businessId: user?.businessId || 'default',
//         title: query,
//         objective: `Analyze market demand and communities for ${query}`,
//         country: 'Kenya',
//         topics: [query],
//         status: 'DRAFT',
//       };
//       const briefId = await createBrief(payload);

//       setStatus('activating job...');
//       const jobId = await activateBrief(briefId);

//       setStatus('collecting data... this may take a minute');
//       await runJob(briefId, jobId);

//       setStatus('generating report...');
//       const reportData = await fetchReport(briefId, jobId);
//       setReport(reportData);
//       setStatus('done');
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message || 'Something went wrong');
//       setStatus('idle');
//     }
//   };

//   return {
//     startSearch,
//     report,
//     isLoading: status !== 'idle' && status !== 'done',
//     status,
//     error,
//   };
// }
'use client';

import { useState } from 'react';
import { socialListenerApi } from '@/lib/socialListenerApi';
import { useAuth } from '@/hooks/useAuth';

type Creator = {
  handle: string;
  source: string;
  topic: string;
  postCount: number;
  totalEngagement: number;
  avgEngagement: number;
  sampleContent: string[];
};

type Signal = {
  id: string;
  author: string;
  source: string;
  content: string;
  engagement: number;
  timestamp: string;
  metadata?: any;
};

type Classification = {
  id: string;
  category: string;
  label: string;
  confidence: number;
  isRelevant: boolean;
  competitorMentioned: string | null;
  audienceSignal: string | null;
  skippedNonEnglish: boolean;
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

export type NarrativeReport = {
  title: string;
  generatedAt: string;
  abstract: string;
  sections: Array<{ heading: string; paragraphs: string[]; evidence?: any[] }>;
  methodologyNote: string;
};

export type FullReport = {
  summary: {
    totalCreators: number;
    totalSignals: number;
    totalEngagement: number;
    topSources: { source: string; count: number }[];
    avgEngagementPerCreator: number;
  };
  creators: Creator[];
  classifications: Classification[];
  communityLeads: CommunityLead[];
  environments?: Environment[];
  sentimentBreakdown?: { positive: number; neutral: number; negative: number };
  topTopics?: { topic: string; count: number }[];
  competitorMentions?: { competitor: string; count: number }[];
  signals: Signal[];
  jobId: string;
  briefId: string;
  narrativeReport?: NarrativeReport | null; 
};

interface BriefPayload {
  businessId: string;
  title: string;
  objective: string;
  industry?: string;
  country?: string;
  topics: string[];
  behaviors?: string[];
  conditions?: string[];
  status?: string;
}

async function createBrief(payload: BriefPayload): Promise<string> {
  const { data } = await socialListenerApi.post('/api/v1/briefs', payload);
  return data.data.id;
}

async function activateBrief(briefId: string): Promise<string> {
  const { data } = await socialListenerApi.post(`/api/v1/briefs/${briefId}/activate`);
  return data.data.id;
}

async function runJob(briefId: string, jobId: string): Promise<void> {
  await socialListenerApi.post(`/api/v1/briefs/${briefId}/jobs/${jobId}/run`);
}

async function classifyJob(briefId: string, jobId: string): Promise<void> {
  await socialListenerApi.post(`/api/v1/briefs/${briefId}/jobs/${jobId}/classify`);
}

// Now accepts product as a parameter for the narrative endpoint
async function fetchFullReport(briefId: string, jobId: string, product: string): Promise<FullReport> {
  // Fetch all main data sources in parallel
  const [creatorsRes, signalsRes, classificationsRes, leadsRes, envRes, narrativeRes] = await Promise.all([
    socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/creators`),
    socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/signals`),
    socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/classifications`),
    socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/community-leads`),
    socialListenerApi.get(`/api/v1/briefs/${briefId}/jobs/${jobId}/environments`).catch(() => null),
    // NEW: fetch the narrative report with the topic query param
    // socialListenerApi
    //   .get(`/api/v1/briefs/${briefId}/jobs/${jobId}/narrative-report?topic=${encodeURIComponent(product)}`)
    //   .catch(() => null),
    socialListenerApi
    .get(`/api/v1/briefs/${briefId}/jobs/${jobId}/narrative-report?topic=${encodeURIComponent(product)}&includeDiscovery=true`)
    .catch(() => null),
  ]);

  const creators: Creator[] = creatorsRes.data.data?.creators || [];
  const signals: Signal[] = signalsRes.data.data || [];
  const leads: CommunityLead[] = leadsRes.data.data || [];
  const environments: Environment[] | undefined = envRes?.data?.data;
  const narrativeReport: NarrativeReport | null = narrativeRes?.data?.data || null;

  // ... (rest of the processing remains exactly the same)
  const rawClassifications = classificationsRes.data.data || [];
  const classifications: Classification[] = rawClassifications.map((c: any) => ({
    id: c.signalId,
    category: c.frictionType,
    label: (c.sentiment || 'NEUTRAL').toLowerCase(),
    confidence: c.confidence,
    isRelevant: c.isRelevant,
    competitorMentioned: c.competitorMentioned,
    audienceSignal: c.audienceSignal,
    skippedNonEnglish: c.skippedNonEnglish,
  }));

  const relevantClassifiedIds = new Set(
    classifications.filter((c) => c.isRelevant && !c.skippedNonEnglish).map((c) => c.id)
  );

  const totalCreators = creators.length;
  const totalSignals = signals.length;
  const totalEngagement = creators.reduce((sum, c) => sum + c.totalEngagement, 0);
  const avgEngagementPerCreator = totalCreators > 0 ? totalEngagement / totalCreators : 0;

  const sourceMap = new Map<string, number>();
  creators.forEach(c => {
    sourceMap.set(c.source, (sourceMap.get(c.source) || 0) + 1);
  });
  const topSources = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  const consideredClassifications = classifications.filter(
    (c) => c.isRelevant && !c.skippedNonEnglish
  );
  consideredClassifications.forEach(cl => {
    if (cl.label === 'positive') sentimentCounts.positive++;
    else if (cl.label === 'negative') sentimentCounts.negative++;
    else sentimentCounts.neutral++;
  });
  const totalConsidered = consideredClassifications.length || 1;
  const sentimentBreakdown = {
    positive: Math.round((sentimentCounts.positive / totalConsidered) * 100),
    neutral: Math.round((sentimentCounts.neutral / totalConsidered) * 100),
    negative: Math.round((sentimentCounts.negative / totalConsidered) * 100),
  };

  const topicMap = new Map<string, number>();
  signals.forEach(s => {
    const topic = s.metadata?.topic || s.metadata?.seedTopic || 'other';
    topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
  });
  const topTopics = Array.from(topicMap.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const competitorMap = new Map<string, number>();
  classifications.forEach(c => {
    if (c.competitorMentioned) {
      const name = c.competitorMentioned.trim();
      competitorMap.set(name, (competitorMap.get(name) || 0) + 1);
    }
  });
  const competitorMentions = Array.from(competitorMap.entries())
    .map(([competitor, count]) => ({ competitor, count }))
    .sort((a, b) => b.count - a.count);

  return {
    summary: {
      totalCreators,
      totalSignals,
      totalEngagement,
      topSources,
      avgEngagementPerCreator,
    },
    creators,
    classifications,
    communityLeads: leads,
    environments,
    sentimentBreakdown,
    topTopics,
    competitorMentions,
    signals,
    jobId,
    briefId,
    narrativeReport,
  };
}

export function useSocialListeningSearch() {
  const { user } = useAuth() as { user?: { businessId?: string } };
  const [report, setReport] = useState<FullReport | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);

  const startSearch = async (query: string) => {
    setReport(null);
    setError(null);
    try {
      const product = query.trim();

      setStatus('creating brief...');
      const payload: BriefPayload = {
        businessId: user?.businessId || 'default',
        title: product,
        objective: `Analyze market demand and communities for ${product}`,
        country: 'Kenya',
        topics: [product],
        status: 'DRAFT',
      };
      const briefId = await createBrief(payload);

      setStatus('activating job...');
      const jobId = await activateBrief(briefId);

      setStatus('collecting data from TikTok, YouTube, and other sources...');
      await runJob(briefId, jobId);

      setStatus('analyzing content and detecting sentiment, competitors, and audience signals...');
      await classifyJob(briefId, jobId);

      setStatus('generating full report...');
      // Pass product to fetchFullReport so it can be used for the narrative endpoint
      const fullReport = await fetchFullReport(briefId, jobId, product);
      setReport(fullReport);
      setStatus('done');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      setStatus('idle');
    }
  };

  return {
    startSearch,
    report,
    isLoading: status !== 'idle' && status !== 'done',
    status,
    error,
  };
}