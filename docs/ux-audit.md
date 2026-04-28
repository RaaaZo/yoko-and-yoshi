# Audyt UX + tekstów — yoko & yoshi

**Data:** 2026-04-27
**Wersja kodu:** branch `main`, HEAD `ef67ae0`
**Zakres:** wszystkie publiczne strony (`src/app/(public)/**`), shell aplikacji, formularze, stany brzegowe.
**Pominięto:** `/admin/**` (poza zakresem — narzędzia wewnętrzne).

---

## 1. Streszczenie wykonawcze

| Severity | Liczba | Co to znaczy |
|---|---|---|
| **CRITICAL** | 3 | Naprawić zanim sklep zobaczą realni użytkownicy |
| **IMPORTANT** | 9 | Naprawić w tej samej iteracji |
| **MINOR** | 14 | Backlog — naprawiamy gdy będzie czas |

### Trzy mocne strony, których nie wolno popsuć

1. **Głos marki jest spójny i ma osobowość.** "Yoko zakopała tę stronę", "wymachujemy ogonem", "rudy szef ekipy", mascots Yoko/Yoshi obecni w empty states i 404 — to rzadko spotykany w polskim e-commerce poziom tożsamości. Audyt **chroni** ten głos zamiast go gładzić.
2. **IA jest świadomie zaprojektowana wokół dwóch osi browse'a** (`/zwierzaki/{species}` vs `/typ/{itemType}`). Kicker "Po co dziś tu jesteś?" + "Filtruj od razu po typie rzeczy — nie po gatunku" prosto wyjaśnia decyzję.
3. **Affiliate model jest grany uczciwie.** Banner z ujawnieniem prowizji w stopce, "Polecamy — Ty kupujesz na Allegro" w mobile menu — buduje zaufanie zamiast je nadszarpywać.

### Trzy najszybsze wygrane (Now)

1. Usunąć martwy link `/ulubione` z headera (CRITICAL, 1 min).
2. Przepisać `error.tsx` — obecne "Coś poszło nie tak" zabija ton marki w najgorszym momencie (CRITICAL, 5 min).
3. Naprawić bug breadcrumbu "Zwierzaki → /zwierzaki/psy" — etykieta kłamie o targetcie (CRITICAL, 5 min).

### Rekomendowana kolejność wdrożenia

**Now** (dziś): #1, #2, #3 powyżej.
**Next** (ta iteracja): inline validation w formularzach, spójność mobile menu, opis + licznik na stronach `/typ`, slot CTA w empty state.
**Later** (backlog): kontrast Allegro CTA, audit touch targets na 320px, pełen przegląd `aria-live` w toastach.

---

## 2. Voice & tone

### 2.1 Aktualny głos marki — opis

| Wymiar | Charakterystyka | Przykłady z kodu |
|---|---|---|
| **Persona** | Para właścicieli shib (Yoko = ruda, Yoshi = kremowy) prowadząca sklep | "Cześć — to my, & nasze shiby" (o-nas) |
| **Liczba os.** | 1. l. mn. ("my"), do użytkownika "Ty" / wielką literą | "wymachujemy ogonem", "wysłaliśmy link" |
| **Rejestr** | Konwersacyjny, ciepły, lekki humor; brak korpo-żargonu | "Yoko zakopała tę stronę", "Klikasz, kupujesz, dostajesz pod drzwi" |
| **Interpunkcja** | Dopuszczalna pauza/em-dash, wielokropek; `Yoko **&** Yoshi` (ampersand stylizowany) | "Co tydzień: nowe poradniki…" |
| **Emoji** | Tylko w mobile menu (kategorie produktów) i jako akcent w "🔥 Promocje" | nie nadużywać poza tymi miejscami |

### 2.2 Wzorce do **zachowania** (nie ruszać)

