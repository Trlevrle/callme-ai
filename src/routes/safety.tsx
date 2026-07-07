import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";
import { Shield, Ban, AlertTriangle, Lock, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({ meta: [{ title: "Safety — Call Me AI" }] }),
  component: SafetyPage,
});

const rules = [
  {
    icon: Ban,
    title: "Zero tolerance for illegal content",
    body: "We do not allow content that depicts, describes, or solicits illegal activity of any kind. Accounts found in violation are suspended and reported to the relevant authorities where required.",
  },
  {
    icon: AlertTriangle,
    title: "Minors are not allowed",
    body: "Call Me AI is an 18+ product. We do not allow any sexual, romantic, or otherwise intimate content involving minors in any context. Real or fictional. This is enforced at the content layer, the model layer, and the policy layer.",
  },
  {
    icon: Lock,
    title: "No real people without consent",
    body: "Personas at Call Me AI are fictional characters. We do not generate content that depicts real, named, or identifiable public figures in intimate contexts. We do not generate deepfake or impersonation content.",
  },
  {
    icon: MessageSquare,
    title: "Your data is yours",
    body: "We store conversation history to your account so you can pick up where you left off. You can delete any single conversation, or your entire history, from Settings. We do not sell your data.",
  },
];

function SafetyPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
          <Shield className="size-3 text-primary" /> Safety policy
        </div>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground md:text-6xl">
          How we keep <em className="text-primary">Call Me AI</em> safe.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Call Me AI is an 18+ social companion. We hold ourselves to a
          specific safety standard, and we publish what it is.
        </p>

        <div className="mt-10 space-y-4">
          {rules.map((r) => (
            <div
              key={r.title}
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-6"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <r.icon className="size-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-foreground">
                  {r.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-serif text-lg text-foreground">Report something</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            If you see content that violates this policy, email{" "}
            <a href="mailto:safety@callmeai.io" className="text-foreground underline">
              safety@callmeai.io
            </a>
            . We review every report.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
