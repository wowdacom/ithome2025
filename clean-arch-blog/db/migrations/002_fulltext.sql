-- 002_fulltext.sql
-- 全文檢索欄位與觸發器 (可選)
alter table public.articles
  add column if not exists search_vector tsvector;

update public.articles
set search_vector = to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,''));

create or replace function public.articles_tsvector_update()
returns trigger as $$
begin
  new.search_vector := to_tsvector('simple', coalesce(new.title,'') || ' ' || coalesce(new.content,''));
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_articles_tsvector_update on public.articles;
create trigger trg_articles_tsvector_update
before insert or update on public.articles
for each row
execute function public.articles_tsvector_update();

create index if not exists articles_search_vector_idx on public.articles using gin (search_vector);