- Hero H1: "Zabawki, pielęgnacja i wszystko poza **miską**." — świetny, pamiętliwy
- 404: "Yoko zakopała tę stronę." — perfekcyjny
- Newsletter desc: "Co tydzień: nowe poradniki, kuratorska selekcja produktów, kody zniżkowe… Zero spamu — wymachujemy ogonem."
- Mascot bios: "Yoko — rudy szef ekipy", "Yoshi — kremowy filozof"
- Affiliate disclaimer: "niektóre linki to linki partnerskie — jeśli kupisz przez nie, dostaniemy małą prowizję. Cena dla Ciebie się nie zmienia." — uczciwe, krótkie, wzmacnia zaufanie
- Mobile menu CTA box: "Polecamy — Ty kupujesz na Allegro u sprawdzonych sprzedawców." — w jednym zdaniu wyjaśnia model biznesowy

### 2.3 Anty-wzorce do **wyeliminowania**

| Lokalizacja | Aktualnie | Problem | Propozycja |
|---|---|---|---|
| `src/app/error.tsx:21` | "Coś poszło nie tak." | Generyczne, mogłoby być z każdego sklepu | "Coś nie pykło." |
| `src/app/error.tsx:23-26` | "Spróbuj odświeżyć stronę. Jeśli problem się powtarza, daj znać: kontakt." | Sucho, tonacja zerowa | "Najczęściej pomaga odświeżenie. Jeśli nie — [napisz do nas](/kontakt), zerkniemy." |
| `contact-form.tsx:42` | "Sprawdź pola formularza." | Jakie pola? Co konkretnie? | Inline errors per pole + toast: "Spójrz na podświetlone pola." |
| `newsletter-form.tsx:31` | "Sprawdź adres email." | OK, ale lepiej inline | Inline pod inputem: "Email wygląda na niekompletny." |
| `newsletter-form.tsx:44` | placeholder `twój@email.pl` | Polskie pronouns w placeholderze są niezręczne, `.pl` sugeruje fałszywy konkretny TLD | `imie@example.com` |
| `empty-state.tsx:5` | "Spróbuj innych filtrów lub zajrzyj do innej kategorii." | Słowo "kategoria" niespójne z resztą IA (typ vs gatunek) | "Spróbuj innych filtrów albo zajrzyj gdzie indziej." |
| `promocje/page.tsx:33` | "Zaglądaj częściej — albo zapisz się na newsletter." | OK, ale brak akcji bez wyjścia ze strony | + przycisk "Zapisz się na newsletter" inline |

### 2.4 Spójności do egzekwowania

- **Ampersand:** w nazwie marki **zawsze** stylizowany (`Yoko **&** Yoshi`, w JSX `<span className="ampersand">&</span>` jeśli istnieje). W zwykłym tekście (np. "smycze i obroże") — zwykłe "i".
- **Liczba mnoga w 1 os.:** "wymachujemy", "wysłaliśmy", "naprawimy", "polecamy" — nigdy bezosobowo "wysłano".
- **Czasowniki w CTA:** zawsze imperatyw lub 2 os. ("Wybierz", "Zobacz", "Zapisz się"), nigdy rzeczowniki ("Wybór", "Zapis").
- **"Kategoria" vs "Typ produktu" vs "Gatunek":** kanoniczne znaczenia w sekcji 3.

---

## 3. Information Architecture

### 3.1 Mapa routingu (publiczna)

```
/                              home
/szukaj                        wyszukiwarka
/promocje                      promocje
/zwierzaki/[species]           hub gatunkowy (psy, koty, gryzonie, ptaki, ryby, gady)
/zwierzaki/[species]/[...slug] kategoria w drzewie gatunku
/typ/[itemType]                typ produktu (szarpaki, piłki, trymery…)
/produkt/[slug]                karta produktu
/poradnik                      hub poradników
/poradnik/[slug]               artykuł
/poradnik/rasy/[breed]         hub rasowy (np. shiba-inu)
/o-nas, /kontakt, /newsletter  static
/regulamin, /polityka-*, /informacja-affiliate  legal
```

### 3.2 Kanoniczna terminologia (do egzekwowania)

