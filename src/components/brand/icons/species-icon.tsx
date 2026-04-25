import * as React from "react";

export type SpeciesKind =
  | "dog"
  | "cat"
  | "rodent"
  | "bird"
  | "fish"
  | "reptile";

type SpeciesIconProps = {
  kind: SpeciesKind;
  size?: number;
  color?: string;
  className?: string;
};

export function SpeciesIcon({
  kind,
  size = 56,
  color = "var(--color-text-primary)",
  className,
}: SpeciesIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none" as const,
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (kind) {
    case "dog":
      return (
        <svg {...props} aria-label="Pies">
          <path d="M14 22 L10 14 L20 18 Z M50 22 L54 14 L44 18 Z" />
          <ellipse cx="32" cy="34" rx="18" ry="16" />
          <circle cx="26" cy="32" r="1.5" fill={color} />
          <circle cx="38" cy="32" r="1.5" fill={color} />
          <path d="M28 40 Q32 43 36 40" />
          <ellipse cx="32" cy="38" rx="2" ry="1.5" fill={color} />
        </svg>
      );
    case "cat":
      return (
        <svg {...props} aria-label="Kot">
          <path d="M12 16 L14 28 M52 16 L50 28" />
          <ellipse cx="32" cy="34" rx="18" ry="15" />
          <circle cx="26" cy="32" r="1.5" fill={color} />
          <circle cx="38" cy="32" r="1.5" fill={color} />
          <path d="M30 39 L32 41 L34 39" />
          <path d="M20 35 L14 33 M20 37 L14 38 M44 35 L50 33 M44 37 L50 38" />
        </svg>
      );
    case "rodent":
      return (
        <svg {...props} aria-label="Gryzoń">
          <ellipse cx="32" cy="36" rx="16" ry="14" />
          <circle cx="22" cy="26" r="5" />
          <circle cx="42" cy="26" r="5" />
          <circle cx="27" cy="36" r="1.5" fill={color} />
          <circle cx="37" cy="36" r="1.5" fill={color} />
          <ellipse cx="32" cy="42" rx="2" ry="1.2" fill={color} />
        </svg>
      );
    case "bird":
      return (
        <svg {...props} aria-label="Ptak">
          <ellipse cx="30" cy="34" rx="14" ry="16" />
          <circle cx="34" cy="26" r="2" fill={color} />
          <path d="M44 28 L52 26 L44 32 Z" fill={color} />
          <path d="M22 44 Q26 48 30 46" />
          <path d="M30 50 L28 56 M34 50 L36 56" />
        </svg>
      );
    case "fish":
      return (
        <svg {...props} aria-label="Ryba">
          <path d="M12 32 Q22 18 38 22 Q50 26 52 32 Q50 38 38 42 Q22 46 12 32 Z" />
          <path d="M52 32 L60 24 L58 32 L60 40 Z" />
          <circle cx="22" cy="30" r="1.5" fill={color} />
          <path d="M30 32 Q34 32 38 32" />
        </svg>
      );
    case "reptile":
      return (
        <svg {...props} aria-label="Gad">
          <path d="M10 36 Q14 28 22 30 Q28 32 34 28 Q42 22 50 28 Q56 32 54 38 Q50 42 44 40 Q40 38 36 42 Q30 46 22 44 Q14 42 10 36 Z" />
          <circle cx="48" cy="32" r="1.5" fill={color} />
          <path d="M22 38 L20 44 M30 40 L30 46 M40 40 L42 46" />
        </svg>
      );
    default:
      return null;
  }
}
