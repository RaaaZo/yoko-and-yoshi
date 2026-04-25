import * as React from "react";

import { YokoFace, YoshiFace } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

type MascotCalloutProps = {
  speaker?: "yoko" | "yoshi";
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function MascotCallout({
  speaker = "yoko",
  title,
  children,
  className,
}: MascotCalloutProps) {
  const isYoko = speaker === "yoko";
  return (
    <div
      className={cn(
        "relative flex items-start gap-4 rounded-lg border-2 border-dashed p-5",
        isYoko
          ? "border-[color:var(--color-secondary)] bg-[color:var(--color-secondary-soft)]"
          : "border-[color:var(--color-accent-coral)] bg-[color:var(--color-primary-soft)]",
        className,
      )}
    >
      <div className="shrink-0">
        {isYoko ? <YokoFace size={64} /> : <YoshiFace size={64} />}
      </div>
      <div className="flex-1">
        <div
          className={cn(
            "font-display mb-1 text-[0.95rem] font-semibold",
            isYoko ? "text-[#8C5226]" : "text-[#A24A3A]",
          )}
        >
          {title ?? (isYoko ? "Yoko mówi:" : "Yoshi mówi:")}
        </div>
        <div className="text-text-primary text-[0.95rem] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
