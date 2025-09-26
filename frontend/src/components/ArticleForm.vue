<template>
  <section class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">新增文章</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="form-group">
        <label for="title" class="form-label">標題</label>
        <input
          id="title"
          name="title"
          type="text"
          v-model="form.title"
          required
          class="form-input"
          placeholder="請輸入文章標題"
        />
      </div>

      <div class="form-group">
        <label for="category" class="form-label">分類</label>
        <input
          id="category"
          name="category"
          type="text"
          v-model="form.category"
          required
          class="form-input"
          placeholder="請輸入文章分類"
        />
      </div>

      <!-- 內容編輯與預覽區域 -->
      <div class="form-group">
        <div class="flex items-center justify-between mb-3">
          <label for="content" class="form-label">內容</label>
          <div class="flex items-center space-x-2">
            <button
              type="button"
              @click="showPreview = !showPreview"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {{ showPreview ? '隱藏預覽' : '顯示預覽' }}
            </button>
            <button
              type="button"
              @click="showAiAssistant = !showAiAssistant"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              🤖 AI 協助
            </button>
          </div>
        </div>

        <div class="grid gap-4" :class="showPreview ? 'grid-cols-2' : 'grid-cols-1'">
          <!-- 編輯區域 -->
          <div>
            <textarea
              id="content"
              name="content"
              v-model="form.content"
              required
              rows="12"
              class="form-input resize-y"
              placeholder="請輸入文章內容 (支援 Markdown 格式)"
            ></textarea>
          </div>

          <!-- 預覽區域 -->
          <div v-if="showPreview" class="border rounded-lg bg-gray-50">
            <div class="bg-gray-100 px-4 py-2 border-b rounded-t-lg">
              <span class="text-sm font-medium text-gray-700">即時預覽</span>
            </div>
            <div
              class="p-4 prose prose-sm max-w-none min-h-[300px] bg-white"
              v-html="previewContent"
            ></div>
          </div>
        </div>
      </div>

      <!-- AI 協助面板 -->
      <div v-if="showAiAssistant" class="form-group">
        <AIAssistant
          :current-content="form.content"
          :current-title="form.title"
          @apply-suggestion="handleApplySuggestion"
          @append-suggestion="handleAppendSuggestion"
          @open-settings="handleOpenSettings"
        />
      </div>

      <div class="flex space-x-4">
        <button type="submit" :disabled="loading || !isFormValid" class="btn btn-primary flex-1">
          <span v-if="loading" class="loading-spinner mr-2"></span>
          {{ loading ? '新增中...' : '新增文章' }}
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary">清除</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { CreateArticleRequest } from '../types/article'
import { useMarkdown } from '../composables/useMarkdown'
import AIAssistant from './AIAssistant.vue'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'create-article', article: CreateArticleRequest): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()
const router = useRouter()

// 響應式狀態
const showPreview = ref(false)
const showAiAssistant = ref(false)
const { renderMarkdown } = useMarkdown()

const previewContent = computed(() => {
  if (!form.content.trim()) {
    return '<p class="text-gray-500 italic">請在左側輸入內容以查看預覽...</p>'
  }
  return renderMarkdown(form.content)
})

const form = reactive<CreateArticleRequest>({
  title: '',
  category: '',
  content: '',
})

const isFormValid = computed(() => form.title.trim() && form.category.trim() && form.content.trim())

// 方法
function handleSubmit() {
  if (!isFormValid.value) {
    return
  }

  emit('create-article', { ...form })
}

function resetForm() {
  Object.assign(form, {
    title: '',
    category: '',
    content: '',
  })
}

function handleApplySuggestion(suggestion: string) {
  form.content = suggestion
}

function handleAppendSuggestion(suggestion: string) {
  if (form.content.trim()) {
    form.content += '\n\n' + suggestion
  } else {
    form.content = suggestion
  }
}

function handleOpenSettings() {
  router.push('/admin/settings')
}

// 暴露組件方法供父組件使用
defineExpose({
  resetForm,
})
</script>
