import 'dotenv/config';
import { SupabaseArticleRepository } from '../src/data/SupabaseArticleRepository';
import { BlogService } from '../src/usecases/BlogService';

// 用法：
// npm run add:article -- "標題" 類別 "內容..."
// 若缺參數會給出提示

async function main() {
  const [, , rawTitle, rawCategory, rawContent] = process.argv;
  if (!rawTitle || !rawCategory || !rawContent) {
    console.error('參數不足：npm run add:article -- "標題" 類別 "內容"');
    process.exit(1);
  }

  const repo = new SupabaseArticleRepository();
  const service = new BlogService(repo);
  try {
    await service.addArticle({ title: rawTitle, category: rawCategory, content: rawContent });
    console.log('✅ 已新增文章：', { title: rawTitle, category: rawCategory });
  } catch (e: any) {
    console.error('❌ 新增失敗：', e.message);
    process.exit(2);
  }
}

main();
