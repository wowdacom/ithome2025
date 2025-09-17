import type { Article } from "../domain/Article";

export interface SearchFilters {
  keyword?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AsyncArticleRepository {
  save(article: Article): Promise<Article>;
  getAll(): Promise<Article[]>;
  getByCategory(category: string): Promise<Article[]>;
  getById(id: string): Promise<Article | null>;
  update(id: string, updates: Partial<Article>): Promise<Article>;
  search(filters: SearchFilters): Promise<Article[]>;
}
