import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/acceptable-use")({
  head: () => ({
    meta: [
      { title: "Acceptable Use Policy - Call Me AI" },
      {
        name: "description",
        content: "Clear boundaries, maximum freedom. Read the Call Me AI Acceptable Use Policy.",
      },
    ],
  }),
  component: AcceptableUsePage,
});

function AcceptableUsePage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Acceptable Use Policy
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm text-foreground/80">
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
            <p className="font-medium text-foreground">
              Call Me AI is built to be a space where you can express yourself freely &mdash; within
              clear, reasonable limits.
            </p>
            <p className="mt-2">
              This policy exists to protect you and everyone on the platform, not to police
              creativity. Your privacy remains our priority throughout. We use the least intrusive
              methods possible and never review content beyond what is strictly necessary for
              safety.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">1. What&rsquo;s Welcome</h2>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Creative, personal, and exploratory conversations</li>
              <li>Mature topics (with Adult Topics Mode enabled, 18+ users only)</li>
              <li>Roleplay, fiction, brainstorming, venting, companionship</li>
              <li>Using all features within your subscription tier</li>
            </ul>
            <p className="mt-3">
              We built this for adults who want genuine, unrestricted AI interaction. Enjoy it.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">2. What&rsquo;s Not Allowed</h2>
            <p className="mt-2">
              The following are strictly prohibited regardless of mode or context:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>
                Any content involving minors in a sexual, violent, or exploitative context &mdash;
                zero tolerance
              </li>
              <li>Non-consensual intimate imagery of real, identifiable persons</li>
              <li>
                Specific, actionable instructions for creating weapons, dangerous substances, or
                carrying out real-world harm
              </li>
              <li>Fraud, phishing, or impersonation with intent to deceive</li>
              <li>Automated abuse &mdash; bots, scrapers, or systematic overloading</li>
              <li>Attempts to compromise the platform&rsquo;s security or extract model data</li>
              <li>Distributing outputs as human-generated for commercial deception</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">3. How We Keep the Platform Safe</h2>
            <p className="mt-2">
              We use automated, privacy-preserving safety systems &mdash; not human reviewers
              reading your chats. Here is what that means in practice:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>
                Automated filters scan for patterns matching the prohibited categories above (e.g.
                CSAM detection)
              </li>
              <li>
                No human reads your conversations unless a specific, serious safety flag requires it
                and manual review is strictly necessary
              </li>
              <li>
                We do not monitor your opinions, preferences, legal fantasies, or anything outside
                the prohibited list
              </li>
              <li>
                All safety data is handled under our{" "}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>{" "}
                with the same protections as any other personal data
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">4. Enforcement</h2>
            <p className="mt-2">We take a proportional, graduated approach:</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>
                <strong>Warning</strong> &mdash; for first-time or minor violations, we will let you
                know what happened and why
              </li>
              <li>
                <strong>Temporary restriction</strong> &mdash; for repeated or moderate violations
              </li>
              <li>
                <strong>Account suspension</strong> &mdash; for serious or repeated violations,
                especially anything involving minors
              </li>
            </ul>
            <p className="mt-3">
              You will always be notified and can contact{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>{" "}
              to appeal. We do not proactively share conversation content with any third party. The
              only narrow exception is where we are legally compelled by a valid court order or
              where we detect content involving the exploitation of minors, as legally required.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-foreground">5. Questions</h2>
            <p className="mt-2">
              If anything in this policy concerns you, reach out &mdash; we would rather explain
              than leave you guessing:{" "}
              <a href="mailto:support@callme-ai.com" className="underline">
                support@callme-ai.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
