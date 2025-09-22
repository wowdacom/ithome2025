# AI 寫作輔助功能使用指南

## 功能概述

此專案整合了 OpenAI GPT 模型，為部落格文章編輯提供 AI 輔助功能。使用者可以在撰寫或編輯文章時獲得 AI 建議，提升內容品質。

## 功能特色

- 🤖 **智能建議**: 使用 OpenAI GPT 模型提供文章改善建議
- 📝 **即時編輯**: 在文章創建和編輯頁面都提供 AI 輔助
- 💾 **日誌記錄**: 自動記錄所有 AI 互動，方便追蹤和分析
- 🎯 **靈活操作**: 可選擇套用建議或附加到現有內容
- 🔒 **安全可靠**: 使用環境變數管理 API 密鑰

## 環境設定

### 1. OpenAI API 密鑰設定

在後端專案根目錄的 `.env` 檔案中設定您的 OpenAI API 密鑰：

```env
# OpenAI Configuration
OPENAI_API_KEY="your-openai-api-key-here"
```

### 2. 取得 OpenAI API 密鑰

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 註冊並登入您的帳戶
3. 導航至 API Keys 頁面
4. 點擊 "Create new secret key"
5. 複製產生的密鑰並貼到 `.env` 檔案中

### 3. 環境變數範例

完整的 `.env` 檔案範例：

```env
# Supabase project settings
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# OpenAI Configuration
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Server settings
PORT=3000

# Development settings
DISABLE_AUTH=true
```

## 使用方式

### 在文章創建頁面

1. 填寫文章標題、分類和內容
2. 點擊內容區域下方的 "🤖 AI 協助" 按鈕
3. 在彈出的 AI 面板中輸入您的需求，例如：
   - "改善這篇文章的結構"
   - "讓標題更吸引人"
   - "增加更多實用的範例"
4. 點擊 "生成內容" 或按 Enter 鍵
5. 查看 AI 建議並選擇操作：
   - **套用到內容**: 完全替換現有內容
   - **附加到內容**: 將建議添加到現有內容後
   - **清除結果**: 清除當前建議

### 在文章編輯頁面

1. 在文章列表中點擊 "編輯" 按鈕
2. 編輯表單會展開，包含 AI 協助功能
3. 使用方式與創建頁面相同

### AI 提示詞建議

為了獲得最佳效果，建議使用明確的提示詞：

**好的提示詞範例:**
- "改善這篇文章的開頭，讓它更引人入勝"
- "為這篇技術文章添加實用的程式碼範例"
- "優化文章結構，使邏輯更清晰"
- "將內容改寫得更適合初學者理解"

**避免的提示詞:**
- "改善文章" (太籠統)
- "讓它更好" (缺乏具體指導)

## 技術架構

### 後端組件

- **AiAssistService**: 核心 AI 服務邏輯
- **OpenAIService**: OpenAI API 整合
- **PromptLogRepository**: AI 互動日誌記錄
- **AiAssistController**: HTTP API 控制器

### 前端組件

- **useAiAssist**: Vue 3 Composable 提供 AI 功能
- **AiAssistPanel**: 共用的 AI 面板組件
- **ArticleForm/ArticleList**: 整合 AI 功能的主要頁面

### API 端點

```
POST /api/ai/assist
```

請求格式：
```json
{
  "prompt": "改善這篇文章的結構",
  "currentContent": "文章的現有內容..."
}
```

回應格式：
```json
{
  "suggestion": "AI 生成的建議內容..."
}
```

## 疑難排解

### 常見問題

**Q: AI 功能無法運作**
A: 請檢查：
1. OpenAI API 密鑰是否正確設定
2. 後端服務是否正常運行
3. 瀏覽器開發者工具是否顯示錯誤

**Q: API 回應緩慢**
A: OpenAI API 有時會較慢，這是正常現象。請耐心等待或檢查網路連接。

**Q: 收到 API 限制錯誤**
A: 請檢查您的 OpenAI 帳戶配額和使用限制。

### 錯誤代碼

- `401 Unauthorized`: API 密鑰無效或遺失
- `429 Too Many Requests`: 超過 API 使用限制
- `500 Internal Server Error`: 伺服器內部錯誤

## 開發指南

### 本地開發

```bash
# 啟動後端
cd backend
npm run dev

# 啟動前端 (新終端)
cd frontend
npm run dev
```

### 測試 AI 功能

```bash
# 執行整合測試
./test-ai-integration.ps1
```

### 新增自定義提示

您可以在前端組件中修改預設提示詞或添加快捷按鈕：

```javascript
// 在 useAiAssist.ts 中添加預設提示
const commonPrompts = [
  '改善文章結構',
  '增加實用範例',
  '優化 SEO 標題'
]
```

## 安全注意事項

1. **API 密鑰保護**: 絕不要將 OpenAI API 密鑰提交到版本控制系統
2. **資料隱私**: AI 會處理您的文章內容，請確保符合隱私政策
3. **使用限制**: 合理使用 API 以避免超出配額限制

## 支援與回饋

如有問題或建議，請：
1. 檢查此文件的疑難排解章節
2. 查看專案的 GitHub Issues
3. 聯繫開發團隊

---

**版本**: 1.0.0  
**最後更新**: 2025年9月22日