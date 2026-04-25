import * as React from "react";

type SparkleProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function Sparkle({
  size = 14,
  color = "var(--color-secondary)",
  className,
}: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill={color}
      />
    </svg>
  );
}
