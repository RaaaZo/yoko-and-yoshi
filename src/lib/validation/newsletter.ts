import { z } from "zod";

export const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, "Email jest wymagany")
    .email("Niepoprawny adres email"),
  source: z.string().max(64).optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
