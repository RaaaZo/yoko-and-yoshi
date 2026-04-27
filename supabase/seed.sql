-- ============================================================
-- Yoko & Yoshi — seed data
-- ============================================================
-- Idempotent: uses ON CONFLICT to allow re-running.
-- Populates: 6 species, 12 item_types, full category trees for every
-- species, 1 breed (Shiba Inu flagship), ~100 products spread across
-- species (psy 25, koty 20, gryzonie 15, ptaki 12, ryby 15, gady 13),
-- 3 articles, default homepage_sections + navigation_items + settings.
-- Final block recomputes item_types.count_cache from product_item_types.
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

-- ITEM TYPES (12 — z designu homepage). count_cache liczone na końcu seedu.
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

-- ============================================================
-- CATEGORIES — full nested trees for every species
-- ============================================================

-- ----- PSY -----
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
    (v_psy, v_zabawki, 'szarpaki',     'Szarpaki & gryzaki',   1, true, 'psy/zabawki/szarpaki'),
    (v_psy, v_zabawki, 'pilki',        'Piłki',                2, true, 'psy/zabawki/pilki'),
    (v_psy, v_zabawki, 'interaktywne', 'Zabawki interaktywne', 3, true, 'psy/zabawki/interaktywne'),
    (v_psy, v_zabawki, 'plyszaki',     'Pluszaki',             4, true, 'psy/zabawki/plyszaki')
  on conflict (species_id, parent_id, slug) do nothing;

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache)
  values (v_psy, 'karma', 'Karma', 2, true, 'psy/karma')
  on conflict (species_id, parent_id, slug) do update set name = excluded.name returning id into v_karma;

  insert into public.categories (species_id, parent_id, slug, name, sort_order, published, path_cache) values
    (v_psy, v_karma, 'sucha',     'Karma sucha', 1, true, 'psy/karma/sucha'),
    (v_psy, v_karma, 'mokra',     'Karma mokra', 2, true, 'psy/karma/mokra'),
    (v_psy, v_karma, 'przysmaki', 'Przysmaki',   3, true, 'psy/karma/przysmaki')
  on conflict (species_id, parent_id, slug) do nothing;

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache) values
    (v_psy, 'akcesoria',    'Akcesoria',    3, true, 'psy/akcesoria'),
    (v_psy, 'pielegnacja',  'Pielęgnacja',  4, true, 'psy/pielegnacja'),
    (v_psy, 'poslania',     'Posłania',     5, true, 'psy/poslania'),
    (v_psy, 'transportery', 'Transportery', 6, true, 'psy/transportery'),
    (v_psy, 'ubranka',      'Ubranka',      7, true, 'psy/ubranka')
  on conflict (species_id, parent_id, slug) do nothing;
end$$;

-- ----- KOTY -----
do $$
declare
  v_koty uuid;
  v_zabawki uuid;
  v_karma uuid;
begin
  select id into v_koty from public.species where slug = 'koty';

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache)
  values (v_koty, 'zabawki', 'Zabawki', 1, true, 'koty/zabawki')
  on conflict (species_id, parent_id, slug) do update set name = excluded.name returning id into v_zabawki;

  insert into public.categories (species_id, parent_id, slug, name, sort_order, published, path_cache) values
    (v_koty, v_zabawki, 'wedki',      'Wędki',               1, true, 'koty/zabawki/wedki'),
    (v_koty, v_zabawki, 'kocimieta',  'Z kocimiętką',        2, true, 'koty/zabawki/kocimieta'),
    (v_koty, v_zabawki, 'myszki',     'Myszki',              3, true, 'koty/zabawki/myszki')
  on conflict (species_id, parent_id, slug) do nothing;

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache)
  values (v_koty, 'karma', 'Karma', 2, true, 'koty/karma')
  on conflict (species_id, parent_id, slug) do update set name = excluded.name returning id into v_karma;

  insert into public.categories (species_id, parent_id, slug, name, sort_order, published, path_cache) values
    (v_koty, v_karma, 'sucha',     'Karma sucha', 1, true, 'koty/karma/sucha'),
    (v_koty, v_karma, 'mokra',     'Karma mokra', 2, true, 'koty/karma/mokra'),
    (v_koty, v_karma, 'przysmaki', 'Przysmaki',   3, true, 'koty/karma/przysmaki')
  on conflict (species_id, parent_id, slug) do nothing;

  insert into public.categories (species_id, slug, name, sort_order, published, path_cache) values
    (v_koty, 'drapaki',      'Drapaki',      3, true, 'koty/drapaki'),
    (v_koty, 'kuwety',       'Kuwety',       4, true, 'koty/kuwety'),
    (v_koty, 'miski',        'Miski',        5, true, 'koty/miski'),
    (v_koty, 'transportery', 'Transportery', 6, true, 'koty/transportery'),
    (v_koty, 'pielegnacja',  'Pielęgnacja',  7, true, 'koty/pielegnacja')
  on conflict (species_id, parent_id, slug) do nothing;
end$$;

-- ----- GRYZONIE -----
do $$
declare v_gryzonie uuid;
begin
  select id into v_gryzonie from public.species where slug = 'gryzonie';
  insert into public.categories (species_id, slug, name, sort_order, published, path_cache) values
    (v_gryzonie, 'klatki',     'Klatki',      1, true, 'gryzonie/klatki'),
    (v_gryzonie, 'karma',      'Karma',       2, true, 'gryzonie/karma'),
    (v_gryzonie, 'akcesoria',  'Akcesoria',   3, true, 'gryzonie/akcesoria'),
    (v_gryzonie, 'zabawki',    'Zabawki',     4, true, 'gryzonie/zabawki'),
    (v_gryzonie, 'sciolka',    'Ściółka',     5, true, 'gryzonie/sciolka')
  on conflict (species_id, parent_id, slug) do nothing;
end$$;

-- ----- PTAKI -----
do $$
declare v_ptaki uuid;
begin
  select id into v_ptaki from public.species where slug = 'ptaki';
  insert into public.categories (species_id, slug, name, sort_order, published, path_cache) values
    (v_ptaki, 'klatki',     'Klatki',     1, true, 'ptaki/klatki'),
    (v_ptaki, 'karma',      'Karma',      2, true, 'ptaki/karma'),
    (v_ptaki, 'zerdki',     'Żerdki',     3, true, 'ptaki/zerdki'),
    (v_ptaki, 'zabawki',    'Zabawki',    4, true, 'ptaki/zabawki'),
    (v_ptaki, 'kapielnice', 'Kąpielnice', 5, true, 'ptaki/kapielnice')
  on conflict (species_id, parent_id, slug) do nothing;
end$$;

-- ----- RYBY -----
do $$
declare v_ryby uuid;
begin
  select id into v_ryby from public.species where slug = 'ryby';
  insert into public.categories (species_id, slug, name, sort_order, published, path_cache) values
    (v_ryby, 'filtry',       'Filtry',       1, true, 'ryby/filtry'),
    (v_ryby, 'karma',        'Karma',        2, true, 'ryby/karma'),
    (v_ryby, 'dekoracje',    'Dekoracje',    3, true, 'ryby/dekoracje'),
    (v_ryby, 'oswietlenie',  'Oświetlenie',  4, true, 'ryby/oswietlenie'),
    (v_ryby, 'podloze',      'Podłoże',      5, true, 'ryby/podloze')
  on conflict (species_id, parent_id, slug) do nothing;
end$$;

-- ----- GADY -----
do $$
declare v_gady uuid;
begin
  select id into v_gady from public.species where slug = 'gady';
  insert into public.categories (species_id, slug, name, sort_order, published, path_cache) values
    (v_gady, 'terraria',   'Terraria',    1, true, 'gady/terraria'),
    (v_gady, 'lampy-uvb',  'Lampy UVB',   2, true, 'gady/lampy-uvb'),
    (v_gady, 'karma',      'Karma',       3, true, 'gady/karma'),
    (v_gady, 'podloza',    'Podłoża',     4, true, 'gady/podloza'),
    (v_gady, 'akcesoria',  'Akcesoria',   5, true, 'gady/akcesoria')
  on conflict (species_id, parent_id, slug) do nothing;
