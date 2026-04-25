import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Niepoprawny adres email"),
  password: z.string().min(8, "Hasło min. 8 znaków"),
  redirectTo: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
