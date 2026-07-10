/* eslint-disable no-console */

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  scope: string;
  event: string;
  details?: Record<string, unknown>;
}

function write(level: LogLevel, context: LogContext) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    scope: context.scope,
    event: context.event,
    details: context.details ?? {},
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

export const appLogger = {
  info: (context: LogContext) => write("info", context),
  warn: (context: LogContext) => write("warn", context),
  error: (context: LogContext) => write("error", context),
};
