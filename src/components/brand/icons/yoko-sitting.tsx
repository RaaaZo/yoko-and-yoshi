import Image from "next/image";

/**
 * Full-body Yoko illustration — sitting pose with cyan collar.
 * Use for hero placements, breed hub, etc. (not inline badges — use YokoFace for those).
 */
export function YokoSitting({
  size = 200,
  alt = "Yoko",
  priority,
  className,
}: {
  size?: number;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/brand/yoko-sitting.png"
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
