import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Settings, LogOut, MessageCircle, Sparkles, Mic, MicOff, History } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { personas } from "@/lib/personas";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [collapsed, setCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border/60 bg-card/30 transition-[width] duration-200",
          collapsed ? "w-[68px]" : "w-[260px]",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-3">
          <Link to="/" className="flex items-center">
            {collapsed ? <Wordmark size="sm" /> : <Wordmark size="sm" />}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={collapsed ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {!collapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Start
            </p>
          )}
          <Link
            to="/personas"
            className="mb-3 flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            {!collapsed && <span>New call</span>}
          </Link>

          {!collapsed && (
            <p className="mb-2 mt-4 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Personas
            </p>
          )}
          <nav className="space-y-1">
            {personas.map((p) => {
              const active = routerState.location.pathname.includes(`/personas/${p.id}`) ||
                routerState.location.pathname.includes(`/chat/${p.id}`);
              return (
                <Link
                  key={p.id}
                  to="/personas/$personaId"
                  params={{ personaId: p.id }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br text-base" data-accent={p.accent}>
                    <span className="font-serif italic text-foreground/70">{p.emoji}</span>
                  </span>
                  {!collapsed && <span className="truncate">{p.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer pinned to bottom */}
        <div className="border-t border-border/60 p-3">
          <Link
            to="/settings"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings className="size-4" />
            {!collapsed && <span>Settings</span>}
          </Link>
          {user && !collapsed && (
            <div className="mt-2 flex items-center gap-2 rounded-lg px-2 py-2">
              <div className="grid size-7 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                {(user.displayName || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {user.displayName || "You"}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="size-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
