# Copy rewrite — Yoko & Yoshi

**Data:** 2026-04-28
**Bazujemy na:** [docs/ux-audit.md](./ux-audit.md), [docs/link-audit.md](./link-audit.md), bieżącym stanie kodu po Yoko/Yoshi swap.

## Punkt wyjścia

Strona była dotąd projektowana jako **sklep**. Po decyzjach z briefu zmienia się na **redakcję pod-Allegro**: polskie poradniki + uczciwe recenzje akcesoriów dla psów (głównie shib) i kotów. Konwersja idzie na Allegro u sprawdzonego sprzedawcy.

Grupa: świeży opiekun shiby (0–12 m-cy) + sympatyk shib jeszcze bez psa.

Ton: zachowany jak był (Yoko ↔ Yoshi banter, "Yoko zakopała tę stronę", "wszystko poza miską"). Punktowo polerujemy.

Zasady twarde (z briefu copywriterskiego):
- Krótkie, nierówne zdania. Czasem jedno słowo.
- Zero korpo (rozwiązanie, synergia, kompleksowy, dedykowany).
- Konkret zamiast obietnicy.
- Ty, nie Państwo.
- Można od "Bo", "Ale", "I".
- Bez emoji, bez nadmiaru em-dash.

---

## A. Hero (home)

### 2 warianty headline

**Wariant A** (rekomendowany — kontynuacja głosu):
```
H1:    Zabawki, pielęgnacja
       i wszystko poza miską.
sub:   Polski przewodnik dla opiekunów psów i kotów —
       ze szczególnym targetem na shiby.
       Polecamy, opisujemy, klikasz na Allegro.
CTA1:  Co polecamy
CTA2:  Po co tu jesteśmy
```

**Wariant B** (mocniej redakcyjny):
```
H1:    Polecamy. Ty kupujesz
       na Allegro.
sub:   Mała redakcja prowadzona przez opiekunów dwóch shib —
       Yoko i Yoshi. Bez sponsorowanych list.
       Bez "10 najlepszych" sklejonych z reklam.
CTA1:  Sprawdź, co u nas
CTA2:  Kim jesteśmy
```

**Decyzja:** Wariant A (zachowuje rozpoznawalne H1, przepisuje sub w stronę redakcji).

### Stat bar (zamiast fikcyjnych liczb)

Było:
```
2 400+ produktów
48 poradników
4,8 ★ ocena czytelników
```

Jest:
```
Kuratorska selekcja
Każda kategoria — 5–10 testów

Polski głos
Bez tłumaczeń z angielskiego

Co tydzień nowe
Poradnik albo recenzja
```

**Rationale:** zero zmyślania liczb. Trzy jakościowe sygnały: czego dostarczamy, czym się różnimy, jak często.

---

## B. Sekcja "Po co dziś tu jesteś?" (home)

Było:
```
kicker: Wybierz pupila
H2:     Po co dziś tu jesteś?
sub:    Psy lub koty — zabawki, pielęgnacja i wszystko poza miską.
```

Jest:
```
kicker: Wybierz pupila
H2:     Po co dziś tu jesteś?
sub:    Psy lub koty. Wszystko poza miską.
```

**Rationale:** poprzedni sub powtarzał hero. Skracamy.

---

## C. Sekcja polecane (home)

Było:
```
kicker: Polecane przez Yoko & Yoshi
H2:     Tydzień u nas: same dobre wybory
link:   Zobacz wszystkie polecane →
```

Jest:
```
kicker: Polecane przez Yoko & Yoshi
H2:     W tym tygodniu — same dobre wybory
link:   Wszystkie polecane →
```

**Rationale:** "W tym tygodniu" naturalniej po polsku. "Zobacz" w linku zbędne.

---

## D. Shiba pillar (home + species hub psy)

Było:
```
badge:   ⭐ Specjalność firmy
H2:      Masz shibę? Mamy dla niej wszystko.
p:       Trymery i szczotki radzące sobie z podszerstkiem,
         szarpaki dla mocnych zgryzów, smycze nie do zerwania
         przez upartego psa — i baza wiedzy, której nie
         znajdziesz nigdzie indziej.
stat_1:  180+ produktów dla shib
stat_2:  14 artykułów rasowych
stat_3:  3 240 shib w społeczności
CTA1:    Hub rasowy: shiba inu
CTA2:    Polecane akcesoria
```

