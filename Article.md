## 專案中「元件」的分層與範例

下面以專案目前實作為基礎，舉出不同層級（UI / Presentation / Usecase / Provider / Repository / Config / Middleware）的「元件」例子，並簡短說明職責與為什麼把它當成元件。

---

### 1) UI 元件（Component）

- 範例檔案：`frontend/src/views/auth/Login.vue` 或 `frontend/src/components/ArticleForm.vue`
- 職責：處理使用者互動（表單、按鈕、按下送出），綁定畫面上的資料與事件，並呼叫前端 service（如 `apiClient` 或 `supabase` helper）。
- 為何是元件：UI 元件具高內聚（只處理視圖/互動），容易被重用、測試（單元測試或快照測試），在前端框架中是一等公民。

示意責任分界：UI 元件不直接操作 DB 或處理商業邏輯，它把使用者輸入傳給 service 或 controller。

---

### 2) Presentation / Controller（HTTP 層元件）

- 範例檔案：`backend/src/presentation/http/controllers/ArticleController.ts`
- 職責：接收 HTTP 請求、解析/驗證輸入 DTO、呼叫 Usecase（例如 `BlogService`）、把結果包成 HTTP 回應。也負責把錯誤轉成適當的 HTTP status。
- 為何是元件：Controller 是系統邊界，代表「一個可被外界呼叫的功能單位」，可以獨立 mock 用於整合測試或 contract 測試。

注意：輸入驗證可用 middleware 或在 controller 裡完成；但為了 SRP，建議把細節驗證移到中介層或 DTO 層。

---

### 3) Usecase / Service（業務邏輯元件）

- 範例檔案：`backend/src/usecases/BlogService.ts`、`backend/src/usecases/AiService.ts`（或 AiService 會被改為輕薄封裝，委派給 Provider）
- 職責：實作核心商業流程（新增文章、搜尋、更新、呼叫 AI 格式器），不關心 HTTP 或 DB 的細節，只依賴抽象（repositories / providers）。
- 為何是元件：Usecase 封裝業務規則，是可測試的單元（單元測試），在不同接入層（HTTP / CLI / Worker）可被重用，符合單一職責。

好處：把副作用（DB、外部 API）抽離，可以用 stub 或 fake 來做測試，讓行為驗證容易且快速。

---

### 4) Provider（外部依賴的抽象元件）

- 範例檔案：`backend/src/usecases/providers/AiProvider.ts`（介面）、`RuleBasedProvider.ts`、`GoogleProvider.ts`
- 職責：將「呼叫外部 AI」的實作封裝成 SWappable 的元件，遵守共同介面（例如 `format(content, prompt): Promise<string>`）。
- 為何是元件：Provider 代表可交換的外部實作（OpenAI / Gemini / rule-based），若設計遵守 LSP，就能在不改 Usecase 的情況下互換實作。

建議：為 Provider 撰寫合約測試（contract tests），確保不同實作行為一致（錯誤型別、輸入前置條件、回傳語意）。

---

### 5) Repository（資料存取元件）

- 範例檔案：`backend/src/data/SupabaseArticleRepository.ts`、`InMemoryArticleRepository.ts`
- 職責：封裝資料儲存/查詢細節（SQL、Supabase client），提供抽象操作（save/getAll/getById/update/delete/search）。
- 為何是元件：Repository 隔離資料層，讓 Usecase 不依賴具體 DB。方便在測試中以 InMemoryRepository 取代實作。

注意：Repository 的介面應該穩定並由 contract 測試驗證行為（例如 save 後 getById 持久化）。

---

### 6) Config / Container（組裝元件 / 依賴注入）

- 範例檔案：`backend/src/config/container.ts`、`backend/src/config/env.ts`
- 職責：根據環境變數組裝整個系統（建立 supabase client、選擇 InMemory 或 Supabase repository、建立 AiProvider 實例），並匯出給 server 使用。
- 為何是元件：container 是組裝邊界，讓切換實作（如 supabase ↔ in-memory、openai ↔ gemini）只需改配置而非多處修改，利於測試與 OCP。

實務建議：提供一個 `createContainer()` 工廠函式，讓測試能注入 fake 實作，而非在模組載入時固定實例。

---

### 7) Middleware（跨切面元件）

- 範例檔案：`backend/src/presentation/http/middlewares/auth.ts`、`cors.ts`、`errorHandler.ts`
- 職責：處理共通橫切關注點（認證、CORS、錯誤轉換、日誌、rate-limit），可在伺服器層級插拔。
- 為何是元件：Middleware 通常獨立、可插拔、可重用，能在不同 route 上重複使用，並且可被測試（模擬 request/response）。

---

## 小結與建議

- 把系統拆成上述元件可以幫助達成「單一職責原則 (SRP)」與「里氏替換原則 (LSP)」：

  - SRP：每個元件只專注一件事（UI、controller、usecase、repository、provider、container、middleware）。
  - LSP：以介面/合約定義 provider/repository，任何符合合約的實作都能互換（例如 OpenAI ↔ Gemini ↔ rule-based）。

- 測試驅動的實作流程：先為每個元件建立最小的失敗測試（Red），實作最少碼讓測試通過（Green），再重構（Refactor）。