| Pojęcie | Kanoniczny term | Złe synonimy spotkane w kodzie | Gdzie poprawić |
|---|---|---|---|
| `species` (psy/koty/...) | **"Gatunek"** lub **"zwierzaki"** | OK, spójne | — |
| `item_type` (piłki/szarpaki...) | **"Typ produktu"** (singular) lub **"Kategoria produktów"** (jako kicker, plural) | "Kategoria" (jako synonim w empty state, meta description) | `/typ/[itemType]/page.tsx:30`, `empty-state.tsx:5` |
| `category` w drzewie gatunku | **"Kategoria"** lub **"Podkategoria"** (l.mn. "kategorie") | OK, spójne | — |
| Główna nawigacja | **"Sklep"** / **"Poradniki"** / **"O nas"** | OK | — |

**Wniosek:** termin "kategoria" ma w sklepie dwie poprawne role:
- (a) węzeł w drzewie gatunku (`/zwierzaki/psy/karma/sucha`) — to OK,
- (b) metonimia "wszystkiego co przegląda się" — **to do usunięcia** z empty states i meta description, bo myli się z (a).

W empty state na `/typ/[itemType]` lepiej: "Sprawdź inne typy produktów" (już jest poprawne, linia 97).
W `empty-state.tsx` default subtitle — zmienić "innej kategorii" → "gdzie indziej".

### 3.3 Bug breadcrumbu "Zwierzaki" 🐛 CRITICAL

[src/app/(public)/zwierzaki/[species]/page.tsx:72](src/app/(public)/zwierzaki/[species]/page.tsx)
[src/app/(public)/zwierzaki/[species]/[...slug]/page.tsx:85](src/app/(public)/zwierzaki/[species]/[...slug]/page.tsx)

```tsx
{ label: "Zwierzaki", href: "/zwierzaki/psy" }
```

**Problem:** użytkownik klika na breadcrumb "Zwierzaki" oczekując widoku wszystkich gatunków, a ląduje na stronie psów. To **łamie zaufanie do nawigacji** — etykieta kłamie o targetcie.

**Opcje fixu (do podjęcia z userem):**
- **A** (rekom.) — usunąć ten poziom breadcrumbu w ogóle: `Start › {Gatunek} › ...`. Skoro nie ma indeksu gatunków, nie udawajmy że jest.
- **B** — utworzyć stronę `/zwierzaki` z listą wszystkich gatunków jako kafelków. Większa praca, ale realna wartość nawigacyjna.
- **C** — przemianować etykietę na "Gatunki" + zostawić link do `/zwierzaki/psy` z notą "Domyślnie: psy" — najgorsze z dwóch światów, NIE polecane.

### 3.4 Nawigacja — terminologia

Header desktop (`header.tsx`):
- "Szarpaki & gryzaki", "Piłki", "Trymery", "Smycze", "Posłania" → wszystkie linkują do `/typ/*` ✅
- "Poradniki" → `/poradnik` ✅

Mobile menu (`mobile-menu.tsx`) używa tych samych etykiet z dodatkiem emoji w sekcji "Sklep" — patrz sekcja 7.1.

Brak w UI sklepowej terminu "kategoria". ✅ OK po fixie empty-state'u.

### 3.5 Footer

Struktura 4-kolumnowa (Logo+disclaimer | Sklep | Poradniki | O nas) — czytelna, zwięzła.

**Brakujące w stopce (warte rozważenia):**
- Link do FAQ — w modelu affiliate można argumentować, że wszystkie pytania o produkt idą do sprzedawcy na Allegro, ale FAQ o **sklepie** (jak działa polecanie, jak kupować, dlaczego Allegro, czy jest gwarancja zwrotu) — wartościowy.
- Link do bloga/poradników w "Sklep" lub jako 4. kolumna — już jest.
- Social media (jeśli istnieją) — nie ma. Jeśli marka ma IG/TikTok shibowy, brak ikon to strata.

**Footer tagline** "Sklep #1 dla shibowiarzy w Polsce" — odważne. Działa pod warunkiem że to się egzekwuje przez treść (poradniki shiba-inu, sekcja "Hub rasowy: Shiba Inu", obecność mascots). Tu wszystko gra. ✅

