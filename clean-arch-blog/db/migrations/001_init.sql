-- 001_init.sql
-- 基礎 articles 表與索引、updated_at 觸發器
create extension if not exists pgcrypto; -- for gen_random_uuid()

create table if not exists public.articles (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    category text not null,
    content text not null,
    slug text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists articles_slug_uindex on public.articles (slug);
create index if not exists articles_category_created_at_idx on public.articles (category, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_articles_set_updated_at on public.articles;
create trigger trg_articles_set_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();
