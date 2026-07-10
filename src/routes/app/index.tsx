import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Mic, History, MessageSquare, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personas } from "@/lib/personas";
import { useAuth } from "@/hooks/useAuth";
import { clearAllConversations, clearConversation, listConversations } from "@/lib/storage";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

function AppHome() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(() => listConversations());

  useEffect(() => {
    setConversations(listConversations());
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-muted-foreground">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ""}.
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-foreground">
          Who's on the other end tonight?
        </h1>
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          Privacy note: conversations stay on your device in this build, and you can clear all
          history at any time.
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {personas.map((p) => (
            <Link
              key={p.id}
              to="/personas/$personaId"
              params={{ personaId: p.id }}
              className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 transition-all hover:border-border hover:bg-card"
            >
              <div
                className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${p.accent} text-2xl`}
              >
                <span className="font-serif italic text-foreground/70">{p.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg text-foreground">{p.name}</h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.tagline}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary">
                  <Mic className="size-3" /> {p.voice}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {conversations.length > 0 && (
          <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">Recent conversations</p>
                <p className="text-xs text-muted-foreground">Pick up where you left off.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    clearAllConversations();
                    setConversations([]);
                    toast("History cleared", {
                      description: "All saved local conversations were removed.",
                    });
                  }}
                >
                  Clear all
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/settings">Manage</Link>
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {conversations.map((conversation) => {
                const persona = personas.find((item) => item.id === conversation.personaId);
                return (
                  <div
                    key={conversation.personaId}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5"
                  >
                    <Link
                      to="/chat/$personaId"
                      params={{ personaId: conversation.personaId }}
                      className="min-w-0 flex-1"
                    >
                      <p className="truncate text-sm text-foreground">
                        {persona?.name ?? conversation.personaId}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        Updated {new Date(conversation.updatedAt).toLocaleDateString()}
                      </p>
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => {
                        clearConversation(conversation.personaId);
                        setConversations((prev) =>
                          prev.filter((item) => item.personaId !== conversation.personaId),
                        );
                      }}
                      aria-label={`Clear ${persona?.name ?? conversation.personaId}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <FeatureHint icon={MessageSquare} label="Voice or text, your call" />
          <FeatureHint icon={ImagePlus} label="Ask for a picture mid-chat" />
          <FeatureHint icon={History} label="Your history is saved" />
        </div>
      </div>
    </div>
  );
}

function FeatureHint({ icon: Icon, label }: { icon: typeof Plus; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-primary" />
      {label}
    </div>
  );
}
