import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description: "Jak używamy ciasteczek i w jaki sposób możesz nimi zarządzać.",
  alternates: { canonical: "/polityka-cookies" },
};

export default function CookiePolicyPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-[2.6rem] leading-tight">Polityka cookies</h1>
        <div className="prose-yy">
          <p>Używamy ciasteczek wyłącznie w niezbędnym minimum. Konkretnie:</p>
          <ul>
            <li>
              <strong>Niezbędne:</strong> sesja, preferencje (np. zgoda na
              cookies). Te ciasteczka są zawsze włączone.
            </li>
            <li>
              <strong>Statystyki (opt-in):</strong> Plausible Analytics —
              bezcookie&apos;owy, anonimowy. Pomaga nam zrozumieć, które
              poradniki czytacie.
            </li>
          </ul>
          <p>
            <strong>Nie używamy:</strong> ciasteczek reklamowych, trackerów
            stron trzecich (Facebook Pixel itp.), retargetingu.
          </p>
          <h2>Zarządzanie zgodą</h2>
          <p>
            Wybór akceptujesz przy pierwszej wizycie (banner u dołu ekranu). Aby
            go zmienić — wyczyść local storage przeglądarki (klucz{" "}
            <code>yy.cookie.consent.v1</code>).
          </p>
        </div>
      </div>
    </article>
  );
}
