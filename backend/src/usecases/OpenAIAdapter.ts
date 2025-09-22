import { OpenAIService } from '../data/OpenAIService.js';
import type { OpenAiClientLike } from './AiAssistService.js';

export class OpenAIAdapter implements OpenAiClientLike {
    constructor(private openaiService: OpenAIService) { }

    async createCompletion(prompt: string): Promise<string> {
        return await this.openaiService.generateArticleAssistance(prompt);
    }
}