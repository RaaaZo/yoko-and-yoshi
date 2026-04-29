# UX audit v2 — sprawdzony na realnej stronie

**Data:** 2026-04-28
**Metoda:** dev server + viewport mobile (375×812) + desktop (1280×800), screenshot per kluczowa strona, eval do detekcji overflow.
**Bazujemy na:** stanie po wszystkich poprzednich audytach (UX, link, copy v1, mock data, repositioning).

## TL;DR

Strona **wygląda solidnie**. Po wszystkich poprzednich rundach większość krytycznych spraw rozwiązana:
- Brak horizontal scroll na żadnej kluczowej stronie (mierzone `scrollWidth - clientWidth`)
- Cookie banner mieści się na mobile po fixie flex-wrap
- Karty produktu (BadgeRecommended icon-only + Allegro responsive) działają w 2-col grid
- Star rating partial fill, carousel, kafelki kategorii — wszystko czyste
- Repositioning copy + voice (Yoko/Yoshi swap) spójne

Pozostały **4 konkretne issues** do fixu (1 important, 3 minor) + 2 designer-task'i na potem.

## Findingi

### 🟠 IMPORTANT — do fixu

#### 1. `/produkt/[slug]` — breadcrumb pełnej nazwy produktu zajmuje 2 linie

**Plik:** [src/app/(public)/produkt/[slug]/page.tsx](src/app/(public)/produkt/[slug]/page.tsx) — `buildProductBreadcrumbs`

**Co widać na mobile (375px):**
```
Start › Psy › Zabawki ›
Szarpak bawełniany XL — pleciony,
dla psów średnich i dużych
```

Last segment to pełna nazwa produktu (60+ znaków). Łamie się na 2 linie i konkuruje wizualnie z H1 poniżej.

**Fix:** w `buildProductBreadcrumbs` truncuj last segment do max ~32 znaków z `…`. H1 i tak pokaże pełną nazwę.

#### 2. `/szukaj` — placeholder inputa obcięty na mobile

**Co widać:**
```
[ Szukaj zabawek, sm... ]
```
Placeholder `Szukaj zabawek, smyczy, trymerów…` jest dłuższy niż width inputa minus padding na 375px viewport.

**Fix:** krótszy mobile placeholder. Np. `Szukaj produktów…` na mobile, pełny na sm+. Implementacja: dwa atrybuty `placeholder` przez warunkowy responsive className (Tailwind nie ma media-conditional placeholder, więc albo JS detect, albo po prostu zawsze krótszy `Szukaj produktów…`).

### 🟡 MINOR — do fixu

#### 3. Footer "Inne zwierzaki" myli

**Plik:** [src/components/layout/footer.tsx](src/components/layout/footer.tsx)

Po decyzji "tylko psy + koty na landing" link "Inne zwierzaki" → `/zwierzaki` oczekuje, że landing pokaże gryzonie/ptaki/ryby/gady. A landing pokazuje tylko 2 species. Etykieta kłamie o targetcie.

**Fix:** "Inne zwierzaki" → "Wszystkie zwierzaki" lub po prostu wyciąć ten link (skoro landing redundant z linkami "Psy"/"Koty" wyżej).

#### 4. `/szukaj` — 6 species badges vs 2 na `/zwierzaki` landing

**Co widać:**
- `/szukaj` "Albo przeglądaj po gatunku:" pokazuje **6 badges** (Psy / Koty / Gryzonie / Ptaki / Ryby / Gady)
- `/zwierzaki` landing pokazuje **2 kafelki** (tylko Psy / Koty)

User klika "Gryzonie" z search → ląduje na `/zwierzaki/gryzonie` które jest semi-empty (kategorie istnieją z mocku, ale 0 produktów).

**Fix:** `/szukaj` filtruj `species` do `["psy", "koty"]` — synchronicznie z landing. Tworzy spójność zachowania.

### 🟢 DESIGN/POLISH — do osobnego sprintu (nie blocker)

#### 5. SpeciesIcon: Psy i Koty wyglądają niemal identycznie

Obie ikony to: trojkątne uszki + kropki na buźce. Wizualnie nie różnią rasy. Psy wygląda bardziej jak królik / kociak niż pies. Warto przerobić w designie — dla Psy bardziej okrągłe pyski/uszy, dla Koty zachowane sharp/pointed + whiskers.

**Plik:** [src/components/brand/icons/species-icon.tsx](src/components/brand/icons/species-icon.tsx)

#### 6. Emoji w UI badges

W brief copywritera pojawiło się "no emoji". W UI ostały:
- Footer / mobile menu: `🔥 Promocje`
- /poradnik/rasy/[breed]: `⭐ Hub rasowy`
- Home Shiba pillar: `⭐` w tekście (już wycięty po recent fix)

Emoji w **badgu** (jako akcent UI, nie copy) jest powszechnie akceptowalne — różne od emoji w paragrafach copy. Decyzja produktowa: zostawić czy wycina ikony emoji na rzecz SVG.

## Co działa świetnie ✅

- **Hero**: H1 "Zabawki, pielęgnacja i wszystko poza miską" + nowe CTA "Co polecamy" / "Po co tu jesteśmy" — read jak człowiek
- **/o-nas intro**: "Yoko & Yoshi to my — dwoje ludzi i dwie shiby. Pisaliśmy najpierw na własnym blogu..." — buduje zaufanie
- **Mascot bios** (Yoko ruda królowa wygody / Yoshi kremowy szef ekipy) — działa
- **Shiba pillar** "Robimy to" badge + przepisany akapit
- **Footer disclaimer** "Polski przewodnik" zamiast "Sklep #1 dla shibowiarzy"
- **/poradnik description**: shiba-emphasis + uczciwe "zwierzakach których jeszcze nie mamy"
- **/zwierzaki/{species} hub**: "Co polecamy psom/kotom" przez `speciesDativus` helper
- **/produkt** breadcrumb: poprawne ścieżki przez category_paths (Start › Psy › Zabawki › nazwa)
- **Karta produktu** (mobile 2-col): BadgeRecommended icon-only do sm-, full text od sm+; Allegro mini-badge responsive padding/font; flex-wrap pricerow
- **StarRating** partial fill (3.8 → 3.5★)
- **Carousel** kafelków kategorii i produktów; arrows tylko na desktop, swipe na mobile
- **Cookie banner**: po fixie flex-wrap buttonów mieści się
- **404** "Yoko zakopała tę stronę" — keep
- **error** "Coś nie pykło" — keep
- **Brak horizontal scroll** na żadnej z 11 sprawdzonych stron mobile

## Plan wykonawczy

Naprawiam #1–#4 in-place. #5 i #6 zostawiam do decyzji produktowej / designera.
