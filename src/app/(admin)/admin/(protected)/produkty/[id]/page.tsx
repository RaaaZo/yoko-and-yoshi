import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase/server";

import { ProductForm } from "./product-form";
import { ProductActions } from "./product-actions";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_description, full_description, own_recommendation, recommending_mascot, price_pln, price_old_pln, allegro_url, allegro_offer_id, is_featured, is_recommended, sort_score, published, seo_title, seo_description",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/produkty"
            className="text-text-secondary text-[0.85rem] hover:underline"
          >
            ← Wszystkie produkty
          </Link>
          <Badge tone="cyan" className="mt-2">
            Edycja
          </Badge>
          <h1 className="mt-2">{(data as { name?: string }).name}</h1>
        </div>
        <ProductActions
          id={(data as { id: string }).id}
          published={Boolean((data as { published?: boolean }).published)}
          slug={(data as { slug?: string }).slug ?? ""}
        />
      </div>

      <div className="mt-8">
        <ProductForm initial={data as never} />
      </div>
    </div>
  );
}
