"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { actionClient } from "@/lib/safe-action";
import { logger } from "@/lib/logger";
import { adminLoginLimiter } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/auth";

export const signInWithPassword = actionClient
  .schema(loginSchema)
  .metadata({ name: "auth.login" })
  .action(async ({ parsedInput }) => {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";

    if (adminLoginLimiter) {
      const { success } = await adminLoginLimiter.limit(ip);
      if (!success) {
        throw new Error("Zbyt wiele prób. Spróbuj za 15 minut.");
      }
    }

    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      logger.warn({ ip, code: error.status }, "admin login failed");
      throw new Error("Niepoprawny email lub hasło.");
    }

    redirect(parsedInput.redirectTo || "/admin");
  });

export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
