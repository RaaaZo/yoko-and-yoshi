import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Zasady korzystania z serwisu Yoko & Yoshi.",
  alternates: { canonical: "/regulamin" },
};

export default function TermsPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-[2.6rem] leading-tight">Regulamin</h1>
        <div className="prose-yy">
          <p>
            <strong>Ostatnia aktualizacja:</strong>{" "}
            {new Date().toLocaleDateString("pl-PL")}
          </p>
          <h2>1. Charakter serwisu</h2>
          <p>
            Yoko & Yoshi to serwis informacyjno-rekomendacyjny.{" "}
            <strong>Nie sprzedajemy bezpośrednio</strong> — przekierowujemy do
            sprawdzonych sprzedawców na Allegro.
          </p>
          <h2>2. Reklamacje, zwroty</h2>
          <p>
            Jako serwis polecający, nie obsługujemy reklamacji ani zwrotów.
            Roszczenia kierujesz bezpośrednio do sprzedawcy, u którego kupiłeś
            produkt (na Allegro).
          </p>
          <h2>3. Odpowiedzialność za polecenia</h2>
          <p>
            Polecenia mają charakter informacyjny. Nie zastępują konsultacji z
            weterynarzem ani behawiorystą. Jeśli Twój zwierzak ma specjalne
            potrzeby — skonsultuj wybór ze specjalistą.
          </p>
          <h2>4. Treści</h2>
          <p>
            Wszystkie teksty, opisy i zdjęcia są naszą własnością intelektualną
            (poza zdjęciami produktów, które są własnością producentów /
            sprzedawców).
          </p>
        </div>
      </div>
    </article>
  );
}
