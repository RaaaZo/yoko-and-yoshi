"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const KEY = "yy.cookie.consent.v1";

/**
 * Subscribe to localStorage["yy.cookie.consent.v1"] using
 * useSyncExternalStore — React 19's recommended way to read browser-only
 * state without falling foul of the `set-state-in-effect` rule.
 */
function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export function CookieBanner() {
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  // After making a decision in this tab, the storage event doesn't fire —
  // hide the banner via local state instead of relying on the snapshot.
  const [dismissed, setDismissed] = useState(false);

  if (stored || dismissed) return null;

  function decide(value: "accept" | "essentials") {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ value, at: new Date().toISOString() }),
    );
    setDismissed(true);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="bg-bg-surface border-border-default mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border-2 border-dashed p-5 shadow-lg md:flex-row md:items-center">
        <div className="text-text-primary flex-1 text-[0.92rem] leading-relaxed">
          Używamy ciasteczek, by mierzyć ruch i ulepszać polecenia. Czytaj{" "}
          <Link href="/polityka-cookies" className="text-accent-cyan underline">
            politykę cookies
          </Link>{" "}
          oraz{" "}
          <Link
            href="/polityka-prywatnosci"
            className="text-accent-cyan underline"
          >
            politykę prywatności
          </Link>
          .
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => decide("essentials")}
          >
            Tylko niezbędne
          </Button>
          <Button variant="primary" size="sm" onClick={() => decide("accept")}>
            Akceptuję
          </Button>
        </div>
      </div>
    </div>
  );
}
