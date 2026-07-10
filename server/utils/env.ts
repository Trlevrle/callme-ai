import fs from "node:fs";
import path from "node:path";

const envFiles = [".env.local", ".env"];
let loaded = false;

function detectEncoding(buffer: Buffer) {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
    return "utf8";
  }

  if (buffer.includes(0x00)) {
    return "utf16le";
  }

  return "utf8";
}

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvFile(content: string) {
  const values: Record<string, string> = {};
  const lines = content.replace(/\r/g, "").split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    values[key] = stripQuotes(rawValue);
  }

  return values;
}

function applyEnvValues(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) {
    if (!value) continue;
    if (process.env[key] && process.env[key]!.trim()) continue;
    process.env[key] = value;

    if (key.startsWith("VITE_")) {
      process.env[key.replace(/^VITE_/, "")] = value;
    }

    const aliases: Record<string, string> = {
      OPENROUTER_API_KEY: "VITE_OPENROUTER_API_KEY",
      OPENROUTER_NSFW_API_KEY: "VITE_OPENROUTER_NSFW_API_KEY",
      OPENROUTER_SFW_MODEL: "VITE_OPENROUTER_SFW_MODEL",
      OPENROUTER_MODEL: "VITE_OPENROUTER_MODEL",
      OPENROUTER_NSFW_MODEL: "VITE_OPENROUTER_NSFW_MODEL",
      OPENROUTER_FALLBACK_MODEL: "VITE_OPENROUTER_FALLBACK_MODEL",
      OPENROUTER_BASE_URL: "VITE_OPENROUTER_BASE_URL",
      FAL_API_KEY: "VITE_FAL_API_KEY",
      FAL_NSFW_API_KEY: "VITE_FAL_NSFW_API_KEY",
      FAL_MODEL: "VITE_FAL_MODEL",
      FAL_MODEL_SFW: "VITE_FAL_MODEL_SFW",
      FAL_MODEL_NSFW: "VITE_FAL_MODEL_NSFW",
      FAL_BASE_URL: "VITE_FAL_BASE_URL",
    };

    if (aliases[key]) {
      if (!process.env[aliases[key]] || !process.env[aliases[key]]!.trim()) {
        process.env[aliases[key]] = value;
      }
    }
  }
}

export function loadRuntimeEnv() {
  if (loaded) return;
  loaded = true;

  for (const fileName of envFiles) {
    const filePath = path.resolve(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) continue;

    const contents = fs.readFileSync(filePath);
    const encoding = detectEncoding(contents);
    const parsed = parseEnvFile(contents.toString(encoding));
    applyEnvValues(parsed);
    break;
  }
}
