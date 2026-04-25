"use server";

import { headers } from "next/headers";
import { randomBytes } from "node:crypto";

import { actionClient } from "@/lib/safe-action";
import { logger } from "@/lib/logger";
import { newsletterSubscribeLimiter } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { subscribeSchema } from "@/lib/validation/newsletter";

export const subscribeToNewsletter = actionClient
  .schema(subscribeSchema)
  .metadata({ name: "newsletter.subscribe" })
  .action(async ({ parsedInput }) => {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";

    if (newsletterSubscribeLimiter) {
      const { success } = await newsletterSubscribeLimiter.limit(ip);
      if (!success) {
        throw new Error("Zbyt wiele prób. Spróbuj za chwilę.");
      }
    }

    const supabase = getSupabaseAdminClient();
    const confirmToken = randomBytes(24).toString("hex");

    // Upsert by email — re-subscribers get a fresh confirm token
    const { error } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: parsedInput.email.toLowerCase(),
        confirmed: false,
        confirm_token: confirmToken,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
        source: parsedInput.source ?? null,
      },
      { onConflict: "email" },
    );

    if (error) {
      logger.error({ err: error }, "newsletter subscribe failed");
      throw new Error("Coś poszło nie tak. Spróbuj ponownie.");
    }

    // TODO Phase 4: actually send confirmation email via Resend.
    logger.info(
      { email: parsedInput.email, confirmToken },
      "newsletter pending confirmation",
    );

    return { ok: true };
  });
