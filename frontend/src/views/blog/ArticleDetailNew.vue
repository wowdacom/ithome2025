<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span class="text-white font-bold text-lg">A</span>
            </div>
            <span class="ml-2 text-xl font-semibold text-gray-900">Article Hub</span>
          </router-link>

          <!-- Navigation -->
          <nav class="flex items-center space-x-4">
            <router-link
              to="/"
              class="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium"
            >
              ← 返回文章列表
            </router-link>

            <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
              <router-link
                to="/admin"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                管理後台
              </router-link>
              <button
                @click="handleLogout"
                class="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                登出
              </button>
            </div>
            <router-link
              v-else
              to="/login"
              class="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium"
            >
              登入
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-600 text-lg mb-4">{{ error }}</div>
        <router-link to="/" class="text-blue-600 hover:text-blue-700 font-medium">
          返回首頁
        </router-link>
      </div>

      <!-- Article Content -->
      <article v-else-if="article" class="bg-white rounded-lg shadow-sm border">
        <!-- Article Header -->
        <header class="px-8 py-6 border-b border-gray-200">
          <!-- Category Badge -->
          <div class="flex items-center space-x-3 mb-4">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {{ article.category }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatDate(article.created_at) }}
            </span>
            <span class="text-sm text-gray-500">
              {{ calculateReadingTime(article.content) }} 分鐘閱讀
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {{ article.title }}
          </h1>

          <!-- Article Meta -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500">
                  {{ article.views || article.readCount || 0 }} 次瀏覽
                </span>
              </div>
            </div>

            <!-- Share Actions -->
            <div class="flex items-center space-x-2">
              <button
                @click="shareArticle"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                  />
                </svg>
                分享
              </button>

              <button
                v-if="authStore.isAuthenticated"
                @click="editArticle"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
                編輯
              </button>
            </div>
          </div>
        </header>

        <!-- Article Body -->
        <div class="px-8 py-8">
          <div class="prose prose-lg max-w-none" v-html="formattedContent" />
        </div>

        <!-- Article Footer -->
        <footer class="px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in getArticleTags(article)"
                  :key="tag"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <button
                @click="likeArticle"
                :class="[
                  'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isLiked
                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200',
                ]"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ isLiked ? '已收藏' : '收藏' }}
              </button>
            </div>
          </div>
        </footer>
      </article>

      <!-- Related Articles -->
      <section v-if="relatedArticles.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">相關文章</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
          >
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-2">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {{ relatedArticle.category }}
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                <router-link
                  :to="`/blog/articles/${relatedArticle.id}`"
                  class="hover:text-blue-600 transition-colors"
                >
                  {{ relatedArticle.title }}
                </router-link>
              </h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ getExcerpt(relatedArticle.content, 100) }}
              </p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ formatDate(relatedArticle.created_at) }}</span>
                <span>{{ calculateReadingTime(relatedArticle.content) }} 分鐘閱讀</span>
              </div>
            </div>
          </article>
        </div>
      </section>

  <!-- Comments (GitHub Issues via utterances) -->
  <UtterancesComments v-if="article" :articleTitle="article.title" :currentPath="route.fullPath" repo="wowdacom/blog.comment" theme="dark-blue" class="mt-12" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useArticleStore } from '@/stores/articleStore'
import UtterancesComments from '@/components/UtterancesComments.vue'
import type { Article } from '@/types/article'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const articleStore = useArticleStore()

// State
const article = ref<Article | null>(null)
const relatedArticles = ref<Article[]>([])
const loading = ref(true)
const error = ref('')
const isLiked = ref(false)

// Get article ID from route
const articleId = computed(() => route.params.id as string)

// Computed properties
const formattedContent = computed(() => {
  if (!article.value) return ''

  // Convert line breaks to HTML paragraphs
  return article.value.content
    .split('\n\n')
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('')
})

// Methods
const loadArticle = async () => {
  try {
    loading.value = true
    error.value = ''

    const result = await articleStore.getArticleById(articleId.value)
    if (result) {
      article.value = result
      await loadRelatedArticles()
    } else {
      error.value = '文章不存在'
    }
  } catch (err) {
    error.value = '載入文章失敗'
    console.error('Error loading article:', err)
  } finally {
    loading.value = false
  }
}

const loadRelatedArticles = async () => {
  if (!article.value) return

  try {
    await articleStore.loadArticles()
    // Get articles in the same category, excluding current article
    relatedArticles.value = articleStore.articles
      .filter((a) => a.id !== article.value!.id && a.category === article.value!.category)
      .slice(0, 3)
  } catch (error) {
    console.error('Error loading related articles:', error)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

const getExcerpt = (content: string, maxLength: number = 200) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

const getArticleTags = (article: Article) => {
  const tags = []
  const techKeywords = [
    'react',
    'vue',
    'javascript',
    'typescript',
    'node',
    'python',
    'docker',
    'aws',
    'css',
    'html',
  ]

  for (const keyword of techKeywords) {
    if (
      article.content.toLowerCase().includes(keyword) ||
      article.title.toLowerCase().includes(keyword)
    ) {
      tags.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
    }
  }

  return tags.slice(0, 5)
}

const shareArticle = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: article.value?.title,
        text: getExcerpt(article.value?.content || '', 100),
        url: window.location.href,
      })
    } catch (err) {
      console.log('Share cancelled')
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('文章連結已複製到剪貼簿')
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }
}

const editArticle = () => {
  if (article.value) {
    router.push(`/admin/articles?edit=${article.value.id}`)
  }
}

const likeArticle = () => {
  isLiked.value = !isLiked.value
  // TODO: Implement actual like functionality with backend
}

const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    console.error('登出失敗:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadArticle()
})

// Watch for route changes (if navigating between articles)
import { watch } from 'vue'
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      loadArticle()
    }
  },
)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  color: #374151;
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  color: #111827;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h1 {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.prose h2 {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.prose h3 {
  font-size: 1.5rem;
  line-height: 2rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin: 1.5rem 0;
}

.prose ul,
.prose ol {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
