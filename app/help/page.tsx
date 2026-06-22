import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Help Center",
  description: "PAZA Help Center – support and guidance for using the platform.",
};

export default function HelpPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-3xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/" aria-label="Back to home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">PAZA Help Center</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-muted-foreground text-sm leading-relaxed mb-10">
          Welcome to the PAZA Help Center. This page provides guidance on how to use the platform, manage your account, collaborate with brands and creators, and resolve common issues. PAZA is a marketplace where creators and brands collaborate on marketing campaigns, content distribution, and audience engagement. The Help Center explains how to use the platform effectively and responsibly.
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Getting Started</h2>
            <h3 className="text-base font-medium text-foreground mb-2">Creating an Account</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">To begin using PAZA:</p>
            <ol className="list-decimal pl-6 text-muted-foreground text-sm space-y-1 mb-3">
              <li>Visit the registration page.</li>
              <li>Create an account using your email address.</li>
              <li>Verify your account through the confirmation message sent to your email.</li>
              <li>Complete your profile information.</li>
            </ol>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">Creators may add additional details such as: social media channels, audience categories, content style, and portfolio examples. Brands may add: business name, campaign interests, and marketing objectives. Providing accurate information improves matching and collaboration opportunities.</p>
            <h3 className="text-base font-medium text-foreground mb-2 mt-4">Navigating the Platform</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">The platform may include several main sections: Dashboard (overview of campaigns, proposals, and activity); Campaign Marketplace (discover available collaborations); Creator Profiles (view creator portfolios and audience information); Messages (communicate with collaborators); Analytics (review campaign performance and verification data). Navigation menus allow users to access these sections directly from the main interface.</p>
            <h3 className="text-base font-medium text-foreground mb-2 mt-4">Tips for Successful Collaborations</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">To increase the likelihood of successful partnerships: keep profiles complete and up to date, provide clear campaign expectations, respond to messages promptly, and submit accurate campaign evidence and deliverables. Professional communication helps maintain trust within the marketplace.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Managing Your Account</h2>
            <h3 className="text-base font-medium text-foreground mb-2">Updating Profile Information</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">Users may update account details including: name or brand information, profile description, distribution channels, contact information, and notification preferences. Keeping profiles accurate ensures better campaign matching.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Notifications and Communication Settings</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">Users may manage notification preferences for: campaign invitations, application updates, payment confirmations, and platform announcements. Notification settings can usually be adjusted within the account settings section.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Privacy and Security</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">To protect your account: keep login credentials confidential, use strong passwords, avoid sharing account access with others, and verify communications originating from the platform. For additional information, refer to the <Link href="/privacy" className="text-primary hover:underline">PAZA Privacy Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Campaign Marketplace</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">The campaign marketplace allows creators and brands to discover collaboration opportunities.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Understanding Campaign Listings</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">Campaign listings typically include: campaign objectives, content requirements, target audience, distribution channels, compensation structure, and campaign deadlines. Creators should carefully review campaign requirements before applying.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Applying for Campaigns</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">To apply for a campaign: (1) Open the campaign listing. (2) Review campaign requirements. (3) Submit a proposal or application through the platform. (4) Wait for confirmation or additional communication from the brand. Creators may be asked to provide portfolio examples or audience insights during the application process.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Tracking Application Status</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Application status may include: pending review, accepted, declined, or completed. Users can monitor application updates through their dashboard.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Idea Board</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">The Idea Board allows creators to share marketing concepts, creative ideas, and collaboration proposals with brands.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Purpose of the Idea Board</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">The Idea Board is designed to: present creative campaign concepts, allow brands to explore new marketing ideas, and encourage collaboration between creators and brands. Ideas posted on the board may include campaign strategies, storytelling concepts, or promotional approaches.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Viewing Ideas</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Users may browse ideas to: discover creative concepts, identify collaboration opportunities, and evaluate potential campaign directions. Some proposals may be protected or restricted until unlocked by brands.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Creating and Sharing Ideas</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">Creators may publish ideas on the Idea Board to showcase creative campaign concepts. When submitting ideas: provide a clear title and description, explain the campaign concept and intended audience, outline how the idea would be executed, and include relevant visuals or examples where appropriate. Clear and structured ideas are easier for brands to evaluate.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Collaboration Tools</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">The platform provides tools to support collaboration between users. These may include: messaging systems, proposal submissions, campaign coordination tools, and shared deliverable tracking. Users should maintain professional communication and respect collaboration timelines.</p>
            <h3 className="text-base font-medium text-foreground mb-2 mt-4">Managing Collaborative Projects</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">When participating in campaigns: review campaign deliverables carefully, submit work according to agreed deadlines, and provide verification evidence where required. Proper coordination helps ensure timely payment and successful partnerships.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Payments and Campaign Completion</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Campaign payments are processed through integrated payment providers. Payment release may occur after: campaign deliverables are submitted, verification evidence is reviewed, and campaign completion is confirmed. Payment timing may vary depending on campaign terms and verification requirements. For more details, refer to the <Link href="/terms/payments" className="text-primary hover:underline">PAZA Payment Terms</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Troubleshooting</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">Users may occasionally experience technical or account-related issues. Common troubleshooting steps include: refreshing the browser or application, confirming login credentials, verifying internet connectivity, and checking notification settings. If problems persist, contact support.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Reporting Issues</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Users may report concerns including: technical platform problems, suspected fraudulent campaigns, intellectual property violations, and abusive or inappropriate behaviour. Reports help maintain a safe and trustworthy marketplace.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contacting Support</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">If you cannot find the information you need in the Help Center, contact the PAZA support team. Support may assist with: account issues, campaign questions, payment inquiries, and platform technical problems.</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <strong>Support contact:</strong><br />
              Email: <a href="mailto:support@paza.ai" className="text-primary hover:underline">support@paza.ai</a><br />
              Nairobi, Kenya
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Updates to the Help Center</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">The Help Center may be updated periodically as the platform evolves. Updated guidance will be published to reflect new features, policies, and platform improvements. Users are encouraged to review the Help Center periodically for the latest information.</p>
          </section>
        </article>

        <p className="text-muted-foreground text-sm leading-relaxed mt-10 pt-8 border-t border-border">
          This Help Center provides general guidance for using the PAZA platform. Detailed legal rights and obligations are defined in the platform&apos;s <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>, <Link href="/terms/creator" className="text-primary hover:underline">Creator Agreement</Link>, <Link href="/terms/brand" className="text-primary hover:underline">Brand Agreement</Link>, <Link href="/terms/payments" className="text-primary hover:underline">Payment Terms</Link>, <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and <Link href="/terms/community" className="text-primary hover:underline">Community Standards</Link>.
        </p>

        <div className="mt-8">
          <Button variant="outline" asChild className="border-border">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
