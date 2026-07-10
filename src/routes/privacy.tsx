import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Call Me AI" },
      {
        name: "description",
        content:
          "Your privacy is our founding principle. Read exactly what we collect, what we never collect, and how you stay in control.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm text-foreground/80">
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
            <p className="font-medium text-foreground">
              Your privacy and data protection are not just obligations &mdash; they are our
              founding principle.
            </p>
            <p className="mt-2">
              Every decision about data starts with one question: what is the absolute minimum we
              need to give you the best experience? We operate under the EU General Data Protection
              Regulation (GDPR) and Croatian data protection law &mdash; some of the strongest
              privacy standards in the world. We embrace them fully and go beyond them wherever we
              can.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">1. Who We Are</h2>
            <p className="mt-2">
              Call Me AI is operated by an individual seller based in Croatia. All payment
              processing is handled by LemonSqueezy (Lemon Squeezy, LLC) as our Merchant of Record
              &mdash; your financial data is handled entirely by them and never stored on our
              servers.
            </p>
            <p className="mt-2">
              Data Controller: Call Me AI &mdash;{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">
              2. What We Collect &mdash; and What We Don&rsquo;t
            </h2>
            <p className="mt-2">
              We follow strict data minimisation. We collect only what is genuinely necessary:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Email address &mdash; for account creation and service communications</li>
              <li>Hashed password &mdash; for secure login</li>
              <li>Subscription status &mdash; to deliver the features you paid for</li>
              <li>Preference settings (e.g. Adult Topics Mode) &mdash; to remember your choices</li>
              <li>Anonymised page analytics &mdash; to improve the service</li>
              <li>
                Truncated IP address (temporary) &mdash; for security and abuse prevention only
              </li>
            </ul>
            <p className="mt-4 font-medium text-foreground">We never collect:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Your real name (not required)</li>
              <li>Phone number or physical address</li>
              <li>Government ID or biometric data</li>
              <li>Precise location</li>
              <li>Payment card details (handled entirely by LemonSqueezy)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">3. Your Conversations Are Yours</h2>
            <p className="mt-2">
              This is the part that matters most &mdash; so here it is, plainly:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>
                Chat messages are processed in real time to generate AI responses and are{" "}
                <strong>not stored permanently</strong> on our servers after your session ends.
              </li>
              <li>
                We do <strong>not</strong> read, review, or analyse your conversations for
                marketing, profiling, or advertising &mdash; ever.
              </li>
              <li>
                We do <strong>not</strong> sell, share, or monetise your conversation data in any
                form.
              </li>
              <li>
                We do <strong>not</strong> use your conversations to train AI models.
              </li>
              <li>
                Minimal, anonymised safety logs may be retained temporarily (up to 90 days) for
                security purposes only. These contain no readable conversation content.
              </li>
            </ul>
            <p className="mt-3 font-medium text-foreground">
              Your trust is the product. Your data is not.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">4. How We Protect Your Data</h2>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Encryption in transit (TLS/HTTPS on all connections)</li>
              <li>Encryption at rest for stored account data</li>
              <li>Access controls &mdash; only essential automated systems access your data</li>
              <li>Minimal retention &mdash; data is deleted as soon as it is no longer needed</li>
              <li>Regular security reviews of our infrastructure and providers</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">5. Service Providers</h2>
            <p className="mt-2">
              We work with a small number of trusted providers, each bound by strict data protection
              agreements:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>
                <strong>LemonSqueezy</strong> &mdash; payment processing; email and billing info
                only
              </li>
              <li>
                <strong>Hosting provider</strong> &mdash; truncated IP and page requests only
              </li>
              <li>
                <strong>AI providers (OpenRouter etc.)</strong> &mdash; chat messages in-session
                only, never stored by us
              </li>
              <li>
                <strong>ElevenLabs</strong> &mdash; voice prompts in-session only (if voice is used)
              </li>
              <li>
                <strong>FAL</strong> &mdash; image prompts in-session only (if image generation is
                used)
              </li>
            </ul>
            <p className="mt-3">
              Where providers are outside the EU/EEA, Standard Contractual Clauses are in place. We
              will never sell your data to third parties or share it for advertising.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">6. Cookies</h2>
            <p className="mt-2">
              We use only strictly necessary cookies (login sessions, security) and preference
              cookies (to remember your settings, with your consent). No advertising cookies, no
              cross-site tracking. Your cookie choices take effect immediately and can be changed
              any time in Settings.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">7. Your Rights</h2>
            <p className="mt-2">Under GDPR, you have full control:</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>
                <strong>Access</strong> &mdash; request a copy of all data we hold about you
              </li>
              <li>
                <strong>Correction</strong> &mdash; fix anything inaccurate
              </li>
              <li>
                <strong>Deletion</strong> &mdash; delete your account and all associated data
              </li>
              <li>
                <strong>Portability</strong> &mdash; receive your data in a standard format
              </li>
              <li>
                <strong>Restriction &amp; objection</strong> &mdash; limit or object to any
                processing
              </li>
              <li>
                <strong>Withdraw consent</strong> &mdash; at any time, for any consent-based
                processing
              </li>
            </ul>
            <p className="mt-3">
              To exercise any right, email{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>
              . We respond within 30 days (usually much faster).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">8. Data Retention</h2>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Account data &mdash; until you delete your account</li>
              <li>Chat messages &mdash; session only, not stored after the session ends</li>
              <li>Anonymised safety logs &mdash; up to 90 days, then permanently deleted</li>
              <li>
                Payment records &mdash; as required by Croatian tax law, managed by LemonSqueezy
              </li>
            </ul>
            <p className="mt-3">
              When you delete your account, personal data is removed from active systems within 30
              days and from backups within 90 days.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">9. Children</h2>
            <p className="mt-2">
              Call Me AI is strictly for users aged 18 and older. We do not knowingly collect data
              from anyone under 18.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">10. Changes to This Policy</h2>
            <p className="mt-2">
              If we make material changes, we will notify you by email or prominent in-app notice
              before they take effect.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">11. Contact</h2>
            <p className="mt-2">
              For any privacy question, request, or concern:{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>
              . We genuinely care and will respond promptly.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
