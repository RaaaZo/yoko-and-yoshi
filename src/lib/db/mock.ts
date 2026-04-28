/**
 * Local mock data — used when Supabase is not configured (no .env.local).
 *
 * Mirrors the shape and slugs in supabase/seed.sql so that navigation,
 * routing and page rendering work end-to-end before the database is
 * wired up. Once the real DB is connected, the query helpers in
 * ./queries/* skip the mock branch automatically.
 *
 * Scope: full taxonomy (species, item_types, top-level categories per
 * species, 1 breed, 2 articles). Products are intentionally empty —
 * pages already render a graceful empty state, and faking 100 products
 * with placeholder images would be more noise than signal.
 */

import type {
  Article,
  Breed,
  Category,
  ItemType,
  Product,
  Species,
} from "@/types/domain";

// ----- SPECIES -----

export const MOCK_SPECIES: Species[] = [
  {
    id: "mock-sp-psy",
    slug: "psy",
    name: "Psy",
    description:
      "Wszystko dla psich opiekunów — zabawki, smycze, posłania, pielęgnacja.",
    hero_image_url: null,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    sort_order: 1,
    published: true,
  },
  {
    id: "mock-sp-koty",
    slug: "koty",
    name: "Koty",
    description:
      "Drapaki, zabawki i akcesoria dla kotów wszystkich charakterów.",
    hero_image_url: null,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    sort_order: 2,
    published: true,
  },
  {
    id: "mock-sp-gryzonie",
    slug: "gryzonie",
    name: "Gryzonie",
    description: "Klatki, akcesoria i wybieg dla królików, świnek, chomików.",
    hero_image_url: null,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    sort_order: 3,
    published: true,
  },
  {
    id: "mock-sp-ptaki",
    slug: "ptaki",
    name: "Ptaki",
    description: "Klatki, żerdki, kąpiele i zabawki dla ptaków towarzyszących.",
    hero_image_url: null,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    sort_order: 4,
    published: true,
  },
  {
    id: "mock-sp-ryby",
    slug: "ryby",
    name: "Ryby",
    description: "Akwarystyka — od filtrów po dekoracje.",
    hero_image_url: null,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    sort_order: 5,
    published: true,
  },
  {
    id: "mock-sp-gady",
    slug: "gady",
    name: "Gady",
    description: "Terraria, oświetlenie i akcesoria dla egzotycznych pupili.",
    hero_image_url: null,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    sort_order: 6,
    published: true,
  },
];

// ----- ITEM TYPES (12 — match seed.sql) -----

export const MOCK_ITEM_TYPES: ItemType[] = [
  itemType("szarpaki-gryzaki", "Szarpaki & gryzaki", "🦴", "secondary-soft", 1),
  itemType("pilki", "Piłki", "🎾", "primary-soft", 2),
  itemType("trymery-szczotki", "Trymery & szczotki", "✂️", "accent-cyan-soft", 3),
  itemType("smycze-obroze", "Smycze & obroże", "🪢", "bg-warm", 4),
  itemType("poslania", "Posłania", "🛏️", "bg-warm", 5),
  itemType("transportery", "Transportery", "🎒", "bg-warm", 6),
  itemType("miski-poidla", "Miski & poidła", "🥣", "bg-warm", 7),
  itemType("pielegnacja", "Pielęgnacja", "🧴", "bg-warm", 8),
  itemType("szelki", "Szelki", "🦮", "bg-warm", 9),
  itemType("zabawki-interaktywne", "Zabawki interaktywne", "🧶", "bg-warm", 10),
  itemType("ubranka", "Ubranka", "🧥", "bg-warm", 11),
  itemType("akcesoria-podrozne", "Akcesoria podróżne", "🚗", "bg-warm", 12),
];

function itemType(
  slug: string,
  name: string,
  icon: string,
  color: string,
  sort: number,
): ItemType {
  return {
    id: `mock-it-${slug}`,
    slug,
    name,
    icon_emoji: icon,
    soft_color_token: color,
    count_cache: 0,
    sort_order: sort,
    published: true,
  };
}

// ----- CATEGORIES (top-level per species — enough to fill species hub) -----

