import Link from "next/link";

import { PawPrint } from "@/components/brand/icons";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-text-secondary flex flex-wrap items-center gap-2 text-[0.85rem]"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span
            key={`${item.label}-${i}`}
            className="inline-flex items-center gap-2"
          >
            {i > 0 && (
              <PawPrint size={12} color="var(--color-border-default)" />
            )}
            {isLast || !item.href ? (
              <span className="text-text-primary font-semibold">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-text-secondary hover:text-text-primary"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
