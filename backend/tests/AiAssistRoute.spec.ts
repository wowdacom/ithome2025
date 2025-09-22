import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/presentation/http/server';

// 整合測試：確保 /api/ai/assist 正確運作

describe('POST /api/ai/assist', () => {
    const app = createApp();

    it('should return improvedContent and promptLog', async () => {
        const res = await request(app)
            .post('/api/ai/assist')
            .send({ prompt: '請調整語氣更正式', articleContent: '這是一篇文章內容' })
            .expect(200);

        expect(res.body.improvedContent).toBeDefined();
        expect(res.body.promptLog).toBeDefined();
        expect(res.body.promptLog.prompt).toBe('請調整語氣更正式');
    });

    it('should 400 when prompt missing', async () => {
        const res = await request(app)
            .post('/api/ai/assist')
            .send({ prompt: '' })
            .expect(400);
        expect(res.body.message).toBeDefined();
    });
});
