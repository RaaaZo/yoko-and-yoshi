-- ============================================================
-- Yoko & Yoshi — seed data
-- ============================================================
-- Idempotent: uses ON CONFLICT to allow re-running.
-- Populates: 6 species, 12 item_types, ~15 categories, 1 breed
-- (Shiba Inu flagship), 10 example products, 3 articles, default
-- homepage_sections + navigation_items + settings.
-- ============================================================

-- SPECIES
insert into public.species (slug, name, description, sort_order, published) values
  ('psy',      'Psy',      'Wszystko dla psich opiekunów — od karm po zabawki.', 1, true),
  ('koty',     'Koty',     'Akcesoria, drapaki i karma dla kotów wszystkich charakterów.', 2, true),
  ('gryzonie', 'Gryzonie', 'Klatki, karma, akcesoria dla królików, świnek, chomików.', 3, true),
  ('ptaki',    'Ptaki',    'Klatki, żerdki, karma i zabawki dla ptaków towarzyszących.', 4, true),
  ('ryby',     'Ryby',     'Akwarystyka — od filtrów po dekoracje.', 5, true),
  ('gady',     'Gady',     'Terraria, oświetlenie, karmienie egzotycznych pupili.', 6, true)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, sort_order = excluded.sort_order, published = excluded.published;

-- ITEM TYPES (12 — z designu homepage)
insert into public.item_types (slug, name, icon_emoji, soft_color_token, sort_order, published) values
  ('szarpaki-gryzaki',     'Szarpaki & gryzaki',     '🦴', 'secondary-soft',    1,  true),
  ('pilki',                'Piłki',                  '🎾', 'primary-soft',      2,  true),
  ('trymery-szczotki',     'Trymery & szczotki',     '✂️', 'accent-cyan-soft',  3,  true),
  ('smycze-obroze',        'Smycze & obroże',        '🪢', 'bg-warm',           4,  true),
  ('poslania',             'Posłania',               '🛏️', 'bg-warm',           5,  true),
  ('transportery',         'Transportery',           '🎒', 'bg-warm',           6,  true),
  ('miski-poidla',         'Miski & poidła',         '🥣', 'bg-warm',           7,  true),
  ('pielegnacja',          'Pielęgnacja',            '🧴', 'bg-warm',           8,  true),
  ('szelki',               'Szelki',                 '🦮', 'bg-warm',           9,  true),
  ('zabawki-interaktywne', 'Zabawki interaktywne',   '🧶', 'bg-warm',           10, true),
  ('ubranka',              'Ubranka',                '🧥', 'bg-warm',           11, true),
  ('akcesoria-podrozne',   'Akcesoria podróżne',     '🚗', 'bg-warm',           12, true)
on conflict (slug) do update set
  name = excluded.name, icon_emoji = excluded.icon_emoji, sort_order = excluded.sort_order, published = excluded.published;

-- CATEGORIES — nested under "psy"
do $$
declare
  v_psy uuid;
  v_zabawki uuid;
  v_karma uuid;
begin
  select id into v_psy from public.species where slug = 'psy';

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache)
  values (v_psy, 'zabawki', 'Zabawki', 1, true, 'psy/zabawki')
  on conflict (species_id, parent_id, slug) do update set name = excluded.name returning id into v_zabawki;

  insert into public.categories (species_id, parent_id, slug, name, sort_order, published, path_cache) values
    (v_psy, v_zabawki, 'szarpaki', 'Szarpaki & gryzaki', 1, true, 'psy/zabawki/szarpaki'),
    (v_psy, v_zabawki, 'pilki',    'Piłki',              2, true, 'psy/zabawki/pilki'),
    (v_psy, v_zabawki, 'interaktywne', 'Zabawki interaktywne', 3, true, 'psy/zabawki/interaktywne')
  on conflict (species_id, parent_id, slug) do nothing;

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache)
  values (v_psy, 'karma', 'Karma', 2, true, 'psy/karma')
  on conflict (species_id, parent_id, slug) do update set name = excluded.name returning id into v_karma;

  insert into public.categories (species_id, parent_id, slug, name, sort_order, published, path_cache) values
    (v_psy, v_karma, 'sucha', 'Karma sucha', 1, true, 'psy/karma/sucha'),
    (v_psy, v_karma, 'mokra', 'Karma mokra', 2, true, 'psy/karma/mokra'),
    (v_psy, v_karma, 'przysmaki', 'Przysmaki', 3, true, 'psy/karma/przysmaki')
  on conflict (species_id, parent_id, slug) do nothing;

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache) values
    (v_psy, 'akcesoria', 'Akcesoria', 3, true, 'psy/akcesoria'),
    (v_psy, 'pielegnacja', 'Pielęgnacja', 4, true, 'psy/pielegnacja'),
    (v_psy, 'poslania', 'Posłania', 5, true, 'psy/poslania')
  on conflict (species_id, parent_id, slug) do nothing;
