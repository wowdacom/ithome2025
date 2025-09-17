import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryArticleRepositoryAsync } from '../src/data/InMemoryArticleRepository';
import { BlogService } from '../src/usecases/BlogService';
import type { Article } from '../src/domain/Article';

describe('BlogService - 更新與搜尋功能', () => {
  let repo: InMemoryArticleRepositoryAsync;
  let service: BlogService;

  beforeEach(() => {
    repo = new InMemoryArticleRepositoryAsync();
    service = new BlogService(repo);
  });

  describe('updateArticle', () => {
    it('可以更新現有文章', async () => {
      // 先新增一篇文章
      await service.addArticle({
        title: '原始標題',
        category: '原始分類',
        content: '原始內容'
      });

      // 取得文章 ID
      const articles = await service.getAllArticles();
      const articleId = articles[0].id!;

      // 更新文章
      await service.updateArticle(articleId, {
        title: '更新後標題',
        category: '更新後分類'
      });

      // 驗證更新結果
      const updated = await service.getById(articleId);
      expect(updated).toEqual(expect.objectContaining({
        id: articleId,
        title: '更新後標題',
        category: '更新後分類',
        content: '原始內容' // 未更新的欄位保持不變
      }));
      expect(updated!.updated_at).toBeDefined();
    });

    it('更新不存在的文章時拋出錯誤', async () => {
      await expect(
        service.updateArticle('not-exist', { title: '新標題' })
      ).rejects.toThrowError('找不到指定的文章');
    });

    it('更新空白標題時拋出錯誤', async () => {
      await service.addArticle({
        title: '測試',
        category: '測試',
        content: '測試'
      });
      const articles = await service.getAllArticles();
      const articleId = articles[0].id!;

      await expect(
        service.updateArticle(articleId, { title: '   ' })
      ).rejects.toThrowError('標題不可為空白');
    });
  });

  describe('searchArticles', () => {
    beforeEach(async () => {
      // 準備測試資料
      await service.addArticle({
        title: 'TypeScript 入門教學',
        category: '程式設計',
        content: '這是一篇關於 TypeScript 的詳細教學文章'
      });

      await service.addArticle({
        title: 'JavaScript ES6 特性',
        category: '程式設計',
        content: '介紹 ES6 的新功能和語法'
      });

      await service.addArticle({
        title: '旅遊心得分享',
        category: '生活分享',
        content: '最近去日本旅遊的經驗分享'
      });
    });

    it('可以依關鍵字搜尋標題', async () => {
      const results = await service.searchArticles({ keyword: 'TypeScript' });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('TypeScript 入門教學');
    });

    it('可以依關鍵字搜尋內容', async () => {
      const results = await service.searchArticles({ keyword: '教學' });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('TypeScript 入門教學');
    });

    it('可以依分類搜尋', async () => {
      const results = await service.searchArticles({ category: '程式設計' });
      expect(results).toHaveLength(2);
      expect(results.map(a => a.title)).toContain('TypeScript 入門教學');
      expect(results.map(a => a.title)).toContain('JavaScript ES6 特性');
    });

    it('可以組合多個搜尋條件', async () => {
      const results = await service.searchArticles({
        keyword: 'JavaScript',
        category: '程式設計'
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript ES6 特性');
    });

    it('沒有符合條件時回傳空陣列', async () => {
      const results = await service.searchArticles({ keyword: '不存在的關鍵字' });
      expect(results).toHaveLength(0);
    });

    it('空白搜尋條件會被忽略', async () => {
      const results = await service.searchArticles({
        keyword: '   ',
        category: ''
      });
      // 應該回傳所有文章（因為沒有有效的搜尋條件）
      expect(results).toHaveLength(3);
    });
  });

  describe('getById', () => {
    it('可以依 ID 取得文章', async () => {
      await service.addArticle({
        title: '測試文章',
        category: '測試',
        content: '測試內容'
      });

      const articles = await service.getAllArticles();
      const articleId = articles[0].id!;

      const article = await service.getById(articleId);
      expect(article).toEqual(expect.objectContaining({
        id: articleId,
        title: '測試文章',
        category: '測試',
        content: '測試內容'
      }));
    });

    it('找不到文章時回傳 null', async () => {
      const article = await service.getById('not-exist');
      expect(article).toBeNull();
    });

    it('空白 ID 時拋出錯誤', async () => {
      await expect(
        service.getById('   ')
      ).rejects.toThrowError('文章 ID 不可為空');
    });
  });

  describe('getAllArticles', () => {
    it('可以取得所有文章', async () => {
      await service.addArticle({ title: '文章1', category: '分類1', content: '內容1' });
      await service.addArticle({ title: '文章2', category: '分類2', content: '內容2' });

      const articles = await service.getAllArticles();
      expect(articles).toHaveLength(2);
      expect(articles.map(a => a.title)).toContain('文章1');
      expect(articles.map(a => a.title)).toContain('文章2');
    });

    it('沒有文章時回傳空陣列', async () => {
      const articles = await service.getAllArticles();
      expect(articles).toHaveLength(0);
    });
  });
});