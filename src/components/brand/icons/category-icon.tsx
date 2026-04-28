import * as React from "react";

export type CategoryIconKind =
  | "zabawki"
  | "pielegnacja"
  | "maty-i-legowiska"
  | "miski"
  | "akcesoria"
  | "drapaki";

type Props = {
  kind: CategoryIconKind;
  size?: number;
  color?: string;
  className?: string;
};

/**
 * One SVG per shop category, sharing the brand's solid-fill ellipse
 * vocabulary (same look as PawPrint and the species icons). Drawn in a
 * 56×56 viewBox so they slot into existing tiles without further
 * scaling.
 */
export function CategoryIcon({
  kind,
  size = 56,
  color = "var(--color-secondary)",
  className,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      aria-hidden="true"
      className={className}
    >
      {KIND_TO_SHAPE[kind](color)}
    </svg>
  );
}

const KIND_TO_SHAPE: Record<
  CategoryIconKind,
  (color: string) => React.ReactElement
> = {
  // Tennis ball — circle with curved seam (the classic ball shape).
  zabawki: (color) => (
    <g>
      <circle cx="28" cy="28" r="18" fill={color} />
      <path
        d="M12 22 Q28 30, 44 22"
        fill="none"
        stroke="var(--color-bg-base)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 34 Q28 26, 44 34"
        fill="none"
        stroke="var(--color-bg-base)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  ),

  // Slicker brush — handle on the left, padded head with bristles.
  pielegnacja: (color) => (
    <g>
      {/* handle */}
      <rect
        x="6"
        y="25"
        width="18"
        height="6"
        rx="3"
        fill={color}
        opacity="0.55"
      />
      {/* head */}
      <rect x="22" y="20" width="22" height="16" rx="4" fill={color} />
      {/* bristles */}
      <line x1="26" y1="36" x2="26" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="31" y1="36" x2="31" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="36" x2="36" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="41" y1="36" x2="41" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </g>
  ),

  // Donut bed — outer rim ellipse + inner cushion ellipse.
  "maty-i-legowiska": (color) => (
    <g>
      {/* shadow */}
      <ellipse cx="28" cy="44" rx="20" ry="3" fill={color} opacity="0.2" />
      {/* outer rim */}
      <ellipse cx="28" cy="36" rx="22" ry="9" fill={color} />
      {/* inner cushion */}
      <ellipse cx="28" cy="32" rx="14" ry="5" fill={color} opacity="0.55" />
    </g>
  ),

  // Bowl in side profile — half-pill shape with rim, plus 2 kibbles.
  miski: (color) => (
    <g>
      {/* bowl body */}
      <path d="M10 24 Q28 50, 46 24 Z" fill={color} />
      {/* rim */}
      <ellipse cx="28" cy="22" rx="18" ry="3.5" fill={color} opacity="0.6" />
      {/* kibbles inside (slightly above rim line) */}
      <ellipse cx="22" cy="20" rx="2.8" ry="2" fill="var(--color-bg-base)" />
      <ellipse cx="32" cy="20.5" rx="2.8" ry="2" fill="var(--color-bg-base)" />
    </g>
  ),

  // Collar with hanging tag — arc + small disc.
  akcesoria: (color) => (
    <g>
      {/* collar arc */}
      <path
        d="M10 22 C 10 14, 46 14, 46 22 C 46 26, 38 28, 28 28 C 18 28, 10 26, 10 22 Z"
        fill={color}
      />
      {/* buckle accent */}
      <rect x="26" y="18" width="4" height="6" rx="0.8" fill="var(--color-bg-base)" opacity="0.7" />
      {/* tag */}
      <circle cx="28" cy="38" r="6" fill={color} />
      <circle cx="28" cy="38" r="2.2" fill="var(--color-bg-base)" opacity="0.8" />
      {/* tag connector */}
      <rect x="27" y="28" width="2" height="5" fill={color} />
    </g>
  ),

  // Scratching post — vertical post on a base, sisal grooves.
  drapaki: (color) => (
    <g>
      {/* base */}
      <rect x="10" y="42" width="36" height="6" rx="2" fill={color} opacity="0.7" />
      {/* post */}
      <rect x="22" y="10" width="12" height="32" rx="1" fill={color} />
      {/* sisal wrap lines */}
      <line x1="22" y1="18" x2="34" y2="18" stroke="var(--color-bg-base)" strokeWidth="1.5" opacity="0.5" />
      <line x1="22" y1="26" x2="34" y2="26" stroke="var(--color-bg-base)" strokeWidth="1.5" opacity="0.5" />
      <line x1="22" y1="34" x2="34" y2="34" stroke="var(--color-bg-base)" strokeWidth="1.5" opacity="0.5" />
      {/* ball on top */}
      <circle cx="28" cy="8" r="4.5" fill={color} opacity="0.8" />
    </g>
  ),
};
