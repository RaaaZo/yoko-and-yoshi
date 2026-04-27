import Image from "next/image";

/**
 * Full-body Yoshi illustration — sitting pose with coral/pink collar.
 */
export function YoshiSitting({
  size = 200,
  alt = "Yoshi",
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
      src="/brand/yoshi-sitting.png"
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
