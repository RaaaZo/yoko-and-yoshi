import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "yy-btn-anim inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-display font-semibold tracking-[0.01em]",
    "border-2 border-transparent",
    "transition-[transform,box-shadow,background-color,color] duration-150",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--color-accent-cyan)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] shadow-md hover:bg-[color:var(--color-primary-hover)]",
        secondary:
          "bg-[color:var(--color-bg-warm)] text-[color:var(--color-text-primary)] border-[color:var(--color-border-soft)] hover:bg-[color:var(--color-bg-elevated)]",
        ghost:
          "bg-transparent text-[color:var(--color-text-primary)] border-[color:var(--color-border-soft)] hover:bg-[color:var(--color-bg-warm)]",
        link: "bg-transparent text-[color:var(--color-accent-cyan)] shadow-none hover:underline underline-offset-4 px-1 py-2 min-h-0",
        cyan: "bg-[color:var(--color-accent-cyan)] text-[color:var(--color-text-inverse)] hover:brightness-95",
        affiliate:
          "bg-[color:var(--color-cta-affiliate)] text-[color:var(--color-text-inverse)] shadow-md hover:bg-[color:var(--color-cta-affiliate-hover)]",
        destructive:
          "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)] border-[color:var(--color-danger)]/30 hover:bg-[color:var(--color-danger)]/20",
        // shadcn compatibility aliases — auto-generated components reference these
        default:
          "bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] shadow-md hover:bg-[color:var(--color-primary-hover)]",
        outline:
          "bg-transparent text-[color:var(--color-text-primary)] border-[color:var(--color-border-soft)] hover:bg-[color:var(--color-bg-warm)]",
      },
      size: {
        sm: "h-9 min-h-9 px-3.5 text-[0.85rem]",
        md: "h-11 min-h-11 px-[22px] py-3 text-[0.95rem]",
        lg: "h-13 min-h-13 px-7 py-4 text-[1.05rem]",
        xl: "h-15 min-h-15 px-8 py-5 text-[1.15rem]",
        icon: "size-11 min-h-11 px-0",
        // shadcn compatibility aliases
        default: "h-11 min-h-11 px-[22px] py-3 text-[0.95rem]",
        "icon-sm": "size-9 min-h-9 px-0",
        "icon-lg": "size-13 min-h-13 px-0",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      full: false,
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  full,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, full, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
