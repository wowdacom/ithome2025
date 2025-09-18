import { ValidationError } from "../../../domain/Errors";
import type { SearchFilters } from "../../../data/AsyncArticleRepository";

export interface CreateArticleRequest {
    title: string;
    category: string;
    content: string;
}

export interface UpdateArticleRequest {
    title?: string;
    category?: string;
    content?: string;
}

export interface ArticleResponse {
    id?: string;
    title: string;
    category: string;
    content: string;
    slug?: string;
    created_at?: Date;
    updated_at?: Date;
}

export function validateCreateArticle(body: any): CreateArticleRequest {
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const category = typeof body?.category === "string" ? body.category.trim() : "";
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    if (!title) throw new ValidationError("TITLE_REQUIRED", "標題不可為空白");
    if (!category) throw new ValidationError("CATEGORY_REQUIRED", "分類不可為空白");
    if (!content) throw new ValidationError("CONTENT_REQUIRED", "內容不可為空白");
    return { title, category, content };
}

export function validateUpdateArticle(body: any): UpdateArticleRequest {
    const updates: UpdateArticleRequest = {};

    if (body?.title !== undefined) {
        const title = typeof body.title === "string" ? body.title.trim() : "";
        if (!title) throw new ValidationError("TITLE_REQUIRED", "標題不可為空白");
        updates.title = title;
    }

    if (body?.category !== undefined) {
        const category = typeof body.category === "string" ? body.category.trim() : "";
        if (!category) throw new ValidationError("CATEGORY_REQUIRED", "分類不可為空白");
        updates.category = category;
    }

    if (body?.content !== undefined) {
        const content = typeof body.content === "string" ? body.content.trim() : "";
        if (!content) throw new ValidationError("CONTENT_REQUIRED", "內容不可為空白");
        updates.content = content;
    }

    return updates;
}

export function validateSearchFilters(query: any): SearchFilters {
    const filters: SearchFilters = {};

    if (query?.keyword && typeof query.keyword === "string") {
        filters.keyword = query.keyword.trim();
    }

    if (query?.category && typeof query.category === "string") {
        filters.category = query.category.trim();
    }

    if (query?.dateFrom && typeof query.dateFrom === "string") {
        const date = new Date(query.dateFrom);
        if (!isNaN(date.getTime())) {
            filters.dateFrom = date;
        }
    }

    if (query?.dateTo && typeof query.dateTo === "string") {
        const date = new Date(query.dateTo);
        if (!isNaN(date.getTime())) {
            filters.dateTo = date;
        }
    }

    return filters;
}
