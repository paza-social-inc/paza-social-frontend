import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Creator Agreement",
  description: "Creator Agreement for the Paza platform.",
};

export default function CreatorAgreementPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-3xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/terms" aria-label="Back to Terms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Creator Agreement</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm text-muted-foreground mb-8">
          Paza Technologies Ltd. · Last updated: [Insert Date] · Governing Law: Republic of Kenya
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          This Creator Agreement (&quot;Agreement&quot;) governs participation by creators who use the Paza platform (&quot;Platform&quot;) operated by Paza Technologies Ltd. (&quot;Paza,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By registering as a creator or participating in campaigns through the Platform, you (&quot;Creator,&quot; &quot;you,&quot; or &quot;your&quot;) agree to be bound by this Agreement and the Paza Terms of Service.
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          {[
            { title: "1. Purpose of the Platform", body: "Paza operates a digital marketplace that enables creators to collaborate with brands on marketing campaigns. The Platform may provide tools for: campaign discovery and participation, campaign coordination and messaging, analytics and performance reporting, verification of campaign deliverables, and payment facilitation through third-party processors. Paza acts solely as a technology platform and marketplace facilitator. Paza is not your employer, agent, or manager." },
            { title: "2. Independent Contractor Status", body: "Creators participate on the Platform as independent contractors. They have no authority to bind Paza to any obligation. Nothing in this Agreement creates: an employment relationship, a joint venture, a partnership, or an agency relationship between Paza and the Creator. Creators retain full control over how content is produced, when work is performed, and where content is distributed. Paza only verifies whether campaign deliverables meet the requirements specified in the campaign brief. Creators are solely responsible for all applicable taxes, insurance, and regulatory obligations arising from their activities." },
            { title: "3. Creator Eligibility", body: "To participate as a creator you must: be at least 18 years of age, have the legal authority to enter contracts, provide accurate registration information, and have legitimate control of the channels you represent. Paza may request verification of channel ownership or identity at any time. Providing false information may result in account suspension or termination." },
            { title: "4. Creator Channels", body: "Creators may promote campaigns through distribution channels including but not limited to: social media accounts, messaging groups, websites or blogs, newsletters, podcasts or video platforms. Creators represent that they have lawful authority to publish content through the channels listed in their profile. Creators may not misrepresent audience size, engagement metrics, or channel ownership." },
            { title: "5. Campaign Participation", body: "Campaigns on the Platform may include specific terms such as: content format or deliverables, distribution channels, posting deadlines, messaging requirements, usage rights, and compensation. Creators agree to complete campaign deliverables according to the terms specified in the campaign brief. Creators retain creative control over how content is produced unless specific content elements are defined within the campaign agreement." },
            { title: "6. Verification of Deliverables", body: "Campaign completion may require submission of verification materials including: links to published content, screenshots, analytics exports, uploaded media files, tracking links or redemption codes, and timestamps or platform records. Paza may use automated systems and forensic analysis tools to review campaign evidence. These tools assist in determining whether campaign deliverables have been fulfilled. Paza may conduct additional reviews where necessary to confirm compliance with campaign requirements." },
            { title: "7. Payment Terms", body: "Creators appoint Paza as a limited payment collection agent for the purpose of receiving payments from brands through licensed third-party payment processors. Once a brand submits payment through the Platform, the brand's payment obligation to the creator is considered satisfied. Payments to creators may occur after: campaign deliverables are completed, verification materials are submitted, and campaign completion is confirmed. Payments may be made through payment processors including but not limited to: IntaSend, Paystack, mobile money services, and bank transfers. Paza may deduct applicable platform fees disclosed during the transaction. Creators are responsible for declaring and paying all applicable taxes." },
            { title: "8. Fraud Prevention and Investigations", body: "Creators may not engage in fraudulent conduct including: purchasing fake followers or engagement, using bots or automated engagement manipulation, falsifying campaign verification evidence, misrepresenting channel ownership, or coordinating artificial engagement networks. If fraud or manipulation is suspected, Paza may: suspend the creator's account, temporarily withhold payments, and conduct investigations of campaign activity. Paza may take enforcement actions if violations are confirmed." },
            { title: "9. Intellectual Property", body: "Creators retain ownership of their pre-existing intellectual property including: their personal brand, likeness and identity, voice and creative style, and previously created content. Campaign deliverables created for a brand may be subject to ownership transfer or licensing rights according to the campaign agreement. Unless otherwise specified in the campaign terms, creators grant the brand a license to use the campaign deliverable for the agreed promotional purpose. Creators must ensure that submitted content does not infringe the intellectual property rights of third parties." },
            { title: "10. Platform Content License", body: "Creators grant Paza a non-exclusive, royalty-free license to display and use campaign content for purposes including: campaign verification, analytics and reporting, internal platform operations, and promotional case studies. This license does not transfer ownership of the creator's intellectual property." },
            { title: "11. Advertising Compliance", body: "Creators must comply with all applicable advertising laws and platform policies, including disclosure requirements for sponsored content. Creators agree to disclose paid partnerships where required by law or platform rules." },
            { title: "12. Content Standards", body: "Creators may not publish campaign content that: violates applicable laws, contains hate speech or harassment, promotes fraudulent or deceptive practices, infringes intellectual property rights, or contains harmful or unlawful material. Paza may remove content or suspend creators who violate these standards." },
            { title: "13. Reputation and Personal Conduct", body: "Brand collaborations relate to a creator's professional brand persona and campaign deliverables. Paza does not control or guarantee a creator's personal conduct outside the scope of campaign activities. Creators acknowledge that their public conduct may affect brand partnerships on the Platform." },
            { title: "14. Account Suspension and Termination", body: "Paza may suspend or terminate creator accounts if it reasonably believes the creator: violated this Agreement or the Terms of Service, engaged in fraudulent or abusive conduct, misrepresented channel ownership or metrics, or threatens the integrity of the platform. Creators may terminate their account at any time. Termination may affect eligibility for future campaigns." },
            { title: "15. Platform Data and Analytics", body: "Creators acknowledge that Paza may analyze aggregated platform activity to: improve platform services, generate marketplace insights, and develop verification and scoring systems. Analytics tools and audience insights provided by the Platform are informational tools and do not guarantee campaign outcomes." },
            { title: "16. Third-Party Platforms", body: "Creators often distribute content through third-party platforms including social media services. Paza is not responsible for actions taken by these platforms, including: account suspensions, algorithm changes, API restrictions, or service outages. Creators must comply with the rules of any platform they use." },
            { title: "17. Limitation of Liability", body: "To the maximum extent permitted by law, Paza shall not be liable for indirect, incidental, or consequential damages arising from participation in campaigns. Paza's total liability shall not exceed the platform fees paid to Paza in connection with the relevant transaction during the preceding twelve months." },
            { title: "18. Indemnification", body: "Creators agree to indemnify and hold harmless Paza from claims, damages, or legal expenses arising from: violation of this Agreement, infringement of third-party rights, or unlawful or misleading content distributed by the creator." },
            { title: "19. Force Majeure", body: "Paza shall not be liable for delays or failures resulting from events beyond its reasonable control including: natural disasters, telecommunications failures, outages of third-party platforms, or government actions or regulatory changes." },
            { title: "20. Dispute Resolution", body: "Disputes related to campaigns may first be reviewed by Paza using platform records and submitted evidence. If disputes cannot be resolved informally, they shall be referred to arbitration under the Arbitration Act, 1995 of Kenya. Arbitration shall take place in Nairobi and proceedings shall be conducted in English." },
            { title: "21. Governing Law", body: "This Agreement shall be governed by the laws of the Republic of Kenya." },
            { title: "22. Changes to the Agreement", body: "Paza may update this Agreement from time to time. Continued use of the Platform after updates constitutes acceptance of the revised Agreement." },
            { title: "23. Contact Information", body: "Paza Technologies Ltd. Email: legal@paza.ai [Business Address]" },
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
