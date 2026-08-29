const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, "");
}

export function getAllowedOrigins(): string[] {
  const envOrigins = Deno.env.get("ALLOWED_ORIGINS");
  if (envOrigins) {
    return envOrigins
      .split(",")
      .map(normalizeOrigin)
      .filter(Boolean);
  }
  const siteUrl = Deno.env.get("SITE_URL");
  if (siteUrl) {
    return [normalizeOrigin(siteUrl), ...DEFAULT_ALLOWED_ORIGINS.map(normalizeOrigin)];
  }
  return DEFAULT_ALLOWED_ORIGINS.map(normalizeOrigin);
}

export function isAllowedOrigin(origin: string): boolean {
  const cleanOrigin = normalizeOrigin(origin);
  const allowed = getAllowedOrigins();
  return allowed.includes("*") || allowed.includes(cleanOrigin);
}

export function getCorsHeaders(reqOrOrigin?: Request | string | null): Record<string, string> {
  const origin = typeof reqOrOrigin === "string"
    ? reqOrOrigin
    : reqOrOrigin?.headers?.get("Origin") ?? null;

  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };

  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

/**
 * Returns a preflight response for CORS OPTIONS requests,
 * or rejects requests from forbidden origins.
 */
export function handleCors(req: Request): Response | null {
  const origin = req.headers.get("Origin");

  if (origin && !isAllowedOrigin(origin)) {
    return new Response("Forbidden origin", { status: 403 });
  }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(origin) });
  }
  return null;
}

