import { z } from 'zod';

export const aiAssistSchema = z.object({
    prompt: z.string().min(1, 'PROMPT_REQUIRED'),
    articleContent: z.string().optional(),
    articleId: z.string().optional(),
});

export type AiAssistRequestDTO = z.infer<typeof aiAssistSchema>;
