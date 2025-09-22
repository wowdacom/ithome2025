import { describe, it, expect, vi } from 'vitest';
import { AiAssistService } from '../src/usecases/AiAssistService';
import { InMemoryPromptLogRepository } from '../src/data/PromptLogRepository';

class FakeLLM {
    createCompletion = vi.fn(async (prompt: string) => {
        return `IMPROVED: ${prompt.slice(0, 40)}`;
    });
}

describe('AiAssistService', () => {
    it('should create improved content and log prompt/response', async () => {
        const repo = new InMemoryPromptLogRepository();
        const llm = new FakeLLM();
        const svc = new AiAssistService(repo, llm);

        const result = await svc.assist({ prompt: '請加強語氣', articleContent: '原始內容 ABC' });

        expect(result.improvedContent).toMatch(/^IMPROVED:/);
        expect(result.log.id).toBeDefined();
        expect(result.log.prompt).toBe('請加強語氣');
        expect(result.log.response).toBe(result.improvedContent);
        expect(llm.createCompletion).toHaveBeenCalledOnce();
    });

    it('should throw if prompt empty', async () => {
        const repo = new InMemoryPromptLogRepository();
        const llm = new FakeLLM();
        const svc = new AiAssistService(repo, llm);
        await expect(svc.assist({ prompt: '   ' })).rejects.toThrow('PROMPT_REQUIRED');
    });
});
