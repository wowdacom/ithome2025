import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useArticleStore } from '../articleStore'
import type { Article, CreateArticleRequest, SearchFilters } from '@/types/article'

// Mock ArticleService
vi.mock('@/services', () => ({
    articleService: {
        getAll: vi.fn(),
        create: vi.fn(),
        search: vi.fn(),
        delete: vi.fn(),
    }
}))

describe('Article Store', () => {
    beforeEach(() => {
        // 建立 fresh pinia instance for each test
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('should initialize with empty state', () => {
        const store = useArticleStore()

        expect(store.articles).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.message).toEqual({ text: '', type: 'info' })
    })

    it('should load articles successfully', async () => {
        const mockArticles: Article[] = [
            {
                id: '1',
                title: 'Test Article',
                content: 'Test content',
                category: 'test',
                slug: 'test-article',
                created_at: '2025-01-01T00:00:00Z'
            }
        ]

        const { articleService } = await import('@/services')
        vi.mocked(articleService.getAll).mockResolvedValue(mockArticles)

        const store = useArticleStore()
        await store.loadArticles()

        expect(store.articles).toEqual(mockArticles)
        expect(store.loading).toBe(false)
        expect(articleService.getAll).toHaveBeenCalled()
    })

    it('should handle loading state during API calls', async () => {
        const { articleService } = await import('@/services')
        vi.mocked(articleService.getAll).mockResolvedValue([])

        const store = useArticleStore()

        expect(store.loading).toBe(false)
        const loadPromise = store.loadArticles()
        expect(store.loading).toBe(true)
        await loadPromise
        expect(store.loading).toBe(false)
    })

    it('should create article successfully', async () => {
        const newArticleData: CreateArticleRequest = {
            title: 'New Article',
            content: 'New content',
            category: 'new'
        }

        const mockCreatedArticle: Article = {
            id: '2',
            ...newArticleData,
            slug: 'new-article',
            created_at: '2025-01-01T00:00:00Z'
        }

        const { articleService } = await import('@/services')
        vi.mocked(articleService.create).mockResolvedValue(mockCreatedArticle)
        vi.mocked(articleService.getAll).mockResolvedValue([mockCreatedArticle])

        const store = useArticleStore()
        await store.createArticle(newArticleData)

        expect(articleService.create).toHaveBeenCalledWith(newArticleData)
        expect(store.message.text).toContain('新增成功')
        expect(store.message.type).toBe('success')
        expect(articleService.getAll).toHaveBeenCalled()
    })

    it('should search articles successfully', async () => {
        const searchFilters: SearchFilters = {
            keyword: 'test',
            category: 'tech'
        }

        const mockSearchResults: Article[] = [
            {
                id: '3',
                title: 'Search Result',
                content: 'Search content',
                category: 'tech',
                slug: 'search-result',
                created_at: '2025-01-01T00:00:00Z'
            }
        ]

        const { articleService } = await import('@/services')
        vi.mocked(articleService.search).mockResolvedValue(mockSearchResults)

        const store = useArticleStore()
        await store.searchArticles(searchFilters)

        expect(articleService.search).toHaveBeenCalledWith(searchFilters)
        expect(store.articles).toEqual(mockSearchResults)
    })

    it('should delete article successfully', async () => {
        const articleId = 'delete-1'

        const { articleService } = await import('@/services')
        vi.mocked(articleService.delete).mockResolvedValue(undefined)
        vi.mocked(articleService.getAll).mockResolvedValue([])

        const store = useArticleStore()
        await store.deleteArticle(articleId)

        expect(articleService.delete).toHaveBeenCalledWith(articleId)
        expect(store.message.text).toContain('刪除成功')
        expect(store.message.type).toBe('success')
        expect(articleService.getAll).toHaveBeenCalled()
    })

    it('should handle API errors properly', async () => {
        const errorMessage = 'Network error'
        const { articleService } = await import('@/services')
        vi.mocked(articleService.getAll).mockRejectedValue(new Error(errorMessage))

        const store = useArticleStore()
        await store.loadArticles()

        expect(store.loading).toBe(false)
        expect(store.message.text).toContain(errorMessage)
        expect(store.message.type).toBe('error')
    })

    it('should clear message', () => {
        const store = useArticleStore()

        store.showMessage('Test message', 'success')
        expect(store.message.text).toBe('Test message')

        store.clearMessage()
        expect(store.message.text).toBe('')
        expect(store.message.type).toBe('info')
    })
})
