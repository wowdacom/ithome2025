import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ArticleService } from '@/services/articleService'
import type { Article, CreateArticleRequest, SearchFilters } from '@/types/article'
import type { ApiClient } from '@/utils/apiClient'

describe('ArticleService', () => {
  let articleService: ArticleService
  let mockApiClient: Partial<ApiClient>

  beforeEach(() => {
    // Mock API client
    mockApiClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }

    articleService = new ArticleService(mockApiClient as ApiClient)
  })

  describe('getAll', () => {
    it('should fetch all articles', async () => {
      // Red: 這個測試會失敗，因為 ArticleService 還不存在
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'Test Article',
          content: 'Test content',
          category: 'test',
          slug: 'test-article',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ]

      mockApiClient.get.mockResolvedValue(mockArticles)

      const result = await articleService.getAll()

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles')
      expect(result).toEqual(mockArticles)
    })

    it('should handle API errors', async () => {
      const error = new Error('Network error')
      mockApiClient.get.mockRejectedValue(error)

      await expect(articleService.getAll()).rejects.toThrow('Network error')
    })
  })

  describe('create', () => {
    it('should create a new article', async () => {
      const createRequest: CreateArticleRequest = {
        title: 'New Article',
        content: 'New content',
        category: 'new',
      }

      const mockCreatedArticle: Article = {
        id: '2',
        ...createRequest,
        slug: 'new-article',
        created_at: '2025-01-01T00:00:00Z',
      }

      mockApiClient.post.mockResolvedValue(mockCreatedArticle)

      const result = await articleService.create(createRequest)

      expect(mockApiClient.post).toHaveBeenCalledWith('/articles', createRequest)
      expect(result).toEqual(mockCreatedArticle)
    })
  })

  describe('search', () => {
    it('should search articles with filters', async () => {
      const filters: SearchFilters = {
        keyword: 'test',
        category: 'tech',
      }

      const mockSearchResults: Article[] = [
        {
          id: '3',
          title: 'Search Result',
          content: 'Test content',
          category: 'tech',
          slug: 'search-result',
          created_at: '2025-01-01T00:00:00Z',
        },
      ]

      mockApiClient.get.mockResolvedValue(mockSearchResults)

      const result = await articleService.search(filters)

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles/search', {
        keyword: 'test',
        category: 'tech',
      })
      expect(result).toEqual(mockSearchResults)
    })

    it('should handle empty filters', async () => {
      const mockResults: Article[] = []
      mockApiClient.get.mockResolvedValue(mockResults)

      const result = await articleService.search({})

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles/search', {})
      expect(result).toEqual(mockResults)
    })
  })
})
