export type FrictionClass = 
  | 'complaint' 
  | 'concern' 
  | 'workaround' 
  | 'recommendation' 
  | 'admiration';

export interface EnvironmentSignal {
  id: string;
  date: string;
  anonymizedAuthor: string;
  snippet: string;
  classification: FrictionClass;
  confidence: number;
  sourceUrl?: string;
}

export interface EnvironmentProfile {
  id: string;
  name: string;
  type: string; // Meetup Group, Telegram Channel, etc.
  location: string;
  eriScore: number; // 0-100
  lastScanned: string;
  topics: string[];
  conditions: string[];
  behaviors: string[];
  frictionBreakdown: {
    complaint: number;
    concern: number;
    workaround: number;
    recommendation: number;
    admiration: number;
  };
  signalDiversity: number; // unique posters
  recentActivityTrend: number; // percentage change over last period
  activityTimeSeries: { date: string; count: number }[];
  signals: EnvironmentSignal[];
  recommendedActivation: string;
  accessibility: string;
  estimatedReach: string;
}