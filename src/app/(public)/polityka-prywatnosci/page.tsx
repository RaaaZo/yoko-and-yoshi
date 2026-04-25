import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Jak zbieramy, przetwarzamy i chronimy Twoje dane osobowe.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function PrivacyPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-[2.6rem] leading-tight">
          Polityka prywatności
        </h1>
        <div className="prose-yy">
          <p>
            <strong>Ostatnia aktualizacja:</strong>{" "}
            {new Date().toLocaleDateString("pl-PL")}
          </p>
          <h2>1. Administrator danych</h2>
          <p>
            Administratorem danych jest Yoko & Yoshi. Kontakt:{" "}
            <a href="mailto:hej@yokoyoshi.pl">hej@yokoyoshi.pl</a>.
          </p>
          <h2>2. Jakie dane zbieramy</h2>
          <ul>
            <li>
              <strong>Newsletter:</strong> adres email (do wysyłki) i datę
              zapisu (na potrzeby RODO).
            </li>
            <li>
              <strong>Formularz kontaktowy:</strong> imię, email, treść
              wiadomości, zhashowany IP.
            </li>
            <li>
              <strong>Statystyki:</strong> anonimowe dane o ruchu (Plausible
              Analytics) — bez ciasteczek i bez identyfikatorów osobowych.
            </li>
          </ul>
          <h2>3. Twoje prawa</h2>
          <p>
            W każdej chwili możesz: poprosić o wgląd, sprostowanie lub usunięcie
            swoich danych; cofnąć zgodę na newsletter (link w stopce każdego
            maila); wnieść skargę do PUODO.
          </p>
          <h2>4. Linki partnerskie</h2>
          <p>
            Klikając linki do Allegro przekazujemy partnerowi minimum informacji
            niezbędnych do rozliczenia prowizji (zazwyczaj jest to identyfikator
            naszego konta partnerskiego). Pełne zasady — zobacz{" "}
            <a href="/informacja-affiliate">informację affiliate</a>.
          </p>
        </div>
      </div>
    </article>
  );
}
