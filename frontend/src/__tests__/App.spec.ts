import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import App from '../App.vue'
import type { Article } from '../types/article'

// Mock useArticleStore with reactive refs
const createMockStore = () => ({
  articles: ref([] as Article[]),
  loading: ref(false),
  message: ref({ text: '', type: 'info' as const }),
  loadArticles: vi.fn(),
  createArticle: vi.fn(),
  searchArticles: vi.fn(),
  deleteArticle: vi.fn(),
  showMessage: vi.fn(),
  clearMessage: vi.fn()
})

const mockStore = createMockStore()

vi.mock('../stores/articleStore', () => ({
  useArticleStore: () => mockStore
}))

describe('App', () => {
  beforeEach(() => {
    // 建立 fresh pinia instance for each test
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Reset mock store state using .value for refs
    mockStore.articles.value = []
    mockStore.loading.value = false
    mockStore.message.value = { text: '', type: 'info' }
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App)
    // Test passes if no errors are thrown
    expect(wrapper.exists()).toBe(true)
  })

  it('should load articles from store on mount', async () => {
    const wrapper = mount(App)
    await flushPromises()

    // 驗證 store.loadArticles 在 onMounted 時被調用
    expect(mockStore.loadArticles).toHaveBeenCalled()
  })

  it('should call store.searchArticles when search filters are applied', async () => {
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

    // 驗證 store.searchArticles 被正確調用
    expect(mockStore.searchArticles).toHaveBeenCalledWith({
      keyword: 'javascript',
      category: '',
      dateFrom: '',
      dateTo: ''
    })
  })

  it('should call store.createArticle when article form is submitted', async () => {
    const newArticleData = {
      title: 'New Test Article',
      content: 'Test content for new article',
      category: 'testing'
    }

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

    // 提交表單
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)

    await form.trigger('submit')
    await flushPromises()

    // 驗證 store.createArticle 被正確調用
    expect(mockStore.createArticle).toHaveBeenCalledWith(newArticleData)
  })

  it('should call store.deleteArticle when delete button is clicked and confirmed', async () => {
    // 設定 mockStore 有文章資料
    const existingArticles: Article[] = [
      {
        id: 'delete-test-1',
        title: 'Article to Delete',
        content: 'This article will be deleted',
        category: 'test',
        slug: 'article-to-delete',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]

    mockStore.articles.value = existingArticles

    // Mock window.confirm 返回 true（確認刪除）
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper = mount(App)
    await flushPromises()

    // 驗證文章列表中有要刪除的文章
    expect(wrapper.text()).toContain('Article to Delete')

    // 找到刪除按鈕
    const deleteButtons = wrapper.findAll('.delete-button')
    expect(deleteButtons.length).toBeGreaterThan(0)

    // 點擊刪除按鈕
    await deleteButtons[0].trigger('click')
    await flushPromises()

    // 驗證確認對話框被顯示
    expect(confirmSpy).toHaveBeenCalledWith('確定要刪除這篇文章嗎？')

    // 驗證 store.deleteArticle 被正確調用
    expect(mockStore.deleteArticle).toHaveBeenCalledWith('delete-test-1')

    // 清理 spy
    confirmSpy.mockRestore()
  })
})
