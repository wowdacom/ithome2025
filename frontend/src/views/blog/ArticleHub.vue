<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span class="text-white font-bold text-lg">A</span>
              </div>
              <span class="ml-2 text-xl font-semibold text-gray-900">Article Hub</span>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              HOW IT WORKS
            </a>
            <div class="relative">
              <button
                @click="toggleBrowseMenu"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium inline-flex items-center"
              >
                BROWSE
                <svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <!-- Dropdown menu would go here -->
            </div>
            <a href="#" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              SEARCH
            </a>
          </nav>

          <!-- Account Menu -->
          <div class="flex items-center space-x-4">
            <div v-if="authStore.isAuthenticated" class="relative">
              <button
                @click="toggleAccountMenu"
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span class="text-gray-700 mr-2">{{ authStore.user?.email }}</span>
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 text-sm">{{ getUserInitial() }}</span>
                </div>
              </button>
              <div
                v-if="showAccountMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <router-link
                  to="/admin"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  管理後台
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  登出
                </button>
              </div>
            </div>
            <div v-else>
              <router-link
                to="/login"
                class="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium"
              >
                登入
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-80 space-y-6">
          <!-- Search -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by keywords (React, Vue, JavaScript, etc.)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="handleSearch"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div class="bg-white rounded-lg shadow-sm border">
            <div class="p-6 space-y-6">
              <!-- Categories -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-sm font-semibold text-gray-900">Categories</h3>
                  <button
                    @click="clearCategories"
                    class="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>
                </div>
                <div class="space-y-2">
                  <label
                    v-for="category in availableCategories"
                    :key="category"
                    class="flex items-center"
                  >
                    <input
                      v-model="selectedCategories"
                      :value="category"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      @change="applyFilters"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ category }}</span>
                  </label>
                </div>
              </div>

              <!-- Publication Date -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-sm font-semibold text-gray-900">Publication Date</h3>
                  <button
                    @click="clearDateFilters"
                    class="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>
                </div>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="selectedDateRange"
                      value="today"
                      type="radio"
                      name="dateRange"
                      class="text-blue-600 focus:ring-blue-500"
                      @change="applyFilters"
                    />
                    <span class="ml-2 text-sm text-gray-700">Today</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="selectedDateRange"
                      value="week"
                      type="radio"
                      name="dateRange"
                      class="text-blue-600 focus:ring-blue-500"
                      @change="applyFilters"
                    />
                    <span class="ml-2 text-sm text-gray-700">This Week</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="selectedDateRange"
                      value="month"
                      type="radio"
                      name="dateRange"
                      class="text-blue-600 focus:ring-blue-500"
                      @change="applyFilters"
                    />
                    <span class="ml-2 text-sm text-gray-700">This Month</span>
                  </label>
                </div>
              </div>

              <!-- Reading Time -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-sm font-semibold text-gray-900">Reading Time</h3>
                  <button
                    @click="clearReadingTime"
                    class="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>
                </div>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="selectedReadingTime"
                      value="short"
                      type="radio"
                      name="readingTime"
                      class="text-blue-600 focus:ring-blue-500"
                      @change="applyFilters"
                    />
                    <span class="ml-2 text-sm text-gray-700">Short (&lt; 5 min)</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="selectedReadingTime"
                      value="medium"
                      type="radio"
                      name="readingTime"
                      class="text-blue-600 focus:ring-blue-500"
                      @change="applyFilters"
                    />
                    <span class="ml-2 text-sm text-gray-700">Medium (5-15 min)</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="selectedReadingTime"
                      value="long"
                      type="radio"
                      name="readingTime"
                      class="text-blue-600 focus:ring-blue-500"
                      @change="applyFilters"
                    />
                    <span class="ml-2 text-sm text-gray-700">Long (&gt; 15 min)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Articles Widget -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Articles</h3>
            <div class="space-y-4">
              <div
                v-for="article in topArticles"
                :key="article.id"
                class="border-b border-gray-100 pb-3 last:border-0"
              >
                <h4 class="text-sm font-medium text-gray-900 mb-1">{{ article.title }}</h4>
                <p class="text-xs text-gray-500">
                  {{ article.readCount || article.views || 0 }} reads
                </p>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1">
          <!-- Results Header -->
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">RESULTS ({{ totalArticles }})</h2>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Sort by</span>
              <select
                v-model="sortBy"
                @change="applySorting"
                class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="views">Views</option>
              </select>
            </div>
          </div>

          <!-- Articles List -->
          <div class="space-y-6">
            <article
              v-for="article in paginatedArticles"
              :key="article.id"
              class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {{ article.category }}
                      </span>
                      <span class="text-sm text-gray-500">{{
                        formatDate(article.createdAt || article.created_at)
                      }}</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                      <router-link
                        :to="`/blog/articles/${article.id}`"
                        class="hover:text-blue-600 transition-colors"
                      >
                        {{ article.title }}
                      </router-link>
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                      {{ article.excerpt || getExcerpt(article.content) }}
                    </p>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span
                        v-for="tag in getArticleTags(article)"
                        :key="tag"
                        class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <!-- Reading Time & Views -->
                  <div class="ml-6 text-right">
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ calculateReadingTime(article.content) }} min read
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ article.views || article.readCount || 0 }} views
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination -->
          <div class="mt-8 flex justify-center" v-if="totalPages > 1">
            <nav class="flex items-center space-x-2">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 text-sm rounded-md',
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span class="text-white font-bold text-lg">A</span>
              </div>
              <span class="ml-2 text-xl font-semibold">Article Hub</span>
            </div>
            <p class="text-gray-400 text-sm">
              Discover and share technical articles, tutorials, and insights from developers around
              the world.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">ARTICLES</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white">How it works</a></li>
              <li><a href="#" class="hover:text-white">Why we're here</a></li>
              <li><a href="#" class="hover:text-white">Categories</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">WRITERS</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white">About</a></li>
              <li><a href="#" class="hover:text-white">Time tracking</a></li>
              <li><a href="#" class="hover:text-white">Developer</a></li>
              <li><a href="#" class="hover:text-white">Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">SUPPORT</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white">Help center</a></li>
              <li><a href="#" class="hover:text-white">Blog</a></li>
              <li><a href="#" class="hover:text-white">FAQ</a></li>
              <li><a href="#" class="hover:text-white">Email us</a></li>
              <li><a href="#" class="hover:text-white">Terms</a></li>
              <li><a href="#" class="hover:text-white">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useArticleStore } from '@/stores/articleStore'