end$$;

-- BREEDS — flagship Shiba Inu
do $$
declare
  v_psy uuid;
begin
  select id into v_psy from public.species where slug = 'psy';
  insert into public.breeds (slug, name, species_id, pillar_content, quick_facts, published, seo_title, seo_description) values (
    'shiba-inu',
    'Shiba Inu',
    v_psy,
    '## Kompletny przewodnik dla nowego opiekuna

Shiba inu to japońska rasa primitywnych psów — niezależna, czujna, wyjątkowo czysta. Jeśli zastanawiasz się, czy to pies dla Ciebie — zacznij tutaj.

### Charakter

Shiba ma silne osobowości. Są lojalne wobec rodziny, ale dystansują się od obcych. Słynne "shiba scream" to dramatyczny dźwięk frustracji — nie boli, ale potrafi zaskoczyć sąsiadów.

### Pielęgnacja

Linieją intensywnie dwa razy w roku. Inwestycja w dobry undercoat rake i odkurzacz to konieczność. Poza tym to rasa wyjątkowo czysta — same dbają o sierść.

### Aktywność

Potrzebują 1-2 godzin ruchu dziennie. Uwaga na off-leash recall — instynkt łowiecki bierze górę.',
    '{
      "wzrost":     "32-41 cm",
      "waga":       "8-11 kg",
      "dlugosc_zycia": "12-15 lat",
      "linieje":    "intensywnie 2x rocznie",
      "temperament": "niezależny, czujny, lojalny",
      "polecane_dla": "doświadczeni opiekunowie"
    }'::jsonb,
    true,
    'Shiba Inu — kompletny przewodnik dla opiekuna | Yoko & Yoshi',
    'Wszystko o shibie: charakter, pielęgnacja, aktywność, żywienie, polecane akcesoria. Przewodnik od opiekunów Yoko i Yoshi.'
  )
  on conflict (slug) do update set
    name = excluded.name,
    pillar_content = excluded.pillar_content,
    published = excluded.published;
end$$;

-- PRODUCTS (10 examples — kicker = item type, NOT brand name)
do $$
declare
  v_szarpaki uuid;
  v_pilki uuid;
  v_trymery uuid;
  v_smycze uuid;
  v_poslania uuid;
  v_miski uuid;
