import type { Article } from "../domain/Article";
import type { ArticleRepository } from "./ArticleRepository";

export class InMemoryArticleRepository implements ArticleRepository {
  private store: Article[] = [];
  save(article: Article): void {
    this.store.push(article);
  }
  getAll(): Article[] {
    return [...this.store];
  }
}
