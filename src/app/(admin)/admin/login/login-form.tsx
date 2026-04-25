"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword } from "@/lib/actions/auth";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await signInWithPassword({
            email: (formData.get("email") as string) ?? "",
            password: (formData.get("password") as string) ?? "",
            redirectTo,
          });
          if (result?.serverError) {
            toast.error(result.serverError);
          }
          if (result?.validationErrors) {
            toast.error("Sprawdź pola formularza.");
          }
        });
      }}
      className="grid gap-4"
    >
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
        <Label htmlFor="password">Hasło</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" variant="primary" disabled={pending} full>
        {pending ? "Loguję…" : "Zaloguj"}
      </Button>
      <p className="text-text-muted mt-2 text-center text-[0.78rem]">
        Konto admin tworzymy ręcznie. Brak możliwości rejestracji.
      </p>
    </form>
  );
}
