/**
 * Mock data for showcase/project detail. Replace with API when backend is ready.
 * Aligned with SHOWCASE doc: About, Progress, Collaborators, Assets & Funding, Openings, Slots, Guardrails.
 */

export const HARD_NO_OPTIONS = [
  "Alcohol",
  "Betting/Gambling",
  "Politics",
  "Adult/Sexual content",
  "Tobacco/Nicotine/Vapes",
  "Crypto/\"get rich\" schemes",
] as const;

export const CREATIVE_NON_NEGOTIABLES = [
  "No scripted lines",
  "No dancing",
  "No profanity",
  "No medical/health claims",
  "No paid ads/whitelisting (brand boosting my content)",
  "No reposting to brand pages",
] as const;

export const DELIVERABLES_OPTIONS = [
  "Content placement",
  "Credits",
  "Product integration",
  "Media exposure",
] as const;

export const USAGE_RIGHTS_OPTIONS = ["Organic", "Paid ads", "Territory", "Duration"] as const;
export const EXCLUSIVITY_OPTIONS = ["None", "Category", "Full"] as const;
export const BUDGET_BANDS = ["< $500", "$500–$2k", "$2k–$10k", "$10k+"] as const;
export const KPI_OPTIONS = ["Reach", "Impressions", "Engagement rate", "Clicks", "Conversions", "Brand lift"] as const;
export const REPORTING_CADENCE = ["End of campaign", "Monthly", "Milestone-based"] as const;
export const OPENING_ROLES = ["IP Owner", "Operator", "Co-Creator", "Distributor", "Talent"] as const;
export const ENGAGEMENT_TYPES = ["Sponsor", "Co-creator", "Licensee", "Distribution Partner"] as const;

export const mockProject = {
  id: "1",
  title: "Project Title Here",
  shortDescription: "Short description about the project and what it entails.",
  aboutContent:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  reachTarget: "1.5 million new visits",
  reachAchieved: "1/1",
  reachPercent: 100,
  openingsPercent: 0,
  completed: true,
  imageUrl:
    "https://images.unsplash.com/photo-1586228044731-58323b1387f4?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1031",
  images: [
    "https://images.unsplash.com/photo-1586228044731-58323b1387f4?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1031",
    "https://images.unsplash.com/photo-1687322484985-ceef04a67288?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=840",
    "https://images.unsplash.com/photo-1745878248949-06f72332f260?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=387",
  ],
  // Assets & Funding (doc)
  hasIP: true,
  ownership: { whoOwns: "Creator 80%", registered: "Yes", jurisdiction: "Kenya" },
  revenueHistory: { hasEarned: true, amount: "Ksh. 45,000", source: "Platform", period: "Last 6 months" },
  costLedger: { production: "Ksh. 12,000", marketing: "Ksh. 5,000", legal: "Ksh. 2,000" },
  seekingFunding: true,
  capitalIntent: { amount: "Ksh. 200,000", useOfFunds: "IP growth", expectedOutcome: "Scale distribution" },
  deliveryGuarantee: "Strict Delivery",
  failureOutcome: "Refund undelivered units",
  risk: { canEarnWithoutCreator: "Yes", rightsLicensable: "Yes" },
  escrowRequired: true,
  killSwitchEnabled: true,
  // Slots / What brand gets
  deliverables: ["Content placement", "Credits", "Media exposure"],
  usageRights: ["Organic", "Paid ads", "Territory"],
  exclusivity: "Category",
  budgetBand: "$2k–$10k",
  kpis: ["Reach", "Impressions", "Engagement rate"],
  reportingCadence: "Monthly",
  proofRequired: ["Asset upload", "Platform analytics screenshot"],
  // Brand card metrics (for discovery)
  verifiedReach30d: 12400,
  ownedAudience: 58000,
  activeNodes30d: 4900,
  marketShareEstimate: "12%",
  primaryFit: "Merchant",
  secondaryFit: "Culture",
  activeWindow: "Last 30d",
};

export const mockCreator = {
  id: "1",
  name: "Abel Mutuaa",
  profession: "Comedian, Digital Content Creator",
  reach: "Pro: 100000-500000 reach",
  location: "Nairobi, Kenya",
  avatarUrl:
    "https://images.unsplash.com/photo-1680899010894-e9838a5e70ea?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=327",
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
  },
};

/** Extended creator profile for the profile modal (cover, website, stats, gallery, platform stats). */
export const mockCreatorProfile = {
  ...mockCreator,
  coverImageUrl:
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1200",
  website: "https://abelcreations.co.ke",
  projectsFinished: 0,
  projectsInProgress: 2,
  joinDate: "24.03.2024",
  aboutLong:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  galleryImages: [
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=600",
  ],
  platformStats: [
    { platform: "Instagram", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", link: "live/payday" },
    { platform: "Instagram", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat ex eu dictum.", link: "live/payday", highlighted: true },
    { platform: "Instagram", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", link: "live/payday" },
  ],
};

export const mockCollaborators = [
  { id: "1", name: "Joan Nduru", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joan", badges: ["Past delivery", "Repeat engagement"] },
  { id: "2", name: "Rajay Shah", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajay", badges: ["Capital exposure"] },
  { id: "3", name: "Moureen Kemunta", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Moureen", badges: ["Past delivery", "Repeat engagement", "Capital exposure"] },
];

export type MockOpening = {
  id: string;
  role: string;
  roleType?: (typeof OPENING_ROLES)[number];
  name: string;
  email: string;
  avatarUrl: string;
  hasWarning: boolean;
  datePosted: string;
  description: string;
  compensationType?: string;
  timeframe?: string;
};

export const mockOpenings: MockOpening[] = [
  {
    id: "1",
    role: "Creative Director",
    roleType: "Co-Creator",
    name: "Joan Nduru",
    email: "joan@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joan",
    hasWarning: true,
    datePosted: "22/02/2026",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    compensationType: "Revenue share",
    timeframe: "6 months",
  },
  {
    id: "2",
    role: "Content Writer",
    roleType: "Talent",
    name: "Rajay Shah",
    email: "rajay@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajay",
    hasWarning: false,
    datePosted: "22/02/2026",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    compensationType: "Fixed fee",
    timeframe: "3 months",
  },
];

export const mockGuardrails = {
  hardNo: ["Alcohol", "Betting/Gambling"] as string[],
  creativeNonNegotiables: {
    noScriptedLines: true,
    noDancing: false,
    noProfanity: true,
    noMedicalClaims: true,
    noPaidAds: false,
    noRepostingToBrand: true,
  },
  brandDelayRule: "48h",
  brandCancellationRule: "40%",
  unauthorizedUsageCharge: true,
};