import type { Article } from '@/types/article'

const router = useRouter()
const authStore = useAuthStore()
const articleStore = useArticleStore()

// UI State
const showBrowseMenu = ref(false)
const showAccountMenu = ref(false)

// Search and Filters
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const selectedDateRange = ref('')
const selectedReadingTime = ref('')
const sortBy = ref('relevance')

// Pagination
const currentPage = ref(1)
const articlesPerPage = 10

// Data
const articles = ref<Article[]>([])
const topArticles = ref<Article[]>([])

// Available filter options
const availableCategories = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'AI/ML', 'Tutorial', 'News']

// Computed properties
const filteredArticles = computed(() => {
  let result = [...articles.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query),
    )
  }

  // Apply category filter
  if (selectedCategories.value.length > 0) {
    result = result.filter((article) => selectedCategories.value.includes(article.category))
  }

  // Apply date range filter
  if (selectedDateRange.value) {
    const now = new Date()
    const startDate = new Date()

    switch (selectedDateRange.value) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    result = result.filter(
      (article) => new Date(article.createdAt || article.created_at) >= startDate,
    )
  }

  // Apply reading time filter
  if (selectedReadingTime.value) {
    result = result.filter((article) => {
      const readingTime = calculateReadingTime(article.content)
      switch (selectedReadingTime.value) {
        case 'short':
          return readingTime < 5
        case 'medium':
          return readingTime >= 5 && readingTime <= 15
        case 'long':
          return readingTime > 15
        default:
          return true
      }
    })
  }

  return result
})

const sortedArticles = computed(() => {
  const result = [...filteredArticles.value]

  switch (sortBy.value) {
    case 'date':
      return result.sort(
        (a, b) =>
          new Date(b.createdAt || b.created_at).getTime() -
          new Date(a.createdAt || a.created_at).getTime(),
      )
    case 'title':
      return result.sort((a, b) => a.title.localeCompare(b.title))
    case 'views':
      return result.sort((a, b) => (b.views || 0) - (a.views || 0))
    default: // relevance
      return result
  }
})

const totalArticles = computed(() => sortedArticles.value.length)
const totalPages = computed(() => Math.ceil(totalArticles.value / articlesPerPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return sortedArticles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  // Always show first page
  pages.push(1)

  // Add pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  // Always show last page if there are multiple pages
  if (total > 1 && !pages.includes(total)) {
    pages.push(total)
  }

  return pages.sort((a, b) => a - b)
})

// Methods
const toggleBrowseMenu = () => {
  showBrowseMenu.value = !showBrowseMenu.value
}

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value
}

const getUserInitial = () => {
  return authStore.user?.email?.charAt(0).toUpperCase() || 'U'
}

const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    console.error('登出失敗:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  applyFilters()
}

const applyFilters = () => {
  currentPage.value = 1
  // Filters are applied automatically through computed properties
}

const applySorting = () => {
  currentPage.value = 1
  // Sorting is applied automatically through computed properties
}

const clearCategories = () => {
  selectedCategories.value = []
  applyFilters()
}

const clearDateFilters = () => {
  selectedDateRange.value = ''
  applyFilters()
}

const clearReadingTime = () => {
  selectedReadingTime.value = ''
  applyFilters()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getExcerpt = (content: string, maxLength: number = 200) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

const getArticleTags = (article: Article) => {
  // Extract tags from article content or use predefined tags
  // This is a simple implementation
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
  ]

  for (const keyword of techKeywords) {
    if (
      article.content.toLowerCase().includes(keyword) ||
      article.title.toLowerCase().includes(keyword)
    ) {
      tags.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
    }
  }

  return tags.slice(0, 3) // Limit to 3 tags
}

// Lifecycle
onMounted(async () => {
  try {
    await articleStore.loadArticles()
    articles.value = articleStore.articles

    // Get top articles (sorted by views)
    topArticles.value = [...articles.value]
      .sort((a, b) => (b.views || b.readCount || 0) - (a.views || a.readCount || 0))
      .slice(0, 3)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  }
})

// Close menus when clicking outside
const handleClickOutside = () => {
  showBrowseMenu.value = false
  showAccountMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
