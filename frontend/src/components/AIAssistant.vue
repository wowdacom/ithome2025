<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- AI 協助標題 -->
    <div class="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600">🤖</span>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900">AI 寫作協助</h3>
            <p class="text-xs text-gray-500">智能協助提升文章品質</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div
            :class="[
              'w-2 h-2 rounded-full',
              isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500',
            ]"
            title="AI 服務狀態"
          ></div>
        </div>
      </div>
    </div>

    <!-- AI 協助內容 -->
    <div class="p-4">
      <div class="space-y-4">
        <!-- 快速協助選項 -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">快速協助</h4>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in quickOptions"
              :key="option.key"
              @click="handleQuickAssist(option)"
              :disabled="loading"
              class="text-left p-3 text-xs bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <div class="font-medium text-gray-900">{{ option.name }}</div>
              <div class="text-gray-500 mt-1">{{ option.description }}</div>
            </button>
          </div>
        </div>

        <!-- 自定義請求 -->
        <div>
          <label for="customRequest" class="block text-sm font-medium text-gray-900 mb-2">
            自定義請求
          </label>
          <div class="space-y-2">
            <textarea
              id="customRequest"
              v-model="customRequest"
              rows="3"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="請描述您希望 AI 如何協助您，例如：幫我改善這篇文章的開頭段落..."
            ></textarea>
            <button
              @click="handleCustomAssist"
              :disabled="!customRequest.trim() || loading"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  class="opacity-25"
                ></circle>
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  class="opacity-75"
                ></path>
              </svg>
              {{ loading ? '處理中...' : '獲取 AI 建議' }}
            </button>
          </div>
        </div>

        <!-- AI 建議結果 -->
        <div v-if="aiSuggestion" class="border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-900">AI 建議</h4>
            <button @click="clearSuggestion" class="text-xs text-gray-500 hover:text-gray-700">
              清除
            </button>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
            <div class="text-sm text-gray-800 whitespace-pre-wrap">{{ aiSuggestion }}</div>
          </div>

          <div class="flex space-x-2">
            <button
              @click="$emit('applySuggestion', aiSuggestion)"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              套用建議
            </button>
            <button
              @click="$emit('appendSuggestion', aiSuggestion)"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              附加到內容
            </button>
          </div>
        </div>

        <!-- 使用記錄 -->
        <div v-if="usageHistory.length > 0" class="border-t pt-4">
          <details class="group">
            <summary
              class="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              <span>使用記錄 ({{ usageHistory.length }})</span>
              <svg
                class="w-4 h-4 text-gray-500 group-open:rotate-90 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </summary>
            <div class="mt-3 space-y-2 max-h-40 overflow-y-auto">
              <div
                v-for="(item, index) in usageHistory.slice().reverse()"
                :key="index"
                class="text-xs bg-gray-50 border border-gray-200 rounded p-2"
              >
                <div class="text-gray-600 mb-1">{{ item.timestamp }}</div>
                <div class="font-medium text-gray-800">{{ item.request }}</div>
                <div class="text-gray-500 mt-1 truncate">{{ item.response }}</div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props
interface Props {
  currentContent?: string
  currentTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentContent: '',
  currentTitle: '',
})

// Emits
defineEmits<{
  applySuggestion: [suggestion: string]
  appendSuggestion: [suggestion: string]
  openSettings: []
}>()

// 響應式狀態
const loading = ref(false)
const customRequest = ref('')
const aiSuggestion = ref('')
const usageHistory = ref<
  Array<{
    timestamp: string
    request: string
    response: string
  }>
>([])

// 計算屬性
const isProcessing = computed(() => loading.value)

// 快速協助選項
const quickOptions = [
  {
    key: 'improve_intro',
    name: '改善開頭',
    description: '優化文章開頭段落',
  },
  {
    key: 'add_examples',
    name: '增加範例',
    description: '為內容添加實用範例',
  },
  {
    key: 'improve_structure',
    name: '改善結構',
    description: '優化文章邏輯結構',
  },
  {
    key: 'add_conclusion',
    name: '撰寫結論',
    description: '為文章添加總結段落',
  },
]

// 方法
const handleQuickAssist = async (option: (typeof quickOptions)[0]) => {
  const prompts = {
    improve_intro: `請幫我改善這篇文章的開頭段落，讓它更吸引讀者：\n\n標題：${props.currentTitle}\n內容：${props.currentContent.slice(0, 500)}...`,
    add_examples: `請為這篇技術文章添加一些實用的程式碼範例或實際案例：\n\n${props.currentContent}`,
    improve_structure: `請幫我重新組織這篇文章的結構，讓邏輯更清晰：\n\n${props.currentContent}`,
    add_conclusion: `請為這篇文章撰寫一個有力的結論段落：\n\n${props.currentContent}`,
  }

  customRequest.value = prompts[option.key as keyof typeof prompts]
  await handleCustomAssist()
}

const handleCustomAssist = async () => {
  if (!customRequest.value.trim()) return

  loading.value = true

  try {
    // 呼叫真實的 AI 服務
    const { aiService } = await import('@/services/aiService')

    const result = await aiService.generateContent({
      prompt: customRequest.value,
      articleContent: props.currentContent,
      articleId: undefined, // 可以根據需要傳入文章 ID
    })

    if (result.success) {
      aiSuggestion.value = result.improvedContent

      // 記錄使用歷史
      usageHistory.value.push({
        timestamp: new Date().toLocaleString('zh-TW'),
        request: customRequest.value,
        response: result.improvedContent,
      })

      // 儲存到 localStorage
      localStorage.setItem('ai-usage-history', JSON.stringify(usageHistory.value))

      customRequest.value = ''
    } else {
      aiSuggestion.value = `AI 協助失敗：${result.error || '未知錯誤'}`
    }
  } catch (error) {
    console.error('AI 協助失敗:', error)
    aiSuggestion.value = 'AI 協助處理失敗，請稍後再試。請確認後端服務是否正常運行。'
  } finally {
    loading.value = false
  }
}

const clearSuggestion = () => {
  aiSuggestion.value = ''
}

// 載入使用歷史
onMounted(() => {
  const savedHistory = localStorage.getItem('ai-usage-history')
  if (savedHistory) {
    try {
      usageHistory.value = JSON.parse(savedHistory)
    } catch (error) {
      console.error('載入 AI 使用歷史失敗:', error)
    }
  }
})
</script>
