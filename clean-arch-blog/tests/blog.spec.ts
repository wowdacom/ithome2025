import { describe, it, expect } from "vitest";
import { InMemoryArticleRepository } from "../src/data/InMemoryArticleRepository";
import { BlogService } from "../src/usecases/BlogService";

describe("BlogService（邏輯層）", () => {
  it("可以新增文章，並依分類查詢", () => {
    const repo = new InMemoryArticleRepository();
    const blog = new BlogService(repo);

    blog.addArticle({ title: "AI 幫我寫的遊記", category: "旅行" });
    blog.addArticle({ title: "無瑕的程式碼－整潔的軟體設計與架構篇", category: "程式" });
    blog.addArticle({ title: "九份散步", category: "旅行" });

    const travel = blog.getByCategory("程式");
    expect(travel.map(a => a.title)).toEqual(["無瑕的程式碼－整潔的軟體設計與架構篇"]);
  });
});
