import type { Article } from "../domain/Article";

export interface AsyncArticleRepository {
  save(article: Article): Promise<void>;
  getAll(): Promise<Article[]>;
  getByCategory(category: string): Promise<Article[]>;
}
