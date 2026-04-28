import Image from "next/image";
import Link from "next/link";

import { Search } from "@/components/brand/icons";
import { DesktopNav } from "./desktop-nav";
import { MobileMenuTrigger } from "./mobile-menu";

export function Header() {
  return (
    <header className="bg-bg-surface border-border-soft sticky top-0 z-30 flex items-center gap-4 border-b px-4 py-2.5 md:gap-6 md:px-6">
      <Link href="/" className="flex shrink-0 items-center gap-2 no-underline">
        <span className="yy-mascot-hover bg-bg-warm border-border-soft inline-flex aspect-square h-10 items-center justify-center overflow-hidden rounded-full border md:h-14">
          <Image
            src="/brand/logo-primary.png"
            alt="Yoko & Yoshi"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </span>
      </Link>

      {/* Desktop nav */}
      <DesktopNav />

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
            className="text-text-muted absolute top-1/2 left-4 -translate-y-1/2"
          >
            <Search size={18} />
          </span>
        </div>
      </form>

      {/* Mobile / tablet trigger */}
      <div className="ml-auto flex items-center gap-2 lg:hidden">
        <Link
          href="/szukaj"
          className="bg-bg-elevated border-border-soft grid size-10 place-items-center rounded-full border-[1.5px] md:hidden"
          aria-label="Szukaj"
        >
          <Search size={18} />
        </Link>
        <MobileMenuTrigger />
      </div>
    </header>
  );
}
