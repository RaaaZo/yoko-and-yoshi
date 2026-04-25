import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Podaj imię").max(120),
  email: z.string().email("Niepoprawny adres email"),
  message: z
    .string()
    .min(10, "Wiadomość musi mieć min. 10 znaków")
    .max(4000, "Wiadomość zbyt długa"),
  // Honeypot — must be empty
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
