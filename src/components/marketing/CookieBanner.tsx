import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const COOKIE_KEY = "callmeai_cookie_ok";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(COOKIE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      // localStorage blocked — skip banner
    }
  }, []);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(COOKIE_KEY, "1");
      } catch {
        // ignore
      }
      setVisible(false);
    }, 300);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 px-4 py-3 backdrop-blur-md",
        "transition-transform duration-300",
        leaving ? "translate-y-full" : "translate-y-0",
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use essential cookies for login and functionality only. No tracking, no advertising.{" "}
          <a
            href="/privacy"
            className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
          >
            Privacy Policy
          </a>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 self-start rounded-full border border-border/70 bg-background px-5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary sm:self-auto"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
