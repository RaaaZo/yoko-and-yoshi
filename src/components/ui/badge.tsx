import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap",
    "rounded-full px-3 py-1 font-body text-[0.78rem] font-semibold tracking-wide",
    "border border-transparent transition-colors",
    "[&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:size-3",
  ].join(" "),
  {
    variants: {
      tone: {
        primary:
          "bg-[color:var(--color-primary-soft)] text-[#A24A3A]",
        secondary:
          "bg-[color:var(--color-secondary-soft)] text-[#8C5226]",
        cyan:
          "bg-[color:var(--color-accent-cyan-soft)] text-[#1E6B76]",
        cream:
          "bg-[color:var(--color-bg-warm)] text-[color:var(--color-text-primary)]",
        success: "bg-[#DDEFC4] text-[#4A6B1F]",
        new: "bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)]",
        outline:
          "bg-transparent border-[color:var(--color-border-soft)] text-[color:var(--color-text-secondary)]",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

function Badge({
  className,
  tone,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-tone={tone}
      className={cn(badgeVariants({ tone }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
