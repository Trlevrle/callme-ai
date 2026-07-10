import { Wordmark } from "@/components/brand/Wordmark";

const footerLinks = [
  {
    title: "Product",
    items: [
      { label: "Overview", href: "/" },
      { label: "Features", href: "/about" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Safety", href: "/safety" },
      { label: "Contact", href: "mailto:support@callme-ai.com" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Refund policy", href: "/refund-policy" },
      { label: "Acceptable use", href: "/acceptable-use" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Wordmark size="md" />
            <p className="max-w-xs text-sm text-muted-foreground">
              Call Me AI is a private AI companion and personal voice assistant focused on
              meaningful, always-available conversation.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {group.title}
              </p>
              <ul className="space-y-2 text-sm">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {year} Call Me AI &middot; Croatia, EU. All rights reserved.</span>
          <span>Payments powered by LemonSqueezy</span>
        </div>
      </div>
    </footer>
  );
}
