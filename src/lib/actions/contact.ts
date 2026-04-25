"use server";

import { headers } from "next/headers";

import { actionClient } from "@/lib/safe-action";
import { logger } from "@/lib/logger";
import { contactFormLimiter } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validation/contact";
import { hashForTelemetry } from "@/lib/utils";

export const submitContactMessage = actionClient
  .schema(contactSchema)
  .metadata({ name: "contact.submit" })
  .action(async ({ parsedInput }) => {
    if (parsedInput.website) {
      // Honeypot tripped — silently accept, do nothing
      return { ok: true };
    }

    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";

    if (contactFormLimiter) {
      const { success } = await contactFormLimiter.limit(ip);
      if (!success) {
        throw new Error("Zbyt wiele wiadomości. Spróbuj za chwilę.");
      }
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsedInput.name,
      email: parsedInput.email,
      message: parsedInput.message,
      ip_hash: await hashForTelemetry(ip),
    });

    if (error) {
      logger.error({ err: error }, "contact submit failed");
      throw new Error("Coś poszło nie tak. Spróbuj ponownie.");
    }

    return { ok: true };
  });
