<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>部落格後台管理</h1>
      <nav class="admin-nav">
        <router-link to="/blog" class="nav-link">查看部落格</router-link>
      </nav>
    </header>

    <!-- 訊息提示組件 -->
    <MessageDisplay :message="message" @clear="clearMessage" />

    <!-- 新增文章表單組件 -->
    <ArticleForm ref="articleForm" :loading="loading" @create-article="handleCreateArticle" />

    <!-- 搜尋組件 -->
    <ArticleSearch ref="articleSearch" @search="handleSearch" @load-all="handleLoadAll" />

    <!-- 文章列表組件 -->
    <ArticleList
      :articles="articles"
      :loading="loading"
      @edit-article="handleEditArticle"
      @delete-article="handleDeleteArticle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import MessageDisplay from '../../components/shared/MessageDisplay.vue'
import ArticleForm from '../../components/ArticleForm.vue'
import ArticleSearch from '../../components/ArticleSearch.vue'
import ArticleList from '../../components/ArticleList.vue'
import { useArticleStore } from '../../stores/articleStore'
import type { Article, CreateArticleRequest, SearchFilters } from '../../types/article'

// 組件引用
const articleForm = ref<InstanceType<typeof ArticleForm>>()
const articleSearch = ref<InstanceType<typeof ArticleSearch>>()

// 使用 Pinia store
const store = useArticleStore()

// 從 store 取得狀態 (使用 storeToRefs 保持響應性)
const { articles, loading, message } = storeToRefs(store)

// 編輯狀態（暫時保留在組件層級）
const editingArticle = ref<Article | null>(null)

// 初始化
onMounted(() => {
  store.loadArticles()
})

// 組件事件處理器
async function handleCreateArticle(articleData: CreateArticleRequest) {
  await store.createArticle(articleData)

  // 清除表單
  if (articleForm.value) {
    articleForm.value.clearForm()
  }
}

function handleSearch(filters: SearchFilters) {
  if (Object.values(filters).every((value) => !value)) {
    // 如果所有搜尋條件都是空的，載入全部文章
    store.loadArticles()
  } else {
    store.searchArticles(filters)
  }
}

function handleLoadAll() {
  store.loadArticles()
}

function handleEditArticle(article: Article) {
  editingArticle.value = article
  // 這裡可以開啟編輯模式或導航到編輯頁面
  // 暫時顯示訊息表示編輯功能被觸發
  store.showMessage(`準備編輯文章: ${article.title}`, 'info')
}

function handleDeleteArticle(id: string) {
  store.deleteArticle(id)
}

function clearMessage() {
  store.clearMessage()
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.admin-header h1 {
  color: #333;
  margin: 0;
}

.admin-nav {
  display: flex;
  gap: 15px;
}

.nav-link {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background: #0056b3;
}
</style>
