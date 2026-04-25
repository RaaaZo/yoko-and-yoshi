import "server-only";

import {
  createSafeActionClient,
  returnValidationErrors,
} from "next-safe-action";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

/**
 * Public safe action client — no auth required. Used for newsletter signup,
 * contact form, click tracking forwarded from client.
 */
export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({ name: z.string() });
  },
  handleServerError(error, { metadata }) {
    logger.error(
      { err: error, action: metadata?.name },
      "Safe action server error",
    );
    return process.env.NODE_ENV === "development"
      ? error.message
      : "Something went wrong. Please try again.";
  },
});

/**
 * Authenticated client — adds session.user to ctx. Throws if unauthenticated.
 */
export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { user, supabase } });
});

/**
 * Admin-only client — checks the profile.role = 'admin' before proceeding.
 */
export const adminActionClient = authActionClient.use(async ({ ctx, next }) => {
  const { data: profile, error } = await ctx.supabase
    .from("profiles")
    .select("role")
    .eq("id", ctx.user.id)
    .single();

  if (error || !profile || (profile as { role?: string }).role !== "admin") {
    throw new Error("Forbidden — admin role required");
  }

  return next({ ctx });
});

export { returnValidationErrors };