---

## 4. Audyt copy — per-element

Format: **Lokalizacja** | **Aktualnie** | **Werdykt** | **Propozycja**

### 4.1 Hero (home)

| Element | Aktualnie | Werdykt | Propozycja |
|---|---|---|---|
| Badge | "Akcesoria · zabawki · pielęgnacja" | ✅ Zostaw | — |
| H1 | "Zabawki, pielęgnacja i wszystko poza **miską**." | ✅ Zostaw | — |
| Description | "Kuratorska selekcja: szarpaki, piłki, trymery, smycze, posłania, transportery. Dla psów, kotów i innych zwierzaków — ze szczególną miłością do shib. Klikasz, kupujesz na Allegro, dostajesz pod drzwi." | ✅ Zostaw | — |
| CTA primary | "Odkryj produkty" → `/szukaj` | ⚠️ Słabsze | "Przeglądaj sklep" lub "Zobacz polecane" — "odkryj" to przereklamowane |
| CTA secondary | "Poznaj nas" → `/o-nas` | ✅ Zostaw | — |
| Stats | "produktów / poradników / ocena czytelników" | ✅ Zostaw | — |

### 4.2 Sekcja "Po co dziś tu jesteś?"

| Element | Aktualnie | Werdykt |
|---|---|---|
| Kicker | "Kategorie produktów" | ✅ Zostaw |
| Tytuł | "Po co dziś tu jesteś?" | ✅ Zostaw — świetne |
| Subtitle | "Filtruj od razu po typie rzeczy — nie po gatunku." | ✅ Zostaw |

### 4.3 Sekcja polecanych

| Element | Aktualnie | Werdykt |
|---|---|---|
| Kicker | "Polecane przez Yoko & Yoshi" | ✅ Zostaw |
| Tytuł | "Tydzień u nas: same dobre wybory" | ✅ Zostaw |
| Link | "Zobacz wszystkie polecane →" → `/promocje` | ⚠️ Mylące — "polecane" ≠ "promocje" |

**Rekomendacja:** zmienić target na `/szukaj` lub utworzyć `/polecane` (osobny widok). Linkowanie do `/promocje` jest semantycznie błędne (polecenie ≠ przecena).

### 4.4 Sekcja "Shiba"

| Element | Aktualnie | Werdykt |
|---|---|---|
| Tytuł | "Masz **shibę**? Mamy dla niej wszystko." | ✅ Zostaw |
| Description | "Trymery i szczotki radzące sobie z podszerstkiem…" | ✅ Zostaw |
| CTA1 | "Hub rasowy: shiba inu" | ✅ Zostaw |
| CTA2 | "Akcesoria dla shib" | ✅ Zostaw |

### 4.5 Newsletter

Patrz 2.2 (zachować) i 2.3 (placeholder do zmiany).

### 4.6 Empty states (4 warianty znalezione)

| Plik | Tytuł | Subtitle | Werdykt |
|---|---|---|---|
| `empty-state.tsx` (default) | "Nic nie znaleźliśmy" | "Spróbuj innych filtrów lub zajrzyj do innej kategorii." | ⚠️ Subtitle: "kategorii" mylące |
| `szukaj/page.tsx:123` | "Wybierz kategorię" / "Nic nie znaleźliśmy" | "Filtruj produkty po typie powyżej…" / "Spróbuj innych słów albo przeglądaj kategorie powyżej." | ⚠️ "kategorie" znów mylące — w praktyce to typy produktów |
| `promocje/page.tsx:32` | "Brak aktywnych promocji" | "Zaglądaj częściej — albo zapisz się na newsletter." | ⚠️ Brak inline akcji |
| `typ/[itemType]/page.tsx:96` | "Brak produktów: {nazwa}" | "Sprawdź inne typy produktów albo zajrzyj później." | ✅ OK |
| `zwierzaki/[species]/[...slug]/page.tsx:173` | "Brak produktów w tej kategorii" | "Wróć później albo zajrzyj do innej kategorii." | ✅ OK (tu kategoria = węzeł drzewa, prawidłowo) |

