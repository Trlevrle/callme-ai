import { defineEventHandler, readBody, getRequestHeader, createError } from "h3";
import { loadRuntimeEnv } from "../utils/env";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type ImageProvider = "fal" | "uncensored";

type ProviderAttempt = {
  provider: ImageProvider;
  mode: "safe" | "nsfw";
  model: string;
  key?: string;
  baseUrl: string;
  path?: string;
};

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

function normalizePath(rawPath: string) {
  if (rawPath.startsWith("/")) {
    return rawPath;
  }

  return `/${rawPath}`;
}

function normalizeFalImageSize(size?: string) {
  if (size === "1024x1024") {
    return "square_hd";
  }

  return size || "square_hd";
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

async function parseErrorMessage(response: Response, fallback: string) {
  try {
    const payload = await response.json();
    return payload?.error?.message || payload?.message || fallback;
  } catch {
    const text = await response.text();
    return text || fallback;
  }
}

function extractImageUrl(payload: unknown) {
  const data = payload as {
    data?: Array<{ url?: string; image_url?: string; image?: { url?: string } }>;
    images?: Array<{ url?: string; image_url?: string; image?: { url?: string } }>;
    output?:
      | Array<{ url?: string; image_url?: string; image?: { url?: string } }>
      | { url?: string; image_url?: string; image?: { url?: string } };
    image?: { url?: string; image_url?: string };
    url?: string;
  };

  const dataItem = Array.isArray(data?.data) ? data.data[0] : undefined;
  const imageItem = Array.isArray(data?.images) ? data.images[0] : undefined;
  const outputItem = Array.isArray(data?.output) ? data.output[0] : data?.output;

  const candidates = [dataItem, imageItem, outputItem, data?.image, data];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const url =
      (candidate as { url?: string }).url ||
      (candidate as { image_url?: string }).image_url ||
      (candidate as { image?: { url?: string } }).image?.url;

    if (typeof url === "string" && url.trim()) {
      return url.trim();
    }
  }

  return undefined;
}

async function requestFalImage(args: {
  baseUrl: string;
  model: string;
  key: string;
  prompt: string;
  size?: string;
}) {
  const response = await fetch(`${args.baseUrl}/${args.model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${args.key}`,
    },
    body: JSON.stringify({
      prompt: args.prompt,
      image_size: normalizeFalImageSize(args.size),
      sync_mode: true,
    }),
  });

  if (!response.ok) {
    const detail = await parseErrorMessage(response, `Image request failed (${response.status})`);
    throw new Error(detail);
  }

  const payload = await response.json();
  const url = extractImageUrl(payload);

  if (!url) {
    throw new Error("The image service didn’t return a usable image.");
  }

  return url;
}

