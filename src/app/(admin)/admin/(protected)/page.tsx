import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();

  const [productCount, articleCount, newsletterCount, contactCount, clicks7d] =
    await Promise.all([
      countTable("products"),
      countTable("articles"),
      countTable("newsletter_subscribers", "confirmed.eq.true"),
      countTable("contact_messages", "status.eq.new"),
      countClicks7d(),
    ]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="cyan">Dashboard</Badge>
          <h1 className="mt-3">Cześć — co u nas?</h1>
          <p className="text-text-secondary mt-1">
            Szybki przegląd. Szczegóły w odpowiednich modułach.
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/admin/produkty/nowy">+ Nowy produkt</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard label="Produkty" value={productCount} href="/admin/produkty" />
        <KpiCard label="Artykuły" value={articleCount} href="/admin/artykuly" />
        <KpiCard
          label="Subskrybenci"
          value={newsletterCount}
          href="/admin/newsletter"
        />
        <KpiCard
          label="Kontakt (nowe)"
          value={contactCount}
          href="/admin/kontakt"
        />
        <KpiCard
          label="Kliki Allegro 7d"
          value={clicks7d}
          href="/admin/audyt"
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-3">Co dalej</h2>
        <ol className="prose-yy list-decimal pl-5">
          <li>
            Skonfiguruj klucze Allegro w{" "}
            <Link href="/admin/ustawienia">ustawieniach</Link>.
          </li>
          <li>Zaimportuj pierwsze produkty (URL Allegro → wizard).</li>
          <li>Zaktualizuj nawigację i sekcje homepage&apos;a.</li>
          <li>
            Włącz cron synchronizacji w settings (po pierwszym sukcesie sync).
          </li>
        </ol>
      </section>
    </div>
  );

  async function countTable(table: string, filter?: string): Promise<number> {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) {
      const [col, op, val] = filter.split(/\.(eq|neq|gt|gte|lt|lte)\.|\./);
      if (col && op && val !== undefined) {
        // basic op support; extend if more complex filters needed
        q = (q as unknown as { eq: (c: string, v: string) => typeof q }).eq(
          col,
          val,
        );
      }
    }
    const { count, error } = await q;
    if (error) {
      logger.error({ err: error, table }, "dashboard count failed");
      return 0;
    }
    return count ?? 0;
  }

  async function countClicks7d(): Promise<number> {
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const { count, error } = await supabase
      .from("allegro_clicks")
      .select("*", { count: "exact", head: true })
      .gte("occurred_at", since);
    if (error) {
      logger.error({ err: error }, "dashboard 7d clicks failed");
      return 0;
    }
    return count ?? 0;
  }
}

function KpiCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-bg-surface border-border-soft text-text-primary block rounded-lg border-[1.5px] p-5 no-underline transition hover:shadow-md"
    >
      <div className="text-text-muted text-[0.78rem] font-semibold tracking-wider uppercase">
        {label}
      </div>
      <div className="num text-text-primary mt-2 text-3xl">{value}</div>
    </Link>
  );
}
