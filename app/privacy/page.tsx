import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Paza platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-3xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/" aria-label="Back to home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm text-muted-foreground mb-2">Paza Technologies Ltd.</p>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: [Insert Date] · Jurisdiction: Republic of Kenya
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Paza Technologies Ltd. (&quot;Paza,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates a digital platform that facilitates collaboration between brands and creators. This Privacy Policy explains how we collect, use, store, and protect personal data when you use the Paza platform (&quot;Platform&quot; or &quot;Services&quot;). This policy is designed to comply with the Data Protection Act, 2019 of Kenya. By accessing or using the Platform, you consent to the practices described in this Privacy Policy.
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">Paza Technologies Ltd. is the data controller responsible for personal data processed through the Platform. If you have questions about this Privacy Policy or your personal data, you may contact us at:</p>
            <p className="text-muted-foreground text-sm">Email: <a href="mailto:privacy@paza.ai" className="text-primary hover:underline">privacy@paza.ai</a><br />[Company Address]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">We may collect several categories of information depending on how you interact with the Platform.</p>
            <h3 className="text-base font-medium text-foreground mb-2">2.1 Account Information</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">When you create an account, we may collect: name, email address, phone number, business or brand name, profile information, and account credentials.</p>
            <h3 className="text-base font-medium text-foreground mb-2">2.2 Creator Profile Information</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">Creators may provide additional information including: social media handles, content categories, audience demographics (where available), portfolio content, and links to public profiles.</p>
            <h3 className="text-base font-medium text-foreground mb-2">2.3 Payment Information</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">When transactions occur on the Platform, payment data may be processed through third-party payment providers. This may include: payment account identifiers, mobile money numbers, bank account details, and billing information. Paza does not store full payment card details. Payment processing is handled by licensed payment providers.</p>
            <h3 className="text-base font-medium text-foreground mb-2">2.4 Platform Activity Data</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">We collect information generated through use of the Platform, including: campaign participation, campaign communications, content submissions, verification evidence, transaction history, and interaction logs.</p>
            <h3 className="text-base font-medium text-foreground mb-2">2.5 Publicly Available Information</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">If you provide social media handles or public profile links, we may collect publicly available information associated with those accounts (e.g. follower counts, engagement metrics, public posts, public profile metadata). This information may be used to verify creator profiles or generate platform analytics.</p>
            <h3 className="text-base font-medium text-foreground mb-2">2.6 Technical Data</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">When you access the Platform, we may automatically collect technical information including: IP address, browser type, device type, operating system, usage data, and session logs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Personal Data</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">We use personal data to operate and improve the Platform. Primary purposes include:</p>
            <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-1 mb-2">
              <li><strong>Platform Operation:</strong> creating and managing user accounts, facilitating creator–brand collaborations, enabling communication between users</li>
              <li><strong>Transaction Processing:</strong> processing campaign payments, managing payout processes, preventing fraudulent financial activity</li>
              <li><strong>Campaign Verification:</strong> verifying campaign deliverables, analyzing submitted campaign evidence, resolving disputes between users</li>
              <li><strong>Analytics and Platform Improvement:</strong> generating marketplace insights, improving verification systems, developing analytics tools and scoring systems (analytics may be based on aggregated platform activity)</li>
              <li><strong>Security and Fraud Prevention:</strong> detecting fraud, investigating suspicious activity, protecting platform integrity</li>
              <li><strong>Legal Compliance:</strong> processing where required to comply with applicable laws, regulations, or legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Legal Basis for Processing</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Under applicable data protection laws, Paza may process personal data based on: user consent; performance of a contract; compliance with legal obligations; and legitimate business interests such as fraud prevention or service improvement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Sharing of Personal Data</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">We may share personal data with trusted third parties where necessary to operate the Platform. These may include:</p>
            <ul className="list-disc pl-6 text-muted-foreground text-sm space-y-1">
              <li><strong>Payment Processors:</strong> payment service providers that process transactions (e.g. IntaSend, Paystack, mobile money providers)</li>
              <li><strong>Technology Service Providers:</strong> companies that help operate our infrastructure (e.g. hosting providers, analytics services, cloud infrastructure). These providers process data only on our instructions.</li>
              <li><strong>Legal and Regulatory Authorities:</strong> we may disclose personal data where required by law, court order, or regulatory request.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Security</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">Paza uses commercially reasonable security measures designed to protect personal data from unauthorized access, loss, or misuse. Security measures may include: encryption of sensitive data, access controls, secure data storage, and monitoring for unauthorized activity. However, no online system can guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">We retain personal data only for as long as necessary to: operate the Platform, fulfill contractual obligations, comply with legal and regulatory requirements, and resolve disputes. Retention periods may vary depending on the type of data and legal obligations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. International Data Transfers</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Paza may use service providers located outside Kenya. Where data is transferred internationally, we take reasonable steps to ensure appropriate safeguards are in place to protect personal data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Your Data Protection Rights</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">Depending on applicable law, users may have rights including: the right to access personal data; the right to request correction of inaccurate data; the right to request deletion of personal data; the right to object to certain processing activities; and the right to withdraw consent where processing is based on consent. Requests may be submitted by contacting us using the information provided below.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">The Platform may use cookies or similar technologies to: maintain user sessions, analyze platform usage, and improve platform functionality. Users may control cookie settings through their browser preferences.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">The Platform is not intended for individuals under the age of 18. Paza does not knowingly collect personal data from minors. If we become aware that personal data of a minor has been collected, we will take reasonable steps to delete such information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Third-Party Platforms</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Creators and brands may connect or reference third-party platforms such as social media services. Paza is not responsible for the privacy practices of those platforms. Users should review the privacy policies of third-party services they use.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Paza may update this Privacy Policy periodically to reflect changes in our services or legal requirements. Updated policies will be posted on the Platform with a revised effective date. Continued use of the Platform after updates constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Contact Information</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              For questions regarding this Privacy Policy or personal data requests, contact:<br />
              Paza Technologies Ltd.<br />
              Email: <a href="mailto:privacy@paza.ai" className="text-primary hover:underline">privacy@paza.ai</a><br />
              [Company Address]
            </p>
          </section>
        </article>

        <nav className="mt-12 pt-8 border-t border-border">
          <Link href="/terms" className="text-primary hover:underline text-sm">Terms of Service</Link>
        </nav>
        <div className="mt-4">
          <Button variant="outline" asChild className="border-border">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
