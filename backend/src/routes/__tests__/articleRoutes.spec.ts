import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import { articleRoutes } from '../articleRoutes'
import { InMemoryArticleRepository } from '@/repositories/InMemoryArticleRepository'

describe('Article Routes', () => {
    let app: FastifyInstance
    let repository: InMemoryArticleRepository

    beforeEach(async () => {
        // Red: 建立乾淨的 Fastify 實例
        app = Fastify({ logger: false })
        repository = new InMemoryArticleRepository()

        // 註冊文章路由
        await app.register(articleRoutes, { repository })
    })

    afterEach(async () => {
        await app.close()
    })

    describe('GET /api/articles', () => {
        it('should return empty array when no articles exist', async () => {
            // Red: 測試獲取空文章列表
            const response = await app.inject({
                method: 'GET',
                url: '/api/articles'
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toEqual([])
        })

        it('should return all articles', async () => {
            // Red: 測試獲取所有文章
            const article1 = await repository.create({
                title: 'First Article',
                content: 'First content',
                category: 'test'
            })

            const article2 = await repository.create({
                title: 'Second Article',
                content: 'Second content',
                category: 'test'
            })

            const response = await app.inject({
                method: 'GET',
                url: '/api/articles'
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toHaveLength(2)
            expect(body.data[0].id).toBe(article1.id)
            expect(body.data[1].id).toBe(article2.id)
        })
    })

    describe('GET /api/articles/:id', () => {
        it('should return article by id', async () => {
            // Red: 測試根據 ID 獲取文章
            const article = await repository.create({
                title: 'Test Article',
                content: 'Test content',
                category: 'test'
            })

            const response = await app.inject({
                method: 'GET',
                url: `/api/articles/${article.id}`
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data.id).toBe(article.id)
            expect(body.data.title).toBe('Test Article')
        })

        it('should return 404 for non-existent article', async () => {
            // Red: 測試獲取不存在的文章
            const response = await app.inject({
                method: 'GET',
                url: '/api/articles/non-existent-id'
            })

            expect(response.statusCode).toBe(404)
            const body = JSON.parse(response.body)
            expect(body.error).toBe('Article not found')
        })
    })

    describe('POST /api/articles', () => {
        it('should create new article', async () => {
            // Red: 測試新增文章
            const newArticle = {
                title: 'New Article',
                content: 'New content',
                category: 'new'
            }

            const response = await app.inject({
                method: 'POST',
                url: '/api/articles',
                payload: newArticle
            })

            expect(response.statusCode).toBe(201)
            const body = JSON.parse(response.body)
            expect(body.data.title).toBe(newArticle.title)
            expect(body.data.content).toBe(newArticle.content)
            expect(body.data.category).toBe(newArticle.category)
            expect(body.data.id).toBeDefined()
            expect(body.data.slug).toBe('new-article')
            expect(body.data.created_at).toBeDefined()
        })

        it('should validate required fields', async () => {
            // Red: 測試必填欄位驗證
            const invalidArticle = {
                title: '',
                content: 'Content without title',
                category: 'test'
            }

            const response = await app.inject({
                method: 'POST',
                url: '/api/articles',
                payload: invalidArticle
            })

            expect(response.statusCode).toBe(400)
            const body = JSON.parse(response.body)
            expect(body.error).toContain('Title is required')
        })

        it('should validate field lengths', async () => {
            // Red: 測試欄位長度驗證
            const invalidArticle = {
                title: 'a'.repeat(201), // 超過最大長度
                content: 'Valid content',
                category: 'test'
            }

            const response = await app.inject({
                method: 'POST',
                url: '/api/articles',
                payload: invalidArticle
            })

            expect(response.statusCode).toBe(400)
            const body = JSON.parse(response.body)
            expect(body.error).toContain('Title too long')
        })
    })

    describe('PUT /api/articles/:id', () => {
        it('should update existing article', async () => {
            // Red: 測試更新文章
            const article = await repository.create({
                title: 'Original Title',
                content: 'Original content',
                category: 'original'
            })

            const updateData = {
                title: 'Updated Title',
                content: 'Updated content'
            }

            const response = await app.inject({
                method: 'PUT',
                url: `/api/articles/${article.id}`,
                payload: updateData
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data.title).toBe('Updated Title')
            expect(body.data.content).toBe('Updated content')
            expect(body.data.category).toBe('original') // 未更新欄位保持原值
            expect(body.data.updated_at).toBeDefined()
        })

        it('should return 404 for non-existent article', async () => {
            // Red: 測試更新不存在的文章
            const response = await app.inject({
                method: 'PUT',
                url: '/api/articles/non-existent-id',
                payload: { title: 'New Title' }
            })

            expect(response.statusCode).toBe(404)
            const body = JSON.parse(response.body)
            expect(body.error).toBe('Article not found')
        })

        it('should validate update data', async () => {
            // Red: 測試更新資料驗證
            const article = await repository.create({
                title: 'Test',
                content: 'Test',
                category: 'test'
            })

            const response = await app.inject({
                method: 'PUT',
                url: `/api/articles/${article.id}`,
                payload: {} // 空的更新資料
            })

            expect(response.statusCode).toBe(400)
            const body = JSON.parse(response.body)
            expect(body.error).toContain('At least one field must be provided')
        })
    })

    describe('DELETE /api/articles/:id', () => {
        it('should delete existing article', async () => {
            // Red: 測試刪除文章
            const article = await repository.create({
                title: 'To Delete',
                content: 'Will be deleted',
                category: 'deletable'
            })

            const response = await app.inject({
                method: 'DELETE',
                url: `/api/articles/${article.id}`
            })

            expect(response.statusCode).toBe(204)
            expect(response.body).toBe('')

            // 驗證文章已被刪除
            const checkResponse = await app.inject({
                method: 'GET',
                url: `/api/articles/${article.id}`
            })
            expect(checkResponse.statusCode).toBe(404)
        })

        it('should return 404 for non-existent article', async () => {
            // Red: 測試刪除不存在的文章
            const response = await app.inject({
                method: 'DELETE',
                url: '/api/articles/non-existent-id'
            })

            expect(response.statusCode).toBe(404)
            const body = JSON.parse(response.body)
            expect(body.error).toBe('Article not found')
        })
    })

    describe('GET /api/articles/search', () => {
        beforeEach(async () => {
            // 建立測試資料
            await repository.create({
                title: 'JavaScript Tips',
                content: 'Learn JavaScript',
                category: 'programming'
            })

            await repository.create({
                title: 'Python Guide',
                content: 'Learn Python',
                category: 'programming'
            })

            await repository.create({
                title: 'Cooking Recipe',
                content: 'How to cook',
                category: 'food'
            })
        })

        it('should search by keyword', async () => {
            // Red: 測試關鍵字搜尋
            const response = await app.inject({
                method: 'GET',
                url: '/api/articles/search?keyword=JavaScript'
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toHaveLength(1)
            expect(body.data[0].title).toBe('JavaScript Tips')
        })

        it('should search by category', async () => {
            // Red: 測試類別搜尋
            const response = await app.inject({
                method: 'GET',
                url: '/api/articles/search?category=programming'
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toHaveLength(2)
            expect(body.data.every((article: any) => article.category === 'programming')).toBe(true)
        })

        it('should search with multiple filters', async () => {
            // Red: 測試複合搜尋
            const response = await app.inject({
                method: 'GET',
                url: '/api/articles/search?keyword=Python&category=programming'
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toHaveLength(1)
            expect(body.data[0].title).toBe('Python Guide')
        })

        it('should return empty array when no matches found', async () => {
            // Red: 測試無搜尋結果
            const response = await app.inject({
                method: 'GET',
                url: '/api/articles/search?keyword=NonExistent'
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toEqual([])
        })
    })
})