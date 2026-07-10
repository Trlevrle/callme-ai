import { getPersona } from "@/lib/personas";
import { appLogger } from "@/lib/logger";
import { buildPersonaPrompt } from "@/lib/persona-style";
import { loadPreferences } from "@/lib/storage";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  imageUrl?: string;
  createdAt: string;
}

function looksNsfw(text: string) {
  return /\b(sex|sexual|nude|nudity|explicit|porn|erotic|fetish|bdsm|kinky|horny|nsfw|xxx|strip|masturbat|bondage)\b/i.test(
    text,
  );
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 25000);

  let response: Response;

  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutHandle);
    const isAbort = error instanceof DOMException && error.name === "AbortError";
    appLogger.error({
      scope: "chat-api",
      event: isAbort ? "request-timeout" : "request-network-failure",
      details: { path },
    });
    throw new Error(
      isAbort
        ? "The request took too long. Please try again."
        : "Network connection failed. Please check your connection and retry.",
    );
  }

  clearTimeout(timeoutHandle);

  if (!response.ok) {
    let message = "The assistant is taking a moment to recover.";
    try {
      const payload = await response.json();
      message = payload?.message || payload?.error || message;
    } catch {
      message = await response.text();
    }
    appLogger.warn({
      scope: "chat-api",
      event: "request-not-ok",
      details: { path, status: response.status, message },
    });
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function toMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    return err.message || fallback;
  }
  return fallback;
}

export async function sendMessage(
  personaId: string,
  history: ChatMessage[],
  userMessage: string,
  options?: { allowNsfwFallback?: boolean },
): Promise<ChatMessage> {
  const persona = getPersona(personaId);
  if (!persona) throw new Error("Unknown persona");
  const preferences = loadPreferences();
  const mergedSystemPrompt = buildPersonaPrompt(persona.systemPrompt, preferences.defaultTone);

  const messages = [
    { role: "system" as const, content: mergedSystemPrompt },
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userMessage },
  ];

  const allowNsfwFallback = Boolean(options?.allowNsfwFallback);
  const adultTopicsModeEnabled = allowNsfwFallback;
  const shouldUseNsfwMode =
    allowNsfwFallback && (looksNsfw(userMessage) || looksNsfw(persona.systemPrompt));

  let payload: { text?: string };
  try {
    payload = await postJson<{ text?: string }>("/api/chat", {
      messages,
      maxTokens: 400,
      mode: shouldUseNsfwMode ? "nsfw" : "safe",
      allowNsfwFallback,
      adultTopicsModeEnabled,
    });
  } catch (err) {
    throw new Error(
      toMessage(err, "Your companion is taking a moment to recover. Please try again in a moment."),
    );
  }

  const reply = payload.text || "";
  if (!reply) {
    throw new Error("Your companion is taking a moment to recover. Please try again in a moment.");
  }

  return {
    id: `m_${Date.now()}_a`,
    role: "assistant",
    content: reply.trim(),
    createdAt: new Date().toISOString(),
  };
}

export async function generateImage(
  prompt: string,
  options?: { allowNsfwFallback?: boolean },
): Promise<string> {
  const allowNsfwFallback = Boolean(options?.allowNsfwFallback);
  const adultTopicsModeEnabled = allowNsfwFallback;
  const mode = allowNsfwFallback && looksNsfw(prompt) ? "nsfw" : "safe";

  try {
    const payload = await postJson<{ url?: string }>("/api/image", {
      prompt,
      mode,
      size: "1024x1024",
      allowNsfwFallback,
      adultTopicsModeEnabled,
    });
    if (payload.url) return payload.url;
    throw new Error("No image URL returned");
  } catch (err) {
    throw new Error(
      toMessage(err, "Your companion is taking a moment to recover. Please try again in a moment."),
    );
  }
}
