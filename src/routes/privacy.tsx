import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal/LegalDocument";

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

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      lastUpdated="July 2026"
      tocLabel="Privacy sections"
      intro={
        <>
          <p className="font-medium text-foreground">
            Your privacy and data protection are our founding principle.
          </p>
          <p className="mt-2">
            We follow data minimisation under GDPR and Croatian law: collect only what is needed,
            protect it carefully, and keep it only as long as required.
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
                Call Me AI is operated by an individual seller based in Croatia. LemonSqueezy (Lemon
                Squeezy, LLC) is our Merchant of Record and handles payment data off-platform.
              </p>
              <p className="mt-3">
                Contact:{" "}
                <a href="mailto:support@callme-ai.com" className="underline">
                  support@callme-ai.com
                </a>
              </p>
            </>
          ),
        },
        {
          id: "collect",
          title: "2. What We Collect",
          body: (
            <ul className="list-inside list-disc space-y-1">
              <li>Email address, hashed password, and subscription status</li>
              <li>Preference settings such as Adult Topics Mode</li>
              <li>Anonymised page analytics and truncated IP for security</li>
              <li>We do not collect real name, phone, physical address, ID, or card data</li>
            </ul>
          ),
        },
        {
          id: "conversations",
          title: "3. Your Conversations Are Yours",
          body: (
            <>
              <p>
                Chats are processed in real time and are not stored permanently after the session
                ends.
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1">
                <li>We do not read conversations for marketing or advertising.</li>
                <li>We do not sell or monetise conversation data.</li>
                <li>We do not use conversations to train AI models.</li>
                <li>Temporary anonymised safety logs may be kept for up to 90 days.</li>
              </ul>
            </>
          ),
        },
        {
          id: "security",
          title: "4. How We Protect Data",
          body: (
            <ul className="list-inside list-disc space-y-1">
              <li>TLS/HTTPS in transit and encryption at rest for account data</li>
              <li>Minimal access controls and short retention windows</li>
              <li>Security reviews for our infrastructure and providers</li>
            </ul>
          ),
        },
        {
          id: "providers",
          title: "5. Service Providers",
          body: (
            <>
              <p>We use a limited set of providers under data protection agreements:</p>
              <ul className="mt-3 list-inside list-disc space-y-1">
                <li>LemonSqueezy for billing and tax handling</li>
                <li>Hosting provider for app delivery and truncated logs</li>
                <li>AI providers for in-session chat, voice, and image prompts only</li>
              </ul>
              <p className="mt-3">
                Where providers are outside the EU/EEA, Standard Contractual Clauses are used.
              </p>
            </>
          ),
        },
        {
          id: "rights",
          title: "6. Your Rights",
          body: (
            <>
              <p>
                Under GDPR you can request access, correction, deletion, portability, restriction,
                or objection.
              </p>
              <p className="mt-3">
                Email{" "}
                <a href="mailto:support@callme-ai.com" className="underline">
                  support@callme-ai.com
                </a>{" "}
                and we will respond within 30 days.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          title: "7. Data Retention",
          body: (
            <ul className="list-inside list-disc space-y-1">
              <li>Account data until account deletion</li>
              <li>Chat messages: session only</li>
              <li>Anonymised safety logs: up to 90 days</li>
              <li>Payment records: per Croatian tax law via LemonSqueezy</li>
            </ul>
          ),
        },
        {
          id: "contact",
          title: "8. Contact",
          body: (
            <p>
              For privacy questions, contact{" "}
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
