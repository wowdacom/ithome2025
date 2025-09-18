import 'dotenv/config';
import { SupabaseArticleRepository } from '../src/data/SupabaseArticleRepository';

async function main() {
    const repo = new SupabaseArticleRepository();
    try {
        const articles = await repo.getAll();
        if (!articles.length) {
            console.log('（目前無文章）');
            return;
        }
        articles.forEach(a => {
            console.log(`[${a.category}] ${a.title} - ${a.content}`);
        });
    } catch (e: any) {
        console.error('❌ 讀取失敗：', e.message);
        process.exit(2);
    }
}

main();