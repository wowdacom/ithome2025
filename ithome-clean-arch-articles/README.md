# Clean Architecture 30 Days (+ AI)

本 repo 是一本「30 天學習 Clean Architecture」的系列文章，主軸結合 **Argument-driven Coding + AI**，以「國中生工程師也能理解」為標準，示範如何打造可維護、可演進的 AI 部落格。

---

## 🎯 目標

- 30 天，每天一個可立即理解與應用的微主題
- 以生活比喻 + 問題故事 → 對應程式實作 → 思考問題收尾
- 展示如何把需求拆成 argument / constraints，讓 AI 輔助更精準

---

## 📂 專案結構

```
clean-arch-30days/
├─ README.md
├─ custom-instructions/
│  ├─ writing-guidelines.md          # 寫作規則（受眾、語氣、段落）
│  ├─ article-template.md            # 文章模板（含 frontmatter）
│  ├─ metadata-schema.json           # Frontmatter 驗證 JSON Schema
│  └─ prompts.md                     # 共用 AI Prompts 集合
├─ content/
│  └─ day-01.md                      # 已產生的文章（用腳本建立）
├─ scripts/
│  └─ new-day.sh                     # 建立新文章腳本
├─ .github/
│  ├─ PULL_REQUEST_TEMPLATE.md
│  └─ ISSUE_TEMPLATE/
│     └─ new-article.yml
├─ .editorconfig
└─ .prettierrc
```

---

## 🛠 如何新增一篇「Day」文章

1. 閱讀 `custom-instructions/writing-guidelines.md`
2. 發 Issue（可選）：使用 `📝 新文章提案` 模板草擬重點
3. 產生檔案：
   ```bash
   ./scripts/new-day.sh 2 "用界面解耦：為什麼要先想抽象？"
   ```
4. 按模板補完：生活比喻 / 故事 / 程式 / 思考問題
5. 確認 Frontmatter：符合 `metadata-schema.json`
6. 開 PR，使用 `PULL_REQUEST_TEMPLATE.md` 自我檢查

### new-day.sh 會做什麼？

- 產生 `content/day-XX.md`
- 自動填：title / day / slug / date / 預設 tags
- 內嵌文章骨架，避免手動複製錯誤

---

## ✅ 發佈前檢查清單（精簡版）

- Frontmatter 合規（用 Schema 驗證）
- 比喻 → 痛點 → 抽象對應 → 思考題流暢
- 每段 ≤ 5 行，摘要 ≤ 40 字
- 程式碼最小可行（非過度抽象）
- 提出 1 個開放式思考問題

---

## 🤖 與 AI 協作策略

| 情境             | 推薦 Prompt 類型 | 範例檔案        |
| ---------------- | ---------------- | --------------- |
| 想確認主題切分   | 場景 / 痛點萃取  | `prompts.md` #2 |
| 選擇實作策略     | 架構決策比較     | `prompts.md` #3 |
| 檢查是否過度抽象 | 抽象化檢查       | `prompts.md` #4 |
| 產出生活比喻     | 比喻生成         | `prompts.md` #1 |
| 重寫摘要         | 摘要精煉         | `prompts.md` #5 |

Argument 驅動寫法示例（先定義限制 → 再要答案）：

```text
角色：資深架構師
目標：讓 Post 產生流程可替換 AI 供應商
既有：目前直接在函式內 fetch + 存檔
限制：不引入第三方 DI、保留 CLI 簡單度
請輸出：選項 / 優缺點 / 推薦方案 / 未來要支援批次時的調整
```

---

## 🔍 Frontmatter 驗證（可選流程）

你可以安裝一個 JSON Schema 驗證工具或寫簡單 Node 腳本：

```js
// validate-frontmatter.mjs（示意）
import fs from "fs";
import matter from "gray-matter";
import Ajv from "ajv";
import schema from "./custom-instructions/metadata-schema.json" assert { type: "json" };

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const files = fs.readdirSync("./content").filter((f) => f.endsWith(".md"));
for (const f of files) {
  const fm = matter.read(`./content/${f}`).data;
  const ok = validate(fm);
  if (!ok) console.error(f, validate.errors);
  else console.log("OK", f);
}
```

---

## 📌 授權與貢獻

- 歡迎 PR / Issue 改善內容
- 新增或調整規則：請在 PR 描述說明動機

---

## 🗺 未來可能延伸

- 增加自動產生目錄 / 部落格發佈管線
- 增加測試：驗證文章 frontmatter 與連結有效性
- 製作簡易 CLI 封裝 new-day 腳本

---

若你也在用 AI 輔助學習架構，歡迎分享你的 workflow！
