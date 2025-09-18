import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryArticleRepository } from '../InMemoryArticleRepository'
import type { Article, CreateArticleRequest, UpdateArticleRequest, SearchFilters } from '@/types/article'

describe('InMemoryArticleRepository', () => {
    let repository: InMemoryArticleRepository

    beforeEach(() => {
        // Red: 每個測試都從乾淨的狀態開始
        repository = new InMemoryArticleRepository()
    })

    it('should start with empty articles list', async () => {
        // Red: 驗證初始狀態為空
        const articles = await repository.findAll()
        expect(articles).toEqual([])
    })

    it('should create article with generated id and slug', async () => {
        // Red: 測試新增文章功能
        const createData: CreateArticleRequest = {
            title: 'Test Article',
            content: 'Test content',
            category: 'test'
        }

        const article = await repository.create(createData)

        expect(article.id).toBeDefined()
        expect(article.title).toBe(createData.title)
        expect(article.content).toBe(createData.content)
        expect(article.category).toBe(createData.category)
        expect(article.slug).toBe('test-article')
        expect(article.created_at).toBeDefined()
        expect(article.updated_at).toBeUndefined()
    })

    it('should find article by id', async () => {
        // Red: 測試根據 ID 查找文章
        const createData: CreateArticleRequest = {
            title: 'Find Me',
            content: 'Content to find',
            category: 'findable'
        }

        const created = await repository.create(createData)
        const found = await repository.findById(created.id)

        expect(found).toEqual(created)
    })

    it('should return null for non-existent article', async () => {
        // Red: 測試查找不存在的文章
        const found = await repository.findById('non-existent-id')
        expect(found).toBeNull()
    })

    it('should update existing article', async () => {
        // Red: 測試更新文章功能
        const createData: CreateArticleRequest = {
            title: 'Original Title',
            content: 'Original content',
            category: 'original'
        }

        const created = await repository.create(createData)

        const updateData: UpdateArticleRequest = {
            title: 'Updated Title',
            content: 'Updated content'
        }

        const updated = await repository.update(created.id, updateData)

        expect(updated).toBeTruthy()
        expect(updated!.id).toBe(created.id)
        expect(updated!.title).toBe('Updated Title')
        expect(updated!.content).toBe('Updated content')
        expect(updated!.category).toBe('original') // 未更新的欄位保持原值
        expect(updated!.slug).toBe('updated-title') // slug 應該根據新標題更新
        expect(updated!.created_at).toBe(created.created_at)
        expect(updated!.updated_at).toBeDefined()
    })

    it('should return null when updating non-existent article', async () => {
        // Red: 測試更新不存在的文章
        const updateData: UpdateArticleRequest = {
            title: 'New Title'
        }

        const result = await repository.update('non-existent-id', updateData)
        expect(result).toBeNull()
    })

    it('should delete existing article', async () => {
        // Red: 測試刪除文章功能
        const createData: CreateArticleRequest = {
            title: 'To Delete',
            content: 'Will be deleted',
            category: 'deletable'
        }

        const created = await repository.create(createData)
        const deleted = await repository.delete(created.id)

        expect(deleted).toBe(true)

        // 驗證文章已被刪除
        const found = await repository.findById(created.id)
        expect(found).toBeNull()

        // 驗證文章不在列表中
        const allArticles = await repository.findAll()
        expect(allArticles).not.toContain(created)
    })

    it('should return false when deleting non-existent article', async () => {
        // Red: 測試刪除不存在的文章
        const result = await repository.delete('non-existent-id')
        expect(result).toBe(false)
    })

    it('should search articles by keyword', async () => {
        // Red: 測試關鍵字搜尋
        const articles = [
            { title: 'JavaScript Tips', content: 'Learn JS', category: 'programming' },
            { title: 'Python Guide', content: 'Learn Python', category: 'programming' },
            { title: 'Cooking Recipe', content: 'How to cook', category: 'food' }
        ]

        // 建立測試資料
        for (const data of articles) {
            await repository.create(data)
        }

        // 搜尋標題中包含 'Script' 的文章
        const filters: SearchFilters = { keyword: 'Script' }
        const results = await repository.search(filters)

        expect(results).toHaveLength(1)
        expect(results[0].title).toBe('JavaScript Tips')
    })

    it('should search articles by category', async () => {
        // Red: 測試類別搜尋
        const articles = [
            { title: 'JS Article', content: 'JS content', category: 'programming' },
            { title: 'Recipe', content: 'Food content', category: 'food' },
            { title: 'Python Article', content: 'Python content', category: 'programming' }
        ]

        for (const data of articles) {
            await repository.create(data)
        }

        const filters: SearchFilters = { category: 'programming' }
        const results = await repository.search(filters)

        expect(results).toHaveLength(2)
        expect(results.every(article => article.category === 'programming')).toBe(true)
    })

    it('should search articles by date range', async () => {
        // Red: 測試日期範圍搜尋
        const article1 = await repository.create({
            title: 'Old Article',
            content: 'Old content',
            category: 'test'
        })

        // 模擬不同的建立時間
        const repository2 = new InMemoryArticleRepository()
        const article2 = await repository2.create({
            title: 'New Article',
            content: 'New content',
            category: 'test'
        })

        // 搜尋特定日期範圍的文章
        const today = new Date().toISOString().split('T')[0]
        const filters: SearchFilters = {
            dateFrom: today,
            dateTo: today
        }

        const results = await repository2.search(filters)
        expect(results).toHaveLength(1)
        expect(results[0].title).toBe('New Article')
    })

    it('should handle complex search with multiple filters', async () => {
        // Red: 測試複合搜尋條件
        const articles = [
            { title: 'JavaScript Advanced', content: 'Advanced JS tips', category: 'programming' },
            { title: 'JavaScript Basics', content: 'Basic JS concepts', category: 'tutorial' },
            { title: 'Python Advanced', content: 'Advanced Python', category: 'programming' }
        ]

        for (const data of articles) {
            await repository.create(data)
        }

        const filters: SearchFilters = {
            keyword: 'JavaScript',
            category: 'programming'
        }

        const results = await repository.search(filters)
        expect(results).toHaveLength(1)
        expect(results[0].title).toBe('JavaScript Advanced')
    })
})