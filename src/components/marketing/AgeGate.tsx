import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/Wordmark";

const STORAGE_KEY = "callmeai_age_verified";

/**
 * Lightweight 18+ confirmation gate. Stored in localStorage so it does not
 * repeat on every page. Includes focus trap and ARIA attributes for
 * keyboard and screen reader accessibility.
 */
export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      setVerified(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setVerified(true);
    }
  }, []);

  // Focus trap + auto-focus when gate is visible
  useEffect(() => {
    if (verified || !isClient) return;

    // Auto-focus primary action
    confirmRef.current?.focus();

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [verified, isClient]);

  if (!isClient) return <>{children}</>;
  if (verified) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 px-4 backdrop-blur-md"
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-heading"
        aria-describedby="age-gate-desc"
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-2xl"
      >
        <div className="mb-6 flex justify-center">
          <Wordmark size="lg" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Age verification
        </p>
        <h1 id="age-gate-heading" className="mt-2 font-serif text-2xl text-foreground">
          Are you 18 or older?
        </h1>
        <p id="age-gate-desc" className="mt-3 text-sm text-muted-foreground">
          Call Me AI is a social companion for adults. You must be 18 or older to enter.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button
            ref={confirmRef}
            size="lg"
            className="w-full rounded-full"
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, "1");
              } catch {
                /* ignore */
              }
              setVerified(true);
            }}
          >
            Yes, I&rsquo;m 18 or older
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full rounded-full text-muted-foreground"
            onClick={() => {
              window.location.href = "https://www.google.com";
            }}
          >
            I&rsquo;m under 18
          </Button>
        </div>
        <p className="mt-6 text-[11px] text-muted-foreground">
          By entering, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