begin
  select id into v_szarpaki from public.item_types where slug = 'szarpaki-gryzaki';
  select id into v_pilki from public.item_types where slug = 'pilki';
  select id into v_trymery from public.item_types where slug = 'trymery-szczotki';
  select id into v_smycze from public.item_types where slug = 'smycze-obroze';
  select id into v_poslania from public.item_types where slug = 'poslania';
  select id into v_miski from public.item_types where slug = 'miski-poidla';

  insert into public.products (
    slug, name, short_description, recommending_mascot, price_pln, price_old_pln,
    rating, rating_count, allegro_url, is_featured, is_recommended, sort_score, published
  ) values
    ('szarpak-bawelniany-38cm',
     'Szarpak ze sznura bawełnianego, 38 cm',
     'Twardy szarpak dla średnich i dużych psów — czyści zęby, ratuje meble.',
     'yoko', 49.00, 69.00, 4.8, 192,
     'https://allegro.pl/listing?string=szarpak%20bawe%C5%82niany', true, true, 100, true),

    ('pilka-gumowa-piszczek-7cm',
     'Piłka gumowa z piszczkiem, ø 7 cm',
     'Trwała guma, głośny piszczek — ulubiona zabawka aportu.',
     'yoko', 29.90, null, 4.9, 88,
     'https://allegro.pl/listing?string=pilka%20gumowa%20piszczek', true, true, 95, true),

    ('trymer-akumulatorowy-4-nakladki',
     'Trymer akumulatorowy z 4 nakładkami',
     'Cichy silnik, 4 grzebienie wymienne — radzi sobie z podszerstkiem shiby.',
     'yoshi', 189.00, null, 4.7, 64,
     'https://allegro.pl/listing?string=trymer%20akumulatorowy', false, true, 90, true),

    ('poslanie-owalne-100x70',
     'Posłanie owalne pluszowe 100×70 cm',
     'Antyalergiczny pluszek, prany w 30°C, podstawa antypoślizgowa.',
     'yoshi', 159.00, null, 4.6, 142,
     'https://allegro.pl/listing?string=poslanie%20owalne', true, true, 88, true),

    ('smycz-parciana-1-8m-regulowana',
     'Smycz parciana 1.8 m, regulowana',
     'Trzy długości: 1.0 / 1.4 / 1.8 m. Wytrzymały karabińczyk.',
     'yoko', 49.00, null, 4.7, 76,
     'https://allegro.pl/listing?string=smycz%20parciana', false, true, 80, true),

    ('miska-ceramiczna-1l',
     'Miska ceramiczna 1 L, antypoślizgowa',
     'Ciężka, stabilna, łatwa w czyszczeniu. Bez bisfenoli.',
     'yoshi', 39.00, null, 4.5, 51,
     'https://allegro.pl/listing?string=miska%20ceramiczna', false, false, 70, true),

    ('szarpak-z-piszczkiem-ringer',
     'Szarpak ringer z piszczkiem',
     'Pierścień + sznur, dwa motywy zabawy w jednym.',
     'both', 39.90, null, 4.6, 33,
     'https://allegro.pl/listing?string=szarpak%20ringer', false, false, 65, true),

    ('pilka-tenisowa-3pak',
     'Piłki tenisowe 3-pak',
     'Klasyka aportu. Sprawdzą się w parku i w domu.',
     'yoko', 24.90, null, 4.4, 211,
     'https://allegro.pl/listing?string=pilki%20tenisowe%20psie', false, false, 60, true),

    ('szczotka-furminator-m',
     'Furminator do podszerstka — rozmiar M',
     'Niezbędny w sezonie linienia. Skraca czas wyczesywania o połowę.',
     'yoshi', 129.00, 159.00, 4.8, 312,
     'https://allegro.pl/listing?string=furminator%20m', true, true, 92, true),

    ('zabawka-puzzle-poziom-2',
     'Zabawka logiczna — puzzle poziom 2',
     'Pies otwiera klapki by zdobyć smaczek. Trening + zabawa.',
     'both', 79.00, null, 4.5, 27,
     'https://allegro.pl/listing?string=zabawka%20logiczna%20pies', false, false, 75, true)
  on conflict (slug) do update set
    name = excluded.name,
    price_pln = excluded.price_pln,
    rating = excluded.rating;

  -- Map products to item_types
  insert into public.product_item_types (product_id, item_type_id)
  select p.id, v_szarpaki from public.products p where p.slug in ('szarpak-bawelniany-38cm', 'szarpak-z-piszczkiem-ringer')
  on conflict do nothing;
  insert into public.product_item_types (product_id, item_type_id)
  select p.id, v_pilki from public.products p where p.slug in ('pilka-gumowa-piszczek-7cm', 'pilka-tenisowa-3pak')
  on conflict do nothing;
  insert into public.product_item_types (product_id, item_type_id)
  select p.id, v_trymery from public.products p where p.slug in ('trymer-akumulatorowy-4-nakladki', 'szczotka-furminator-m')
  on conflict do nothing;
  insert into public.product_item_types (product_id, item_type_id)
  select p.id, v_smycze from public.products p where p.slug = 'smycz-parciana-1-8m-regulowana'
  on conflict do nothing;
  insert into public.product_item_types (product_id, item_type_id)
  select p.id, v_poslania from public.products p where p.slug = 'poslanie-owalne-100x70'
  on conflict do nothing;
  insert into public.product_item_types (product_id, item_type_id)
  select p.id, v_miski from public.products p where p.slug = 'miska-ceramiczna-1l'
  on conflict do nothing;
end$$;

