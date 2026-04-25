import { describe, expect, it } from "vitest";

import { cn, formatPricePLN, mascotFor, slugify } from "./utils";

describe("cn", () => {
  it("merges and dedupes Tailwind class names", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("formatPricePLN", () => {
  it("formats integers and decimals", () => {
    expect(formatPricePLN(189)).toMatch(/189,00\s*z/);
    expect(formatPricePLN(49.9)).toMatch(/49,90\s*z/);
  });

  it("handles strings", () => {
    expect(formatPricePLN("129.50")).toMatch(/129,50\s*z/);
  });

  it("returns null for null/invalid", () => {
    expect(formatPricePLN(null)).toBeNull();
    expect(formatPricePLN(undefined)).toBeNull();
    expect(formatPricePLN("nie liczba")).toBeNull();
  });
});

describe("slugify", () => {
  it("strips Polish diacritics", () => {
    expect(slugify("Karma sucha — żółć ąść")).toBe("karma-sucha-zolc-asc");
  });

  it("collapses whitespace and dashes", () => {
    expect(slugify("  multiple   spaces---and-dashes  ")).toBe(
      "multiple-spaces-and-dashes",
    );
  });
});

describe("mascotFor", () => {
  it("picks Yoko for play/movement keywords", () => {
    expect(mascotFor("Szarpak ze sznura")).toBe("yoko");
    expect(mascotFor("Piłka tenisowa")).toBe("yoko");
  });

  it("picks Yoshi for food/care keywords", () => {
    expect(mascotFor("Karma sucha 11.4kg")).toBe("yoshi");
    expect(mascotFor("Trymer akumulatorowy")).toBe("yoshi");
  });

  it("returns null for unknown labels", () => {
    expect(mascotFor("Coś losowego")).toBeNull();
  });
});
