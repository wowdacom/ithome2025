# Markdown 預覽功能實作

## 功能概述

新增了即時 Markdown 預覽功能，讓使用者在編輯文章內容時可以即時查看渲染後的效果。

## 實作的功能

### 1. 新增文章頁面預覽

- **檔案**: `ArticleForm.vue`
- **位置**: `/admin/new-article`
- **功能**:
  - 在內容編輯區域旁邊新增「顯示預覽」按鈕
  - 點擊後會顯示並排的編輯器和預覽面板
  - 即時渲染 Markdown 內容，包括語法高亮的代碼塊

### 2. 文章管理頁面預覽

- **檔案**: `ArticleList.vue`
- **位置**: `/admin/articles`
- **功能**:
  - 在編輯現有文章時提供相同的預覽功能
  - 與新增文章頁面保持一致的用戶體驗

## 技術實作細節

### 新增的狀態變數

```typescript
// ArticleForm.vue
const showPreview = ref(false);
const previewContent = computed(() => {
  if (!form.content.trim()) {
    return '<p class="text-gray-500 italic">請在左側輸入內容以查看預覽...</p>';
  }
  return renderMarkdown(form.content);
});

// ArticleList.vue
const showEditPreview = ref(false);
const editPreviewContent = computed(() => {
  if (!editForm.content.trim()) {
    return '<p class="text-gray-500 italic">請在左側輸入內容以查看預覽...</p>';
  }
  return renderMarkdown(editForm.content);
});
```

### UI 佈局變更

- 使用 CSS Grid 實現響應式並排佈局
- 預覽開啟時：`grid-cols-2`（編輯器 + 預覽）
- 預覽關閉時：`grid-cols-1`（僅編輯器）

### 樣式設計

- 預覽面板使用卡片樣式設計
- 灰色標頭顯示「即時預覽」
- 白色內容區域，套用 `prose` 類別優化排版
- 最小高度確保良好的視覺效果

## 用戶體驗改進

### 1. 視覺提示

- 空內容時顯示提示文字
- 清楚的區域劃分（編輯 vs 預覽）
- 一致的按鈕樣式和佈局

### 2. 操作便利性

- 單鍵切換預覽顯示/隱藏
- 預覽狀態在取消編輯時自動重置
- 響應式佈局適應不同螢幕大小

### 3. 內容即時更新

- 使用 Vue 的 computed 屬性確保即時同步
- 輸入內容時預覽立即更新
- 支援所有 Markdown 語法，包括代碼塊

## 整合的功能

### 與 AI 協助的整合

- 預覽按鈕與 AI 協助按鈕並排顯示
- AI 生成的內容可以立即在預覽中查看效果
- 統一的按鈕樣式和間距

### 與 Markdown 渲染的整合

- 使用相同的 `useMarkdown` composable
- 確保預覽效果與最終顯示一致
- 支援語法高亮和所有 Markdown 功能

## 使用方式

### 在新增文章時

1. 進入 `/admin/new-article` 頁面
2. 在內容區域點擊「顯示預覽」按鈕
3. 在左側編輯器輸入 Markdown 內容
4. 右側會即時顯示渲染效果
5. 點擊「隱藏預覽」可關閉預覽面板

### 在編輯現有文章時

1. 進入 `/admin/articles` 文章管理頁面
2. 點擊任一文章的「編輯」按鈕
3. 使用方式與新增文章相同

## 支援的 Markdown 語法

預覽功能支援完整的 Markdown 語法，包括：

- **文字格式**: 粗體、斜體、刪除線
- **標題**: H1-H6 各級標題
- **清單**: 有序和無序清單
- **連結和圖片**: 完整的連結和圖片語法
- **代碼**: 行內代碼和代碼塊
- **語法高亮**: 支援多種程式語言
- **引用**: 塊引用和嵌套引用
- **表格**: 完整的表格支援

## 效能考量

- 使用 Vue 的 computed 屬性確保最佳效能
- 只在需要時渲染預覽內容
- 避免不必要的重複渲染

## 後續改進方向

1. **同步滾動**: 編輯器和預覽面板同步滾動
2. **全螢幕預覽**: 提供全螢幕預覽模式
3. **分割調整**: 允許調整編輯器和預覽面板的寬度比例
4. **鍵盤快捷鍵**: 新增快捷鍵快速切換預覽
5. **預覽主題**: 提供多種預覽主題選擇
