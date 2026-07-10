import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service - Call Me AI" },
      {
        name: "description",
        content:
          "The terms governing Call Me AI. Built around your privacy and your rights as a user.",
      },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      lastUpdated="July 2026"
      tocLabel="Terms sections"
      intro={
        <>
          <p className="font-medium text-foreground">
            Everything we build starts with your privacy.
          </p>
          <p className="mt-2">
            We collect only what is necessary, never sell your data, and keep you in control at all
            times.
          </p>
        </>
      }
      sections={[
        {
          id: "who-we-are",
          title: "1. Who We Are",
          body: (
            <>
              <p>
                Call Me AI is an AI chat, voice, and image service operated by an individual seller
                in Croatia.
              </p>
              <p className="mt-3">
                Contact:{" "}
                <a href="mailto:support@callme-ai.com" className="underline">
                  support@callme-ai.com
                </a>
              </p>
              <p className="mt-3">
                Payments are handled by LemonSqueezy as Merchant of Record; card data never touches
                our servers.
              </p>
            </>
          ),
        },
        {
          id: "privacy",
          title: "2. Your Privacy Comes First",
          body: (
            <p>
              We collect only what is needed to run the service. The full privacy picture lives in
              our Privacy Policy.
            </p>
          ),
        },
        {
          id: "eligibility",
          title: "3. Who Can Use Call Me AI",
          body: <p>You must be 18 or older and keep your account details accurate and secure.</p>,
        },
        {
          id: "service",
          title: "4. What We Offer",
          body: (
            <p>
              Call Me AI provides AI-generated text, voice, and image interactions on a subscription
              basis. Output may occasionally be imperfect.
            </p>
          ),
        },
        {
          id: "adult-mode",
          title: "5. Adult Topics Mode",
          body: (
            <p>
              Adult Topics Mode is optional and for eligible adults only. It never permits minors,
              non-consensual content, or anything illegal.
            </p>
          ),
        },
        {
          id: "content",
          title: "6. Your Content",
          body: (
            <p>
              Your prompts remain yours. We do not claim ownership over your inputs or creative
              output.
            </p>
          ),
        },
        {
          id: "payments",
          title: "7. Subscriptions &amp; Payments",
          body: (
            <p>
              Billing is recurring through LemonSqueezy. You can manage or cancel anytime through
              your account dashboard.
            </p>
          ),
        },
        {
          id: "withdrawal",
          title: "8. Your Right of Withdrawal",
          body: (
            <p>
              EU consumers keep their withdrawal rights, subject to the immediate-access consent
              used at checkout and the applicable digital-service rules.
            </p>
          ),
        },
        {
          id: "aup",
          title: "9. Acceptable Use",
          body: (
            <p>
              You agree to follow our Acceptable Use Policy. Serious or repeated violations may lead
              to suspension.
            </p>
          ),
        },
        {
          id: "moderation",
          title: "10. Content Moderation",
          body: (
            <p>
              We apply lightweight automated moderation for safety and legal compliance, and we do
              not surveil your chats beyond that purpose.
            </p>
          ),
        },
        {
          id: "liability",
          title: "11. Limitation of Liability",
          body: (
            <p>
              The service is provided as-is, and our liability is limited to the maximum extent
              permitted by Croatian and EU law.
            </p>
          ),
        },
        {
          id: "disputes",
          title: "12. Dispute Resolution",
          body: (
            <p>
              Please contact support first. If needed, disputes are handled under Croatian law and
              EU consumer dispute routes.
            </p>
          ),
        },
        {
          id: "changes",
          title: "13. Changes to These Terms",
          body: (
            <p>
              Material changes are announced in advance. Continued use after the effective date
              means you accept the updated terms.
            </p>
          ),
        },
        {
          id: "contact",
          title: "14. Contact",
          body: (
            <p>
              Questions about these terms:{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
