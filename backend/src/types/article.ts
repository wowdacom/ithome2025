import { z } from 'zod'

// Zod schemas for validation
export const CreateArticleSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(1, 'Content is required'),
    category: z.string().min(1, 'Category is required').max(50, 'Category too long')
})

export const UpdateArticleSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    category: z.string().min(1).max(50).optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
})

export const SearchFiltersSchema = z.object({
    keyword: z.string().optional(),
    category: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
})

// TypeScript types
export interface Article {
    id: string
    title: string
    content: string
    category: string
    slug: string
    created_at: string
    updated_at?: string
}

export type CreateArticleRequest = z.infer<typeof CreateArticleSchema>
export type UpdateArticleRequest = z.infer<typeof UpdateArticleSchema>
export type SearchFilters = z.infer<typeof SearchFiltersSchema>

export interface ApiResponse<T> {
    data: T
    message?: string
    error?: string
}

export interface ErrorResponse {
    error: string
    message: string
    statusCode: number
}