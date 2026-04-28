"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/actions/contact";
import { contactSchema } from "@/lib/validation/contact";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

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
      ref={formRef}
      noValidate
      action={(formData) => {
        const input = {
          name: ((formData.get("name") as string) ?? "").trim(),
          email: ((formData.get("email") as string) ?? "").trim(),
          message: ((formData.get("message") as string) ?? "").trim(),
          website: (formData.get("website") as string) ?? "",
        };

        const parsed = contactSchema.safeParse(input);
        if (!parsed.success) {
          const next: FieldErrors = {};
          for (const issue of parsed.error.issues) {
            const key = issue.path[0];
            if (key === "name" || key === "email" || key === "message") {
              next[key] ??= issue.message;
            }
          }
          setErrors(next);
          toast.error("Spójrz na podświetlone pola.");
          // Focus first errored field
          const firstKey = (["name", "email", "message"] as const).find((k) => next[k]);
          if (firstKey && formRef.current) {
            const el = formRef.current.elements.namedItem(firstKey);
            if (el instanceof HTMLElement) el.focus();
          }
          return;
        }

        setErrors({});
        startTransition(async () => {
          const result = await submitContactMessage(parsed.data);
          if (result?.serverError) {
            toast.error(result.serverError);
            return;
          }
          if (result?.validationErrors) {
            // Server-side validation rarely fires given client pre-check, but
            // fall back to a soft error.
            toast.error("Spójrz na podświetlone pola.");
            return;
          }
          setSubmitted(true);
        });
      }}
      className="bg-bg-surface border-border-soft grid gap-4 rounded-lg border-[1.5px] p-6"
    >
      <Field
        id="name"
        label="Imię"
        required
        error={errors.name}
        autoComplete="given-name"
      />
      <Field
        id="email"
        label="Email"
        type="email"
        required
        error={errors.email}
        autoComplete="email"
      />
      <Field
        id="message"
        label="Wiadomość"
        as="textarea"
        rows={6}
        required
        error={errors.message}
      />
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

function Field({
  id,
  label,
  required,
  error,
  as,
  type,
  rows,
  autoComplete,
}: {
  id: "name" | "email" | "message";
  label: string;
  required?: boolean;
  error?: string;
  as?: "textarea";
  type?: string;
  rows?: number;
  autoComplete?: string;
}) {
  const errorId = `${id}-error`;
  const commonProps = {
    id,
    name: id,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": error ? errorId : undefined,
    autoComplete,
  };

  return (
    <div>
      <Label htmlFor={id} className="mb-1.5">
        {label}
        {required && (
          <>
            <span aria-hidden className="text-[color:var(--color-primary)]">
              *
            </span>
            <span className="sr-only"> (wymagane)</span>
          </>
        )}
      </Label>
      {as === "textarea" ? (
        <Textarea {...commonProps} rows={rows} />
      ) : (
        <Input {...commonProps} type={type} />
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[0.85rem] text-[color:var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
