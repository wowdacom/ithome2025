<template>
  <section class="max-w-2xl mx-auto p-6">
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

      <div class="form-group">
        <label for="content" class="form-label">內容</label>
        <textarea
          id="content"
          name="content"
          v-model="form.content"
          required
          rows="8"
          class="form-input resize-y"
          placeholder="請輸入文章內容"
        ></textarea>
        <button
          type="button"
          @click="toggleAiPanel"
          class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          :disabled="loading || aiPanel.loading"
        >
          🤖 AI 協助
        </button>
      </div>

      <!-- AI 協助面板 -->
      <AiAssistPanel
        :ai-panel="aiPanel"
        :current-content="form.content"
        @ai-assist="handleAiAssistRequest"
        @update-prompt="updatePrompt"
        @apply-result="handleApplyAiResult"
        @append-result="handleAppendAiResult"
        @clear-result="clearAiResult"
      />

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
import { computed, reactive } from 'vue'
import type { CreateArticleRequest } from '../types/article'
import { useAiAssist } from '../composables/useAiAssist'
import AiAssistPanel from './shared/AiAssistPanel.vue'

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

const form = reactive<CreateArticleRequest>({
  title: '',
  category: '',
  content: '',
})

const { aiPanel, toggleAiPanel, handleAiAssist, resetAiPanel } = useAiAssist()

const isFormValid = computed(() => form.title.trim() && form.category.trim() && form.content.trim())

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
  resetAiPanel()
}

function handleAiAssistRequest(content: string) {
  handleAiAssist(content)
}

function updatePrompt(value: string) {
  aiPanel.prompt = value
}

function handleApplyAiResult(content: string) {
  form.content = content
}

function handleAppendAiResult(content: string) {
  form.content = content
}

function clearAiResult() {
  aiPanel.result = ''
  aiPanel.prompt = ''
}

// 暴露組件方法供父組件使用
defineExpose({
  resetForm,
})
</script>
