import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Brand Agreement",
  description: "Brand Agreement for the Paza platform.",
};

export default function BrandAgreementPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-3xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/terms" aria-label="Back to Terms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Brand Agreement</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm text-muted-foreground mb-8">
          Paza Technologies Ltd. · Last updated: [Insert Date] · Governing Law: Republic of Kenya
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          This Brand Agreement (&quot;Agreement&quot;) governs participation by businesses, organizations, or individuals (&quot;Brand,&quot; &quot;you,&quot; or &quot;your&quot;) who use the Paza platform (&quot;Platform&quot;) operated by Paza Technologies Ltd. By creating a brand account, submitting a campaign, or engaging creators through the Platform, you agree to this Agreement and the Paza Terms of Service.
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          {[
            { title: "1. Purpose of the Platform", body: "Paza provides a digital marketplace that enables brands to collaborate with creators for marketing campaigns. The Platform may provide tools for: discovering creators, publishing campaign briefs, coordinating campaign deliverables, verifying content distribution, facilitating payments through third-party processors, and generating campaign analytics. Paza acts solely as a technology platform and marketplace facilitator. Paza is not an advertising agency, talent agency, employer, or legal representative of creators or brands. Campaign agreements are formed between the Brand and the Creator." },
            { title: "2. Brand Eligibility", body: "To participate as a Brand you must: be at least 18 years of age, have legal authority to represent your business or organisation, provide accurate account and billing information, and comply with applicable laws and advertising regulations. Paza may suspend accounts that provide false or misleading information." },
            { title: "3. Campaign Creation", body: "Brands may create campaigns specifying: campaign objectives, content requirements, deliverables, distribution channels, messaging guidelines, deadlines, compensation terms, and content usage rights. Campaign details are defined in the campaign brief and form the basis of the agreement between the Brand and the Creator." },
            { title: "4. Creator Selection", body: "Brands may review creator profiles and invite creators to participate in campaigns. Creators operate as independent contractors and are not employees or agents of Paza. The Brand is responsible for selecting creators appropriate for its campaign objectives. Paza does not guarantee creator performance, audience reach, or engagement levels." },
            { title: "5. Confidential Proposals", body: "Creators may submit campaign proposals or creative concepts through the Platform. If a Brand chooses to unlock or view a protected proposal, the Brand agrees: to treat the proposal as confidential, and not to use or disclose the concept outside the Platform without the Creator's consent for six (6) months. Violation of this obligation may result in account suspension or other platform enforcement actions." },
            { title: "6. Payment Obligations", body: "Brands are responsible for funding campaigns according to the compensation terms defined in the campaign brief. Creators appoint Paza as a limited payment collection agent for the purpose of receiving payments from Brands through licensed third-party payment processors. Payments may be processed through providers including but not limited to: IntaSend, Paystack, mobile money services, and bank transfers. Once payment is submitted through the Platform, the Brand's payment obligation to the Creator is considered satisfied. Payments may be released to the Creator after campaign deliverables have been verified according to the campaign requirements. Paza may deduct platform fees disclosed during the transaction." },
            { title: "7. Campaign Verification", body: "Creators may submit verification evidence including: links to published content, screenshots, analytics exports, timestamps or platform records, and tracking links or codes. Paza may use automated systems and forensic analysis tools to review campaign evidence. These tools assist in determining whether deliverables have been completed according to the campaign terms. The platform record of campaign communications and submitted evidence may be used as the primary reference in resolving disputes." },
            { title: "8. Intellectual Property and Content Rights", body: "Creators retain ownership of their pre-existing intellectual property including their personal brand, likeness, voice, and previously created content. Ownership or licensing rights to campaign deliverables transfer according to the terms defined in the campaign brief. Unless otherwise specified in the campaign agreement, creators grant the Brand a license to use campaign deliverables for the promotional purposes defined in the campaign brief. Brands may not use creator content beyond the agreed scope without additional permission." },
            { title: "9. Content Responsibility", body: "Brands are responsible for ensuring that campaign messaging complies with applicable laws and advertising regulations. Brands may not require creators to publish content that: violates applicable laws, promotes illegal activities, contains deceptive advertising, infringes intellectual property rights, or contains abusive or discriminatory material. Paza reserves the right to reject or remove campaigns that violate platform policies." },
            { title: "10. Platform Integrity", body: "Brands may not engage in conduct that undermines the integrity of the platform, including: circumventing the platform to complete transactions off-platform, misrepresenting campaign requirements, submitting fraudulent verification disputes, or engaging in harassment or abusive conduct toward creators. If a Brand attempts to circumvent the platform to avoid service fees, Paza may take enforcement actions including account suspension." },
            { title: "11. Data and Analytics", body: "Paza may provide campaign analytics and performance insights. Analytics, rankings, and performance indicators are informational tools only. Paza does not guarantee the accuracy, completeness, or predictive value of analytics or campaign insights. Users grant Paza a non-exclusive license to process and analyze platform activity for purposes including: operating the platform, improving services, and generating aggregated marketplace insights. Aggregated analytics may be used by Paza provided individuals are not identifiable without consent." },
            { title: "12. Creator Conduct and Reputation", body: "Brand collaborations facilitated through the Platform relate solely to the creator's professional brand persona and campaign deliverables. Paza does not control or guarantee the personal conduct of creators outside the scope of campaign activities. Brands acknowledge that creators are independent individuals whose conduct may change over time." },
            { title: "13. Third-Party Services", body: "The Platform may integrate with or rely on third-party services including: social media platforms, analytics providers, and payment processors. Paza is not responsible for disruptions caused by changes to these third-party services." },
            { title: "14. Account Suspension and Termination", body: "Paza may suspend or terminate Brand accounts if it reasonably believes that the Brand: violated this Agreement or the Terms of Service, engaged in fraudulent or abusive conduct, attempted to manipulate campaign verification, or threatened the integrity of the platform. Brands may terminate their account at any time. Termination may affect participation in ongoing campaigns." },
            { title: "15. Force Majeure", body: "Paza shall not be liable for delays or failures resulting from events beyond its reasonable control including: natural disasters, telecommunications failures, outages of third-party services, or regulatory changes." },
            { title: "16. Disclaimer of Warranties", body: "The Platform and Services are provided on an \"as-is\" and \"as-available\" basis. Paza does not guarantee: campaign performance, audience engagement levels, creator availability, or uninterrupted platform access." },
            { title: "17. Limitation of Liability", body: "To the maximum extent permitted by law, Paza shall not be liable for indirect, incidental, or consequential damages including lost profits or lost marketing opportunities. Paza's total liability arising from use of the Platform shall not exceed the total platform fees paid to Paza during the preceding twelve (12) months." },
            { title: "18. Indemnification", body: "Brands agree to indemnify and hold harmless Paza from claims, damages, losses, or legal expenses arising from: campaign messaging provided by the Brand, violation of advertising laws, infringement of third-party rights, or misuse of creator content." },
            { title: "19. Dispute Resolution", body: "If disputes arise between Brands and Creators, Paza may attempt to facilitate resolution using platform records and submitted verification evidence. If disputes cannot be resolved informally, they shall be referred to arbitration under the Arbitration Act, 1995 of Kenya. Arbitration shall take place in Nairobi and proceedings shall be conducted in English." },
            { title: "20. Governing Law", body: "This Agreement shall be governed by the laws of the Republic of Kenya." },
            { title: "21. Changes to the Agreement", body: "Paza may update this Agreement periodically. Continued use of the Platform after updates constitutes acceptance of the revised Agreement." },
            { title: "22. Contact Information", body: "Paza Technologies Ltd. Email: legal@paza.ai [Business Address]" },
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
