import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

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

function TermsPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm text-foreground/80">
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
            <p className="font-medium text-foreground">
              Everything we build starts with your privacy.
            </p>
            <p className="mt-2">
              We collect only what is strictly necessary to deliver the service, we never sell your
              data, and we give you full control over it at all times. These terms reflect that
              commitment.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">1. Who We Are</h2>
            <p className="mt-2">
              Call Me AI is an AI-powered chat, voice, and image generation service operated by an
              individual seller based in Croatia, in accordance with the Zakon o elektroničkoj
              trgovini (NN 173/03) and the Zakon o zaštiti potrošača (NN 19/22).
            </p>
            <p className="mt-2">
              Contact:{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>
            </p>
            <p className="mt-2">
              All payment processing is handled by LemonSqueezy (Lemon Squeezy, LLC) as our Merchant
              of Record. Your financial data is handled exclusively by LemonSqueezy and is never
              stored on our servers.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">2. Your Privacy Comes First</h2>
            <p className="mt-2">
              We collect only what is strictly necessary to deliver the service. We never sell your
              data. You have full control over it at all times. Our{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              explains exactly what we collect, why, and how you can access, correct, or delete it
              whenever you choose.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">3. Who Can Use Call Me AI</h2>
            <p className="mt-2">
              You must be at least 18 years old. By creating an account, you confirm that you meet
              this age requirement. You agree to provide accurate registration information and to
              keep your credentials secure.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">4. What We Offer</h2>
            <p className="mt-2">
              Call Me AI provides AI-generated text conversations, voice interactions, and image
              generation through a subscription-based model. Details of available plans, features,
              and usage limits are on our Pricing page. AI-generated content may occasionally be
              inaccurate or unexpected &mdash; we continuously improve the experience.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">5. Adult Topics Mode</h2>
            <p className="mt-2">
              Adult Topics Mode is an optional feature for users aged 18 and older. It enables
              mature conversational themes within the limits of our{" "}
              <a href="/acceptable-use" className="underline">
                Acceptable Use Policy
              </a>
              . Enabling it requires explicit age confirmation. It can be turned on or off at any
              time in your settings.
            </p>
            <p className="mt-2">
              Adult Topics Mode never permits content involving minors, non-consensual depictions of
              real persons, or anything prohibited by law or our Acceptable Use Policy.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">6. Your Content</h2>
            <p className="mt-2">
              Any input you provide remains yours. We do not claim ownership over your prompts or
              creative output. AI-generated responses are produced algorithmically. You are free to
              use outputs for personal purposes; you are responsible for ensuring any public use
              complies with applicable law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">7. Subscriptions &amp; Payments</h2>
            <p className="mt-2">
              Subscriptions are billed on a recurring basis through LemonSqueezy as Merchant of
              Record. Prices include applicable VAT. You can manage, upgrade, downgrade, or cancel
              your subscription at any time through your account dashboard &mdash; no emails, no
              friction.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">8. Your Right of Withdrawal</h2>
            <p className="mt-2">
              As an EU consumer, you have the right to withdraw from a digital service purchase
              within 14 days of the transaction, in accordance with Directive 2011/83/EU and the
              Zakon o zaštiti potrošača (NN 19/22). Because Call Me AI begins immediately upon
              subscription activation, you will be asked at checkout to confirm immediate access and
              acknowledge that this waives the 14-day withdrawal right once the service has been
              accessed. If you do not use the service after purchase, you remain eligible for a full
              refund within 14 days. See our{" "}
              <a href="/refund-policy" className="underline">
                Refund Policy
              </a>{" "}
              for full details.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">9. Acceptable Use</h2>
            <p className="mt-2">
              You agree to use Call Me AI responsibly and in compliance with our{" "}
              <a href="/acceptable-use" className="underline">
                Acceptable Use Policy
              </a>
              . We believe in proportional responses &mdash; warnings first, not instant punishment.
              Serious or repeated violations may result in suspension.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">10. Content Moderation</h2>
            <p className="mt-2">
              We apply lightweight, automated content moderation to maintain platform safety and
              legal compliance, in accordance with the Digital Services Act (Regulation (EU)
              2022/2065). Moderation exists to catch genuinely harmful content &mdash; not to
              surveil your conversations. We do not read your chats for any purpose beyond safety.
              You may report concerns or appeal any decision by contacting{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">11. Intellectual Property</h2>
            <p className="mt-2">
              The Call Me AI name, logo, interface design, and underlying technology are protected
              by applicable intellectual property laws. This does not affect your rights over your
              own content as described in Section 6.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">12. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by Croatian and EU law, we are not liable for
              AI-generated content, service interruptions outside our control, or third-party
              actions. Our total liability is limited to the amount you paid in the 12 months
              preceding any claim. Nothing here limits any rights you have under mandatory EU
              consumer protection law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">13. Dispute Resolution</h2>
            <p className="mt-2">
              We would much rather resolve things directly with you than involve anyone else. If you
              have a concern, please contact{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>{" "}
              first. If we cannot resolve it together, disputes are governed by Croatian law and
              subject to the jurisdiction of the competent courts in Croatia. As an EU consumer, you
              also have the right to use the EU Online Dispute Resolution platform at{" "}
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
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">14. Changes to These Terms</h2>
            <p className="mt-2">
              We will notify you by email or in-app notice at least 14 days before any material
              changes take effect. Your continued use after the effective date constitutes
              acceptance. If you disagree, you may cancel and request data deletion at any time.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">15. Contact</h2>
            <p className="mt-2">
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>{" "}
              &mdash; we aim to respond within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

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
