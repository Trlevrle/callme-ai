import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/auth?mode=signin" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <h1 className="font-serif text-3xl tracking-tight text-foreground">
            Settings
          </h1>

          <Section title="Account">
            <Row icon={Mail} label="Email" value={user.email} />
            <Row
              icon={Shield}
              label="Plan"
              value="Free"
              action={
                <Button asChild size="sm" className="rounded-full" variant="outline">
                  <a href="/pricing">Upgrade to Pro</a>
                </Button>
              }
            />
          </Section>

          <Section title="Privacy">
            <Row
              icon={Trash2}
              label="Delete a conversation"
              value="Per-conversation delete ships in v1.1"
            />
            <Row
              icon={Trash2}
              label="Delete all my data"
              value={
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full"
                  disabled={deleting}
                  onClick={async () => {
                    if (!confirm("Delete your account and all data? This cannot be undone.")) return;
                    setDeleting(true);
                    try {
                      // wire to blink.db delete-all helper when added
                      toast("Account deletion requested", {
                        description: "Email privacy@callmeai.io to confirm.",
                      });
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  Request deletion
                </Button>
              }
            />
          </Section>

          <Section title="Sign out">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40">
        {children}
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: typeof Mail;
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {typeof value === "string" ? value : value}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}
