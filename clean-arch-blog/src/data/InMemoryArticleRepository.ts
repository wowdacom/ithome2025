import type { Article } from "../domain/Article";
import type { ArticleRepository } from "./ArticleRepository";
import type { AsyncArticleRepository, SearchFilters } from "./AsyncArticleRepository";

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
  private idCounter = 1;

  async save(article: Article): Promise<Article> {
    const newArticle = {
      ...article,
      id: article.id || String(this.idCounter++),
      created_at: new Date(),
      updated_at: new Date(),
      slug: article.slug || this.generateSlug(article.title)
    };
    this.store.push(newArticle);
    return newArticle;
  }

  async getAll(): Promise<Article[]> {
    return [...this.store];
  }

  async getByCategory(category: string): Promise<Article[]> {
    const c = category.trim();
    if (!c) return [];
    return this.store.filter(a => a.category === c);
  }

  async getById(id: string): Promise<Article | null> {
    return this.store.find(a => a.id === id) || null;
  }

  async update(id: string, updates: Partial<Article>): Promise<Article> {
    const index = this.store.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('ARTICLE_NOT_FOUND');
    }

    const updatedArticle = {
      ...this.store[index],
      ...updates,
      id, // 保持原 id
      updated_at: new Date()
    };

    this.store[index] = updatedArticle;
    return updatedArticle;
  }

  async search(filters: SearchFilters): Promise<Article[]> {
    let results = [...this.store];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(a =>
        a.title.toLowerCase().includes(keyword) ||
        a.content.toLowerCase().includes(keyword)
      );
    }

    if (filters.category) {
      results = results.filter(a => a.category === filters.category);
    }

    if (filters.dateFrom) {
      results = results.filter(a =>
        a.created_at && a.created_at >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      results = results.filter(a =>
        a.created_at && a.created_at <= filters.dateTo!
      );
    }

    return results;
  }

  private generateSlug(title: string): string {
    return title.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50);
  }
}
