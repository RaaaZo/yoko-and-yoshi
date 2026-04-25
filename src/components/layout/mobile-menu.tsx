"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { YokoFace, YoshiFace } from "@/components/brand/icons";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SHOP_LINKS = [
  ["🦴 Szarpaki & gryzaki", "/szukaj?type=szarpaki-gryzaki"],
  ["🎾 Piłki", "/szukaj?type=pilki"],
  ["✂️ Trymery & szczotki", "/szukaj?type=trymery-szczotki"],
  ["🪢 Smycze & obroże", "/szukaj?type=smycze-obroze"],
  ["🛏️ Posłania", "/szukaj?type=poslania"],
  ["🥣 Miski & poidła", "/szukaj?type=miski-poidla"],
  ["🎒 Transportery", "/szukaj?type=transportery"],
  ["🧴 Pielęgnacja", "/szukaj?type=pielegnacja"],
];

const WORLD_LINKS = [
  ["🐕 Hub rasowy: Shiba Inu", "/poradnik/rasy/shiba-inu"],
  ["📖 Wszystkie poradniki", "/poradnik"],
  ["💛 Bestsellery dla shib", "/szukaj?for=shiba"],
];

const ABOUT_LINKS = [
  ["Kim jesteśmy", "/o-nas"],
  ["Yoko & Yoshi", "/o-nas#maskotki"],
  ["Kontakt", "/kontakt"],
];

export function MobileMenuTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Menu"
        className="bg-bg-elevated border-border-soft grid size-10 place-items-center rounded-full border-[1.5px]"
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          stroke="var(--color-text-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <line x1="1" y1="2" x2="17" y2="2" />
          <line x1="1" y1="7" x2="17" y2="7" />
          <line x1="1" y1="12" x2="11" y2="12" />
        </svg>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-bg-base flex flex-col p-0 sm:max-w-[360px]"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="bg-bg-surface border-border-soft flex items-center justify-between border-b px-4 py-3.5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center"
          >
            <Image
              src="/brand/logo-primary.png"
              alt="Yoko & Yoshi"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="border-border-soft border-b border-dashed p-4">
          <form action="/szukaj">
            <div className="relative">
              <input
                name="q"
                type="search"
                placeholder="Szukaj zabawek, smyczy…"
                className="border-border-soft bg-bg-surface focus-visible:border-accent-cyan focus-visible:ring-accent-cyan/30 w-full rounded-full border-[1.5px] py-3 pr-4 pl-10 text-[0.95rem] outline-none focus-visible:ring-[3px]"
              />
              <span
                aria-hidden
                className="text-text-muted absolute top-1/2 left-4 -translate-y-1/2"
              >
                ⌕
              </span>
            </div>
          </form>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <MenuSection title="Sklep">
            {SHOP_LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-display text-text-primary flex items-center gap-2.5 rounded-md px-3.5 py-3 text-[1rem] no-underline"
              >
                <span>{label}</span>
                <span className="text-text-muted ml-auto text-[1.1rem]">›</span>
              </Link>
            ))}
          </MenuSection>
          <MenuSection title="Świat shibowiarzy">
            {WORLD_LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-display text-text-primary flex items-center gap-2.5 rounded-md px-3.5 py-3 text-[1rem] no-underline"
              >
                {label}
              </Link>
            ))}
          </MenuSection>
          <MenuSection title="O nas" last>
            {ABOUT_LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-text-secondary flex px-3.5 py-3 text-[0.95rem] no-underline"
              >
                {label}
              </Link>
            ))}
          </MenuSection>
        </nav>

        <div className="border-border-soft bg-bg-elevated flex items-center gap-2.5 border-t p-4">
          <YokoFace size={40} />
          <YoshiFace size={40} />
          <div className="text-text-secondary text-[0.82rem] leading-snug">
            Polecamy — Ty kupujesz na Allegro u sprawdzonych sprzedawców.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MenuSection({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`py-3 ${last ? "" : "border-border-soft border-b border-dashed"}`}
    >
      <div className="text-text-muted px-3.5 pt-1 pb-2 text-[0.72rem] font-bold tracking-[0.12em] uppercase">
        {title}
      </div>
      <div className="grid">{children}</div>
    </div>
  );
}
