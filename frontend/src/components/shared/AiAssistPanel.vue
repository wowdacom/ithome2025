<template>
  <div
    :class="[
      'mt-4 rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 ease-in-out overflow-hidden',
      {
        'p-5  opacity-100': aiPanel.show,
        'p-0 max-h-0 opacity-0': !aiPanel.show,
      },
    ]"
  >
    <h4 class="text-lg font-semibold text-indigo-700 mb-4 flex items-center">🤖 AI 寫作協助</h4>

    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <textarea
        ref="textareaRef"
        :value="aiPanel.prompt"
        @input="handleInput"
        placeholder="輸入您的需求，例如：改善這篇文章的結構&#10;Shift+Enter 換行，Enter 生成內容"
        @keydown="handleKeydown"
        rows="1"
        class="flex-1 px-4 py-3 border-2 border-transparent rounded-lg bg-white text-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none min-h-[2.75rem] max-h-32"
      />
    </div>
    <div>
      <button
        type="button"
        @click="() => handleAiAssist(currentContent)"
        :disabled="!aiPanel.prompt.trim() || aiPanel.loading"
        class="px-5 py-3 bg-gradient-to-r h-12 from-indigo-600 to-purple-600 text-white font-medium rounded-full transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
      >
        <span v-if="aiPanel.loading" class="loading-spinner m-2 h-2"></span>
        {{ aiPanel.loading ? '生成中...' : '生成內容' }}
      </button>
    </div>

    <div
      v-if="aiPanel.result"
      class="bg-white p-4 rounded-lg border border-blue-200 mb-4 whitespace-pre-wrap max-h-48 overflow-y-auto text-gray-700 leading-relaxed shadow-sm"
    >
      {{ aiPanel.result }}
    </div>

    <div v-if="aiPanel.result" class="flex flex-wrap gap-2">
      <button
        type="button"
        @click="handleApply"
        class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        套用到內容
      </button>
      <button
        type="button"
        @click="handleAppend"
        class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        附加到內容
      </button>
      <button
        type="button"
        @click="clearAiResult"
        class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        清除結果
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

interface Props {
  aiPanel: {
    show: boolean
    loading: boolean
    prompt: string
    result: string
  }
  currentContent: string
}

interface Emits {
  (e: 'ai-assist', content: string): void
  (e: 'apply-result', content: string): void
  (e: 'append-result', content: string): void
  (e: 'clear-result'): void
  (e: 'update-prompt', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const adjustTextareaHeight = async () => {
  await nextTick()
  if (textareaRef.value) {
    // 重置高度以獲得正確的 scrollHeight
    textareaRef.value.style.height = 'auto'
    // 設置新的高度，但不超過最大高度 (max-h-32 = 8rem = 128px)
    const newHeight = Math.min(textareaRef.value.scrollHeight, 128)
    textareaRef.value.style.height = `${newHeight}px`
  }
}

const handleInput = async (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = target.value

  // 發送 update-prompt 事件
  emit('update-prompt', value)

  // 調整 textarea 高度
  await adjustTextareaHeight()
}

// 監聽 prompt 變化，處理外部清除的情況
watch(
  () => props.aiPanel.prompt,
  () => {
    adjustTextareaHeight()
  },
  { immediate: true },
)

const handleAiAssist = (content: string) => {
  emit('ai-assist', content)
}

const handleKeydown = (event: KeyboardEvent) => {
  // 檢查是否正在使用輸入法（composing state）
  if (event.isComposing) {
    return
  }

  // Enter 鍵且沒有按 Shift - 觸發 AI 生成
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault() // 防止換行
    if (props.aiPanel.prompt.trim() && !props.aiPanel.loading) {
      handleAiAssist(props.currentContent)
    }
  }
  // Shift + Enter - 允許換行（不需要特別處理，瀏覽器預設行為）
}

const handleApply = () => {
  emit('apply-result', props.aiPanel.result)
}

const handleAppend = () => {
  const newContent = props.currentContent
    ? `${props.currentContent}\n\n${props.aiPanel.result}`
    : props.aiPanel.result
  emit('append-result', newContent)
}

const clearAiResult = () => {
  emit('clear-result')
}
</script>