export const MOCK_CATEGORIES: Category[] = [
  // Psy
  cat("mock-sp-psy", "zabawki", "Zabawki", "psy/zabawki", 1),
  cat("mock-sp-psy", "pielegnacja", "Pielęgnacja", "psy/pielegnacja", 2),
  cat(
    "mock-sp-psy",
    "maty-i-legowiska",
    "Maty i legowiska",
    "psy/maty-i-legowiska",
    3,
  ),
  cat("mock-sp-psy", "miski", "Miski", "psy/miski", 4),
  cat("mock-sp-psy", "akcesoria", "Akcesoria", "psy/akcesoria", 5),
  // Koty
  cat("mock-sp-koty", "zabawki", "Zabawki", "koty/zabawki", 1),
  cat("mock-sp-koty", "drapaki", "Drapaki", "koty/drapaki", 2),
  cat("mock-sp-koty", "pielegnacja", "Pielęgnacja", "koty/pielegnacja", 3),
  cat(
    "mock-sp-koty",
    "maty-i-legowiska",
    "Maty i legowiska",
    "koty/maty-i-legowiska",
    4,
  ),
  cat("mock-sp-koty", "miski", "Miski", "koty/miski", 5),
  cat("mock-sp-koty", "akcesoria", "Akcesoria", "koty/akcesoria", 6),
  // Gryzonie
  cat("mock-sp-gryzonie", "klatki", "Klatki", "gryzonie/klatki", 1),
  cat("mock-sp-gryzonie", "akcesoria", "Akcesoria", "gryzonie/akcesoria", 2),
  // Ptaki
  cat("mock-sp-ptaki", "klatki", "Klatki", "ptaki/klatki", 1),
  cat("mock-sp-ptaki", "akcesoria", "Akcesoria", "ptaki/akcesoria", 2),
  // Ryby
  cat("mock-sp-ryby", "akwaria", "Akwaria", "ryby/akwaria", 1),
  cat("mock-sp-ryby", "filtry", "Filtry i pompy", "ryby/filtry", 2),
  // Gady
  cat("mock-sp-gady", "terraria", "Terraria", "gady/terraria", 1),
  cat("mock-sp-gady", "oswietlenie", "Oświetlenie", "gady/oswietlenie", 2),
];

function cat(
  speciesId: string,
  slug: string,
  name: string,
  pathCache: string,
  sort: number,
): Category {
  return {
    id: `mock-cat-${pathCache.replace(/\//g, "-")}`,
    species_id: speciesId,
    parent_id: null,
    slug,
    name,
    description: null,
    hero_image_url: null,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    path_cache: pathCache,
    sort_order: sort,
    published: true,
  };
}

// ----- BREEDS -----

export const MOCK_BREEDS: Breed[] = [
  {
    id: "mock-breed-shiba",
    slug: "shiba-inu",
    name: "Shiba Inu",
    species_id: "mock-sp-psy",
    pillar_content:
      "Shiba inu to jest decyzja na 12–15 lat trzymania kursu. Niezależna, czujna, czysta. Lojalna, ale na własnych zasadach. Polskie internety pełne są mitów (\"nie da się trenować\", \"nie lubi ludzi\") — tu rozprawiamy się z nimi po kolei.",
    quick_facts: {
      Pochodzenie: "Japonia",
      Wielkość: "mała / średnia",
      Aktywność: "wysoka",
      Linienie: "intensywne, sezonowe",
    },
    hero_image_url: null,
    recommended_product_ids: [],
    published: true,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
  },
];

// ----- ARTICLES -----

export const MOCK_ARTICLES: Article[] = [
  {
    id: "mock-article-1",
    slug: "shiba-inu-pielegnacja-podszerstka",
    title: "Shiba inu i jej podszerstek — przewodnik po sezonowym linieniu",
    excerpt:
      "Dwa razy w roku shiba zrzuca podszerstek. Pokazujemy, czym się różni szczotkowanie codzienne od pełnego zabiegu — i kiedy nie panikować.",
    content: null,
    hero_image_url: null,
    category: "pielegnacja",
    reading_minutes: 6,
    published: true,
    published_at: "2026-04-01T10:00:00Z",
    seo_title: null,
    seo_description: null,
    og_image_url: null,
  },
  {
    id: "mock-article-2",
    slug: "jak-wybrac-pierwsza-szarpanke",
    title: "Jak wybrać pierwszą szarpankę dla psa",
    excerpt:
      "Materiał, kształt, długość — trzy rzeczy, które decydują, czy zabawka przeżyje pierwszy tydzień. Krótki przewodnik.",
    content: null,
    hero_image_url: null,
    category: "akcesoria",
    reading_minutes: 4,
    published: true,
    published_at: "2026-03-15T09:00:00Z",
    seo_title: null,
    seo_description: null,
    og_image_url: null,
  },
];

// ----- PRODUCTS -----
// Each product is paired with the item_type slugs and category paths it belongs
// to. Query helpers in ./queries/products.ts consume these maps to filter.
// No imageUrl — product card has a fallback diagonal pattern.

type MockProduct = Product & {
  _itemTypes: string[]; // item_type slugs (used to populate item_types relation)
};

