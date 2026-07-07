import { HandsetMark } from "@/components/brand/Wordmark";
import { cn } from "@/lib/utils";

/**
 * Animated voice-orb hero element. Decorative SVG — not the user's mic.
 * Reads as "the call" — a soft pulsing ring around a brand mark.
 */
export function HeroVoiceOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate grid aspect-square w-full max-w-md place-items-center",
        className,
      )}
    >
      {/* aurora wash */}
      <div className="absolute inset-0 -z-10 aurora-bg animate-aurora opacity-60" />
      {/* pulse rings */}
      <span className="absolute inset-[18%] rounded-full border border-primary/30 animate-voice-pulse" />
      <span
        className="absolute inset-[18%] rounded-full border border-primary/40 animate-voice-pulse"
        style={{ animationDelay: "0.8s" }}
      />
      <span
        className="absolute inset-[18%] rounded-full border border-primary/20 animate-voice-pulse"
        style={{ animationDelay: "1.6s" }}
      />
      {/* core disc */}
      <div className="relative grid size-44 place-items-center rounded-full bg-gradient-to-br from-primary/80 to-accent/80 shadow-[0_0_80px_-20px_oklch(0.68_0.24_350)]">
        <div className="absolute inset-1 rounded-full bg-card/80 backdrop-blur-md" />
        <HandsetMark size={56} className="relative text-foreground" />
      </div>
    </div>
  );
}