end$$;

-- ============================================================
-- BREEDS — Shiba Inu flagship
-- ============================================================
do $$
declare
  v_psy uuid;
begin
  select id into v_psy from public.species where slug = 'psy';
  insert into public.breeds (slug, name, species_id, pillar_content, quick_facts, published, seo_title, seo_description) values (
    'shiba-inu',
    'Shiba Inu',
    v_psy,
    E'## Kompletny przewodnik dla nowego opiekuna\n\nShiba inu to japońska rasa primitywnych psów — niezależna, czujna, wyjątkowo czysta. Jeśli zastanawiasz się, czy to pies dla Ciebie — zacznij tutaj.\n\n### Charakter\n\nShiba ma silne osobowości. Są lojalne wobec rodziny, ale dystansują się od obcych. Słynne "shiba scream" to dramatyczny dźwięk frustracji — nie boli, ale potrafi zaskoczyć sąsiadów.\n\n### Pielęgnacja\n\nLinieją intensywnie dwa razy w roku. Inwestycja w dobry undercoat rake i odkurzacz to konieczność. Poza tym to rasa wyjątkowo czysta — same dbają o sierść.\n\n### Aktywność\n\nPotrzebują 1-2 godzin ruchu dziennie. Uwaga na off-leash recall — instynkt łowiecki bierze górę.',
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

-- ============================================================
-- PRODUCTS (~100, spread across species)
-- ============================================================
-- Format: each row 3-5 lines. ON CONFLICT updates name+price+rating to
-- allow tweaking copy via re-seed.
-- ============================================================

insert into public.products (
  slug, name, short_description, full_description, own_recommendation,
  recommending_mascot, price_pln, price_old_pln, rating, rating_count,
  allegro_url, is_featured, is_recommended, sort_score, published
) values

-- ===== PSY (25) =====
('szarpak-bawelniany-38cm',
 'Szarpak ze sznura bawełnianego, 38 cm',
 'Twardy szarpak dla średnich i dużych psów — czyści zęby, ratuje meble.',
 E'Sznur z surowej bawełny, ręcznie pleciony. Trzy supły dają cztery różne tekstury do gryzienia, które masują dziąsła i mechanicznie usuwają płytkę nazębną. Polecamy dla shib od 8 miesiąca, kiedy dorosłe zęby są już mocno osadzone.\n\nPraj w 30°C, susz na powietrzu — nie nadaje się do suszarki bębnowej.',
 'Lubię, kiedy szarpak jest twardy we właściwy sposób. Ten ma trzy supły — łapę do każdego z nich!',
 'yoko', 49.00, 69.00, 4.8, 192,
 'https://allegro.pl/listing?string=szarpak%20bawe%C5%82niany', true, true, 100, true),

('szarpak-z-piszczkiem-ringer',
 'Szarpak ringer z piszczkiem',
 'Pierścień + sznur, dwa motywy zabawy w jednym.',
 null, null,
 'both', 39.90, null, 4.6, 33,
 'https://allegro.pl/listing?string=szarpak%20ringer', false, false, 65, true),

('szarpak-skorzany-XL',
 'Szarpak skórzany XL z uchwytem',
 'Naturalna skóra bydlęca, 50 cm. Dla psów do 35 kg.',
 null, 'Drogi, ale nie do zniszczenia. Kupujesz raz na cały żywot psa.',
 'yoko', 89.00, null, 4.7, 41,
 'https://allegro.pl/listing?string=szarpak%20skorzany', false, true, 70, true),

('gryzak-jelen-rog',
 'Gryzak — róg jelenia naturalny M',
 'Twardy, długo żuje, bez sztucznych dodatków.',
 null, null,
 'yoko', 35.00, null, 4.5, 78,
 'https://allegro.pl/listing?string=rog%20jelenia%20psy', false, false, 55, true),

('pilka-gumowa-piszczek-7cm',
 'Piłka gumowa z piszczkiem, ø 7 cm',
 'Trwała guma, głośny piszczek — ulubiona zabawka aportu.',
 null, 'Piszczy! Każdy jeden raz. Uwielbiam.',
 'yoko', 29.90, null, 4.9, 88,
 'https://allegro.pl/listing?string=pilka%20gumowa%20piszczek', true, true, 95, true),

('pilka-tenisowa-3pak',
 'Piłki tenisowe 3-pak',
 'Klasyka aportu. Sprawdzą się w parku i w domu.',
 null, null,
 'yoko', 24.90, null, 4.4, 211,
 'https://allegro.pl/listing?string=pilki%20tenisowe%20psie', false, false, 60, true),

('pilka-kong-czerwona-L',
 'Piłka Kong czerwona L',
 'Niezniszczalna guma naturalna, można nadziać przysmakami.',
 null, null,
 'yoko', 49.00, null, 4.8, 156,
 'https://allegro.pl/listing?string=kong%20pilka%20L', false, true, 85, true),

('trymer-akumulatorowy-4-nakladki',
 'Trymer akumulatorowy z 4 nakładkami',
 'Cichy silnik, 4 grzebienie wymienne — radzi sobie z podszerstkiem shiby.',
 E'Akumulator litowo-jonowy, 90 minut pracy na pełnym ładowaniu. Ostrza ze stali nierdzewnej z powłoką tytanową. W zestawie cztery nakładki: 3, 6, 9, 12 mm.\n\nW sezonie linienia (wiosna, jesień) używamy 2-3 razy w tygodniu. Poza sezonem — raz na dwa tygodnie wystarczy.',
 'Mam wrażliwy brzuszek i delikatną skórę. Ten trymer nie szczypie, nie ciągnie. Daję mu pięć łap.',
 'yoshi', 189.00, null, 4.7, 64,
 'https://allegro.pl/listing?string=trymer%20akumulatorowy', false, true, 90, true),

('szczotka-furminator-m',
 'Furminator do podszerstka — rozmiar M',
 'Niezbędny w sezonie linienia. Skraca czas wyczesywania o połowę.',
 null, 'Ratunek na sezon linienia. Bez tego nie da się żyć z shibą.',
 'yoshi', 129.00, 159.00, 4.8, 312,
 'https://allegro.pl/listing?string=furminator%20m', true, true, 92, true),

('smycz-parciana-1-8m-regulowana',
 'Smycz parciana 1.8 m, regulowana',
 'Trzy długości: 1.0 / 1.4 / 1.8 m. Wytrzymały karabińczyk.',
 null, 'Krótka w mieście, długa w lesie. Przepinam dwoma palcami w biegu.',
 'yoko', 49.00, null, 4.7, 76,
 'https://allegro.pl/listing?string=smycz%20parciana', false, true, 80, true),

('smycz-flexi-5m',
 'Smycz automatyczna Flexi 5 m',
 'Linka 5 m, do 25 kg, hamulec jednoręczny.',
 null, null,
 'yoko', 119.00, null, 4.5, 142,
 'https://allegro.pl/listing?string=smycz%20flexi%205m', false, false, 72, true),

('smycz-tactical-2-5m',
 'Smycz taktyczna 2.5 m, paracord',
 'Wytrzymały paracord 1100 lbs, podwójny karabińczyk.',
 null, null,
 'yoko', 79.00, null, 4.6, 58,
 'https://allegro.pl/listing?string=smycz%20paracord', false, false, 68, true),

('poslanie-owalne-100x70',
 'Posłanie owalne pluszowe 100×70 cm',
 'Antyalergiczny pluszek, prany w 30°C, podstawa antypoślizgowa.',
 null, 'Tu śpię. Tu marzę. Tu układam plany. Wybieraj rozmiar o jeden większy niż wydaje Ci się potrzebny.',
 'yoshi', 159.00, null, 4.6, 142,
 'https://allegro.pl/listing?string=poslanie%20owalne', true, true, 88, true),

('poslanie-ortopedyczne-pamiec-ksztaltu',
 'Posłanie ortopedyczne — pianka memory 90×60',
 'Pianka z pamięcią kształtu, dla starszych psów i ras dużych.',
 null, null,
 'yoshi', 289.00, 349.00, 4.8, 89,
 'https://allegro.pl/listing?string=poslanie%20ortopedyczne%20pies', false, true, 78, true),

('legowisko-jaskinia-zimowa',
 'Legowisko-jaskinia zimowa M',
 'Zamknięta forma, ciepło, polecane zimą.',
 null, null,
 'yoshi', 119.00, null, 4.5, 41,
 'https://allegro.pl/listing?string=legowisko%20jaskinia', false, false, 62, true),

('miska-ceramiczna-1l',
 'Miska ceramiczna 1 L, antypoślizgowa',
 'Ciężka, stabilna, łatwa w czyszczeniu. Bez bisfenoli.',
 null, null,
 'yoshi', 39.00, null, 4.5, 51,
 'https://allegro.pl/listing?string=miska%20ceramiczna', false, false, 70, true),

('poidlo-fontanna-2l',
 'Poidło-fontanna 2 L z filtrem',
 'Ciche pompowanie, filtr węglowy w komplecie.',
 null, null,
 'yoshi', 159.00, null, 4.6, 78,
 'https://allegro.pl/listing?string=poidlo%20fontanna', false, true, 74, true),

('zabawka-puzzle-poziom-2',
 'Zabawka logiczna — puzzle poziom 2',
 'Pies otwiera klapki by zdobyć smaczek. Trening + zabawa.',
 null, null,
 'both', 79.00, null, 4.5, 27,
 'https://allegro.pl/listing?string=zabawka%20logiczna%20pies', false, false, 75, true),

('zabawka-puzzle-poziom-3',
 'Zabawka logiczna — puzzle poziom 3',
 'Wersja zaawansowana, dla psów które ogarnęły poziom 2.',
 null, null,
 'both', 99.00, null, 4.6, 19,
 'https://allegro.pl/listing?string=zabawka%20logiczna%20poziom%203', false, false, 73, true),

('kong-classic-czerwony',
 'Kong Classic czerwony — rozmiar M',
 'Klasyczna gruszka do nadziewania pasztetem lub przysmakami.',
 null, 'Mróź ją z masłem orzechowym wewnątrz — zajmie shibę na godzinę.',
 'yoko', 59.00, null, 4.9, 421,
 'https://allegro.pl/listing?string=kong%20classic%20m', true, true, 91, true),

('szampon-koja-skore',
 'Szampon kojący skórę 250 ml',
 'Owies + rumianek. Polecany przy podrażnieniach.',
 null, null,
 'yoshi', 39.00, null, 4.5, 67,
 'https://allegro.pl/listing?string=szampon%20kojacy%20pies', false, false, 60, true),

('balsam-na-laby-zimowy',
 'Balsam ochronny na łapy 50 ml',
 'Zimą chroni przed solą i mrozem. Naturalny wosk pszczeli.',
 null, null,
 'yoshi', 29.00, null, 4.6, 134,
 'https://allegro.pl/listing?string=balsam%20na%20lapy', false, false, 64, true),

('transporter-airline-m',
 'Transporter samolotowy M (do 8 kg)',
 'Spełnia normy IATA, kratownica wentylacyjna 360°.',
 null, null,
 'none', 269.00, null, 4.6, 88,
 'https://allegro.pl/listing?string=transporter%20iata%20m', false, false, 66, true),

('kurtka-zimowa-shiba-m',
 'Kurtka zimowa wodoodporna M',
 'Polar w środku, membrana 5000 mm. Idealna dla shib przy -10°C.',
 null, 'Mam dużo futra, ale przy mokrym śniegu i tak doceniam.',
 'yoshi', 99.00, 139.00, 4.4, 56,
 'https://allegro.pl/listing?string=kurtka%20zimowa%20pies%20m', false, false, 58, true),

('pas-bezpieczenstwa-do-auta',
 'Pas bezpieczeństwa do auta — szelki + smycz',
 'Mocowanie do trzpienia od pasa, certyfikat TÜV.',
 null, null,
 'none', 79.00, null, 4.7, 102,
 'https://allegro.pl/listing?string=pas%20bezpieczenstwa%20pies', false, false, 67, true),

-- ===== KOTY (20) =====
('wedka-piorka-naturalna',
 'Wędka z naturalnymi piórkami',
 'Drewniany trzonek, naturalne piórka kogucie.',
 null, null,
 'yoko', 25.00, null, 4.7, 156,
 'https://allegro.pl/listing?string=wedka%20kot%20piorka', false, true, 80, true),

('wedka-laser-LED',
 'Wędka z laserem LED',
 'Bezpieczny laser, dwie końcówki — wędka i piłka.',
 null, null,
 'yoko', 35.00, null, 4.5, 89,
 'https://allegro.pl/listing?string=zabawka%20laser%20kot', false, false, 65, true),

('wedka-mysz-na-sznurku',
 'Wędka — myszka na sznurku',
 'Klasyczna myszka, kocimiętka w środku.',
 null, null,
 'yoko', 18.00, null, 4.4, 234,
 'https://allegro.pl/listing?string=wedka%20mysz%20kot', false, false, 60, true),

('zabawka-kocimietka-poduszka',
 'Poduszka z kocimiętką',
 'Wypełniona suszoną kocimiętką, bezpieczna do gryzienia.',
 null, null,
 'yoko', 19.00, null, 4.7, 178,
 'https://allegro.pl/listing?string=poduszka%20kocimietka', false, true, 75, true),

('zabawka-pilka-kocimietka',
 'Piłka z kocimiętką (3-pak)',
 'Trzy piłki w różnych kolorach, kocimiętka w rdzeniu.',
 null, null,
 'yoko', 22.00, null, 4.5, 92,
 'https://allegro.pl/listing?string=pilka%20kocimietka', false, false, 62, true),

('myszka-pluszowa-3pak',
 'Myszki pluszowe 3-pak',
 'Wypełnione kocimiętką, pierzaste ogonki.',
 null, null,
 'yoko', 16.00, null, 4.3, 145,
 'https://allegro.pl/listing?string=myszki%20pluszowe%20kot', false, false, 55, true),

('myszka-elektryczna-ruchoma',
 'Myszka elektryczna na baterie',
 'Sama biegnie i obraca się. Rozrywa kocie nudy.',
 null, null,
 'yoko', 49.00, null, 4.4, 67,
 'https://allegro.pl/listing?string=myszka%20elektryczna%20kot', false, false, 64, true),

('karma-sucha-kot-acana-1-8kg',
 'Karma sucha dla kota — kurczak 1.8 kg',
 'Wysokoproteinowa, bez zbóż.',
 null, null,
 'yoshi', 89.00, null, 4.8, 412,
 'https://allegro.pl/listing?string=karma%20sucha%20kot%201.8kg', true, true, 88, true),

('karma-sucha-kot-rybna-1-5kg',
 'Karma sucha dla kota — łosoś 1.5 kg',
 'Świetna dla kotów wymagających. Omega-3.',
 null, null,
 'yoshi', 79.00, null, 4.7, 256,
 'https://allegro.pl/listing?string=karma%20sucha%20kot%20losos', false, true, 82, true),

('karma-sucha-kot-sterilizowane',
 'Karma sucha dla kotów sterylizowanych 1.5 kg',
 'Obniżona kaloryczność, wsparcie układu moczowego.',
 null, null,
 'yoshi', 89.00, null, 4.6, 178,
 'https://allegro.pl/listing?string=karma%20kot%20sterylizowany', false, false, 68, true),

('karma-mokra-kot-saszetki-12pak',
 'Karma mokra — saszetki 12-pak',
 'Cztery smaki, w sosie, 85 g każda.',
 null, null,
 'yoshi', 39.00, null, 4.7, 432,
 'https://allegro.pl/listing?string=karma%20mokra%20kot%20saszetki', false, true, 84, true),

('karma-mokra-kot-puszki-6pak',
 'Karma mokra — puszki 6-pak',
 'Pasztet z indyka, 100 g każda.',
 null, null,
 'yoshi', 32.00, null, 4.5, 198,
 'https://allegro.pl/listing?string=karma%20kot%20puszki', false, false, 70, true),

('karma-mokra-kotek-junior',
 'Karma mokra dla kociąt 4-pak',
 'Delikatny mus, dla kociąt 1-12 mies.',
 null, null,
 'yoshi', 24.00, null, 4.6, 87,
 'https://allegro.pl/listing?string=karma%20mokra%20kotek', false, false, 60, true),

('przysmaki-kot-sticks',
 'Przysmaki dla kota — sticks z łososiem',
 'Bez konserwantów, 30 g.',
 null, null,
 'yoshi', 12.00, null, 4.7, 256,
 'https://allegro.pl/listing?string=przysmaki%20kot%20sticks', false, false, 58, true),

('drapak-stojacy-1m',
 'Drapak stojący 1 m, sizal',
 'Stabilna podstawa, sznur sizalowy 8 mm.',
 null, null,
 'yoshi', 159.00, null, 4.6, 134,
 'https://allegro.pl/listing?string=drapak%20stojacy%20kot%201m', false, true, 82, true),

('drapak-z-domkiem-50cm',
 'Drapak z domkiem 50 cm',
 'Mały, kompaktowy, dla małych mieszkań.',
 null, null,
 'yoshi', 89.00, null, 4.4, 178,
 'https://allegro.pl/listing?string=drapak%20domek%20kot', false, false, 65, true),

('kuweta-zakryta-jumbo',
 'Kuweta zakryta z filtrem 56×46 cm',
 'Filtr węglowy łapie zapachy. Drzwiczki łatwe do zdjęcia.',
 null, null,
 'yoshi', 119.00, null, 4.6, 256,
 'https://allegro.pl/listing?string=kuweta%20zakryta%20kot', false, true, 78, true),

('kuweta-otwarta-z-rant',
 'Kuweta otwarta z wysokim rantem',
 'Wysoki rant — żwirek nie wylatuje na zewnątrz.',
 null, null,
 'yoshi', 49.00, null, 4.4, 145,
 'https://allegro.pl/listing?string=kuweta%20otwarta%20kot', false, false, 60, true),

('miska-podwojna-stal-kot',
 'Miska podwójna stalowa na stojaku',
 'Wysokość regulowana. Nie ślizga się.',
 null, null,
 'yoshi', 59.00, null, 4.5, 102,
 'https://allegro.pl/listing?string=miska%20podwojna%20kot', false, false, 64, true),

('transporter-kot-airline',
 'Transporter dla kota airline (do 6 kg)',
 'Spełnia normy IATA, miękkie boki.',
 null, null,
 'none', 199.00, null, 4.5, 88,
 'https://allegro.pl/listing?string=transporter%20kot', false, false, 62, true),

-- ===== GRYZONIE (15) =====
('klatka-krolik-XL',
 'Klatka dla królika XL 120×60',
 'Z odchylanym dachem, drabinka, miska.',
 null, null,
 'none', 359.00, null, 4.6, 78,
 'https://allegro.pl/listing?string=klatka%20krolik%20120cm', false, true, 75, true),

('klatka-swinka-90cm',
 'Klatka dla świnki 90 cm',
 'Dwa poziomy, plastikowa wanna, drewniany domek.',
 null, null,
 'none', 229.00, null, 4.5, 62,
 'https://allegro.pl/listing?string=klatka%20swinka%2090cm', false, false, 60, true),

('klatka-chomik-trzypoziomowa',
 'Klatka chomik trzypoziomowa',
 'Trzy poziomy, kółko 18 cm, miska, butelka.',
 null, null,
 'none', 159.00, null, 4.4, 145,
 'https://allegro.pl/listing?string=klatka%20chomik%20trzypoziomowa', false, false, 58, true),

('karma-dla-krolika-2kg',
 'Karma dla królika 2 kg',
 'Pełnoporcjowa, granulat z trawami.',
 null, null,
 'yoshi', 39.00, null, 4.7, 234,
 'https://allegro.pl/listing?string=karma%20krolik%202kg', false, true, 70, true),

('mieszanka-swinka-1kg',
 'Mieszanka dla świnki 1 kg',
 'Pełna witamin C, naturalne składniki.',
 null, null,
 'yoshi', 22.00, null, 4.6, 178,
 'https://allegro.pl/listing?string=karma%20swinka%201kg', false, false, 56, true),

('karma-szynszyl-1kg',
 'Karma dla szynszyla 1 kg',
 'Granulat + zioła. Niska zawartość cukrów.',
 null, null,
 'yoshi', 28.00, null, 4.5, 89,
 'https://allegro.pl/listing?string=karma%20szynszyl', false, false, 52, true),

('karma-chomik-500g',
 'Karma dla chomika 500 g',
 'Mieszanka ziaren + nasiona.',
 null, null,
 'yoshi', 14.00, null, 4.4, 256,
 'https://allegro.pl/listing?string=karma%20chomik', false, false, 50, true),

('sianko-timotka-2kg',
 'Sianko Timothy 2 kg',
 'Pierwszy zbiór, suszone na słońcu. Niezbędne dla królików i świnek.',
 null, null,
 'yoshi', 49.00, null, 4.8, 312,
 'https://allegro.pl/listing?string=sianko%20timothy%202kg', true, true, 76, true),

('butelka-do-picia-500ml',
 'Butelka z poidłem 500 ml',
 'Mocowanie do klatki, kulkowy zawór.',
 null, null,
 'yoshi', 19.00, null, 4.5, 423,
 'https://allegro.pl/listing?string=butelka%20gryzonie%20500ml', false, false, 55, true),

('miska-ceramiczna-mala',
 'Miska ceramiczna mała 200 ml',
 'Stabilna, łatwa do mycia.',
 null, null,
 'yoshi', 14.00, null, 4.4, 156,
 'https://allegro.pl/listing?string=miska%20ceramiczna%20gryzonie', false, false, 48, true),

('schronienie-domek-drewniany',
 'Domek drewniany dla gryzonia',
 'Nieimpregnowane drewno, wejście ø 5 cm.',
 null, null,
 'yoshi', 24.00, null, 4.6, 78,
 'https://allegro.pl/listing?string=domek%20drewniany%20gryzonie', false, false, 52, true),

('tunel-pleciony',
 'Tunel pleciony z wikliny',
 'Naturalny, bezpieczny do gryzienia.',
 null, null,
 'yoko', 18.00, null, 4.5, 134,
 'https://allegro.pl/listing?string=tunel%20wiklinowy%20gryzonie', false, false, 50, true),

('kolo-do-biegania-25cm',
 'Koło do biegania 25 cm',
 'Ciche, bezosiowe. Dla chomików i myszoskoczków.',
 null, null,
 'yoko', 39.00, null, 4.6, 198,
 'https://allegro.pl/listing?string=kolo%20biegania%20chomik', false, true, 68, true),

('gryzak-drewniany-mineraly',
 'Gryzak drewniany z minerałami',
 'Pomaga ścierać zęby. Wapń + miód.',
 null, null,
 'yoko', 9.00, null, 4.5, 312,
 'https://allegro.pl/listing?string=gryzak%20drewniany%20gryzonie', false, false, 45, true),

('hamak-zwisajacy',
 'Hamak zwisający dla szczura',
 'Polar, można prać. Dwa karabińczyki.',
 null, null,
 'yoshi', 29.00, null, 4.7, 56,
 'https://allegro.pl/listing?string=hamak%20szczur', false, false, 48, true),

-- ===== PTAKI (12) =====
('klatka-papuga-mala',
 'Klatka dla małej papugi 50 cm',
 'Pomalowana proszkowo, dwie żerdki, dwie miski.',
 null, null,
 'none', 189.00, null, 4.5, 102,
 'https://allegro.pl/listing?string=klatka%20papuga%2050cm', false, true, 70, true),

('klatka-kanarek-prostokatna',
 'Klatka dla kanarka prostokątna 40 cm',
 'Pełne wyposażenie startowe.',
 null, null,
 'none', 99.00, null, 4.4, 156,
 'https://allegro.pl/listing?string=klatka%20kanarek', false, false, 56, true),

('karma-dla-papugi-1kg',
 'Karma dla papugi mała 1 kg',
 'Mieszanka ziaren + suszone owoce.',
 null, null,
 'yoshi', 24.00, null, 4.6, 234,
 'https://allegro.pl/listing?string=karma%20papuga%201kg', false, true, 64, true),

('karma-dla-kanarka-500g',
 'Karma dla kanarka 500 g',
 'Witaminy A, D3, E. Z dodatkiem rzepiku.',
 null, null,
 'yoshi', 14.00, null, 4.5, 178,
 'https://allegro.pl/listing?string=karma%20kanarek', false, false, 50, true),

('mieszanka-egzotyczna-2kg',
 'Mieszanka dla papug egzotycznych 2 kg',
 'Słonecznik, proso, kukurydza, suszone owoce.',
 null, null,
 'yoshi', 39.00, null, 4.7, 145,
 'https://allegro.pl/listing?string=mieszanka%20papugi%20egzotyczne', false, true, 60, true),

('kolba-prosa',
 'Kolba prosa naturalna 100 g',
 'Suszona naturalnie, bez konserwantów.',
 null, null,
 'yoshi', 9.00, null, 4.6, 423,
 'https://allegro.pl/listing?string=kolba%20prosa', false, false, 48, true),

('zerdka-naturalna-30cm',
 'Żerdka naturalna 30 cm',
 'Drewno owocowe, ścieranie pazurków.',
 null, null,
 'none', 12.00, null, 4.5, 312,
 'https://allegro.pl/listing?string=zerdka%20naturalna%20ptak', false, false, 46, true),

('zerdka-cementowa',
 'Żerdka cementowa do ścierania pazurków',
 'Lekko ścierna, do umieszczenia przy karmidle.',
 null, null,
 'none', 14.00, null, 4.4, 156,
 'https://allegro.pl/listing?string=zerdka%20cementowa', false, false, 44, true),

('zabawka-luseczko',
 'Zabawka — lusterko z dzwoneczkami',
 'Dla papug i kanarków. Akrylowe lustro.',
 null, null,
 'yoko', 16.00, null, 4.4, 89,
 'https://allegro.pl/listing?string=zabawka%20lusterko%20papuga', false, false, 42, true),

('zabawka-dzwoneczek-papuga',
 'Zabawka z dzwoneczkiem papuga',
 'Sznur sizalowy + drewniane elementy.',
 null, null,
 'yoko', 18.00, null, 4.5, 67,
 'https://allegro.pl/listing?string=zabawka%20dzwoneczek%20papuga', false, false, 45, true),

('kapielnica-podwiesz',
 'Kąpielnica zewnętrzna do klatki',
 'Mocowana do drzwiczek. Plastik bezpieczny.',
 null, null,
 'yoshi', 19.00, null, 4.6, 178,
 'https://allegro.pl/listing?string=kapielnica%20ptak', false, false, 50, true),

('kapielnica-zewnetrzna',
 'Kąpielnica wewnętrzna',
 'Dla większych klatek, łatwa do umycia.',
 null, null,
 'yoshi', 22.00, null, 4.5, 102,
 'https://allegro.pl/listing?string=kapielnica%20ptak%20wewnetrzna', false, false, 48, true),

-- ===== RYBY (15) =====
('filtr-zewnetrzny-200l',
 'Filtr zewnętrzny do 200 L',
 'Pompa 1000 L/h, 4 koszyki na media filtracyjne.',
 null, null,
 'none', 459.00, null, 4.7, 156,
 'https://allegro.pl/listing?string=filtr%20zewnetrzny%20200l', false, true, 78, true),

('filtr-wewnetrzny-100l',
 'Filtr wewnętrzny do 100 L',
 'Cichy, łatwy montaż, regulacja przepływu.',
 null, null,
 'none', 119.00, null, 4.5, 234,
 'https://allegro.pl/listing?string=filtr%20wewnetrzny%20100l', false, false, 65, true),

('gabki-do-filtra-zestaw',
 'Gąbki do filtra — zestaw 4 sztuk',
 'Różne gęstości, mechaniczna + biologiczna filtracja.',
 null, null,
 'none', 39.00, null, 4.6, 178,
 'https://allegro.pl/listing?string=gabki%20do%20filtra%20akwarium', false, false, 50, true),

('granulat-cichlid-100g',
 'Granulat dla pielęgnic 100 g',
 'Wysoko białkowy, podkreśla ubarwienie.',
 null, null,
 'yoshi', 19.00, null, 4.7, 256,
 'https://allegro.pl/listing?string=granulat%20pielegnice', false, false, 56, true),

('platki-tetra-50g',
 'Płatki Tetra 50 g',
 'Klasyka. Dla większości ryb słodkowodnych.',
 null, null,
 'yoshi', 14.00, null, 4.6, 432,
 'https://allegro.pl/listing?string=platki%20tetra%2050g', false, true, 60, true),

('karma-mrozona-larvy',
 'Karma mrożona — larwy ochotki 100 g',
 'Świetne urozmaicenie diety.',
 null, null,
 'yoshi', 18.00, null, 4.7, 145,
 'https://allegro.pl/listing?string=larwy%20ochotki', false, false, 52, true),

('karma-glonowa-tablety',
 'Tabletki glonowe — 50 sztuk',
 'Dla zbrojników i innych ryb dennych.',
 null, null,
 'yoshi', 16.00, null, 4.5, 198,
 'https://allegro.pl/listing?string=tabletki%20glonowe%20zbrojnik', false, false, 48, true),

('karma-rybek-zywych',
 'Karma żywa — Artemia w słoiku 200 ml',
 'Bezpośrednio do akwarium, dla wymagających ryb.',
 null, null,
 'yoshi', 24.00, null, 4.4, 89,
 'https://allegro.pl/listing?string=artemia%20zywa', false, false, 50, true),

('zamek-akwariowy',
 'Zamek akwariowy — dekoracja 30 cm',
 'Bezpieczny, niefarbowane materiały.',
 null, null,
 'none', 79.00, null, 4.6, 234,
 'https://allegro.pl/listing?string=zamek%20akwariowy%20dekoracja', false, false, 45, true),

('drzewko-bonzai-akwariowe',
 'Drzewko bonsai akwariowe 25 cm',
 'Sztuczne, do delikatnych akwariów.',
 null, null,
 'none', 49.00, null, 4.5, 156,
 'https://allegro.pl/listing?string=drzewko%20bonsai%20akwarium', false, false, 42, true),

('kamien-naturalny-30cm',
 'Kamień naturalny do akwarium 30 cm',
 'Ciemna lawa, bezpieczna dla pH.',
 null, null,
 'none', 39.00, null, 4.5, 78,
 'https://allegro.pl/listing?string=kamien%20naturalny%20akwarium', false, false, 40, true),

('korzen-mopani-m',
 'Korzeń Mopani M (15-25 cm)',
 'Ciężki, naturalny, doda akwarium charakteru.',
 null, null,
 'none', 59.00, null, 4.7, 102,
 'https://allegro.pl/listing?string=korzen%20mopani%20akwarium', false, true, 64, true),

('lampa-LED-30cm',
 'Lampa LED 30 cm — 12 W',
 'Białe + niebieskie LED-y, regulacja jasności.',
 null, null,
 'none', 89.00, null, 4.6, 178,
 'https://allegro.pl/listing?string=lampa%20LED%20akwarium%2030cm', false, false, 56, true),

('lampa-roslinna-LED',
 'Lampa roślinna LED do akwarium 60 cm',
 'Pełne spektrum, wspiera fotosyntezę roślin.',
 null, null,
 'none', 199.00, null, 4.7, 67,
 'https://allegro.pl/listing?string=lampa%20roslinna%20LED', false, true, 60, true),

('oswietlenie-zegarowe',
 'Programator 24h — sterowanie oświetleniem',
 'Cyfrowy, automatyczny cykl dzień/noc.',
 null, null,
 'none', 69.00, null, 4.5, 134,
 'https://allegro.pl/listing?string=programator%20akwarium', false, false, 48, true),

-- ===== GADY (13) =====
('terrarium-szklane-60x40',
 'Terrarium szklane 60×40×40 cm',
 'Z wbudowaną wentylacją, otwierane od przodu.',
 null, null,
 'none', 459.00, null, 4.6, 78,
 'https://allegro.pl/listing?string=terrarium%2060x40x40', false, true, 72, true),

('terrarium-100x50-zestaw',
 'Terrarium 100×50 — zestaw startowy',
 'Z lampą UVB, miska, podłoże, schronienie.',
 null, null,
 'none', 899.00, null, 4.7, 41,
 'https://allegro.pl/listing?string=terrarium%20100x50%20zestaw', false, true, 78, true),

('lampa-UVB-10-zarówka',
 'Żarówka UVB 10.0 — 26 W',
 'Niezbędna dla agam i żółwi. Wymieniaj co 6 mies.',
 null, null,
 'none', 89.00, null, 4.7, 234,
 'https://allegro.pl/listing?string=zarowka%20UVB%2010', false, true, 70, true),

('lampa-grzewcza-50W',
 'Lampa grzewcza 50 W',
 'Tworzy gorący punkt w terrarium.',
 null, null,
 'none', 39.00, null, 4.6, 312,
 'https://allegro.pl/listing?string=lampa%20grzewcza%20terrarium', false, false, 60, true),

('opraw-lampy-z-kloszem',
 'Oprawka lampy z kloszem ceramicznym',
 'Bezpieczna do żarówek do 100 W. Z klipem.',
 null, null,
 'none', 79.00, null, 4.5, 178,
 'https://allegro.pl/listing?string=oprawka%20lampy%20terrarium', false, false, 56, true),

('karma-zywa-swierszcze',
 'Świerszcze żywe domowe — 50 sztuk',
 'Świeże, wysokoenergetyczne karmienie.',
 null, null,
 'yoshi', 25.00, null, 4.6, 156,
 'https://allegro.pl/listing?string=swierszcze%20zywe%20gad', false, false, 50, true),

('karma-mrozne-myszki',
 'Myszki mrożone — 5 sztuk',
 'Dla węży. Łatwe karmienie, brak ryzyka.',
 null, null,
 'yoshi', 19.00, null, 4.7, 89,
 'https://allegro.pl/listing?string=myszki%20mrozne%20wez', false, false, 48, true),

('suplement-wapnia-50g',
 'Suplement wapnia z D3 — 50 g',
 'Niezbędny dla agam i kameleonów.',
 null, null,
 'yoshi', 24.00, null, 4.7, 234,
 'https://allegro.pl/listing?string=wapno%20D3%20gad', false, false, 52, true),

('karma-zoltwie-zelowa',
 'Karma żelowa dla żółwi 250 g',
 'Łatwostrawna, witaminy A i E.',
 null, null,
 'yoshi', 29.00, null, 4.5, 102,
 'https://allegro.pl/listing?string=karma%20zelowa%20zolw', false, false, 46, true),

('podloze-koraowe-5L',
 'Podłoże korowe 5 L',
 'Dla kameleonów i żab. Wilgotne mikroklimaty.',
 null, null,
 'none', 24.00, null, 4.6, 178,
 'https://allegro.pl/listing?string=podloze%20korowe%20terrarium', false, false, 44, true),

('mata-trawiasta-do-terrarium',
 'Mata trawiasta do terrarium 60×40',
 'Łatwa do wymiany, bezpieczna dla agam.',
 null, null,
 'none', 19.00, null, 4.4, 67,
 'https://allegro.pl/listing?string=mata%20trawa%20terrarium', false, false, 40, true),

('poidlo-zoltwie',
 'Poidło dla żółwi — kamień naturalny',
 'Płaskie, antyrazlewne, pasuje pod lampę.',
 null, null,
 'yoshi', 22.00, null, 4.5, 134,
 'https://allegro.pl/listing?string=poidlo%20zolw', false, false, 42, true),

('schronienie-skala-XL',
 'Schronienie — sztuczna skała XL',
 'Dla agam i gekonów, naturalny wygląd.',
 null, null,
 'none', 49.00, null, 4.5, 89,
 'https://allegro.pl/listing?string=schronienie%20skala%20terrarium', false, false, 44, true)

on conflict (slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  own_recommendation = excluded.own_recommendation,
  price_pln = excluded.price_pln,
  rating = excluded.rating;

-- ============================================================
-- PRODUCT → CATEGORY (m2m). Maps each product to its leaf category.
-- ============================================================

-- helper macro: insert SELECT … WHERE p.slug = X AND c.path_cache = Y
-- Using one big UNION via VALUES tuple list for clarity.

with mapping(product_slug, category_path) as (values
  -- psy
  ('szarpak-bawelniany-38cm', 'psy/zabawki/szarpaki'),
  ('szarpak-z-piszczkiem-ringer', 'psy/zabawki/szarpaki'),
  ('szarpak-skorzany-XL', 'psy/zabawki/szarpaki'),
  ('gryzak-jelen-rog', 'psy/zabawki/szarpaki'),
  ('pilka-gumowa-piszczek-7cm', 'psy/zabawki/pilki'),
  ('pilka-tenisowa-3pak', 'psy/zabawki/pilki'),
  ('pilka-kong-czerwona-L', 'psy/zabawki/pilki'),
  ('zabawka-puzzle-poziom-2', 'psy/zabawki/interaktywne'),
  ('zabawka-puzzle-poziom-3', 'psy/zabawki/interaktywne'),
  ('kong-classic-czerwony', 'psy/zabawki/interaktywne'),
  ('trymer-akumulatorowy-4-nakladki', 'psy/pielegnacja'),
  ('szczotka-furminator-m', 'psy/pielegnacja'),
  ('szampon-koja-skore', 'psy/pielegnacja'),
  ('balsam-na-laby-zimowy', 'psy/pielegnacja'),
  ('smycz-parciana-1-8m-regulowana', 'psy/akcesoria'),
  ('smycz-flexi-5m', 'psy/akcesoria'),
  ('smycz-tactical-2-5m', 'psy/akcesoria'),
  ('miska-ceramiczna-1l', 'psy/akcesoria'),
  ('poidlo-fontanna-2l', 'psy/akcesoria'),
  ('pas-bezpieczenstwa-do-auta', 'psy/akcesoria'),
  ('poslanie-owalne-100x70', 'psy/poslania'),
  ('poslanie-ortopedyczne-pamiec-ksztaltu', 'psy/poslania'),
  ('legowisko-jaskinia-zimowa', 'psy/poslania'),
  ('transporter-airline-m', 'psy/transportery'),
  ('kurtka-zimowa-shiba-m', 'psy/ubranka'),
  -- koty
  ('wedka-piorka-naturalna', 'koty/zabawki/wedki'),
  ('wedka-laser-LED', 'koty/zabawki/wedki'),
  ('wedka-mysz-na-sznurku', 'koty/zabawki/wedki'),
  ('zabawka-kocimietka-poduszka', 'koty/zabawki/kocimieta'),
  ('zabawka-pilka-kocimietka', 'koty/zabawki/kocimieta'),
  ('myszka-pluszowa-3pak', 'koty/zabawki/myszki'),
  ('myszka-elektryczna-ruchoma', 'koty/zabawki/myszki'),
  ('karma-sucha-kot-acana-1-8kg', 'koty/karma/sucha'),
  ('karma-sucha-kot-rybna-1-5kg', 'koty/karma/sucha'),
  ('karma-sucha-kot-sterilizowane', 'koty/karma/sucha'),
  ('karma-mokra-kot-saszetki-12pak', 'koty/karma/mokra'),
  ('karma-mokra-kot-puszki-6pak', 'koty/karma/mokra'),
  ('karma-mokra-kotek-junior', 'koty/karma/mokra'),
  ('przysmaki-kot-sticks', 'koty/karma/przysmaki'),
  ('drapak-stojacy-1m', 'koty/drapaki'),
  ('drapak-z-domkiem-50cm', 'koty/drapaki'),
  ('kuweta-zakryta-jumbo', 'koty/kuwety'),
  ('kuweta-otwarta-z-rant', 'koty/kuwety'),
  ('miska-podwojna-stal-kot', 'koty/miski'),
  ('transporter-kot-airline', 'koty/transportery'),
  -- gryzonie
  ('klatka-krolik-XL', 'gryzonie/klatki'),
  ('klatka-swinka-90cm', 'gryzonie/klatki'),
  ('klatka-chomik-trzypoziomowa', 'gryzonie/klatki'),
  ('karma-dla-krolika-2kg', 'gryzonie/karma'),
  ('mieszanka-swinka-1kg', 'gryzonie/karma'),
  ('karma-szynszyl-1kg', 'gryzonie/karma'),
  ('karma-chomik-500g', 'gryzonie/karma'),
  ('sianko-timotka-2kg', 'gryzonie/karma'),
  ('butelka-do-picia-500ml', 'gryzonie/akcesoria'),
  ('miska-ceramiczna-mala', 'gryzonie/akcesoria'),
  ('schronienie-domek-drewniany', 'gryzonie/akcesoria'),
  ('tunel-pleciony', 'gryzonie/akcesoria'),
  ('kolo-do-biegania-25cm', 'gryzonie/zabawki'),
  ('gryzak-drewniany-mineraly', 'gryzonie/zabawki'),
  ('hamak-zwisajacy', 'gryzonie/zabawki'),
  -- ptaki
  ('klatka-papuga-mala', 'ptaki/klatki'),
  ('klatka-kanarek-prostokatna', 'ptaki/klatki'),
  ('karma-dla-papugi-1kg', 'ptaki/karma'),
  ('karma-dla-kanarka-500g', 'ptaki/karma'),
  ('mieszanka-egzotyczna-2kg', 'ptaki/karma'),
  ('kolba-prosa', 'ptaki/karma'),
  ('zerdka-naturalna-30cm', 'ptaki/zerdki'),
  ('zerdka-cementowa', 'ptaki/zerdki'),
  ('zabawka-luseczko', 'ptaki/zabawki'),
  ('zabawka-dzwoneczek-papuga', 'ptaki/zabawki'),
  ('kapielnica-podwiesz', 'ptaki/kapielnice'),
  ('kapielnica-zewnetrzna', 'ptaki/kapielnice'),
  -- ryby
  ('filtr-zewnetrzny-200l', 'ryby/filtry'),
  ('filtr-wewnetrzny-100l', 'ryby/filtry'),
  ('gabki-do-filtra-zestaw', 'ryby/filtry'),
  ('granulat-cichlid-100g', 'ryby/karma'),
  ('platki-tetra-50g', 'ryby/karma'),
  ('karma-mrozona-larvy', 'ryby/karma'),
  ('karma-glonowa-tablety', 'ryby/karma'),
  ('karma-rybek-zywych', 'ryby/karma'),
  ('zamek-akwariowy', 'ryby/dekoracje'),
  ('drzewko-bonzai-akwariowe', 'ryby/dekoracje'),
  ('kamien-naturalny-30cm', 'ryby/dekoracje'),
  ('korzen-mopani-m', 'ryby/dekoracje'),
  ('lampa-LED-30cm', 'ryby/oswietlenie'),
  ('lampa-roslinna-LED', 'ryby/oswietlenie'),
  ('oswietlenie-zegarowe', 'ryby/oswietlenie'),
  -- gady
  ('terrarium-szklane-60x40', 'gady/terraria'),
  ('terrarium-100x50-zestaw', 'gady/terraria'),
  ('lampa-UVB-10-zarówka', 'gady/lampy-uvb'),
  ('lampa-grzewcza-50W', 'gady/lampy-uvb'),
  ('opraw-lampy-z-kloszem', 'gady/lampy-uvb'),
  ('karma-zywa-swierszcze', 'gady/karma'),
  ('karma-mrozne-myszki', 'gady/karma'),
  ('suplement-wapnia-50g', 'gady/karma'),
  ('karma-zoltwie-zelowa', 'gady/karma'),
  ('podloze-koraowe-5L', 'gady/podloza'),
  ('mata-trawiasta-do-terrarium', 'gady/podloza'),
  ('poidlo-zoltwie', 'gady/akcesoria'),
  ('schronienie-skala-XL', 'gady/akcesoria')
)
insert into public.product_categories (product_id, category_id)
select p.id, c.id
from mapping m
join public.products p on p.slug = m.product_slug
join public.categories c on c.path_cache = m.category_path
on conflict do nothing;

-- ============================================================
-- PRODUCT → ITEM_TYPE (m2m). Cross-species buckets that match
-- the 12 tiles on homepage. Not every product has an item type —
-- klatki / terraria / dekoracje akwariowe etc. are skipped.
-- ============================================================

with mapping(product_slug, item_type_slug) as (values
  -- szarpaki-gryzaki
  ('szarpak-bawelniany-38cm', 'szarpaki-gryzaki'),
  ('szarpak-z-piszczkiem-ringer', 'szarpaki-gryzaki'),
  ('szarpak-skorzany-XL', 'szarpaki-gryzaki'),
  ('gryzak-jelen-rog', 'szarpaki-gryzaki'),
  -- pilki
  ('pilka-gumowa-piszczek-7cm', 'pilki'),
  ('pilka-tenisowa-3pak', 'pilki'),
  ('pilka-kong-czerwona-L', 'pilki'),
  -- trymery-szczotki
  ('trymer-akumulatorowy-4-nakladki', 'trymery-szczotki'),
  ('szczotka-furminator-m', 'trymery-szczotki'),
  -- smycze-obroze
  ('smycz-parciana-1-8m-regulowana', 'smycze-obroze'),
  ('smycz-flexi-5m', 'smycze-obroze'),
  ('smycz-tactical-2-5m', 'smycze-obroze'),
  -- poslania
  ('poslanie-owalne-100x70', 'poslania'),
  ('poslanie-ortopedyczne-pamiec-ksztaltu', 'poslania'),
  ('legowisko-jaskinia-zimowa', 'poslania'),
  ('drapak-stojacy-1m', 'poslania'),
  ('drapak-z-domkiem-50cm', 'poslania'),
  ('hamak-zwisajacy', 'poslania'),
  -- transportery
  ('transporter-airline-m', 'transportery'),
  ('transporter-kot-airline', 'transportery'),
  -- miski-poidla
  ('miska-ceramiczna-1l', 'miski-poidla'),
  ('poidlo-fontanna-2l', 'miski-poidla'),
  ('miska-podwojna-stal-kot', 'miski-poidla'),
  ('miska-ceramiczna-mala', 'miski-poidla'),
  ('butelka-do-picia-500ml', 'miski-poidla'),
  ('poidlo-zoltwie', 'miski-poidla'),
  -- pielegnacja
  ('szampon-koja-skore', 'pielegnacja'),
  ('balsam-na-laby-zimowy', 'pielegnacja'),
  ('kapielnica-podwiesz', 'pielegnacja'),
  ('kapielnica-zewnetrzna', 'pielegnacja'),
  -- zabawki-interaktywne
  ('zabawka-puzzle-poziom-2', 'zabawki-interaktywne'),
  ('zabawka-puzzle-poziom-3', 'zabawki-interaktywne'),
  ('kong-classic-czerwony', 'zabawki-interaktywne'),
  ('myszka-elektryczna-ruchoma', 'zabawki-interaktywne'),
  ('wedka-laser-LED', 'zabawki-interaktywne'),
  ('kolo-do-biegania-25cm', 'zabawki-interaktywne'),
  ('zabawka-luseczko', 'zabawki-interaktywne'),
  ('zabawka-dzwoneczek-papuga', 'zabawki-interaktywne'),
  -- ubranka
  ('kurtka-zimowa-shiba-m', 'ubranka'),
  -- akcesoria-podrozne
  ('pas-bezpieczenstwa-do-auta', 'akcesoria-podrozne')
)
insert into public.product_item_types (product_id, item_type_id)
select p.id, it.id
from mapping m
join public.products p on p.slug = m.product_slug
join public.item_types it on it.slug = m.item_type_slug
on conflict do nothing;

-- ============================================================
-- ARTICLES (3 examples) — full markdown bodies
-- ============================================================
insert into public.articles (slug, title, excerpt, content, category, reading_minutes, published, published_at, seo_title, seo_description) values
  ('szarpak-dla-shiby-jak-wybrac',
   'Szarpak dla shiby — jak wybrać taki, który przeżyje',
   'Mocne zgryzy, intensywny gryz, sezon ekstremalnej zabawy. 4 cechy, na które patrzymy zanim coś polecimy.',
   E'## Wstęp\n\nShiby gryzą inaczej niż większość psów. Nie chodzi tylko o siłę — chodzi o uporczywość. Standardowy szarpak z marketu wytrzymuje u shiby średnio 2 tygodnie. My szukamy takich, które wytrzymują pół roku.\n\n### Cecha 1: surowiec\n\nSzukamy bawełny lub konopi, nie syntetyków. Włókna naturalne wystrzępiają się stopniowo, syntetyczne łamią się ostrymi krawędziami — mogą zranić jamę ustną.\n\n### Cecha 2: pleciony, nie skręcany\n\nPlecione szarpaki są 3-4 razy bardziej wytrzymałe niż skręcane.\n\n### Cecha 3: średnica min. 14 mm\n\nCieńsze rozpadają się szybko. Grubsze wymagają większego kąta gryzienia, co utrudnia gryzienie tylnymi zębami i koncentruje siłę na siekaczach.\n\n### Cecha 4: bez impregnacji\n\nWiele szarpaków jest impregnowanych "smakiem mięsa". Te dodatki są niejadalne i drażnią żołądek.',
   'akcesoria', 7, true, now(),
   'Szarpak dla shiby — jak wybrać dobry sznur',
   'Mocne zgryzy + zabawowy temperament shiby = krótki żywot szarpaka. Pokazujemy, na co patrzeć przy zakupie.'),

  ('linienie-shiby-4-strategie',
   'Linienie shiby: 4 strategie, które naprawdę działają',
   'Dwa razy w roku z shiby leci futra na koc. Co robimy by przeżyć ten okres bez nerwówki.',
   E'## Strategia 1 — undercoat rake\n\nFurminator albo grzebień Mars Coat King. Nie szczotki dziubate — gładkie, równo wybierające podszerstek. Codziennie 5 minut przez 4 tygodnie sezonu.\n\n## Strategia 2 — kąpiel z odżywką wygładzającą\n\nRaz na 2 tygodnie w sezonie. Odżywka rozluźnia martwe włosy, które potem łatwiej wybierzesz szczotką.\n\n## Strategia 3 — odkurzacz z końcówką dla zwierząt\n\nTo nie zastępuje wyczesywania, ale skraca dochodzenie do siebie po sesji szczotkowania.\n\n## Strategia 4 — diet z omega-3\n\nDobry tłuszcz w karmie sprawia, że nowy włos rośnie szybciej i mocniej trzyma się w mieszku.',
   'pielegnacja', 6, true, now(),
   'Linienie shiby — 4 sprawdzone strategie',
   'Sezon linienia shiby trwa 4-6 tygodni. Cztery strategie, które ograniczają stratę sierści w domu.'),

  ('shiba-inu-przewodnik-nowego-opiekuna',
   'Shiba inu — kompletny przewodnik dla nowego opiekuna',
   'Wszystko, co warto wiedzieć przed adopcją: charakter, pielęgnacja, aktywność, koszt utrzymania.',
   E'## Co musisz wiedzieć\n\nShiba to nie labrador. To pies samoistny, z silną wolą, czujny i niezależny. Jeśli marzysz o psie, który będzie chodził za Tobą jak cień — shiba nie jest dla Ciebie.\n\n## Charakter\n\nShiby są lojalne, ale nie nachalne. Witają Cię w drzwiach radośnie, potem wracają do swoich spraw. Nie obrażą się, jeśli nie zwracasz na nie uwagi przez godzinę.\n\n## Aktywność\n\n1-2 godziny ruchu dziennie. W tym minimum 30 minut intensywnego (bieg za zabawką, plac zabaw, agility).\n\n## Koszt\n\nMiesięcznie: ~400-700 zł (karma + akcesoria + ubezpieczenie). Plus jednorazowe: szczepienia, kastracja, akcesoria startowe.',
   'rasy', 14, true, now(),
   'Shiba Inu — przewodnik dla nowego opiekuna',
   'Pełen przewodnik po shibie: charakter, pielęgnacja, aktywność, żywienie, koszt. Od opiekunów Yoko i Yoshi.')
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  published = excluded.published;

-- ============================================================
-- HOMEPAGE SECTIONS (default order)
-- ============================================================
insert into public.homepage_sections (kind, config, sort_order, published) values
  ('hero',              '{"badge":"Akcesoria · zabawki · pielęgnacja","headline":"Zabawki, pielęgnacja i wszystko poza miską.","cta_primary":{"label":"Odkryj produkty","href":"/zwierzaki/psy"},"cta_secondary":{"label":"Poznaj nas","href":"/o-nas"}}'::jsonb, 1, true),
  ('item_types_grid',   '{"title":"Po co dziś tu jesteś?","kicker":"Kategorie produktów","sub":"Filtruj od razu po typie rzeczy — nie po gatunku."}'::jsonb, 2, true),
  ('featured_products', '{"title":"Tydzień u nas: same dobre wybory","kicker":"Polecane przez Yoko & Yoshi","limit":5}'::jsonb, 3, true),
  ('shiba_callout',     '{"breed_slug":"shiba-inu"}'::jsonb, 4, true),
  ('articles',          '{"title":"Najnowsze poradniki","kicker":"Świeżo z dziennika","limit":3}'::jsonb, 5, true),
  ('newsletter',        '{}'::jsonb, 6, true)
on conflict do nothing;

-- ============================================================
-- NAVIGATION (header top-level)
-- ============================================================
insert into public.navigation_items (label, url, kind, sort_order, published) values
  ('Szarpaki & gryzaki', '/typ/szarpaki-gryzaki', 'item_type', 1, true),
  ('Piłki',              '/typ/pilki',            'item_type', 2, true),
  ('Trymery',            '/typ/trymery-szczotki', 'item_type', 3, true),
  ('Smycze',             '/typ/smycze-obroze',    'item_type', 4, true),
  ('Posłania',           '/typ/poslania',         'item_type', 5, true),
  ('Poradniki',          '/poradnik',             'custom',    6, true)
on conflict do nothing;

-- ============================================================
-- SETTINGS
-- ============================================================
insert into public.settings (key, value) values
  ('public.site_name',        '"Yoko & Yoshi"'::jsonb),
  ('public.site_tagline',     '"Sklep #1 dla shibowiarzy w Polsce"'::jsonb),
  ('public.contact_email',    '"hej@yokoyoshi.pl"'::jsonb),
  ('public.affiliate_disclosure', '"Niektóre linki to linki partnerskie — jeśli kupisz przez nie, dostaniemy małą prowizję. Cena dla Ciebie się nie zmienia."'::jsonb),
  ('public.social.instagram', '"https://instagram.com/yokoyoshi"'::jsonb),
  ('admin.allegro_sync_enabled', 'false'::jsonb)
on conflict (key) do update set value = excluded.value;

-- ============================================================
-- count_cache rebuild for item_types
-- ============================================================
update public.item_types
set count_cache = (
  select count(*) from public.product_item_types
  where item_type_id = item_types.id
);
