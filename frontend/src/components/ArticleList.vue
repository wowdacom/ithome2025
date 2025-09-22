<template>
  <section class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">文章列表</h2>

    <!-- 載入狀態覆蓋 -->
    <div
      v-if="loading && articles.length === 0"
      class="bg-gray-50 border border-gray-200 rounded-md text-center py-10 px-6"
    >
      <div class="loading-spinner mx-auto mb-3"></div>
      <p class="text-gray-600">載入中...</p>
    </div>

    <!-- 空狀態 -->
    <div
      v-else-if="articles.length === 0"
      class="bg-gray-50 border border-gray-200 rounded-md text-center py-10 px-6"
    >
      <p class="text-gray-600">目前沒有文章</p>
    </div>

    <!-- 文章列表 -->
    <div v-else>
      <div
        v-if="loading"
        class="bg-blue-50 border border-blue-200 rounded-md text-center py-4 px-6 mb-6"
      >
        <div class="flex items-center justify-center">
          <div class="loading-spinner mr-2"></div>
          <p class="text-blue-700">更新中...</p>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 mb-6">
        <p class="text-sm text-gray-600">共 {{ articles.length }} 篇文章</p>
      </div>

      <div class="space-y-4">
        <article
          v-for="article in articles"
          :key="article.id"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
          <div class="p-6">
            <header class="flex justify-between items-start mb-4 gap-4">
              <h3 class="text-lg font-semibold text-gray-900 flex-1">{{ article.title }}</h3>
              <span
                class="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md whitespace-nowrap"
              >
                {{ article.category }}
              </span>
            </header>

            <div class="text-gray-600 text-sm leading-relaxed mb-4">
              {{ truncateContent(article.content) }}
            </div>

            <footer class="flex justify-between items-center pt-4 border-t border-gray-200">
              <time class="text-xs text-gray-500">
                {{ formatDate(article.created_at) }}
              </time>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  :disabled="loading"
                  :aria-label="`編輯文章：${article.title}`"
                  @click="handleEdit(article)"
                >
                  編輯
                </button>
                <button
                  class="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  :disabled="loading"
                  :aria-label="`刪除文章：${article.title}`"
                  @click="handleDelete(article.id)"
                >
                  刪除
                </button>
              </div>
            </footer>

            <!-- 編輯表單 -->
            <div
              v-if="editingId === article.id"
              class="mt-6 p-4 bg-white border border-gray-300 rounded-md"
            >
              <form @submit.prevent="handleUpdate(article.id)" class="space-y-4">
                <div class="form-group">
                  <label class="form-label">標題</label>
                  <input type="text" v-model="editForm.title" required class="form-input" />
                </div>

                <div class="form-group">
                  <label class="form-label">分類</label>
                  <input type="text" v-model="editForm.category" required class="form-input" />
                </div>

                <div class="form-group">
                  <label class="form-label">內容</label>
                  <textarea
                    v-model="editForm.content"
                    required
                    rows="6"
                    class="form-input resize-y"
                  ></textarea>
                  <button
                    type="button"
                    @click="toggleAiPanel"
                    class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    :disabled="loading || aiPanel.loading"
                  >
                    🤖 AI 協助
                  </button>
                </div>

                <!-- AI 協助面板 -->
                <div
                  :class="[
                    'rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 ease-in-out overflow-hidden',
                    {
                      'p-4 max-h-96 opacity-100': aiPanel.show,
                      'p-0 max-h-0 opacity-0': !aiPanel.show,
                    },
                  ]"
                >
                  <h4 class="text-sm font-semibold text-indigo-700 mb-3 flex items-center">
                    🤖 AI 寫作協助
                  </h4>

                  <div class="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      type="text"
                      v-model="aiPanel.prompt"
                      placeholder="輸入您的需求，例如：改善這篇文章的結構"
                      @keyup.enter="handleAiAssist"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      @click="handleAiAssist"
                      :disabled="!aiPanel.prompt.trim() || aiPanel.loading"
                      class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                    >
                      <span v-if="aiPanel.loading" class="loading-spinner mr-2"></span>
                      {{ aiPanel.loading ? '生成中...' : '生成內容' }}
                    </button>
                  </div>

                  <div
                    v-if="aiPanel.result"
                    class="bg-white p-3 rounded-md border border-blue-200 mb-3 whitespace-pre-wrap max-h-32 overflow-y-auto text-gray-700 text-sm leading-relaxed"
                  >
                    {{ aiPanel.result }}
                  </div>

                  <div v-if="aiPanel.result" class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      @click="applyAiResult"
                      class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      套用到內容
                    </button>
                    <button
                      type="button"
                      @click="appendAiResult"
                      class="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      附加到內容
                    </button>
                    <button
                      type="button"
                      @click="clearAiResult"
                      class="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      清除結果
                    </button>
                  </div>
                </div>

                <div class="flex space-x-3">
                  <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
                    <span v-if="loading" class="loading-spinner mr-2"></span>
                    {{ loading ? '更新中...' : '更新' }}
                  </button>
                  <button type="button" @click="cancelEdit" class="btn btn-secondary">取消</button>
                </div>
              </form>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { apiClient } from '../utils/apiClient'