Jest:
```
badge:   Robimy to
H2:      Masz shibę? Mamy dla niej wszystko.
p:       Trymery i szczotki, które dadzą radę z podszerstkiem.
         Szarpaki nie do zgryzienia w tydzień. Smycze, których
         nie zerwie najuparciej szarpiący pies. Plus baza wiedzy,
         której nie znajdziesz w polskim internecie.
CTA1:    Hub rasowy: shiba inu
CTA2:    Polecane akcesoria
```

**Rationale:**
- "Specjalność firmy" brzmi korpo. "Robimy to" jest własne, krótkie.
- Stat bar (180+/14/3240) wycięty — fikcyjny.
- Akapit przepisany na krótkie zdania, konkretne argumenty per linia, zamiast jednego zlepku.

---

## E. Sekcja artykuły (home)

Bez zmian:
```
kicker: Świeżo z dziennika
H2:     Najnowsze poradniki
link:   Wszystkie poradniki →
```

---

## F. /zwierzaki landing

Było:
```
badge: Wybierz gatunek
H1:    Dla jakiego zwierzaka szukasz?
p:     Każdy gatunek ma swoje drzewo kategorii — zabawki, akcesoria,
       pielęgnacja. Wszystko poza miską. Klik i jesteś.
```

Jest:
```
badge: Wybierz gatunek
H1:    Dla jakiego zwierzaka szukasz?
p:     Psy lub koty. Reszta gatunków — w przygotowaniu. Klik i jesteś.
```

**Rationale:** "Wszystko poza miską" już użyte 2× wyżej. Tu uczciwie: pokrycie obecnie 2 gatunki, reszta wkrótce.

---

## G. /zwierzaki/{species} hub

### Sekcja "Polecane przez Yoko & Yoshi"

Było:
```
H2: Najlepsze dla {species.name.toLowerCase()}
```

Wynik dla `psy`: "Najlepsze dla psy" — niezgrabne, narusza polską gramatykę (powinno być dat. mn. "psom").

Jest:
```
H2: Co polecamy {species_dativus}
```

Wynik:
- psy → "Co polecamy psom"
- koty → "Co polecamy kotom"
- gryzonie → "Co polecamy gryzoniom"
- ptaki → "Co polecamy ptakom"
- ryby → "Co polecamy rybom"
- gady → "Co polecamy gadom"

**Rationale:** prawdziwa polska gramatyka + zachowuje "polecamy" jako brand-verb.

### Shiba pillar (na /zwierzaki/psy)

Było:
```
badge: ⭐ Specjalność firmy
H2:    Hub rasowy: Shiba Inu
p:     Pełny przewodnik po rasie + polecane akcesoria sprawdzone
       u shib pierwszej krwi.
CTA:   Zobacz przewodnik
```

Jest:
```
badge: Robimy to
H2:    Hub rasowy: shiba inu
p:     Pełny przewodnik po rasie. Plus akcesoria sprawdzone
       u Yoko i Yoshi.
CTA:   Zobacz przewodnik
```

**Rationale:** "shib pierwszej krwi" było marketingowe i niezrozumiałe. Konkret: Yoko i Yoshi to nasze testerki. Lowercase "shiba inu" w copy.

---

## H. /produkt/{slug}

Cena Allegro:
```
PRZED: Cena z Allegro · aktualizowana automatycznie
PO:    Cena z Allegro · sprawdzamy codziennie
```

**Rationale:** "aktualizowana automatycznie" brzmi technicznie / korporacyjnie. "Sprawdzamy codziennie" mówi to samo językiem człowieka.

Reszta zostaje (kicker, H1, mascot callout, "Co warto wiedzieć", "Najczęstsze pytania", "Może Ci się spodoba").

---

## I. /promocje

Było:
```
p: Wybrane produkty taniej niż zwykle. Ceny aktualizujemy z Allegro
   codziennie — kto pierwszy, ten lepszy.
```

Jest:
```
p: Wybrane produkty taniej niż zwykle. Sprawdzamy ceny u sprzedawców
   codziennie. Promocje wchodzą i znikają — kto pierwszy, ten lepszy.
```

