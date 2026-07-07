import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — Call Me AI" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Legal
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: today</p>

        <div className="mt-8 space-y-5 text-sm text-foreground/80">
          <p>
            We collect the minimum amount of data we need to run Call Me AI.
            Plain-English version below; the legal version is binding.
          </p>
          <h2 className="font-serif text-xl text-foreground">What we collect</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Email address (account)</li>
            <li>Display name and avatar (optional)</li>
            <li>Conversation history (so you can come back to it)</li>
            <li>Basic usage analytics (page views, errors)</li>
          </ul>
          <h2 className="font-serif text-xl text-foreground">What we do not collect</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Government ID or biometric data</li>
            <li>Your address or phone number (unless you give them to us)</li>
            <li>Anything we don't need</li>
          </ul>
          <h2 className="font-serif text-xl text-foreground">What we do not do</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>We do not sell your data.</li>
            <li>We do not share your conversations with third parties except as needed to operate the service (e.g. the model provider that generates responses).</li>
          </ul>
          <h2 className="font-serif text-xl text-foreground">Your rights</h2>
          <p>
            You can delete any conversation, or your entire history, from
            Settings. You can request a full export or full deletion of your
            account by emailing{" "}
            <a href="mailto:privacy@callmeai.io" className="underline">
              privacy@callmeai.io
            </a>
            .
          </p>
          <h2 className="font-serif text-xl text-foreground">Contact</h2>
          <p>
            Privacy questions:{" "}
            <a href="mailto:privacy@callmeai.io" className="underline">
              privacy@callmeai.io
            </a>
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
