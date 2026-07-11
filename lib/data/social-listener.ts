import { SocialListeningReport } from '@/types/social-listener';

export const mockReport: SocialListeningReport = {
  id: 'report_001',
  query: 'Nuvita Baby Cereal',
  timestamp: new Date().toISOString(),
  creators: [
    {
      id: 'creator_001',
      name: 'Healthy Mum KE',
      handle: '@healthymumke',
      platform: 'TikTok',
      profile_url: 'https://tiktok.com/@healthymumke',
      confidence_score: 0.94,
      summary: {
        why_selected: 'This creator consistently educates first-time parents about introducing solid foods, infant nutrition, and digestive health. Their audience actively seeks advice before making purchasing decisions.'
      },
      audience: { primary: ['First-time parents', 'Mothers with children under 2'], secondary: ['Caregivers'] },
      conversation_alignment: ['Baby weaning', 'Infant nutrition', 'Digestive health', 'First foods', 'Feeding routines'],
      evidence: [
        { type: 'content', text: '5 cereals I recommend for babies starting solids.', date: '2026-06-14' },
        { type: 'comment', text: 'Which one is best if my baby gets constipated?', date: '2026-06-16' },
        { type: 'comment', text: 'Can I start this at six months?', date: '2026-06-20' }
      ],
      content_style: ['Educational', 'Demonstration', 'Q&A', 'Personal Experience'],
      related_communities: [{ name: 'r/NewParents', platform: 'Reddit' }, { name: 'Parenting Facebook Groups', platform: 'Facebook' }],
      similar_creators: ['@babynutritionguide', '@mumknowsbest', '@healthykidstoday'],
      signals: {
        audience_match: 0.96,
        topic_match: 0.94,
        community_presence: 0.91,
        content_relevance: 0.97,
        brand_safety: 0.89,
        overall_score: 0.94
      },
      paza_insight: { text: 'Selected because the creator consistently participates in conversations around infant digestion, first foods, and feeding guidance. The recommendation is based on audience relevance and observed demand signals rather than follower count.' }
    }
    // Add a second creator if you want; I'll keep one for brevity.
  ],
  communities: [
    {
      id: 'comm_001',
      name: 'r/NewParents',
      platform: 'Reddit',
      activity_level: 'High',
      confidence: 0.96,
      summary: { why_selected: 'One of the most active communities where first-time parents seek advice on infant nutrition, feeding routines, and baby products.' },
      members: ['First-time parents', 'Expecting parents', 'Caregivers'],
      interests: ['Baby weaning', 'Infant nutrition', 'Sleep routines', 'Child development'],
      discussion_themes: ['Starting solid foods', 'Baby constipation', 'Iron-rich foods', 'Homemade vs packaged baby food', 'Ingredient safety'],
      evidence: [
        { type: 'discussion', text: 'What cereal worked best when your baby started solids?', date: '2026-06-25' },
        { type: 'discussion', text: "Looking for something that doesn't cause constipation.", date: '2026-06-26' },
        { type: 'discussion', text: 'Has anyone tried Nuvita?', date: '2026-06-27' }
      ],
      characteristics: [
        'Members ask detailed questions before buying',
        'Recommendations from other parents carry more weight than ads',
        'Educational content receives highest engagement'
      ],
      related_creators: ['@healthymumke', '@babynutritionguide'],
      similar_communities: ['r/BeyondTheBump', 'BabyCentre Community'],
      paza_insight: { text: 'High-value source of purchase intent and product feedback. Brands succeed by contributing educational content that answers common questions.' }
    }
  ],
  audience: {
    id: 'aud_001',
    name: 'First-Time Parents',
    confidence: 0.97,
    overview: 'Navigating the transition to solid foods for the first time. They seek trusted guidance before making purchasing decisions.',
    who_they_are: { life_stage: 'Parents with babies 4–12 months', primary_decision_maker: 'Mothers', others: ['Fathers', 'Caregivers', 'Grandparents'] },
    priorities: ['Safe first foods', 'Gentle digestion', 'Healthy growth', 'Ingredient quality'],
    common_questions: [
      'Which cereal should I start with?',
      'How do I know if my baby is ready for solids?',
      'Which products are gentle on digestion?',
      'How much should my baby eat?'
    ],
    challenges: ['Fear of making the wrong choice', 'Conflicting advice online', 'Digestive concerns', 'Difficulty comparing products'],
    buying_drivers: ['Recommendations from other parents', 'Educational content', 'Healthcare advice', 'Ingredient transparency'],
    platforms: ['TikTok', 'Instagram', 'Reddit', 'Facebook Groups', 'YouTube'],
    trusted_sources: ['Parenting creators', 'Pediatricians', 'Nutrition experts', 'Parenting communities'],
    language: ['First foods', 'Baby-led weaning', 'Gentle on the stomach', 'Iron-rich', 'Organic', 'No added sugar', 'Healthy growth'],
    paza_insight: { text: 'This audience seeks reassurance, not ads. Brands that educate, demonstrate, and answer questions build trust.' }
  },
  demand: [
    {
      topic: 'Digestive Comfort',
      strength: 'High',
      description: 'Parents want cereals that are gentle on babies’ stomachs.',
      evidence: ['"Every cereal we\'ve tried causes constipation."'],
      related_keywords: ['constipation', 'gentle digestion', 'easy to digest'],
      related_products: ['Brand A', 'Brand B'],
      emerging_topics: ['Organic cereals', 'Homemade vs packaged'],
      opportunity: 'Educational content about preventing constipation with cereal choice.',
      paza_insight: { text: 'Address the constipation fear head-on with clear, empathetic information.' }
    },
    {
      topic: 'Starting Solid Foods',
      strength: 'High',
      description: 'Parents are looking for guidance on when and how to introduce solids.',
      evidence: ['"What\'s the best first cereal for a six-month-old?"'],
      related_keywords: ['first foods', 'starting solids', 'baby cereal'],
      related_products: ['Brand C'],
      emerging_topics: ['Baby-led weaning'],
      opportunity: 'Become the go-to resource for first feeding guidance.',
      paza_insight: { text: 'Answer the most common questions before selling the product.' }
    }
  ],
  recommendations: {
    goal: 'Launch Nuvita Baby Cereal to First-Time Parents',
    creators: [
      {
        name: 'Healthy Mum KE',
        handle: '@healthymumke',
        score: 0.96,
        why: 'Strong overlap with first foods and digestion conversations.',
        expected_contribution: ['Educational videos', 'Product demonstrations', 'Parent Q&A']
      },
      {
        name: 'Baby Nutrition Guide',
        handle: '@babynutritionguide',
        score: 0.92,
        why: 'Trusted for evidence-based nutrition advice.',
        expected_contribution: ['Ingredient breakdowns', 'Nutrition explainers']
      }
    ],
    communities: [
      {
        name: 'r/NewParents',
        why: 'Active purchase discussions.',
        recommended_activity: ['Educational AMA', 'Helpful responses', 'Resource sharing']
      }
    ],
    content_themes: ['Choosing a first cereal', 'Preventing constipation', 'Understanding ingredients', 'Feeding schedules'],
    phases: [
      { name: 'Educate', description: 'Build trust with practical guidance.' },
      { name: 'Demonstrate', description: 'Show real product use and preparation.' },
      { name: 'Social Proof', description: 'Share authentic parent experiences.' },
      { name: 'Conversion', description: 'Introduce offers after trust is established.' }
    ],
    risks: ['Avoid overly promotional messaging', 'Don’t make unsupported health claims', 'Be transparent about partnerships'],
    paza_recommendation: 'Prioritize education over promotion. Contribute valuable guidance to existing conversations.'
  }
};