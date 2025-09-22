import type { PromptLog } from "../domain/PromptLog";

export interface PromptLogRepository {
    save(log: Omit<PromptLog, 'id' | 'createdAt'>): Promise<PromptLog>;
    listByArticle(articleId: string): Promise<PromptLog[]>;
    listAll(): Promise<PromptLog[]>;
}

export class InMemoryPromptLogRepository implements PromptLogRepository {
    private logs: PromptLog[] = [];

    async save(log: Omit<PromptLog, 'id' | 'createdAt'>): Promise<PromptLog> {
        const record: PromptLog = { id: crypto.randomUUID(), createdAt: new Date(), ...log };
        this.logs.push(record);
        return record;
    }

    async listByArticle(articleId: string): Promise<PromptLog[]> {
        return this.logs.filter(l => l.articleId === articleId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async listAll(): Promise<PromptLog[]> {
        return [...this.logs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
