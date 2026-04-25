import Image from "next/image";
import Link from "next/link";

import { Heart, Sparkle } from "@/components/brand/icons";
import { MobileMenuTrigger } from "./mobile-menu";

const NAV_LINKS: Array<{ label: string; href: string; bold?: boolean }> = [
  {
    label: "Szarpaki & gryzaki",
    href: "/szukaj?type=szarpaki-gryzaki",
    bold: true,
  },
  { label: "Piłki", href: "/szukaj?type=pilki" },
  { label: "Trymery", href: "/szukaj?type=trymery-szczotki" },
  { label: "Smycze", href: "/szukaj?type=smycze-obroze" },
  { label: "Posłania", href: "/szukaj?type=poslania" },
  { label: "Poradniki", href: "/poradnik", bold: true },
];

export function Header() {
  return (
    <header className="bg-bg-surface border-border-soft sticky top-0 z-30 flex items-center gap-4 border-b px-4 py-2.5 md:gap-6 md:px-6">
      <Link href="/" className="flex shrink-0 items-center gap-2 no-underline">
        <Image
          src="/brand/logo-primary.png"
          alt="Yoko & Yoshi"
          width={64}
          height={64}
          className="yy-mascot-hover h-10 w-auto md:h-14"
          priority
        />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden text-[0.95rem] font-medium lg:flex lg:gap-5">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`yy-link-paw text-text-primary no-underline ${
              link.bold ? "font-bold" : "font-medium"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Search (desktop + tablet) */}
      <form
        action="/szukaj"
        className="ml-auto hidden max-w-sm flex-1 md:block"
      >
        <div className="relative">
          <input
            name="q"
            type="search"
            placeholder="Szukaj zabawek, smyczy, trymerów…"
            className="border-border-soft bg-bg-elevated focus-visible:border-accent-cyan focus-visible:ring-accent-cyan/30 w-full rounded-full border-[1.5px] py-2.5 pr-4 pl-10 text-[0.9rem] outline-none focus-visible:ring-[3px]"
          />
          <span
            aria-hidden
            className="text-text-muted absolute top-1/2 left-3.5 -translate-y-1/2"
          >
            ⌕
          </span>
        </div>
      </form>

      <div className="hidden items-center gap-2 lg:flex">
        <Link
          href="/promocje"
          className="bg-bg-elevated border-border-soft grid size-10 place-items-center rounded-full border-[1.5px]"
          aria-label="Promocje"
        >
          <Sparkle size={18} color="var(--color-secondary)" />
        </Link>
        <Link
          href="/ulubione"
          className="bg-bg-elevated border-border-soft grid size-10 place-items-center rounded-full border-[1.5px]"
          aria-label="Ulubione"
        >
          <Heart size={18} color="var(--color-primary)" />
        </Link>
      </div>

      {/* Mobile / tablet trigger */}
      <div className="ml-auto flex items-center gap-2 lg:hidden">
        <Link
          href="/szukaj"
          className="bg-bg-elevated border-border-soft grid size-10 place-items-center rounded-full border-[1.5px] md:hidden"
          aria-label="Szukaj"
        >
          ⌕
        </Link>
        <MobileMenuTrigger />
      </div>
    </header>
  );
}
