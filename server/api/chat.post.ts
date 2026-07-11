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

function normalizeOpenRouterModel(model?: string) {
  if (!model) return "openai/gpt-4.1-mini";
  if (model.includes("/") || model.includes(":")) return model;
  return `openai/${model}`;
}

type ChatProvider = "openrouter" | "ohapi";

type ProviderAttempt = {
  provider: ChatProvider;
  model: string;
  key?: string;
  mode: "safe" | "nsfw";
  baseUrl: string;
  path: string;
};

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

function normalizePath(rawPath: string) {
  if (rawPath.startsWith("/")) {
    return rawPath;
  }

  return `/${rawPath}`;
}

function buildHeaders(
  provider: ChatProvider,
  key: string,
  referer: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };

  if (provider === "openrouter") {
    headers["HTTP-Referer"] = referer;
    headers["X-Title"] = "Call Me AI";
  }

  return headers;
}

function buildRequestBody(
  provider: ChatProvider,
  model: string,
  messages: Array<{ role?: string; content?: string }>,
  maxTokens: number,
) {
  const normalizedModel = provider === "openrouter" ? normalizeOpenRouterModel(model) : model;

  return {
    model: normalizedModel,
    messages,
    max_tokens: maxTokens,
    temperature: 0.8,
  };
}

function extractAssistantText(payload: unknown) {
  const data = payload as {
    choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
    output_text?: string;
  };

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();

    if (text) {
      return text;
    }
  }

  if (typeof data?.output_text === "string") {
    return data.output_text.trim();
  }

  return "";
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
  const openRouterBaseUrl = (
    getEnvValue("VITE_OPENROUTER_BASE_URL", "OPENROUTER_BASE_URL") || "https://openrouter.ai/api/v1"
  ).replace(/\/$/, "");
  const openRouterPath = "/chat/completions";

  // OHApi stays wired in as NSFW provider #1. If its key is empty, it is skipped and
  // the next configured NSFW provider automatically takes the first active position.
  const ohApiBaseUrl = (
    getEnvValue("VITE_OHAPI_BASE_URL", "OHAPI_BASE_URL") || "https://api.oh.xyz/v1"
  ).replace(/\/$/, "");
  const ohApiPath = normalizePath(
    getEnvValue("VITE_OHAPI_CHAT_PATH", "OHAPI_CHAT_PATH") || "/chat/completions",
  );
  const ohApiNsfwModel = getEnvValue("VITE_OHAPI_NSFW_MODEL", "OHAPI_NSFW_MODEL") || "gpt-4o-mini";
  const ohApiNsfwModelFallback = getEnvValue(
    "VITE_OHAPI_NSFW_MODEL_FALLBACK",
    "OHAPI_NSFW_MODEL_FALLBACK",
  );
  const ohApiKey = getEnvValue("VITE_OHAPI_API_KEY", "OHAPI_API_KEY");
  const ohApiKeyFallback = getEnvValue(
    "VITE_OHAPI_API_KEY_FALLBACK",
    "OHAPI_API_KEY_FALLBACK",
    "VITE_OHAPI_API_KEY",
    "OHAPI_API_KEY",
  );
  const referer =
    getEnvValue("PUBLIC_URL", "VITE_PUBLIC_URL", "SITE_URL") || "http://localhost:3000";

  const shouldPreferNsfw = mode === "nsfw" || (allowNsfwFallback && requestLooksNsfw);
  const safeModels = Array.from(
    new Set([safeModel, safeModelFallback].filter(Boolean)),
  ) as string[];
  const nsfwModels = Array.from(
    new Set([nsfwModel, nsfwModelFallback].filter(Boolean)),
  ) as string[];

  const ohApiNsfwModels = Array.from(
    new Set([ohApiNsfwModel, ohApiNsfwModelFallback].filter(Boolean)),
  ) as string[];

  const attempts: ProviderAttempt[] = [];

  function appendNsfwAttempts() {
    for (let index = 0; index < ohApiNsfwModels.length; index += 1) {
      const modelName = ohApiNsfwModels[index];
      attempts.push({
        provider: "ohapi",
        model: modelName,
        key: index === 0 ? ohApiKey : ohApiKeyFallback,
        mode: "nsfw",
        baseUrl: ohApiBaseUrl,
        path: ohApiPath,
      });
    }

    for (let index = 0; index < nsfwModels.length; index += 1) {
      const modelName = nsfwModels[index];
      attempts.push({
        provider: "openrouter",
        model: modelName,
        key: index === 0 ? nsfwKey : nsfwKeyFallback,
        mode: "nsfw",
        baseUrl: openRouterBaseUrl,
        path: openRouterPath,
      });
    }
  }

  if (shouldPreferNsfw) {
    appendNsfwAttempts();
  } else {
    for (let index = 0; index < safeModels.length; index += 1) {
      const modelName = safeModels[index];
      attempts.push({
        provider: "openrouter",
        model: modelName,
        key: index === 0 ? safeKey : safeKeyFallback,
        mode: "safe",
        baseUrl: openRouterBaseUrl,
        path: openRouterPath,
      });
    }

    if (allowNsfwFallback) {
      appendNsfwAttempts();
    }
  }

  let lastError: Error | null = null;

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    try {
      const resolvedKey = attempt.key;
      if (!resolvedKey) {
        logEvent("info", "provider-skipped-missing-key", {
          provider: attempt.provider,
          mode: attempt.mode,
          model: attempt.model,
        });
        continue;
      }

      const response = await fetchWithTimeout(`${attempt.baseUrl}${normalizePath(attempt.path)}`, {
        method: "POST",
        headers: buildHeaders(attempt.provider, resolvedKey, referer),
        body: JSON.stringify(
          buildRequestBody(attempt.provider, attempt.model, messages, body?.maxTokens ?? 400),
        ),
      });

      const payload = await response.json();
      const text = extractAssistantText(payload);

      if (!text) {
        throw new Error("The assistant didn’t return a reply.");
      }

      logEvent("info", "request-success", {
        provider: attempt.provider,
        model:
          attempt.provider === "openrouter"
            ? normalizeOpenRouterModel(attempt.model)
            : attempt.model,
        mode: attempt.mode,
      });

      return { text };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "unknown";
      logEvent("warn", "model-attempt-failed", {
        provider: attempt.provider,
        model:
          attempt.provider === "openrouter"
            ? normalizeOpenRouterModel(attempt.model)
            : attempt.model,
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

  if (!lastError) {
    lastError = new Error("The chat service is not configured yet.");
  }

  throw createError({
    statusCode: 502,
    message: lastError?.message || "The assistant hit a snag.",
  });
});
