import { defineEventHandler, readBody, getRequestHeader, createError } from "h3";
import { loadRuntimeEnv } from "../utils/env";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function logEvent(
  level: "info" | "warn" | "error",
  event: string,
  details?: Record<string, unknown>,
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    scope: "server-image",
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

function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function looksNsfw(text: string) {
  return /\b(sex|sexual|nude|nudity|explicit|porn|erotic|fetish|bdsm|kinky|horny|nsfw|xxx|strip|masturbat|bondage)\b/i.test(
    text,
  );
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
      message: "You’re generating images a little too quickly. Please wait a moment and try again.",
    });
  }

  bucket.count += 1;
}

export default defineEventHandler(async (event) => {
  loadRuntimeEnv();
  enforceRateLimit(event);
  logEvent("info", "request-start", { mode: "image" });

  const body = (await readBody(event)) as {
    prompt?: string;
    mode?: "safe" | "nsfw";
    size?: string;
    allowNsfwFallback?: boolean;
    adultTopicsModeEnabled?: boolean;
  };

  const prompt = body?.prompt?.trim();
  if (!prompt) {
    throw createError({ statusCode: 400, message: "A prompt is required." });
  }

  const mode = body?.mode === "nsfw" ? "nsfw" : "safe";
  const allowNsfwFallback = Boolean(body?.adultTopicsModeEnabled ?? body?.allowNsfwFallback);
  const requestLooksNsfw = looksNsfw(prompt);
  const shouldPreferNsfw = mode === "nsfw" || (allowNsfwFallback && requestLooksNsfw);
  const safeModel =
    getEnvValue("VITE_FAL_MODEL", "FAL_MODEL", "VITE_FAL_MODEL_SFW", "FAL_MODEL_SFW") ||
    "fal-ai/flux/schnell";
  const nsfwModel =
    getEnvValue(
      "VITE_FAL_NSFW_MODEL",
      "FAL_NSFW_MODEL",
      "VITE_FAL_MODEL_NSFW",
      "FAL_MODEL_NSFW",
      "VITE_FAL_MODEL",
      "FAL_MODEL",
    ) || "fal-ai/flux/schnell";
  const safeModelFallback = getEnvValue(
    "VITE_FAL_MODEL_FALLBACK",
    "FAL_MODEL_FALLBACK",
    "VITE_FAL_MODEL",
    "FAL_MODEL",
  );
  const nsfwModelFallback = getEnvValue(
    "VITE_FAL_NSFW_MODEL_FALLBACK",
    "FAL_NSFW_MODEL_FALLBACK",
    "VITE_FAL_NSFW_MODEL",
    "FAL_NSFW_MODEL",
  );
  const safeKey = getEnvValue(
    "VITE_FAL_API_KEY",
    "FAL_API_KEY",
    "VITE_FAL_AI_API_KEY",
    "FAL_AI_API_KEY",
  );
  const nsfwKey = getEnvValue(
    "VITE_FAL_NSFW_API_KEY",
    "FAL_NSFW_API_KEY",
    "VITE_FAL_API_KEY",
    "FAL_API_KEY",
    "VITE_FAL_AI_API_KEY",
    "FAL_AI_API_KEY",
  );
  const safeKeyFallback = getEnvValue(
    "VITE_FAL_API_KEY_FALLBACK",
    "FAL_API_KEY_FALLBACK",
    "VITE_FAL_API_KEY",
    "FAL_API_KEY",
    "VITE_FAL_AI_API_KEY",
    "FAL_AI_API_KEY",
  );
  const nsfwKeyFallback = getEnvValue(
    "VITE_FAL_NSFW_API_KEY_FALLBACK",
    "FAL_NSFW_API_KEY_FALLBACK",
    "VITE_FAL_NSFW_API_KEY",
    "FAL_NSFW_API_KEY",
    "VITE_FAL_API_KEY",
    "FAL_API_KEY",
  );
  const baseUrl = (getEnvValue("VITE_FAL_BASE_URL", "FAL_BASE_URL") || "https://fal.run").replace(
    /\/$/,
    "",
  );

  const safeModels = Array.from(
    new Set([safeModel, safeModelFallback].filter(Boolean)),
  ) as string[];
  const nsfwModels = Array.from(
    new Set([nsfwModel, nsfwModelFallback].filter(Boolean)),
  ) as string[];

  const attempts: Array<{ mode: "safe" | "nsfw"; model: string; key?: string }> = [];

  if (shouldPreferNsfw) {
    for (let index = 0; index < nsfwModels.length; index += 1) {
      const modelName = nsfwModels[index];
      attempts.push({
        mode: "nsfw",
        model: modelName,
        key: index === 0 ? nsfwKey : nsfwKeyFallback,
      });
    }
  } else {
    for (let index = 0; index < safeModels.length; index += 1) {
      const modelName = safeModels[index];
      attempts.push({
        mode: "safe",
        model: modelName,
        key: index === 0 ? safeKey : safeKeyFallback,
      });
    }

    if (allowNsfwFallback) {
      for (let index = 0; index < nsfwModels.length; index += 1) {
        const modelName = nsfwModels[index];
        attempts.push({
          mode: "nsfw",
          model: modelName,
          key: index === 0 ? nsfwKey : nsfwKeyFallback,
        });
      }
    }
  }

  let lastError: Error | null = null;

  for (const attempt of attempts) {
    try {
      if (!attempt.key) {
        throw new Error("Image generation is not configured yet.");
      }

      const response = await fetch(`${baseUrl}/${attempt.model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${attempt.key}`,
        },
        body: JSON.stringify({
          prompt,
          image_size: body?.size === "1024x1024" ? "square_hd" : body?.size || "square_hd",
          sync_mode: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Image request failed (${response.status})`);
      }

      const payload = await response.json();
      const images =
        payload?.images ||
        payload?.data?.images ||
        payload?.output?.images ||
        payload?.output ||
        [];
      const first = Array.isArray(images) ? images[0] : images;
      const url =
        first?.url ||
        first?.image?.url ||
        first?.image_url ||
        first?.content?.url ||
        payload?.image?.url ||
        payload?.url;

      if (!url) {
        throw new Error("The image service didn’t return a usable image.");
      }

      logEvent("info", "request-success", { provider: "fal", mode: attempt.mode });
      return { url };
    } catch (error) {
      if (!allowNsfwFallback && attempt.mode === "safe" && requestLooksNsfw) {
        lastError = new Error(
          "This request requires Adult topics mode. Turn it on in chat or settings and try again.",
        );
        break;
      }

      logEvent("warn", "provider-attempt-failed", {
        mode: attempt.mode,
        message: error instanceof Error ? error.message : "unknown",
      });
      lastError =
        error instanceof Error ? error : new Error("The image service is currently unavailable.");
    }
  }

  logEvent("error", "provider-network-failure", {
    message: lastError?.message || "unknown",
  });
  throw createError({
    statusCode: 502,
    message: lastError?.message || "The image service is currently unavailable.",
  });
});
