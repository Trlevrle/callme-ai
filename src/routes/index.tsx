import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageSquare, Mic, ImagePlus, Shield, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicShell } from "@/components/layout/PublicShell";
import { AgeGate } from "@/components/marketing/AgeGate";
import { HeroVoiceOrb } from "@/components/marketing/HeroVoiceOrb";
import { PersonaCard } from "@/components/marketing/PersonaCard";
import { VoiceSamplePlayer } from "@/components/marketing/VoiceSamplePlayer";
import { personas } from "@/lib/personas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Call Me AI — Your AI companion, on call" },
      {
        name: "description",
        content:
          "Real-time voice and chat with AI personas. Pick who you want to talk to, hit call, and start the conversation.",
      },
    ],
  }),
  component: HomePage,
});

const howItWorks = [
  {
    icon: Sparkles,
    title: "Pick a persona",
    body: "Choose who you want to talk to. Different voices, different moods. You can switch any time.",
  },
  {
    icon: Mic,
    title: "Hit call",
    body: "Real-time voice, end-to-end streamed. Speak naturally, the way you would on the phone.",
  },
  {
    icon: MessageSquare,
    title: "Talk or type",
    body: "Voice when you want it, text when you don't. Your conversation history is saved to your account.",
  },
  {
    icon: ImagePlus,
    title: "Get pictures in the chat",
    body: "Ask for a photo mid-conversation — your persona will send one right in the thread.",
  },
];

const proofPoints = [
  { label: "Real-time voice", value: "<400ms" },
  { label: "Average session", value: "12 min" },
  { label: "Personas online", value: "4" },
  { label: "Models behind the scenes", value: "3" },
];

const faqs = [
  {
    q: "Is this a real phone call?",
    a: "It's a real-time voice conversation over your browser or phone's internet connection. No phone number is required.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Call Me AI works in your browser. On mobile you can add it to your home screen and it behaves like a native app.",
  },
  {
    q: "How is my conversation stored?",
    a: "Your conversation history is saved to your account so you can pick up where you left off. You can delete any conversation or your entire history at any time from Settings.",
  },
  {
    q: "What about safety?",
    a: "We have a zero-tolerance policy for illegal content, anything involving minors, and content involving real people without consent. Full safety policy at /safety.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Pro is month-to-month through our payment partner. Cancel from your account settings and you keep access until the end of the period.",
  },
  {
    q: "Who is this for?",
    a: "Call Me AI is a personal social companion for adults. It's for people who want someone to talk to — a conversation, a sounding board, a moment of presence.",
  },
];

function HomePage() {
  return (
    <AgeGate>
      <PublicShell>
        <Hero />
        <ProofStrip />
        <PersonasShowcase />
        <VoiceDemo />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </PublicShell>
    </AgeGate>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-bg animate-aurora absolute left-1/2 top-[-20%] h-[800px] w-[1400px] -translate-x-1/2 opacity-40" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-28">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Star className="size-3 text-primary" />
            Real-time voice · Now in early access
          </div>
          <h1 className="mt-6 font-serif text-5xl font-normal leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Pick a voice. <br />
            <em className="text-primary">Hit call.</em> <br />
            Talk to your AI.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Call Me AI is a real-time AI companion for people who want a real
            conversation. Choose a persona, start a call, and talk like you
            would with someone on the other end of the line.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/auth?mode=signup">
                Get early access <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <a href="#personas">Meet the personas</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" /> Free to start
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" /> No credit card
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5 text-primary" /> 18+ only
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <HeroVoiceOrb />
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="border-y border-border/60 bg-card/30 py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4">
        {proofPoints.map((p) => (
          <div key={p.label} className="text-center">
            <p className="font-serif text-3xl text-foreground">{p.value}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {p.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PersonasShowcase() {
  return (
    <section id="personas" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Personas
        </p>
        <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Four voices. <em className="text-primary">Four moods.</em>
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Each persona is a different way of being on the other end of the
          line. Pick the one who matches the conversation you want to have
          tonight.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p, i) => (
          <PersonaCard key={p.id} persona={p} size={i === 0 ? "lg" : "md"} />
        ))}
      </div>
    </section>
  );
}

function VoiceDemo() {
  return (
    <section id="how" className="border-t border-border/60 bg-gradient-to-b from-card/20 to-background py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Voice
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
            Real talk. <em className="text-primary">No typing required.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Try a sample of what a Call Me AI conversation sounds like. Tap
            play — your browser will speak it back to you.
          </p>
        </div>
        <VoiceSamplePlayer />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          How it works
        </p>
        <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Four steps. <em className="text-primary">One conversation.</em>
        </h2>
      </div>

      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((step, i) => (
          <li
            key={step.title}
            className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-6"
          >
            <span className="font-serif text-4xl italic text-primary/50">
              0{i + 1}
            </span>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon className="size-5" />
            </div>
            <h3 className="font-serif text-lg text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Pricing
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
            Free to start. <em className="text-primary">Pro when you want more.</em>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-3xl border border-border/70 bg-card/40 p-8">
            <h3 className="font-serif text-2xl text-foreground">Free</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try the product. Get a feel for it.
            </p>
            <p className="mt-6 font-serif text-5xl text-foreground">€0</p>
            <p className="mt-1 text-xs text-muted-foreground">Forever, no card</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                20 minutes of voice per month
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                2 personas
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                Text chat (unlimited)
              </li>
            </ul>
            <Button
              asChild
              variant="outline"
              className="mt-8 w-full rounded-full"
              size="lg"
            >
              <Link to="/auth?mode=signup">Start free</Link>
            </Button>
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-8">
            <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              Most popular
            </span>
            <h3 className="font-serif text-2xl text-foreground">Pro</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Unlimited voice. All personas. Everything we ship.
            </p>
            <p className="mt-6 font-serif text-5xl text-foreground">€19.99</p>
            <p className="mt-1 text-xs text-muted-foreground">per month</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                Unlimited voice minutes
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                All personas (more shipping soon)
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                In-chat image generation
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                Priority access to new models
              </li>
            </ul>
            <Button asChild className="mt-8 w-full rounded-full" size="lg">
              <a href="https://callmeai.lemonsqueezy.com/checkout/buy/PRO_PLACEHOLDER">
                Get Pro <ArrowRight className="size-4" />
              </a>
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Cancel any time · 18+ only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Questions
        </p>
        <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Frequently asked.
        </h2>
      </div>
      <div className="divide-y divide-border/60 rounded-3xl border border-border/60 bg-card/40">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group p-6 [&[open]]:bg-card/70"
          >
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-foreground",
                "marker:hidden",
              )}
            >
              {f.q}
              <span className="ml-2 grid size-7 shrink-0 place-items-center rounded-full border border-border/60 text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
