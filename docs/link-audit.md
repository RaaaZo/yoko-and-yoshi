# Audyt linków — yoko & yoshi

**Data:** 2026-04-27
**Wersja kodu:** branch `main`, po fixach z `docs/ux-audit.md`
**Metoda:** mechaniczne wyciągnięcie wszystkich `href` (literal + template literal + variable passthrough) z `src/`, porównanie z faktycznymi route'ami w `src/app/`.

---

## Podsumowanie

| Severity | Liczba | Co to znaczy |
|---|---|---|
| **CRITICAL** | 1 | Link prowadzi na 404 |
| **IMPORTANT** | 4 | Link działa, ale UX jest złamany (filtr ignorowany, niejasny target) |
| **MINOR** | 3 | Niespójności i drobne usterki nawigacyjne |

Dobra wiadomość: **publiczne linki nawigacyjne (header, mobile menu, footer, breadcrumbs, kafelki produktów) — wszystkie prowadzą do istniejących route'ów po fixach z poprzedniego audytu** (`/zwierzaki` istnieje, `/ulubione` usunięte). Pozostałe problemy to query stringi i jeden bug w admin dashboardzie.

---

## CRITICAL

### 1. Admin dashboard — `/admin/kontakt` prowadzi na 404 🐛

[src/app/(admin)/admin/(protected)/page.tsx:48](src/app/(admin)/admin/(protected)/page.tsx)

```tsx
<KpiCard label="Kontakt (nowe)" value={contactCount} href="/admin/kontakt" />
```

**Problem:** route `/admin/kontakt` nie istnieje w `src/app/(admin)/admin/(protected)/`. Lista istniejących admin routes:
`artykuly, audyt, gatunki, homepage, kategorie, media, nawigacja, newsletter, produkty, przekierowania, rasy, strony, typy, ustawienia, uzytkownicy`.

Klik z dashboardu na kafelek "Kontakt (nowe)" → 404. Sidebar admina **nie zawiera** linku do `/admin/kontakt`, więc admin nie ma żadnego sposobu na przeczytanie wiadomości z formularza kontaktowego — **wiadomości lądują w bazie i są nieczytelne przez UI**.

**Fixy do wyboru:**
- **A** — zaimplementować widok `/admin/kontakt` (CRUD listy `contact_messages`) i dodać link do sidebara. To jest właściwy fix.
- **B** — tymczasowo zmienić `href` na `/admin/audyt` lub usunąć kafelek z dashboardu, dopóki widok nie powstanie.
- **C** — zostawić jak jest, ale dodać informację dla admina ("Widok wkrótce") — najgorszy.

**Rekomendacja:** B teraz (5 min), A jako oddzielne zadanie.

---

## IMPORTANT

### 2. `/poradnik?cat=...` — query string, którego strona nie czyta 🐛

Linki używające `?cat=`:

| Lokalizacja | href |
|---|---|
| [footer.tsx:17](src/components/layout/footer.tsx) | `/poradnik?cat=rasy` |
| [footer.tsx:18](src/components/layout/footer.tsx) | `/poradnik?cat=pielegnacja` |
| [footer.tsx:19](src/components/layout/footer.tsx) | `/poradnik?cat=zywienie` |
| [poradnik/rasy/[breed]/page.tsx:41](src/app/(public)/poradnik/rasy/[breed]/page.tsx) | `/poradnik?cat=rasy` (breadcrumb) |

**Problem:** `[src/app/(public)/poradnik/page.tsx](src/app/(public)/poradnik/page.tsx)` **nie czyta `searchParams`** — query string jest ignorowany. User klika w stopce "Pielęgnacja" oczekując listy artykułów z kategorii pielęgnacja, ląduje na pełnej liście wszystkich poradników.

**Konsekwencja UX:**
- 3 linki w stopce nie robią nic, co obiecują
- breadcrumb "Rasy" na hubie rasowym też kłamie

**Fixy do wyboru:**
- **A** (rekom.) — dodać obsługę `searchParams.cat` w `/poradnik/page.tsx` (filtr po `category` na zapytaniu DB) + UI badge "Filtruj: Pielęgnacja" z przyciskiem "Wszystkie".
- **B** — utworzyć osobne route'y `/poradnik/[kategoria]` (clean URL, lepsze SEO). Większa zmiana, ale spójniejsza z resztą aplikacji.
- **C** — usunąć linki ze stopki i zmienić breadcrumb na `Start › Poradniki › Rasy › ...` (bez linkowania kategorii). Najszybciej, ale tracimy wartość nawigacyjną.

