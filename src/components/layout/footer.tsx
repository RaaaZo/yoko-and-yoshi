import Image from "next/image";
import Link from "next/link";

const COLUMNS: Array<{ heading: string; links: Array<[string, string]> }> = [
  {
    heading: "Sklep",
    links: [
      ["Wszystkie kategorie", "/szukaj"],
      ["Promocje", "/promocje"],
      ["Bestsellery", "/szukaj?bestsellers=1"],
    ],
  },
  {
    heading: "Poradniki",
    links: [
      ["Rasy psów", "/poradnik?cat=rasy"],
      ["Pielęgnacja", "/poradnik?cat=pielegnacja"],
      ["Żywienie", "/poradnik?cat=zywienie"],
      ["Wszystkie", "/poradnik"],
    ],
  },
  {
    heading: "O nas",
    links: [
      ["Kim jesteśmy", "/o-nas"],
      ["Kontakt", "/kontakt"],
      ["Newsletter", "/newsletter"],
      ["Informacja affiliate", "/informacja-affiliate"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[color:var(--color-text-primary)] px-6 pt-12 pb-6 text-[#fbf3e7]">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className="inline-flex aspect-square h-14 items-center justify-center overflow-hidden rounded-full border bg-[color:var(--color-bg-warm)]"
              style={{ borderColor: "rgba(251,243,231,0.18)" }}
            >
              <Image
                src="/brand/logo-primary.png"
                alt="Yoko & Yoshi"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </span>
          </div>
          <p className="text-[0.88rem] leading-relaxed opacity-85">
            Sklep #1 dla shibowiarzy w Polsce. Polecamy najlepsze produkty dla
            psów, kotów i innych zwierzaków — a Ty kupujesz je u sprawdzonych
            sprzedawców na Allegro.
          </p>
          <div
            className="mt-4 rounded-md p-3 text-[0.78rem] leading-relaxed"
            style={{ background: "rgba(251,243,231,.08)" }}
          >
            <strong className="text-[color:var(--color-secondary)]">
              Affiliate:
            </strong>{" "}
            niektóre linki to linki partnerskie — jeśli kupisz przez nie,
            dostaniemy małą prowizję. Cena dla Ciebie się nie zmienia.
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h4 className="font-display mb-3 text-[1rem] text-white">
              {col.heading}
            </h4>
            <ul className="grid list-none gap-2 p-0">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[0.88rem] text-[#fbf3e7] no-underline opacity-85 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className="mx-auto mt-8 flex max-w-6xl flex-col gap-1 border-t pt-5 text-[0.78rem] opacity-70 md:flex-row md:justify-between"
        style={{ borderColor: "rgba(251,243,231,.2)", borderStyle: "dashed" }}
      >
        <span>
          © {new Date().getFullYear()} Yoko & Yoshi. Wszystkie prawa
          zastrzeżone.
        </span>
        <div className="flex gap-3">
          <Link href="/polityka-prywatnosci" className="text-[#fbf3e7]">
            RODO
          </Link>
          <span>·</span>
          <Link href="/regulamin" className="text-[#fbf3e7]">
            Regulamin
          </Link>
          <span>·</span>
          <Link href="/polityka-cookies" className="text-[#fbf3e7]">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
