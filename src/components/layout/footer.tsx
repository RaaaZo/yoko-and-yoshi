import Image from "next/image";
import Link from "next/link";

const COLUMNS: Array<{ heading: string; links: Array<[string, string]> }> = [
  {
    heading: "Sklep",
    links: [
      ["Psy", "/zwierzaki/psy"],
      ["Koty", "/zwierzaki/koty"],
      ["Inne zwierzaki", "/zwierzaki"],
      ["Promocje", "/promocje"],
    ],
  },
  {
    heading: "Poradniki",
    links: [
      ["Rasy psów", "/poradnik?cat=rasy"],
      ["Pielęgnacja", "/poradnik?cat=pielegnacja"],
      ["Akcesoria", "/poradnik?cat=akcesoria"],
      ["Wszystkie", "/poradnik"],
    ],
  },
  {
    heading: "O nas",
    links: [
      ["Kim jesteśmy", "/o-nas"],
      ["Kontakt", "/kontakt"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[color:var(--color-text-primary)] px-6 pt-12 pb-6 text-[#fbf3e7]">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <Link
              href="/"
              aria-label="Yoko & Yoshi — wróć na stronę główną"
              className="inline-flex aspect-square h-14 items-center justify-center overflow-hidden rounded-full border bg-[color:var(--color-bg-warm)]"
              style={{ borderColor: "rgba(251,243,231,0.18)" }}
            >
              <Image
                src="/brand/logo-primary.png"
                alt=""
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
          <p className="text-[0.88rem] leading-relaxed opacity-85">
            Polski przewodnik dla opiekunów psów i kotów. Polecamy najlepsze
            akcesoria — Ty kupujesz u sprawdzonych sprzedawców na Allegro.
          </p>
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
