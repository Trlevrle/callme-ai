import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { AgeGate } from "@/components/marketing/AgeGate";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Call Me AI" }] }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Try the product. Get a feel for it.",
    cta: "Start free",
    href: "/auth?mode=signup",
    features: [
      "20 minutes of voice per month",
      "2 personas",
      "Text chat (unlimited)",
      "In-chat image generation (limited)",
    ],
  },
  {
    name: "Pro",
    price: "€19.99",
    period: "per month",
    description: "Unlimited voice. All personas. Everything we ship.",
    cta: "Get Pro",
    href: "https://callmeai.lemonsqueezy.com/checkout/buy/PRO_PLACEHOLDER",
    highlighted: true,
    features: [
      "Unlimited voice minutes",
      "All personas (more shipping soon)",
      "In-chat image generation (unlimited)",
      "Priority access to new models",
      "Cancel any time",
    ],
  },
];

function PricingPage() {
  return (
    <AgeGate>
      <PublicShell>
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 md:py-28">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Pricing
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-6xl">
              Free to start. <em className="text-primary">Pro when you want more.</em>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              No hidden fees. Cancel any time. 18+ only.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {plans.map((p) => (
              <div
                key={p.name}
                className={
                  p.highlighted
                    ? "relative rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-8"
                    : "rounded-3xl border border-border/70 bg-card/40 p-8"
                }
              >
                {p.highlighted && (
                  <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h2 className="font-serif text-2xl text-foreground">{p.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <p className="mt-6 font-serif text-5xl text-foreground">
                  {p.price}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{p.period}</p>
                <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8 w-full rounded-full"
                  size="lg"
                  variant={p.highlighted ? "default" : "outline"}
                >
                  {p.href.startsWith("http") ? (
                    <a href={p.href}>
                      {p.cta} <ArrowRight className="size-4" />
                    </a>
                  ) : (
                    <Link to={p.href}>
                      {p.cta} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Payments are processed by our merchant-of-record partner.
            VAT is included where applicable.
          </p>
        </section>
      </PublicShell>
    </AgeGate>
  );
}
