import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy - Call Me AI" },
      {
        name: "description",
        content: "Review the refund policy for Call Me AI subscriptions and billing disputes.",
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
