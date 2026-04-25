"use client";

import {
  BarChart3,
  Bookmark,
  FileText,
  ImageIcon,
  LayoutDashboard,
  ListTree,
  Mail,
  PawPrint as PawIcon,
  Settings,
  ShieldCheck,
  ShoppingBag,
  TagsIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV: Array<{
  group: string;
  items: Array<{ href: string; label: string; icon: React.ElementType }>;
}> = [
  {
    group: "Sklep",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/produkty", label: "Produkty", icon: ShoppingBag },
      { href: "/admin/kategorie", label: "Kategorie", icon: ListTree },
      { href: "/admin/typy", label: "Typy produktów", icon: TagsIcon },
      { href: "/admin/gatunki", label: "Gatunki", icon: PawIcon },
    ],
  },
  {
    group: "Treści",
    items: [
      { href: "/admin/artykuly", label: "Artykuły", icon: FileText },
      { href: "/admin/rasy", label: "Rasy", icon: Bookmark },
      { href: "/admin/strony", label: "Strony", icon: FileText },
      { href: "/admin/homepage", label: "Homepage", icon: LayoutDashboard },
      { href: "/admin/nawigacja", label: "Nawigacja", icon: ListTree },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
    ],
  },
  {
    group: "Operacje",
    items: [
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
      {
        href: "/admin/przekierowania",
        label: "Przekierowania",
        icon: ShieldCheck,
      },
      { href: "/admin/audyt", label: "Audyt", icon: BarChart3 },
      { href: "/admin/uzytkownicy", label: "Użytkownicy", icon: Users },
      { href: "/admin/ustawienia", label: "Ustawienia", icon: Settings },
    ],
  },
];

export function AdminSidebar({ userLabel }: { userLabel: string }) {
  const pathname = usePathname();

  return (
    <aside className="bg-bg-elevated border-border-soft hidden flex-col border-r md:flex">
      <Link
        href="/admin"
        className="border-border-soft flex items-center gap-2.5 border-b px-5 py-4 no-underline"
      >
        <Image
          src="/brand/logo-primary.png"
          alt="Yoko & Yoshi"
          width={40}
          height={40}
        />
        <div>
          <div className="font-display text-text-primary text-[0.95rem] leading-none font-bold">
            Yoko <span className="amp">&</span> Yoshi
          </div>
          <div className="text-text-muted text-[0.7rem] tracking-[0.18em] uppercase">
            admin
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {NAV.map((group) => (
          <div key={group.group} className="mb-5">
            <div className="text-text-muted px-3 pt-1 pb-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              {group.group}
            </div>
            <ul className="grid gap-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.92rem] no-underline transition-colors",
                        active
                          ? "bg-[color:var(--color-bg-warm)] font-semibold text-[color:var(--color-text-primary)]"
                          : "text-text-secondary hover:bg-bg-warm/50 hover:text-text-primary",
                      )}
                    >
                      <Icon size={16} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-border-soft border-t px-5 py-3">
        <div className="text-text-muted text-[0.7rem] tracking-wider uppercase">
          Zalogowano jako
        </div>
        <div className="text-text-primary truncate text-[0.85rem] font-semibold">
          {userLabel}
        </div>
      </div>
    </aside>
  );
}