**Rekomendacja struktury empty state:** Co tu jest + (opcjonalnie) Dlaczego pusto + Co zrobić jako **konkretna akcja klikalna**. Aktualnie nigdzie nie ma akcji — tylko tekstowa zachęta. To zmiana komponentu (sekcja 7).

### 4.7 Error i 404

| Plik | Status | Akcja |
|---|---|---|
| `error.tsx` | ⚠️ Generyczne | **Przepisz** — propozycja w 2.3 |
| `not-found.tsx` | ✅ Doskonałe | Zostaw — "Yoko zakopała tę stronę" jest na poziomie copy bookmarkowanego |

### 4.8 Formularz kontaktowy

| Element | Aktualnie | Werdykt |
|---|---|---|
| H1 strony | "Powiedz nam coś." | ✅ Zostaw — krótkie, ciepłe |
| Sukces — H2 | "Dzięki!" | ✅ Zostaw |
| Sukces — body | "Wiadomość poszła. Odpowiemy najszybciej, jak możemy." | ✅ Zostaw |
| Label "Imię" | OK | wymaga `*` lub `(wymagane)` — sekcja 6 |
| Label "Email" | OK | j.w. |
| Label "Wiadomość" | OK | j.w. |
| Submit | "Wyślij" / "Wysyłam…" | ✅ Zostaw |
| Validation toast | "Sprawdź pola formularza." | ⚠️ Zastąp inline + "Spójrz na podświetlone pola." |

### 4.9 Promocje

| Element | Aktualnie | Werdykt |
|---|---|---|
| Badge | "🔥 Promocje" | ✅ Zostaw |
| H1 | "Aktualne przeceny" | ✅ Zostaw |
| Description | "Wybrane produkty taniej niż zwykle. Ceny aktualizujemy z Allegro codziennie…" | ✅ Zostaw |
| Empty title | "Brak aktywnych promocji" | ✅ Zostaw |
| Empty body | "Zaglądaj częściej — albo zapisz się na newsletter." | ⚠️ Dodaj akcję w empty state |

### 4.10 Cookie banner

✅ Wszystko OK — krótko, jasno, dwa wybory ("Tylko niezbędne" / "Akceptuję") z linkami do polityk.

### 4.11 Karta produktu (`product-card.tsx`)

| Element | Aktualnie | Werdykt |
|---|---|---|
| Allegro CTA | "Allegro ↗" | ⚠️ Krótkie ale niejasne. Jeśli to jedyny sposób kupna — wzmocnić: "Kup na Allegro" |

(Druga propozycja w `allegro-cta.tsx` — "Zobacz na Allegro" — jest lepsza. Ujednolicić.)

---

## 5. Stany brzegowe

### 5.1 404
✅ `not-found.tsx` — wzorcowe. Yoko z lupą, ciepłe copy, jeden mocny CTA "Wróć na stronę główną".

### 5.2 Error boundary
⚠️ `error.tsx` — sucho. Przepisać (sekcja 2.3). Jest digest dla ref w supporcie ✅.

### 5.3 Loading
**Sprawdzić:** czy strony `/szukaj`, `/zwierzaki/[species]`, `/zwierzaki/[species]/[...slug]`, `/typ/[itemType]`, `/promocje`, `/poradnik` mają dedicated `loading.tsx` lub Suspense fallback. Home ma `ItemTilesSkeleton`. Pozostałe — wymaga audytu (poza tym dokumentem; zalecam follow-up zadanie).

### 5.4 Empty states
4 różne miejsca, struktura w 80% spójna, brak konsekwentnej akcji klikalnej. Patrz 4.6 i 7.

### 5.5 Walidacja formularzy

**Problem (oba formularze):** błąd walidacji = wyłącznie sonner toast.
- ❌ Toast może zniknąć zanim user przeczyta
- ❌ Brak `aria-invalid` na polach
- ❌ Brak `aria-describedby` wskazującego na komunikat błędu
- ❌ `required` HTML5 nie jest wzbogacony wizualnie ani screenreader-friendly etykietą

