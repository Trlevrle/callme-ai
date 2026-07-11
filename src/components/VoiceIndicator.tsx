import { cn } from "@/lib/utils";

export type VoicePhase = "idle" | "listening" | "thinking" | "speaking";

interface VoiceIndicatorProps {
  phase: VoicePhase;
  voiceSupported: boolean;
  showRetryHint?: boolean;
  activeVoiceLabel?: string;
}

const phaseLabels: Record<VoicePhase, string> = {
  idle: "Ready",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
};

function getActiveTone(phase: VoicePhase) {
  if (phase === "listening") return "bg-emerald-400";
  if (phase === "thinking") return "bg-amber-400";
  if (phase === "speaking") return "bg-sky-400";
  return "bg-muted-foreground/35";
}

function getPulseTone(phase: VoicePhase) {
  if (phase === "listening") return "bg-emerald-400";
  if (phase === "thinking") return "bg-amber-400";
  if (phase === "speaking") return "bg-sky-400";
  return "bg-muted-foreground";
}

export function VoiceIndicator({
  phase,
  voiceSupported,
  showRetryHint,
  activeVoiceLabel,
}: VoiceIndicatorProps) {
  const barDelayClasses = [
    "[animation-delay:0ms]",
    "[animation-delay:80ms]",
    "[animation-delay:160ms]",
  ];
  const activeTone = getActiveTone(phase);
  const pulseTone = getPulseTone(phase);
  const isActive = phase !== "idle";

  return (
    <div className="mb-3 rounded-xl border border-border/60 bg-background/70 px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-4 items-end gap-1" aria-hidden>
            {barDelayClasses.map((delayClass, index) => (
              <span
                key={delayClass}
                className={cn(
                  "w-1 rounded-full transition-all",
                  index === 1 ? "h-4" : "h-3",
                  activeTone,
                  isActive ? "animate-typing-dot" : "opacity-40",
                  isActive ? delayClass : "",
                )}
              />
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground">
            Session ambience: {phaseLabels[phase]}
          </p>

          {showRetryHint ? (
            <span className="inline-flex items-center rounded-full border border-amber-400/35 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-amber-300">
              Retry mic
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span className="relative inline-flex size-2.5" aria-hidden>
            {phase === "thinking" ? (
              <span
                className={cn("absolute inline-flex size-2.5 animate-ping rounded-full", pulseTone)}
              />
            ) : null}
            <span className={cn("relative inline-flex size-2.5 rounded-full", pulseTone)} />
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {voiceSupported ? "voice ready" : "text mode"}
          </span>
        </div>
      </div>

      {activeVoiceLabel ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/90">
          Voice profile: {activeVoiceLabel}
        </p>
      ) : null}
    </div>
  );
}
