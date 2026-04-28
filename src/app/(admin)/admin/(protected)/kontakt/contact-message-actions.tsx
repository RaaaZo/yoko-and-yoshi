"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateContactMessageStatus } from "@/lib/actions/contact-admin";

type ContactStatus = "new" | "in_progress" | "resolved" | "spam";

export function ContactMessageActions({
  id,
  status,
}: {
  id: string;
  status: ContactStatus;
}) {
  const [pending, startTransition] = useTransition();

  function setStatus(next: ContactStatus) {
    startTransition(async () => {
      const result = await updateContactMessageStatus({ id, status: next });
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      toast.success(NEXT_STATUS_TOAST[next]);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "new" && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => setStatus("in_progress")}
        >
          Oznacz: w toku
        </Button>
      )}
      {status !== "resolved" && status !== "spam" && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={pending}
          onClick={() => setStatus("resolved")}
        >
          Rozwiązane
        </Button>
      )}
      {status !== "spam" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => setStatus("spam")}
        >
          Spam
        </Button>
      )}
      {(status === "resolved" || status === "spam") && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => setStatus("new")}
        >
          Przywróć
        </Button>
      )}
    </div>
  );
}

const NEXT_STATUS_TOAST: Record<ContactStatus, string> = {
  new: "Przywrócone do nowych.",
  in_progress: "Oznaczone jako w toku.",
  resolved: "Oznaczone jako rozwiązane.",
  spam: "Oznaczone jako spam.",
};
