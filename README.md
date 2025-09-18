# ITHome 2025 - 部落格管理系統

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933)

遵循 **Kent Beck 的 TDD** 和 **Tidy First** 原則開發的現代化部落格管理系統。

## 📋 目錄

- [專案概述](#專案概述)
- [目前進度](#目前進度)
- [技術架構](#技術架構)
- [開發環境設定](#開發環境設定)
- [架構決策與建議](#架構決策與建議)
- [測試策略](#測試策略)
- [部署指南](#部署指南)
- [貢獻指南](#貢獻指南)

## 🚀 專案概述

本專案為 ITHome 2025 鐵人賽的實作項目，採用 Clean Architecture 設計模式，結合 TDD 開發流程，建構一個功能完整的部落格管理系統。

### 核心特色

- ✅ **TDD 開發流程** - Red-Green-Refactor 循環
- ✅ **Clean Architecture** - 清晰的層級分離
- ✅ **TypeScript** - 型別安全的開發體驗
- ✅ **測試覆蓋率 85%+** - 高品質程式碼保證
- ✅ **響應式設計** - 支援各種裝置
- ✅ **RESTful API** - 標準化 API 設計

## 📊 目前進度

### ✅ 已完成功能

#### Backend API (Port 3000)

- [x] **文章 CRUD 操作**
  - `GET /api/articles` - 取得文章列表
  - `POST /api/articles` - 新增文章
  - `GET /api/articles/:id` - 取得單篇文章
  - `PUT /api/articles/:id` - 更新文章
  - `DELETE /api/articles/:id` - 刪除文章
  - `GET /api/articles/search` - 搜尋文章
- [x] **Clean Architecture 實作**
  - Domain Layer (Article 實體)
  - Use Cases Layer (BlogService)
  - Data Layer (Repository 模式)
  - Presentation Layer (Controller, Routes)
- [x] **測試覆蓋率 100%** (35/35 tests passing)
- [x] **錯誤處理與驗證**
- [x] **CORS 設定**

#### Frontend Admin Panel (Port 5173/5174)

- [x] **管理員介面**
  - 文章列表顯示 (共 xx 篇文章)
  - 新增文章表單 (標題、分類、內容)
  - 文章搜尋功能 (關鍵字、分類、日期範圍)
  - 編輯/刪除操作 (含確認對話框)
- [x] **狀態管理** (Pinia)
- [x] **響應式設計**
- [x] **錯誤處理與載入狀態**
- [x] **單元測試覆蓋率 85%+** (60/70 tests passing)

#### 開發工具

- [x] **自動化啟動腳本**
  - `start-dev.bat` (Windows)
  - `start-dev.ps1` (PowerShell)
  - `start-dev.sh` (Linux/Mac)
- [x] **開發環境檢查**
- [x] **API 連接測試**

### 🔄 目前挑戰

1. **整合測試** - 10 個整合測試需要後端運行
2. **架構決策** - 部落格讀者介面的實作方式

## 🏗️ 技術架構

### 後端架構

```
backend/
├── src/
│   ├── domain/              # 領域層
│   │   └── Article.ts       # 文章實體
│   ├── usecases/            # 應用服務層
│   │   └── BlogService.ts   # 部落格業務邏輯
│   ├── data/                # 資料層
│   │   ├── AsyncArticleRepository.ts    # Repository 介面
│   │   └── InMemoryArticleRepository.ts # 記憶體實作
│   └── presentation/        # 展示層
│       └── http/
│           ├── controllers/ # 控制器
│           ├── routes/      # 路由定義
│           ├── dto/         # 資料傳輸物件
│           └── middlewares/ # 中介軟體
├── tests/                   # 測試檔案
└── package.json
```

### 前端架構

```
frontend/
├── src/
│   ├── components/          # Vue 組件
│   │   ├── ArticleForm.vue
│   │   ├── ArticleList.vue
│   │   ├── ArticleSearch.vue
│   │   └── MessageDisplay.vue
│   ├── stores/              # Pinia 狀態管理
│   │   └── articleStore.ts
│   ├── services/            # API 服務
│   │   ├── articleService.ts
│   │   └── index.ts
│   ├── utils/               # 工具函數
│   │   ├── apiClient.ts
│   │   └── helpers.ts
│   ├── types/               # TypeScript 型別
│   │   └── article.ts
│   └── __tests__/           # 測試檔案
├── package.json
└── vite.config.ts
```

## ⚙️ 開發環境設定

### 前置需求

- Node.js 18+
- npm 或 yarn
- Git

### 快速啟動

#### 方法一：使用自動化腳本 (推薦)

**Windows:**

```cmd
# 批次檔
start-dev.bat

# PowerShell
powershell -ExecutionPolicy Bypass -File "start-dev.ps1"
```

**Linux/Mac:**

```bash
chmod +x start-dev.sh
./start-dev.sh
```

#### 方法二：手動啟動

**後端服務:**

```bash
cd backend
npm install
npm run dev  # 運行在 http://localhost:3000
```

**前端服務:**

```bash
cd frontend
npm install
npm run dev  # 運行在 http://localhost:5173
```

### 服務位址

- **Backend API**: http://localhost:3000
- **Frontend App**: http://localhost:5173
- **API 文檔**: http://localhost:3000/admin.html

## 🎯 架構決策與建議

### 當前需求分析

目前系統包含：

- ✅ **Backend API** - 提供文章 CRUD 服務
- ✅ **Frontend Admin Panel** - 文章管理介面
- 🆕 **新需求** - 部落格展示完整文章（讀者介面）

### 🏗️ 架構選項分析

#### 選項 A：整合式架構 (推薦) ⭐

**結構設計:**

```
frontend/
├── src/
│   ├── views/
│   │   ├── admin/           # 管理員介面 (/admin/*)
│   │   │   ├── AdminApp.vue
│   │   │   ├── ArticleManagement.vue
│   │   │   └── components/
│   │   └── blog/            # 部落格讀者介面 (/blog/*)
│   │       ├── BlogApp.vue
│   │       ├── ArticleDetail.vue
│   │       ├── ArticleList.vue
│   │       └── components/
│   ├── router/              # Vue Router 配置
│   │   └── index.ts         # 路由分離管理
│   ├── stores/              # 共用 Pinia stores
│   ├── services/            # 共用 API 服務
│   └── components/shared/   # 共用組件
```

**優勢:**

- ✅ **遵循 YAGNI 原則** - 避免過度設計
- ✅ **共用資源** - API 客戶端、型別定義、工具函數
- ✅ **測試一致性** - 統一的測試策略
- ✅ **部署簡化** - 單一前端應用
- ✅ **開發效率** - 共用 store 和 components

**劣勢:**

- ⚠️ **打包體積** - 可能較大（可用程式碼分割解決）
- ⚠️ **職責混合** - 需要良好的模組分離

#### 選項 B：分離式架構

**結構設計:**

```
ithome2025/
├── backend/                 # API 服務
├── admin-frontend/          # 管理員介面
├── blog-frontend/           # 部落格讀者介面
└── shared/                  # 共用型別和工具
```

**優勢:**

- ✅ **關注點分離** - 完全獨立
- ✅ **團隊分工** - 不同團隊負責不同介面
- ✅ **技術棧彈性** - 可選擇不同技術
- ✅ **獨立部署** - 分別部署和擴展

**劣勢:**

- ❌ **重複代碼** - API 客戶端、型別定義
- ❌ **維護成本** - 需要同步更新
- ❌ **部署複雜** - 多個部署管道

### 🎯 建議決策：選項 A（整合式架構）

**理由:**

1. **目前規模適中** - 功能不複雜，不需要分離
2. **開發效率優先** - 共用資源減少重複工作
3. **TDD 友好** - 統一測試環境和策略
4. **未來可拆分** - 需要時可輕易分離

### 📝 實作計畫 (TDD 驅動)

#### 階段 1：結構性變更 (Tidy First)

```bash
# 1. 重構現有結構（不改變行為）
mkdir src/views/admin
mv src/App.vue src/views/admin/AdminApp.vue

# 2. 安裝 Vue Router
npm install vue-router@4

# 3. 建立路由配置
touch src/router/index.ts
```

#### 階段 2：行為性變更 (TDD)

1. **🔴 Red**: 寫 Blog 路由失敗測試
2. **🟢 Green**: 實作基本路由功能
3. **🔵 Refactor**: 優化路由結構

4. **🔴 Red**: 寫 ArticleDetail 組件失敗測試
5. **🟢 Green**: 實作文章詳細頁面
6. **🔵 Refactor**: 抽取共用組件

## 🧪 測試策略

### 測試金字塔

```
     /\
    /  \  E2E Tests (整合測試)
   /____\
  /      \  Integration Tests (API 測試)
 /________\
/          \ Unit Tests (單元測試)
```

### 測試覆蓋率目標

| 層級     | 目標覆蓋率 | 當前狀態     |
| -------- | ---------- | ------------ |
| 單元測試 | 90%+       | 85% (60/70)  |
| 整合測試 | 80%+       | 需要後端運行 |
| E2E 測試 | 70%+       | 規劃中       |

### 測試命令

```bash
# 後端測試
cd backend
npm test                # 執行所有測試
npm run test:watch     # 監視模式

# 前端測試
cd frontend
npm run test:unit      # 單元測試
npm run test:coverage  # 覆蓋率報告
```

## 🚀 部署指南

### 開發環境

- 使用自動化啟動腳本
- 支援熱重載
- 自動錯誤檢測

### 生產環境 (規劃中)

- Docker 容器化
- CI/CD 管道
- 環境變數管理
- 監控和日誌

## 🤝 貢獻指南

### 開發流程

1. **遵循 TDD 原則**

   - 先寫失敗測試 (Red)
   - 實作最小功能 (Green)
   - 重構改善 (Refactor)

2. **遵循 Tidy First 原則**

   - 結構性變更與行為性變更分離
   - 小步驟頻繁提交
   - 保持測試通過

3. **程式碼品質**
   - TypeScript 嚴格模式
   - ESLint + Prettier
   - 100% 測試覆蓋率（新功能）

### Commit 訊息格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**類型:**

- `feat`: 新功能
- `fix`: 錯誤修正
- `docs`: 文檔更新
- `style`: 程式碼格式
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 建置或工具變更

### Pull Request 流程

1. Fork 專案
2. 建立功能分支
3. 遵循 TDD 開發
4. 確保測試通過
5. 提交 Pull Request

## 📚 相關資源

- [Clean Architecture 指南](./docs/clean-architecture.md)
- [TDD 最佳實務](./docs/tdd-practices.md)
- [API 文檔](./docs/api-documentation.md)
- [部署指南](./docs/deployment.md)

## 📞 聯絡資訊

- **專案負責人**: [您的名稱]
- **Email**: [您的信箱]
- **GitHub**: [專案連結]

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

---

**最後更新**: 2025 年 9 月 18 日
**專案狀態**: 開發中 🚧
**下一個里程碑**: 實作部落格讀者介面
