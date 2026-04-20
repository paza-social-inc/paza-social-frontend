import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Community Standards",
  description: "Community Standards for the Paza platform.",
};

export default function CommunityStandardsPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-3xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/terms" aria-label="Back to Terms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Community Standards</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm text-muted-foreground mb-8">
          Paza Technologies Ltd. · Last updated: [Insert Date] · Jurisdiction: Republic of Kenya
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          These Community Standards (&quot;Standards&quot;) outline the behavioural expectations for users of the Paza platform (&quot;Platform&quot;) operated by Paza Technologies Ltd. The Platform connects creators and brands to collaborate on marketing campaigns. These Standards are intended to maintain a respectful, safe, and trustworthy marketplace.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          All users must comply with these Standards in addition to the Paza Terms of Service, Creator Agreement, Brand Agreement, Payment Terms, and Privacy Policy. Failure to comply with these Standards may result in content removal, account suspension, or permanent termination.
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          {[
            { title: "1. Purpose of the Community Standards", body: "The Paza platform is designed to facilitate transparent and fair collaboration between creators and brands. These Standards promote: respectful professional interactions, honest representation of audience and performance, lawful and responsible content creation, protection of intellectual property, and prevention of fraud and abuse. All users are expected to contribute to a trustworthy marketplace." },
            { title: "2. Respectful Conduct", body: "Users must treat other participants on the Platform with professionalism and respect. The following behaviour is prohibited: harassment or intimidation, abusive or threatening language, discriminatory conduct, repeated unwanted contact, and attempts to pressure users into off-platform arrangements. Users should communicate professionally during campaign negotiations, campaign execution, and dispute resolution." },
            { title: "3. Hate Speech and Discrimination", body: "Paza does not permit content or conduct that promotes hatred or discrimination against individuals or groups based on characteristics such as: race, ethnicity, nationality, religion, gender, sexual orientation, or disability. Content or campaigns promoting discriminatory narratives may be removed from the Platform." },
            { title: "4. Integrity and Honest Representation", body: "Users must accurately represent themselves and their capabilities. Creators may not: falsify audience size or engagement metrics, purchase fake followers or artificial engagement, impersonate other individuals or brands, or misrepresent ownership of distribution channels. Brands may not: misrepresent campaign terms, falsely dispute completed deliverables, or use misleading or deceptive campaign descriptions. Maintaining marketplace integrity is essential for the platform to function." },
            { title: "5. Authentic Engagement", body: "Creators are expected to promote campaigns in ways that reflect genuine audience engagement. The following activities are prohibited: use of bots or automated engagement systems, participation in engagement manipulation schemes, artificial comment or like exchanges, and deceptive tactics designed to inflate performance metrics. Violation may lead to account suspension or removal from campaigns." },
            { title: "6. Advertising Transparency", body: "Creators must comply with applicable advertising laws and platform policies. Sponsored content should be clearly disclosed when required by law or platform guidelines. Creators should avoid misleading audiences about the nature of brand partnerships." },
            { title: "7. Intellectual Property Respect", body: "Users must respect intellectual property rights. The following activities are prohibited: using copyrighted content without permission, submitting content that infringes trademarks, copying creative concepts without authorisation, and distributing campaign materials outside permitted usage rights. Creators and brands are responsible for ensuring that all campaign content is lawful and properly licensed." },
            { title: "8. Safe and Lawful Content", body: "Users may not distribute content that: promotes illegal activities, contains harmful or dangerous instructions, includes explicit threats of violence, promotes fraudulent schemes, or violates applicable laws. Campaigns that involve unlawful products or services may be removed from the Platform." },
            { title: "9. Protection of Confidential Information", body: "Users may not misuse confidential information obtained through the Platform. This includes: campaign strategies, creative proposals, private communications, and proprietary marketing information. Brands must respect confidentiality obligations when viewing protected creator proposals." },
            { title: "10. Platform Integrity", body: "Users must not attempt to manipulate or exploit the Platform. Prohibited activities include: circumventing the Platform to avoid service fees, interfering with campaign verification systems, submitting fraudulent campaign evidence, and exploiting platform bugs or vulnerabilities. Users should report suspected abuse or security vulnerabilities to Paza." },
            { title: "11. Fraud and Financial Misconduct", body: "The following conduct is prohibited: payment fraud, chargeback abuse, misrepresentation of campaign completion, and attempts to manipulate escrow or payment systems. Paza may investigate suspicious activity and take enforcement actions where necessary." },
            { title: "12. Responsible Campaign Creation", body: "Brands must ensure that campaigns: comply with advertising laws, do not require creators to violate platform rules, and do not promote harmful or deceptive messaging. Campaigns involving unlawful or unethical practices may be rejected or removed." },
            { title: "13. Reporting Violations", body: "Users who encounter behaviour that violates these Standards may report it to Paza. Reports may include: abusive conduct, fraudulent campaigns, intellectual property violations, and harassment or discrimination. Paza may review reported behaviour and take appropriate action." },
            { title: "14. Enforcement Actions", body: "If a user violates these Standards, Paza may take actions including: removing content, issuing warnings, suspending accounts, terminating platform access, and restricting participation in campaigns. Enforcement decisions may be based on the severity and frequency of violations." },
            { title: "15. Changes to Community Standards", body: "Paza may update these Community Standards to reflect changes in platform policies or legal requirements. Updated Standards will be posted on the Platform with a revised effective date. Continued use of the Platform constitutes acceptance of the updated Standards." },
            { title: "16. Contact", body: "If you have questions about these Community Standards or wish to report violations, contact: Paza Technologies Ltd. Email: support@paza.ai [Company Address]" },
          ].map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}
        </article>

        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Button variant="outline" asChild className="border-border">
            <Link href="/terms">Back to Terms of Service</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
