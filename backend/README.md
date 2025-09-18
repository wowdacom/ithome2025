# Backend Server with Clean Architecture

此專案是一個採用 Clean Architecture 設計模式的後端 API 伺服器，為部落格系統提供完整的 RESTful API 服務。

## 功能特色

- **完整 CRUD 操作**：文章的建立、讀取、更新、刪除
- **進階搜尋功能**：支援關鍵字、類別、日期區間的組合搜尋
- **前端後台管理**：直觀的 Web 介面，支援即時編輯和預覽
- **Clean Architecture**：嚴格的分層架構，易於測試和維護
- **多重資料來源**：支援 InMemory 和 Supabase 資料庫
- **完整測試覆蓋**：單元測試、整合測試、E2E 測試
- **TypeScript 開發**：型別安全和開發體驗最佳化
- **REST API**：標準化的 HTTP API，易於整合

## 技術棧

- **後端**：Node.js + Express.js + TypeScript
- **資料庫**：Supabase (PostgreSQL) / InMemory
- **前端**：Vanilla JavaScript + HTML5 + CSS3
- **測試**：Vitest + Supertest
- **建構**：TypeScript Compiler + npm scripts

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
# 安裝依賴
npm install

# 啟動開發伺服器 (預設 PORT=3000)
npm run dev

# 或直接執行 TypeScript (需要 tsx)
npm run start:dev
```

**開發模式功能：**

- API 伺服器：`http://localhost:3000`
- 前端後台：`http://localhost:3000/admin`
- 測試模式：設定 `DISABLE_AUTH=true` 跳過身份驗證

或建置後執行：

```powershell
npm run build
npm start
```

## API 端點

### 文章管理 API

- **建立文章**: `POST /api/articles`

  ```json
  { "title": "我的文章", "category": "旅行", "content": "文章內容..." }
  ```

- **取得所有文章**: `GET /api/articles`

- **依分類查詢**: `GET /api/articles/category/旅行`

- **依 ID 查詢**: `GET /api/articles/[id]`

- **更新文章**: `PUT /api/articles/[id]`

  ```json
  { "title": "更新標題", "content": "更新內容", "category": "科技" }
  ```

- **刪除文章**: `DELETE /api/articles/[id]`

- **進階搜尋**: `POST /api/articles/search`
  ```json
  {
    "keyword": "搜尋關鍵字",
    "category": "類別",
    "dateFrom": "2024-01-01",
    "dateTo": "2024-12-31"
  }
  ```

## 前端後台管理

專案包含完整的前端後台管理介面，提供文章的 CRUD 操作和搜尋功能。

### 啟動前端後台

1. 啟動 API 伺服器：

   ```powershell
   npm run dev
   ```

2. 開啟瀏覽器訪問：`http://localhost:3000/admin`

### 後台功能

- **文章列表**：顯示所有文章，支援分頁和排序
- **新增文章**：表單建立新文章，自動生成 slug
- **編輯文章**：即時編輯功能，支援 Markdown 預覽
- **刪除文章**：安全刪除確認機制
- **進階搜尋**：
  - 關鍵字搜尋（標題和內容）
  - 類別篩選
  - 日期區間篩選
  - 多條件組合搜尋

### 前端技術棧

- **純 JavaScript**：無框架依賴，輕量化設計
- **響應式設計**：支援桌面和行動裝置
- **即時預覽**：Markdown 內容即時預覽
- **友善介面**：直觀的操作流程和錯誤提示

## 測試

```powershell
# 執行所有測試
npm test

# 監控模式（開發時使用）
npm run test:watch

# 測試覆蓋率報告
npm run test:coverage
```

**測試策略：**

- **單元測試**：Domain 層和 Usecase 層邏輯
- **整合測試**：API 端點完整流程測試
- **Repository 測試**：資料存取層測試（包含 Supabase 整合）
- **E2E 測試**：前端後台完整操作流程

**測試環境設定：**

- 使用 InMemoryRepository 進行快速測試
- Supabase 整合測試需要有效的資料庫連線
- 設定 `DISABLE_AUTH=true` 跳過認證測試

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

### 已實現功能 ✅

- ✅ 完整 CRUD API
- ✅ 進階搜尋功能
- ✅ 前端後台管理介面
- ✅ 多重資料來源支援
- ✅ 完整測試覆蓋
- ✅ TypeScript 型別安全
- ✅ Clean Architecture 分層

### 建議新增功能 📋

**功能增強：**

- 文章標籤系統（多對多關聯）
- 文章狀態管理（草稿、已發布、封存）
- 圖片上傳和管理
- 文章評論系統
- SEO 優化（meta tags、sitemap）

**技術改進：**

