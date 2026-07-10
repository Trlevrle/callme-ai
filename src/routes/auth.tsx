import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/Wordmark";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Shield } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: (search.mode as "signin" | "signup" | undefined) ?? "signin",
  }),
  head: () => ({
    meta: [{ title: "Sign in — Call Me AI" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = useSearch({ from: "/auth" });
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  function handleManagedSignIn() {
    setPending(true);
    signIn({
      id: `user_${Date.now()}`,
      name: "Call Me AI User",
      displayName: "You",
      email: "you@local.session",
    });
    navigate({ to: "/app" });
  }

  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <a href="/" className="inline-flex">
          <Wordmark size="md" />
        </a>

        <div className="m-auto w-full max-w-sm">
          <h1 className="font-serif text-3xl text-foreground">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Get started in under a minute. Free to try, no credit card required."
              : "Sign in to continue your conversations."}
          </p>

          <div className="mt-8 space-y-3">
            <Button
              size="lg"
              className="w-full rounded-full"
              onClick={handleManagedSignIn}
              disabled={pending}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              Continue with email
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              You'll receive a magic link to sign in.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-4 text-xs text-muted-foreground">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Shield className="size-3.5 text-primary" /> 18+ only
            </p>
            <p className="mt-1">
              By continuing you confirm you're 18 or older and agree to our{" "}
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <a href="/auth?mode=signin" className="text-foreground underline">
                  Sign in
                </a>
              </>
            ) : (
              <>
                New here?{" "}
                <a href="/auth?mode=signup" className="text-foreground underline">
                  Create an account
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right — visual */}
      <div className="relative hidden overflow-hidden bg-card/40 md:block">
        <div className="aurora-bg animate-aurora absolute inset-0 opacity-50" />
        <div className="absolute inset-0 grid place-items-center p-12">
          <div className="max-w-md space-y-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Product preview
            </p>
            <p className="font-serif text-3xl italic leading-snug text-foreground">
              "Private AI companion conversations, available whenever you need them."
            </p>
            <p className="text-sm text-muted-foreground">
              Personal voice assistant functionality for ongoing voice and text conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
