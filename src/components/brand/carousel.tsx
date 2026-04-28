"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic horizontal carousel — used for product cards, category tiles,
 * article cards, etc. Caller decides what goes inside.
 *
 * Implementation: native CSS `overflow-x-auto` with scroll-snap on the
 * track. No JS dependency for the swipe behaviour itself — buttons just
 * call `scrollBy()` with smooth behaviour. Edge state (whether we can
 * scroll left/right) is computed from scroll position and updates on
 * scroll + resize, so arrows fade out when there's nowhere to go.
 *
 * Caller is responsible for sizing each child (e.g. `w-[280px] shrink-0
 * snap-start`).
 */
export function Carousel({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  function scrollByCards(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    // Roughly one viewport-worth of cards.
    const delta = el.clientWidth * 0.85 * direction;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
        className="yy-no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 py-2 sm:-mx-6 sm:px-6"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Poprzednie"
        onClick={() => scrollByCards(-1)}
        disabled={!canPrev}
        className="bg-bg-surface border-border-soft text-text-primary absolute top-1/2 -left-4 hidden size-11 -translate-y-1/2 place-items-center rounded-full border-[1.5px] shadow-md transition disabled:pointer-events-none disabled:opacity-0 md:grid"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        aria-label="Następne"
        onClick={() => scrollByCards(1)}
        disabled={!canNext}
        className="bg-bg-surface border-border-soft text-text-primary absolute top-1/2 -right-4 hidden size-11 -translate-y-1/2 place-items-center rounded-full border-[1.5px] shadow-md transition disabled:pointer-events-none disabled:opacity-0 md:grid"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
