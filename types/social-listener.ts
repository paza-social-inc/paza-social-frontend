export interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: string;
  profile_url: string;
  confidence_score: number;
  summary: { why_selected: string };
  audience: { primary: string[]; secondary?: string[] };
  conversation_alignment: string[];
  evidence: { type: string; text: string; url?: string; date: string }[];
  content_style: string[];
  related_communities: { name: string; platform: string }[];
  similar_creators: string[];
  signals: {
    audience_match: number;
    topic_match: number;
    community_presence: number;
    content_relevance: number;
    brand_safety: number;
    overall_score: number;
  };
  paza_insight: { text: string };
}

export interface Community {
  id: string;
  name: string;
  platform: string;
  activity_level: string;
  confidence: number;
  summary: { why_selected: string };
  members: string[];
  interests: string[];
  discussion_themes: string[];
  evidence: { type: string; text: string; url?: string; date: string }[];
  characteristics: string[];
  related_creators: string[];
  similar_communities: string[];
  paza_insight: { text: string };
}

export interface Audience {
  id: string;
  name: string;
  confidence: number;
  overview: string;
  who_they_are: { life_stage: string; primary_decision_maker: string; others: string[] };
  priorities: string[];
  common_questions: string[];
  challenges: string[];
  buying_drivers: string[];
  platforms: string[];
  trusted_sources: string[];
  language: string[];
  paza_insight: { text: string };
}

export interface DemandSignal {
  topic: string;
  strength: string;
  description: string;
  evidence: string[];
  related_keywords: string[];
  related_products: string[];
  emerging_topics: string[];
  opportunity: string;
  paza_insight: { text: string };
}

export interface Recommendation {
  goal: string;
  creators: { name: string; handle: string; score: number; why: string; expected_contribution: string[] }[];
  communities: { name: string; why: string; recommended_activity: string[] }[];
  content_themes: string[];
  phases: { name: string; description: string }[];
  risks: string[];
  paza_recommendation: string;
}

export interface Competitor {
  id: string;
  name: string;
  platform: string;
  audience_overlap: number;      // 0-1
  threat_level: 'High' | 'Medium' | 'Low';
  key_messaging: string[];
  evidence: { text: string; date: string }[];
  similar_creators: string[];
  paza_insight: { text: string };
}

export interface SocialListeningReport {
  id: string;
  query: string;
  timestamp: string;
  creators: Creator[];
  communities: Community[];
  audience: Audience;
  demand: DemandSignal[];
  competitors: Competitor[];
  recommendations: Recommendation;
}