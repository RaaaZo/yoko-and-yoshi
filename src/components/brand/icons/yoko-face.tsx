import * as React from "react";

type YokoFaceProps = {
  size?: number;
  expression?: "happy" | "smile";
  className?: string;
};

export function YokoFace({
  size = 64,
  expression = "happy",
  className,
}: YokoFaceProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Yoko"
      className={className}
    >
      {/* head — shiba */}
      <path
        d="M50 12 C28 12 18 30 18 50 C18 70 32 84 50 84 C68 84 82 70 82 50 C82 30 72 12 50 12 Z"
        fill="#F5A05A"
        stroke="#C97A3E"
        strokeWidth="2"
      />
      {/* ears */}
      <path
        d="M22 28 L18 8 L36 22 Z"
        fill="#F5A05A"
        stroke="#C97A3E"
        strokeWidth="2"
      />
      <path
        d="M78 28 L82 8 L64 22 Z"
        fill="#F5A05A"
        stroke="#C97A3E"
        strokeWidth="2"
      />
      <path d="M24 24 L22 14 L31 22 Z" fill="#FBD7CF" />
      <path d="M76 24 L78 14 L69 22 Z" fill="#FBD7CF" />
      {/* white face mask */}
      <path
        d="M50 38 C36 38 28 50 30 64 C32 76 42 82 50 82 C58 82 68 76 70 64 C72 50 64 38 50 38 Z"
        fill="#FFF8EC"
      />
      {/* white forehead spots */}
      <ellipse cx="40" cy="30" rx="4" ry="3" fill="#FFF8EC" />
      <ellipse cx="60" cy="30" rx="4" ry="3" fill="#FFF8EC" />
      {/* eyes */}
      <ellipse cx="38" cy="48" rx="5" ry="6" fill="#2D1810" />
      <ellipse cx="62" cy="48" rx="5" ry="6" fill="#2D1810" />
      <circle cx="40" cy="46" r="1.6" fill="#fff" />
      <circle cx="64" cy="46" r="1.6" fill="#fff" />
      {/* nose */}
      <ellipse cx="50" cy="60" rx="4" ry="3" fill="#2D1810" />
      {/* mouth */}
      {expression === "happy" && (
        <path
          d="M50 64 Q44 70 40 66 M50 64 Q56 70 60 66"
          fill="none"
          stroke="#2D1810"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      {expression === "smile" && (
        <path
          d="M44 66 Q50 72 56 66"
          fill="#F47B6A"
          stroke="#2D1810"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {/* cheeks */}
      <circle cx="32" cy="58" r="3" fill="#F47B6A" opacity="0.4" />
      <circle cx="68" cy="58" r="3" fill="#F47B6A" opacity="0.4" />
    </svg>
  );
}
