import * as React from "react";

import { cn } from "@/lib/utils";

type YokoFaceProps = {
  size?: number;
  className?: string;
};

/**
 * Circular Yoko avatar — backed by a pre-cropped PNG of his head.
 * Padding inside the source image already accounts for the ear tips,
 * so we just need `background-size: cover` + center positioning to get
 * a clean circular crop at any size.
 */
export function YokoFace({ size = 64, className }: YokoFaceProps) {
  return (
    <span
      role="img"
      aria-label="Yoko"
      className={cn("inline-block shrink-0 rounded-full", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: "#FCE2CB",
        backgroundImage: "url(/brand/yoko-head.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
