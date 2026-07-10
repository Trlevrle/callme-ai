import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy - Call Me AI" },
      {
        name: "description",
        content:
          "Fair, transparent, no surprises. Read the Call Me AI refund policy and your EU consumer rights.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Refund Policy
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm text-foreground/80">
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
            <p className="font-medium text-foreground">Fair, transparent, no surprises.</p>
            <p className="mt-2">
              Your satisfaction matters. So do your rights as a consumer under EU and Croatian law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">
              1. Your 14-Day Right of Withdrawal
            </h2>
            <p className="mt-2">
              Under EU consumer protection law, you have the right to withdraw from any digital
              purchase within 14 days &mdash; no questions asked.
            </p>
            <p className="mt-2">
              Because Call Me AI is a digital service that begins immediately upon subscription, we
              ask for explicit consent to immediate access at checkout. By confirming, you
              acknowledge that you gain instant access to all features and waive the 14-day
              withdrawal right for the current billing period, as permitted under EU Directive
              2011/83/EU, Article 16(m).
            </p>
            <p className="mt-2">
              This waiver applies only to the current billing period. You may cancel future renewals
              at any time. If you did not use the service after purchase, you retain your full
              14-day right &mdash; contact us and we&rsquo;ll process it promptly.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">2. When We&rsquo;ll Refund You</h2>
            <p className="mt-2">
              Even outside the withdrawal period, we will gladly consider refunds for:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Technical issues that prevented you from using the service</li>
              <li>Duplicate charges or billing errors</li>
              <li>Service materially not as described</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">3. Cancellation</h2>
            <p className="mt-2">
              You can cancel your subscription at any time through your account settings &mdash; no
              email required. After cancellation, you keep access until the end of your current
              billing period. No further charges occur. No partial refund is issued for unused time
              in the current period (unless eligible under Sections 1&ndash;2 above).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">4. How to Request a Refund</h2>
            <p className="mt-2">
              Email{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>{" "}
              with your account email, date of purchase, and a brief description of the issue. We
              aim to respond within 48 hours and process approved refunds within 5&ndash;10 business
              days through LemonSqueezy to your original payment method.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">5. Disputes</h2>
            <p className="mt-2">
              If you&rsquo;re unsatisfied with our decision, you may request a second review or use
              the EU Online Dispute Resolution platform at{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Our goal is for you to feel treated fairly.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">6. Your Data After a Refund</h2>
            <p className="mt-2">
              If your account is closed following a refund, your data is handled per our{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              &mdash; deleted from active systems within 30 days and from backups within 90 days.
              Your privacy is protected regardless of subscription status.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

function RefundPolicyPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Refund Policy
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: July 2026</p>

        <div className="mt-8 space-y-5 text-sm text-foreground/80">
          <h2 className="font-serif text-xl text-foreground">1. Subscription Charges</h2>
          <p>
            Subscription charges are billed in advance for each billing cycle by our
            merchant-of-record.
          </p>

          <h2 className="font-serif text-xl text-foreground">2. Cancellation</h2>
          <p>
            You may cancel any time to prevent future renewals. Access remains active through the
            end of the paid period.
          </p>

          <h2 className="font-serif text-xl text-foreground">3. Refund Eligibility</h2>
          <p>
            Refunds are reviewed on a case-by-case basis where required by applicable law, duplicate
            billing, or verified technical failure that prevented service access.
          </p>

          <h2 className="font-serif text-xl text-foreground">4. Non-Refundable Cases</h2>
          <p>
            Partial use of a billing period, failure to cancel before renewal, or policy-violating
            account suspension may be non-refundable unless required by law.
          </p>

          <h2 className="font-serif text-xl text-foreground">5. How to Request a Refund</h2>
          <p>
            Send your request to
            <a href="mailto:billing@callmeai.io" className="ml-1 underline">
              billing@callmeai.io
            </a>
            with your account email and transaction reference.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
