import { SupabaseClient } from "@supabase/supabase-js";
import { ErrorCode, jsonError } from "./errors.ts";

const DAILY_LIMIT = 20;
const GLOBAL_LIMIT = 2000;

export interface RateLimitResult {
  allowed: boolean;
  global_allowed?: boolean;
  remaining: number;
  current: number;
  limit: number;
}

/**
 * Atomically checks and increments both the user's daily AI usage and the project-wide global usage.
 *
 * Uses the `check_and_increment_ai_usage_v2` RPC which performs atomic checks and increments.
 *
 * The server determines the date (UTC), not the client.
 *
 * Returns a jsonError Response if rate-limited, or the RateLimitResult on success.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
): Promise<RateLimitResult | Response> {
  const { data, error } = await supabase.rpc("check_and_increment_ai_usage_v2", {
    p_daily_limit: DAILY_LIMIT,
    p_global_limit: GLOBAL_LIMIT,
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
    // If the global limit was the one that tripped
    if (result.global_allowed === false) {
      return jsonError(
        `System-wide AI capacity reached for today. Please try again tomorrow.`,
        ErrorCode.RATE_LIMITED,
        429,
        {
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
        },
      );
    }
    
    // Otherwise it was the personal limit
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
