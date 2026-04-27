import Image from "next/image";

/**
 * Combined Yoko & Yoshi illustration. Multiple poses available — pick the
 * one that fits the surrounding copy:
 *  - sitting-formal:  both upright with badges (default, polished)
 *  - sitting-relaxed: closer, faces touching
 *  - sitting-cuddle:  tight cuddle pose
 *  - standing:        both standing side-by-side
 *  - playful-01/02:   energetic poses
 *  - waving-01/02:    Yoko waving paw — good for onboarding / hello
 *  - heads:           just heads, smaller badge use
 *  - logo:            primary logo with wordmark
 */
export type YokoYoshiVariant =
  | "sitting-formal"
  | "sitting-relaxed"
  | "sitting-cuddle"
  | "standing"
  | "playful-01"
  | "playful-02"
  | "waving-01"
  | "waving-02"
  | "heads"
  | "logo";

const SRC: Record<YokoYoshiVariant, string> = {
  "sitting-formal": "/brand/yoko-yoshi-sitting-01.png",
  "sitting-relaxed": "/brand/yoko-yoshi-sitting-02.png",
  "sitting-cuddle": "/brand/yoko-yoshi-sitting-03.png",
  standing: "/brand/yoko-yoshi-standing.png",
  "playful-01": "/brand/yoko-yoshi-playful-01.png",
  "playful-02": "/brand/yoko-yoshi-playful-02.png",
  "waving-01": "/brand/yoko-yoshi-waving-01.png",
  "waving-02": "/brand/yoko-yoshi-waving-02.png",
  heads: "/brand/yoko-yoshi-heads.png",
  logo: "/brand/logo-primary.png",
};

export function YokoYoshiTogether({
  variant = "sitting-formal",
  size = 320,
  alt = "Yoko & Yoshi",
  priority,
  className,
}: {
  variant?: YokoYoshiVariant;
  size?: number;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={SRC[variant]}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={className}
      style={{
        width: "100%",
        maxWidth: size,
        height: "auto",
        display: "block",
      }}
    />
  );
}
