# Clean Architecture Blog (Minimal Backend)

此專案示範以簡化的 Clean Architecture（Domain / Usecases / Infrastructure / Presentation）建立最小可運作的 Blog 後台 API。

## 架構分層

- Domain: 商業核心模型與錯誤 (`src/domain`)
- Usecases (Application): 商業規則服務 (`src/usecases`)
- Infrastructure: 資料存取實作 (`src/data`)
- Presentation (HTTP): Express API (`src/presentation/http`)

## 主要檔案

```
src/
  domain/
  usecases/
  data/
  config/
    container.ts        # 簡易 DI 組裝
    env.ts              # 環境變數
  presentation/http/
    server.ts           # 建立與啟動伺服器
    controllers/        # Controller (轉接 HTTP <-> Usecase)
    routes/             # 路由定義
    middlewares/        # 錯誤/404 等 middleware
    dto/                # DTO 與驗證
```

## 安裝與啟動

```powershell
npm install
npm run dev   # 啟動開發伺服器 (預設 PORT=3000)
```

或建置後執行：

```powershell
npm run build
npm start
```

## API 範例

- 建立文章: `POST /api/articles`
  ```json
  { "title": "我的文章", "category": "旅行" }
  ```
- 依分類查詢: `GET /api/articles/category/旅行`

## 測試

```powershell
npm test
```

## 安全與環境變數提醒（Supabase / API Key）

請務必注意：範例中的 `.env.example` 只是一個格式示意，內含的 key 不應在真實專案中直接使用，實際專案請：

1. 建立 `.env`：

```powershell
Copy-Item .env.example .env
# 修改為自己專案的 SUPABASE_URL / SUPABASE_ANON_KEY
# 不要填入 service role key 到前端會使用的環境
```

2. 確認 `.gitignore` 已忽略 `.env`（避免把真實 key 推上版本控制）。
3. `SUPABASE_SERVICE_ROLE_KEY` 僅能放在後端安全環境（永遠不要出現在瀏覽器端 bundle / 前端 console）。
4. 若需要在部署平台（例如 Vercel / Fly.io / Render）使用，改在平台的 Environment Variables 設定，不要硬編寫進程式碼。
5. 定期 Rotate：建議每 90 天旋轉一次 service role / anon key，並清查未使用的 key。
6. 權限最小化：

- 開啟 Row Level Security (RLS)
- 使用 Policy 限制匿名可讀/可寫範圍
- 若只讀場景可考慮建立專屬 read-only 角色 key（或使用 edge function 包裝）。

7. 日誌：避免把完整 key 印在 log（可只保留前後 4 碼協助排錯）。
8. PR / Code Review 時留意：

- 不要貼出 `SUPABASE_SERVICE_ROLE_KEY`
- 若誤傳，立刻在 Supabase Dashboard 重製該 key 並重新部署。

9. 腳本檢查：

- 可增加 `scripts/checkSecrets.ts` 做格式檢查（例如 URL 開頭 `https://`、Key 長度、是否含空白）。

10. CI/CD：

- 在 CI 中執行測試時只注入 anon key；整合需要寫入敏感資料的流程另行分離。

未來可擴充：

- 加入 Secret Scanning（例如 git-secrets / trufflehog）
- 加入 `npm run audit:secrets` 自動化檢查 commit 內容是否含 key pattern。

## 後續建議擴充

- 永久儲存：導入資料庫 (e.g. PostgreSQL + Prisma)
- 更完善驗證：使用 zod / class-validator
- 日誌：加入 pino 或 winston
- 認證：JWT / OAuth
- OpenAPI / Swagger 文件
- E2E 測試：使用 supertest
- CI Pipeline：GitHub Actions 自動測試

## 使用 Supabase 做為資料來源

專案已提供 `SupabaseArticleRepository`（`src/data/SupabaseArticleRepository.ts`），以及環境組態於 `src/config/supabase.ts`：

切換步驟：

1. 建立資料表（SQL 範例）：

```sql
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  slug text unique not null,
  created_at timestamptz default now()
);
```

2. 啟用 Row Level Security：

```sql
alter table articles enable row level security;
```

3. 視需求新增讀寫 Policy（僅示意）：

```sql
create policy "Allow read" on articles for select using ( true );
create policy "Allow insert anon" on articles for insert with check ( true );
```

4. 設定 `.env`：

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
# 如需 server 端批次或避免匿名插入，加入：
SUPABASE_SERVICE_ROLE_KEY=...
```

5. 修改 `src/config/container.ts`：

```ts
import { SupabaseArticleRepository } from "../data/SupabaseArticleRepository";
// const articleRepo = new InMemoryArticleRepositoryAsync();
const articleRepo = new SupabaseArticleRepository();
```

6. 重新啟動開發伺服器：

```powershell
npm run dev
```

錯誤處理說明：

- 若未提供 `SERVICE_ROLE_KEY`，Repository 會使用 public client；需確保 Policy 容許對應操作。
- 若插入 slug 重複，會丟出 `ValidationError('SLUG_TAKEN', '文章 slug 已存在')`。

測試策略建議：

- 單元測試仍使用 InMemory Repository（快速、可控）。
- 整合測試另開檔案使用 Supabase（可加 CI 條件：檢查必要 env 有值才執行）。

風險與緩解：

- 直接對 Supabase insert 無節流：可在 Service 增加 Rate Limit 或在 Edge Function 包裹。
- slug 產生規則目前簡化（中文保留）；若需 SEO 嚴格拼音可再加 transliteration。

未來擴充：

- 加入內容全文索引（pg_trgm / embeddings）
- 增加 `updated_at` 欄位並支援樂觀鎖（版本號）
- 導入快取層（例如 memory + tag 失效）

---

Enjoy hacking!