**Rekomendowany pattern:**
1. Każde pole ma `<p id="X-error" className="text-error">…</p>` pod sobą (renderowane warunkowo).
2. Input dostaje `aria-invalid={hasError}` i `aria-describedby={hasError ? "X-error" : undefined}`.
3. Label dla required fields zawiera widoczne `<span className="text-primary">*</span>` z `aria-hidden`, plus opisowy `<span className="sr-only"> wymagane</span>`.
4. Toast pozostaje jako secondary feedback, ale field-level error jest primary.
5. Po submit z błędami — focus przechodzi na pierwsze błędne pole.

---

## 6. Dostępność (WCAG 2.1 AA)

### 6.1 ✅ OK
- `lang="pl"` w `<html>` (RootLayout)
- `Breadcrumbs` mają `aria-label="Breadcrumb"` (zweryfikowane w komponencie)
- Alt text na obrazach produktów ma fallback (`imageAlt ?? name`)
- Dekoracyjne SVG mają `aria-hidden`
- Mascot icons w empty state — dekoracyjne, też `aria-hidden`
- `<SheetTitle className="sr-only">Menu</SheetTitle>` w mobile menu

### 6.2 ❌ Do poprawy

| # | Problem | Plik | Severity |
|---|---|---|---|
| A1 | Brak inline error + `aria-invalid` w formularzach | `contact-form.tsx`, `newsletter-form.tsx` | IMPORTANT |
| A2 | Brak wizualnego markera `*` dla required | j.w. | IMPORTANT |
| A3 | Sonner toasts bez `role="alert"` / `aria-live` (default config?) | global toaster | MINOR — wymaga sprawdzenia konfiguracji `<Toaster>` |
| A4 | Search icon `⌕` (Unicode) — dla screenreaderów to "biały kwadrat z lupą" lub puste; ale rodzic ma `aria-label="Szukaj"` ✅ | `header.tsx:92` | MINOR — działa, ale lepiej SVG |
| A5 | Kontrast tekstu "Allegro ↗" (białe na pomarańczowym `0.78rem`) — wymaga zmierzenia (target ≥ 4.5:1 dla normal text, ≥ 3:1 dla large) | `product-card.tsx` | MINOR — wymaga ręcznego sprawdzenia kontrastu kolorów Tailwinda |
| A6 | Focus ring konsystencja — większość komponentów używa `focus-visible:ring-accent-cyan/30` ✅, ale przyciski custom mogą pomijać | global | MINOR |
| A7 | Mobile menu w "O nas" sekcji ma mniejszy `text-[0.95rem]` niż "Sklep" (`1rem`) — wizualna hierarchia jest OK, ale touch target może być < 44px | `mobile-menu.tsx:136` | MINOR |

### 6.3 Testy do przeprowadzenia ręcznie po fixach

- [ ] Tab przez header → focus widoczny na każdym elemencie
- [ ] Tab przez formularz kontaktowy → po wciśnięciu submit z pustymi polami: focus wraca do pierwszego błędnego pola, screenreader czyta error
- [ ] Lighthouse Mobile na `/`, `/zwierzaki/psy`, `/typ/pilki`, `/produkt/{any}`, `/kontakt`, `/szukaj` — Accessibility ≥ 95 na każdej
- [ ] iPhone SE (320px) symulator — sprawdzić mobile menu max-width, czy nie ma horizontal scroll
- [ ] DevTools → Rendering → emulate "prefers-reduced-motion" — sprawdzić że animacje typu `yy-mascot-hover` respektują

---

## 7. Mobile UX

### 7.1 Mobile menu — niespójność emoji + chevron 🐛 IMPORTANT

[src/components/layout/mobile-menu.tsx:104-141](src/components/layout/mobile-menu.tsx)

| Sekcja | Emoji w label | Chevron `›` | Font size | Werdykt |
|---|---|---|---|---|
| "Sklep" | ✅ | ✅ | `1rem` | spójne ze sobą |
| "Świat shibowiarzy" | ✅ (🐕📖💛) | ❌ | `1rem` | brak chevrona — inkonsystencja |
| "O nas" | ❌ | ❌ | `0.95rem` | inny styl, mniejszy touch target |

