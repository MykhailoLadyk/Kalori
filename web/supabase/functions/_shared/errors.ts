import { corsHeaders } from "./cors.ts";

/** Standard error codes for structured client-side handling. */
export const ErrorCode = {
  RATE_LIMITED: "RATE_LIMITED",
  INSUFFICIENT_COINS: "INSUFFICIENT_COINS",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_INPUT: "INVALID_INPUT",
  AI_ERROR: "AI_ERROR",
  NO_FOOD_DETECTED: "NO_FOOD_DETECTED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Returns a JSON error response with consistent structure.
 */
export function jsonError(
  message: string,
  code: ErrorCodeType,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(
    JSON.stringify({ error: message, code }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        ...extraHeaders,
      },
    },
  );
}

/**
 * Returns a JSON success response with consistent structure.
 */
export function jsonSuccess(
  data: unknown,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        ...extraHeaders,
      },
    },
  );
}
