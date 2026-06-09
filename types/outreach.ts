export type LeadStatus = 'new' | 'processing' | 'scanned' | 'failed' | 'approved' | 'sent'

export type RecommendedAngle =
  | 'creator_attribution_gap'
  | 'partner_performance_visibility'
  | 'affiliate_quality_diagnostics'
  | 'creator_ecosystem_visibility'
  | 'ecosystem_diagnostic'
  | 'diagnostic_observation'

export interface OutreachSignal {
  id: string
  leadId: string
  signalType: string
  source: string
  evidence: string
  weight: number
  confidence: number
  createdAt: string
}

export interface OutreachInsight {
  id: string
  leadId: string
  observedStrategy: string
  likelyGap: string
  whyNow: string
  recommendedAngle: RecommendedAngle
  createdAt: string
}

export interface OutreachMessage {
  id: string
  leadId: string
  subject: string
  body: string
  status: 'draft' | 'approved' | 'sending' | 'sent' | 'failed'
  providerMessageId: string | null
  approvedAt: string | null
  sentAt: string | null
  replyStatus: string | null
  createdAt: string
}

export interface OutreachLead {
  id: string
  domain: string
  companyName: string | null
  websiteUrl: string | null
  country: string | null
  contactEmail: string | null
  creatorMaturityScore: number
  attributionGapScore: number
  opportunityScore: number
  status: LeadStatus
  recommendedAngle: RecommendedAngle | null
  signals: OutreachSignal[]
  insights: OutreachInsight[]
  messages: OutreachMessage[]
  createdAt: string
  updatedAt: string
}

export interface LeadsResponse {
  leads: OutreachLead[]
}

export interface ApproveResponse {
  message: OutreachMessage
}

export interface SendResponse {
  message: OutreachMessage
  resend: unknown
}