如需我把上述每個元件的「最小合約測試」 scaffold 出來（例如 provider contract tests、repository contract tests），我可以一次產出一組測試檔案並執行（Red → Green）。請告訴我要先做哪一個元件的合約測試。

---

## 元件的要素：如何判斷一段程式為「元件」

下面列出一組實務可用的要素（criteria），每個要素搭配簡短說明與如何在本專案中找到對應證據：

1. 單一責任（Single Responsibility）

- 要素：元件負責單一概念或職責，變更理由少且單一。
- 怎麼看：搜尋該檔案是否只做一件事（例如 `RuleBasedProvider` 只做格式化文字）。

2. 清楚的介面（Well-defined Interface / Contract）

- 要素：有明確的方法簽名與行為約定（輸入、輸出、錯誤模式）。
- 怎麼看：有 interface 或 type 定義（例如 `AiProvider`）或 DTO/schema（例如 `AiAssistDTO`）。

3. 封裝（Encapsulation）

- 要素：把內部細節隱藏在實作裡，外部只透過介面互動。
- 怎麼看：`SupabaseArticleRepository` 隱藏 `supabase` client 的查詢細節，外部只呼叫 `save/getById`。

4. 可替換性（Replaceability / LSP）

- 要素：只要遵守介面，實作可以互換而不影響使用方（里氏替換）。
- 怎麼看：有 `InMemoryArticleRepository` 與 `SupabaseArticleRepository`，container 依 env 注入對應實作。

5. 低耦合、高內聚（Low Coupling / High Cohesion）

- 要素：依賴經過抽象（接口/DI），內部方法彼此關聯度高，與外部依賴少且明確。
- 怎麼看：`BlogService` 只依賴 `ArticleRepository` 抽象，沒有直接調用 DB 實作。

6. 可測試性（Testability）

- 要素：能用單元測試與合約測試驗證行為（可用 fake / stub 注入）。
- 怎麼看：有測試檔（`tests/ai.provider.contract.spec.ts`），或 container 可注入 fake repository。

7. 明確的副作用（Explicit Side-effects）

- 要素：如果有副作用（IO、DB、外部 API），介面或文件應說明，並盡可能可被替換或模擬。
- 怎麼看：`GoogleProvider` 與 `RuleBasedProvider` 分別有外部呼叫與純計算，使用者可預期有/無網路 IO。

8. 可觀察性（Observability）

- 要素：在錯誤/重要事件上有一致的日誌或 metrics 紀錄點（或在 middleware 收斂）。
- 怎麼看：有 `errorHandler` middleware 以及 provider 的錯誤 log，使故障能被追蹤。

9. 可配置與生命週期（Config / Lifecycle）

- 要素：初始化/釋放（connect/disconnect）及使用環境變數配置（例如 model name、keys）。
- 怎麼看：`container.ts` 與 `env.ts` 管理不同實作的選擇與 client 建立（supabase、google model）。

10. 語意穩定的錯誤模式（Error contract）

- 要素：不同實作對於相同錯誤情況應回傳/拋出可辨識的一致錯誤（例如 `AI_VALIDATION_ERROR`）。
- 怎麼看：AiService 與 contract 測試定義了驗證錯誤前綴，便於上層判斷。

---

## 快速檢核表：把一段程式歸為元件的 6 個問題

把任意檔案或類別拿來檢查，若多數回答為「是」，它很可能是一個良好定義的元件：

1. 它只負責一件事嗎？（Single Responsibility）
2. 是否有明確的輸入/輸出定義或 DTO？
3. 是否能在不改用法的情況下替換實作？（有介面/抽象）
4. 是否能用單元測試或合約測試隔離驗證？
5. 它的副作用（如果有）是否被限制且可模擬？
6. 是否可以由 container/factory 注入或建立？

範例：若某個 class 為 `ArticleRepository` 並通過上述 6 題，多半代表它是「資料存取元件」。

---

## 元件的最小接受標準（Acceptance Criteria 範本）

在為元件寫合約測試或 PR 說明時，可以用這個簡短模板來表述驗收條件：

- 標題：元件名稱與版本
- 輸入（Input）：參數類型、約束（例如 content 長度 <= 10000）
- 輸出（Output）：回傳類型與語意（例如 Promise<string>，內容為格式化文字）
- 錯誤（Errors）：明確的錯誤類型或前綴（如 AI_VALIDATION_ERROR）
- 副作用（Side-effects）：是否呼叫外部 API、DB，是否會修改 state
- 初始化 / 終止（Lifecycle）：是否需要 connect/close
- 性能限制（可選）：例如最大執行時間 3s

範例（AiProvider contract）

- Input：content:string (<=10000), prompt:string(<=1000)
- Output：Promise<string>（非空）
- Errors：若輸入驗證失敗拋 `AI_VALIDATION_ERROR`；若外部 API 失敗拋 `AI_PROVIDER_ERROR: <detail>`

---

如果你想，我可以：

- 把上述「檢核表」自動轉成一個 `COMPONENT_CHECKLIST.md` 檔案並加到 repo；
- 或以 `AiProvider` 為例，產生完整的合約測試集（包含正向與驗證失敗測試），並在本地跑一次測試。哪個优先？
