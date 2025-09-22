export interface PromptLog {
    id: string;
    articleId?: string; // optional when prompt is generic
    prompt: string;
    response: string;
    createdAt: Date;
}
