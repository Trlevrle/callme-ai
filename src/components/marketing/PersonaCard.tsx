import { Link } from "@tanstack/react-router";
import { ArrowRight, Mic } from "lucide-react";
import type { Persona } from "@/lib/personas";
import { cn } from "@/lib/utils";

interface PersonaCardProps {
  persona: Persona;
  /** Show the "Start talking" CTA inside the card. */
  cta?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PersonaCard({ persona, cta = true, size = "md" }: PersonaCardProps) {
  const isLg = size === "lg";
  return (
    <Link
      to="/personas/$personaId"
      params={{ personaId: persona.id }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/60 transition-all duration-300",
        "hover:border-border hover:bg-card/90 hover:shadow-[0_30px_80px_-30px_oklch(0.68_0.24_350)]",
        isLg ? "min-h-[420px] p-7" : "min-h-[300px] p-5",
      )}
    >
      {/* accent gradient */}
      <div
        className={cn(
          "absolute inset-0 -z-10 bg-gradient-to-br opacity-30 transition-opacity duration-500 group-hover:opacity-50",
          persona.accent,
        )}
      />
      {/* portrait placeholder */}
      <div
        className={cn(
          "relative mb-5 grid place-items-center overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br",
          persona.accent,
          isLg ? "aspect-[4/5]" : "aspect-square",
        )}
      >
        <span
          className={cn(
            "font-serif italic text-foreground/60 mix-blend-screen",
            isLg ? "text-9xl" : "text-7xl",
          )}
        >
          {persona.emoji}
        </span>
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur">
          <Mic className="size-3" /> {persona.voice}
        </div>
      </div>

      <div className="flex-1">
        <h3
          className={cn(
            "font-serif italic font-medium text-foreground",
            isLg ? "text-2xl" : "text-xl",
          )}
        >
          {persona.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{persona.tagline}</p>
      </div>

      {cta && (
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
          Start talking
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      )}
    </Link>
  );
}
