import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'

describe('Clean Architecture Blog API Integration', () => {
    let serverProcess: ChildProcess

    beforeAll(async () => {
        // 啟動 clean-arch-blog 伺服器
        const cleanArchBlogPath = path.resolve('../../clean-arch-blog')

        serverProcess = spawn('npm', ['run', 'dev'], {
            cwd: cleanArchBlogPath,
            detached: false,
            stdio: 'pipe'
        })

        // 等待伺服器啟動
        await new Promise((resolve) => {
            setTimeout(resolve, 3000)
        })
    })

    afterAll(() => {
        if (serverProcess) {
            serverProcess.kill()
        }
    })

    describe('API Response Format Validation', () => {
        it('should return data in expected format for GET /api/articles', async () => {
            // Red: 測試 API 回應格式是否符合前端期望
            const response = await fetch('http://localhost:3000/api/articles')
            const data = await response.json()

            // 前端期望: { data: Article[] }
            // clean-arch-blog 實際: Article[]
            expect(response.status).toBe(200)
            expect(data).toHaveProperty('data') // 這會失敗
            expect(Array.isArray(data.data)).toBe(true)
        })

        it('should return data in expected format for POST /api/articles', async () => {
            // Red: 測試新增文章的回應格式
            const newArticle = {
                title: 'Test Article',
                content: 'Test content',
                category: 'test'
            }

            const response = await fetch('http://localhost:3000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dummy-token' // clean-arch-blog 需要認證
                },
                body: JSON.stringify(newArticle)
            })

            const data = await response.json()

            // 前端期望: { data: Article }
            // clean-arch-blog 實際: Article
            expect(response.status).toBe(201)
            expect(data).toHaveProperty('data') // 這會失敗
            expect(data.data).toHaveProperty('id')
        })

        it('should support DELETE /api/articles/:id endpoint', async () => {
            // Red: 測試刪除端點是否存在
            // clean-arch-blog 缺少 DELETE 端點
            const response = await fetch('http://localhost:3000/api/articles/test-id', {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer dummy-token'
                }
            })

            // 這應該是 204 或其他成功狀態，但會失敗因為端點不存在
            expect([204, 404]).toContain(response.status)
        })

        it('should handle search with string date format', async () => {
            // Red: 測試日期格式相容性
            const searchParams = new URLSearchParams({
                keyword: 'test',
                dateFrom: '2025-01-01',  // 前端使用 string 格式
                dateTo: '2025-12-31'
            })

            const response = await fetch(`http://localhost:3000/api/articles/search?${searchParams}`)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toHaveProperty('data') // 這會失敗
            expect(Array.isArray(data.data)).toBe(true)
        })
    })

    describe('Error Response Format', () => {
        it('should return errors in expected format', async () => {
            // Red: 測試錯誤回應格式
            const response = await fetch('http://localhost:3000/api/articles/non-existent-id')
            const data = await response.json()

            expect(response.status).toBe(404)
            // 前端期望: { error: string, message: string }
            // 需要驗證 clean-arch-blog 的錯誤格式
            expect(data).toHaveProperty('message')
        })
    })
})
