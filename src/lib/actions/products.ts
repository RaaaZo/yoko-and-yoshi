"use server";

import { revalidatePath } from "next/cache";

import { adminActionClient } from "@/lib/safe-action";
import { logger } from "@/lib/logger";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { productMutationSchema } from "@/lib/validation/product";
import { z } from "zod";

export const upsertProduct = adminActionClient
  .schema(productMutationSchema)
  .metadata({ name: "products.upsert" })
  .action(async ({ parsedInput, ctx }) => {
    const supabase = getSupabaseAdminClient();
    const now = new Date().toISOString();

    const payload = {
      ...parsedInput,
      allegro_url: parsedInput.allegro_url || null,
      updated_by: ctx.user.id,
      updated_at: now,
    };

    if (parsedInput.id) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", parsedInput.id);
      if (error) {
        logger.error({ err: error }, "product update failed");
        throw new Error(error.message);
      }
      revalidatePath(`/produkt/${parsedInput.slug}`);
      revalidatePath("/");
    } else {
      const { error } = await supabase.from("products").insert({
        ...payload,
        created_by: ctx.user.id,
      });
      if (error) {
        logger.error({ err: error }, "product insert failed");
        throw new Error(error.message);
      }
      revalidatePath(`/produkt/${parsedInput.slug}`);
      revalidatePath("/");
    }

    revalidatePath("/admin/produkty");
    return { ok: true, slug: parsedInput.slug };
  });

export const togglePublishProduct = adminActionClient
  .schema(z.object({ id: z.string().uuid(), published: z.boolean() }))
  .metadata({ name: "products.togglePublish" })
  .action(async ({ parsedInput }) => {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("products")
      .update({ published: parsedInput.published })
      .eq("id", parsedInput.id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/produkty");
    revalidatePath("/");
    return { ok: true };
  });

export const deleteProduct = adminActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({ name: "products.delete" })
  .action(async ({ parsedInput }) => {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", parsedInput.id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/produkty");
    return { ok: true };
  });
