import { getContentRevalidateSeconds } from "@/lib/directus/config";
import { DirectusFetchError } from "@/lib/directus/errors";
import {
  directusLog,
  isDirectusDebugEnabled,
  logDirectusError,
} from "@/lib/directus/logger";

/**
 * Runtime Directus client for the Firedron website.
 * Uses the read-only static token of `firedron-app@dofec.cz` only.
 * Admin credentials must never be used here.
 */
export function getDirectusBaseUrl(): string | null {
  const rawUrl = process.env.DIRECTUS_URL;

  if (!rawUrl) {
    return null;
  }

  let baseUrl = rawUrl.replace(/\/admin\/?$/, "").replace(/\/$/, "");

  if (baseUrl.includes("://zon04.vas-server.cz")) {
    baseUrl = baseUrl.replace(
      "://zon04.vas-server.cz",
      "://directus.zon04.vas-server.cz",
    );
  }

  return baseUrl;
}

export function getDirectusAppToken(): string | null {
  const token = process.env.DIRECTUS_TOKEN?.trim();
  return token || null;
}

export async function directusAppFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getDirectusBaseUrl();
  const token = getDirectusAppToken();
  const startedAt = Date.now();

  if (!baseUrl) {
    logDirectusError("fetch aborted: DIRECTUS_URL missing", null, { path });
    throw new DirectusFetchError("DIRECTUS_URL is not configured.");
  }

  if (!token) {
    logDirectusError("fetch aborted: DIRECTUS_TOKEN missing", null, {
      path,
      baseUrl,
    });
    throw new DirectusFetchError("DIRECTUS_TOKEN is not configured.");
  }

  directusLog.debug("fetch start", { path, baseUrl });

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      next: { revalidate: getContentRevalidateSeconds() },
    });
  } catch (error) {
    logDirectusError("fetch network error", error, {
      path,
      baseUrl,
      ms: Date.now() - startedAt,
    });
    throw error;
  }

  if (!response.ok) {
    let detail: string | undefined;

    if (isDirectusDebugEnabled()) {
      try {
        detail = (await response.text()).slice(0, 500);
      } catch {
        detail = undefined;
      }
    }

    logDirectusError("fetch failed", null, {
      path,
      status: response.status,
      ms: Date.now() - startedAt,
      ...(detail ? { detail } : {}),
    });

    throw new DirectusFetchError(
      `Directus request failed (${response.status}) for ${path}.`,
      response.status,
      path,
    );
  }

  directusLog.debug("fetch ok", {
    path,
    status: response.status,
    ms: Date.now() - startedAt,
  });

  return (await response.json()) as T;
}
