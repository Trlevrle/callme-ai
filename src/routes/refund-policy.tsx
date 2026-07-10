import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal/LegalDocument";

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

export function RefundPolicyPage() {
  return (
    <LegalDocument
      title="Refund Policy"
      lastUpdated="July 2026"
      tocLabel="Refund sections"
      intro={
        <>
          <p className="font-medium text-foreground">Fair, transparent, no surprises.</p>
          <p className="mt-2">
            Your satisfaction matters, and so do your rights as a consumer under EU and Croatian
            law.
          </p>
        </>
      }
      sections={[
        {
          id: "withdrawal",
          title: "1. Your 14-Day Right of Withdrawal",
          body: (
            <>
              <p>
                Under EU consumer protection law, you can withdraw from a digital purchase within 14
                days.
              </p>
              <p className="mt-3">
                Because Call Me AI starts immediately after subscription, checkout asks for explicit
                consent to immediate access. If you do not use the service after purchase, your full
                withdrawal right remains available.
              </p>
            </>
          ),
        },
        {
          id: "refunds",
          title: "2. When We&rsquo;ll Refund You",
          body: (
            <ul className="list-inside list-disc space-y-1">
              <li>Technical issues that prevented use</li>
              <li>Duplicate charges or billing errors</li>
              <li>Service materially not as described</li>
            </ul>
          ),
        },
        {
          id: "cancellation",
          title: "3. Cancellation",
          body: (
            <p>
              You can cancel anytime in your account settings. Access remains active until the end
              of the current billing period.
            </p>
          ),
        },
        {
          id: "request",
          title: "4. How to Request a Refund",
          body: (
            <p>
              Email{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>{" "}
              with your account email, date of purchase, and a short description of the issue. We
              aim to respond within 48 hours.
            </p>
          ),
        },
        {
          id: "disputes",
          title: "5. Disputes",
          body: (
            <p>
              If you are unsatisfied, you may request a second review or use the EU Online Dispute
              Resolution platform at{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
          ),
        },
        {
          id: "data-after-refund",
          title: "6. Your Data After a Refund",
          body: (
            <p>
              If your account closes following a refund, data is handled per our Privacy Policy and
              deleted from active systems within 30 days.
            </p>
          ),
        },
      ]}
    />
  );
}
