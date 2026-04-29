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
          {/* floppy drooping ears */}
          <path d="M18 22 Q10 24 10 34 Q10 40 17 38" />
          <path d="M46 22 Q54 24 54 34 Q54 40 47 38" />
          {/* round face */}
          <circle cx="32" cy="34" r="14" />
          {/* muzzle (lower lighter shape) */}
          <ellipse cx="32" cy="40" rx="7" ry="4" />
          {/* nose */}
          <ellipse cx="32" cy="37" rx="2" ry="1.5" fill={color} />
          {/* smile */}
          <path d="M28 41 Q32 44 36 41" />
          {/* eyes */}
          <circle cx="26" cy="32" r="1.5" fill={color} />
          <circle cx="38" cy="32" r="1.5" fill={color} />
        </svg>
      );
    case "cat":
      return (
        <svg {...props} aria-label="Kot">
          {/* tall pointy ears */}
          <path d="M14 30 L20 12 L26 28" />
          <path d="M38 28 L44 12 L50 30" />
          {/* inner ear lines */}
          <path d="M19 24 L20 18 L21 24" />
          <path d="M43 24 L44 18 L45 24" />
          {/* face — slightly heart-shaped at the bottom */}
          <path d="M16 30 Q14 42 22 47 Q32 52 42 47 Q50 42 48 30" />
          {/* eyes — almond */}
          <ellipse cx="26" cy="34" rx="2" ry="1.5" fill={color} />
          <ellipse cx="38" cy="34" rx="2" ry="1.5" fill={color} />
          {/* nose — small downward triangle */}
          <path d="M30 39 L34 39 L32 42 Z" fill={color} />
          {/* mouth */}
          <path d="M30 43 Q32 45 34 43" />
          {/* whiskers */}
          <line x1="20" y1="38" x2="10" y2="36" />
          <line x1="20" y1="40" x2="10" y2="42" />
          <line x1="44" y1="38" x2="54" y2="36" />
          <line x1="44" y1="40" x2="54" y2="42" />
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
