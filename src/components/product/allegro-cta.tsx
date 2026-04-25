"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AllegroCTAProps = {
  href: string;
  productId?: string;
  price?: string;
  full?: boolean;
  sticky?: boolean;
  className?: string;
  label?: string;
};

/**
 * Affiliate link to Allegro. Always opens in a new tab with
 * rel="sponsored noopener" — search engines must see the affiliate
 * relationship, and we don't expose window.opener.
 *
 * Click tracking happens client-side via fetch with keepalive: the
 * navigation isn't blocked even if the request is in flight.
 */
export function AllegroCTA({
  href,
  productId,
  price,
  full,
  sticky,
  className,
  label = "Zobacz na Allegro",
}: AllegroCTAProps) {
  const handleClick = React.useCallback(() => {
    if (!productId) return;
    try {
      void fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          referrerPath:
            typeof window !== "undefined" ? window.location.pathname : null,
        }),
        keepalive: true,
      });
    } catch {
      // Tracking is best-effort. Never block navigation.
    }
  }, [productId]);

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "yy-btn-anim font-display inline-flex items-center justify-center gap-3 rounded-full bg-[color:var(--color-cta-affiliate)] text-[color:var(--color-text-inverse)] shadow-md transition hover:bg-[color:var(--color-cta-affiliate-hover)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--color-accent-cyan)]",
        full ? "w-full" : "",
        sticky ? "px-5 py-4 text-[1.05rem]" : "px-6 py-4 text-[1.05rem]",
        "min-h-14",
        className,
      )}
      style={sticky ? { boxShadow: "0 -4px 16px rgba(0,0,0,.12)" } : undefined}
    >
      <span className="inline-flex items-center gap-2.5">
        <span
          className="font-display grid size-7 place-items-center rounded-md bg-white text-lg font-bold text-[color:var(--color-cta-affiliate)]"
          aria-hidden
        >
          ↗
        </span>
        {label}
      </span>
      {price && (
        <span className="font-display ml-auto text-[1.1rem] font-bold">
          {price}
        </span>
      )}
    </a>
  );
}
