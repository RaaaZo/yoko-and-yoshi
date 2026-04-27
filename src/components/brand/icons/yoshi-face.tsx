import * as React from "react";

import { cn } from "@/lib/utils";

type YoshiFaceProps = {
  size?: number;
  className?: string;
};

/**
 * Circular Yoshi avatar — backed by a pre-cropped PNG of his head.
 * See note on YokoFace for the cropping rationale.
 */
export function YoshiFace({ size = 64, className }: YoshiFaceProps) {
  return (
    <span
      role="img"
      aria-label="Yoshi"
      className={cn("inline-block shrink-0 rounded-full", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: "#FFF8EC",
        backgroundImage: "url(/brand/yoshi-head.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