**Rationale:** "z Allegro" → "u sprzedawców" (kontekst że to sprzedawcy, nie sama Allegro). Dodane krótkie "Promocje wchodzą i znikają" — przed kropką "kto pierwszy".

---

## J. /szukaj

```
PRZED: H1 (puste) — "Szukaj produktów"
PO:    H1 (puste) — "Czego szukasz?"
```

**Rationale:** konwersacyjne, pasuje do tonu. H1 z wynikami zostaje.

---

## K. /poradnik

Było:
```
p: Wszystko, co warto wiedzieć o psach, kotach i innych
   zwierzakach. Pielęgnacja, zachowanie, polecane akcesoria.
```

Jest:
```
p: Wszystko, co warto wiedzieć o psach, kotach i zwierzakach,
   których jeszcze nie mamy. Pielęgnacja, zachowanie, polecane
   akcesoria — głównie z myślą o opiekunach shib, ale przyda
   się każdemu.
```

**Rationale:** "których jeszcze nie mamy" — uczciwe o pokryciu, drobny żart. Shiba-emphasis bo to grupa docelowa.

---

## L. /o-nas

### Intro

Było:
```
H1: Cześć — to my, & nasze shiby.
p:  Yoko & Yoshi to autorski projekt, który polecił sam siebie.
    Sklep stworzony przez opiekunów dwóch shib, którzy
    przetestowali tysiąc produktów i wybrali tylko te dobre.
```

Jest:
```
H1: Cześć — to my, & nasze shiby.
p:  Yoko & Yoshi to my — dwoje ludzi i dwie shiby. Pisaliśmy
    najpierw na własnym blogu, potem ludzie zaczęli pytać
    "no dobra, ale co kupić" — więc zaczęliśmy polecać.
    Teraz jest tego pełen sklep. Klikasz, kupujesz na Allegro
    u sprawdzonego sprzedawcy, my dostajemy uśmiech, że ktoś
    nam zaufał.
```

**Rationale:**
- "autorski projekt który polecił sam siebie" — chwytliwe, ale opaque. Co to znaczy? Przepisuję na konkretną historię (blog → pytania → polecenia).
- "tysiąc produktów" — fikcyjne. Wycinamy.
- 1 os. l. mn. ("pisaliśmy", "zaczęliśmy") — dwoje właścicieli + shiby.

### Mascot bios

Bez zmian (po recent rewrite działają):
```
Yoko — ruda królowa wygody
Leniwa, zadowolona, kocha drzemki w słońcu.
Rekomenduje posłania, miski, pielęgnację —
wszystko, co wysyła sygnał: zostań chwilę dłużej.

Yoshi — kremowy szef ekipy
Energiczny, czujny, ciągle w ruchu.
Rekomenduje szarpaki, piłki, smycze
i wszystko, co wymaga sprintu.
```

### "Jak to działa" — drobny lifting pkt 3

```
PRZED pkt 3: Klikasz "Zobacz na Allegro", kupujesz...
PO    pkt 3: Klikasz "Kup na Allegro", kupujesz...
```

(CTA na karcie produktu nazywa się obecnie "Kup na Allegro" — synchronizujemy.)

---

## M. /kontakt

```
PRZED p: Pytanie o produkt, propozycja współpracy, zgłoszenie błędu —
         piszemy z reguły tego samego dnia.
PO    p: Pytanie o produkt, propozycja współpracy, zgłoszenie błędu —
         odpisujemy z reguły tego samego dnia.
```

**Rationale:** "piszemy" → "odpisujemy" — precyzyjniej (to jest reakcja na ich wiadomość).

---

## N. error.tsx + not-found.tsx

Bez zmian (genialne):
```
not-found H1: Yoko zakopała tę stronę.
error H1:     Coś nie pykło.
```

---

## O. Footer

Było:
```
disclaimer: Sklep #1 dla shibowiarzy w Polsce. Polecamy najlepsze
            produkty dla psów, kotów i innych zwierzaków — a Ty
            kupujesz je u sprawdzonych sprzedawców na Allegro.
```

Jest:
```
disclaimer: Polski przewodnik dla opiekunów psów i kotów. Polecamy
            najlepsze akcesoria — Ty kupujesz u sprawdzonych
            sprzedawców na Allegro.
```

