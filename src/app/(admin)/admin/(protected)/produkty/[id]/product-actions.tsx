"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteProduct, togglePublishProduct } from "@/lib/actions/products";

export function ProductActions({
  id,
  published,
  slug,
}: {
  id: string;
  published: boolean;
  slug: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/produkt/${slug}`} target="_blank">
          Podgląd
        </Link>
      </Button>
      <Button
        variant={published ? "secondary" : "primary"}
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await togglePublishProduct({
              id,
              published: !published,
            });
            if (result?.serverError) toast.error(result.serverError);
            else toast.success(published ? "Ukryto" : "Opublikowano");
          })
        }
      >
        {published ? "Ukryj" : "Opublikuj"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirm("Na pewno usunąć produkt?")) return;
          startTransition(async () => {
            const result = await deleteProduct({ id });
            if (result?.serverError) toast.error(result.serverError);
            else {
              toast.success("Usunięto");
              window.location.href = "/admin/produkty";
            }
          });
        }}
      >
        Usuń
      </Button>
    </div>
  );
}
