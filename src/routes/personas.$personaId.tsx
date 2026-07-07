import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowRight, Mic, MessageSquare, ImagePlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPersona } from "@/lib/personas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/personas/$personaId")({
  component: PersonaDetail,
});

function PersonaDetail() {
  const { personaId } = useParams({ from: "/personas/$personaId" });
  const persona = getPersona(personaId);

  if (!persona) {
    return (
      <div className="grid h-full place-items-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Persona not found</p>
          <Button asChild className="mt-4 rounded-full" size="sm">
            <Link to="/app">Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-[1fr_1.2fr]">
        <div
          className={cn(
            "relative grid aspect-[4/5] place-items-center overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br",
            persona.accent,
          )}
        >
          <span className="font-serif italic text-[12rem] text-foreground/40">
            {persona.emoji}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Persona
          </p>
          <h1 className="mt-2 font-serif text-5xl tracking-tight text-foreground">
            {persona.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{persona.tagline}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            <Mic className="mr-1 inline size-3" />
            {persona.voice}
          </p>

          <ul className="mt-6 space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-primary" />
              Real-time voice, end-to-end streamed
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-primary" />
              Remembers details from earlier conversations
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-primary" />
              Will send a picture if you ask in chat
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/chat/$personaId" params={{ personaId: persona.id }}>
                Start a call <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/app">Back to personas</Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <Hint icon={Mic} label="Real-time voice" />
            <Hint icon={MessageSquare} label="Text fallback" />
            <Hint icon={ImagePlus} label="Photos in chat" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Hint({
  icon: Icon,
  label,
}: {
  icon: typeof Mic;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-2.5 py-2">
      <Icon className="size-3.5 text-primary" />
      {label}
    </div>
  );
}
