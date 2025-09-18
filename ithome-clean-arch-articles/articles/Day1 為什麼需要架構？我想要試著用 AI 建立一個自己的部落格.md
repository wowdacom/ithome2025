# 為什麼需要架構？我想要試著用 AI 建立一個自己的部落格

## 今日主題：
現在 AI 好像什麼東西都寫得出來，為什麼還要學架構？
想像一個房間裡的東西越來越多，書本、球具、零食、美術用具 … …。但時間一久，房間會變成「怪獸房間」，東西堆成一坨一坨，東西一不見要找變得超麻煩。
如果可以像房間裡有收納的地方 (像架構)，一開始多花點時間整理，之後卻會省下很多麻煩。

## 阿吉的故事：
為什麼阿吉會想要做一個部落格，阿吉喜歡看書，各種不同領域的東西都很好奇：食物、昆蟲大自然、科學、程式、故事小說、怎麼用錢等各種類型，隨著時間越長書開始堆得到處都是。
阿吉希望開始整理要跟不要的書本，並對於讀過的書籍寫成文章，再進行分類。想到說可以用 AI 幫忙建立部落格，但常常寫了簡單的功能就開始歪掉不知道怎麼加功能了，才發現說應該要把每一件要做的事情好好的進行規劃跟設計，才不會做到歪掉。
好像不是東湊湊西湊湊，就可以把東西弄出來。像蓋房子需要先有藍圖才行。

## 在程式中的應用是什麼？
如果阿吉一開始就用簡單的架構來分工，他的程式會比較乾淨：
- 資料層 (Data)：只處理文章存取。
- 邏輯層 (Logic)：負責分類、規則與 AI 功能。
- 介面層 (UI)：負責跟使用者互動。

## [AI 做的事] 用 Shell Script：快速建立專案架構

```
#!/bin/bash

PROJECT_NAME="clean-arch-blog"
mkdir $PROJECT_NAME && cd $PROJECT_NAME

npm init -y > /dev/null
npm install -D typescript vitest @types/node

# tsconfig
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "rootDir": ".",
    "outDir": "dist",
    "types": ["vitest/globals"]
  },
  "include": ["src", "tests"]
}
EOF

# 修改 scripts
npm pkg set scripts.test="vitest"

# 建立資料夾
mkdir -p src/domain src/data src/usecases tests

# 範例檔案
cat > src/domain/Article.ts << 'EOF'
export type Article = {
  title: string;
  category: string;
};
EOF

cat > src/data/ArticleRepository.ts << 'EOF'
import type { Article } from "../domain/Article";

export interface ArticleRepository {
  save(article: Article): void;
  getAll(): Article[];
}
EOF

cat > src/data/InMemoryArticleRepository.ts << 'EOF'
import type { Article } from "../domain/Article";
import type { ArticleRepository } from "./ArticleRepository";

export class InMemoryArticleRepository implements ArticleRepository {
  private store: Article[] = [];
  save(article: Article): void {
    this.store.push(article);
  }
  getAll(): Article[] {
    return [...this.store];
  }
}
EOF

cat > src/usecases/BlogService.ts << 'EOF'
import type { Article } from "../domain/Article";
import type { ArticleRepository } from "../data/ArticleRepository";

export class BlogService {
  constructor(private repo: ArticleRepository) {}

  addArticle(article: Article) {
    if (!article.title || !article.category) {
      throw new Error("title 與 category 為必填");
    }
    this.repo.save(article);
  }

  getByCategory(category: string): Article[] {
    return this.repo.getAll().filter(a => a.category === category);
  }
}
EOF

cat > tests/blog.spec.ts << 'EOF'
import { describe, it, expect } from "vitest";
import { InMemoryArticleRepository } from "../src/data/InMemoryArticleRepository";
import { BlogService } from "../src/usecases/BlogService";

describe("BlogService", () => {
  it("可以新增文章，並依分類查詢", () => {
    const repo = new InMemoryArticleRepository();
    const blog = new BlogService(repo);

    blog.addArticle({ title: "AI 幫我寫的遊記", category: "旅行" });
    blog.addArticle({ title: "用 AI 學程式心得", category: "學習" });
    blog.addArticle({ title: "九份散步", category: "旅行" });

    const travel = blog.getByCategory("旅行");
    expect(travel.map(a => a.title)).toEqual(["AI 幫我寫的遊記", "九份散步"]);
  });
});
EOF

echo "✅ 專案建立完成，執行方式："
echo "cd $PROJECT_NAME && npm run test"
```

## 思考問題：
如果我要讓 AI 輔助我寫部落格文章，例如整理資料來源、整理資料格式、提供文章修改建議等等，你會把「文章存放」「文章分類」「AI 產生內容」這三件事，放在哪些分層裡呢？為什麼？