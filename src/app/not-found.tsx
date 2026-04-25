import Link from "next/link";

import { YokoFace } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-bg-base flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <div className="bg-bg-elevated border-border-soft mx-auto mb-6 inline-flex rounded-full border-2 border-dashed p-6">
          <YokoFace size={120} />
        </div>
        <h1 className="mb-3 text-4xl">Yoko zakopała tę stronę.</h1>
        <p className="text-text-secondary mb-8 text-lg">
          Strona, której szukasz, nie istnieje albo została przeniesiona. Może
          spróbujesz od początku?
        </p>
        <Button asChild variant="primary" size="lg">
          <Link href="/">Wróć na stronę główną</Link>
        </Button>
      </div>
    </main>
  );
}
