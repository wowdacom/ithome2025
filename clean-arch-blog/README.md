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

## 後續建議擴充

- 永久儲存：導入資料庫 (e.g. PostgreSQL + Prisma)
- 更完善驗證：使用 zod / class-validator
- 日誌：加入 pino 或 winston
- 認證：JWT / OAuth
- OpenAPI / Swagger 文件
- E2E 測試：使用 supertest
- CI Pipeline：GitHub Actions 自動測試

---

Enjoy hacking!
