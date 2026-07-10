import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface TopNavProps {
  className?: string;
  /** Hide the auth buttons when rendering inside the /app shell. */
  minimal?: boolean;
}

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/safety", label: "Safety" },
];

export function TopNav({ className, minimal = false }: TopNavProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl",
          className,
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center">
            <Wordmark size="sm" />
          </Link>

          {!minimal && (
            <nav className="hidden items-center gap-7 text-sm md:flex">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative py-1 transition-colors hover:text-foreground",
                    isActive(l.href)
                      ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {!isLoading && isAuthenticated ? (
              <Button asChild size="sm" className="rounded-full">
                <Link to="/app">Open app</Link>
              </Button>
            ) : (
              <>
                <span className="hidden select-none rounded border border-primary/25 px-1.5 py-0.5 text-[10px] font-semibold text-primary/60 sm:inline-block">
                  18+
                </span>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden rounded-full sm:inline-flex"
                >
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full ring-1 ring-primary/20 shadow-sm shadow-primary/10"
                >
                  <Link to="/auth?mode=signup">Get started</Link>
                </Button>
              </>
            )}

            {!minimal && (
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile overlay — sits below the sticky header */}
      {menuOpen && !minimal && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-background/98 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-1 px-5 pt-6">
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${i * 55}ms` }}
                className={cn(
                  "animate-slide-up rounded-xl px-3 py-3 font-serif text-2xl tracking-tight transition-colors",
                  isActive(l.href) ? "text-foreground" : "text-foreground/60 hover:text-foreground",
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-2 px-5 pb-10 pt-6">
            <Button asChild size="lg" className="w-full rounded-full">
              <Link to="/auth?mode=signup" onClick={() => setMenuOpen(false)}>
                Get started
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="w-full rounded-full">
              <Link to="/auth" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
