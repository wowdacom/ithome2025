import type { Article } from "../domain/Article";
import type { AsyncArticleRepository, SearchFilters } from "../data/AsyncArticleRepository";
import { ValidationError } from "../domain/Errors";

export class BlogService {
  constructor(private repo: AsyncArticleRepository) { }

  async addArticle(article: Article): Promise<Article> {
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
    return await this.repo.save({ title, category, content });
  }

  async getByCategory(category: string): Promise<Article[]> {
    const target = (category ?? "").trim();
    if (!target) return [];
    return await this.repo.getByCategory(target);
  }

  async getById(id: string): Promise<Article | null> {
    if (!id?.trim()) {
      throw new ValidationError("ID_REQUIRED", "文章 ID 不可為空");
    }
    return await this.repo.getById(id);
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    if (!id?.trim()) {
      throw new ValidationError("ID_REQUIRED", "文章 ID 不可為空");
    }

    // 驗證更新欄位
    if (updates.title !== undefined) {
      const title = updates.title.trim();
      if (!title) {
        throw new ValidationError("TITLE_REQUIRED", "標題不可為空白");
      }
      updates.title = title;
    }

    if (updates.category !== undefined) {
      const category = updates.category.trim();
      if (!category) {
        throw new ValidationError("CATEGORY_REQUIRED", "分類不可為空白");
      }
      updates.category = category;
    }

    if (updates.content !== undefined) {
      const content = updates.content.trim();
      if (!content) {
        throw new ValidationError("CONTENT_REQUIRED", "內容不可為空白");
      }
      updates.content = content;
    }

    // 檢查文章是否存在
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new ValidationError("ARTICLE_NOT_FOUND", "找不到指定的文章");
    }

    return await this.repo.update(id, updates);
  }

  async searchArticles(filters: SearchFilters): Promise<Article[]> {
    // 清理搜尋條件
    const cleanFilters: SearchFilters = {};

    if (filters.keyword?.trim()) {
      cleanFilters.keyword = filters.keyword.trim();
    }

    if (filters.category?.trim()) {
      cleanFilters.category = filters.category.trim();
    }

    if (filters.dateFrom instanceof Date) {
      cleanFilters.dateFrom = filters.dateFrom;
    }

    if (filters.dateTo instanceof Date) {
      cleanFilters.dateTo = filters.dateTo;
    }

    return await this.repo.search(cleanFilters);
  }

  async getAllArticles(): Promise<Article[]> {
    return await this.repo.getAll();
  }

  async deleteArticle(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new ValidationError("ID_REQUIRED", "文章 ID 不可為空");
    }

    // 檢查文章是否存在
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new ValidationError("ARTICLE_NOT_FOUND", "找不到指定的文章");
    }

    await this.repo.delete(id);
  }
}
