# OpenAI API 整合使用指南

## 設定步驟

1. **安裝依賴套件**

   ```bash
   pnpm install
   ```

2. **設定環境變數**

   - 複製 `.env.example` 到 `.env`
   - 在 `.env` 中填入你的 OpenAI API key：
     ```
     OPENAI_API_KEY=sk-your-api-key-here
     ```

3. **測試 API 整合**
   ```bash
   pnpm run test:openai
   ```

## API 使用方式

### 1. 文章協助 API

**端點**: `POST /api/articles/ai-assist`

**請求格式**:

```json
{
  "prompt": "請幫我改善這篇文章的結構",
  "articleContent": "文章內容...",
  "articleId": "可選的文章ID"
}
```

**回應格式**:

```json
{
  "improvedContent": "改善後的內容",
  "originalPrompt": "原始提示",
  "rawResponse": "AI 原始回應",
  "log": {
    "id": "記錄ID",
    "articleId": "文章ID",
    "prompt": "提示",
    "response": "回應",
    "createdAt": "時間戳記"
  }
}
```

### 2. 直接使用 OpenAI 服務

```typescript
import { OpenAIService } from "./src/data/OpenAIService.js";

const openaiService = new OpenAIService();

// 文章協助
const result = await openaiService.generateArticleAssistance(
  "請幫我改善文章結構",
  "原始文章內容"
);

// 部落格文章生成
const blogPost = await openaiService.generateBlogPost("TypeScript 最佳實務", {
  style: "技術教學",
  length: "medium",
  includeOutline: true,
});
```

## 支援的功能

### OpenAIService 方法

1. **generateResponse()** - 基本 OpenAI API 呼叫
2. **generateArticleAssistance()** - 文章寫作協助
3. **generateBlogPost()** - 部落格文章生成

### 設定選項

- **模型**: gpt-3.5-turbo (預設), gpt-4 等
- **溫度**: 0.0-2.0 (創意程度)
- **最大 Token**: 控制回應長度
- **文章長度**: short, medium, long

## 錯誤處理

常見錯誤及解決方法：

1. **API Key 錯誤**: 檢查 `.env` 中的 `OPENAI_API_KEY`
2. **額度超限**: 檢查 OpenAI 帳戶使用量
3. **網路錯誤**: 檢查網路連線

## 成本控制

- 使用 `gpt-3.5-turbo` 模型較經濟
- 設定合理的 `max_tokens` 限制
- 監控 API 使用量