export const MOCK_PRODUCTS: MockProduct[] = [
  product({
    slug: "szarpak-bawelniany-xl",
    name: "Szarpak bawełniany XL — pleciony, dla psów średnich i dużych",
    short:
      "Solidne pleciony szarpak z surowej bawełny. Czyści zęby, kanalizuje energię, nie linieje na dywan.",
    own:
      "Yoshi ujarzmia go w 2 minuty. Yoko gryzie raz, potem wraca na posłanie.",
    mascot: "yoshi",
    price: 39.9,
    oldPrice: 49.9,
    rating: 4.8,
    ratingCount: 412,
    isFeatured: true,
    isRecommended: true,
    sortScore: 95,
    itemTypes: ["szarpaki-gryzaki"],
    categories: ["psy/zabawki"],
  }),
  product({
    slug: "pilka-gumowa-piszczek-7cm",
    name: "Piłka gumowa z piszczkiem 7 cm",
    short:
      "Klasyk przy aporcie. Średnia twardość, nie pęka po pierwszym tygodniu.",
    own: "Yoshi aportuje 40 minut. Yoko podnosi raz, niesie do koszyka, po sprawie.",
    mascot: "yoshi",
    price: 19.9,
    oldPrice: null,
    rating: 4.6,
    ratingCount: 218,
    isFeatured: false,
    isRecommended: true,
    sortScore: 80,
    itemTypes: ["pilki"],
    categories: ["psy/zabawki"],
  }),
  product({
    slug: "trymer-akumulatorowy-podszerstek",
    name: "Trymer akumulatorowy z 4 nakładkami — podszerstek shib",
    short:
      "Bezprzewodowy, cichy. Cztery długości ostrza. Walizka, oliwka, szczotka czyszcząca w zestawie.",
    own:
      "Yoko siedzi przy nim grzecznie 8 minut z miną zadowolonej królowej. Yoshi ucieka po 30 sekundach.",
    mascot: "yoko",
    price: 219.0,
    oldPrice: 269.0,
    rating: 4.7,
    ratingCount: 89,
    isFeatured: false,
    isRecommended: true,
    sortScore: 88,
    itemTypes: ["trymery-szczotki"],
    categories: ["psy/pielegnacja"],
  }),
  product({
    slug: "smycz-parciana-3m-regulowana",
    name: "Smycz parciana 3 m, regulowana w 4 punktach",
    short:
      "Trening, spacer luzem, podwójne mocowanie. Karabińczyk z blokadą, reflektor.",
    own: "Yoko & Yoshi spinamy nią razem. Nie owija się.",
    mascot: "both",
    price: 79.9,
    oldPrice: null,
    rating: 4.9,
    ratingCount: 156,
    isFeatured: true,
    isRecommended: true,
    sortScore: 92,
    itemTypes: ["smycze-obroze"],
    categories: ["psy/akcesoria"],
  }),
  product({
    slug: "poslanie-shiba-ortopedyczne-xl",
    name: "Posłanie ortopedyczne XL — pamięć kształtu, zmywalne pokrycie",
    short:
      "Pianka memory + boczki. Pokrowiec z zamkiem, do prania w 60°C. Dla psów 25–40 kg.",
    own: "Yoko zaadoptowała je w 3 dni — własną kanapę pamięta tylko z dawnych czasów.",
    mascot: "yoko",
    price: 289.0,
    oldPrice: 349.0,
    rating: 4.7,
    ratingCount: 73,
    isFeatured: false,
    isRecommended: true,
    sortScore: 84,
    itemTypes: ["poslania"],
    categories: ["psy/maty-i-legowiska"],
  }),
  product({
    slug: "drapak-naturalny-katu-150",
    name: "Drapak z naturalnego sizalu, 150 cm — z kryjówką",
    short:
      "Trzy poziomy, kryjówka u podstawy, sizal nie pylący. Stabilna podstawa 50×50 cm.",
    own: "Polecane przez nas dla aktywnych kotów średnich.",
    mascot: "none",
    price: 349.0,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 42,
    isFeatured: true,
    isRecommended: false,
    sortScore: 70,
    itemTypes: [],
    categories: ["koty/drapaki"],
  }),
  product({
    slug: "miska-ceramiczna-kot-podwojna",
    name: "Miska ceramiczna podwójna — 2× 250 ml, antypoślizgowa",
    short:
      "Ceramika malowana w bawarskim rondzie. Stabilna, do zmywarki, neutralna wagowo.",
    own: "Yoko zatwierdziła osobiście. Mieści się w mniejszej kuchni.",
    mascot: "yoko",
    price: 59.9,
    oldPrice: 79.9,
    rating: 4.6,
    ratingCount: 187,
    isFeatured: false,
    isRecommended: true,
    sortScore: 76,
    itemTypes: ["miski-poidla"],
    categories: ["koty/miski"],
  }),
  product({
    slug: "frisbee-gumowe-floating-22cm",
    name: "Frisbee gumowe floating, 22 cm — pływające",
    short:
      "Miękka guma, nie kaleczy dziąseł. Pływa, więc rzucasz nad wodą i pies przynosi.",
    own:
      "Działa, ale po miesiącu z Yoshi ma już ślady kłów na obrzeżu — średnia trwałość.",
    mascot: "yoshi",
    price: 29.9,
    oldPrice: null,
    rating: 3.8,
    ratingCount: 64,
    isFeatured: false,
    isRecommended: true,
    sortScore: 55,
    itemTypes: ["pilki"],
    categories: ["psy/zabawki"],
  }),
  product({
    slug: "myszka-z-kocimietka-zestaw-3",
    name: "Myszki z kocimiętką — zestaw 3 sztuk",
    short:
      "Filcowe, każda inny kolor. W środku susz z kocimiętki. Lekkie, łatwe do podrzucania łapką.",
    own:
      "Klasyk. Yoshi zniszczył jedną w tydzień, dwie zostały. Cena za to OK.",
    mascot: "yoshi",
    price: 14.9,
    oldPrice: null,
    rating: 4.0,
    ratingCount: 231,
    isFeatured: false,
    isRecommended: true,
    sortScore: 50,
    itemTypes: [],
    categories: ["koty/zabawki"],
  }),
  product({
    slug: "klatka-krolik-xxl-pietrowa",
    name: "Klatka piętrowa dla królika XXL — 120×60×100 cm",
    short:
      "Drewniany pomost, dwie miski, poidło 600 ml. Tacka wysuwana, łatwa w czyszczeniu.",
    own: null,
    mascot: "yoko",
    price: 459.0,
    oldPrice: null,
    rating: 4.4,
    ratingCount: 28,
    isFeatured: false,
    isRecommended: false,
    sortScore: 60,
    itemTypes: [],
    categories: ["gryzonie/klatki"],
  }),
];

