import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleSearch from '@/components/ArticleSearch.vue'
import type { SearchFilters } from '@/types/article'

describe('ArticleSearch', () => {
    it('should render search inputs and buttons', () => {
        const wrapper = mount(ArticleSearch)

        expect(wrapper.find('input[id="keyword"]').exists()).toBe(true)
        expect(wrapper.find('input[id="category"]').exists()).toBe(true)
        expect(wrapper.find('input[id="dateFrom"]').exists()).toBe(true)
        expect(wrapper.find('input[id="dateTo"]').exists()).toBe(true)
        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should have empty initial search values', () => {
        const wrapper = mount(ArticleSearch)

        const keywordInput = wrapper.find('input[id="keyword"]')
        const categoryInput = wrapper.find('input[id="category"]')
        const dateFromInput = wrapper.find('input[id="dateFrom"]')
        const dateToInput = wrapper.find('input[id="dateTo"]')

        expect((keywordInput.element as HTMLInputElement).value).toBe('')
        expect((categoryInput.element as HTMLInputElement).value).toBe('')
        expect((dateFromInput.element as HTMLInputElement).value).toBe('')
        expect((dateToInput.element as HTMLInputElement).value).toBe('')
    })

    it('should update search input when user types', async () => {
        const wrapper = mount(ArticleSearch)
        const keywordInput = wrapper.find('input[id="keyword"]')

        await keywordInput.setValue('Vue.js')

        expect((keywordInput.element as HTMLInputElement).value).toBe('Vue.js')
    })

    it('should update category input when user types', async () => {
        const wrapper = mount(ArticleSearch)
        const categoryInput = wrapper.find('input[id="category"]')

        await categoryInput.setValue('技術')

        expect((categoryInput.element as HTMLInputElement).value).toBe('技術')
    })

    it('should emit search event when search button is clicked', async () => {
        const wrapper = mount(ArticleSearch)

        await wrapper.find('input[id="keyword"]').setValue('Vue.js')
        await wrapper.find('input[id="category"]').setValue('技術')
        await wrapper.find('input[id="dateFrom"]').setValue('2024-01-01')
        await wrapper.find('input[id="dateTo"]').setValue('2024-01-31')

        const searchButton = wrapper.findAll('button').find(btn =>
            btn.text().includes('搜尋') && !btn.text().includes('顯示全部')
        )
        await searchButton?.trigger('click')

        expect(wrapper.emitted()).toHaveProperty('search')
        expect(wrapper.emitted().search[0]).toEqual([{
            keyword: 'Vue.js',
            category: '技術',
            dateFrom: '2024-01-01',
            dateTo: '2024-01-31'
        }])
    })

    it('should emit load-all event when load all button is clicked', async () => {
        const wrapper = mount(ArticleSearch)

        const loadAllButton = wrapper.findAll('button').find(btn =>
            btn.text().includes('顯示全部')
        )
        await loadAllButton?.trigger('click')

        expect(wrapper.emitted()).toHaveProperty('load-all')
    })

    it('should emit search event with empty fields when not filled', async () => {
        const wrapper = mount(ArticleSearch)

        const searchButton = wrapper.findAll('button').find(btn =>
            btn.text().includes('搜尋') && !btn.text().includes('顯示全部')
        )
        await searchButton?.trigger('click')

        expect(wrapper.emitted()).toHaveProperty('search')
        expect(wrapper.emitted().search[0]).toEqual([{
            keyword: '',
            category: '',
            dateFrom: '',
            dateTo: ''
        }])
    })

    it('should clear search form when clear button is clicked', async () => {
        const wrapper = mount(ArticleSearch)

        await wrapper.find('input[id="keyword"]').setValue('Vue.js')
        await wrapper.find('input[id="category"]').setValue('技術')
        await wrapper.find('input[id="dateFrom"]').setValue('2024-01-01')

        const clearButton = wrapper.findAll('button').find(btn =>
            btn.text().includes('清除')
        )
        await clearButton?.trigger('click')

        expect((wrapper.find('input[id="keyword"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[id="category"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[id="dateFrom"]').element as HTMLInputElement).value).toBe('')
    })

    it('should focus search input when component is mounted', async () => {
        const wrapper = mount(ArticleSearch, {
            attachTo: document.body
        })

        const keywordInput = wrapper.find('input[id="keyword"]')
        expect(document.activeElement).toBe(keywordInput.element)

        wrapper.unmount()
    })

    it('should handle Enter key in search input', async () => {
        const wrapper = mount(ArticleSearch)

        await wrapper.find('input[id="keyword"]').setValue('TypeScript')
        await wrapper.find('input[id="keyword"]').trigger('keyup.enter')

        expect(wrapper.emitted()).toHaveProperty('search')
        expect(wrapper.emitted().search[0]).toEqual([{
            keyword: 'TypeScript',
            category: '',
            dateFrom: '',
            dateTo: ''
        }])
    })

    it('should expose clear method for parent components', () => {
        const wrapper = mount(ArticleSearch)

        expect(wrapper.vm.clearSearch).toBeDefined()
        expect(typeof wrapper.vm.clearSearch).toBe('function')
    })

    it('should have proper search section styling', () => {
        const wrapper = mount(ArticleSearch)

        expect(wrapper.find('.search-section').exists()).toBe(true)
        expect(wrapper.findAll('.search-row')).toHaveLength(2)
        expect(wrapper.find('.button-group').exists()).toBe(true)
    })
})
