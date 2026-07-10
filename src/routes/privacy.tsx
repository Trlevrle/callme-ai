import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Call Me AI" },
      {
        name: "description",
        content: "Read how Call Me AI handles account data, conversation privacy, and user rights.",
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

        <div className="mt-8 space-y-5 text-sm text-foreground/80">
          <h2 className="font-serif text-xl text-foreground">1. Data We Collect</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Account information such as email address and profile name.</li>
            <li>Service configuration preferences including voice and memory settings.</li>
            <li>Operational logs needed for reliability, abuse prevention, and support.</li>
          </ul>

          <h2 className="font-serif text-xl text-foreground">2. Conversation Privacy</h2>
          <p>
            Conversation history is stored locally on your device by default in this application
            build. You may clear local history at any time from Settings.
          </p>

          <h2 className="font-serif text-xl text-foreground">3. Payment and Billing Data</h2>
          <p>
            Subscription billing is handled by our merchant-of-record and payment processor. We do
            not store full payment card details directly in this application.
          </p>

          <h2 className="font-serif text-xl text-foreground">4. Data Sharing</h2>
          <p>
            We do not sell conversation content. Data is shared only with service providers required
            to operate the product, including AI inference and payment providers.
          </p>

          <h2 className="font-serif text-xl text-foreground">5. Data Retention</h2>
          <p>
            Account and operational records are retained only as long as necessary for service
            delivery, legal compliance, and dispute handling.
          </p>

          <h2 className="font-serif text-xl text-foreground">6. Your Rights</h2>
          <p>
            You may request account export or deletion by contacting
            <a href="mailto:privacy@callmeai.io" className="ml-1 underline">
              privacy@callmeai.io
            </a>
            .
          </p>

          <h2 className="font-serif text-xl text-foreground">7. Contact</h2>
          <p>
            Privacy inquiries:
            <a href="mailto:privacy@callmeai.io" className="ml-1 underline">
              privacy@callmeai.io
            </a>
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
