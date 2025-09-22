<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <header class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">文章管理</h2>
      <p class="text-gray-600">搜尋、瀏覽和管理所有部落格文章</p>
    </header>

    <!-- 訊息提示組件 -->
    <MessageDisplay :message="messageState" @clear="clearMessage" />

    <!-- 搜尋組件 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <ArticleSearch 
        ref="articleSearch" 
        @search="handleSearch" 
        @load-all="handleLoadAll" 
      />
    </div>

    <!-- 文章列表組件 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <ArticleList
        :articles="articles"
        :loading="loading"
        @edit-article="handleEditArticle"
        @delete-article="handleDeleteArticle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import MessageDisplay from '../../components/shared/MessageDisplay.vue'
import ArticleSearch from '../../components/ArticleSearch.vue'
import ArticleList from '../../components/ArticleList.vue'
import { useArticleStore } from '../../stores/articleStore'
import type { Article, SearchFilters, MessageState } from '../../types/article'

// 組件引用
const articleSearch = ref<InstanceType<typeof ArticleSearch>>()

// 使用 Pinia store
const store = useArticleStore()

// 從 store 取得狀態
const { articles, loading, message } = storeToRefs(store)

// 轉換 message 為 MessageState 格式
const messageState = computed((): MessageState => {
  if (typeof message.value === 'string') {
    return { text: message.value, type: 'info' }
  }
  return message.value || { text: '', type: 'info' }
})

// 編輯狀態（暫時保留在組件層級）
const editingArticle = ref<Article | null>(null)

// 初始化
onMounted(() => {
  store.loadArticles()
})

// 事件處理器
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