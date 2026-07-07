import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Send,
  ImagePlus,
  PhoneOff,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPersona } from "@/lib/personas";
import { sendMessage, generateImage, type ChatMessage } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/chat/$personaId")({
  component: ChatRoute,
});

function ChatRoute() {
  const { personaId } = useParams({ from: "/chat/$personaId" });
  const persona = getPersona(personaId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!persona) return;
    setMessages([
      {
        id: `m_greet_${Date.now()}`,
        role: "assistant",
        content: greetFor(persona.id, persona.name),
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [persona?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  if (!persona) {
    return (
      <div className="grid h-full place-items-center">
        <p className="text-sm text-muted-foreground">Persona not found.</p>
      </div>
    );
  }

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || pending) return;
    const text = input.trim();
    setInput("");

    // Image-generation command
    if (text.toLowerCase().startsWith("/image ") || text.toLowerCase().startsWith("/pic ")) {
      const prompt = text.replace(/^\/(image|pic)\s+/i, "");
      const userMsg: ChatMessage = {
        id: `m_${Date.now()}_u`,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, userMsg]);
      setPending(true);
      try {
        const url = await generateImage(prompt);
        setMessages((m) => [
          ...m,
          {
            id: `m_${Date.now()}_a`,
            role: "assistant",
            content: `Here you go.`,
            imageUrl: url,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        toast.error("Image generation failed", {
          description: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setPending(false);
      }
      return;
    }

    const userMsg: ChatMessage = {
      id: `m_${Date.now()}_u`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setPending(true);
    try {
      const reply = await sendMessage(persona!.id, messages, text);
      setMessages((m) => [...m, reply]);
    } catch (err) {
      toast.error("Couldn't reach the model", {
        description: err instanceof Error ? err.message : String(err),
      });
      setMessages((m) => [
        ...m,
        {
          id: `m_${Date.now()}_e`,
          role: "assistant",
          content: "(Sorry, I lost the connection for a second. Say that again?)",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  async function toggleVoice() {
    if (voiceActive) {
      setVoiceActive(false);
      setVoiceError(null);
      return;
    }
    setVoiceError(null);
    try {
      // WebRTC real-time voice path — browser-side mic capture.
      // Full OpenAI Realtime wiring (token issuance + RTCPeerConnection)
      // ships in v1.1 once the orchestrator route issues ephemeral tokens.
      // For v1, we use the browser's SpeechRecognition (where available)
      // for STT and Web Speech API for TTS — honest, working fallback.
      const SR =
        (window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ??
        (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
      if (!SR) {
        setVoiceError("Voice isn't supported in this browser. Try Chrome or Edge.");
        return;
      }
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = async (ev: SpeechRecognitionEvent) => {
        const transcript = ev.results[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
          // auto-send
          setTimeout(() => onSend(), 50);
        }
      };
      recognition.onerror = (ev) => {
        setVoiceError(`Mic error: ${ev.error}`);
        setVoiceActive(false);
      };
      recognition.onend = () => setVoiceActive(false);
      recognition.start();
      setVoiceActive(true);
    } catch (e) {
      setVoiceError(e instanceof Error ? e.message : "Mic failed");
      setVoiceActive(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-card/40 px-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-10 place-items-center rounded-full bg-gradient-to-br text-xl",
              persona.accent,
            )}
          >
            <span className="font-serif italic text-foreground/70">
              {persona.emoji}
            </span>
          </div>
          <div>
            <h2 className="font-serif text-lg text-foreground">{persona.name}</h2>
            <p className="text-[11px] text-muted-foreground">{persona.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/app">End call</Link>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {pending && <TypingIndicator persona={persona.accent} />}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border/60 bg-card/40 px-4 py-4 sm:px-8">
        <form
          onSubmit={onSend}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                voiceActive
                  ? "Listening..."
                  : `Message ${persona.name} — type /image <prompt> for a picture`
              }
              className="h-12 rounded-full border-border/60 bg-background pl-4 pr-12 text-base"
              disabled={pending}
            />
            {voiceError && (
              <p className="absolute -top-6 left-4 text-[11px] text-destructive">
                {voiceError}
              </p>
            )}
          </div>
          <Button
            type="button"
            size="icon"
            variant={voiceActive ? "default" : "outline"}
            onClick={toggleVoice}
            className="size-12 shrink-0 rounded-full"
            disabled={pending}
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
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-muted-foreground">
          Voice is browser-based. Real-time WebRTC voice ships in v1.1.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex animate-fade-in flex-col gap-1",
        isUser ? "items-end" : "items-start",
      )}
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
      {message.imageUrl && (
        <img
          src={message.imageUrl}
          alt="Generated"
          className="mt-1 max-w-[80%] rounded-2xl border border-border/60"
        />
      )}
    </div>
  );
}

function TypingIndicator({ persona }: { persona: string }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-card px-4 py-3">
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground" />
        <span
          className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

function greetFor(id: string, name: string): string {
  switch (id) {
    case "elara":
      return `Hey, it's ${name}. I'm glad you picked up. How's your night going?`;
    case "juno":
      return `Alright, you called. I was just thinking about you. What's up?`;
    case "mira":
      return `Hi. I'm here. Whenever you're ready, just start talking.`;
    case "sable":
      return `Hey. I'm ${name}. Glad you reached out — what do you want to talk about?`;
    default:
      return `Hey, it's ${name}.`;
  }
}
