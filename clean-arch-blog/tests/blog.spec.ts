import { describe, it, expect } from "vitest";
import { InMemoryArticleRepository } from "../src/data/InMemoryArticleRepository";
import { BlogService } from "../src/usecases/BlogService";

describe("BlogService（邏輯層）", () => {
  it("可以新增文章，並依分類查詢", () => {
    const repo = new InMemoryArticleRepository();
    const blog = new BlogService(repo);

    blog.addArticle({ title: "AI 幫我寫的遊記", category: "旅行", content: "內容A" });
    blog.addArticle({ title: "無瑕的程式碼－整潔的軟體設計與架構篇", category: "程式", content: "內容B" });
    blog.addArticle({ title: "九份散步", category: "旅行", content: "內容C" });

    const travel = blog.getByCategory("程式");
    expect(travel.map(a => a.title)).toEqual(["無瑕的程式碼－整潔的軟體設計與架構篇"]);
  });

  it("查詢不存在分類時回傳空陣列", () => {
    const repo = new InMemoryArticleRepository();
    const blog = new BlogService(repo);
    blog.addArticle({ title: "Clean Code 筆記", category: "程式", content: "內容D" });
    const none = blog.getByCategory("旅行");
    expect(none).toEqual([]);
  });

  it("缺少必要欄位時丟出錯誤", () => {
    const repo = new InMemoryArticleRepository();
    const blog = new BlogService(repo);
    expect(() => blog.addArticle({ title: "   ", category: "旅行", content: "內容X" })).toThrowError("標題不可為空白");
    expect(() => blog.addArticle({ title: "好文章", category: "", content: "內容Y" })).toThrowError("分類不可為空白");
    expect(() => blog.addArticle({ title: "沒有內容", category: "旅行", content: "   " })).toThrowError("內容不可為空白");
  });
});
