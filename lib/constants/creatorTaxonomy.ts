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
    { value: "Fixed schedule", label: "Fixed schedule – Full-time, set hours" },
    { value: "Flexible hours", label: "Flexible hours – Part-time, rotating shifts" },
    { value: "Project-Based", label: "Project-Based: Task-specific engagement" },
    { value: "Hybrid", label: "Hybrid: Mix of fixed and flexible" },
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
    { value: "Hustle & Money", label: "Hustle & Money (SMEs, Finance, Business)" },
    { value: "Style & Gaze", label: "Style & Gaze (Fashion, Beauty, Design)" },
    { value: "Culture & Friction", label: "Culture & Friction (Pop Culture, Commentary, Issues)" },
    { value: "Utility & Tech", label: "Utility & Tech (Reviews, How-to, Gadgets)" },
    { value: "Vitality & Flow", label: "Vitality & Flow (Health, Wellness, Performance)" },
    { value: "Leisure & Vibes", label: "Leisure & Vibes (Travel, Gaming, Music)" },
    { value: "Knowledge & Guidance", label: "Knowledge & Guidance (Education, Coaching, Expertise)" },
    { value: "Home & Life", label: "Home & Life (Parenting, Home Living, Routine)" },
    { value: "Meaning & Belief", label: "Meaning & Belief (Faith, Spirituality, Inner Life)" },
];

export const ASSET_CLASSES = [
    { value: "Distribution Pipe", label: "Distribution Pipe (TikTok, IG, WhatsApp TV — One-to-Many)" },
    { value: "Trust Network", label: "Trust Network (WhatsApp Groups, Gated Circles — Many-to-Many)" },
    { value: "Data / Intelligence Vault", label: "Data / Intelligence Vault (Analysts, Research, Insights)" },
    { value: "Content Franchise", label: "Content Franchise (Recurring Shows, Series)" },
    { value: "IP Vault", label: "IP Vault (Music, Catalogues, Formats)" },
    { value: "Physical Presence", label: "Physical Presence (Events, Activations, IRL Footprint)" },
];

export const VALUE_PROPS = [
    { value: "Aesthetics", label: "Aesthetics (The Look)" },
    { value: "Mood Stimulation", label: "Mood Stimulation" },
    { value: "Intel", label: "Intel (The News)" },
    { value: "The Hit", label: "The Hit (The Vibe)" },
    { value: "Growth", label: "Growth (The Skill)" },
    { value: "Mirroring", label: "Mirroring (Status Modelling)" },
    { value: "Problem Solution / Operational Efficiency", label: "Problem Solution / Operational Efficiency" },
    { value: "Communal Participation", label: "Communal Participation" },
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