async function requestUncensoredImage(args: {
  baseUrl: string;
  path: string;
  model: string;
  key: string;
  prompt: string;
  size?: string;
}) {
  const response = await fetch(`${args.baseUrl}${normalizePath(args.path)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.key}`,
    },
    body: JSON.stringify({
      model: args.model,
      prompt: args.prompt,
      size: args.size || "1024x1024",
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const detail = await parseErrorMessage(response, `Image request failed (${response.status})`);
    throw new Error(detail);
  }

  const payload = await response.json();
  const url = extractImageUrl(payload);

  if (!url) {
    throw new Error("The image service didn’t return a usable image.");
  }

  return url;
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
  const falBaseUrl = (
    getEnvValue("VITE_FAL_BASE_URL", "FAL_BASE_URL") || "https://fal.run"
  ).replace(/\/$/, "");

  const uncensoredBaseUrl = (
    getEnvValue("VITE_UNCENSORED_BASE_URL", "UNCENSORED_BASE_URL") ||
    "https://api.uncensored.com/v1"
  ).replace(/\/$/, "");
  const uncensoredPath =
    getEnvValue("VITE_UNCENSORED_IMAGE_PATH", "UNCENSORED_IMAGE_PATH") || "/images/generations";
  const uncensoredNsfwModel =
    getEnvValue("VITE_UNCENSORED_NSFW_MODEL", "UNCENSORED_NSFW_MODEL") || "uncensored-image-1";
  const uncensoredNsfwModelFallback = getEnvValue(
    "VITE_UNCENSORED_NSFW_MODEL_FALLBACK",
    "UNCENSORED_NSFW_MODEL_FALLBACK",
  );
  const uncensoredKey = getEnvValue("VITE_UNCENSORED_API_KEY", "UNCENSORED_API_KEY");
  const uncensoredKeyFallback = getEnvValue(
    "VITE_UNCENSORED_API_KEY_FALLBACK",
    "UNCENSORED_API_KEY_FALLBACK",
    "VITE_UNCENSORED_API_KEY",
    "UNCENSORED_API_KEY",
  );

  const safeModels = Array.from(
    new Set([safeModel, safeModelFallback].filter(Boolean)),
  ) as string[];
  const nsfwModels = Array.from(
    new Set([nsfwModel, nsfwModelFallback].filter(Boolean)),
  ) as string[];
  const uncensoredNsfwModels = Array.from(
    new Set([uncensoredNsfwModel, uncensoredNsfwModelFallback].filter(Boolean)),
  ) as string[];

  const attempts: ProviderAttempt[] = [];

  function appendNsfwAttempts() {
    for (let index = 0; index < uncensoredNsfwModels.length; index += 1) {
      const modelName = uncensoredNsfwModels[index];
      attempts.push({
        provider: "uncensored",
        mode: "nsfw",
        model: modelName,
        key: index === 0 ? uncensoredKey : uncensoredKeyFallback,
        baseUrl: uncensoredBaseUrl,
        path: uncensoredPath,
      });
    }

    for (let index = 0; index < nsfwModels.length; index += 1) {
      const modelName = nsfwModels[index];
      attempts.push({
        provider: "fal",
        mode: "nsfw",
        model: modelName,
        key: index === 0 ? nsfwKey : nsfwKeyFallback,
        baseUrl: falBaseUrl,
      });
    }
  }

  if (shouldPreferNsfw) {
    appendNsfwAttempts();
  } else {
    for (let index = 0; index < safeModels.length; index += 1) {
      const modelName = safeModels[index];
      attempts.push({
        provider: "fal",
        mode: "safe",
        model: modelName,
        key: index === 0 ? safeKey : safeKeyFallback,
        baseUrl: falBaseUrl,
      });
    }

    if (allowNsfwFallback) {
      appendNsfwAttempts();
    }
  }

  let lastError: Error | null = null;

  for (const attempt of attempts) {
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

      let url: string;

      if (attempt.provider === "uncensored") {
        url = await requestUncensoredImage({
          baseUrl: attempt.baseUrl,
          path: attempt.path || "/images/generations",
          model: attempt.model,
          key: resolvedKey,
          prompt,
          size: body?.size,
        });
      } else {
        url = await requestFalImage({
          baseUrl: attempt.baseUrl,
          model: attempt.model,
          key: resolvedKey,
          prompt,
          size: body?.size,
        });
      }

      logEvent("info", "request-success", {
        provider: attempt.provider,
        mode: attempt.mode,
        model: attempt.model,
      });
      return { url };
    } catch (error) {
      if (!allowNsfwFallback && attempt.mode === "safe" && requestLooksNsfw) {
        lastError = new Error(
          "This request requires Adult topics mode. Turn it on in chat or settings and try again.",
        );
        break;
      }

      logEvent("warn", "provider-attempt-failed", {
        provider: attempt.provider,
        model: attempt.model,
        mode: attempt.mode,
        message: error instanceof Error ? error.message : "unknown",
      });
      lastError =
        error instanceof Error ? error : new Error("The image service is currently unavailable.");
    }
  }

  if (!lastError) {
    lastError = new Error("Image generation is not configured yet.");
  }

  logEvent("error", "provider-network-failure", {
    message: lastError?.message || "unknown",
  });
  throw createError({
    statusCode: 502,
    message: lastError?.message || "The image service is currently unavailable.",
  });
});
