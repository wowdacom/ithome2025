export interface AIAssistRequest {
    prompt: string
    articleContent?: string
    articleId?: string
}

export interface AIAssistResponse {
    success: boolean
    improvedContent: string
    promptLog?: {
        id: string
        prompt: string
        response: string
        createdAt: string
    }
    error?: string
}

class AIService {
    private readonly baseURL = '/api/ai'

    async generateContent(request: AIAssistRequest): Promise<AIAssistResponse> {
        try {
            const response = await fetch(`${this.baseURL}/assist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: request.prompt,
                    articleContent: request.articleContent,
                    articleId: request.articleId
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            return {
                success: true,
                improvedContent: data.improvedContent,
                promptLog: data.promptLog
            }
        } catch (error) {
            console.error('AI 服務錯誤:', error)
            return {
                success: false,
                improvedContent: '',
                error: error instanceof Error ? error.message : '未知錯誤'
            }
        }
    }

    async testConnection(): Promise<{ success: boolean; error?: string }> {
        try {
            // 使用簡單的測試請求
            const testResult = await this.generateContent({
                prompt: '請回覆「連接測試成功」'
            })

            if (testResult.success && testResult.improvedContent.includes('成功')) {
                return { success: true }
            } else {
                return {
                    success: false,
                    error: testResult.error || '測試回應不符合預期'
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : '連接測試失敗'
            }
        }
    }
}

export const aiService = new AIService()
