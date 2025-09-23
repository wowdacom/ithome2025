# 單文頁面 Markdown 支援更新

## 更新概述

為了確保前端博客的一致性，已經為單文頁面新增了完整的 Markdown 渲染支援，包括語法高亮代碼塊。

## 更新的檔案

### 1. ArticleDetail.vue (單文詳細頁面)

- **路徑**: `frontend/src/views/blog/ArticleDetail.vue`
- **變更**:
  - 新增 `useMarkdown` composable import
  - 新增 `renderedContent` computed 屬性
  - 更新模板使用 `v-html="renderedContent"` 而非直接顯示 `article.content`
  - 新增 `prose prose-lg max-w-none` CSS 類別優化排版
  - 移除與 Tailwind prose 衝突的自定義 CSS 樣式

### 2. BlogArticleList.vue (博客文章列表頁面)

- **路徑**: `frontend/src/views/blog/BlogArticleList.vue`
- **變更**:
  - 更新 `getPreview()` 函數以正確處理 Markdown 語法
  - 改善預覽文字擷取，移除 Markdown 標記符號
  - 保持純文字預覽的簡潔性

## 技術實作細節

### ArticleDetail.vue 的 Markdown 渲染

```typescript
// 新增 import
import { useMarkdown } from "../../composables/useMarkdown";

// 初始化 Markdown 渲染器
const { renderMarkdown } = useMarkdown();

// 建立 computed 屬性進行即時渲染
const renderedContent = computed(() => {
  if (!article.value?.content) {
    return "";
  }
  return renderMarkdown(article.value.content);
});
```

### BlogArticleList.vue 的預覽功能改善

````typescript
function getPreview(content: string): string {
  // 移除 Markdown 語法標記，獲取純文字內容
  const plainText = content
    // 移除代碼塊
    .replace(/```[\s\S]*?```/g, "")
    // 移除行內代碼
    .replace(/`[^`]*`/g, "")
    // 移除標題標記
    .replace(/^#{1,6}\s+/gm, "")
    // 移除粗體和斜體標記
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    // 移除連結語法，保留連結文字
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // 移除引用標記
    .replace(/^>\s+/gm, "")
    // 移除清單標記
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    // 移除多餘的空行
    .replace(/\n\s*\n/g, "\n")
    .trim();

  return plainText.length > 150
    ? plainText.substring(0, 150) + "..."
    : plainText;
}
````

## 支援的功能

### 完整 Markdown 語法支援

- **標題**: H1-H6 各級標題
- **文字格式**: 粗體、斜體、刪除線
- **清單**: 有序和無序清單
- **連結和圖片**: 完整支援
- **引用**: 塊引用和嵌套引用
- **表格**: 完整表格支援

### 代碼塊功能

- **語法高亮**: 支援多種程式語言
- **主題**: 使用 GitHub Dark 主題
- **樣式**: 整合 Tailwind CSS 和 highlight.js
- **響應式**: 支援水平滾動處理長程式碼行

### 樣式整合

- **Tailwind Typography**: 使用 `prose prose-lg max-w-none` 類別
- **響應式設計**: 適應不同螢幕大小
- **一致性**: 與編輯預覽保持相同的渲染效果

## 用戶體驗改善

### 1. 視覺一致性

- 單文頁面、編輯預覽、AI 結果顯示統一使用相同的 Markdown 渲染器
- 確保所見即所得的編輯體驗

### 2. 閱讀體驗優化

- 使用 Tailwind Typography 提供最佳的閱讀排版
- 代碼塊語法高亮提升程式碼可讀性
- 響應式設計適應各種裝置

### 3. 效能考量

- 使用 Vue computed 屬性確保最佳渲染效能
- 僅在內容變更時重新渲染
- 預覽文字擷取最佳化，避免不必要的 HTML 渲染

## 相容性

### 向後相容

- 現有的 HTML 內容依然可以正常顯示
- Markdown 和 HTML 混合內容正確處理

### 新內容支援

- 完整支援從編輯器創建的 Markdown 內容
- AI 生成的 Markdown 內容正確渲染

## 測試建議

### 基本功能測試

1. **進入單文頁面**:

   - 訪問任一文章詳細頁面
   - 確認 Markdown 內容正確渲染
   - 驗證代碼塊語法高亮正常

2. **文章列表預覽**:
   - 檢查文章卡片的預覽文字
   - 確認 Markdown 標記已正確移除
   - 驗證文字截斷功能正常

### 進階測試

1. **複雜 Markdown 內容**:

   - 測試包含多種元素的文章（標題、清單、代碼塊、連結等）
   - 驗證嵌套結構正確渲染

2. **響應式測試**:

   - 在不同螢幕大小下測試顯示效果
   - 確認代碼塊的水平滾動功能

3. **效能測試**:
   - 測試含有大量內容的文章
   - 確認渲染速度符合預期

## 後續改進方向

1. **目錄功能**: 為長文章自動生成目錄
2. **錨點連結**: 標題自動生成錨點
3. **圖片優化**: 支援圖片懶載入和響應式圖片
4. **數學公式**: 支援 LaTeX 數學公式渲染
5. **圖表支援**: 支援 Mermaid 圖表渲染

## 總結

這次更新確保了整個博客系統的 Markdown 渲染一致性，從編輯到預覽到最終顯示，用戶都能獲得統一且優質的體驗。代碼塊的語法高亮功能特別有助於技術文章的閱讀體驗。
