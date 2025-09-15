import type { Article } from "../domain/Article";
import type { ArticleRepository } from "../data/ArticleRepository";
import { ValidationError } from "../domain/Errors";

export class BlogService {
  constructor(private repo: ArticleRepository) { }

  addArticle(article: Article) {
    const title = (article.title ?? "").trim();
    const category = (article.category ?? "").trim();

    if (!title) {
      throw new ValidationError("TITLE_REQUIRED", "標題不可為空白");
    }
    if (!category) {
      throw new ValidationError("CATEGORY_REQUIRED", "分類不可為空白");
    }

    // 可在此加入額外規則（例如：長度 / 禁用字詞）
    this.repo.save({ title, category });
  }


  getByCategory(category: string): Article[] {
    const target = (category ?? "").trim();
    if (!target) return [];
    return this.repo.getAll().filter(a => a.category === target);
  }
}
