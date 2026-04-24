/**
 * Creator Taxonomy Constants — mirrors backend narrative-based profiling schema.
 */

// ─── 1. NARRATIVE IDENTITY TAGS ───────────────────────────────────────────

export const NARRATIVE_IDENTITY_TAGS = [
    "Self-Taught Underdog",
    "Purpose-Driven Pivot",
    "Cultural Storyteller",
    "Childhood Dream",
    "Accidental Virality",
    "Activist Roots",
];

// ─── 2. TONE CATEGORIES (Same as brands) ───────────────────────────────────

export const CREATOR_TONE_CATEGORIES = {
    emotional: ["Warm", "Playful", "Empowering", "Uplifting", "Bold"],
    professional: ["Trusted", "Clear", "Practical", "Refined"],
    cultural: ["Inclusive", "Timeless", "Rooted", "Subversive"],
    lifestyle: ["Urban", "Earthy", "Luxury", "Everyday"],
};

// ─── 3. AVAILABILITY & PERSONALITY ─────────────────────────────────────────

export const AVAILABILITY_TYPES = [
    { value: "FIXED", label: "Fixed schedule – Full-time, set hours" },
    { value: "FLEXIBLE", label: "Flexible hours – Part-time, rotating shifts" },
    { value: "PROJECT_BASED", label: "Project-Based: Task-specific engagement" },
    { value: "HYBRID", label: "Hybrid: Mix of fixed and flexible" },
];

export const PERSONALITY_TAGS = [
    "Independent",
    "Open to Direction",
    "Collaborative",
    "Assertive",
    "Structured",
    "Adaptive",
];

// ─── 4. CREATIVE CAPABILITIES ──────────────────────────────────────────────

export const SKILL_LEVELS = ["DEVELOPING", "PROFICIENT", "ADVANCED", "EXPERT"];

export const CREATOR_TYPES = [
    "Visual Arts",
    "Media Production",
    "Music",
    "Performing Arts",
    "Fashion & Beauty",
    "Writing",
    "Wellness & Fitness",
    "Lifestyle & Daily Living",
    "Personality-Led / Influencer",
    "Merch & Crafts",
    "Expert / Educator",
    "Curator / Publisher (Communities & Lists)",
    "Other",
];

export const DOMAIN_SHARDS = [
    "Hustle & Money (SMEs, Finance, Business)",
    "Style & Gaze (Fashion, Beauty, Design)",
    "Culture & Friction (Pop Culture, Commentary, Issues)",
    "Utility & Tech (Reviews, How-to, Gadgets)",
    "Vitality & Flow (Health, Wellness, Performance)",
    "Leisure & Vibes (Travel, Gaming, Music)",
    "Knowledge & Guidance (Education, Coaching, Expertise)",
    "Home & Life (Parenting, Home Living, Routine)",
    "Meaning & Belief (Faith, Spirituality, Inner Life)",
];

export const ASSET_CLASSES = [
    "Distribution Pipe (TikTok, IG, WhatsApp TV — One-to-Many)",
    "Trust Network (WhatsApp Groups, Gated Circles — Many-to-Many)",
    "Data / Intelligence Vault (Analysts, Research, Insights)",
    "Content Franchise (Recurring Shows, Series)",
    "IP Vault (Music, Catalogues, Formats)",
    "Physical Presence (Events, Activations, IRL Footprint)",
];

export const VALUE_PROPS = [
    "Aesthetics (The Look)",
    "Mood Stimulation",
    "Intel (The News)",
    "The Hit (The Vibe)",
    "Growth (The Skill)",
    "Mirroring (Status Modelling)",
    "Problem Solution / Operational Efficiency",
    "Communal Participation",
];

// ─── 6. AUDIENCE ───────────────────────────────────────────────────────────

export const AUDIENCE_LOCATIONS = ["Global", "Regional", "Local"];

// ─── 7. COLLABORATOR ROLES (FOR PROJECTS) ──────────────────────────────────

export const OPERATIONAL_ROLES = [
    "IP owner",
    "Talent",
    "Operator",
    "Distributor",
    "Analyst",
    "Contributor",
];

// ─── 8. PAST PROJECT ASSET DECLARATION ────────────────────────────────────

export const ASSET_TYPES = [
    "Song",
    "Video",
    "Series",
    "Format",
    "Brand / Channel",
    "Other",
];

export const OWNERSHIP_STAKES = ["100%", "Shared", "Not owned"];

export const RIGHTS_STATUSES = ["Registered", "Unregistered", "Licensed only"];

export const REVENUE_POTENTIALS = ["Yes", "No", "Unknown"];

// ─── 9. PAST PROJECT COMMERCIAL EVIDENCE ──────────────────────────────────

export const REVENUE_SOURCES = [
    "Brand payment",
    "Platform payouts",
    "Licensing",
    "Sponsorship",
    "Sales",
];

export const REVENUE_BANDS = [
    "<$500",
    "$500-$2k",
    "$2k-$10k",
    "$10k+",
];

// ─── 10. PORTFOLIO ROLES & OUTCOMES ───────────────────────────────────────

export const PROJECT_ROLES_INDUSTRY = [
    "Lead Creator",
    "Creative Director",
    "Producer",
    "Editor",
    "Talent / Face",
    "Strategist",
    "Consultant",
];

export const PROJECT_ROLES_BRAND = [
    "The Hero (Main focus)",
    "The Guide (Educational)",
    "The Sidekick (Supporting)",
    "The Villain (Challenger/Contrarian)",
    "The Comedian (Entertainment)",
];

export const OUTCOME_TYPES = [
    "Awareness / Reach",
    "Engagement",
    "Traffic / Clicks",
    "Conversion / Sales",
    "Sentiment Shift",
    "Community Growth",
];

export const MEASUREMENT_SOURCES = [
    "Platform Analytics",
    "Third-party Tools",
    "Brand Provided Data",
    "Survey / Sentiment",
    "Manual Tracking",
];
