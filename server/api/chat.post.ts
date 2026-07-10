import { defineEventHandler, readBody, getRequestHeader, createError } from "h3";
import { loadRuntimeEnv } from "../utils/env";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function logEvent(
  level: "info" | "warn" | "error",
  event: string,
  details?: Record<string, unknown>,
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    scope: "server-chat",
    event,
    details: details ?? {},
  };

  if (level === "error") {
    console.error("[callme-ai]", payload);
    return;
  }

  if (level === "warn") {
    console.warn("[callme-ai]", payload);
    return;
  }

  console.info("[callme-ai]", payload);
}

function getClientKey(event: Parameters<typeof defineEventHandler>[0]) {
  const forwarded = getRequestHeader(event, "x-forwarded-for") || "";
  const realIp = getRequestHeader(event, "x-real-ip") || "";
  return (forwarded.split(",")[0] || realIp || "local").trim() || "local";
}

function enforceRateLimit(event: Parameters<typeof defineEventHandler>[0]) {
  const key = getClientKey(event);
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    logEvent("warn", "rate-limit-hit", { key });
    throw createError({
      statusCode: 429,
      statusMessage: "Too many requests",
      message:
        "You’ve sent a lot of requests lately. Please take a short break and try again soon.",
    });
  }

  bucket.count += 1;
}

function normalizeModel(model?: string) {
  if (!model) return "openai/gpt-4.1-mini";
  if (model.includes("/") || model.includes(":")) return model;
  return `openai/${model}`;
}

function looksNsfw(text: string) {
  return /\b(sex|sexual|nude|nudity|explicit|porn|erotic|fetish|bdsm|kinky|horny|nsfw|xxx|strip|masturbat|bondage)\b/i.test(
    text,
  );
}

function looksNsfwRequest(messages: Array<{ role?: string; content?: string }>) {
  return messages.some(
    (message) => typeof message?.content === "string" && looksNsfw(message.content),
  );
}

function isLikelySafetyBlock(message: string) {
  return /(safety|policy|moderation|content filter|disallow|not allowed|blocked|nsfw)/i.test(
    message,
  );
}

function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      logEvent("warn", "provider-non-ok", { status: response.status });
      let detail = "The assistant hit a snag.";
      try {
        const payload = await response.json();
        detail = payload?.error?.message || payload?.message || detail;
      } catch {
        detail = await response.text();
      }
      throw new Error(detail);
    }

    return response;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

