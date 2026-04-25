"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/actions/contact";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-bg-elevated border-border-soft rounded-lg border-2 border-dashed p-8 text-center">
        <h2 className="mb-2 text-2xl">Dzięki!</h2>
        <p className="text-text-secondary">
          Wiadomość poszła. Odpowiemy najszybciej, jak możemy.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await submitContactMessage({
            name: (formData.get("name") as string) ?? "",
            email: (formData.get("email") as string) ?? "",
            message: (formData.get("message") as string) ?? "",
            website: (formData.get("website") as string) ?? "",
          });
          if (result?.serverError) {
            toast.error(result.serverError);
            return;
          }
          if (result?.validationErrors) {
            toast.error("Sprawdź pola formularza.");
            return;
          }
          setSubmitted(true);
        });
      }}
      className="bg-bg-surface border-border-soft grid gap-4 rounded-lg border-[1.5px] p-6"
    >
      <div>
        <Label htmlFor="name">Imię</Label>
        <Input id="name" name="name" required minLength={2} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="message">Wiadomość</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={6}
        />
      </div>
      {/* Honeypot — bot bait, hidden from users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <Button type="submit" variant="primary" disabled={pending} full>
        {pending ? "Wysyłam…" : "Wyślij"}
      </Button>
    </form>
  );
}
