import { SupabaseClient } from "@supabase/supabase-js";
import { ErrorCode, jsonError } from "./errors.ts";

const DAILY_LIMIT = 20;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  current: number;
  limit: number;
}

/**
 * Atomically checks and increments the user's daily AI usage.
 *
 * Uses the `check_and_increment_ai_usage` RPC which performs an atomic
 * INSERT ... ON CONFLICT DO UPDATE with a WHERE guard, eliminating the
 * TOCTOU race condition of the old check-then-increment approach.
 *
 * The server determines the date (UTC), not the client.
 *
 * Returns a jsonError Response if rate-limited, or the RateLimitResult on success.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
): Promise<RateLimitResult | Response> {
  const { data, error } = await supabase.rpc("check_and_increment_ai_usage", {
    p_daily_limit: DAILY_LIMIT,
  });

  if (error) {
    console.error("Rate limit RPC error:", error);
    return jsonError(
      "Failed to check usage quota",
      ErrorCode.INTERNAL_ERROR,
      500,
    );
  }

  const result = data as RateLimitResult;

  if (!result.allowed) {
    return jsonError(
      `Daily AI limit reached (${result.limit} requests per day)`,
      ErrorCode.RATE_LIMITED,
      429,
      {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
      },
    );
  }

  return result;
}

/**
 * Returns rate-limit headers to attach to successful responses.
 */
export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  };
}
