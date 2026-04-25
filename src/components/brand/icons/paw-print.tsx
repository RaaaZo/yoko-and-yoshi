import * as React from "react";

type PawPrintProps = {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
};

export function PawPrint({
  size = 16,
  color = "currentColor",
  opacity = 1,
  className,
}: PawPrintProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ opacity }}
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="12" cy="15" rx="5" ry="4.5" fill={color} />
      <ellipse cx="6" cy="9" rx="2.2" ry="2.8" fill={color} />
      <ellipse cx="18" cy="9" rx="2.2" ry="2.8" fill={color} />
      <ellipse cx="9" cy="5" rx="1.8" ry="2.2" fill={color} />
      <ellipse cx="15" cy="5" rx="1.8" ry="2.2" fill={color} />
    </svg>
  );
}
