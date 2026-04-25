-- ============================================================
-- Yoko & Yoshi — initial schema
-- ============================================================
-- Affiliate e-commerce + content platform. Public reads everything
-- where published = true. Admin role (in profiles) gets full
-- access. Service role bypasses RLS — use only from server-only code.
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- HELPER: updated_at trigger
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- HELPER: is_admin (used in RLS predicates)
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.has_role(check_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text = check_role
  );
$$;

-- ============================================================
-- AUTH / USERS
-- ============================================================

create type public.user_role as enum ('admin', 'editor', 'viewer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'viewer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at_profiles
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- TAXONOMY: species, categories, brands, item_types
-- ============================================================

create table public.species (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  hero_image_url text,
  seo_title text,
  seo_description text,
  og_image_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_species before update on public.species
for each row execute function public.set_updated_at();
create index species_published_sort_idx on public.species (published, sort_order);

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  species_id uuid references public.species(id) on delete cascade,
  parent_id uuid references public.categories(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  hero_image_url text,
  seo_title text,
  seo_description text,
  og_image_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  -- denormalized full path for fast resolver lookup, e.g. "psy/zabawki/szarpaki"
  path_cache text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (species_id, parent_id, slug)
);
create trigger set_updated_at_categories before update on public.categories
for each row execute function public.set_updated_at();
create index categories_species_parent_idx on public.categories (species_id, parent_id, sort_order);
create index categories_path_cache_idx on public.categories (path_cache);
create index categories_published_idx on public.categories (published);

create table public.brands (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  logo_url text,
  description text,
  website_url text,
  seo_title text,
  seo_description text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_brands before update on public.brands
for each row execute function public.set_updated_at();

create table public.item_types (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  icon_emoji text,
  soft_color_token text,
  count_cache int not null default 0,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_item_types before update on public.item_types
for each row execute function public.set_updated_at();
create index item_types_published_sort_idx on public.item_types (published, sort_order);

-- ============================================================
-- PRODUCTS
-- ============================================================

create type public.recommending_mascot as enum ('yoko', 'yoshi', 'both', 'none');

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  brand_id uuid references public.brands(id) on delete set null,
  short_description text,
  full_description text,
  own_recommendation text,
  recommending_mascot public.recommending_mascot not null default 'none',
  price_pln numeric(10, 2),
  price_old_pln numeric(10, 2),
  price_updated_at timestamptz,
  allegro_offer_id text unique,
  allegro_url text,
  allegro_synced_at timestamptz,
  ean text,
  sku text,
  weight_g int,
  rating numeric(2, 1),
  rating_count int not null default 0,
  specs jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  og_image_url text,
  is_featured boolean not null default false,
  is_recommended boolean not null default false,
  sort_score int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null
);
create trigger set_updated_at_products before update on public.products
for each row execute function public.set_updated_at();
create index products_published_featured_idx on public.products (published, is_featured);
create index products_published_recommended_idx on public.products (published, is_recommended);
create index products_published_sort_score_idx on public.products (published, sort_score desc);
create index products_allegro_synced_at_idx on public.products (allegro_synced_at);
create index products_specs_gin_idx on public.products using gin (specs);
create index products_name_trgm_idx on public.products using gin (name gin_trgm_ops);

create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);
create index product_categories_category_idx on public.product_categories (category_id);

create table public.product_item_types (
  product_id uuid not null references public.products(id) on delete cascade,
  item_type_id uuid not null references public.item_types(id) on delete cascade,
  primary key (product_id, item_type_id)
);
create index product_item_types_type_idx on public.product_item_types (item_type_id);

create table public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  width int,
  height int,
  blur_data_url text,
  created_at timestamptz not null default now()
);
create index product_images_product_sort_idx on public.product_images (product_id, sort_order);

create table public.product_faqs (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index product_faqs_product_sort_idx on public.product_faqs (product_id, sort_order);

create type public.related_kind as enum ('alternative', 'bundle');

create table public.product_related (
  product_id uuid not null references public.products(id) on delete cascade,
  related_product_id uuid not null references public.products(id) on delete cascade,
  kind public.related_kind not null default 'alternative',
  sort_order int not null default 0,
  primary key (product_id, related_product_id, kind),
  check (product_id <> related_product_id)
);

-- ============================================================
-- CONTENT: breeds, articles, pages
-- ============================================================

create table public.breeds (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  species_id uuid references public.species(id) on delete set null,
  pillar_content text, -- MDX
  quick_facts jsonb not null default '{}'::jsonb,
  hero_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  recommended_product_ids uuid[] not null default '{}'::uuid[],
  seo_title text,
  seo_description text,
  og_image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_breeds before update on public.breeds
for each row execute function public.set_updated_at();
create index breeds_species_published_idx on public.breeds (species_id, published);

create type public.article_category as enum (
  'zywienie', 'pielegnacja', 'zdrowie', 'rasy', 'akcesoria', 'inne'
);

create table public.articles (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text, -- MDX
  hero_image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  category public.article_category not null default 'inne',
  related_species_ids uuid[] not null default '{}'::uuid[],
  related_breed_ids uuid[] not null default '{}'::uuid[],
  reading_minutes int,
  view_count int not null default 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_articles before update on public.articles
for each row execute function public.set_updated_at();
create index articles_published_published_at_idx on public.articles (published, published_at desc);
create index articles_category_idx on public.articles (category);
create index articles_title_trgm_idx on public.articles using gin (title gin_trgm_ops);

create table public.article_products (
  article_id uuid not null references public.articles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int not null default 0,
  primary key (article_id, product_id)
);

create table public.pages (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  content text, -- MDX
  seo_title text,
  seo_description text,
  og_image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_pages before update on public.pages
for each row execute function public.set_updated_at();

-- ============================================================
-- LAYOUT: homepage_sections, navigation_items
-- ============================================================

create type public.homepage_section_kind as enum (
  'hero', 'species_grid', 'item_types_grid', 'featured_products',
  'shiba_callout', 'articles', 'newsletter', 'custom_html'
);

create table public.homepage_sections (
  id uuid primary key default uuid_generate_v4(),
  kind public.homepage_section_kind not null,
  config jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_homepage_sections before update on public.homepage_sections
for each row execute function public.set_updated_at();
create index homepage_sections_published_sort_idx on public.homepage_sections (published, sort_order);

create type public.nav_item_kind as enum ('species', 'category', 'article', 'item_type', 'custom');
create type public.nav_target as enum ('_self', '_blank');

create table public.navigation_items (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references public.navigation_items(id) on delete cascade,
  label text not null,
  url text,
  kind public.nav_item_kind not null default 'custom',
  entity_id uuid,
  sort_order int not null default 0,
  published boolean not null default true,
  target public.nav_target not null default '_self',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at_navigation_items before update on public.navigation_items
for each row execute function public.set_updated_at();
create index navigation_items_parent_sort_idx on public.navigation_items (parent_id, sort_order);

-- ============================================================
-- INTERACTION: newsletter, contact
-- ============================================================

create table public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  confirmed boolean not null default false,
  confirm_token text unique,
  subscribed_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  source text
);
create index newsletter_confirmed_idx on public.newsletter_subscribers (confirmed);

create type public.contact_status as enum ('new', 'in_progress', 'resolved', 'spam');

create table public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  status public.contact_status not null default 'new',
  ip_hash text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index contact_messages_status_created_idx on public.contact_messages (status, created_at desc);

-- ============================================================
-- TRACKING: allegro clicks (append-only, BRIN-indexed by date)
-- ============================================================

create table public.allegro_clicks (
  id bigserial primary key,
  product_id uuid references public.products(id) on delete set null,
  occurred_at timestamptz not null default now(),
  referrer_path text,
  user_agent_hash text,
  country_code text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);
create index allegro_clicks_occurred_at_brin on public.allegro_clicks using brin (occurred_at);
create index allegro_clicks_product_idx on public.allegro_clicks (product_id, occurred_at desc);

-- ============================================================
-- OPS: redirects, audit_log, settings
-- ============================================================

create table public.redirects (
  id uuid primary key default uuid_generate_v4(),
  source text not null unique,
  destination text not null,
  status_code int not null default 301 check (status_code in (301, 302, 307, 308)),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);
create trigger set_updated_at_redirects before update on public.redirects
for each row execute function public.set_updated_at();
create index redirects_source_hash on public.redirects using hash (source);
create index redirects_enabled_idx on public.redirects (enabled);

create table public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  diff jsonb,
  ip_hash text,
  occurred_at timestamptz not null default now()
);
create index audit_log_entity_idx on public.audit_log (entity_type, entity_id);
create index audit_log_actor_occurred_idx on public.audit_log (actor_id, occurred_at desc);
create index audit_log_occurred_at_brin on public.audit_log using brin (occurred_at);

create table public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on every table.
alter table public.profiles enable row level security;
alter table public.species enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.item_types enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_item_types enable row level security;
alter table public.product_images enable row level security;
alter table public.product_faqs enable row level security;
alter table public.product_related enable row level security;
alter table public.breeds enable row level security;
alter table public.articles enable row level security;
alter table public.article_products enable row level security;
alter table public.pages enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.navigation_items enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.allegro_clicks enable row level security;
alter table public.redirects enable row level security;
alter table public.audit_log enable row level security;
alter table public.settings enable row level security;

-- Profiles: users see/update only their own; admins see all
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles admin all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Public-readable content: published only; admin full access
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'species', 'categories', 'brands', 'item_types', 'products',
      'breeds', 'articles', 'pages', 'homepage_sections', 'navigation_items'
    ])
  loop
    execute format(
      'create policy "%1$s public read" on public.%1$I for select using (published = true)',
      t
    );
    execute format(
      'create policy "%1$s admin all" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end$$;

-- Join tables — readable iff parent is published-readable; mutated by admin
create policy "product_categories public read" on public.product_categories
  for select using (
    exists (select 1 from public.products p where p.id = product_id and p.published)
  );
create policy "product_categories admin all" on public.product_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product_item_types public read" on public.product_item_types
  for select using (
    exists (select 1 from public.products p where p.id = product_id and p.published)
  );
create policy "product_item_types admin all" on public.product_item_types
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product_images public read" on public.product_images
  for select using (
    exists (select 1 from public.products p where p.id = product_id and p.published)
  );
create policy "product_images admin all" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product_faqs public read" on public.product_faqs
  for select using (
    exists (select 1 from public.products p where p.id = product_id and p.published)
  );
create policy "product_faqs admin all" on public.product_faqs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product_related public read" on public.product_related
  for select using (
    exists (select 1 from public.products p where p.id = product_id and p.published)
    and exists (select 1 from public.products p2 where p2.id = related_product_id and p2.published)
  );
create policy "product_related admin all" on public.product_related
  for all using (public.is_admin()) with check (public.is_admin());

create policy "article_products public read" on public.article_products
  for select using (
    exists (select 1 from public.articles a where a.id = article_id and a.published)
  );
create policy "article_products admin all" on public.article_products
  for all using (public.is_admin()) with check (public.is_admin());

-- Newsletter: anonymous can insert (subscribe); only admin reads
create policy "newsletter anon insert" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter admin all" on public.newsletter_subscribers
  for all using (public.is_admin()) with check (public.is_admin());

-- Contact messages: anonymous can insert; only admin reads
create policy "contact anon insert" on public.contact_messages
  for insert with check (true);
create policy "contact admin all" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- Allegro clicks: anonymous can insert (track); only admin reads
create policy "allegro_clicks anon insert" on public.allegro_clicks
  for insert with check (true);
create policy "allegro_clicks admin read" on public.allegro_clicks
  for select using (public.is_admin());

-- Redirects: middleware needs read; admin manages
create policy "redirects public read enabled" on public.redirects
  for select using (enabled = true);
create policy "redirects admin all" on public.redirects
  for all using (public.is_admin()) with check (public.is_admin());

-- Audit log: only admin reads; insert via service role (bypasses RLS)
create policy "audit_log admin read" on public.audit_log
  for select using (public.is_admin());

-- Settings: public can read 'public.*' keys; admin full access
create policy "settings public read prefixed" on public.settings
  for select using (key like 'public.%');
create policy "settings admin all" on public.settings
  for all using (public.is_admin()) with check (public.is_admin());
