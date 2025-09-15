import type { Article } from "../domain/Article";
import type { ArticleRepository } from "../data/ArticleRepository";

export class BlogService {
  constructor(private repo: ArticleRepository) { }

  addArticle(article: Article) {
    // 還沒實作
  }

  getByCategory(category: string): Article[] {
    // 還沒實作
    return [];
  }
}
