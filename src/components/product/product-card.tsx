import Image from "next/image";
import Link from "next/link";

import { BadgeRecommended } from "@/components/brand/badge-recommended";
import { Badge } from "@/components/ui/badge";
import { cn, formatPricePLN } from "@/lib/utils";
import type { ComponentProps } from "react";
import type { RecommendingMascot } from "@/types/domain";
import { StarRating } from "./star-rating";

type ProductCardProps = {
  href: string;
  // kicker shown above name — item-type/tag (e.g. "Szarpaki"), NOT brand name
  kicker?: string | null;
  name: string;
  imageUrl?: string | null;
  imageAlt?: string;
  blurDataUrl?: string | null;
  price?: number | string | null;
  oldPrice?: number | string | null;
  recommended?: RecommendingMascot;
  rating?: number | null;
  ratingCount?: number;
  badge?: { label: string; tone?: ComponentProps<typeof Badge>["tone"] };
  allegroUrl?: string | null;
  productId?: string;
  priority?: boolean;
};

export function ProductCard({
  href,
  kicker,
  name,
  imageUrl,
  imageAlt,
  blurDataUrl,
  price,
  oldPrice,
  recommended,
  rating,
  ratingCount,
  badge,
  allegroUrl,
  productId,
  priority,
}: ProductCardProps) {
  const formattedPrice = formatPricePLN(price ?? null);
  const formattedOldPrice = formatPricePLN(oldPrice ?? null);
  const recommender =
    recommended === "yoko" || recommended === "yoshi" ? recommended : null;

  return (
    <Link
      href={href}
      className={cn(
        "yy-product-card bg-bg-surface border-border-soft group flex flex-col gap-2.5 rounded-lg border-[1.5px] p-3.5 no-underline",
      )}
    >
      <div className="bg-bg-warm relative aspect-square overflow-hidden rounded-md">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            sizes="(min-width: 1280px) 240px, (min-width: 768px) 33vw, 50vw"
            placeholder={blurDataUrl ? "blur" : "empty"}
            blurDataURL={blurDataUrl ?? undefined}
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(212,163,115,.18) 0 8px, transparent 8px 20px)",
            }}
            aria-hidden
          />
        )}
        {badge && (
          <div className="absolute top-2.5 left-2.5">
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </div>
        )}
        {recommender && (
          <div className="absolute top-2.5 right-2.5">
            <BadgeRecommended speaker={recommender} />
          </div>
        )}
      </div>

      {kicker && (
        <div className="text-text-muted text-[0.75rem] font-semibold tracking-[0.05em] uppercase">
          {kicker}
        </div>
      )}

      <h3 className="font-body text-text-primary m-0 line-clamp-3 min-h-[3.9em] text-[0.95rem] leading-snug font-semibold">
        {name}
      </h3>

      {rating ? (
        <div className="text-text-secondary flex h-5 items-center gap-1.5 text-[0.8rem]">
          <StarRating rating={rating} />
          <span>
            {rating}
            {typeof ratingCount === "number" && ` (${ratingCount})`}
          </span>
        </div>
      ) : (
        <div className="h-5" aria-hidden />
      )}

      <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          {formattedOldPrice && (
            <span className="text-text-muted mr-1.5 text-[0.78rem] line-through">
              {formattedOldPrice}
            </span>
          )}
          {formattedPrice && (
            <span className="num text-text-primary text-[1.15rem]">
              {formattedPrice}
            </span>
          )}
        </div>
        {allegroUrl && (
          <span
            className="font-display inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[color:var(--color-cta-allegro)] px-2.5 py-1 text-[0.72rem] font-semibold text-white sm:gap-1 sm:px-3 sm:py-1.5 sm:text-[0.78rem]"
            data-product-id={productId}
          >
            Allegro <span aria-hidden>↗</span>
          </span>
        )}
      </div>
    </Link>
  );
}
