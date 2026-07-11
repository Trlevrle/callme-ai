import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ImageIcon,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceIndicator, type VoicePhase } from "@/components/VoiceIndicator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { generateImage, sendMessage, type ChatMessage } from "@/lib/chat";
import { useAuth } from "@/hooks/useAuth";
import { useVoiceCompanion } from "@/hooks/useVoiceCompanion";
import { getPersona, type Persona } from "@/lib/personas";
import {
  clearConversation,
  loadConversation,
  loadPreferences,
  saveConversation,
  savePreferences,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/chat/$personaId")({
  component: ChatRoute,
});

function ChatRoute() {
  const navigate = useNavigate();
  const { personaId } = useParams({ from: "/chat/$personaId" });
  const { isAuthenticated, isLoading } = useAuth();
  const persona = useMemo(() => getPersona(personaId), [personaId]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>("idle");
  const [busyMessage, setBusyMessage] = useState("Thinking...");
  const [preferences, setPreferences] = useState(() => loadPreferences());
  const [muted, setMuted] = useState(false);
  const [adultUnlockOpen, setAdultUnlockOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const memoryEnabled = preferences.memoryEnabled;
  const openerChips = useMemo(() => persona?.openerChips.slice(0, 4) ?? [], [persona]);
  const activeVoiceLabel = useMemo(() => {
    const firstPattern = persona?.voiceProfile.preferredVoicePatterns[0];
    if (!firstPattern) {
      return "Auto";
    }

    return firstPattern
      .replace(/^google\s+/i, "")
      .replace(/\s+english/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }, [persona]);

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending || !persona) return;

    const userMsg: ChatMessage = {
      id: `m_${Date.now()}_u`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const historyForRequest = messages;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPending(true);
    setPhase("thinking");
    setBusyMessage(isImageRequest(trimmed) ? "Generating image..." : "Thinking...");

    try {
      if (isImageRequest(trimmed)) {
        const prompt = trimmed.replace(/^(\/image|\/pic)\s+/i, "").trim();
        const imageUrl = await generateImage(prompt || persona.imagePromptSeed, {
          allowNsfwFallback: preferences.adultTopicsModeEnabled,
        });
        await sleep(randomDelay(280, 680));
        setMessages((prev) => [
          ...prev,
          {
            id: `m_${Date.now()}_a`,
            role: "assistant",
            content: "Here you go.",
            imageUrl,
            createdAt: new Date().toISOString(),
          },
        ]);
        speakText("Here you go.");
      } else {
        const reply = await sendMessage(persona.id, historyForRequest, trimmed, {
          allowNsfwFallback: preferences.adultTopicsModeEnabled,
        });
        await sleep(randomDelay(420, 1100));
        setMessages((prev) => [...prev, reply]);
        speakText(reply.content);
      }
    } catch (err) {
      const description = err instanceof Error ? err.message : String(err);
      toast.error("That one missed the mark", {
        description: "Your companion is still here. Give it one more try.",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}_e`,
          role: "assistant",
          content: isImageRequest(trimmed)
            ? "I couldn't generate that image right now. Try a simpler prompt and I will retry."
            : "That one got lost in transit. I can try again if you rephrase it.",
          createdAt: new Date().toISOString(),
        },
      ]);
      if (!voiceSupported) {
        setBusyMessage("Voice is unavailable, but text chat is ready.");
      }
      if (description.includes("timed out")) {
        setBusyMessage("The reply took too long. Please try again.");
      }
    } finally {
      setPending(false);
      setPhase("idle");
      setTimeout(() => setBusyMessage("Thinking..."), 1200);
    }
  }

  const {
    voiceActive,
    voiceError,
    voiceState,
    noSpeechRetries,
    canRetry,
    startRecognition,
    stopRecognition,
    stopSpeaking,
    speakText,
    voiceSupported,
  } = useVoiceCompanion({
    muted,
    preferredVoiceName: preferences.voiceName,
    voiceProfile: persona?.voiceProfile,
    onTranscript: (transcript) => {
      setPhase("listening");
      setInput(transcript);
      window.setTimeout(() => {
        void sendText(transcript);
      }, 120);
    },
    onDropped: () => {
      setPhase("idle");
      setBusyMessage("Listening paused. Continue by typing or tapping the mic again.");
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/auth", search: { mode: "signin" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!persona) return;

    if (!memoryEnabled) {
      setMessages([createGreeting(persona)]);
      return;
    }

    const previous = loadConversation(persona.id);
    if (previous.length) {
      setMessages(previous);
      return;
    }

    setMessages([createGreeting(persona)]);
  }, [memoryEnabled, persona, persona?.id]);

  useEffect(() => {
    if (!persona || !memoryEnabled) return;
    saveConversation(persona.id, messages);
  }, [memoryEnabled, messages, persona, persona?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  useEffect(() => {
    return () => {
      stopRecognition();
      stopSpeaking();
    };
  }, [stopRecognition, stopSpeaking]);

  useEffect(() => {
    if (voiceState === "listening" || voiceState === "requesting-permission") {
      setPhase("listening");
      return;
    }

    if (voiceState === "speaking") {
      setPhase("speaking");
      return;
    }

    if (pending) {
      setPhase("thinking");
      return;
    }

    setPhase("idle");
  }, [pending, voiceState]);

  useEffect(() => {
    if (noSpeechRetries > 0 && canRetry) {
      setBusyMessage("No speech detected. Tap mic to retry, or continue by text.");
    }
  }, [canRetry, noSpeechRetries]);

  function onSend(e?: FormEvent) {
    e?.preventDefault();
    void sendText(input);
  }

  function clearCurrentConversation() {
    if (!persona) return;
    clearConversation(persona.id);
    setMessages([createGreeting(persona)]);
    toast("Conversation cleared", {
      description: `Starting fresh with ${persona.name}.`,
    });
  }

  function setAdultTopicsMode(checked: boolean) {
    if (checked && !preferences.adultTopicsModeEnabled) {
      setAdultUnlockOpen(true);
      return;
    }

    const next = { ...preferences, adultTopicsModeEnabled: checked };
    setPreferences(next);
    savePreferences(next);
  }

  function confirmAdultUnlock() {
    const next = { ...preferences, adultTopicsModeEnabled: true };
    setPreferences(next);
    savePreferences(next);
    setAdultUnlockOpen(false);
    toast("Adult topics mode enabled", {
      description: "Private 18+ mode is active. Safety limits still apply.",
    });
  }

  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !persona) {
    return null;
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0a0a0f]">
      <AuroraBackdrop accent={persona.accentGradientClass} />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-card/30 px-6 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            <PersonaAvatar
              persona={persona}
              className="relative size-11 shrink-0 overflow-hidden rounded-full border border-white/20"
            />

            <div className="min-w-0">
              <h2 className="truncate font-serif text-lg text-foreground">{persona.name}</h2>
              <div className="flex items-center gap-2">
                <p className="truncate text-[11px] text-muted-foreground">{persona.tagline}</p>
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
                  {persona.tier}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  online
                </span>
              </div>
              <p className="hidden max-w-md truncate text-[10px] text-muted-foreground/80 md:block">
                {persona.personalityNotes}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="mr-1 hidden items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 md:flex">
              <span className="text-[11px] font-medium text-foreground">Adult topics mode</span>
              <Switch
                checked={preferences.adultTopicsModeEnabled}
                onCheckedChange={setAdultTopicsMode}
                aria-label="Toggle adult topics mode"
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={clearCurrentConversation}
              aria-label="Clear conversation"
            >
              <Trash2 className="size-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setMuted((value) => {
                  const next = !value;
                  if (next) stopSpeaking();
                  return next;
                });
              }}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </Button>

            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/app">End call</Link>
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-3 py-2 md:hidden">
              <p className="text-[11px] text-foreground">Adult topics mode</p>
              <Switch
                checked={preferences.adultTopicsModeEnabled}
                onCheckedChange={setAdultTopicsMode}
                aria-label="Toggle adult topics mode"
              />
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] text-muted-foreground">
              Conversations stay on your device in this build. You can clear history at any time.
            </div>

            {preferences.adultTopicsModeEnabled ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-300">
                Adult topics mode is active. Illegal and harmful content remains blocked.
              </div>
            ) : null}

            {messages.map((message, index) => (
              <Fragment key={message.id}>
                {showDateDivider(messages, index) ? (
                  <DateDivider timestamp={message.createdAt} />
                ) : null}
                <MessageBubble message={message} persona={persona} />
              </Fragment>
            ))}

            {pending ? <TypingIndicator message={busyMessage} /> : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-border/60 bg-card/30 px-4 py-4 backdrop-blur-xl sm:px-8">
          {openerChips.length ? (
            <div className="mx-auto mb-2 flex w-full max-w-2xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {openerChips.map((opener) => (
                <button
                  key={opener}
                  type="button"
                  className="shrink-0 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  onClick={() => setInput(opener)}
                  disabled={pending}
                >
                  {opener}
                </button>
              ))}
            </div>
          ) : null}

          <form onSubmit={onSend} className="mx-auto flex w-full max-w-2xl flex-col gap-2">
            <VoiceIndicator
              phase={phase}
              voiceSupported={voiceSupported}
              showRetryHint={canRetry && noSpeechRetries > 0}
              activeVoiceLabel={activeVoiceLabel}
            />

            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    voiceActive
                      ? "Listening... speak now"
                      : `Message ${persona.name} - say hello or type /image <prompt>`
                  }
                  className="h-12 rounded-full border-border/60 bg-background/90 pl-4 pr-12 text-base"
                  disabled={pending}
                />
                {voiceError ? (
                  <p className="absolute -top-6 left-4 text-[11px] text-destructive">
                    {voiceError}
                  </p>
                ) : null}
              </div>

              <Button
                type="button"
                size="icon"
                variant={voiceActive ? "default" : "outline"}
                onClick={startRecognition}
                className="size-12 shrink-0 rounded-full"
                disabled={pending || !voiceSupported}
                aria-label={voiceActive ? "Stop listening" : "Start voice"}
              >
                {voiceActive ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </Button>

              <Button
                type="submit"
                size="icon"
                className="size-12 shrink-0 rounded-full"
                disabled={pending || !input.trim()}
                aria-label="Send"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </form>

          <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-muted-foreground">
            {phase === "listening" ? (
              "Listening... tap the mic again to stop."
            ) : phase === "thinking" ? (
              "Thinking..."
            ) : phase === "speaking" ? (
              "Speaking... tap mic to interrupt or just type."
            ) : (
              <em>If voice is unavailable in your browser, text chat stays fully supported.</em>
            )}
          </p>
        </div>
      </div>

      <Dialog open={adultUnlockOpen} onOpenChange={setAdultUnlockOpen}>
        <DialogContent className="border-border/60 bg-card/95 shadow-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-foreground">
              Unlock adult topics mode
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This mode is for adults only (18+). It keeps your private tone flexible while staying
              inside safety and legal boundaries.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5 text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Private mode does not bypass blocked categories.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setAdultUnlockOpen(false)}
            >
              Not now
            </Button>
            <Button type="button" className="rounded-full" onClick={confirmAdultUnlock}>
              I am 18+ - unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AuroraBackdrop({ accent }: { accent: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 aurora-bg animate-aurora opacity-35" />
      <div
        className={cn(
          "absolute -left-20 top-10 h-72 w-72 rounded-full bg-gradient-to-br blur-3xl",
          accent,
        )}
      />
      <div
        className={cn(
          "absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-gradient-to-br opacity-80 blur-3xl",
          accent,
        )}
      />
      <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:3px_3px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.68)_100%)]" />
    </div>
  );
}

function MessageBubble({ message, persona }: { message: ChatMessage; persona: Persona }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? (
        <BubbleAvatar
          label={monogram(persona.name)}
          accent={persona.accentGradientClass}
          avatarUrl={persona.avatarUrl}
        />
      ) : null}

      <div className={cn("flex max-w-[82%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-br-md border border-primary/30 bg-primary text-primary-foreground"
              : cn(
                  "rounded-bl-md border border-white/10 bg-gradient-to-br text-foreground",
                  persona.accentGradientClass,
                ),
          )}
        >
          {message.content}
        </div>

        {message.imageUrl ? (
          <img
            src={message.imageUrl}
            alt="Generated"
            loading="lazy"
            className="mt-1 max-w-[82%] rounded-2xl border border-border/60"
          />
        ) : message.role === "assistant" && message.content === "Here you go." ? (
          <div className="mt-1 flex max-w-[82%] items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
            <ImageIcon className="size-3.5" />
            <span>Creating an image...</span>
          </div>
        ) : null}
      </div>

      {isUser ? <BubbleAvatar label="You" /> : null}
    </div>
  );
}

function BubbleAvatar({
  label,
  accent,
  avatarUrl,
}: {
  label: string;
  accent?: string;
  avatarUrl?: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="Persona"
        className="size-7 shrink-0 rounded-full border border-white/15 object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full border border-white/15 text-[10px] uppercase tracking-wide",
        accent ? "bg-gradient-to-br text-foreground/80" : "bg-card text-muted-foreground",
        accent,
      )}
    >
      {label.slice(0, 1)}
    </div>
  );
}

function PersonaAvatar({ persona, className }: { persona: Persona; className?: string }) {
  if (persona.avatarUrl) {
    return (
      <img
        src={persona.avatarUrl}
        alt={persona.name}
        className={cn("object-cover", className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn(
        "grid place-items-center bg-gradient-to-br",
        persona.accentGradientClass,
        className,
      )}
    >
      <span className="absolute inset-0 animate-voice-pulse rounded-full bg-white/20" />
      <span className="relative font-serif text-sm uppercase text-foreground/85">
        {monogram(persona.name)}
      </span>
    </div>
  );
}

function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TypingIndicator({ message }: { message: string }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground" />
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground [animation-delay:300ms]" />
        <span>{message}</span>
      </div>
    </div>
  );
}

function DateDivider({ timestamp }: { timestamp: string }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <span className="h-px flex-1 bg-border/40" />
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {dayLabel(timestamp)}
      </span>
      <span className="h-px flex-1 bg-border/40" />
    </div>
  );
}

function dayLabel(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function showDateDivider(messages: ChatMessage[], index: number) {
  if (index === 0) return true;
  return !isSameDay(new Date(messages[index - 1].createdAt), new Date(messages[index].createdAt));
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(minMs: number, maxMs: number) {
  const span = Math.max(0, maxMs - minMs);
  return minMs + Math.round(Math.random() * span);
}

function createGreeting(persona: Persona): ChatMessage {
  return {
    id: `m_greet_${Date.now()}`,
    role: "assistant",
    content: persona.greeting,
    createdAt: new Date().toISOString(),
  };
}

function isImageRequest(text: string) {
  const normalized = text.toLowerCase();
  return (
    /^(\/image|\/pic)\s+/i.test(text) ||
    /\b(photo|picture|image|portrait|draw|generate a picture|send me a photo|send a photo|show me a picture|make a picture|create an image)\b/i.test(
      normalized,
    )
  );
}
