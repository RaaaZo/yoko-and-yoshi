"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

export function NewsletterForm({
  source = "newsletter-box",
}: {
  source?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await subscribeToNewsletter({
            email: formData.get("email") as string,
            source,
          });
          if (result?.serverError) {
            toast.error(result.serverError);
            return;
          }
          if (result?.validationErrors) {
            toast.error("Sprawdź adres email.");
            return;
          }
          toast.success("Sprawdź skrzynkę — wysłaliśmy link aktywacyjny.");
          setEmail("");
        });
      }}
      className="flex flex-wrap gap-2"
    >
      <Input
        type="email"
        name="email"
        required
        placeholder="twój@email.pl"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-[220px] flex-1 rounded-full"
        disabled={pending}
      />
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "…" : "Zapisz się"}
      </Button>
    </form>
  );
}
