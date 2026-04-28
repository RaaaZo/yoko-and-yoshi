import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLN_FORMATTER = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPricePLN(value: number | string | null | undefined) {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (!Number.isFinite(n)) return null;
  return PLN_FORMATTER.format(n);
}

/**
 * Capitalise the first letter and replace dashes with spaces.
 * Used as a fallback display label when category data isn't available
 * (e.g. building breadcrumbs from a slug-only URL segment).
 */
export function capitaliseSlug(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

/**
 * Polish dative plural ("celownik mn.") for a species slug — used in
 * copy like "Co polecamy psom / kotom". Falls back to the slug itself
 * if unknown so we don't render anything mid-grammatical.
 */
export function speciesDativus(slug: string): string {
  return SPECIES_DATIVUS[slug] ?? slug;
}

const SPECIES_DATIVUS: Record<string, string> = {
  psy: "psom",
  koty: "kotom",
  gryzonie: "gryzoniom",
  ptaki: "ptakom",
  ryby: "rybom",
  gady: "gadom",
};

const POLISH_DIACRITICS: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
  Ą: "a",
  Ć: "c",
  Ę: "e",
  Ł: "l",
  Ń: "n",
  Ó: "o",
  Ś: "s",
  Ź: "z",
  Ż: "z",
};

export function slugify(input: string): string {
  return input
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (c) => POLISH_DIACRITICS[c] ?? c)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Best-guess mascot for a product/category — used as a fallback when nothing
 * is explicitly set. Yoko leans into comfort/care; Yoshi into energy/play.
 */
const YOKO_KEYWORDS = [
  "poslan",
  "miska",
  "mata",
  "legowisk",
  "pielegnac",
  "trymer",
  "szczotka",
  "furminator",
];
const YOSHI_KEYWORDS = [
  "zabawk",
  "szarpak",
  "pilk",
  "pilka",
  "ringer",
  "smycz",
  "frisbee",
];

export function mascotFor(label: string): "yoko" | "yoshi" | null {
  const haystack = label
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (c) => POLISH_DIACRITICS[c] ?? c)
    .toLowerCase();
  if (YOKO_KEYWORDS.some((k) => haystack.includes(k))) return "yoko";
  if (YOSHI_KEYWORDS.some((k) => haystack.includes(k))) return "yoshi";
  return null;
}

/**
 * Hash a value to a stable, non-reversible token for telemetry.
 * Used for IP / UA hashing in audit_log and allegro_clicks.
 */
export async function hashForTelemetry(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}
