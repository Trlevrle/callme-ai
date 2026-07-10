import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal/LegalDocument";

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

export function AcceptableUsePage() {
  return (
    <LegalDocument
      title="Acceptable Use Policy"
      lastUpdated="July 2026"
      tocLabel="AUP sections"
      intro={
        <>
          <p className="font-medium text-foreground">
            Call Me AI is built for adults who want real conversation &mdash; within clear,
            reasonable limits.
          </p>
          <p className="mt-2">
            We use the least intrusive methods possible and never review content beyond what is
            necessary for safety.
          </p>
        </>
      }
      sections={[
        {
          id: "welcome",
          title: "1. What&rsquo;s Welcome",
          body: (
            <ul className="list-inside list-disc space-y-1">
              <li>Creative, personal, and exploratory conversations</li>
              <li>Mature topics for 18+ users with Adult Topics Mode enabled</li>
              <li>Roleplay, fiction, brainstorming, venting, companionship</li>
              <li>Using the service within your subscription tier</li>
            </ul>
          ),
        },
        {
          id: "not-allowed",
          title: "2. What&rsquo;s Not Allowed",
          body: (
            <ul className="list-inside list-disc space-y-1">
              <li>Any content involving minors in sexual, violent, or exploitative contexts</li>
              <li>Non-consensual intimate imagery of real, identifiable persons</li>
              <li>Actionable instructions for weapons, dangerous substances, or real-world harm</li>
              <li>Fraud, phishing, impersonation, malware, or service abuse</li>
              <li>Attempts to extract model data or compromise platform security</li>
            </ul>
          ),
        },
        {
          id: "safety",
          title: "3. How We Keep the Platform Safe",
          body: (
            <>
              <p>
                Automated, privacy-preserving systems scan only for prohibited categories. We do not
                monitor opinions, preferences, or lawful fantasies.
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1">
                <li>No human reads your chats unless a serious safety flag requires it.</li>
                <li>Safety data is handled under the same protections as other personal data.</li>
                <li>We never use safety checks as broad surveillance.</li>
              </ul>
            </>
          ),
        },
        {
          id: "enforcement",
          title: "4. Enforcement",
          body: (
            <>
              <p>We use a proportional approach:</p>
              <ul className="mt-3 list-inside list-disc space-y-1">
                <li>Warning for first-time or minor issues</li>
                <li>Temporary restriction for repeated or moderate issues</li>
                <li>Suspension for serious violations, especially anything involving minors</li>
              </ul>
              <p className="mt-3">
                We do not proactively share conversation content with third parties. The narrow
                exception is a valid legal obligation or a legally required minor-exploitation
                report.
              </p>
            </>
          ),
        },
        {
          id: "questions",
          title: "5. Questions",
          body: (
            <p>
              If this policy concerns you, contact{" "}
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
