<template>
  <section>
    <h2>文章列表</h2>

    <!-- 載入狀態覆蓋 -->
    <div v-if="loading && articles.length === 0" class="loading-state">
      <p>載入中...</p>
    </div>

    <!-- 空狀態 -->
    <div v-else-if="articles.length === 0" class="empty-state">
      <p>目前沒有文章</p>
    </div>

    <!-- 文章列表 -->
    <div v-else>
      <div v-if="loading" class="loading-overlay">
        <p>更新中...</p>
      </div>

      <p class="article-count">共 {{ articles.length }} 篇文章</p>

      <div class="article-list">
        <article v-for="article in articles" :key="article.id" class="article-item">
          <header class="article-header">
            <h3 class="article-title">{{ article.title }}</h3>
            <span class="article-category">{{ article.category }}</span>
          </header>

          <div class="article-content">
            {{ truncateContent(article.content) }}
          </div>

          <footer class="article-footer">
            <time class="article-date">
              {{ formatDate(article.created_at) }}
            </time>
            <div class="article-actions">
              <button
                class="edit-button"
                :disabled="loading"
                :aria-label="`編輯文章：${article.title}`"
                @click="handleEdit(article)"
              >
                編輯
              </button>
              <button
                class="delete-button"
                :disabled="loading"
                :aria-label="`刪除文章：${article.title}`"
                @click="handleDelete(article.id)"
              >
                刪除
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '@/types/article'
import { formatDate, truncateText } from '@/utils/helpers'

interface Props {
  articles: Article[]
  loading?: boolean
}

interface Emits {
  (e: 'edit-article', article: Article): void
  (e: 'delete-article', id: string): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Constants
const CONTENT_MAX_LENGTH = 150
const DELETE_CONFIRMATION_MESSAGE = '確定要刪除這篇文章嗎？'

function handleEdit(article: Article) {
  emit('edit-article', article)
}

function handleDelete(id: string) {
  if (window.confirm(DELETE_CONFIRMATION_MESSAGE)) {
    emit('delete-article', id)
  }
}

function truncateContent(content: string): string {
  return truncateText(content, CONTENT_MAX_LENGTH)
}
</script>

<style scoped>
.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.loading-overlay {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  color: #666;
}

.article-count {
  margin-bottom: 20px;
  font-size: 14px;
  color: #6c757d;
}

.article-list {
  display: grid;
  gap: 20px;
}

.article-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: box-shadow 0.2s ease;
}

.article-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 15px;
}

.article-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.article-category {
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.article-content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.article-date {
  font-size: 14px;
  color: #6c757d;
}

.article-actions {
  display: flex;
  gap: 8px;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.edit-button {
  background: #28a745;
  color: white;
}

.edit-button:hover:not(:disabled) {
  background: #218838;
}

.delete-button {
  background: #dc3545;
  color: white;
}

.delete-button:hover:not(:disabled) {
  background: #c82333;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .article-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .article-actions {
    width: 100%;
    justify-content: stretch;
  }

  .article-actions button {
    flex: 1;
  }
}
</style>
