import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import BlogArticleList from '../../views/blog/BlogArticleList.vue'
import type { Article } from '../../types/article'

// 創建測試用路由
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/blog'
        },
        {
            path: '/blog',
            name: 'BlogHome',
            component: { template: '<div>BlogHome</div>' }
        },
        {
            path: '/blog/article/:id',
            name: 'ArticleDetail',
            component: { template: '<div>Article</div>' }
        }
    ]
})

// Mock useArticleStore
const mockLoadArticles = vi.fn()
const mockArticles = ref<Article[]>([])
const mockLoading = ref(false)

vi.mock('../../stores/articleStore', () => ({
    useArticleStore: () => ({
        articles: mockArticles,
        loading: mockLoading,
        loadArticles: mockLoadArticles
    })
}))

describe('BlogArticleList.vue', () => {
    const globalConfig = {
        plugins: [router]
    }

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        mockArticles.value = []
        mockLoading.value = false
    })

    it('載入中時應該顯示載入指示器', async () => {
        mockLoading.value = true

        const wrapper = mount(BlogArticleList, {
            global: globalConfig
        })

        expect(wrapper.find('.loading').exists()).toBe(true)
        expect(wrapper.find('.loading-spinner').exists()).toBe(true)
        expect(wrapper.text()).toContain('載入文章中...')
    })

    it('沒有文章時應該顯示空狀態', async () => {
        mockLoading.value = false
        mockArticles.value = []

        const wrapper = mount(BlogArticleList, {
            global: globalConfig
        })

        expect(wrapper.find('.empty-state').exists()).toBe(true)
        expect(wrapper.text()).toContain('還沒有文章')
    })

    it('有文章時應該顯示文章列表', async () => {
        const testArticles = [
            {
                id: '1',
                title: '測試文章 1',
                content: '這是測試內容 1',
                category: '技術',
                slug: 'test-1',
                created_at: '2025-01-01'
            },
            {
                id: '2',
                title: '測試文章 2',
                content: '這是測試內容 2',
                category: '生活',
                slug: 'test-2',
                created_at: '2025-01-02'
            }
        ]

        mockLoading.value = false
        mockArticles.value = testArticles

        const wrapper = mount(BlogArticleList, {
            global: {
                plugins: [router]
            }
        })

        expect(wrapper.find('.articles-grid').exists()).toBe(true)
        expect(wrapper.findAll('.article-card')).toHaveLength(2)
        expect(wrapper.text()).toContain('共 2 篇文章')
    })

    it('文章卡片應該包含正確的資訊', async () => {
        const mockArticle = {
            id: '1',
            title: '測試文章標題',
            content: '這是一個很長的測試內容，用來測試預覽功能是否正常工作。這個內容應該會被截斷，只顯示前面的部分內容。',
            category: '技術分享',
            slug: 'test-article',
            created_at: '2025-01-15'
        }

        mockLoading.value = false
        mockArticles.value = [mockArticle]

        const wrapper = mount(BlogArticleList, {
            global: {
                plugins: [router]
            }
        })

        const articleCard = wrapper.find('.article-card')

        expect(articleCard.find('.article-title').text()).toBe('測試文章標題')
        expect(articleCard.find('.category').text()).toBe('技術分享')
        expect(articleCard.find('.article-preview').text()).toContain('這是一個很長的測試內容')
        expect(articleCard.find('.read-more').text()).toContain('閱讀全文')
    })

    it('點擊文章卡片應該導航到文章詳細頁面', async () => {
        const mockArticle = {
            id: '1',
            title: '測試文章',
            content: '測試內容',
            category: '技術',
            slug: 'test',
            created_at: '2025-01-01'
        }

        mockLoading.value = false
        mockArticles.value = [mockArticle]

        const wrapper = mount(BlogArticleList, {
            global: {
                plugins: [router]
            }
        })

        const routerPushSpy = vi.spyOn(router, 'push')

        await wrapper.find('.article-card').trigger('click')

        expect(routerPushSpy).toHaveBeenCalledWith({
            name: 'ArticleDetail',
            params: { id: '1' }
        })
    })

    it('組件掛載時應該載入文章', async () => {
        mockLoading.value = false
        mockArticles.value = []

        mount(BlogArticleList, {
            global: {
                plugins: [router]
            }
        })

        expect(mockLoadArticles).toHaveBeenCalled()
    })

    it('應該正確格式化日期', async () => {
        const mockArticle = {
            id: '1',
            title: '測試文章',
            content: '測試內容',
            category: '技術',
            slug: 'test',
            created_at: '2025-01-15T10:30:00Z'
        }

        mockLoading.value = false
        mockArticles.value = [mockArticle]

        const wrapper = mount(BlogArticleList, {
            global: {
                plugins: [router]
            }
        })

        // 日期應該被格式化為中文格式
        expect(wrapper.find('.date').text()).toMatch(/2025年.*月.*日/)
    })

    it('應該截斷長內容並添加省略號', async () => {
        const longContent = 'a'.repeat(200) // 200 個字符的長內容
        const mockArticle = {
            id: '1',
            title: '測試文章',
            content: longContent,
            category: '技術',
            slug: 'test',
            created_at: '2025-01-01'
        }

        mockLoading.value = false
        mockArticles.value = [mockArticle]

        const wrapper = mount(BlogArticleList, {
            global: {
                plugins: [router]
            }
        })

        const preview = wrapper.find('.article-preview').text()
        expect(preview.length).toBeLessThanOrEqual(153) // 150 + '...'
        expect(preview.endsWith('...')).toBe(true)
    })
})
