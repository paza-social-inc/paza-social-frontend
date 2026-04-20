import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Payment Terms",
  description: "Payment Terms for the Paza platform.",
};

export default function PaymentTermsPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-3xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/terms" aria-label="Back to Terms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Payment Terms</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm text-muted-foreground mb-8">
          Paza Technologies Ltd. · Last updated: [Insert Date] · Governing Law: Republic of Kenya
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          These Payment Terms (&quot;Payment Terms&quot;) govern financial transactions conducted through the Paza platform (&quot;Platform&quot;) operated by Paza Technologies Ltd. These Payment Terms form part of the Paza Terms of Service and apply to all users including creators and brands. By using the Platform to send or receive payments, you agree to these Payment Terms.
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          {[
            { title: "1. Role of Paza in Payments", body: "Paza provides payment facilitation infrastructure that enables brands to pay creators for campaign deliverables. Paza acts solely as a limited payment collection agent for creators for the purpose of receiving payments from brands through licensed third-party payment processors. Paza is not a bank, deposit-taking institution, or financial services provider. Payments processed through the Platform are handled by third-party payment processors." },
            { title: "2. Payment Process", body: "Payments on the Platform generally follow this process: (1) A Brand agrees to compensate a Creator for campaign deliverables. (2) The Brand submits payment through the Platform. (3) Payment is processed by a licensed payment processor. (4) Funds are held in a transaction or settlement account controlled by the payment processor. (5) After campaign deliverables are verified, payment is released to the Creator. The specific payment schedule may vary depending on the campaign agreement." },
            { title: "3. Payment Processors", body: "Paza may integrate with licensed payment service providers including but not limited to: IntaSend, Paystack, mobile money providers, and banking partners. Payments are subject to the terms and policies of the relevant payment processor. Paza is not responsible for delays, errors, or outages caused by payment processors." },
            { title: "4. Settlement of Brand Payment Obligations", body: "When a Brand submits payment through the Platform, the Brand's payment obligation to the Creator is considered satisfied. Creators acknowledge that their right to receive funds is against Paza as the designated payment collection agent, subject to campaign verification and applicable platform policies." },
            { title: "5. Release of Funds", body: "Payments to Creators may be released after: campaign deliverables have been submitted, verification evidence has been reviewed, and campaign completion is confirmed according to the campaign terms. Paza may temporarily delay payment release if verification or dispute processes are ongoing." },
            { title: "6. Platform Fees", body: "Paza may charge fees for use of the Platform including but not limited to: marketplace commissions, transaction processing fees, optional premium features, and expedited payout fees. Applicable fees will be disclosed before a transaction is completed. Paza reserves the right to modify its fee structure with reasonable notice." },
            { title: "7. Expedited or Instant Payouts", body: "Where available, creators may request expedited payout services. Expedited payouts may be subject to additional service fees. Availability of expedited payouts may depend on payment processor capabilities and risk review." },
            { title: "8. Refunds and Chargebacks", body: "Refunds may occur in circumstances including: campaign cancellation before deliverables are completed, failure of the creator to deliver agreed campaign content, or mutual agreement between the brand and creator. If a payment processor reverses a transaction or issues a chargeback, Paza may recover the corresponding amount from the recipient where permitted by law." },
            { title: "9. Fraud Prevention and Payment Holds", body: "Paza may temporarily hold or delay payments if there is a reasonable belief that a transaction involves: fraudulent activity, artificial engagement manipulation, misrepresentation of campaign completion, or violation of platform policies. Paza may conduct investigations to verify the legitimacy of transactions. Payments may be withheld during investigations where permitted by law." },
            { title: "10. Currency and Conversion", body: "Payments may be processed in currencies supported by the relevant payment processor. Currency conversion rates may be determined by the payment processor or financial institution handling the transaction. Paza is not responsible for exchange rate fluctuations or conversion fees." },
            { title: "11. Taxes", body: "Users are solely responsible for determining and fulfilling their tax obligations arising from transactions conducted through the Platform. Paza does not provide tax advice and is not responsible for collecting or remitting taxes unless required by law. Creators are responsible for reporting income received through the Platform to relevant tax authorities." },
            { title: "12. Payment Errors", body: "Users must promptly notify Paza if they believe a payment was: processed incorrectly, sent to the wrong recipient, duplicated, or otherwise inaccurate. Paza will make reasonable efforts to assist in resolving payment errors but cannot guarantee recovery of funds once payments are processed." },
            { title: "13. Restricted Transactions", body: "The Platform may not be used for transactions involving: illegal goods or services, fraudulent schemes, money laundering or financial misconduct, or activities prohibited by applicable law. Paza may suspend accounts and cancel transactions that violate these restrictions." },
            { title: "14. Account Verification", body: "Paza or its payment processors may require identity verification or additional documentation before processing certain payments. Verification requirements may include: identity documents, proof of ownership of payment accounts, and business registration documents. Failure to complete required verification may result in payment delays or account restrictions." },
            { title: "15. Suspension of Payment Services", body: "Paza may suspend payment functionality for users if it reasonably believes that a user has: violated platform policies, engaged in suspicious financial activity, or attempted to circumvent payment controls. Such actions may occur without prior notice where necessary to protect the platform." },
            { title: "16. Limitation of Liability", body: "To the maximum extent permitted by law, Paza shall not be liable for: delays caused by payment processors, banking system failures, currency fluctuations, or unauthorized access caused by user negligence. Paza's total liability related to payment processing shall not exceed the platform fees paid to Paza in connection with the relevant transaction." },
            { title: "17. Dispute Resolution", body: "Payment disputes between users may first be reviewed through Paza's internal dispute resolution processes. If disputes cannot be resolved informally, they shall be referred to arbitration under the Arbitration Act, 1995 of Kenya. Arbitration shall take place in Nairobi and proceedings shall be conducted in English." },
            { title: "18. Governing Law", body: "These Payment Terms are governed by the laws of the Republic of Kenya." },
            { title: "19. Changes to Payment Terms", body: "Paza may update these Payment Terms periodically. Updated terms will be published on the Platform with a revised effective date. Continued use of the Platform after updates constitutes acceptance of the revised Payment Terms." },
            { title: "20. Contact Information", body: "Paza Technologies Ltd. Email: legal@paza.ai [Business Address]" },
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
