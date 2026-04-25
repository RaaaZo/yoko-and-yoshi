import * as React from "react";

type YoshiFaceProps = {
  size?: number;
  expression?: "happy" | "smile";
  className?: string;
};

export function YoshiFace({
  size = 64,
  expression = "smile",
  className,
}: YoshiFaceProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Yoshi"
      className={className}
    >
      {/* head — slightly fluffier */}
      <path
        d="M50 12 C28 12 16 30 18 52 C20 72 32 84 50 84 C68 84 80 72 82 52 C84 30 72 12 50 12 Z"
        fill="#FFF8EC"
        stroke="#D4A373"
        strokeWidth="2"
      />
      {/* ears */}
      <path
        d="M22 28 L17 6 L37 22 Z"
        fill="#FFF8EC"
        stroke="#D4A373"
        strokeWidth="2"
      />
      <path
        d="M78 28 L83 6 L63 22 Z"
        fill="#FFF8EC"
        stroke="#D4A373"
        strokeWidth="2"
      />
      <path d="M24 24 L21 12 L32 22 Z" fill="#F8C8C0" />
      <path d="M76 24 L79 12 L68 22 Z" fill="#F8C8C0" />
      {/* eyes */}
      <ellipse cx="38" cy="48" rx="5" ry="6" fill="#2D1810" />
      <ellipse cx="62" cy="48" rx="5" ry="6" fill="#2D1810" />
      <circle cx="40" cy="46" r="1.6" fill="#fff" />
      <circle cx="64" cy="46" r="1.6" fill="#fff" />
      {/* pink nose */}
      <ellipse cx="50" cy="60" rx="4" ry="3" fill="#E89B95" />
      {/* mouth */}
      {expression === "smile" && (
        <path
          d="M44 66 Q50 71 56 66"
          fill="none"
          stroke="#2D1810"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      {expression === "happy" && (
        <path
          d="M50 64 Q44 70 40 66 M50 64 Q56 70 60 66"
          fill="none"
          stroke="#2D1810"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      {/* cheeks */}
      <circle cx="32" cy="58" r="3" fill="#F47B6A" opacity="0.35" />
      <circle cx="68" cy="58" r="3" fill="#F47B6A" opacity="0.35" />
    </svg>
  );
}
