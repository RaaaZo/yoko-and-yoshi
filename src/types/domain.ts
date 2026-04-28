/**
 * Hand-written domain types — used in components and queries to give a
 * stable shape independent of the auto-generated Database types.
 */

export type RecommendingMascot = "yoko" | "yoshi" | "both" | "none";
export type UserRole = "admin" | "editor" | "viewer";
export type SpeciesKind =
  | "dog"
  | "cat"
  | "rodent"
  | "bird"
  | "fish"
  | "reptile";

export type Species = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  sort_order: number;
  published: boolean;
};

export type Category = {
  id: string;
  species_id: string | null;
  parent_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  path_cache: string | null;
  sort_order: number;
  published: boolean;
};

export type ItemType = {
  id: string;
  slug: string;
  name: string;
  icon_emoji: string | null;
  soft_color_token: string | null;
  count_cache: number;
  sort_order: number;
  published: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
  width: number | null;
  height: number | null;
  blur_data_url: string | null;
};

export type ProductFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand_id: string | null;
  short_description: string | null;
  full_description: string | null;
  own_recommendation: string | null;
  recommending_mascot: RecommendingMascot;
  price_pln: number | null;
  price_old_pln: number | null;
  price_updated_at: string | null;
  allegro_url: string | null;
  allegro_offer_id: string | null;
  rating: number | null;
  rating_count: number;
  is_featured: boolean;
  is_recommended: boolean;
  sort_score: number;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  images?: ProductImage[];
  faqs?: ProductFaq[];
  item_types?: ItemType[];
  /**
   * Category paths the product is mapped to (e.g. ["psy/zabawki"]).
   * Used to build breadcrumbs on the product page. First element is
   * treated as the canonical/primary category.
   */
  category_paths?: string[];
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  hero_image_url: string | null;
  // "zywienie" is intentionally retained even though we don't sell food —
  // existing DB rows may still carry it, and removing the value would
  // crash CATEGORY_LABELS lookups. The /poradnik filter UI hides it.
  category:
    | "zywienie"
    | "pielegnacja"
    | "zdrowie"
    | "rasy"
    | "akcesoria"
    | "inne";
  reading_minutes: number | null;
  published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
};

export type Breed = {
  id: string;
  slug: string;
  name: string;
  species_id: string | null;
  pillar_content: string | null;
  quick_facts: Record<string, string>;
  hero_image_url: string | null;
  recommended_product_ids: string[];
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
};

export type HomepageSectionKind =
  | "hero"
  | "species_grid"
  | "item_types_grid"
  | "featured_products"
  | "shiba_callout"
  | "articles"
  | "custom_html";

export type HomepageSection = {
  id: string;
  kind: HomepageSectionKind;
  config: Record<string, unknown>;
  sort_order: number;
  published: boolean;
};

export type NavigationItem = {
  id: string;
  parent_id: string | null;
  label: string;
  url: string | null;
  kind: "species" | "category" | "article" | "item_type" | "custom";
  entity_id: string | null;
  sort_order: number;
  published: boolean;
  target: "_self" | "_blank";
};

/**
 * Resolver result for catch-all routes.
 * The catch-all page switches on `kind` to render the right template.
 */
export type ResolvedUrl =
  | { kind: "product"; data: Product }
  | { kind: "category"; data: Category }
  | { kind: "breed"; data: Breed };
