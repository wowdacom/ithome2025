import type { Article } from "../domain/Article";

export interface ArticleRepository {
  save(article: Article): Promise<void>;
  getAll(): Promise<Article[]>;
}
