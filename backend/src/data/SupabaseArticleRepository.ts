import type { Article } from "../domain/Article";
import type { AsyncArticleRepository, SearchFilters } from "./AsyncArticleRepository";
import { supabaseService, supabasePublic } from "../config/supabase";
import { ValidationError } from "../domain/Errors";

function slugify(title: string) {
  return title.trim().toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// 期望資料表: articles (id uuid pk, title text, category text, content text, slug text unique, created_at timestamptz default now(), updated_at timestamptz)
export class SupabaseArticleRepository implements AsyncArticleRepository {
  private client = supabaseService || supabasePublic; // 若無 service key 則退化用 public client

  private ensureClient() {
    if (!this.client) {
      throw new Error("Supabase client not initialized (check env SUPABASE_URL / SUPABASE_ANON_KEY)");
    }
  }

  async save(article: Article): Promise<Article> {
    this.ensureClient();
    const slug = slugify(article.title);

    // 先嘗試插入包含 updated_at 的資料
    let { data, error } = await this.client!
      .from('articles')
      .insert({
        title: article.title,
        category: article.category,
        content: article.content,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, title, category, content, slug, created_at, updated_at')
      .single();

    // 如果因為 updated_at 欄位不存在而失敗，則不包含 updated_at 重試
    if (error && error.message.includes('updated_at')) {
      const result = await this.client!
        .from('articles')
        .insert({
          title: article.title,
          category: article.category,
          content: article.content,
          slug,
          created_at: new Date().toISOString()
        })
        .select('id, title, category, content, slug, created_at')
        .single();

      data = result.data as any; // 手動添加 updated_at 將在 mapToArticle 中處理
      error = result.error;
    }

    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        throw new ValidationError('SLUG_TAKEN', '文章 slug 已存在');
      }
      throw new Error(`DB_INSERT_FAILED: ${error.message}`);
    }

    return this.mapToArticle(data);
  }

  async getAll(): Promise<Article[]> {
    this.ensureClient();

    // 先嘗試查詢包含 updated_at 的欄位
    let { data, error } = await this.client!.from('articles')
      .select('id, title, category, content, slug, created_at, updated_at')
      .order('created_at', { ascending: false });

    // 如果 updated_at 欄位不存在，則查詢不包含 updated_at 的欄位
    if (error && error.message.includes('updated_at')) {
      const result = await this.client!.from('articles')
        .select('id, title, category, content, slug, created_at')
        .order('created_at', { ascending: false });
      data = result.data as any;
      error = result.error;
    }

    if (error) throw new Error(`DB_SELECT_FAILED: ${error.message}`);
    return (data ?? []).map(this.mapToArticle);
  }

  async getByCategory(category: string): Promise<Article[]> {
    this.ensureClient();
    const c = category.trim();
    if (!c) return [];

    // 先嘗試查詢包含 updated_at 的欄位
    let { data, error } = await this.client!.from('articles')
      .select('id, title, category, content, slug, created_at, updated_at')
      .eq('category', c)
      .order('created_at', { ascending: false });

    // 如果 updated_at 欄位不存在，則查詢不包含 updated_at 的欄位
    if (error && error.message.includes('updated_at')) {
      const result = await this.client!.from('articles')
        .select('id, title, category, content, slug, created_at')
        .eq('category', c)
        .order('created_at', { ascending: false });
      data = result.data as any;
      error = result.error;
    }

    if (error) throw new Error(`DB_SELECT_FAILED: ${error.message}`);
    return (data ?? []).map(this.mapToArticle);
  }

  async getById(id: string): Promise<Article | null> {
    this.ensureClient();

    // 先嘗試查詢包含 updated_at 的欄位
    let { data, error } = await this.client!.from('articles')
      .select('id, title, category, content, slug, created_at, updated_at')
      .eq('id', id)
      .single();

    // 如果 updated_at 欄位不存在，則查詢不包含 updated_at 的欄位
    if (error && error.message.includes('updated_at')) {
      const result = await this.client!.from('articles')
        .select('id, title, category, content, slug, created_at')
        .eq('id', id)
        .single();
      data = result.data as any;
      error = result.error;
    }

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(`DB_SELECT_FAILED: ${error.message}`);
    }
    return this.mapToArticle(data);
  }

  async update(id: string, updates: Partial<Article>): Promise<Article> {
    this.ensureClient();
    const updateData: any = {
      ...updates
    };

    // 如果標題有更新，重新生成 slug
    if (updates.title) {
      updateData.slug = slugify(updates.title);
    }

    // 先嘗試更新包含 updated_at 的資料
    let { data, error } = await this.client!.from('articles')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, title, category, content, slug, created_at, updated_at')
      .single();

    // 如果 updated_at 欄位不存在，則更新不包含 updated_at 的資料
    if (error && error.message.includes('updated_at')) {
      const result = await this.client!.from('articles')
        .update(updateData)
        .eq('id', id)
        .select('id, title, category, content, slug, created_at')
        .single();
      data = result.data as any;
      error = result.error;
    }

    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        throw new ValidationError('SLUG_TAKEN', '更新後的 slug 已存在');
      }
      throw new Error(`DB_UPDATE_FAILED: ${error.message}`);
    }

    return this.mapToArticle(data);
  }

  async search(filters: SearchFilters): Promise<Article[]> {
    this.ensureClient();

    // 先嘗試查詢包含 updated_at 的欄位
    let query = this.client!.from('articles')
      .select('id, title, category, content, slug, created_at, updated_at');

    if (filters.keyword) {
      query = query.or(`title.ilike.%${filters.keyword}%,content.ilike.%${filters.keyword}%`);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom.toISOString());
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo.toISOString());
    }

    query = query.order('created_at', { ascending: false });

    let { data, error } = await query;

    // 如果 updated_at 欄位不存在，則查詢不包含 updated_at 的欄位
    if (error && error.message.includes('updated_at')) {
      let fallbackQuery = this.client!.from('articles')
        .select('id, title, category, content, slug, created_at');

      if (filters.keyword) {
        fallbackQuery = fallbackQuery.or(`title.ilike.%${filters.keyword}%,content.ilike.%${filters.keyword}%`);
      }

      if (filters.category) {
        fallbackQuery = fallbackQuery.eq('category', filters.category);
      }

      if (filters.dateFrom) {
        fallbackQuery = fallbackQuery.gte('created_at', filters.dateFrom.toISOString());
      }

      if (filters.dateTo) {
        fallbackQuery = fallbackQuery.lte('created_at', filters.dateTo.toISOString());
      }

      fallbackQuery = fallbackQuery.order('created_at', { ascending: false });

      const result = await fallbackQuery;
      data = result.data as any;
      error = result.error;
    }

    if (error) throw new Error(`DB_SEARCH_FAILED: ${error.message}`);
    return (data ?? []).map(this.mapToArticle);
  }

  private mapToArticle(dbRow: any): Article {
    return {
      id: dbRow.id,
      title: dbRow.title,
      category: dbRow.category,
      content: dbRow.content,
      slug: dbRow.slug,
      created_at: dbRow.created_at ? new Date(dbRow.created_at) : undefined,
      updated_at: dbRow.updated_at ? new Date(dbRow.updated_at) : undefined
    };
  }
}