function product(p: {
  slug: string;
  name: string;
  short: string;
  own: string | null;
  mascot: Product["recommending_mascot"];
  price: number;
  oldPrice: number | null;
  rating: number;
  ratingCount: number;
  isFeatured: boolean;
  isRecommended: boolean;
  sortScore: number;
  itemTypes: string[];
  categories: string[];
}): MockProduct {
  return {
    id: `mock-prod-${p.slug}`,
    slug: p.slug,
    name: p.name,
    brand_id: null,
    short_description: p.short,
    full_description: null,
    own_recommendation: p.own,
    recommending_mascot: p.mascot,
    price_pln: p.price,
    price_old_pln: p.oldPrice,
    price_updated_at: "2026-04-20T10:00:00Z",
    allegro_url: `https://allegro.pl/oferta/${p.slug}`,
    allegro_offer_id: null,
    rating: p.rating,
    rating_count: p.ratingCount,
    is_featured: p.isFeatured,
    is_recommended: p.isRecommended,
    sort_score: p.sortScore,
    published: true,
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    images: [],
    faqs: [],
    item_types: p.itemTypes
      .map((slug) => MOCK_ITEM_TYPES.find((it) => it.slug === slug))
      .filter((it): it is ItemType => Boolean(it)),
    category_paths: p.categories,
    _itemTypes: p.itemTypes,
  };
}

/**
 * Recompute count_cache on each item_type from the mock product mapping.
 * Equivalent to the SQL trigger that maintains count_cache in production.
 * Called once at module load — mocks are static, so this runs only on
 * server boot.
 */
function recountItemTypes(): void {
  for (const it of MOCK_ITEM_TYPES) {
    it.count_cache = MOCK_PRODUCTS.filter((p) =>
      p._itemTypes.includes(it.slug),
    ).length;
  }
}
recountItemTypes();

// ----- HELPERS -----

export const MOCK_CATEGORY_PATHS = MOCK_CATEGORIES.filter(
  (c) => c.path_cache !== null,
).map((c) => ({ path: c.path_cache as string, updated_at: null }));

export function mockProductsForItemType(slug: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p._itemTypes.includes(slug));
}

export function mockProductsForCategoryPath(path: string): Product[] {
  return MOCK_PRODUCTS.filter((p) =>
    (p.category_paths ?? []).some(
      (c) => c === path || c.startsWith(`${path}/`),
    ),
  );
}

export function mockProductsForSpeciesId(speciesId: string): Product[] {
  const speciesSlug = MOCK_SPECIES.find((s) => s.id === speciesId)?.slug;
  if (!speciesSlug) return [];
  return MOCK_PRODUCTS.filter((p) =>
    (p.category_paths ?? []).some((c) => c.startsWith(`${speciesSlug}/`)),
  );
}

export function mockSearchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.short_description?.toLowerCase().includes(q) ?? false),
  );
}
