import { NewsletterBox } from "@/components/brand/newsletter-box";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Co tydzień: nowe poradniki, kuratorska selekcja produktów, kody zniżkowe partnerów.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <NewsletterBox />
        <p className="text-text-muted mt-6 text-center text-[0.85rem]">
          Po zapisie wyślemy email z linkiem aktywacyjnym (double opt-in, RODO).
        </p>
      </div>
    </section>
  );
}
