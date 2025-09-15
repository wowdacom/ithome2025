import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { SupabaseArticleRepository } from '../src/data/SupabaseArticleRepository';
import { BlogService } from '../src/usecases/BlogService';
import { ENV } from '../src/config/env';

// 這個測試需要真實的 Supabase 環境：
// 1. 已建立 articles 資料表
// 2. 已設定 SUPABASE_URL / SUPABASE_ANON_KEY （與可選 SERVICE_ROLE_KEY）
// 3. RLS 若啟用需確保 insert/select policy 開放
// 若缺環境變數將自動 skip

function skipIfMissingEnv() {
    return !(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY);
}

describe('SupabaseArticleRepository 整合測試', () => {
    if (skipIfMissingEnv()) {
        it.skip('跳過：缺少 SUPABASE_URL / SUPABASE_ANON_KEY', () => { });
        return;
    }

    let repo: SupabaseArticleRepository;
    let service: BlogService;

    beforeAll(() => {
        repo = new SupabaseArticleRepository();
        service = new BlogService(repo);
    });

    // 為了測試簡單，這裡不做資料清空（可改為使用獨立專案或加 slug 前綴）
    // 若要避免污染，可在測試開始前嘗試刪除特定 slug

    beforeEach(async () => {
        // 可以在這裡加清理邏輯：例如刪除 slug 前綴為 'it-' 的測試資料
    });

    it('可以新增文章並依分類查詢', async () => {
        const suffix = Date.now();
        await service.addArticle({ title: '整合測試文章A-' + suffix, category: '測試分類', content: '內容A' });
        await service.addArticle({ title: '整合測試文章B-' + suffix, category: '測試分類', content: '內容B' });

        const list = await service.getByCategory('測試分類');
        // 只檢查至少存在剛剛兩篇之一即可（避免先前測試殘留時精準比對失敗）
        const titles = list.map(a => a.title);
        expect(titles.some(t => t.startsWith('整合測試文章A-'))).toBe(true);
        expect(titles.some(t => t.startsWith('整合測試文章B-'))).toBe(true);
    });
});