- 身份認證與授權（JWT/OAuth）
- API 速率限制和快取
- 全文搜尋（ElasticSearch/PostgreSQL FTS）
- 檔案儲存（AWS S3/Cloudflare R2）
- 即時通知（WebSocket/Server-Sent Events）

**開發體驗：**

- OpenAPI/Swagger 文件
- GraphQL API 支援
- Docker 容器化部署
- CI/CD Pipeline（GitHub Actions）
- 監控和日誌系統（Prometheus/Grafana）

**前端升級：**

- React/Vue.js 重構
- 移動端 App（React Native）
- PWA 支援
- 即時編輯協作功能

## 使用 Supabase 做為資料來源

專案已提供 `SupabaseArticleRepository`（`src/data/SupabaseArticleRepository.ts`），具備向後相容性，支援不同的資料庫 schema 版本。

### 資料庫 Schema 設定

**基本版本（最低需求）：**

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

**完整版本（推薦）：**

```sql
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 自動更新 updated_at 的觸發器
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_articles_updated_at
  before update on articles
  for each row
  execute function update_updated_at_column();
```

### 向後相容性

Repository 自動偵測資料庫 schema 版本：

- **若資料庫有 `updated_at` 欄位**：使用完整功能
- **若資料庫缺少 `updated_at` 欄位**：自動降級，僅使用 `created_at`

這樣的設計確保：

- 既有資料庫無需升級即可使用
- 新資料庫可享受完整功能
- 測試環境和生產環境可有不同配置

### 切換到 Supabase

1. **建立 Supabase 專案**並設定上述 SQL schema

2. **啟用 Row Level Security：**

   ```sql
   alter table articles enable row level security;
   ```

3. **設定 Policy（依需求調整）：**

   ```sql
   -- 允許讀取所有文章
   create policy "Allow public read" on articles
     for select using (true);

   -- 允許匿名新增文章（測試用）
   create policy "Allow public insert" on articles
     for insert with check (true);

   -- 允許匿名更新文章（測試用）
   create policy "Allow public update" on articles
     for update using (true);

   -- 允許匿名刪除文章（測試用）
   create policy "Allow public delete" on articles
     for delete using (true);
   ```

4. **設定環境變數**：

   ```bash
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   # 可選：用於服務端操作
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. **修改容器配置** (`src/config/container.ts`)：

   ```typescript
   // 註解掉 InMemory 版本
   // const articleRepo = new InMemoryArticleRepositoryAsync();

   // 啟用 Supabase 版本
   const articleRepo = new SupabaseArticleRepository();
   ```

6. **重新啟動伺服器**：
   ```powershell
   npm run dev
   ```

錯誤處理說明：

- 若未提供 `SERVICE_ROLE_KEY`，Repository 會使用 public client；需確保 Policy 容許對應操作。
- 若插入 slug 重複，會丟出 `ValidationError('SLUG_TAKEN', '文章 slug 已存在')`。
- Repository 具備自動降級功能，相容不同的資料庫 schema 版本。

## 專案結構

```
src/
├── domain/              # 領域層：商業核心模型
│   ├── Article.ts       # 文章實體
│   └── errors/          # 領域錯誤定義
├── usecases/            # 應用層：商業邏輯服務
│   └── BlogService.ts   # 文章服務
├── data/                # 基礎設施層：資料存取
│   ├── AsyncArticleRepository.ts     # Repository 介面
│   ├── InMemoryArticleRepository.ts  # 記憶體實作
│   └── SupabaseArticleRepository.ts  # Supabase 實作
├── config/              # 配置管理
│   ├── container.ts     # 依賴注入容器
│   ├── env.ts          # 環境變數
│   └── supabase.ts     # Supabase 客戶端
└── presentation/        # 展示層：HTTP API
    └── http/
        ├── server.ts           # 伺服器啟動
        ├── controllers/        # HTTP 控制器
        ├── routes/            # 路由定義
        ├── middlewares/       # 中介軟體
        ├── dto/              # 資料傳輸物件
        └── public/           # 靜態檔案（前端後台）
```

## 貢獻指南

1. **Fork** 此專案
2. 建立功能分支：`git checkout -b feature/amazing-feature`
3. 遵循 **TDD 原則**：
   - 先寫失敗測試
   - 實作最少程式碼使測試通過
   - 重構改善程式碼品質
4. 確保所有測試通過：`npm test`
5. 提交變更：`git commit -m 'Add amazing feature'`
6. 推送分支：`git push origin feature/amazing-feature`
7. 建立 **Pull Request**

### 程式碼品質標準

- 遵循 Clean Architecture 分層原則
- 維持 100% 測試覆蓋率
- 使用 TypeScript 嚴格模式
- 遵循 SOLID 設計原則
- 保持函數純淨和單一職責

---

**Enjoy coding with Clean Architecture! 🚀**
