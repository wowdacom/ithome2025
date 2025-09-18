import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import type { Article, CreateArticleRequest } from '../types/article'

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

  it('should call ArticleService.search when search filters are applied', async () => {
    // Red: 測試搜尋功能的 API 整合
    const mockSearchResults: Article[] = [
      {
        id: '2',
        title: 'Search Result Article',
        content: 'Content from search',
        category: 'javascript',
        slug: 'search-result-article',
        created_at: '2025-01-02T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z'
      }
    ]

    const { articleService } = await import('../services')
    vi.mocked(articleService.getAll).mockResolvedValue([])
    vi.mocked(articleService.search).mockResolvedValue(mockSearchResults)

    const wrapper = mount(App)
    await flushPromises()

    // 找到搜尋輸入框並輸入關鍵字
    const keywordInput = wrapper.find('input[placeholder="搜尋標題或內容"]')
    expect(keywordInput.exists()).toBe(true)

    await keywordInput.setValue('javascript')

    // 找到搜尋按鈕並點擊
    const buttons = wrapper.findAll('button')
    const searchButton = buttons.find(btn => btn.text() === '搜尋')
    expect(searchButton).toBeTruthy()

    await searchButton!.trigger('click')
    await flushPromises()

    // 驗證 ArticleService.search 被正確調用
    expect(articleService.search).toHaveBeenCalledWith({
      keyword: 'javascript',
      category: '',
      dateFrom: '',
      dateTo: ''
    })

    // 驗證搜尋結果出現在頁面上
    expect(wrapper.text()).toContain('Search Result Article')
  })

  it('should call ArticleService.create when article form is submitted', async () => {
    // Red: 測試新增文章功能的 API 整合
    const newArticleData: CreateArticleRequest = {
      title: 'New Test Article',
      content: 'Test content for new article',
      category: 'testing'
    }

    const mockCreatedArticle: Article = {
      id: '3',
      ...newArticleData,
      slug: 'new-test-article',
      created_at: '2025-01-03T00:00:00Z'
    }

    const { articleService } = await import('../services')
    vi.mocked(articleService.getAll).mockResolvedValue([])
    vi.mocked(articleService.create).mockResolvedValue(mockCreatedArticle)

    const wrapper = mount(App)
    await flushPromises()

    // 填寫新增文章表單
    const titleInput = wrapper.find('input[name="title"]')
    const contentTextarea = wrapper.find('textarea[name="content"]')
    const categoryInput = wrapper.find('input[name="category"]')

    expect(titleInput.exists()).toBe(true)
    expect(contentTextarea.exists()).toBe(true)
    expect(categoryInput.exists()).toBe(true)

    await titleInput.setValue(newArticleData.title)
    await contentTextarea.setValue(newArticleData.content)
    await categoryInput.setValue(newArticleData.category)

    // 提交表單 (使用表單提交而不是按鈕點擊)
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)

    await form.trigger('submit')
    await flushPromises()

    // 驗證 ArticleService.create 被正確調用
    expect(articleService.create).toHaveBeenCalledWith(newArticleData)

    // 驗證成功訊息出現
    expect(wrapper.text()).toContain('文章新增成功')

    // 驗證表單被清空 (這需要檢查 ArticleForm 組件的 clearForm 方法被調用)
    // 驗證文章列表被重新載入
    expect(articleService.getAll).toHaveBeenCalledTimes(2) // 一次是初始載入，一次是新增後重新載入
  })

  it('should call ArticleService.delete when delete button is clicked and confirmed', async () => {
    // Red: 測試刪除文章功能的 API 整合
    const existingArticles: Article[] = [
      {
        id: 'delete-test-1',
        title: 'Article to Delete',
        content: 'This article will be deleted',
        category: 'test',
        slug: 'article-to-delete',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'keep-test-2',
        title: 'Article to Keep',
        content: 'This article will remain',
        category: 'test',
        slug: 'article-to-keep',
        created_at: '2025-01-02T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z'
      }
    ]

    const { articleService } = await import('../services')
    vi.mocked(articleService.getAll).mockResolvedValue(existingArticles)
    vi.mocked(articleService.delete).mockResolvedValue(undefined)

    // Mock window.confirm 返回 true（確認刪除）
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper = mount(App)
    await flushPromises()

    // 驗證文章列表中有要刪除的文章
    expect(wrapper.text()).toContain('Article to Delete')
    expect(wrapper.text()).toContain('Article to Keep')

    // 找到第一篇文章的刪除按鈕
    const deleteButtons = wrapper.findAll('.delete-button')
    expect(deleteButtons.length).toBeGreaterThan(0)

    // 點擊第一個刪除按鈕
    await deleteButtons[0].trigger('click')
    await flushPromises()

    // 驗證確認對話框被顯示
    expect(confirmSpy).toHaveBeenCalledWith('確定要刪除這篇文章嗎？')

    // 驗證 ArticleService.delete 被正確調用
    expect(articleService.delete).toHaveBeenCalledWith('delete-test-1')

    // 驗證成功訊息出現
    expect(wrapper.text()).toContain('文章刪除成功')

    // 驗證文章列表被重新載入
    expect(articleService.getAll).toHaveBeenCalledTimes(2) // 一次是初始載入，一次是刪除後重新載入

    // 清理 spy
    confirmSpy.mockRestore()
  })
})
