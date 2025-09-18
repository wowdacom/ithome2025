<template>
  <div class="container">
    <h1>部落格後台管理</h1>

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
import { ref, reactive, onMounted } from 'vue'
import MessageDisplay from './components/MessageDisplay.vue'
import ArticleForm from './components/ArticleForm.vue'
import ArticleSearch from './components/ArticleSearch.vue'
import ArticleList from './components/ArticleList.vue'
import { articleService } from './services'
import type { Article, CreateArticleRequest, SearchFilters, MessageState } from './types/article'

// 組件引用
const articleForm = ref<InstanceType<typeof ArticleForm>>()
const articleSearch = ref<InstanceType<typeof ArticleSearch>>()

// 狀態管理
const loading = ref(false)
const articles = ref<Article[]>([])
const editingArticle = ref<Article | null>(null)

// 訊息系統
const message = reactive<MessageState>({
  text: '',
  type: 'info',
})

// 初始化
onMounted(() => {
  loadAllArticles()
})

// 訊息處理
function showMessage(text: string, type: 'success' | 'error' | 'info' = 'success') {
  message.text = text
  message.type = type
}

function clearMessage() {
  message.text = ''
  message.type = 'info'
}

function showError(text: string) {
  showMessage(text, 'error')
}

function showSuccess(text: string) {
  showMessage(text, 'success')
}

// API 操作
async function loadAllArticles() {
  try {
    loading.value = true
    const result = await articleService.getAll()
    articles.value = result
  } catch (error) {
    showError('載入文章失敗: ' + (error as Error).message)
    console.error('載入文章錯誤:', error)
  } finally {
    loading.value = false
  }
}

async function searchArticles(filters: SearchFilters) {
  try {
    loading.value = true
    const result = await articleService.search(filters)
    articles.value = result
  } catch (error) {
    showError('搜尋失敗: ' + (error as Error).message)
    console.error('搜尋錯誤:', error)
  } finally {
    loading.value = false
  }
}

async function createArticle(articleData: CreateArticleRequest) {
  try {
    loading.value = true

    await articleService.create(articleData)
    showSuccess('文章新增成功')

    // 清除表單
    if (articleForm.value) {
      articleForm.value.clearForm()
    }

    // 重新載入文章列表
    await loadAllArticles()
  } catch (error) {
    showError('新增失敗: ' + (error as Error).message)
    console.error('新增文章錯誤:', error)
  } finally {
    loading.value = false
  }
}

async function deleteArticle(id: string) {
  try {
    loading.value = true

    await articleService.delete(id)
    showSuccess('文章刪除成功')

    // 重新載入文章列表
    await loadAllArticles()
  } catch (error) {
    showError('刪除失敗: ' + (error as Error).message)
    console.error('刪除文章錯誤:', error)
  } finally {
    loading.value = false
  }
}

// 組件事件處理器
function handleCreateArticle(articleData: CreateArticleRequest) {
  createArticle(articleData)
}

function handleSearch(filters: SearchFilters) {
  if (Object.values(filters).every((value) => !value)) {
    // 如果所有搜尋條件都是空的，載入全部文章
    loadAllArticles()
  } else {
    searchArticles(filters)
  }
}

function handleLoadAll() {
  loadAllArticles()
}

function handleEditArticle(article: Article) {
  editingArticle.value = article
  // 這裡可以開啟編輯模式或導航到編輯頁面
  // 暫時顯示訊息表示編輯功能被觸發
  showMessage(`準備編輯文章: ${article.title}`, 'info')
}

function handleDeleteArticle(id: string) {
  deleteArticle(id)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}
</style>