export default defineEventHandler(async (event) => {
  loadRuntimeEnv();
  enforceRateLimit(event);
  logEvent("info", "request-start", { mode: "chat" });

  const body = (await readBody(event)) as {
    messages?: Array<{ role?: string; content?: string }>;
    model?: string;
    maxTokens?: number;
    mode?: "safe" | "nsfw";
    allowNsfwFallback?: boolean;
    adultTopicsModeEnabled?: boolean;
  };

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  if (!messages.length) {
    throw createError({ statusCode: 400, message: "A prompt is required." });
  }

  const mode = body?.mode === "nsfw" ? "nsfw" : "safe";
  const allowNsfwFallback = Boolean(body?.adultTopicsModeEnabled ?? body?.allowNsfwFallback);
  const requestLooksNsfw = looksNsfwRequest(messages);
  const safeModel =
    getEnvValue(
      "VITE_OPENROUTER_SFW_MODEL",
      "OPENROUTER_SFW_MODEL",
      "VITE_OPENROUTER_MODEL",
      "OPENROUTER_MODEL",
    ) || "openai/gpt-4.1-mini";
  const nsfwModel =
    getEnvValue(
      "VITE_OPENROUTER_NSFW_MODEL",
      "OPENROUTER_NSFW_MODEL",
      "VITE_OPENROUTER_FALLBACK_MODEL",
      "OPENROUTER_FALLBACK_MODEL",
    ) || "openai/gpt-4o-mini";
  const safeModelFallback = getEnvValue(
    "VITE_OPENROUTER_SFW_MODEL_FALLBACK",
    "OPENROUTER_SFW_MODEL_FALLBACK",
    "VITE_OPENROUTER_FALLBACK_MODEL",
    "OPENROUTER_FALLBACK_MODEL",
  );
  const nsfwModelFallback = getEnvValue(
    "VITE_OPENROUTER_NSFW_MODEL_FALLBACK",
    "OPENROUTER_NSFW_MODEL_FALLBACK",
    "VITE_OPENROUTER_FALLBACK_MODEL",
    "OPENROUTER_FALLBACK_MODEL",
  );
  const safeKey = getEnvValue(
    "VITE_OPENROUTER_API_KEY",
    "OPENROUTER_API_KEY",
    "VITE_OPENAI_API_KEY",
    "OPENAI_API_KEY",
  );
  const nsfwKey = getEnvValue(
    "VITE_OPENROUTER_NSFW_API_KEY",
    "OPENROUTER_NSFW_API_KEY",
    "VITE_OPENROUTER_API_KEY",
    "OPENROUTER_API_KEY",
    "VITE_OPENAI_API_KEY",
    "OPENAI_API_KEY",
  );
  const safeKeyFallback = getEnvValue(
    "VITE_OPENROUTER_API_KEY_FALLBACK",
    "OPENROUTER_API_KEY_FALLBACK",
    "VITE_OPENAI_API_KEY_FALLBACK",
    "OPENAI_API_KEY_FALLBACK",
    "VITE_OPENROUTER_API_KEY",
    "OPENROUTER_API_KEY",
  );
  const nsfwKeyFallback = getEnvValue(
    "VITE_OPENROUTER_NSFW_API_KEY_FALLBACK",
    "OPENROUTER_NSFW_API_KEY_FALLBACK",
    "VITE_OPENROUTER_NSFW_API_KEY",
    "OPENROUTER_NSFW_API_KEY",
    "VITE_OPENROUTER_API_KEY",
    "OPENROUTER_API_KEY",
  );
  const baseUrl = (
    getEnvValue("VITE_OPENROUTER_BASE_URL", "OPENROUTER_BASE_URL") || "https://openrouter.ai/api/v1"
  ).replace(/\/$/, "");

  const shouldPreferNsfw = mode === "nsfw" || (allowNsfwFallback && requestLooksNsfw);
  const safeModels = Array.from(
    new Set([safeModel, safeModelFallback].filter(Boolean)),
  ) as string[];
  const nsfwModels = Array.from(
    new Set([nsfwModel, nsfwModelFallback].filter(Boolean)),
  ) as string[];

  const attempts: Array<{ model: string; key?: string; mode: "safe" | "nsfw" }> = [];

  if (shouldPreferNsfw) {
    for (let index = 0; index < nsfwModels.length; index += 1) {
      const modelName = nsfwModels[index];
      attempts.push({
        model: modelName,
        key: index === 0 ? nsfwKey : nsfwKeyFallback,
        mode: "nsfw",
      });
    }
  } else {
    for (let index = 0; index < safeModels.length; index += 1) {
      const modelName = safeModels[index];
      attempts.push({
        model: modelName,
        key: index === 0 ? safeKey : safeKeyFallback,
        mode: "safe",
      });
    }

    if (allowNsfwFallback) {
      for (let index = 0; index < nsfwModels.length; index += 1) {
        const modelName = nsfwModels[index];
        attempts.push({
          model: modelName,
          key: index === 0 ? nsfwKey : nsfwKeyFallback,
          mode: "nsfw",
        });
      }
    }
  }

  let lastError: Error | null = null;

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    try {
      const resolvedKey = attempt.key;
      if (!resolvedKey) {
        throw new Error("The chat service is not configured yet.");
      }

      const response = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resolvedKey}`,
          "HTTP-Referer":
            getEnvValue("PUBLIC_URL", "VITE_PUBLIC_URL", "SITE_URL") || "http://localhost:3000",
          "X-Title": "Call Me AI",
        },
        body: JSON.stringify({
          model: normalizeModel(attempt.model),
          messages,
          max_tokens: body?.maxTokens ?? 400,
          temperature: 0.8,
        }),
      });

      const payload = await response.json();
      const text = payload?.choices?.[0]?.message?.content?.trim();

      if (!text) {
        throw new Error("The assistant didn’t return a reply.");
      }

      logEvent("info", "request-success", {
        model: normalizeModel(attempt.model),
        mode: attempt.mode,
      });

      return { text };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "unknown";
      logEvent("warn", "model-attempt-failed", {
        model: normalizeModel(attempt.model),
        mode: attempt.mode,
        message: errorMessage,
      });

      if (!allowNsfwFallback && attempt.mode === "safe" && isLikelySafetyBlock(errorMessage)) {
        lastError = new Error(
          "This request requires Adult topics mode. Turn it on in chat or settings and try again.",
        );
        break;
      }

      lastError = error instanceof Error ? error : new Error("The assistant hit a snag.");
    }
  }

  throw createError({
    statusCode: 502,
    message: lastError?.message || "The assistant hit a snag.",
  });
});
