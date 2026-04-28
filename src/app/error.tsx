"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-bg-base flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-3 text-4xl">Coś nie pykło.</h1>
        <p className="text-text-secondary mb-8 text-lg">
          Najczęściej pomaga odświeżenie. Jeśli nie —{" "}
          <a href="/kontakt" className="text-accent-cyan underline">
            napisz do nas
          </a>
          , zerkniemy.
        </p>
        {error.digest && (
          <p className="text-text-muted mb-8 font-mono text-xs">
            ref: {error.digest}
          </p>
        )}
        <Button variant="primary" onClick={reset}>
          Spróbuj ponownie
        </Button>
      </div>
    </main>
  );
}
