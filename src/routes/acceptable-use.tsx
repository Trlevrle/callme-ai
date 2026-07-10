import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/acceptable-use")({
  head: () => ({ meta: [{ title: "Acceptable use — Call Me AI" }] }),
  component: AcceptableUsePage,
});

function AcceptableUsePage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Acceptable use policy
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: today</p>

        <div className="mt-8 space-y-5 text-sm text-foreground/80">
          <h2 className="font-serif text-xl text-foreground">You may not use Call Me AI to</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Generate content that is illegal in your jurisdiction</li>
            <li>
              Generate content involving minors in any sexual, romantic, or otherwise intimate
              context
            </li>
            <li>
              Generate content depicting real, named, or identifiable public figures in intimate
              contexts
            </li>
            <li>Generate non-consensual intimate content of any person</li>
            <li>Harass, threaten, or defraud another person</li>
            <li>Generate malware, phishing content, or content designed to compromise systems</li>
            <li>Circumvent our safety controls or attempt to extract underlying model weights</li>
          </ul>
          <h2 className="font-serif text-xl text-foreground">Enforcement</h2>
          <p>
            Violations result in immediate suspension. We report illegal activity to the relevant
            authorities where required by law.
          </p>
          <h2 className="font-serif text-xl text-foreground">Report a violation</h2>
          <p>
            <a href="mailto:safety@callmeai.io" className="underline">
              safety@callmeai.io
            </a>
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
