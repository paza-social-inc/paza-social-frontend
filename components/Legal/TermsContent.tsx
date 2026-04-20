import Link from "next/link";

interface TermsContentProps {
  className?: string;
  /** Show compact intro (for modal); if false, full intro with company name */
  compactIntro?: boolean;
}

/** Shared Terms of Service content for modal and /terms page */
export function TermsContent({ className = "", compactIntro }: TermsContentProps) {
  return (
    <div className={className}>
      {!compactIntro && (
        <>
          <p className="text-sm text-muted-foreground mb-2">Paza Technologies Ltd.</p>
          <p className="text-sm text-muted-foreground mb-4">Last updated: [Insert Date] · Governing Law: Republic of Kenya</p>
        </>
      )}
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the platform and services
        provided by Paza Technologies Ltd. (&quot;Paza,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using the Paza
        platform (the &quot;Services&quot;), you agree to be bound by these Terms.
      </p>

      <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 sm:space-y-8">
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">1. Platform Overview</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">Paza operates a digital platform that facilitates the discovery, verification, coordination, and analysis of marketing collaborations between creators and brands.</p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">The Services may include:</p>
          <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-1 mb-3">
            <li>creator discovery and onboarding</li>
            <li>campaign coordination tools</li>
            <li>analytics and performance reporting</li>
            <li>verification of content delivery</li>
            <li>payment facilitation through third-party processors</li>
            <li>marketplace infrastructure connecting brands and creators</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">Paza functions solely as a technology platform and transaction facilitator. Unless explicitly stated otherwise:</p>
          <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-1 mb-2">
            <li>Paza is not an employer of creators.</li>
            <li>Paza is not an advertising agency.</li>
            <li>Paza is not a financial institution or bank.</li>
            <li>Paza is not a party to contracts formed between creators and brands.</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">Creators participating on the platform act as independent contractors. Creators retain full autonomy over how, when, and where they produce content. Paza verifies only whether deliverables satisfy the campaign requirements agreed upon between the parties.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">2. Eligibility</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">You may use the Services only if you:</p>
          <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-1">
            <li>are at least 18 years of age</li>
            <li>have legal authority to enter into binding agreements</li>
            <li>provide accurate registration information</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed mt-3">Paza reserves the right to suspend or terminate accounts providing false or misleading information.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">3. User Accounts</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">Users are responsible for maintaining the confidentiality of account credentials. You agree to: maintain accurate account information; protect login credentials; notify Paza of unauthorized account activity. Paza is not responsible for losses resulting from unauthorized access caused by failure to safeguard account credentials.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">4. Marketplace Transactions</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">The Paza platform enables brands and creators to negotiate and enter campaign collaborations. Campaign agreements may include: content deliverables, distribution channels, timelines, compensation, intellectual property rights, verification requirements. These terms are defined within each campaign brief or agreement. Paza provides infrastructure for coordination but is not a contracting party to the campaign agreement between creators and brands.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">5. Payment Facilitation</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">Creators appoint Paza as a limited payment collection agent for the purpose of receiving payments from brands through licensed third-party payment processors (e.g. IntaSend, Paystack). Once payment is submitted by a brand through the platform, the brand&apos;s payment obligation to the creator is considered satisfied. Funds may be released to creators when campaign deliverables have been verified. Paza may deduct platform fees or commissions disclosed during the transaction. Users are responsible for all applicable taxes.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">6. Platform Fees</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Paza may charge fees including marketplace commissions, payment processing fees, optional premium features, and accelerated payout fees. Fees will be disclosed before transactions are finalized. Paza reserves the right to modify fee structures with reasonable notice.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">7. Verification and Evidence</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Campaign deliverables may be verified using platform records and supporting evidence (content links, screenshots, analytics exports, uploaded files, tracking links or codes, platform interaction logs). Paza may use automated systems and forensic analysis tools to review verification evidence. The platform record of campaign communications and submitted evidence may be used as the primary reference when resolving disputes.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">8. Confidential Proposals</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Creators may submit proposals or campaign ideas to brands through the platform. If a brand chooses to unlock or view a protected proposal, the brand agrees to treat the proposal as confidential and not to use or disclose the concept outside the platform for six (6) months without the creator&apos;s permission. Violation may result in account suspension or other platform action.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">9. Intellectual Property</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Creators retain ownership of their pre-existing intellectual property including personal brand, likeness, voice, and original content. Ownership or licensing rights to campaign deliverables transfer according to the terms defined in the campaign agreement. Paza may display campaign content for purposes including campaign verification, platform reporting, internal analytics, and case studies or promotional materials, unless otherwise restricted in the campaign agreement.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">10. Data and Analytics</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Paza may generate analytics, insights, and performance indicators derived from platform activity. Users grant Paza a non-exclusive license to process and analyze data to operate the Services, improve platform functionality, produce aggregated marketplace insights, and develop verification and scoring systems. Analytics tools are informational only. Paza does not guarantee their accuracy or predictive value. Aggregated analytics may be used by Paza provided that individuals are not identifiable without consent.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">11. Platform Integrity and Fraud Prevention</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">Users may not engage in conduct that undermines the integrity of the platform, including: artificially inflating engagement metrics; purchasing fake followers or engagement; submitting falsified campaign evidence; misrepresenting channel ownership; impersonating other users; circumventing the platform to avoid platform fees. Paza may suspend accounts and temporarily withhold funds while investigating suspected fraud or manipulation.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">12. Content Standards</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Users may not distribute content through the platform that violates applicable laws; contains hate speech or harassment; promotes fraud or deception; infringes intellectual property rights; or contains unlawful or harmful material. Paza reserves the right to remove content or suspend accounts that violate these standards.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">13. Reputation and Creator Conduct</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Brand collaborations facilitated through the platform relate solely to a creator&apos;s professional brand persona and campaign deliverables. Paza does not control or guarantee the personal conduct of creators outside the scope of campaign activities.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">14. Third-Party Services</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">The platform may integrate with or rely upon third-party services including social media platforms, analytics providers, and payment processors. Paza is not responsible for interruptions or inaccuracies caused by changes to third-party services or APIs.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">15. Suspension and Termination</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Paza may suspend or terminate user accounts if it reasonably believes that a user has violated these Terms; has engaged in fraudulent or abusive conduct; or poses a risk to platform integrity. Users may terminate their accounts at any time.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">16. Platform Modifications</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Paza may modify, suspend, or discontinue any aspect of the platform or Services at any time. Paza will make reasonable efforts to notify users of material changes where feasible.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">17. Force Majeure</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Paza shall not be liable for delays or failures resulting from events beyond its reasonable control, including but not limited to: natural disasters, government actions, telecommunications failures, and outages of third-party platforms or services.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">18. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">The Services are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. Paza does not guarantee: campaign performance, engagement levels, platform availability, or accuracy of third-party data.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">19. Limitation of Liability</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">To the maximum extent permitted by law, Paza shall not be liable for indirect, incidental, or consequential damages including lost profits or business opportunities. Paza&apos;s total liability arising from use of the Services shall not exceed the total platform fees paid to Paza during the preceding twelve (12) months.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">20. Indemnification</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Users agree to indemnify and hold harmless Paza from claims, damages, losses, or legal expenses arising from: their use of the platform; violation of these Terms; or infringement of intellectual property rights.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">21. Dispute Resolution</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">If disputes arise between users, Paza may attempt to facilitate resolution. If disputes cannot be resolved informally, they shall be referred to arbitration under the Arbitration Act, 1995 of Kenya. Arbitration shall take place in Nairobi and proceedings shall be conducted in English.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">22. Governing Law</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">These Terms shall be governed by the laws of the Republic of Kenya.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">23. Changes to the Terms</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Paza may update these Terms from time to time. Updated Terms will be posted on the platform with a revised effective date. Continued use of the Services constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">24. Contact Information</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Paza Technologies Ltd.<br />
            Email: <a href="mailto:legal@paza.ai" className="text-primary hover:underline">legal@paza.ai</a><br />
            [Business Address]
          </p>
        </section>
      </article>
    </div>
  );
}
