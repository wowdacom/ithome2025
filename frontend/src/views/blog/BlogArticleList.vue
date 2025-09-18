<template>
  <div class="blog-article-list">
    <div class="list-header">
      <h2>最新文章</h2>
      <p class="article-count" v-if="!loading">共 {{ articles.length }} 篇文章</p>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>載入文章中...</p>
    </div>

    <!-- 文章列表 -->
    <div v-else-if="articles.length > 0" class="articles-grid">
      <article
        v-for="article in articles"
        :key="article.id"
        class="article-card"
        @click="goToArticle(article.id)"
      >
        <div class="card-content">
          <div class="article-meta">
            <span class="category">{{ article.category }}</span>
            <time class="date">{{ formatDate(article.created_at) }}</time>
          </div>

          <h3 class="article-title">{{ article.title }}</h3>

          <p class="article-preview">{{ getPreview(article.content) }}</p>

          <div class="read-more">
            <span>閱讀全文 →</span>
          </div>
        </div>
      </article>
    </div>

    <!-- 空狀態 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>還沒有文章</h3>
      <p>目前沒有發布的文章，請稍後再來查看。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articleStore'

const router = useRouter()
const store = useArticleStore()
const { articles, loading } = storeToRefs(store)

onMounted(() => {
  store.loadArticles()
})

function goToArticle(id: string) {
  router.push({ name: 'ArticleDetail', params: { id } })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getPreview(content: string): string {
  const plainText = content.replace(/<[^>]*>/g, '')
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
}
</script>

<style scoped>
.blog-article-list {
  max-width: 100%;
}

.list-header {
  text-align: center;
  margin-bottom: 40px;
}

.list-header h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.article-count {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.article-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e9ecef;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 25px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.category {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.article-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.4;
  font-weight: 600;
}

.article-preview {
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.read-more {
  text-align: right;
}

.read-more span {
  color: #667eea;
  font-weight: 500;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #5a6c7d;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .list-header h2 {
    font-size: 2rem;
  }

  .card-content {
    padding: 20px;
  }
}
</style>
