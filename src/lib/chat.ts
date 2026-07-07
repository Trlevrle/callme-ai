import { blink } from "@/blink/client";
import { getPersona } from "@/lib/personas";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  imageUrl?: string;
  createdAt: string;
}

/**
 * Provider chain for text generation. The Blink SDK's generateText routes
 * through whichever provider is configured in the project's AI settings.
 * v1 uses Blink AI (OpenAI primary). v1.1 adds explicit OpenRouter +
 * fallback chains once the user drops the corresponding keys into
 * Blink secrets.
 */
const PRIMARY_MODEL = "gpt-4.1-mini";
const FALLBACK_MODEL = "gpt-4o-mini";

export async function sendMessage(
  personaId: string,
  history: ChatMessage[],
  userMessage: string,
): Promise<ChatMessage> {
  const persona = getPersona(personaId);
  if (!persona) throw new Error("Unknown persona");

  // Build the message list with the persona system prompt prepended.
  const messages = [
    { role: "system" as const, content: persona.systemPrompt },
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userMessage },
  ];

  // Try primary model, then fallback. The Blink SDK throws on 4xx/5xx;
  // we catch and retry with the fallback model.
  let reply = "";
  let lastError: unknown = null;
  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const { text } = await blink.ai.generateText({
        messages,
        model,
        maxTokens: 400,
      });
      reply = text;
      break;
    } catch (err) {
      lastError = err;
      // continue to next model
    }
  }

  if (!reply) {
    throw lastError instanceof Error ? lastError : new Error("All models failed");
  }

  return {
    id: `m_${Date.now()}_a`,
    role: "assistant",
    content: reply.trim(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generate an image in response to a prompt. Uses OpenAI gpt-image-1
 * via the Blink SDK. Returns the public URL of the generated image.
 */
export async function generateImage(prompt: string): Promise<string> {
  const { data, error } = await blink.ai.generateImage({
    prompt,
    model: "gpt-image-1",
    size: "1024x1024",
  });
  if (error) {
    throw new Error(error.message || "Image generation failed");
  }
  const first = Array.isArray(data) ? data[0] : data;
  if (!first?.url) throw new Error("No image URL returned");
  return first.url;
}