### 3. Mobile menu — dwa różne labele linkujące w to samo miejsce

[src/components/layout/mobile-menu.tsx:27,29](src/components/layout/mobile-menu.tsx)

```ts
const WORLD_LINKS = [
  ["Hub rasowy: Shiba Inu", "/poradnik/rasy/shiba-inu"],   // linia 27
  ["Wszystkie poradniki", "/poradnik"],
  ["Bestsellery dla shib", "/poradnik/rasy/shiba-inu"],    // linia 29 — TEN SAM TARGET
];
```

**Problem:** "Hub rasowy: Shiba Inu" i "Bestsellery dla shib" wyglądają jak różne sekcje, ale prowadzą do tej samej strony. User klika "Bestsellery", oczekuje listy konkretnych produktów, ląduje na hubie rasowym (mix przewodnika + produktów).

**Fix:** albo (a) usunąć "Bestsellery dla shib" z mobile menu, albo (b) zmienić target na `/typ/szarpaki-gryzaki?species=psy` lub osobny route — ale wówczas trzeba ten route obsłużyć.

**Rekomendacja:** usunąć "Bestsellery" do czasu, gdy będzie osobna lista.

### 4. Footer — "Inne zwierzaki" → `/zwierzaki/gryzonie`

[src/components/layout/footer.tsx:10](src/components/layout/footer.tsx)

```ts
["Inne zwierzaki", "/zwierzaki/gryzonie"],
```

**Problem:** etykieta "Inne zwierzaki" sugeruje listę "wszystkie poza psami i kotami", a target to konkretnie strona gryzoni. Po fixie z poprzedniego audytu istnieje teraz `/zwierzaki` jako landing wszystkich gatunków — to jest właściwy target dla tej etykiety.

**Fix:**
```ts
["Inne zwierzaki", "/zwierzaki"],
```

### 5. Footer logo nie jest klikalne

[src/components/layout/footer.tsx:40-52](src/components/layout/footer.tsx)

Logo w stopce siedzi w `<span>`, nie w `<Link>`. Konwencja webowa: logo w stopce → `/`. User wraca do home klikając logo (gest, którego uczy się z headera).

**Fix:** owinąć logo w `<Link href="/">`, dodać `aria-label="Wróć na stronę główną"`.

---

## MINOR

### 6. `<a href="/kontakt">` zamiast `<Link href="/kontakt">`

[src/app/error.tsx:24](src/app/error.tsx) (po naszym fixie z poprzedniego audytu)

W error boundary użyto `<a>` zamiast `<Link>`, co jest świadome — Next.js `<Link>` może mieć problemy z renderowaniem w error state'cie (klient może nie mieć kontekstu routera). Akceptowalne, ale powoduje hard-navigation zamiast client-side routing przy klikaniu z poziomu error page.

**Werdykt:** ✅ Zostawiamy. To bezpieczna decyzja w kontekście error.tsx.

### 7. `mailto:hej@yokoyoshi.pl` — czy ten email aktywny?

[src/app/(public)/informacja-affiliate/page.tsx:59](src/app/(public)/informacja-affiliate/page.tsx)
[src/app/(public)/polityka-prywatnosci/page.tsx:24](src/app/(public)/polityka-prywatnosci/page.tsx)

Mailto wskazuje na `hej@yokoyoshi.pl`. Z poziomu kodu nie da się stwierdzić, czy adres istnieje i czy ktoś go czyta. **Wymaga ręcznej weryfikacji** — wysłać testowy mail.

### 8. `/o-nas#zwierzaki` — anchor istnieje ✅

[src/components/layout/mobile-menu.tsx:34](src/components/layout/mobile-menu.tsx)

Element `<section id="zwierzaki">` istnieje w [/o-nas/page.tsx:43](src/app/(public)/o-nas/page.tsx). Anchor działa. Sticky header z `header.tsx:18` ma `top-0 z-30` i ~64px wysokości — anchor scroll może docelowo zatrzymać się pod nagłówkiem. **Sugestia:** dodać CSS `scroll-margin-top: 6rem` na `#zwierzaki`. Drobiazg.

---

## Pełny inwentarz internal hrefs (zweryfikowane)

### Public — wszystkie ✅ mapują na istniejące route'y

