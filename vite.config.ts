import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadRuntimeEnv } from "./server/utils/env";

type ChatProxyPayload = {
  messages?: Array<{ role?: string; content?: string }>;
  model?: string;
  maxTokens?: number;
  mode?: "safe" | "nsfw";
  allowNsfwFallback?: boolean;
  adultTopicsModeEnabled?: boolean;
};

type ImageProxyPayload = {
  prompt?: string;
  size?: string;
  mode?: "safe" | "nsfw";
  allowNsfwFallback?: boolean;
  adultTopicsModeEnabled?: boolean;
};

type ProxyBody = Record<string, unknown>;
type ProxyRequest = {
  on: (_event: "data" | "end" | "error", _listener: (_chunk?: string) => void) => void;
};

function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
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

async function readJsonBody(req: ProxyRequest): Promise<ProxyBody> {
  return new Promise<ProxyBody>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk?: string) => {
      body += chunk ?? "";
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function handleChatProxy(payload: ChatProxyPayload) {
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  const mode = payload?.mode === "nsfw" ? "nsfw" : "safe";
  const allowNsfwFallback = Boolean(payload?.adultTopicsModeEnabled ?? payload?.allowNsfwFallback);
  const requestLooksNsfw = looksNsfwRequest(messages);
  const safeModel =
    payload?.model ||
    getEnvValue(
      "VITE_OPENROUTER_SFW_MODEL",
      "OPENROUTER_SFW_MODEL",
      "VITE_OPENROUTER_MODEL",
      "OPENROUTER_MODEL",
    ) ||
    "openai/gpt-4.1-mini";
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

  if (!messages.length) {
    throw new Error("The chat service is not configured yet.");
  }

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
      if (!attempt.key) {
        throw new Error("The chat service is not configured yet.");
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${attempt.key}`,
          "HTTP-Referer":
            getEnvValue("PUBLIC_URL", "VITE_PUBLIC_URL", "SITE_URL") || "http://localhost:3000",
          "X-Title": "Call Me AI",
        },
        body: JSON.stringify({
          model: normalizeModel(attempt.model),
          messages,
          max_tokens: payload?.maxTokens ?? 400,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter request failed (${response.status})`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (!text) {
        throw new Error("The assistant didn’t return a reply.");
      }

      return { text };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown chat error";

      if (!allowNsfwFallback && attempt.mode === "safe" && isLikelySafetyBlock(message)) {
        lastError = new Error(
          "This request requires Adult topics mode. Turn it on in chat or settings and try again.",
        );
        break;
      }

      lastError = error instanceof Error ? error : new Error("The assistant hit a snag.");
    }
  }

  throw lastError || new Error("The assistant hit a snag.");
}

async function handleImageProxy(payload: ImageProxyPayload) {
  const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
  const mode = payload?.mode === "nsfw" ? "nsfw" : "safe";
  const allowNsfwFallback = Boolean(payload?.adultTopicsModeEnabled ?? payload?.allowNsfwFallback);
  if (!prompt) {
    throw new Error("A prompt is required.");
  }

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
          image_size: payload?.size === "1024x1024" ? "square_hd" : payload?.size || "square_hd",
          sync_mode: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`The image service is currently unavailable. (${response.status})`);
      }

      const data = await response.json();
      const images =
        data?.images || data?.data?.images || data?.output?.images || data?.output || [];
      const first = Array.isArray(images) ? images[0] : images;
      const url =
        first?.url ||
        first?.image?.url ||
        first?.image_url ||
        first?.content?.url ||
        data?.image?.url ||
        data?.url;
      if (!url) {
        throw new Error("The image service didn’t return a usable image.");
      }

      return { url };
    } catch (error) {
      if (!allowNsfwFallback && attempt.mode === "safe" && requestLooksNsfw) {
        lastError = new Error(
          "This request requires Adult topics mode. Turn it on in chat or settings and try again.",
        );
        break;
      }

      lastError =
        error instanceof Error ? error : new Error("The image service is currently unavailable.");
    }
  }

  throw lastError || new Error("The image service is currently unavailable.");
}

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    {
      name: "dev-api-proxy",
      configureServer(server) {
        loadRuntimeEnv();

        server.middlewares.use(
          "/api/chat",
          async (
            req: import("http").IncomingMessage,
            res: import("http").ServerResponse,
            next: () => void,
          ) => {
            if (req.method !== "POST") {
              next();
              return;
            }
            try {
              const body = await readJsonBody(req as unknown as ProxyRequest);
              const payload = await handleChatProxy(body as ChatProxyPayload);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
            } catch (error) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  message: error instanceof Error ? error.message : "The assistant hit a snag.",
                }),
              );
            }
          },
        );

        server.middlewares.use(
          "/api/image",
          async (
            req: import("http").IncomingMessage,
            res: import("http").ServerResponse,
            next: () => void,
          ) => {
            if (req.method !== "POST") {
              next();
              return;
            }
            try {
              const body = await readJsonBody(req as unknown as ProxyRequest);
              const payload = await handleImageProxy(body as ImageProxyPayload);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
            } catch (error) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  message: error instanceof Error ? error.message : "The image service hit a snag.",
                }),
              );
            }
          },
        );
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react";
          }

          if (id.includes("@tanstack/react-router") || id.includes("@tanstack/react-query")) {
            return "tanstack";
          }

          return undefined;
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: true,
    proxy: {
      "/api/openai": {
        target: "https://api.openai.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ""),
      },
    },
  },
});
