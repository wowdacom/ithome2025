# Markdown 代碼塊支援實作

## 功能概述

本次更新為 AI 協助功能新增了 Markdown 代碼塊支援，使用者現在可以：

1. 在 AI 提示中要求生成包含程式碼的內容
2. AI 回傳的內容會自動渲染 Markdown 格式，包括語法高亮的代碼塊
3. 支援多種程式語言的語法高亮

## 技術實作

### 新增的依賴套件

```bash
npm install marked highlight.js @types/marked
```

### 主要檔案變更

1. **frontend/src/composables/useMarkdown.ts** (新增)

   - 使用 `marked.js` 解析 Markdown
   - 整合 `highlight.js` 提供語法高亮
   - 自定義代碼塊渲染器，套用 Tailwind CSS 樣式

2. **frontend/src/components/shared/AiAssistPanel.vue**

   - 新增 `renderedResult` computed 屬性
   - 使用 `v-html` 渲染 HTML 內容而非純文字
   - 新增 `prose` CSS 類別改善排版

3. **frontend/src/components/ArticleList.vue**

   - 同樣支援 Markdown 渲染
   - 統一 AI 結果顯示體驗

4. **frontend/src/styles/global.css**
   - 匯入 `highlight.js` 的 GitHub Dark 主題樣式

## 使用方式

### 使用者操作

1. 進入文章管理頁面或新增文章頁面
2. 開啟 AI 協助面板
3. 在提示框中輸入包含程式碼要求的提示，例如：

   ```
   請幫我寫一個 JavaScript 函數來計算陣列的平均值，並加上使用範例
   ```

4. AI 會回傳包含代碼塊的 Markdown 格式內容
5. 內容會自動渲染為格式化的文字和語法高亮的代碼塊

### 支援的 Markdown 語法

- **代碼塊**：使用三個反引號包圍，並指定語言

  ````markdown
  ```javascript
  function average(numbers) {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }
  ```
  ````

  ```

  ```

- **行內代碼**：使用單個反引號包圍

  ```markdown
  使用 `console.log()` 來輸出除錯訊息
  ```

- **其他 Markdown 語法**：粗體、斜體、連結、清單等

## 測試指南

### 基本測試

1. **啟動開發環境**

   ```bash
   # 前端 (port 5174)
   cd frontend
   npm run dev

   # 後端 (port 3000)
   cd backend
   npm run dev
   ```

2. **開啟瀏覽器**

   - 前往 http://localhost:5174
   - 進入「文章管理」或「新增文章」頁面

3. **測試 AI 代碼塊生成**
   - 開啟 AI 協助面板
   - 輸入提示：「請寫一個 Python 函數來排序字典」
   - 確認回傳的代碼塊有正確的語法高亮

### 進階測試

1. **多語言支援**

   - 測試 JavaScript、Python、TypeScript、HTML、CSS 等語言
   - 確認語法高亮正確顯示

2. **混合內容**

   - 測試包含文字說明和多個代碼塊的內容
   - 確認 Markdown 渲染正確

3. **應用到文章**
   - 使用「套用」功能將 AI 生成的內容加入文章
   - 確認代碼塊在文章內容中正確顯示

## 已知限制

1. 代碼塊樣式使用 Tailwind CSS，需確保樣式檔案正確載入
2. highlight.js 支援的語言有限，不支援的語言會以純文字顯示
3. 在文章最終顯示時，需要前端也支援 Markdown 渲染才能正確顯示格式

## 後續改進方向

1. 在文章展示頁面也加入 Markdown 渲染支援
2. 支援更多 highlight.js 主題選擇
3. 加入代碼塊複製功能
4. 支援 Mermaid 圖表等進階 Markdown 功能

## 技術細節

### useMarkdown.ts 實作重點

```typescript
// 自定義代碼塊渲染器
renderer.code = (code, language) => {
  const validLanguage =
    language && hljs.getLanguage(language) ? language : "plaintext";
  const highlighted = hljs.highlight(code, { language: validLanguage }).value;

  return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
    <code class="hljs language-${validLanguage}">${highlighted}</code>
  </pre>`;
};
```

這個實作確保：

- 自動檢測語言支援性
- 套用一致的 Tailwind CSS 樣式
- 支援水平捲動處理長程式碼行
- 保持與 GitHub Dark 主題一致的配色
