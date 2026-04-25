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
 * is explicitly set. Yoko leans into energy/play; Yoshi into food/care.
 */
const YOKO_KEYWORDS = [
  "zabawk",
  "szarpak",
  "pilk",
  "pilka",
  "ringer",
  "smycz",
  "frisbee",
];
const YOSHI_KEYWORDS = [
  "karma",
  "poslan",
  "miska",
  "pielegnac",
  "trymer",
  "szczotka",
  "furminator",
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
