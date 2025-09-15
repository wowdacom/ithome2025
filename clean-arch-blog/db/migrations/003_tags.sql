-- 003_tags.sql
-- Tags 與文章關聯 (可選)
create table if not exists public.tags (
    id serial primary key,
    name text not null unique
);

create table if not exists public.article_tags (
    article_id uuid not null references public.articles(id) on delete cascade,
    tag_id int not null references public.tags(id) on delete cascade,
    primary key (article_id, tag_id)
);

create index if not exists article_tags_tag_idx on public.article_tags (tag_id);
