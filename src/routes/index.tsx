import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageSquare, Mic, Shield, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicShell } from "@/components/layout/PublicShell";
import { AgeGate } from "@/components/marketing/AgeGate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Call Me AI - Private AI Companion and Voice Assistant" },
      {
        name: "description",
        content:
          "Private AI companion and personal voice assistant for meaningful conversations with memory and on-device history controls.",
      },
      { property: "og:title", content: "Call Me AI - Private AI Companion and Voice Assistant" },
      {
        property: "og:description",
        content:
          "Meaningful voice and text conversations with a private AI companion. Conversations stay under your control.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Call Me AI - Private AI Companion" },
      {
        name: "twitter:description",
        content:
          "Personal voice assistant with memory, privacy controls, and always-available conversation.",
      },
    ],
  }),
  component: HomePage,
});

const highlights = [
  {
    icon: Mic,
    title: "Voice and text in one place",
    body: "Start with voice, continue with text, and keep every conversation flow in one private thread.",
  },
  {
    icon: Sparkles,
    title: "Continuous memory",
    body: "Your AI companion can continue from previous conversations so context is not lost between sessions.",
  },
  {
    icon: Shield,
    title: "Privacy-first controls",
    body: "Conversations stay on your device by default with simple controls to clear history at any time.",
  },
  {
    icon: MessageSquare,
    title: "Always available",
    body: "Your personal voice assistant is available whenever you need meaningful conversation and support.",
  },
];

const faqs = [
  {
    q: "What is Call Me AI?",
    a: "Call Me AI is a private AI companion and personal voice assistant for meaningful conversation through voice and text.",
  },
  {
    q: "How is privacy handled?",
    a: "You can manage memory in Settings and clear local history with one click. Conversation content is not used for third-party analytics.",
  },
  {
    q: "Do I need to install an app?",
    a: "No. It runs in your browser and supports mobile and desktop experiences.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Start on the free plan and upgrade when you need more voice time and advanced features.",
  },
];

function HomePage() {
  return (
    <AgeGate>
      <PublicShell>
        <Hero />
        <Highlights />
        <PricingPreview />
        <FAQ />
      </PublicShell>
    </AgeGate>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-card/40 to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-28">
        <div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
            <Star className="size-3 text-primary" />
            Private AI companion platform
          </div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.04] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Private
            </span>{" "}
            conversations.
            <br />
            Consistent memory.
            <br />
            Personal voice assistant.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Call Me AI helps you maintain meaningful conversations with a private AI companion that
            supports voice and text.
          </p>
          <p className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 font-serif text-2xl italic text-foreground md:text-3xl">
            "She remembers everything, and tells no one."
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/auth" search={{ mode: "signup" }}>
                Start free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" /> Free plan available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" /> Mobile-friendly
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5 text-primary" /> Privacy controls built in
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-primary/70">
              <Shield className="size-3.5 text-primary" /> No data sold. Ever.
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/50 p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Why teams and individuals choose Call Me AI
          </p>
          <ul className="mt-5 space-y-3 text-sm text-foreground/90">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-primary" />
              Voice and text conversation in one continuous interface
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-primary" />
              Persistent conversation context across sessions
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-primary" />
              Clear local history controls for privacy-sensitive usage
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-primary" />
              Fast onboarding with browser-native voice support
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Capabilities
        </p>
        <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Built for continuity, privacy, and reliability.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-serif text-2xl text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className="border-y border-border/60 bg-card/20 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
        <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Start free. Upgrade when you need more.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          Choose the plan that matches your usage, with straightforward billing and professional
          support.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full">
          <Link to="/pricing">
            Compare plans <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">FAQ</p>
        <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Frequently asked questions
        </h2>
      </div>
      <div className="divide-y divide-border/60 rounded-3xl border border-border/60 bg-card/40">
        {faqs.map((item) => (
          <details key={item.q} className="group p-6 [&[open]]:bg-card/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-foreground marker:hidden">
              {item.q}
              <span className="ml-2 grid size-7 shrink-0 place-items-center rounded-full border border-border/60 text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
