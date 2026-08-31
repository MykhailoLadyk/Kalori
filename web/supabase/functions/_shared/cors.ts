const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost",
  "https://localhost",
  "capacitor://localhost",
  "ionic://localhost",
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
    return [
      normalizeOrigin(siteUrl),
      ...DEFAULT_ALLOWED_ORIGINS.map(normalizeOrigin),
    ];
  }
  return DEFAULT_ALLOWED_ORIGINS.map(normalizeOrigin);
}

export function isAllowedOrigin(origin: string): boolean {
  if (!origin) return true;
  const cleanOrigin = normalizeOrigin(origin);
  const allowed = getAllowedOrigins();
  if (allowed.includes("*") || allowed.includes(cleanOrigin)) {
    return true;
  }

  // Allow localhost / 127.0.0.1 / Android emulator 10.0.2.2 on any port
  if (
    /^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2)(:\d+)?$/i.test(
      cleanOrigin,
    )
  ) {
    return true;
  }

  // Allow Capacitor and Ionic mobile app origins
  if (/^(capacitor|ionic):\/\/(localhost|.*)$/i.test(cleanOrigin)) {
    return true;
  }

  // Allow local network IPs for mobile live-reload testing (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  if (
    /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i
      .test(cleanOrigin)
  ) {
    return true;
  }

  return false;
}

export function getCorsHeaders(
  reqOrOrigin?: Request | string | null,
): Record<string, string> {
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
  } else if (!origin) {
    headers["Access-Control-Allow-Origin"] = "*";
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