**Rekomendowana decyzja:**
- Emoji **tylko** w "Sklep" (jako wizualne tagowanie typów produktów — działa jak ikona kategorii).
- "Świat shibowiarzy" — usunąć emoji, dodać chevron, font-size `1rem`.
- "O nas" — dodać chevron, ujednolicić font-size do `1rem` lub świadomie zostawić mniejszy z notą "secondary nav".

### 7.2 SheetContent max-width
[src/components/layout/mobile-menu.tsx:64](src/components/layout/mobile-menu.tsx) — `sm:max-w-[360px]`. Na 320px iPhone SE może przyciąć — sprawdzić ręcznie.

### 7.3 Touch targets
W mobile menu większość linków ma `py-3` = 12px góra/dół + ~24px line-height = ~48px. ✅ ≥ 44px.
"O nas" sekcja ma `py-3` text-[0.95rem] — line-height ~22px → 22 + 24 = 46px. ✅ Mimo wszystko.

Header mobile icons (size-10 = 40px) — ❌ poniżej 44px Apple HIG. Ale to typowy kompromis dla sticky headera; akceptowalne.

### 7.4 Sticky header
[header.tsx:18](src/components/layout/header.tsx) — `sticky top-0 z-30`. Sprawdzić czy nie zasłania anchorów (`#zwierzaki` na o-nas) — wymaga `scroll-margin-top` na targetach.

---

## 8. Brakujące funkcje (gap analysis)

| Funkcja | Status | Komentarz |
|---|---|---|
| Koszyk / checkout | Świadomy brak | Model affiliate — kupno na Allegro |
| Konto / profil | Świadomy brak | Można dodać kiedy będzie newsletter management |
| **Ulubione** | 🐛 **DO USUNIĘCIA z UI lub do zaimplementowania** | Martwy link w `header.tsx:77`. Decyzja: ukryć ikonę ✅ rekom. |
| Wyszukiwarka | ✅ Jest (`/szukaj`) | — |
| Filtrowanie po cenie / marce | Brak | Backlog — gdy będzie więcej produktów |
| Sortowanie produktów | Brak na `/typ` i `/zwierzaki` | Backlog |
| FAQ / dostawa / zwroty | Częściowo | Cała kwestia idzie do sprzedawcy na Allegro — **należy** to napisać explicite na karcie produktu |
| Reviews | ✅ Pulled z Allegro | OK |
| Wyświetlana data ostatniej aktualizacji ceny | Brak | Wzmocniłoby zaufanie ("Cena z Allegro: 2 godz. temu") |
| Compare 2-3 produktów | Brak | Backlog |

### 8.1 Deklaracja "Wysyłka i zwroty" na karcie produktu

**Rekomendacja:** dodać sekcję pod ceną/CTA na `/produkt/[slug]`:

> **Wysyłka i zwroty**
> Realizuje sprzedawca na Allegro — koszty i terminy zobaczysz w jego ofercie. Standard: 30 dni na zwrot, gwarancja Allegro Smart.

Buduje zaufanie + transparentność modelu affiliate.

---

## 9. Priorytetyzowana mapa drogowa

### 9.1 NOW — naprawić tej iteracji (CRITICAL + IMPORTANT)

