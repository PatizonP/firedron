const PREFIX = "[directus]";

export function isDirectusDebugEnabled(): boolean {
  const flag = process.env.DIRECTUS_DEBUG?.trim().toLowerCase();

  return flag === "true" || flag === "1";
}

type LogContext = Record<string, unknown>;

function formatContext(context?: LogContext): string {
  if (!context || Object.keys(context).length === 0) {
    return "";
  }

  return ` ${JSON.stringify(context)}`;
}

function writeLog(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  context?: LogContext,
): void {
  const line = `${PREFIX} ${message}${formatContext(context)}`;

  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

function createLogger(level: "debug" | "info" | "warn" | "error", always: boolean) {
  return (message: string, context?: LogContext) => {
    if (!always && !isDirectusDebugEnabled()) {
      return;
    }

    writeLog(level, message, context);
  };
}

/** Server-side Directus logging. Enable verbose output with DIRECTUS_DEBUG=true. */
export const directusLog = {
  /** Request/response details, timings, mapped field samples. */
  debug: createLogger("debug", false),
  /** High-level fetch lifecycle (still requires DIRECTUS_DEBUG). */
  info: createLogger("info", false),
  /** Recoverable issues (missing translation row, empty list). */
  warn: createLogger("warn", true),
  /** Failed fetches and getPageContent errors. */
  error: createLogger("error", true),
};

export function logDirectusError(
  message: string,
  error: unknown,
  context?: LogContext,
): void {
  const payload: LogContext = { ...context };

  if (error instanceof Error) {
    payload.error = error.message;
    payload.name = error.name;

    if ("status" in error && typeof error.status === "number") {
      payload.status = error.status;
    }

    if ("path" in error && typeof error.path === "string") {
      payload.path = error.path;
    }

    if ("collection" in error && typeof error.collection === "string") {
      payload.collection = error.collection;
    }
  } else {
    payload.error = String(error);
  }

  directusLog.error(message, payload);
}
