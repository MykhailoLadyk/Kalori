import { SupabaseClient } from "@supabase/supabase-js";
import { ErrorCode, jsonError } from "./errors.ts";

export interface RateLimitResult {
  allowed: boolean;
  global_allowed?: boolean;
  reason?: string;
  remaining: number;
  current: number;
  limit: number;
}

/**
 * Atomically checks and increments both the user's daily AI usage and the project-wide global usage.
 *
 * Uses the `check_and_increment_ai_usage_v2` RPC which performs atomic checks and increments.
 * Both limits are enforced server-side inside the RPC and cannot be influenced by callers:
 * 100 scans/day for Pro subscribers, 20 scans/day for Free users, and a 2000/day global cap.
 *
 * The server determines the date (UTC), not the client.
 *
 * Returns a jsonError Response if rate-limited, or the RateLimitResult on success.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  corsHeaders: Record<string, string> = {},
): Promise<RateLimitResult | Response> {
  const { data, error } = await supabase.rpc("check_and_increment_ai_usage_v2");

  if (error) {
    console.error("Rate limit RPC error:", error);
    return jsonError(
      "Failed to check usage quota",
      ErrorCode.INTERNAL_ERROR,
      500,
      corsHeaders,
    );
  }

  const result = data as RateLimitResult;

  if (!result.allowed) {
    if (result.reason === "insufficient_coins") {
      return jsonError(
        "Need 50 coins to scan meals on the Free Tier",
        ErrorCode.INSUFFICIENT_COINS,
        402,
        corsHeaders,
      );
    }

    // If the global limit was the one that tripped
    if (result.global_allowed === false) {
      return jsonError(
        `System-wide AI capacity reached for today. Please try again tomorrow.`,
        ErrorCode.RATE_LIMITED,
        429,
        {
          ...corsHeaders,
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
        ...corsHeaders,
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