**Rationale:**
- "Sklep #1" — fałszywe roszczenie (i strona to nie sklep).
- "shibowiarzy" — słowo nie istnieje w polskim.
- "polski przewodnik" — pozycjonuje redakcyjnie.

---

## P. Mobile menu

Było:
```
Sekcja: Świat shibowiarzy
CTA box: Polecamy — Ty kupujesz na Allegro u sprawdzonych sprzedawców.
```

Jest:
```
Sekcja: Świat shib
CTA box: Polecamy. Ty kupujesz na Allegro u sprawdzonych sprzedawców.
```

**Rationale:** bez "shibowiarzy". "Polecamy —" → "Polecamy." (krócej, mocniej).

---

## Q. Mock breed (Shiba Inu) `pillar_content`

Było:
```
Shiba inu to japońska rasa, która podbija serca opiekunów.
Niezależna, czujna, czysta. Wymaga stanowczej, ale spokojnej ręki.
```

Jest:
```
Shiba inu to jest decyzja na 12–15 lat trzymania kursu. Niezależna,
czujna, czysta. Lojalna, ale na własnych zasadach. Polskie internety
pełne są mitów ("nie da się trenować", "nie lubi ludzi") — tu
rozprawiamy się z nimi po kolei.
```

**Rationale:**
- Pierwsze zdanie konkretne (12-15 lat to fakt o rasie).
- "Niezależna, czujna, czysta" — zachowuję, działa.
- Anty-mit narracja wzmacnia rolę redakcji.

---

## R. Pisownia "shiba inu"

Decyzja: **lowercase w copy ciągłym**, **Capitalize w nagłówkach**.

Naprawione miejsca:
- `H2: Hub rasowy: Shiba Inu` (nagłówek) → zostaje "Shiba Inu"
- copy ciągłe (mascot bios, pillar_content, paragrafy) → "shiba inu"

---

## Czego nie byłem pewien

1. **2-segment vs 3-segment stat bar** — wybrałem 3 (rytm hero). Test post-launch.
2. **/o-nas wariant intro** — wybrałem "to my — dwoje ludzi i dwie shiby". Bardziej ludzkie niż "mała redakcja". Można testować B2.
3. **Footer "polski przewodnik"** — bez "#1" (uczciwie). Można zaostrzyć później jak strona urośnie.

## Co warto przetestować

- A/B na CTA hero: "Co polecamy" vs. "Przeglądaj sklep"
- 2-segment vs 3-segment stat bar
- /o-nas — "dwoje ludzi i dwie shiby" vs "mała redakcja"
- Pisownia "shiba inu" w SEO meta — wpływ na CTR z Google

---

## Zmienione pliki (lista wykonawcza)

| # | Plik | Co |
|---|---|---|
| 1 | [page.tsx](../src/app/(public)/page.tsx) | Hero sub + CTA, stat bar, "Po co dziś" sub, "Polecane" H2/link, Shiba pillar |
| 2 | [o-nas/page.tsx](../src/app/(public)/o-nas/page.tsx) | p_intro, lista pkt 3 |
| 3 | [zwierzaki/page.tsx](../src/app/(public)/zwierzaki/page.tsx) | description |
| 4 | [zwierzaki/[species]/page.tsx](../src/app/(public)/zwierzaki/[species]/page.tsx) | "Co polecamy {dat}" + Shiba pillar |
| 5 | [produkt/[slug]/page.tsx](../src/app/(public)/produkt/[slug]/page.tsx) | "Cena z Allegro · sprawdzamy codziennie" |
| 6 | [promocje/page.tsx](../src/app/(public)/promocje/page.tsx) | description |
| 7 | [szukaj/page.tsx](../src/app/(public)/szukaj/page.tsx) | H1 puste |
| 8 | [poradnik/page.tsx](../src/app/(public)/poradnik/page.tsx) | description |
| 9 | [kontakt/page.tsx](../src/app/(public)/kontakt/page.tsx) | sub |
| 10 | [footer.tsx](../src/components/layout/footer.tsx) | disclaimer |
| 11 | [mobile-menu.tsx](../src/components/layout/mobile-menu.tsx) | "Świat shib" + CTA box |
| 12 | [mock.ts](../src/lib/db/mock.ts) | Shiba Inu `pillar_content` |
| 13 | [utils.ts](../src/lib/utils.ts) | nowy helper `speciesDativus(slug)` |
