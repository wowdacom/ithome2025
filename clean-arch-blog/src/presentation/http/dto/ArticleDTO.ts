export interface CreateArticleRequest {
    title: string;
    category: string;
    content: string;
}

export interface ArticleResponse {
    title: string;
    category: string;
    content: string;
}

import { ValidationError } from "../../../domain/Errors";

export function validateCreateArticle(body: any): CreateArticleRequest {
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const category = typeof body?.category === "string" ? body.category.trim() : "";
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    if (!title) throw new ValidationError("TITLE_REQUIRED", "標題不可為空白");
    if (!category) throw new ValidationError("CATEGORY_REQUIRED", "分類不可為空白");
    if (!content) throw new ValidationError("CONTENT_REQUIRED", "內容不可為空白");
    return { title, category, content };
}