-- ARTICLES (3 examples)
insert into public.articles (slug, title, excerpt, content, category, reading_minutes, published, published_at, seo_title, seo_description) values
  ('szarpak-dla-shiby-jak-wybrac',
   'Szarpak dla shiby — jak wybrać taki, który przeżyje',
   'Mocne zgryzy, intensywny gryz, sezon ekstremalnej zabawy. 4 cechy, na które patrzymy zanim coś polecimy.',
   '## Wstęp

Shiby gryzą inaczej niż większość psów. Nie chodzi tylko o siłę — chodzi o uporczywość...',
   'akcesoria', 7, true, now(),
   'Szarpak dla shiby — jak wybrać dobry sznur',
   'Mocne zgryzy + zabawowy temperament shiby = krótki żywot szarpaka. Pokazujemy, na co patrzeć przy zakupie.'),

  ('linienie-shiby-4-strategie',
   'Linienie shiby: 4 strategie, które naprawdę działają',
   'Dwa razy w roku z shiby leci futra na koc. Co robimy by przeżyć ten okres bez nerwówki.',
   '## Strategia 1 — undercoat rake

Furminator albo grzebień Mars Coat King. Nie szczotki dziubate — gładkie, równo wybierające podszerstek...',
   'pielegnacja', 6, true, now(),
   'Linienie shiby — 4 sprawdzone strategie',
   'Sezon linienia shiby trwa 4-6 tygodni. Cztery strategie, które ograniczają stratę sierści w domu.'),

  ('shiba-inu-przewodnik-nowego-opiekuna',
   'Shiba inu — kompletny przewodnik dla nowego opiekuna',
   'Wszystko, co warto wiedzieć przed adopcją: charakter, pielęgnacja, aktywność, koszt utrzymania.',
   '## Co musisz wiedzieć

Shiba to nie labrador. To pies samoistny, z silną wolą...',
   'rasy', 14, true, now(),
   'Shiba Inu — przewodnik dla nowego opiekuna',
   'Pełen przewodnik po shibie: charakter, pielęgnacja, aktywność, żywienie, koszt. Od opiekunów Yoko i Yoshi.')
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  published = excluded.published;

-- HOMEPAGE SECTIONS (default order)
insert into public.homepage_sections (kind, config, sort_order, published) values
  ('hero',              '{"badge":"Akcesoria · zabawki · pielęgnacja","headline":"Zabawki, pielęgnacja i wszystko poza miską.","cta_primary":{"label":"Odkryj produkty","href":"/szukaj"},"cta_secondary":{"label":"Poznaj nas","href":"/o-nas"}}'::jsonb, 1, true),
  ('item_types_grid',   '{"title":"Po co dziś tu jesteś?","kicker":"Kategorie produktów","sub":"Filtruj od razu po typie rzeczy — nie po gatunku."}'::jsonb, 2, true),
  ('featured_products', '{"title":"Tydzień u nas: same dobre wybory","kicker":"Polecane przez Yoko & Yoshi","limit":5}'::jsonb, 3, true),
  ('shiba_callout',     '{"breed_slug":"shiba-inu"}'::jsonb, 4, true),
  ('articles',          '{"title":"Najnowsze poradniki","kicker":"Świeżo z dziennika","limit":3}'::jsonb, 5, true),
  ('newsletter',        '{}'::jsonb, 6, true)
on conflict do nothing;

-- NAVIGATION (default top-level)
insert into public.navigation_items (label, url, kind, sort_order, published) values
  ('Szarpaki & gryzaki', '/szukaj?type=szarpaki-gryzaki',   'item_type', 1, true),
  ('Piłki',              '/szukaj?type=pilki',              'item_type', 2, true),
  ('Trymery',            '/szukaj?type=trymery-szczotki',   'item_type', 3, true),
  ('Smycze',             '/szukaj?type=smycze-obroze',      'item_type', 4, true),
  ('Posłania',           '/szukaj?type=poslania',           'item_type', 5, true),
  ('Poradniki',          '/poradnik',                       'custom',    6, true)
on conflict do nothing;

-- SETTINGS
insert into public.settings (key, value) values
  ('public.site_name',        '"Yoko & Yoshi"'::jsonb),
  ('public.site_tagline',     '"Sklep #1 dla shibowiarzy w Polsce"'::jsonb),
  ('public.contact_email',    '"hej@yokoyoshi.pl"'::jsonb),
  ('public.affiliate_disclosure', '"Niektóre linki to linki partnerskie — jeśli kupisz przez nie, dostaniemy małą prowizję. Cena dla Ciebie się nie zmienia."'::jsonb),
  ('public.social.instagram', '"https://instagram.com/yokoyoshi"'::jsonb),
  ('admin.allegro_sync_enabled', 'false'::jsonb)
on conflict (key) do update set value = excluded.value;
