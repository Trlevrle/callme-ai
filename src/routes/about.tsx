import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Call Me AI" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          About
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-6xl">
          A real <em className="text-primary">conversation</em> on the other end of the line.
        </h1>
        <p className="mt-6 text-base text-muted-foreground">
          Call Me AI is a small team building a social companion for adults.
          We believe AI should be approachable, warm, and present — not cold
          and transactional.
        </p>
        <p className="mt-4 text-base text-muted-foreground">
          Pick a persona, hit call, and have a conversation. That is the
          product.
        </p>
        <p className="mt-8 text-sm text-muted-foreground">
          Questions?{" "}
          <a href="mailto:hello@callmeai.io" className="text-foreground underline">
            hello@callmeai.io
          </a>
        </p>
      </section>
    </PublicShell>
  );
}
