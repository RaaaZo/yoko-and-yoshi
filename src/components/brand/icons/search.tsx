import * as React from "react";

type SearchProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function Search({
  size = 18,
  color = "currentColor",
  className,
}: SearchProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}
