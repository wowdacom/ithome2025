import type { PromptLogRepository } from "../data/PromptLogRepository";
import type { PromptLog } from "../domain/PromptLog";

export interface AiAssistInput {
    prompt: string;
    articleContent?: string; // optional existing content to refine
    articleId?: string;
}

export interface AiAssistResult {
    improvedContent: string;
    originalPrompt: string;
    rawResponse: string;
    log: PromptLog;
}

export interface OpenAiClientLike {
    createCompletion(prompt: string): Promise<string>;
}

export class AiAssistService {
    constructor(private logs: PromptLogRepository, private llm: OpenAiClientLike) { }

    async assist(input: AiAssistInput): Promise<AiAssistResult> {
        if (!input.prompt?.trim()) {
            throw new Error('PROMPT_REQUIRED');
        }

        const base = input.articleContent ? `Given the existing article content below, improve it according to the instruction.\nInstruction: ${input.prompt}\n---\nCONTENT:\n${input.articleContent}` : input.prompt;

        const raw = await this.llm.createCompletion(base);

        const improved = raw.trim();

        const saved = await this.logs.save({
            articleId: input.articleId,
            prompt: input.prompt,
            response: improved,
        });

        return {
            improvedContent: improved,
            originalPrompt: input.prompt,
            rawResponse: raw,
            log: saved,
        };
    }
}
