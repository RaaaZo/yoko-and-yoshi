"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "Psy", href: "/zwierzaki/psy" },
  { label: "Koty", href: "/zwierzaki/koty" },
  { label: "Promocje", href: "/promocje" },
  { label: "Poradniki", href: "/poradnik" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Główna nawigacja"
      className="hidden text-[0.95rem] lg:flex lg:gap-5"
    >
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            data-text={link.label}
            className={`yy-link-paw yy-nav-stable text-text-primary no-underline ${
              active ? "font-bold" : "font-medium"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
