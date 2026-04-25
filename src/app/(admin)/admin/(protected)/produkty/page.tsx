import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatPricePLN } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SP = Promise<{ q?: string; status?: string; page?: string }>;

const PAGE_SIZE = 25;

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const status = sp.status ?? "all";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const supabase = await getSupabaseServerClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select(
      "id, slug, name, price_pln, price_old_pln, published, is_featured, is_recommended, sort_score, updated_at",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (q) query = query.ilike("name", `%${q}%`);
  if (status === "published") query = query.eq("published", true);
  if (status === "draft") query = query.eq("published", false);
  if (status === "no-price") query = query.is("price_pln", null);

  const { data: rows, count } = await query;
  type Row = {
    id: string;
    slug: string;
    name: string;
    price_pln: number | null;
    price_old_pln: number | null;
    published: boolean;
    is_featured: boolean;
    is_recommended: boolean;
    sort_score: number;
    updated_at: string;
  };
  const products = (rows ?? []) as Row[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="cyan">Produkty</Badge>
          <h1 className="mt-2">Lista produktów ({count ?? 0})</h1>
        </div>
        <Button asChild variant="primary">
          <Link href="/admin/produkty/nowy">+ Nowy produkt</Link>
        </Button>
      </div>

      <form className="bg-bg-surface border-border-soft mb-4 flex flex-wrap items-end gap-3 rounded-lg border-[1.5px] p-4">
        <div className="min-w-[240px] flex-1">
          <label className="text-text-muted mb-1 block text-[0.78rem] font-semibold uppercase">
            Szukaj
          </label>
          <Input name="q" defaultValue={q} placeholder="po nazwie produktu…" />
        </div>
        <div>
          <label className="text-text-muted mb-1 block text-[0.78rem] font-semibold uppercase">
            Status
          </label>
          <select
            name="status"
            defaultValue={status}
            className="border-border-soft bg-bg-surface text-text-primary h-11 rounded-md border px-3"
          >
            <option value="all">Wszystkie</option>
            <option value="published">Opublikowane</option>
            <option value="draft">Szkice</option>
            <option value="no-price">Bez ceny</option>
          </select>
        </div>
        <Button type="submit" variant="primary">
          Filtruj
        </Button>
      </form>

      <div className="bg-bg-surface border-border-soft overflow-hidden rounded-lg border-[1.5px]">
        <table className="w-full text-[0.92rem]">
          <thead className="bg-bg-elevated text-text-muted text-left text-[0.78rem] uppercase">
            <tr>
              <th className="px-4 py-3">Nazwa</th>
              <th className="px-4 py-3">Cena</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Zmiana</th>
              <th className="px-4 py-3">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-border-soft divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/produkty/${p.id}`}
                    className="text-text-primary font-semibold hover:underline"
                  >
                    {p.name}
                  </Link>
                  <div className="text-text-muted text-[0.78rem]">
                    /{p.slug}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {formatPricePLN(p.price_pln) ?? "—"}
                  {p.price_old_pln && (
                    <div className="text-text-muted text-[0.78rem] line-through">
                      {formatPricePLN(p.price_old_pln)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.published ? (
                    <Badge tone="success">Opublikowany</Badge>
                  ) : (
                    <Badge tone="cream">Szkic</Badge>
                  )}
                  {p.is_featured && (
                    <Badge tone="primary" className="ml-1">
                      Featured
                    </Badge>
                  )}
                </td>
                <td className="num px-4 py-3">{p.sort_score}</td>
                <td className="text-text-muted px-4 py-3 text-[0.85rem]">
                  {new Date(p.updated_at).toLocaleDateString("pl-PL")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/produkty/${p.id}`}
                    className="text-accent-cyan text-[0.85rem] hover:underline"
                  >
                    Edytuj →
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-text-secondary px-4 py-12 text-center"
                >
                  Brak produktów. Zacznij od{" "}
                  <Link
                    href="/admin/produkty/nowy"
                    className="text-accent-cyan underline"
                  >
                    dodania pierwszego
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const num = i + 1;
            return (
              <Link
                key={num}
                href={{
                  pathname: "/admin/produkty",
                  query: {
                    ...(q ? { q } : {}),
                    ...(status !== "all" ? { status } : {}),
                    page: num,
                  },
                }}
                className={`rounded-md px-3 py-1.5 text-[0.85rem] ${num === page ? "bg-bg-warm text-text-primary font-semibold" : "text-text-secondary"}`}
              >
                {num}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
