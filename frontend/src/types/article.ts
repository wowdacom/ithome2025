export interface Article {
    id: string
    title: string
    content: string
    category: string
    slug: string
    created_at: string
    updated_at?: string
}

export interface CreateArticleRequest {
    title: string
    content: string
    category: string
}

export interface UpdateArticleRequest {
    title?: string
    content?: string
    category?: string
}

export interface SearchFilters {
    keyword?: string
    category?: string
    dateFrom?: string
    dateTo?: string
}

export interface ApiResponse<T> {
    data: T
    message?: string
    error?: string
}

export interface MessageState {
    text: string
    type: 'success' | 'error' | 'info'
}