| # | Co | Plik | Severity | Effort |
|---|---|---|---|---|
| 1 | Usunąć martwy link `/ulubione` z headera | `header.tsx:76-82` | CRITICAL | 1 min |
| 2 | Przepisać `error.tsx` copy | `app/error.tsx` | CRITICAL | 5 min |
| 3 | Naprawić breadcrumb "Zwierzaki" → bez tego linku | `zwierzaki/[species]/page.tsx:72`, `[...slug]/page.tsx:85` | CRITICAL | 5 min |
| 4 | Mobile menu — chevron we wszystkich sekcjach, emoji tylko w "Sklep" | `mobile-menu.tsx` | IMPORTANT | 10 min |
| 5 | Dodać opis + licznik produktów na `/typ/[itemType]` + slot CTA w empty state | `typ/[itemType]/page.tsx`, `empty-state.tsx` | IMPORTANT | 25 min |
| 6 | Inline validation + a11y w formularzu kontaktowym | `contact-form.tsx` | IMPORTANT | 30 min |
| 7 | Inline validation + placeholder w newsletterze | `newsletter-form.tsx` | IMPORTANT | 15 min |
| 8 | EmptyState — opcjonalny prop `action` (CTA button) | `empty-state.tsx` + użycie w `promocje/page.tsx`, `szukaj/page.tsx`, `/typ`, `/zwierzaki` | IMPORTANT | 25 min |
| 9 | Hero CTA "Odkryj produkty" → "Przeglądaj sklep" | `app/(public)/page.tsx:68` | IMPORTANT | 1 min |
| 10 | Empty state default subtitle: "innej kategorii" → "gdzie indziej" | `empty-state.tsx:5` | IMPORTANT | 1 min |
| 11 | "Zobacz wszystkie polecane →" linkuje do `/promocje` ale powinno do `/szukaj` lub osobnej strony | `app/(public)/page.tsx:160` | IMPORTANT | 2 min |
| 12 | Allegro CTA — ujednolicić "Allegro ↗" vs "Zobacz na Allegro" | `product-card.tsx`, `allegro-cta.tsx` | IMPORTANT | 5 min |

### 9.2 NEXT — ten tydzień (MINOR z większym ROI)

- Dodać sekcję "Wysyłka i zwroty" do karty produktu
- Audyt loading states na wszystkich asynchronicznych stronach (`loading.tsx` lub Suspense)
- Sprawdzić kontrast Allegro CTA (Lighthouse + ręcznie)
- Mobile 320px regression test (iPhone SE)

### 9.3 LATER — backlog (MINOR)

- Sortowanie produktów (cena/popularność)
- Filtrowanie ceną
- Wyświetlanie czasu ostatniej aktualizacji ceny
- FAQ page o sklepie/modelu
- Compare 2-3 produktów
- Social media w stopce (jeśli istnieją konta)
- Strona indeksowa `/zwierzaki` (decyzja architekturalna — patrz 3.3 opcja B)
- Ulubione (wishlist w localStorage albo z konta) — gdy będzie account

---

## 10. Załącznik — pełny inwentarz copy

88 stringów zinwentaryzowanych w fazie eksploracji. Pełna lista w czacie audytu (powyżej). Jeśli dokument ten ma trafić do przekazu (np. design / marketing), trzeba ją wkleić tu jako tabelę.

**Kategorie:**
- Hero / sekcje home (19 stringów)
- Nav (header + mobile menu) (10)
- Footer (6)
- Product cards / Allegro CTA (3)
- Newsletter (6)
- Empty states (4 warianty)
- Error + 404 (5)
- Contact (8)
- Search (5)
- Promotions (6)
- Guides (6)
- About (6)
- Cookies (3)
- Reading time / misc (1)

---

## 11. Decyzje do podjęcia z userem przed wdrożeniem

1. **Breadcrumb "Zwierzaki"** (sekcja 3.3) — opcja A (usunąć), B (utworzyć landing) czy C (zmienić label)?
2. **Ikona "Ulubione"** w headerze — ukrywamy (rekom.) czy zostawiamy z toast "Wkrótce"?
3. **Hero CTA** — "Przeglądaj sklep" / "Zobacz polecane" / inny? (target zostaje `/szukaj`)
4. **"Zobacz wszystkie polecane"** — link na `/szukaj` czy osobna strona `/polecane`?
5. **Allegro CTA** — ujednolicamy do "Kup na Allegro" czy "Zobacz na Allegro"?

---

**Koniec audytu.** Po zatwierdzeniu dokumentu (i odpowiedzi na 5 decyzji powyżej) przechodzimy do fixów in-place w kodzie zgodnie z mapą 9.1.
