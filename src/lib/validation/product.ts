import { z } from "zod";

export const productMutationSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/u, "Tylko a-z, 0-9, myślnik"),
  name: z.string().min(2).max(200),
  short_description: z.string().max(500).optional().nullable(),
  full_description: z.string().max(20000).optional().nullable(),
  own_recommendation: z.string().max(4000).optional().nullable(),
  recommending_mascot: z.enum(["yoko", "yoshi", "both", "none"]),
  price_pln: z.coerce.number().nonnegative().nullable().optional(),
  price_old_pln: z.coerce.number().nonnegative().nullable().optional(),
  allegro_url: z.string().url().nullable().optional().or(z.literal("")),
  allegro_offer_id: z.string().max(40).nullable().optional(),
  is_featured: z.coerce.boolean().optional(),
  is_recommended: z.coerce.boolean().optional(),
  sort_score: z.coerce.number().int().optional(),
  published: z.coerce.boolean().optional(),
  seo_title: z.string().max(120).nullable().optional(),
  seo_description: z.string().max(280).nullable().optional(),
});

export type ProductMutationInput = z.infer<typeof productMutationSchema>;
