import { useState } from "react";
import { Mic, MicOff, Volume2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAMPLE_TEXT =
  "Hey, it's me. Pick up whenever you're ready. I just had the most ridiculous idea and I need to talk to someone about it.";

/**
 * Demo "voice sample" using the browser's built-in Web Speech API.
 * Real, free, no API key. Honest about being a sample — production
 * voice goes through OpenAI Realtime once the user signs in.
 */
export function VoiceSamplePlayer({ className }: { className?: string }) {
  const [state, setState] = useState<"idle" | "playing">("idle");

  function play() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SAMPLE_TEXT);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    // pick a female-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /female|samantha|victoria|karen|fiona/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      voices[0];
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => setState("idle");
    window.speechSynthesis.speak(utterance);
    setState("playing");
  }

  function stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState("idle");
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 rounded-3xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm",
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
        Try a voice sample
      </p>
      <div className="flex items-center gap-2">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "block w-1 origin-center rounded-full bg-primary/60 transition-transform duration-300",
              state === "playing" ? "animate-pulse" : "",
            )}
            style={{
              height: `${6 + Math.abs(Math.sin(i * 0.7) * 22)}px`,
              animationDelay: state === "playing" ? `${i * 60}ms` : undefined,
            }}
          />
        ))}
      </div>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        "Hey, it's me. Pick up whenever you're ready. I just had the most ridiculous idea and I need
        to talk to someone about it."
      </p>
      <div className="flex items-center gap-3">
        <Button size="lg" onClick={state === "playing" ? stop : play} className="rounded-full">
          {state === "playing" ? (
            <>
              <Pause className="size-4" /> Stop
            </>
          ) : (
            <>
              <Play className="size-4" /> Play sample
            </>
          )}
        </Button>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Volume2 className="size-3" /> Browser voice · 8s
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        <Mic className="mr-1 inline size-3" /> Real-time voice unlocks after you sign in.
        <MicOff className="ml-1 inline size-3 opacity-40" />
      </p>
    </div>
  );
}
