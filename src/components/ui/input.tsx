import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-surface)] px-4 py-2 text-[0.95rem] font-body text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)] outline-none transition-[border-color,box-shadow] focus-visible:border-[color:var(--color-accent-cyan)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--color-accent-cyan)]/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--color-danger)] aria-invalid:ring-[color:var(--color-danger)]/30",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[color:var(--color-text-primary)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
