import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  clearAllConversations,
  loadPreferences,
  savePreferences,
  type AppPreferences,
} from "@/lib/storage";
import { LogOut, Mail, Shield, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [preferences, setPreferences] = useState<AppPreferences>(() => loadPreferences());
  const [voiceOptions, setVoiceOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/auth", search: { mode: "signin" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const updateVoices = () => {
      const names = window.speechSynthesis.getVoices().map((voice) => voice.name);
      setVoiceOptions(Array.from(new Set(names)).sort());
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
  }, []);

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
          <h1 className="font-serif text-3xl tracking-tight text-foreground">Settings</h1>

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

          <Section title="Companion defaults">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Sparkles className="size-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">Remember my recent chats</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Your last conversations stay available when you come back.
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.memoryEnabled}
                onCheckedChange={(checked) => {
                  const next = { ...preferences, memoryEnabled: checked };
                  setPreferences(next);
                  savePreferences(next);
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Shield className="size-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">Adult topics mode</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Allows mature themes. Illegal and harmful content is still blocked.
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.adultTopicsModeEnabled}
                onCheckedChange={(checked) => {
                  const next = { ...preferences, adultTopicsModeEnabled: checked };
                  setPreferences(next);
                  savePreferences(next);
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Shield className="size-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">Default tone</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Soft, playful, or direct depending on the mood.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {(["soft", "playful", "direct"] as const).map((tone) => (
                  <Button
                    key={tone}
                    size="sm"
                    variant={preferences.defaultTone === tone ? "default" : "outline"}
                    className="rounded-full capitalize"
                    onClick={() => {
                      const next = { ...preferences, defaultTone: tone };
                      setPreferences(next);
                      savePreferences(next);
                    }}
                  >
                    {tone}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Sparkles className="size-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">Voice preference</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Choose the speaking voice used during playback.
                  </p>
                </div>
              </div>
              <select
                className="max-w-[220px] rounded-lg border border-border/60 bg-background px-2 py-1 text-xs text-foreground"
                value={preferences.voiceName ?? "auto"}
                onChange={(event) => {
                  const next = {
                    ...preferences,
                    voiceName: event.target.value === "auto" ? undefined : event.target.value,
                  };
                  setPreferences(next);
                  savePreferences(next);
                }}
              >
                <option value="auto">Automatic</option>
                {voiceOptions.map((voiceName) => (
                  <option key={voiceName} value={voiceName}>
                    {voiceName}
                  </option>
                ))}
              </select>
            </div>
          </Section>

          <Section title="Privacy">
            <Row
              icon={Trash2}
              label="Delete a conversation"
              value="Per-conversation delete is available from the chat screen"
            />
            <Row
              icon={Trash2}
              label="Delete all my data"
              value={
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      clearAllConversations();
                      toast("Local history cleared", {
                        description: "Your saved device conversations were removed.",
                      });
                    }}
                  >
                    Clear history
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-full"
                    disabled={deleting}
                    onClick={async () => {
                      if (!confirm("Delete your account and all data? This cannot be undone."))
                        return;
                      setDeleting(true);
                      try {
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
                </div>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
