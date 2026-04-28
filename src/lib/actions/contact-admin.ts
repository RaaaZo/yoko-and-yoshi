"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { adminActionClient } from "@/lib/safe-action";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const contactStatusSchema = z.enum(["new", "in_progress", "resolved", "spam"]);

export const updateContactMessageStatus = adminActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
      status: contactStatusSchema,
    }),
  )
  .metadata({ name: "contact.updateStatus" })
  .action(async ({ parsedInput }) => {
    const supabase = getSupabaseAdminClient();

    const update: Record<string, unknown> = { status: parsedInput.status };
    if (parsedInput.status === "resolved") {
      update.resolved_at = new Date().toISOString();
    } else if (parsedInput.status === "new" || parsedInput.status === "in_progress") {
      update.resolved_at = null;
    }

    const { error } = await supabase
      .from("contact_messages")
      .update(update)
      .eq("id", parsedInput.id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/kontakt");
    revalidatePath("/admin");
    return { ok: true };
  });
