import type { Article } from "../domain/Article";

export interface ArticleRepository {
  save(article: Article): void;
  getAll(): Article[];
}
