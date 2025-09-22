import OpenAI from 'openai';
import { ENV } from '../config/env.js';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OpenAIResponse {
    content: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: ENV.OPENAI_API_KEY,
        });
    }

    async generateResponse(
        messages: ChatMessage[],
        options?: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
        }
    ): Promise<OpenAIResponse> {
        try {
            const response = await this.openai.chat.completions.create({
                model: options?.model || 'gpt-3.5-turbo',
                messages: messages,
                temperature: options?.temperature || 0.7,
                max_tokens: options?.maxTokens || 1500,
            });

            const choice = response.choices[0];
            if (!choice?.message?.content) {
                throw new Error('OpenAI API did not return valid content');
            }

            return {
                content: choice.message.content,
                usage: response.usage ? {
                    prompt_tokens: response.usage.prompt_tokens,
                    completion_tokens: response.usage.completion_tokens,
                    total_tokens: response.usage.total_tokens,
                } : undefined,
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to generate AI response');
        }
    }

    async generateArticleAssistance(
        prompt: string,
        articleContent?: string
    ): Promise<string> {
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `你是一個專業的文章寫作助手。你擅長：
- 改善文章結構和流暢度
- 提供內容建議和擴展
- 修正文法和用詞
- 優化SEO和可讀性
請根據用戶的需求提供有幫助的建議。`
            },
            {
                role: 'user',
                content: articleContent
                    ? `文章內容：\n${articleContent}\n\n需求：${prompt}`
                    : prompt
            }
        ];

        const response = await this.generateResponse(messages, {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 2000,
        });

        return response.content;
    }

    async generateBlogPost(
        topic: string,
        options?: {
            style?: string;
            length?: 'short' | 'medium' | 'long';
            includeOutline?: boolean;
        }
    ): Promise<string> {
        const lengthInstructions = {
            short: '約300-500字',
            medium: '約800-1200字',
            long: '約1500-2500字'
        };

        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `你是一個專業的部落格文章撰寫助手。請根據指定的主題創作高品質的部落格文章。
文章應該：
- 結構清晰，有吸引人的標題
- 內容豐富且有價值
- 適合網路閱讀
- 包含適當的段落分隔
${options?.includeOutline ? '- 先提供文章大綱，再提供完整內容' : ''}`
            },
            {
                role: 'user',
                content: `請為以下主題撰寫一篇部落格文章：
主題：${topic}
${options?.style ? `風格：${options.style}` : ''}
長度：${lengthInstructions[options?.length || 'medium']}`
            }
        ];

        const response = await this.generateResponse(messages, {
            model: 'gpt-3.5-turbo',
            temperature: 0.8,
            maxTokens: 3000,
        });

        return response.content;
    }
}