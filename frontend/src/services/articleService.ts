import type { Article, CreateArticleRequest, UpdateArticleRequest, SearchFilters } from '@/types/article'
import type { ApiClient } from '@/utils/apiClient'
import { ApiError } from '@/utils/apiClient'

export class ArticleService {
    constructor(private apiClient: ApiClient) { }

    async getAll(): Promise<Article[]> {
        return this.apiClient.get<Article[]>('/articles')
    }

    async getById(id: string): Promise<Article | null> {
        try {
            return await this.apiClient.get<Article>(`/articles/${id}`)
        } catch (error: unknown) {
            if (error instanceof ApiError && error.status === 404) {
                return null
            }
            throw error
        }
    }

    async create(data: CreateArticleRequest): Promise<Article> {
        return this.apiClient.post<Article>('/articles', data)
    }

    async update(id: string, data: UpdateArticleRequest): Promise<Article> {
        return this.apiClient.put<Article>(`/articles/${id}`, data)
    }

    async delete(id: string): Promise<void> {
        await this.apiClient.delete(`/articles/${id}`)
    }

    async search(filters: SearchFilters): Promise<Article[]> {
        const params: Record<string, string> = {}

        if (filters.keyword) params.keyword = filters.keyword
        if (filters.category) params.category = filters.category
        if (filters.dateFrom) params.dateFrom = filters.dateFrom
        if (filters.dateTo) params.dateTo = filters.dateTo

        return this.apiClient.get<Article[]>('/articles/search', params)
    }
}
