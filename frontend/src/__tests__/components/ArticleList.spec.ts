import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleList from '@/components/ArticleList.vue'
import type { Article } from '@/types/article'

const mockArticles: Article[] = [
    {
        id: '1',
        title: 'Vue.js 入門教學',
        category: '技術',
        content: '這是一篇關於 Vue.js 的詳細教學文章...',
        slug: 'vue-js-tutorial',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        title: 'TypeScript 最佳實務',
        category: '教學',
        content: '分享 TypeScript 開發的最佳實務...',
        slug: 'typescript-best-practices',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
    }
]

describe('ArticleList', () => {
    it('should render article list with given articles', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles
            }
        })

        expect(wrapper.findAll('.article-item')).toHaveLength(2)
        expect(wrapper.text()).toContain('Vue.js 入門教學')
        expect(wrapper.text()).toContain('TypeScript 最佳實務')
    })

    it('should display article details correctly', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: [mockArticles[0]]
            }
        })

        expect(wrapper.text()).toContain('Vue.js 入門教學')
        expect(wrapper.text()).toContain('技術')
        expect(wrapper.text()).toContain('這是一篇關於 Vue.js 的詳細教學文章...')
    })

    it('should show empty state when no articles', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: []
            }
        })

        expect(wrapper.find('.empty-state').exists()).toBe(true)
        expect(wrapper.text()).toContain('目前沒有文章')
    })

    it('should show loading state when loading prop is true', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: [],
                loading: true
            }
        })

        expect(wrapper.find('.loading-state').exists()).toBe(true)
        expect(wrapper.text()).toContain('載入中...')
    })

    it('should emit edit-article event when edit button is clicked', async () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles
            }
        })

        await wrapper.find('.edit-button').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('edit-article')
        expect(wrapper.emitted()['edit-article'][0]).toEqual([mockArticles[0]])
    })

    it('should emit delete-article event when delete button is clicked', async () => {
        // Mock window.confirm
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles
            }
        })

        await wrapper.find('.delete-button').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('delete-article')
        expect(wrapper.emitted()['delete-article'][0]).toEqual([mockArticles[0].id])

        confirmSpy.mockRestore()
    })

    it('should show confirmation dialog before deleting', async () => {
        // Mock window.confirm
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles
            }
        })

        await wrapper.find('.delete-button').trigger('click')

        expect(confirmSpy).toHaveBeenCalledWith('確定要刪除這篇文章嗎？')
        expect(wrapper.emitted()).toHaveProperty('delete-article')

        confirmSpy.mockRestore()
    })

    it('should not emit delete event if user cancels confirmation', async () => {
        // Mock window.confirm to return false
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles
            }
        })

        await wrapper.find('.delete-button').trigger('click')

        expect(confirmSpy).toHaveBeenCalledWith('確定要刪除這篇文章嗎？')
        expect(wrapper.emitted()).not.toHaveProperty('delete-article')

        confirmSpy.mockRestore()
    })

    it('should truncate long content with ellipsis', () => {
        const longContentArticle: Article = {
            id: '3',
            title: '長內容文章',
            category: '測試',
            content: '這是一篇非常長的文章內容，應該會被截斷並顯示省略號。'.repeat(10),
            slug: 'long-content-article',
            created_at: '2024-01-03T00:00:00Z',
            updated_at: '2024-01-03T00:00:00Z'
        }

        const wrapper = mount(ArticleList, {
            props: {
                articles: [longContentArticle]
            }
        })

        const contentElement = wrapper.find('.article-content')
        expect(contentElement.text().length).toBeLessThan(longContentArticle.content.length)
        expect(contentElement.text()).toMatch(/\.{3}$/) // ends with ellipsis
    })

    it('should format dates correctly', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: [mockArticles[0]]
            }
        })

        expect(wrapper.text()).toContain('2024/1/1')
    })

    it('should have proper accessibility attributes', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles
            }
        })

        const editButton = wrapper.find('.edit-button')
        const deleteButton = wrapper.find('.delete-button')

        expect(editButton.attributes('aria-label')).toContain('編輯')
        expect(deleteButton.attributes('aria-label')).toContain('刪除')
    })

    it('should disable buttons when loading', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles,
                loading: true
            }
        })

        const editButtons = wrapper.findAll('.edit-button')
        const deleteButtons = wrapper.findAll('.delete-button')

        expect(editButtons.length).toBeGreaterThan(0)
        expect(deleteButtons.length).toBeGreaterThan(0)

        editButtons.forEach(button => {
            expect(button.attributes('disabled')).toBeDefined()
        })

        deleteButtons.forEach(button => {
            expect(button.attributes('disabled')).toBeDefined()
        })
    })

    it('should show article count when articles exist', () => {
        const wrapper = mount(ArticleList, {
            props: {
                articles: mockArticles
            }
        })

        expect(wrapper.text()).toContain('共 2 篇文章')
    })
})
