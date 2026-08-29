import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getCorsHeaders } from "./cors.ts";
import { ErrorCode, jsonError } from "./errors.ts";

interface AuthResult {
  supabase: SupabaseClient;
  user: { id: string; email?: string };
}

/**
 * Extracts the Authorization header, creates a Supabase client
 * scoped to the calling user, and verifies authentication.
 *
 * Returns a jsonError Response if auth fails, or the client + user on success.
 */
export async function authenticateRequest(
  req: Request,
): Promise<AuthResult | Response> {
  const corsHeaders = getCorsHeaders(req);
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonError("Missing authorization header", ErrorCode.UNAUTHORIZED, 401, corsHeaders);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return jsonError("Invalid or expired token", ErrorCode.UNAUTHORIZED, 401, corsHeaders);
  }

  return { supabase, user };
}

