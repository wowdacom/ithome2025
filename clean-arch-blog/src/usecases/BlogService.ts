import type { Article } from "../domain/Article";
import type { AsyncArticleRepository } from "../data/AsyncArticleRepository";
import { ValidationError } from "../domain/Errors";

export class BlogService {
  constructor(private repo: AsyncArticleRepository) { }

  async addArticle(article: Article): Promise<void> {
    const title = (article.title ?? "").trim();
    const category = (article.category ?? "").trim();
    const content = (article.content ?? "").trim();

    if (!title) {
      throw new ValidationError("TITLE_REQUIRED", "標題不可為空白");
    }
    if (!category) {
      throw new ValidationError("CATEGORY_REQUIRED", "分類不可為空白");
    }
    if (!content) {
      throw new ValidationError("CONTENT_REQUIRED", "內容不可為空白");
    }

    // 可在此加入額外規則（例如：長度 / 禁用字詞）
    await this.repo.save({ title, category, content });
  }
  async getByCategory(category: string): Promise<Article[]> {
    const target = (category ?? "").trim();
    if (!target) return [];
    return await this.repo.getByCategory(target);
  }
}
