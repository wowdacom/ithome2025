import { Request, Response } from 'express'
import OpenAI from 'openai'

interface AIGenerateRequest {
    prompt: string
    context?: {
        title?: string
        content?: string
    }
    settings?: {
        model?: string
        temperature?: number
        max_tokens?: number
    }
}

export class AIController {
    private openai: OpenAI | null = null

    constructor() {
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            })
        }
    }

    async generateContent(req: Request, res: Response) {
        try {
            if (!this.openai) {
                return res.status(500).json({
                    success: false,
                    message: 'OpenAI API Key 未設定'
                })
            }

            const { prompt, context, settings }: AIGenerateRequest = req.body

            if (!prompt?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: '請提供有效的提示內容'
                })
            }

            // 構建完整的提示
            let fullPrompt = prompt

            if (context?.title || context?.content) {
                fullPrompt = `
文章標題: ${context.title || '未提供'}
文章內容: ${context.content || '未提供'}

用戶請求: ${prompt}

請根據以上內容和用戶請求，提供具體的建議或改寫內容。請確保回應內容實用、具體且符合繁體中文的表達習慣。`
            }

            const completion = await this.openai.chat.completions.create({
                model: settings?.model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: '你是一位專業的中文寫作助手，擅長協助用戶改善文章內容、結構和表達方式。請提供實用、具體的建議，並使用繁體中文回應。'
                    },
                    {
                        role: 'user',
                        content: fullPrompt
                    }
                ],
                temperature: settings?.temperature || 0.7,
                max_tokens: settings?.max_tokens || 1000
            })

            const content = completion.choices[0]?.message?.content

            if (!content) {
                return res.status(500).json({
                    success: false,
                    message: 'AI 未返回有效內容'
                })
            }

            res.json({
                success: true,
                content: content.trim(),
                usage: completion.usage
            })

        } catch (error) {
            console.error('AI 生成內容錯誤:', error)

            let errorMessage = '生成內容時發生錯誤'

            if (error instanceof Error) {
                if (error.message.includes('API key')) {
                    errorMessage = 'OpenAI API Key 無效或已過期'
                } else if (error.message.includes('quota')) {
                    errorMessage = 'API 使用額度已達上限'
                } else if (error.message.includes('rate limit')) {
                    errorMessage = 'API 請求頻率過高，請稍後再試'
                } else {
                    errorMessage = error.message
                }
            }

            res.status(500).json({
                success: false,
                message: errorMessage
            })
        }
    }

    async testConnection(req: Request, res: Response) {
        try {
            if (!this.openai) {
                return res.status(500).json({
                    success: false,
                    message: 'OpenAI API Key 未設定'
                })
            }

            // 簡單的測試請求
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: '請回覆「連接測試成功」'
                    }
                ],
                max_tokens: 10
            })

            const content = completion.choices[0]?.message?.content

            res.json({
                success: true,
                message: '連接測試成功',
                response: content
            })

        } catch (error) {
            console.error('AI 連接測試錯誤:', error)

            let errorMessage = '連接測試失敗'

            if (error instanceof Error) {
                if (error.message.includes('API key')) {
                    errorMessage = 'OpenAI API Key 無效或已過期'
                } else if (error.message.includes('quota')) {
                    errorMessage = 'API 使用額度已達上限'
                } else {
                    errorMessage = error.message
                }
            }

            res.status(500).json({
                success: false,
                message: errorMessage
            })
        }
    }
}