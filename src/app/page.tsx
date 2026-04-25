import Image from "next/image";

import { YokoFace, YoshiFace, PawPrint } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Phase 1 placeholder homepage — proves the design system pipeline:
 * fonts, brand tokens, mascot SVGs, button variants. Phase 2 replaces
 * this with the full template from `screen-homepage.jsx`.
 */
export default function Home() {
  return (
    <main className="bg-bg-base text-text-primary min-h-screen">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-center gap-6">
          <Image
            src="/brand/logo-primary.png"
            alt="Yoko & Yoshi"
            width={120}
            height={120}
            priority
          />
          <div>
            <p className="text-text-muted text-xs font-semibold tracking-[0.18em] uppercase">
              Foundation deployed · phase 1
            </p>
            <h1 className="mt-2 text-5xl">
              Yoko <span className="amp">&</span> Yoshi
            </h1>
            <p className="text-text-secondary mt-3 max-w-xl text-lg">
              Sklep #1 dla shibowiarzy w Polsce — i wszystko poza miską dla
              psów, kotów, gryzoni, ptaków, ryb i gadów.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-bg-surface border-border-soft rounded-lg border p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <YokoFace size={56} />
              <h3 className="text-secondary">Yoko</h3>
            </div>
            <p className="text-text-secondary">
              Rudy shiba · niebieska obroża. Energiczny, ciekawski. Rekomenduje
              zabawki, smycze, wszystko co wymaga ruchu.
            </p>
          </div>
          <div className="bg-bg-surface border-border-soft rounded-lg border p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <YoshiFace size={56} />
              <h3 className="text-accent-coral">Yoshi</h3>
            </div>
            <p className="text-text-secondary">
              Kremowy shiba · koralowa obroża. Łagodny, marzycielski.
              Rekomenduje karmę, posłania, pielęgnację.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Badge tone="secondary">
            <PawPrint size={12} />
            Akcesoria · zabawki · pielęgnacja
          </Badge>
          <Badge tone="cyan">SSR + Tailwind v4 + shadcn</Badge>
          <Badge tone="success">Phase 1 OK</Badge>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg">
            Odkryj produkty
          </Button>
          <Button variant="secondary" size="lg">
            Poznaj nas
          </Button>
          <Button variant="affiliate" size="lg">
            Zobacz na Allegro
          </Button>
          <Button variant="ghost">Filtruj</Button>
          <Button variant="link">Dowiedz się więcej →</Button>
        </div>
      </section>
    </main>
  );
}
