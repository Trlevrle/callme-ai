import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service - Call Me AI" },
      {
        name: "description",
        content: "Read the Terms of Service governing access to Call Me AI.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: July 2026</p>

        <div className="mt-8 space-y-5 text-sm text-foreground/80">
          <h2 className="font-serif text-xl text-foreground">1. Eligibility and Account</h2>
          <p>
            You must be at least 18 years old to use the service. You are responsible for
            maintaining account security and for all activity under your account.
          </p>

          <h2 className="font-serif text-xl text-foreground">2. Service Description</h2>
          <p>
            Call Me AI provides AI-generated conversation through voice and text interfaces. Outputs
            are generated automatically and may be incomplete or inaccurate.
          </p>

          <h2 className="font-serif text-xl text-foreground">3. Acceptable Use</h2>
          <p>
            You must comply with all applicable laws and the
            <a href="/acceptable-use" className="mx-1 underline">
              Acceptable Use Policy
            </a>
            . Prohibited content or abusive behavior may result in suspension or termination.
          </p>

          <h2 className="font-serif text-xl text-foreground">4. Adult Topics Mode</h2>
          <p>
            Adult topics mode is an optional feature for eligible adults and can be enabled or
            disabled by the user at any time. This mode does not authorize illegal content,
            non-consensual content, exploitative content, or any content involving minors. We may
            block requests, limit outputs, or suspend accounts that violate policy.
          </p>

          <h2 className="font-serif text-xl text-foreground">5. Subscriptions and Billing</h2>
          <p>
            Paid features are billed by our merchant-of-record. Subscription renewals continue until
            cancelled. Cancellation applies to future billing cycles.
          </p>

          <h2 className="font-serif text-xl text-foreground">6. Intellectual Property</h2>
          <p>
            The service, software, and branding are owned by Call Me AI and protected by applicable
            intellectual property laws.
          </p>

          <h2 className="font-serif text-xl text-foreground">
            7. Disclaimers and Limitation of Liability
          </h2>
          <p>
            The service is provided on an "as is" and "as available" basis. To the maximum extent
            permitted by law, Call Me AI is not liable for indirect or consequential damages.
          </p>

          <h2 className="font-serif text-xl text-foreground">8. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use after publication of updated
            Terms constitutes acceptance.
          </p>

          <h2 className="font-serif text-xl text-foreground">9. Contact</h2>
          <p>
            Legal inquiries:
            <a href="mailto:hello@callmeai.io" className="ml-1 underline">
              hello@callmeai.io
            </a>
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
