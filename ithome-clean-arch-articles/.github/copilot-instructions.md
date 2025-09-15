---
applyTo: "articles/**/*.{md,ts,js}"
---

# Writing Guidelines — Clean Architecture 30 Days + AI

## 受眾

- 國中生程度的工程師／入門者
- 讀者對 AI 好奇、對架構零到初階
- 偏好輕鬆、有例子、有可執行的最小原型

## 主軸與承諾

- 主軸：用 **argument coding + Clean Architecture** 建立可維護的 AI 部落格
- 每篇都回答：這個概念如何幫助「維護性」、「擴充性」、「清晰分工」

## 文章固定結構

1. **今日主題解釋（生活比喻）**
2. **範例故事**（人物：國中生阿吉，打造 AI 部落格）
3. **在程式中的應用**（至少一段可執行示例／或結構圖／或 shell 指令）
4. **小結與一個思考問題**（引導讀者動手 or 反思）

## 文字風格

- 像部落格，不是教科書；短句、口語、避免艱澀術語
- 每篇 600–800 字；1–2 個具體例子
- 專有名詞第一次出現時做「一句話白話解釋」

## 範例與程式

- 一律以 **最小可行** 為原則（可執行／可測試）
- 優先使用 TypeScript + Vitest；命名清楚、分層乾淨
- 若給指令（shell / npm），請附帶說明輸出或預期結果

## Frontmatter 標準（見 metadata-schema.json）

- `title`（string）
- `day`（1–30）
- `slug`（kebab-case，例如：day-01-why-architecture）
- `date`（YYYY-MM-DD）
- `tags`（array，例如：["clean-architecture","ai","argument-coding"]）
- `summary`（<= 160 字）

## 提交規範

- 檔名：`content/day-XX.md`（兩位數）
- PR 標題：`Day XX: <title>`
- Commit 風格：`feat(day-XX): short summary`
