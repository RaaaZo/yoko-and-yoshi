"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const KEY = "yy.cookie.consent.v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(KEY);
    if (!stored) setShow(true);
  }, []);

  if (!show) return null;

  function decide(value: "accept" | "essentials") {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ value, at: new Date().toISOString() }),
    );
    setShow(false);
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
