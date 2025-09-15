import type { Article } from "../domain/Article";
import type { ArticleRepository } from "./ArticleRepository";
import type { AsyncArticleRepository } from "./AsyncArticleRepository";

export class InMemoryArticleRepository implements ArticleRepository {
  private store: Article[] = [];
  async save(article: Article): Promise<void> {
    this.store.push(article);
  }
  async getAll(): Promise<Article[]> {
    return [...this.store];
  }
}

export class InMemoryArticleRepositoryAsync implements AsyncArticleRepository {
  private store: Article[] = [];
  async save(article: Article): Promise<void> {
    this.store.push(article);
  }
  async getAll(): Promise<Article[]> {
    return [...this.store];
  }
  async getByCategory(category: string): Promise<Article[]> {
    const c = category.trim();
    if (!c) return [];
    return this.store.filter(a => a.category === c);
  }
}
