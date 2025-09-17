-- 新增 updated_at 欄位到現有 articles 資料表
alter table articles 
add column if not exists updated_at timestamptz default now();

-- 為現有記錄設定 updated_at 為 created_at
update articles 
set updated_at = created_at 
where updated_at is null;

-- 建立 trigger 自動更新 updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_articles_updated_at 
    before update on articles 
    for each row 
    execute procedure update_updated_at_column();

-- 建立索引以提升搜尋效能
create index if not exists idx_articles_category on articles(category);
create index if not exists idx_articles_created_at on articles(created_at);
create index if not exists idx_articles_title_content on articles using gin(to_tsvector('english', title || ' ' || content));