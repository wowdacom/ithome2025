import type { Article } from "../domain/Article";
import type { AsyncArticleRepository } from "./AsyncArticleRepository";
import { supabaseService, supabasePublic } from "../config/supabase";
import { ValidationError } from "../domain/Errors";

function slugify(title: string) {
  return title.trim().toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// 期望資料表: articles (id uuid pk, title text, category text, content text, slug text unique, created_at timestamptz default now())
export class SupabaseArticleRepository implements AsyncArticleRepository {
  private client = supabaseService || supabasePublic; // 若無 service key 則退化用 public client

  private ensureClient() {
    if (!this.client) {
      throw new Error("Supabase client not initialized (check env SUPABASE_URL / SUPABASE_ANON_KEY)");
    }
  }

  async save(article: Article): Promise<void> {
    this.ensureClient();
    const slug = slugify(article.title);
    const { error } = await this.client!
      .from('articles')
      .insert({ title: article.title, category: article.category, content: article.content, slug });
    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        throw new ValidationError('SLUG_TAKEN', '文章 slug 已存在');
      }
      throw new Error(`DB_INSERT_FAILED: ${error.message}`);
    }
  }

  async getAll(): Promise<Article[]> {
    this.ensureClient();
    const { data, error } = await this.client!.from('articles').select('title, category, content');
    if (error) throw new Error(`DB_SELECT_FAILED: ${error.message}`);
    return data ?? [];
  }

  async getByCategory(category: string): Promise<Article[]> {
    this.ensureClient();
    const c = category.trim();
    if (!c) return [];
    const { data, error } = await this.client!.from('articles')
      .select('title, category, content')
      .eq('category', c);
    if (error) throw new Error(`DB_SELECT_FAILED: ${error.message}`);
    return data ?? [];
  }
}