import type { Article } from '../types/article'

const articles = ref<Article[]>([])
const loading = ref(false)
const editingId = ref<string | null>(null)

// 編輯表單狀態
const editForm = reactive({
  title: '',
  category: '',
  content: '',
})

// AI 協助面板狀態
const aiPanel = reactive({
  show: false,
  prompt: '',
  result: '',
  loading: false,
})

// Constants
const CONTENT_MAX_LENGTH = 150

const fetchArticles = async () => {
  loading.value = true
  try {
    const data = await apiClient.get<Article[]>('/articles')
    articles.value = data
  } catch (error) {
    console.error('取得文章失敗:', error)
  } finally {
    loading.value = false
  }
}

const handleEdit = (article: Article) => {
  editingId.value = article.id
  editForm.title = article.title
  editForm.category = article.category
  editForm.content = article.content

  // 重置 AI 面板
  aiPanel.show = false
  aiPanel.prompt = ''
  aiPanel.result = ''
}

const handleUpdate = async (id: string) => {
  loading.value = true
  try {
    await apiClient.put(`/articles/${id}`, editForm)
    await fetchArticles()
    cancelEdit()
  } catch (error) {
    console.error('更新文章失敗:', error)
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.title = ''
  editForm.category = ''
  editForm.content = ''
  aiPanel.show = false
  aiPanel.prompt = ''
  aiPanel.result = ''
}

const handleDelete = async (id: string) => {
  if (!confirm('確定要刪除這篇文章嗎？')) {
    return
  }

  loading.value = true
  try {
    await apiClient.delete(`/articles/${id}`)
    await fetchArticles()
  } catch (error) {
    console.error('刪除文章失敗:', error)
  } finally {
    loading.value = false
  }
}

// AI 協助功能
const toggleAiPanel = () => {
  aiPanel.show = !aiPanel.show
  if (!aiPanel.show) {
    aiPanel.prompt = ''
    aiPanel.result = ''
  }
}

const handleAiAssist = async () => {
  if (!aiPanel.prompt.trim()) return

  aiPanel.loading = true
  try {
    const response = await apiClient.post<{ improvedContent: string }>('/ai/assist', {
      prompt: aiPanel.prompt,
      articleContent: editForm.content,
    })

    aiPanel.result = response.improvedContent
  } catch (error: unknown) {
    console.error('AI 協助失敗:', error)
    const errorMessage = error instanceof Error ? error.message : '未知錯誤'
    aiPanel.result = `錯誤: ${errorMessage}`
  } finally {
    aiPanel.loading = false
  }
}

const applyAiResult = () => {
  if (aiPanel.result) {
    editForm.content = aiPanel.result
    aiPanel.result = ''
    aiPanel.prompt = ''
  }
}

const appendAiResult = () => {
  if (aiPanel.result) {
    editForm.content = editForm.content
      ? `${editForm.content}\n\n${aiPanel.result}`
      : aiPanel.result
    aiPanel.result = ''
    aiPanel.prompt = ''
  }
}

const clearAiResult = () => {
  aiPanel.result = ''
  aiPanel.prompt = ''
}

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '日期不明'
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

const truncateContent = (content: string): string => {
  return content.length > CONTENT_MAX_LENGTH
    ? content.substring(0, CONTENT_MAX_LENGTH) + '...'
    : content
}

onMounted(() => {
  fetchArticles()
})
</script>