| href | Target route | OK |
|---|---|---|
| `/` | `app/(public)/page.tsx` | ✅ |
| `/szukaj` | `app/(public)/szukaj/page.tsx` (czyta `?q`, `?type`, `?species`, `?for`, `?recommended` — z permanentRedirect na legacy params) | ✅ |
| `/promocje` | `app/(public)/promocje/page.tsx` | ✅ |
| `/zwierzaki` | `app/(public)/zwierzaki/page.tsx` (nowy, z poprzedniego audytu) | ✅ |
| `/zwierzaki/{slug}` | `app/(public)/zwierzaki/[species]/page.tsx` | ✅ |
| `/zwierzaki/{path}` | `app/(public)/zwierzaki/[species]/[...slug]/page.tsx` | ✅ |
| `/typ/{slug}` | `app/(public)/typ/[itemType]/page.tsx` | ✅ |
| `/produkt/{slug}` | `app/(public)/produkt/[slug]/page.tsx` | ✅ |
| `/poradnik` | `app/(public)/poradnik/page.tsx` | ✅ (ale ⚠️ ignoruje `?cat=`, patrz #2) |
| `/poradnik/{slug}` | `app/(public)/poradnik/[slug]/page.tsx` | ✅ |
| `/poradnik/rasy/{breed}` | `app/(public)/poradnik/rasy/[breed]/page.tsx` | ✅ |
| `/o-nas` | `app/(public)/o-nas/page.tsx` | ✅ |
| `/o-nas#zwierzaki` | anchor `id="zwierzaki"` w o-nas | ✅ |
| `/kontakt` | `app/(public)/kontakt/page.tsx` | ✅ |
| `/newsletter` | `app/(public)/newsletter/page.tsx` | ✅ |
| `/informacja-affiliate` | `app/(public)/informacja-affiliate/page.tsx` | ✅ |
| `/polityka-prywatnosci` | `app/(public)/polityka-prywatnosci/page.tsx` | ✅ |
| `/polityka-cookies` | `app/(public)/polityka-cookies/page.tsx` | ✅ |
| `/regulamin` | `app/(public)/regulamin/page.tsx` | ✅ |

### Admin — 1 ❌ + 16 ✅

| href | Status |
|---|---|
| `/admin` | ✅ |
| `/admin/produkty`, `/admin/produkty/nowy`, `/admin/produkty/[id]` | ✅ |
| `/admin/artykuly`, `/admin/audyt`, `/admin/gatunki`, `/admin/homepage`, `/admin/kategorie`, `/admin/media`, `/admin/nawigacja`, `/admin/newsletter`, `/admin/przekierowania`, `/admin/rasy`, `/admin/strony`, `/admin/typy`, `/admin/ustawienia`, `/admin/uzytkownicy` | ✅ |
| `/admin/kontakt` | **❌ 404 — patrz #1** |

### Form actions

| `<form action=...>` | Target |
|---|---|
| `action="/szukaj"` (header desktop, header mobile, /szukaj page) | ✅ |

### External + mailto

| Link | Uwagi |
|---|---|
| `mailto:hej@yokoyoshi.pl` (×2) | Wymaga ręcznej weryfikacji że adres odbiera maile |
| Allegro affiliate URLs (per-produkt, z DB pole `allegro_url`) | Wszystkie z `target="_blank"` + `rel="sponsored noopener noreferrer"` ✅ |
| Inne hardcoded externals | Brak |

---

## Priorytetyzowana mapa fixów

### Now (CRITICAL)
1. `/admin/kontakt` — albo zaimplementować widok, albo zmienić href / usunąć kafelek z dashboardu.

### Next (IMPORTANT)
2. `/poradnik?cat=...` — wybrać strategię A/B/C, wdrożyć (footer + breadcrumb).
3. Mobile menu "Bestsellery dla shib" — usunąć dublujący link.
4. Footer "Inne zwierzaki" → `/zwierzaki` (zamiast `/zwierzaki/gryzonie`).
5. Footer logo — owinąć w `<Link href="/">`.

### Later (MINOR)
6. Anchor `#zwierzaki` — `scroll-margin-top` (drobne UX wykończenie).
7. Weryfikacja `mailto:` adresu (ręcznie).

---

## Decyzje do podjęcia

1. **#1 admin kontakt** — fix tymczasowy (B) czy zaimplementować widok (A) teraz?
2. **#2 `?cat=`** — opcja A (filtr na istniejącej stronie), B (osobne route'y), czy C (usunąć linki)?
3. **#3 Bestsellery dla shib** — usuwamy z mobile menu czy znajdujemy poprawny target?
