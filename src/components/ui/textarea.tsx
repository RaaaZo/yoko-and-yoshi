import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-surface)] px-4 py-3 text-[0.95rem] font-body text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)] outline-none transition-[border-color,box-shadow] focus-visible:border-[color:var(--color-accent-cyan)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--color-accent-cyan)]/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--color-danger)] aria-invalid:ring-[color:var(--color-danger)]/30",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
