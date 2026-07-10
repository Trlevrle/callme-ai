import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { AgeGate } from "@/components/marketing/AgeGate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing - Call Me AI" },
      {
        name: "description",
        content:
          "Compare Call Me AI plans. Free, Pro, and Premium — transparent pricing with no surprises.",
      },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  name: string;
  monthly: number;
  yearly: number;
  yearlyPerMonth: number;
  yearlySaving: string;
  description: string;
  cta: string;
  href: string;
  external: boolean;
  highlighted?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    yearlyPerMonth: 0,
    yearlySaving: "",
    description: "Try the core experience at no cost.",
    cta: "Get started free",
    href: "/auth?mode=signup",
    external: false,
    features: [
      "15 SFW chat messages per day",
      "3 image generations per day",
      "1 default persona",
      "24-hour conversation history",
      "Privacy controls built in",
    ],
  },
  {
    name: "Pro",
    monthly: 9.99,
    yearly: 89.99,
    yearlyPerMonth: 7.5,
    yearlySaving: "Save 25%",
    description: "Expanded limits for regular daily use.",
    cta: "Get Pro",
    href: "https://callmeai.lemonsqueezy.com/checkout/buy/PRO_PLACEHOLDER",
    external: true,
    highlighted: true,
    features: [
      "200 SFW + 80 adult messages/day",
      "30 image generations/day (15 adult)",
      "10 min voice per day",
      "5 custom personas",
      "30-day conversation history",
      "Priority processing",
      "Cancel anytime",
    ],
  },
  {
    name: "Premium",
    monthly: 19.99,
    yearly: 169.99,
    yearlyPerMonth: 14.17,
    yearlySaving: "Save 29%",
    description: "Maximum freedom for power users.",
    cta: "Get Premium",
    href: "https://callmeai.lemonsqueezy.com/checkout/buy/PREMIUM_PLACEHOLDER",
    external: true,
    features: [
      "Unlimited SFW + 300 adult messages/day",
      "80 image generations/day (50 adult)",
      "45 min voice per day",
      "Unlimited custom personas",
      "Unlimited conversation history",
      "Priority processing",
      "Early access to new features",
    ],
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <AgeGate>
      <PublicShell>
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-28">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Pricing
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              Transparent plans.
              <br className="hidden sm:block" /> No surprises.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Start free and upgrade when you need more. Billing is handled by LemonSqueezy as
              Merchant of Record. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex rounded-full border border-border/60 bg-card/60 p-1 text-sm">
              <button
                onClick={() => setYearly(false)}
                className={cn(
                  "rounded-full px-5 py-1.5 transition-colors",
                  !yearly
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-5 py-1.5 transition-colors",
                  yearly
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Yearly
                {!yearly && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Save up to 29%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                  plan.highlighted
                    ? "border-primary/50 bg-gradient-to-b from-primary/10 via-card to-card scale-[1.02]"
                    : "border-border/70 bg-card/40 hover:border-border",
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-primary px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow">
                    Most Popular
                  </span>
                )}

                <div>
                  <h2 className="font-serif text-xl text-foreground">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mt-5">
                  {plan.monthly === 0 ? (
                    <>
                      <p className="font-serif text-4xl text-foreground">€0</p>
                      <p className="mt-1 text-xs text-muted-foreground">free forever</p>
                    </>
                  ) : (
                    <>
                      <p className="font-serif text-4xl text-foreground">
                        €{(yearly ? plan.yearlyPerMonth : plan.monthly).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {yearly ? `per month · billed €${plan.yearly.toFixed(2)}/yr` : "per month"}
                      </p>
                      {yearly && plan.yearlySaving && (
                        <span className="mt-2 inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {plan.yearlySaving}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <ul className="mt-5 flex-1 space-y-2 text-sm text-foreground/80">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-7 w-full rounded-full"
                  size="lg"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.external ? (
                    <a href={plan.href} target="_blank" rel="noreferrer">
                      {plan.cta} <ArrowRight className="size-4" />
                    </a>
                  ) : (
                    <Link to={plan.href as "/"}>
                      {plan.cta} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </Button>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Payments are processed by LemonSqueezy as Merchant of Record. See our{" "}
            <a href="/refund-policy" className="text-foreground underline">
              Refund Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-foreground underline">
              Terms of Service
            </a>{" "}
            for details.
          </p>

          {/* Adult topics notice */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Adult Topics Mode</p>
            <p className="mt-1">
              Adult Topics Mode is optional and available to eligible adults on Pro and Premium
              plans. It does not permit illegal, exploitative, or minor-related content. All usage
              is subject to our{" "}
              <a href="/acceptable-use" className="text-foreground underline">
                Acceptable Use Policy
              </a>{" "}
              and{" "}
              <a href="/safety" className="text-foreground underline">
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
