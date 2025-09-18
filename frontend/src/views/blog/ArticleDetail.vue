<template>
  <div class="article-detail">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>載入文章中...</p>
    </div>

    <!-- 文章內容 -->
    <article v-else-if="article" class="article-content">
      <header class="article-header">
        <nav class="breadcrumb">
          <router-link to="/blog" class="breadcrumb-link">← 返回文章列表</router-link>
        </nav>

        <div class="article-meta">
          <span class="category">{{ article.category }}</span>
          <time class="date">{{ formatDate(article.created_at) }}</time>
        </div>

        <h1 class="article-title">{{ article.title }}</h1>
      </header>

      <div class="article-body">
        <div class="content" v-html="article.content"></div>
      </div>

      <footer class="article-footer">
        <div class="article-info">
          <p class="created-date">發布於：{{ formatFullDate(article.created_at) }}</p>
          <p
            v-if="article.updated_at && article.updated_at !== article.created_at"
            class="updated-date"
          >
            最後更新：{{ formatFullDate(article.updated_at) }}
          </p>
        </div>

        <div class="article-actions">
          <button @click="goBack" class="back-button">← 返回列表</button>
        </div>
      </footer>
    </article>

    <!-- 錯誤狀態 -->
    <div v-else class="error-state">
      <div class="error-icon">❌</div>
      <h3>文章不存在</h3>
      <p>抱歉，找不到您要查看的文章。</p>
      <router-link to="/blog" class="back-link">返回文章列表</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articleStore'
import type { Article } from '../../types/article'

const route = useRoute()
const router = useRouter()
const store = useArticleStore()
const { loading } = storeToRefs(store)

const article = ref<Article | null>(null)
const articleId = computed(() => route.params.id as string)

onMounted(async () => {
  await loadArticle()
})

async function loadArticle() {
  try {
    article.value = await store.getArticleById(articleId.value)
  } catch (error) {
    console.error('載入文章失敗:', error)
    article.value = null
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function goBack() {
  router.push('/blog')
}
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
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

.article-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.article-header {
  padding: 30px 40px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #5a67d8;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category {
  background: #667eea;
  color: white;
  padding: 6px 16px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
}

.date {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.article-title {
  font-size: 2.2rem;
  color: #2c3e50;
  line-height: 1.3;
  margin: 0;
  font-weight: 700;
}

.article-body {
  padding: 40px;
}

.content {
  line-height: 1.8;
  color: #2c3e50;
  font-size: 1.05rem;
}

.content :deep(h1),
.content :deep(h2),
.content :deep(h3),
.content :deep(h4),
.content :deep(h5),
.content :deep(h6) {
  color: #2c3e50;
  margin-top: 2em;
  margin-bottom: 1em;
}

.content :deep(h1) {
  font-size: 1.8rem;
}
.content :deep(h2) {
  font-size: 1.5rem;
}
.content :deep(h3) {
  font-size: 1.3rem;
}

.content :deep(p) {
  margin-bottom: 1.5em;
}

.content :deep(ul),
.content :deep(ol) {
  margin-bottom: 1.5em;
  padding-left: 2em;
}

.content :deep(li) {
  margin-bottom: 0.5em;
}

.content :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 20px;
  margin: 2em 0;
  color: #5a6c7d;
  font-style: italic;
}

.content :deep(code) {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.content :deep(pre) {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 2em 0;
}

.article-footer {
  padding: 30px 40px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e9ecef;
}

.article-info {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.article-info p {
  margin: 0 0 5px 0;
}

.back-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.back-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.error-state {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #5a6c7d;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  color: #5a67d8;
}

@media (max-width: 768px) {
  .article-header,
  .article-body,
  .article-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .article-title {
    font-size: 1.8rem;
  }

  .article-footer {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style>
