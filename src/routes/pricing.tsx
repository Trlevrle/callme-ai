import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { AgeGate } from "@/components/marketing/AgeGate";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing - Call Me AI" },
      {
        name: "description",
        content:
          "Compare Call Me AI plans for private AI companion and personal voice assistant usage.",
      },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "EUR 0",
    period: "per month",
    description: "Evaluate core voice and text capabilities.",
    cta: "Create account",
    href: "/auth?mode=signup",
    features: [
      "Limited monthly voice minutes",
      "Text conversations",
      "Core privacy controls",
      "Local conversation history",
    ],
  },
  {
    name: "Pro",
    price: "EUR 19.99",
    period: "per month",
    description: "Expanded usage limits for regular daily conversations.",
    cta: "Upgrade to Pro",
    href: "https://callmeai.lemonsqueezy.com/checkout/buy/PRO_PLACEHOLDER",
    highlighted: true,
    features: [
      "Higher voice usage allowance",
      "Priority processing",
      "Advanced memory continuity",
      "Access to new features as released",
      "Cancel renewal at any time",
    ],
  },
];

function PricingPage() {
  return (
    <AgeGate>
      <PublicShell>
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-28">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Pricing
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-6xl">
              Transparent plans for private AI conversation.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              Billing is monthly, cancellation applies to future renewals, and access remains active
              through the paid period.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={
                  plan.highlighted
                    ? "relative rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-8"
                    : "rounded-3xl border border-border/70 bg-card/40 p-8"
                }
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Recommended
                  </span>
                )}
                <h2 className="font-serif text-2xl text-foreground">{plan.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 font-serif text-5xl text-foreground">{plan.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">{plan.period}</p>
                <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8 w-full rounded-full"
                  size="lg"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.href.startsWith("http") ? (
                    <a href={plan.href}>
                      {plan.cta} <ArrowRight className="size-4" />
                    </a>
                  ) : (
                    <Link to={plan.href}>
                      {plan.cta} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </Button>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Payments are processed by our merchant-of-record partner. See
            <a href="/refund-policy" className="mx-1 text-foreground underline">
              Refund Policy
            </a>
            and
            <a href="/terms" className="mx-1 text-foreground underline">
              Terms of Service
            </a>
            for details.
          </p>

          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Adult topics mode notice</p>
            <p className="mt-1">
              Adult topics mode is an optional account preference for eligible adults. It does not
              permit illegal, exploitative, non-consensual, or minor-related content. All usage
              remains subject to our
              <a href="/acceptable-use" className="mx-1 text-foreground underline">
                Acceptable Use Policy
              </a>
              and
              <a href="/safety" className="mx-1 text-foreground underline">
                Safety Policy
              </a>
              .
            </p>
          </div>
        </section>
      </PublicShell>
    </AgeGate>
  );
}
