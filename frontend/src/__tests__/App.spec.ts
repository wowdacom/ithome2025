import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import type { Article } from '../types/article'

// Mock ArticleService
vi.mock('../services', () => ({
  articleService: {
    getAll: vi.fn(),
    create: vi.fn(),
    search: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('部落格後台管理')
    expect(wrapper.text()).toContain('新增文章')
    expect(wrapper.text()).toContain('搜尋文章')
    expect(wrapper.text()).toContain('文章列表')
  })

  it('should load articles from ArticleService on mount', async () => {
    // Red: 這個測試會失敗，因為我們需要驗證 API 調用行為
    const mockArticles: Article[] = [
      {
        id: '1',
        title: 'API Article',
        content: 'Content from API',
        category: 'tech',
        slug: 'api-article',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]

    // 取得 mock 的 ArticleService
    const { articleService } = await import('../services')
    vi.mocked(articleService.getAll).mockResolvedValue(mockArticles)

    const wrapper = mount(App)
    await flushPromises()

    // 驗證 ArticleService.getAll 被調用
    expect(articleService.getAll).toHaveBeenCalled()

    // 驗證文章內容出現在頁面上
    expect(wrapper.text()).toContain('API Article')
  })
})
