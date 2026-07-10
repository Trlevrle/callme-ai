import { Link } from "@tanstack/react-router";
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

  return (
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
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
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
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-full sm:inline-flex"
              >
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link to="/auth?mode=signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
