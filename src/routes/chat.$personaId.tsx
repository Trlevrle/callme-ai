import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ImageIcon, Loader2, Mic, MicOff, Send, Trash2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { generateImage, sendMessage, type ChatMessage } from "@/lib/chat";
import { useAuth } from "@/hooks/useAuth";
import { useVoiceCompanion } from "@/hooks/useVoiceCompanion";
import { getPersona } from "@/lib/personas";
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
  const [phase, setPhase] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [busyMessage, setBusyMessage] = useState("Thinking...");
  const [preferences, setPreferences] = useState(() => loadPreferences());
  const memoryEnabled = preferences.memoryEnabled;
  const [muted, setMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        const imageUrl = await generateImage(prompt || `A portrait of ${persona.name}`, {
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
    speaking,
    startRecognition,
    stopRecognition,
    stopSpeaking,
    speakText,
    voiceSupported,
  } = useVoiceCompanion({
    muted,
    preferredVoiceName: preferences.voiceName,
    voiceRate: preferences.voiceRate,
    voicePitch: preferences.voicePitch,
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
      setMessages([createGreeting(persona.id, persona.name)]);
      return;
    }

    const previous = loadConversation(persona.id);
    if (previous.length) {
      setMessages(previous);
      return;
    }

    setMessages([createGreeting(persona.id, persona.name)]);
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
    if (voiceActive) {
      setPhase("listening");
      return;
    }

    if (speaking) {
      setPhase("speaking");
      return;
    }

    if (!pending) {
      setPhase("idle");
    }
  }, [pending, speaking, voiceActive]);

  function onSend(e?: FormEvent) {
    e?.preventDefault();
    void sendText(input);
  }

  function clearCurrentConversation() {
    if (!persona) return;
    clearConversation(persona.id);
    setMessages([createGreeting(persona.id, persona.name)]);
    toast("Conversation cleared", {
      description: `Starting fresh with ${persona.name}.`,
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
    <div className="flex h-full flex-col bg-gradient-to-b from-background via-background to-card/20">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-card/40 px-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-10 place-items-center rounded-full bg-gradient-to-br text-xl",
              persona.accent,
            )}
          >
            <span className="font-serif italic text-foreground/70">{persona.emoji}</span>
          </div>
          <div>
            <h2 className="font-serif text-lg text-foreground">{persona.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-[11px] text-muted-foreground">{persona.tagline}</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-1 hidden items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 md:flex">
            <span className="text-[11px] font-medium text-foreground">Adult topics mode</span>
            <Switch
              checked={preferences.adultTopicsModeEnabled}
              onCheckedChange={(checked) => {
                const next = { ...preferences, adultTopicsModeEnabled: checked };
                setPreferences(next);
                savePreferences(next);
              }}
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

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-3 py-2 md:hidden">
            <p className="text-[11px] text-foreground">Adult topics mode</p>
            <Switch
              checked={preferences.adultTopicsModeEnabled}
              onCheckedChange={(checked) => {
                const next = { ...preferences, adultTopicsModeEnabled: checked };
                setPreferences(next);
                savePreferences(next);
              }}
              aria-label="Toggle adult topics mode"
            />
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] text-muted-foreground">
            Conversations stay on your device in this build. You can clear history any time.
          </div>
          {preferences.adultTopicsModeEnabled ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-300">
              Adult topics mode is active. Illegal and harmful content remains blocked.
            </div>
          ) : null}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {pending && <TypingIndicator message={busyMessage} />}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 bg-card/40 px-4 py-4 sm:px-8">
        <form onSubmit={onSend} className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          <div className="mb-3 flex w-full items-center gap-2">
            <span
              className={cn(
                "size-2.5 rounded-full transition-all",
                phase === "listening" ? "animate-pulse bg-emerald-400" : "bg-emerald-400/30",
              )}
            />
            <span
              className={cn(
                "size-2.5 rounded-full transition-all",
                phase === "thinking" ? "animate-pulse bg-amber-400" : "bg-amber-400/30",
              )}
            />
            <span
              className={cn(
                "size-2.5 rounded-full transition-all",
                phase === "speaking" ? "animate-pulse bg-sky-400" : "bg-sky-400/30",
              )}
            />
            <p className="text-[11px] text-muted-foreground">
              Session ambience: listen, think, speak
            </p>
          </div>
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
                className="h-12 rounded-full border-border/60 bg-background pl-4 pr-12 text-base"
                disabled={pending}
              />
              {voiceError && (
                <p className="absolute -top-6 left-4 text-[11px] text-destructive">{voiceError}</p>
              )}
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
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-muted-foreground">
          {phase === "listening"
            ? "Listening... tap the mic again to stop."
            : phase === "thinking"
              ? "Thinking..."
              : phase === "speaking"
                ? "Speaking... tap mic to interrupt or just type."
                : "If voice is unavailable in your browser, text chat stays fully supported."}
        </p>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(minMs: number, maxMs: number) {
  const span = Math.max(0, maxMs - minMs);
  return minMs + Math.round(Math.random() * span);
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn("flex animate-fade-in flex-col gap-1", isUser ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground",
        )}
      >
        {message.content}
      </div>
      {message.imageUrl ? (
        <img
          src={message.imageUrl}
          alt="Generated"
          loading="lazy"
          className="mt-1 max-w-[80%] rounded-2xl border border-border/60"
        />
      ) : message.role === "assistant" && message.content === "Here you go." ? (
        <div className="mt-1 flex max-w-[80%] items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
          <ImageIcon className="size-3.5" />
          <span>Creating an image...</span>
        </div>
      ) : null}
    </div>
  );
}

function TypingIndicator({ message }: { message: string }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-card px-4 py-3 text-sm text-muted-foreground">
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground" />
        <span
          className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground"
          style={{ animationDelay: "300ms" }}
        />
        <span>{message}</span>
      </div>
    </div>
  );
}

function createGreeting(id: string, name: string): ChatMessage {
  return {
    id: `m_greet_${Date.now()}`,
    role: "assistant",
    content: greetFor(id, name),
    createdAt: new Date().toISOString(),
  };
}

function greetFor(id: string, name: string): string {
  switch (id) {
    case "elara":
      return `Hi, this is ${name}. What would you like to talk about today?`;
    case "juno":
      return `Hi, this is ${name}. I am ready when you are.`;
    case "mira":
      return `Hi. I am here and listening.`;
    case "sable":
      return `Hello, this is ${name}. What should we explore first?`;
    default:
      return `Hello, this is ${name}.`;
  }
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
