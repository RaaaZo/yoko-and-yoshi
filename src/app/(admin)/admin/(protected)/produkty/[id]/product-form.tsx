"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertProduct } from "@/lib/actions/products";

type Initial = {
  id?: string;
  slug?: string;
  name?: string;
  short_description?: string | null;
  full_description?: string | null;
  own_recommendation?: string | null;
  recommending_mascot?: "yoko" | "yoshi" | "both" | "none";
  price_pln?: number | null;
  price_old_pln?: number | null;
  allegro_url?: string | null;
  allegro_offer_id?: string | null;
  is_featured?: boolean;
  is_recommended?: boolean;
  sort_score?: number;
  published?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
};

export function ProductForm({ initial }: { initial?: Initial }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await upsertProduct({
            id: initial?.id,
            slug: String(formData.get("slug") ?? ""),
            name: String(formData.get("name") ?? ""),
            short_description:
              (formData.get("short_description") as string) || null,
            full_description:
              (formData.get("full_description") as string) || null,
            own_recommendation:
              (formData.get("own_recommendation") as string) || null,
            recommending_mascot:
              (formData.get("recommending_mascot") as
                | "yoko"
                | "yoshi"
                | "both"
                | "none") || "none",
            price_pln: formData.get("price_pln")
              ? Number(formData.get("price_pln"))
              : null,
            price_old_pln: formData.get("price_old_pln")
              ? Number(formData.get("price_old_pln"))
              : null,
            allegro_url: (formData.get("allegro_url") as string) || null,
            allegro_offer_id:
              (formData.get("allegro_offer_id") as string) || null,
            is_featured: formData.get("is_featured") === "on",
            is_recommended: formData.get("is_recommended") === "on",
            sort_score: Number(formData.get("sort_score") ?? 0),
            published: formData.get("published") === "on",
            seo_title: (formData.get("seo_title") as string) || null,
            seo_description:
              (formData.get("seo_description") as string) || null,
          });
          if (result?.serverError) {
            toast.error(result.serverError);
            return;
          }
          if (result?.validationErrors) {
            toast.error("Sprawdź formularz.");
            return;
          }
          toast.success("Zapisano.");
        });
      }}
      className="grid gap-6"
    >
      <Section title="Podstawowe">
        <Field
          label="Nazwa"
          name="name"
          defaultValue={initial?.name}
          required
        />
        <Field
          label="Slug (URL)"
          name="slug"
          defaultValue={initial?.slug}
          required
        />
        <Field
          label="Krótki opis"
          name="short_description"
          defaultValue={initial?.short_description ?? ""}
          textarea
        />
        <Field
          label="Pełny opis (markdown)"
          name="full_description"
          defaultValue={initial?.full_description ?? ""}
          textarea
          rows={10}
        />
      </Section>

      <Section title="Rekomendacja Y&Y">
        <div>
          <Label htmlFor="recommending_mascot">Maskotka rekomendująca</Label>
          <select
            id="recommending_mascot"
            name="recommending_mascot"
            defaultValue={initial?.recommending_mascot ?? "none"}
            className="border-border-soft bg-bg-surface text-text-primary h-11 w-full rounded-md border px-3"
          >
            <option value="none">— bez maskotki —</option>
            <option value="yoko">Yoko (wygoda, troska)</option>
            <option value="yoshi">Yoshi (energia, zabawki)</option>
            <option value="both">Oboje</option>
          </select>
        </div>
        <Field
          label="Tekst rekomendacji (krótki, w stylu maskotki)"
          name="own_recommendation"
          defaultValue={initial?.own_recommendation ?? ""}
          textarea
          rows={4}
        />
      </Section>

      <Section title="Cena & Allegro">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Cena PLN"
            name="price_pln"
            defaultValue={initial?.price_pln ?? ""}
            type="number"
            step="0.01"
          />
          <Field
            label="Cena stara PLN (opcjonalnie)"
            name="price_old_pln"
            defaultValue={initial?.price_old_pln ?? ""}
            type="number"
            step="0.01"
          />
        </div>
        <Field
          label="Allegro URL"
          name="allegro_url"
          defaultValue={initial?.allegro_url ?? ""}
          type="url"
        />
        <Field
          label="Allegro Offer ID"
          name="allegro_offer_id"
          defaultValue={initial?.allegro_offer_id ?? ""}
        />
      </Section>

      <Section title="Status">
        <div className="grid gap-3 md:grid-cols-3">
          <Checkbox
            name="published"
            label="Opublikowany"
            defaultChecked={Boolean(initial?.published)}
          />
          <Checkbox
            name="is_featured"
            label="Featured (homepage)"
            defaultChecked={Boolean(initial?.is_featured)}
          />
          <Checkbox
            name="is_recommended"
            label="Polecane przez Y&Y"
            defaultChecked={Boolean(initial?.is_recommended)}
          />
        </div>
        <Field
          label="Sort score (im wyższe, tym wyżej w sortowaniu)"
          name="sort_score"
          defaultValue={initial?.sort_score ?? 0}
          type="number"
        />
      </Section>

      <Section title="SEO">
        <Field
          label="SEO title"
          name="seo_title"
          defaultValue={initial?.seo_title ?? ""}
        />
        <Field
          label="SEO description"
          name="seo_description"
          defaultValue={initial?.seo_description ?? ""}
          textarea
          rows={3}
        />
      </Section>

      <Button type="submit" variant="primary" disabled={pending} size="lg">
        {pending
          ? "Zapisuję…"
          : initial?.id
            ? "Zapisz zmiany"
            : "Utwórz produkt"}
      </Button>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-6">
      <h2 className="mb-4 text-[1.4rem]">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  textarea,
  rows,
  type,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required && " *"}
      </Label>
      {textarea ? (
        <Textarea
          id={name}
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          rows={rows ?? 5}
        />
      ) : (
        <Input
          id={name}
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          type={type}
          step={step}
        />
      )}
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="bg-bg-elevated border-border-soft flex items-center gap-2.5 rounded-md border p-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-[color:var(--color-primary)]"
      />
      <span className="text-text-primary text-[0.92rem]">{label}</span>
    </label>
  );
}
