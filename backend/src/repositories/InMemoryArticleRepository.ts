import { nanoid } from 'nanoid'
import type { Article, CreateArticleRequest, UpdateArticleRequest, SearchFilters } from '@/types/article'

export class InMemoryArticleRepository {
    private articles: Article[] = []

    async findAll(): Promise<Article[]> {
        return [...this.articles]
    }

    async findById(id: string): Promise<Article | null> {
        const article = this.articles.find(a => a.id === id)
        return article || null
    }

    async create(data: CreateArticleRequest): Promise<Article> {
        const article: Article = {
            id: nanoid(),
            title: data.title,
            content: data.content,
            category: data.category,
            slug: this.generateSlug(data.title),
            created_at: new Date().toISOString()
        }

        this.articles.push(article)
        return article
    }

    async update(id: string, data: UpdateArticleRequest): Promise<Article | null> {
        const index = this.articles.findIndex(a => a.id === id)
        if (index === -1) {
            return null
        }

        const existing = this.articles[index]
        const updated: Article = {
            ...existing,
            ...data,
            slug: data.title ? this.generateSlug(data.title) : existing.slug,
            updated_at: new Date().toISOString()
        }

        this.articles[index] = updated
        return updated
    }

    async delete(id: string): Promise<boolean> {
        const index = this.articles.findIndex(a => a.id === id)
        if (index === -1) {
            return false
        }

        this.articles.splice(index, 1)
        return true
    }

    async search(filters: SearchFilters): Promise<Article[]> {
        let results = [...this.articles]

        // 關鍵字搜尋（標題和內容）
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase()
            results = results.filter(article =>
                article.title.toLowerCase().includes(keyword) ||
                article.content.toLowerCase().includes(keyword)
            )
        }

        // 類別過濾
        if (filters.category) {
            results = results.filter(article => article.category === filters.category)
        }

        // 日期範圍過濾
        if (filters.dateFrom || filters.dateTo) {
            results = results.filter(article => {
                const articleDate = new Date(article.created_at).toISOString().split('T')[0]

                if (filters.dateFrom && articleDate < filters.dateFrom) {
                    return false
                }

                if (filters.dateTo && articleDate > filters.dateTo) {
                    return false
                }

                return true
            })
        }

        return results
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
            .replace(/\s+/g, '-') // 空格替換為短劃線
            .replace(/-+/g, '-') // 多個短劃線合併為一個
            .replace(/^-|-$/g, '') // 移除開頭和結尾的短劃線
    }
}