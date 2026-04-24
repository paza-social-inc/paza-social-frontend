/**
 * Brand Taxonomy Constants — mirrors backend taxonomy.constants.ts
 * Used for dropdowns, multi-selects, and validation in brand profile forms.
 */

// ─── BRAND INDUSTRIES (15 options) ──────────────────────────────────────────

export const BRAND_INDUSTRIES = [
    "Health & Wellness",
    "Beauty & Personal Care",
    "Fashion & Apparel",
    "Food & Beverage",
    "Travel, Hospitality & Leisure",
    "Technology (Software/Hardware)",
    "Telecoms & Connectivity",
    "Consumer Goods (CPG)",
    "Consumer Services (Retail/Delivery/Home)",
    "Professional Services (Legal/Consulting/Real Estate/etc.)",
    "Financial Services",
    "Media, Entertainment & Culture",
    "Automotive & Mobility",
    "Industrial, Manufacturing & Energy",
    "Public Sector & Nonprofit",
];

export const BRAND_SUBCATEGORIES_MAP: Record<string, string[]> = {
    "Health & Wellness": [
        "Fitness & Training",
        "Clinics & Health Providers",
        "Supplements & Nutrition",
        "Mental Wellness",
    ],
    "Beauty & Personal Care": [
        "Skincare",
        "Cosmetics",
        "Haircare",
        "Fragrance",
    ],
    "Fashion & Apparel": [
        "Apparel",
        "Footwear",
        "Accessories",
        "Luxury / Designer",
    ],
    "Food & Beverage": [
        "Restaurants & Cafes",
        "Packaged Foods",
        "Dairy",
        "Snacks & Confectionery",
        "Beverages (non-alcohol)",
    ],
    "Travel, Hospitality & Leisure": [
        "Hotels & Stays",
        "Travel Services",
        "Experiences & Tours",
        "Events",
    ],
    "Technology (Software/Hardware)": [
        "Software / SaaS",
        "Hardware / Devices",
        "E-commerce / Platforms",
        "AI / Data",
    ],
    "Telecoms & Connectivity": [
        "Mobile Network Operator",
        "ISP / Broadband",
        "Mobile Money / Fintech arm",
        "Devices & Bundles",
    ],
    "Consumer Goods (CPG)": [
        "Home Care (cleaning)",
        "Personal Care (mass)",
        "Baby & Family",
        "Household Essentials",
    ],
    "Consumer Services (Retail/Delivery/Home)": [
        "Retail",
        "Delivery / Logistics",
        "Home Services",
        "Education Services (private)",
    ],
    "Professional Services (Legal/Consulting/Real Estate/etc.)": [
        "Legal",
        "Consulting",
        "Real Estate",
        "Marketing / Agency",
        "Recruitment / HR",
    ],
    "Financial Services": [
        "Banking",
        "Payments",
        "Insurance",
        "Lending",
        "Investment / Wealth",
    ],
    "Media, Entertainment & Culture": [
        "Music",
        "Film/TV",
        "Publishing / News",
        "Gaming / Esports",
        "Live Events",
    ],
    "Automotive & Mobility": [
        "Vehicle Sales",
        "Aftermarket / Repair",
        "Ride-hailing / Mobility",
        "EV / Charging",
    ],
    "Industrial, Manufacturing & Energy": [
        "Manufacturing",
        "Construction / Materials",
        "Logistics (B2B)",
        "Energy / Utilities",
        "Agribusiness (industrial)",
    ],
    "Public Sector & Nonprofit": [
        "Government Agency",
        "NGO / Foundation",
        "Social Impact Program",
        "Education (public)",
    ],
};

// ─── CONTEXTUAL ANCHORS ─────────────────────────────────────────────────────

export const CONTEXTUAL_ANCHORS = [
    "Personal Carry",
    "Home/Kitchen",
    "Work/Desk",
    "Transit/Car",
    "Gym/Active",
    "Social/Nightlife",
];

// ─── IDENTITY SIGNALS ───────────────────────────────────────────────────────

export const IDENTITY_SIGNALS = [
    "Hustler Energy (Growth/Intel)",
    "Guardian/Caregiver (Safety/Utility)",
    "Trend-Seeker (Aesthetics/The Hit)",
    "Minimalist/Practical (Utility/Friction)",
    "Status Builder (Mirroring/Luxury)",
    "Rebel/Challenger (Friction/Culture)",
];

// ─── EMOTIONAL OUTCOMES ─────────────────────────────────────────────────────

export const EMOTIONAL_OUTCOMES = [
    "Trust",
    "Confidence",
    "Power",
    "Relief",
    "Belonging",
    "Joy",
    "Sophistication",
];

// ─── TONE CATEGORIES ────────────────────────────────────────────────────────

export const TONE_CATEGORIES = {
    emotional: ["Warm", "Playful", "Empowering", "Uplifting", "Bold"],
    professional: ["Trusted", "Clear", "Practical", "Refined"],
    cultural: ["Inclusive", "Timeless", "Rooted", "Subversive"],
    lifestyle: ["Urban", "Earthy", "Luxury", "Everyday"],
};

// ─── COLLABORATION STYLES ───────────────────────────────────────────────────

export const COLLABORATION_STYLES = [
    "Control Optimized",
    "Creator-Led",
    "Experimental Playground",
    "High-risk co-creation",
    "Impact Partnership",
    "Speed Scalers",
    "Relationship Builders",
    "Prefers Studio-Polished Work",
];

// ─── RISK CONSTRAINT KEYS ───────────────────────────────────────────────────

export const RISK_CONSTRAINT_LABELS: Record<string, string> = {
    regulatedCategory: "Regulated/restricted category (18+, alcohol, etc.)",
    youthSensitive: "Youth-sensitive audience",
    politicalSensitivity: "Political sensitivity",
    claimRestrictions: "Advertising claim restrictions",
    competitorExclusivity: "Competitor exclusivity required",
    usageRightsStrict: "Strict usage rights enforcement",
};

// ─── PAST PROJECT ENUMS ─────────────────────────────────────────────────────

export const PARTICIPATION_ROLES = [
    "Sponsor",
    "Co-creator",
    "Content Licensee",
    "Distribution Partner",
    "IP Owner",
];

export const PAID_SPEND_OPTIONS = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "prefer_not", label: "Prefer not to say" },
];

export const SPEND_BANDS = [
    "<$500",
    "$500-$2k",
    "$2k-$10k",
    "$10k+",
];

export const SPEND_TYPES = [
    "Creator fees",
    "Media spend",
    "Production cost",
    "Licensing cost",
    "Agency fees",
    "Other",
];

export const OUTCOME_TYPES = [
    "Awareness",
    "Traffic",
    "Leads",
    "Sales",
    "Installs",
    "Footfall",
];

export const MEASUREMENT_SOURCES = [
    "Platform ads manager",
    "CRM / sales system",
    "Promo code",
    "Short link / UTM",
    "Not measured",
];
