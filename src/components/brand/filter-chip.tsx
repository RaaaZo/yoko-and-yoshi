"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FilterChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  dismissible?: boolean;
};

export function FilterChip({
  active,
  dismissible,
  children,
  className,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "yy-chip inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-2 text-[0.85rem] font-medium transition",
        active
          ? "border-[color:var(--color-accent-cyan)] bg-[color:var(--color-accent-cyan)] text-[color:var(--color-text-inverse)]"
          : "bg-bg-surface text-text-primary border-border-soft",
        className,
      )}
      aria-pressed={active}
      {...props}
    >
      {children}
      {dismissible && <span className="opacity-70">×</span>}
    </button>
  );
}
