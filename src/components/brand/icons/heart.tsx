import * as React from "react";

type HeartProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function Heart({
  size = 16,
  color = "var(--color-primary)",
  className,
}: HeartProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 21s-7-4.5-9.5-9C0.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8C19 16.5 12 21 12 21Z"
        fill={color}
      />
    </svg>
  );
}
