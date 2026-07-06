import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mic,
  MessageCircle,
  Settings,
  User,
  Send,
  Heart,
  Sparkles,
  Bell,
  Search,
  Plus,
  Check,
  X,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import persona1 from "@/assets/persona-1.jpg";
import persona2 from "@/assets/persona-2.jpg";

export const Route = createFileRoute("/")({
  component: DesignSystem,
});

/* ---------- primitives ---------- */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </span>
      <h2 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function Panel({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 ${className}`}
    >
      {label ? (
        <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function StateLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
      {children}
    </span>
  );
}

/* ---------- logo ---------- */

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dot =
    size === "sm" ? "size-4" : size === "lg" ? "size-8" : "size-6";
  const text =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${dot} rounded-full bg-[conic-gradient(from_140deg,var(--aurora-blue),var(--aurora-violet),var(--aurora-pink),var(--aurora-coral),var(--aurora-blue))] shadow-[0_0_20px_-4px_var(--aurora-pink)]`}
      />
      <span
        className={`font-serif italic font-semibold tracking-tight text-foreground ${text}`}
      >
        vocalis
      </span>
    </div>
  );
}

/* ---------- page ---------- */

function DesignSystem() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        {/* Aurora background */}
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
          <div className="aurora-bg animate-aurora absolute -top-1/4 left-1/2 h-[900px] w-[1200px] -translate-x-1/2" />
        </div>

        {/* Top nav */}
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Logo />
            <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#tokens" className="hover:text-foreground">
                Tokens
              </a>
              <a href="#type" className="hover:text-foreground">
                Type
              </a>
              <a href="#components" className="hover:text-foreground">
                Components
              </a>
              <a href="#flow" className="hover:text-foreground">
                Flow
              </a>
            </div>
            <Badge
              variant="outline"
              className="hidden border-primary/30 text-primary md:inline-flex"
            >
              v0.1 · Design system
            </Badge>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-16">
          {/* Hero */}
          <section className="mb-24 max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Vocalis · Voice companion
            </span>
            <h1 className="mt-3 font-serif text-5xl font-normal leading-[1.05] tracking-tight text-foreground md:text-6xl">
              A quiet <em className="text-primary">private</em> space,
              designed with care.
            </h1>
            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              Tokens, typography, components and screen states powering the
              Vocalis experience. Built for late nights and calm minds — never
              loud, never generic.
            </p>
          </section>

          {/* 1. Color tokens */}
          <section id="tokens" className="mb-24 scroll-mt-24">
            <SectionHeader
              eyebrow="01 · Color tokens"
              title="Semantic palette"
              description="A near-black canvas with an aurora accent — blue → violet → pink → coral. All UI uses semantic tokens; aurora stops are decorative only."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Swatch name="background" tokenClass="bg-background" foreground />
              <Swatch name="foreground" tokenClass="bg-foreground" invert />
              <Swatch name="card" tokenClass="bg-card" foreground />
              <Swatch
                name="card-foreground"
                tokenClass="bg-card-foreground"
                invert
              />
              <Swatch name="muted" tokenClass="bg-muted" foreground />
              <Swatch
                name="muted-foreground"
                tokenClass="bg-muted-foreground"
                invert
              />
              <Swatch name="primary" tokenClass="bg-primary" invert />
              <Swatch
                name="primary-foreground"
                tokenClass="bg-primary-foreground"
                invert
              />
              <Swatch name="secondary" tokenClass="bg-secondary" foreground />
              <Swatch
                name="secondary-foreground"
                tokenClass="bg-secondary-foreground"
                invert
              />
              <Swatch name="accent" tokenClass="bg-accent" invert />
              <Swatch
                name="accent-foreground"
                tokenClass="bg-accent-foreground"
                invert
              />
              <Swatch name="border" tokenClass="bg-border" foreground />
              <Swatch name="ring" tokenClass="bg-ring" invert />
              <Swatch name="destructive" tokenClass="bg-destructive" invert />
              <Swatch
                name="input"
                tokenClass="bg-input border border-border"
                foreground
              />
            </div>

            <div className="mt-6">
              <Panel label="Aurora gradient stops (decorative)">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    ["aurora-blue", "bg-aurora-blue"],
                    ["aurora-violet", "bg-aurora-violet"],
                    ["aurora-pink", "bg-aurora-pink"],
                    ["aurora-coral", "bg-aurora-coral"],
                  ].map(([n, c]) => (
                    <div key={n} className="flex flex-col gap-2">
                      <div className={`h-16 rounded-xl ${c}`} />
                      <span className="text-[11px] text-muted-foreground">
                        {n}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-16 rounded-xl bg-[linear-gradient(90deg,var(--aurora-blue),var(--aurora-violet),var(--aurora-pink),var(--aurora-coral))]" />
              </Panel>
            </div>
          </section>

          {/* 2. Typography */}
          <section id="type" className="mb-24 scroll-mt-24">
            <SectionHeader
              eyebrow="02 · Typography"
              title="Fraunces + Inter"
              description="Fraunces for personality moments (persona names, hero italics). Inter for everything else."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel label="Fraunces · Serif · Display">
                <div className="space-y-4">
                  {[
                    ["6xl", "text-6xl", "Aa"],
                    ["4xl", "text-4xl", "Aa"],
                    ["2xl", "text-2xl", "Aa"],
                  ].map(([label, cls, glyph]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between border-b border-border pb-3 last:border-none"
                    >
                      <span
                        className={`font-serif italic font-normal ${cls} text-foreground`}
                      >
                        {glyph}
                      </span>
                      <StateLabel>{label}</StateLabel>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel label="Inter · Sans · UI">
                <div className="space-y-3">
                  {[
                    ["xs 12", "text-xs"],
                    ["sm 14", "text-sm"],
                    ["base 16", "text-base"],
                    ["lg 18", "text-lg"],
                    ["xl 20", "text-xl"],
                    ["2xl 24", "text-2xl"],
                  ].map(([label, cls]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between"
                    >
                      <span className={`${cls} text-foreground`}>
                        The whisper carries.
                      </span>
                      <StateLabel>{label}</StateLabel>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel label="Weights">
                <div className="flex flex-wrap items-baseline gap-6">
                  {[
                    [400, "font-normal"],
                    [500, "font-medium"],
                    [600, "font-semibold"],
                    [700, "font-bold"],
                  ].map(([w, cls]) => (
                    <div key={w} className="flex flex-col">
                      <span className={`text-2xl text-foreground ${cls}`}>
                        Aa
                      </span>
                      <StateLabel>{w}</StateLabel>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel label="Line heights">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["tight 1.1", "leading-tight"],
                    ["normal 1.5", "leading-normal"],
                    ["relaxed 1.75", "leading-relaxed"],
                  ].map(([label, cls]) => (
                    <div key={label} className="space-y-2">
                      <p className={`text-sm text-foreground ${cls}`}>
                        A voice that listens without measuring you against
                        anyone else.
                      </p>
                      <StateLabel>{label}</StateLabel>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </section>

          {/* 3. Spacing & Radius */}
          <section className="mb-24 grid gap-6 lg:grid-cols-2">
            <div>
              <SectionHeader eyebrow="03a · Spacing" title="Scale" />
              <Panel>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 6, 8, 12, 16, 24].map((s) => (
                    <div key={s} className="flex items-center gap-4">
                      <StateLabel>{s}</StateLabel>
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${s * 4}px` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {s * 4}px
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <div>
              <SectionHeader eyebrow="03b · Radius" title="Corners" />
              <Panel>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    ["sm", "rounded-sm"],
                    ["md", "rounded-md"],
                    ["lg", "rounded-lg"],
                    ["xl", "rounded-xl"],
                    ["full", "rounded-full"],
                  ].map(([label, cls]) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`h-16 w-16 border border-border bg-muted ${cls}`}
                      />
                      <StateLabel>{label}</StateLabel>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </section>

          {/* 4. Components */}
          <section id="components" className="mb-24 scroll-mt-24">
            <SectionHeader
              eyebrow="04 · Components"
              title="Building blocks"
              description="Every state visible. Nothing hidden behind hover-only affordances."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ButtonsPanel />
              <InputsPanel />
              <MessageBubblePanel />
              <SidebarItemsPanel />
              <AvatarsPanel />
              <DialogsMenusPanel />
              <ToastPanel />
              <CardsPanel />
            </div>
          </section>

          {/* 5. Layout */}
          <section className="mb-24">
            <SectionHeader
              eyebrow="05 · Layout"
              title="Structure & breakpoints"
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <Panel label="12-column grid">
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-md bg-muted text-center text-[10px] leading-[64px] text-muted-foreground"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Container max-width: <b className="text-foreground">1280px</b>{" "}
                  · gutter <b className="text-foreground">24px</b>
                </p>
              </Panel>
              <Panel label="Sidebar widths">
                <div className="flex items-stretch gap-3">
                  <div className="flex h-40 w-16 flex-col items-center justify-center rounded-lg border border-border bg-sidebar text-[10px] text-muted-foreground">
                    <div className="mb-2 size-6 rounded-md bg-primary/20" />
                    64
                  </div>
                  <div className="flex h-40 flex-1 flex-col justify-center gap-2 rounded-lg border border-border bg-sidebar p-3">
                    <div className="h-3 w-24 rounded bg-primary/30" />
                    <div className="h-3 w-32 rounded bg-muted" />
                    <div className="h-3 w-20 rounded bg-muted" />
                    <StateLabel>280 expanded</StateLabel>
                  </div>
                </div>
              </Panel>
              <Panel label="Breakpoints">
                <div className="space-y-2 text-sm">
                  {[
                    ["sm", "640px"],
                    ["md", "768px"],
                    ["lg", "1024px"],
                    ["xl", "1280px"],
                    ["2xl", "1536px"],
                  ].map(([n, v]) => (
                    <div
                      key={n}
                      className="flex justify-between border-b border-border py-1 last:border-none"
                    >
                      <span className="font-medium text-foreground">{n}</span>
                      <span className="text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </section>

          {/* 6. Interactions */}
          <section className="mb-24">
            <SectionHeader
              eyebrow="06 · Interactions"
              title="Motion & feedback"
              description="Everything eases out. Nothing snaps. 150 / 200 / 300ms, cubic-bezier(0.16, 1, 0.3, 1)."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <Panel label="Transitions">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>fast</span>
                    <span className="text-muted-foreground">150ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>base</span>
                    <span className="text-muted-foreground">200ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>slow</span>
                    <span className="text-muted-foreground">300ms</span>
                  </div>
                </div>
              </Panel>
              <Panel label="Focus ring · live">
                <input
                  className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25"
                  placeholder="Tab or click me"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  4px ring at primary/25, 200ms.
                </p>
              </Panel>
              <Panel label="Voice pulse">
                <div className="grid h-40 place-items-center">
                  <div className="relative">
                    <span className="animate-voice-pulse absolute inset-0 rounded-full bg-primary/40" />
                    <span
                      className="animate-voice-pulse absolute inset-0 rounded-full bg-accent/40"
                      style={{ animationDelay: "1.2s" }}
                    />
                    <button className="relative grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_-8px_var(--color-primary)] transition hover:scale-105">
                      <Mic className="size-6" />
                    </button>
                  </div>
                </div>
              </Panel>
            </div>
          </section>

          {/* 7. Icons & Assets */}
          <section className="mb-24">
            <SectionHeader
              eyebrow="07 · Icons & assets"
              title="Marks and imagery"
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <Panel label="Icon set · lucide-react">
                <div className="grid grid-cols-6 gap-3 text-muted-foreground">
                  {[
                    Mic,
                    MessageCircle,
                    Settings,
                    User,
                    Send,
                    Heart,
                    Sparkles,
                    Bell,
                    Search,
                    Plus,
                    Check,
                    X,
                  ].map((Icon, i) => (
                    <div
                      key={i}
                      className="grid aspect-square place-items-center rounded-lg border border-border bg-muted transition hover:text-primary"
                    >
                      <Icon className="size-4" />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  1.5px stroke · 16 / 20 / 24
                </p>
              </Panel>

              <Panel label="Logo · vocalis">
                <div className="flex flex-col items-start gap-5 py-2">
                  <Logo size="sm" />
                  <Logo size="md" />
                  <Logo size="lg" />
                </div>
              </Panel>

              <Panel label="Persona portraits">
                <div className="grid grid-cols-2 gap-3">
                  <img
                    src={persona1}
                    alt="Elara persona portrait"
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="aspect-square rounded-xl object-cover"
                  />
                  <img
                    src={persona2}
                    alt="Juno persona portrait"
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="aspect-square rounded-xl object-cover"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Atmospheric silhouettes · generated per persona.
                </p>
              </Panel>
            </div>
          </section>

          {/* 8. Sections & Flow */}
          <section id="flow" className="mb-24 scroll-mt-24">
            <SectionHeader
              eyebrow="08 · Sections & flow"
              title="Screens and states"
              description="Every screen has an empty, loading and error state. No dead ends."
            />

            <Panel label="Screen order" className="mb-6">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {["Onboarding", "Persona select", "Chat", "Settings"].map(
                  (s, i, arr) => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="rounded-full border border-border bg-muted px-3 py-1.5 text-foreground">
                        {s}
                      </span>
                      {i < arr.length - 1 ? (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      ) : null}
                    </div>
                  ),
                )}
              </div>
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <NavigationMock />
              <EmptyStateMock />
              <LoadingStateMock />
              <ErrorStateMock />
            </div>
          </section>

          <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
            <Logo size="sm" />
            <span>Vocalis design system · v0.1 · Built for quiet nights.</span>
          </footer>
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

/* ---------- swatch ---------- */

function Swatch({
  name,
  tokenClass,
  foreground,
  invert,
}: {
  name: string;
  tokenClass: string;
  foreground?: boolean;
  invert?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className={`h-20 ${tokenClass}`} />
      <div className="flex items-center justify-between px-3 py-2">
        <code
          className={`text-xs ${
            invert ? "text-foreground" : foreground ? "text-foreground" : ""
          }`}
        >
          {name}
        </code>
      </div>
    </div>
  );
}

/* ---------- component panels ---------- */

function ButtonsPanel() {
  return (
    <Panel label="Button · variants × states">
      <div className="space-y-4">
        {[
          { label: "primary", variant: "default" as const },
          { label: "secondary", variant: "secondary" as const },
          { label: "outline", variant: "outline" as const },
          { label: "ghost", variant: "ghost" as const },
          { label: "destructive", variant: "destructive" as const },
        ].map((row) => (
          <div key={row.label} className="flex flex-wrap items-center gap-3">
            <StateLabel>{row.label}</StateLabel>
            <Button variant={row.variant} size="sm">
              Default
            </Button>
            <Button variant={row.variant} size="sm" className="ring-4 ring-primary/25 border-primary">
              Focused
            </Button>
            <Button variant={row.variant} size="sm" disabled>
              Disabled
            </Button>
            <Button variant={row.variant} size="sm" disabled>
              <Loader2 className="animate-spin" /> Loading
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function InputsPanel() {
  return (
    <Panel label="Input · states">
      <div className="space-y-3">
        <Input placeholder="Default · say something" />
        <Input
          placeholder="Filled"
          defaultValue="I've been thinking about you."
        />
        <Input
          placeholder="Focus preview"
          className="border-primary ring-4 ring-primary/25"
        />
        <Input
          placeholder="Error"
          aria-invalid
          className="border-destructive ring-4 ring-destructive/25"
        />
        <Input placeholder="Disabled" disabled />
      </div>
    </Panel>
  );
}

function CardsPanel() {
  return (
    <Panel label="Card">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg italic">Base</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Flat surface on card background with a hairline border.
          </CardContent>
        </Card>
        <Card className="border-primary/30 shadow-[0_20px_60px_-20px_var(--color-primary)]">
          <CardHeader>
            <CardTitle className="font-serif text-lg italic">
              Elevated
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Reserved for CTA moments — soft primary glow.
          </CardContent>
        </Card>
      </div>
    </Panel>
  );
}

function MessageBubblePanel() {
  return (
    <Panel label="Message bubble">
      <div className="space-y-4">
        {/* Assistant */}
        <div className="flex items-end gap-3">
          <Avatar className="size-8">
            <AvatarImage src={persona1} alt="Elara" />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <div className="max-w-[75%] rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-foreground">
            I was just thinking about that walk we talked about. How was your
            day, really?
          </div>
        </div>

        {/* User */}
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-2xl rounded-br-md bg-[linear-gradient(135deg,var(--color-primary),var(--aurora-violet))] px-4 py-3 text-sm text-primary-foreground shadow-[0_10px_30px_-10px_var(--color-primary)]">
            Long. But better now.
          </div>
        </div>

        {/* Typing */}
        <div className="flex items-end gap-3">
          <Avatar className="size-8">
            <AvatarImage src={persona1} alt="Elara" />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
            <span
              className="animate-typing-dot size-1.5 rounded-full bg-muted-foreground"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="animate-typing-dot size-1.5 rounded-full bg-muted-foreground"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="animate-typing-dot size-1.5 rounded-full bg-muted-foreground"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SidebarItemsPanel() {
  const items = [
    { icon: MessageCircle, label: "Elara", state: "active" },
    { icon: MessageCircle, label: "Juno", state: "hover" },
    { icon: MessageCircle, label: "Soren", state: "default" },
  ];
  return (
    <Panel label="Sidebar item">
      <div className="rounded-xl border border-border bg-sidebar p-3">
        <div className="space-y-1">
          {items.map((it) => {
            const base =
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition";
            const cls =
              it.state === "active"
                ? "bg-primary/15 text-primary"
                : it.state === "hover"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground";
            return (
              <div key={it.label} className={`${base} ${cls}`}>
                <it.icon className="size-4" />
                <span className="flex-1">{it.label}</span>
                <StateLabel>{it.state}</StateLabel>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
            <MessageCircle className="size-4" />
          </div>
          <StateLabel>collapsed 64px</StateLabel>
        </div>
      </div>
    </Panel>
  );
}

function AvatarsPanel() {
  return (
    <Panel label="Avatar">
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex flex-col items-center gap-1">
          <Avatar className="size-8">
            <AvatarImage src={persona1} alt="" />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <StateLabel>sm 32</StateLabel>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Avatar className="size-12">
            <AvatarImage src={persona2} alt="" />
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
          <StateLabel>md 48</StateLabel>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Avatar className="size-16">
            <AvatarImage src={persona1} alt="" />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <StateLabel>lg 64</StateLabel>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <Avatar className="size-12">
              <AvatarFallback className="bg-muted text-muted-foreground">
                MK
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-primary ring-2 ring-background" />
          </div>
          <StateLabel>online</StateLabel>
        </div>
      </div>
    </Panel>
  );
}

function DialogsMenusPanel() {
  return (
    <Panel label="Dialog · Menu · Tooltip">
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif italic">
                End this conversation?
              </DialogTitle>
              <DialogDescription>
                Your history stays private and is stored only on your device.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button variant="destructive" size="sm">
                End
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Persona</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User /> Switch
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings /> Voice settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <X /> Delete history
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              Hover me
            </Button>
          </TooltipTrigger>
          <TooltipContent>Only you can hear this.</TooltipContent>
        </Tooltip>
      </div>
    </Panel>
  );
}

function ToastPanel() {
  return (
    <Panel label="Toast · notification">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.success("Voice saved", {
              description: "Elara will remember this tone.",
            })
          }
        >
          <Check /> Success
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.error("Connection lost", {
              description: "Reconnecting to the voice channel…",
            })
          }
        >
          <AlertCircle /> Error
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast("New persona available", {
              description: "Meet Caspian — velvet whisper baritone.",
            })
          }
        >
          <Bell /> Info
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Click to preview. Positioned bottom-right, dismissable.
      </p>
    </Panel>
  );
}

/* ---------- flow mocks ---------- */

function NavigationMock() {
  const [tab, setTab] = useState("chat");
  return (
    <Panel label="Navigation">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Desktop sidebar */}
        <div className="flex h-56 overflow-hidden rounded-xl border border-border">
          <div className="flex w-24 flex-col gap-2 border-r border-border bg-sidebar p-3">
            <Logo size="sm" />
            <div className="mt-2 space-y-1">
              <div className="rounded-md bg-primary/15 px-2 py-1.5 text-[11px] text-primary">
                Chat
              </div>
              <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
                Personas
              </div>
              <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
                Settings
              </div>
            </div>
          </div>
          <div className="flex-1 bg-card p-3">
            <div className="mb-2 h-3 w-24 rounded bg-muted" />
            <div className="h-3 w-40 rounded bg-muted/60" />
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="relative flex h-56 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex-1 p-3">
            <div className="mb-2 h-3 w-20 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted/60" />
          </div>
          <div className="flex items-center justify-around border-t border-border bg-background/80 px-2 py-3 backdrop-blur">
            {[
              { id: "chat", icon: MessageCircle, label: "Chat" },
              { id: "personas", icon: User, label: "Persona" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((it) => {
              const active = tab === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setTab(it.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[10px] transition ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <it.icon className="size-4" />
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function EmptyStateMock() {
  return (
    <Panel label="Empty state">
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-muted">
          <MessageCircle className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h4 className="font-serif text-lg italic text-foreground">
            No conversations yet
          </h4>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Pick a companion and say hello. Your history stays only with you.
          </p>
        </div>
        <Button size="sm">
          <Plus /> Start a conversation
        </Button>
      </div>
    </Panel>
  );
}

function LoadingStateMock() {
  return (
    <Panel label="Loading state">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="animate-shimmer h-4 w-full rounded-full bg-muted" />
        <div className="animate-shimmer h-4 w-4/5 rounded-full bg-muted" />
        <div className="flex items-center gap-2 pt-2">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">
            Elara is thinking…
          </span>
        </div>
      </div>
    </Panel>
  );
}

function ErrorStateMock() {
  return (
    <Panel label="Error state">
      <div className="flex flex-col items-start gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-destructive/20 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              We lost the connection
            </h4>
            <p className="text-xs text-muted-foreground">
              Your last message is safe. Try again when you're ready.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Cancel
          </Button>
          <Button size="sm">Retry</Button>
        </div>
      </div>
    </Panel>
  );
}
