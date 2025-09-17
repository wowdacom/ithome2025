import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import express from 'express';
import path from 'path';
import { InMemoryArticleRepositoryAsync } from '../src/data/InMemoryArticleRepository';
import { BlogService } from '../src/usecases/BlogService';
import { ArticleController } from '../src/presentation/http/controllers/ArticleController';
import { buildArticleRoutes } from '../src/presentation/http/routes/articleRoutes';
import { errorHandler } from '../src/presentation/http/middlewares/errorHandler';
import { notFound } from '../src/presentation/http/middlewares/notFound';

// 在任何模組匯入前設定環境變數
process.env.DISABLE_AUTH = 'true';

describe('Article API - 完整 CRUD 與搜尋', () => {
  let app: Express;

  function createTestApp() {
    const repository = new InMemoryArticleRepositoryAsync();
    const service = new BlogService(repository);
    const controller = new ArticleController(service);

    const testApp = express();
    testApp.use(express.json());

    // 確保靜態檔案路徑正確 - 指向專案的 public 目錄
    const publicPath = path.resolve(__dirname, '../public');
    testApp.use(express.static(publicPath));

    testApp.use("/api", buildArticleRoutes(controller));
    testApp.get('/', (req, res) => res.redirect('/admin.html'));
    testApp.get('/admin', (req, res) => res.redirect('/admin.html'));
    testApp.use(notFound);
    testApp.use(errorHandler);

    return testApp;
  }

  beforeEach(() => {
    app = createTestApp();
  });

  afterAll(() => {
    delete process.env.DISABLE_AUTH;
  });

  describe('POST /api/articles - 新增文章', () => {
    it('可以新增文章', async () => {
      const response = await request(app)
        .post('/api/articles')
        .send({
          title: '測試文章',
          category: '測試分類',
          content: '測試內容'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: '測試文章',
        category: '測試分類',
        content: '測試內容',
        created_at: expect.any(String)
      }));
    });

    it('缺少必要欄位時回傳 400', async () => {
      const response = await request(app)
        .post('/api/articles')
        .send({
          title: '測試文章'
          // 缺少 category 和 content
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('分類不可為空白');
    });
  });

  describe('GET /api/articles - 取得所有文章', () => {
    beforeEach(async () => {
      // 新增測試資料
      await request(app)
        .post('/api/articles')
        .send({ title: '文章1', category: '分類A', content: '內容1' });

      await request(app)
        .post('/api/articles')
        .send({ title: '文章2', category: '分類B', content: '內容2' });
    });

    it('可以取得所有文章列表', async () => {
      const response = await request(app)
        .get('/api/articles');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/articles/:id - 取得單一文章', () => {
    it('可以依 ID 取得文章', async () => {
      // 先新增一篇文章
      const createResponse = await request(app)
        .post('/api/articles')
        .send({ title: '測試文章', category: '測試', content: '測試內容' });

      const articleId = createResponse.body.id;

      // 取得文章
      const response = await request(app)
        .get(`/api/articles/${articleId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        id: articleId,
        title: '測試文章',
        category: '測試',
        content: '測試內容'
      }));
    });

    it('文章不存在時回傳 404', async () => {
      const response = await request(app)
        .get('/api/articles/not-exist');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('找不到指定的文章');
    });
  });

  describe('PUT /api/articles/:id - 更新文章', () => {
    it('可以更新文章', async () => {
      // 先新增一篇文章
      const createResponse = await request(app)
        .post('/api/articles')
        .send({ title: '原始標題', category: '原始分類', content: '原始內容' });

      const articleId = createResponse.body.id;

      // 更新文章
      const response = await request(app)
        .put(`/api/articles/${articleId}`)
        .send({
          title: '更新後標題',
          category: '更新後分類'
          // content 不更新
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        id: articleId,
        title: '更新後標題',
        category: '更新後分類',
        content: '原始內容', // 保持不變
        updated_at: expect.any(String)
      }));
    });

    it('更新不存在的文章時回傳 404', async () => {
      const response = await request(app)
        .put('/api/articles/not-exist')
        .send({ title: '新標題' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('找不到指定的文章');
    });
  });

  describe('GET /api/articles/search - 搜尋文章', () => {
    beforeEach(async () => {
      // 新增測試資料
      await request(app)
        .post('/api/articles')
        .send({
          title: 'TypeScript 教學',
          category: '程式設計',
          content: '深入介紹 TypeScript 的特性'
        });

      await request(app)
        .post('/api/articles')
        .send({
          title: 'JavaScript 基礎',
          category: '程式設計',
          content: 'JavaScript 入門指南'
        });

      await request(app)
        .post('/api/articles')
        .send({
          title: '旅遊心得',
          category: '生活',
          content: '分享旅遊經驗'
        });
    });

    it('可以依關鍵字搜尋', async () => {
      const response = await request(app)
        .get('/api/articles/search')
        .query({ keyword: 'TypeScript' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('TypeScript 教學');
    });

    it('可以依分類搜尋', async () => {
      const response = await request(app)
        .get('/api/articles/search')
        .query({ category: '程式設計' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map((a: any) => a.title)).toContain('TypeScript 教學');
      expect(response.body.map((a: any) => a.title)).toContain('JavaScript 基礎');
    });

    it('可以組合搜尋條件', async () => {
      const response = await request(app)
        .get('/api/articles/search')
        .query({
          keyword: 'JavaScript',
          category: '程式設計'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('JavaScript 基礎');
    });

    it('沒有符合條件時回傳空陣列', async () => {
      const response = await request(app)
        .get('/api/articles/search')
        .query({ keyword: '不存在的關鍵字' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('無搜尋條件時回傳所有文章', async () => {
      const response = await request(app)
        .get('/api/articles/search');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('靜態檔案服務', () => {
    it('可以存取管理介面', async () => {
      const response = await request(app)
        .get('/admin');

      expect(response.status).toBe(302); // 重導向到 /admin.html
    });

    it('可以存取管理介面 HTML', async () => {
      const response = await request(app)
        .get('/admin.html');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });
  });
});