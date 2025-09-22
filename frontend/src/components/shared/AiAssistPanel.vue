<template>
  <div
    :class="[
      'mt-4 rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 ease-in-out overflow-hidden',
      {
        'p-5 max-h-96 opacity-100': aiPanel.show,
        'p-0 max-h-0 opacity-0': !aiPanel.show,
      },
    ]"
  >
    <h4 class="text-lg font-semibold text-indigo-700 mb-4 flex items-center">🤖 AI 寫作協助</h4>

    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <input
        type="text"
        :value="aiPanel.prompt"
        @input="(e) => $emit('update-prompt', (e.target as HTMLInputElement).value)"
        placeholder="輸入您的需求，例如：改善這篇文章的結構"
        @keyup.enter="() => handleAiAssist(currentContent)"
        class="flex-1 px-4 py-3 border-2 border-transparent rounded-full bg-white text-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
      />
      <button
        type="button"
        @click="() => handleAiAssist(currentContent)"
        :disabled="!aiPanel.prompt.trim() || aiPanel.loading"
        class="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
      >
        <span v-if="aiPanel.loading" class="loading-spinner mr-2"></span>
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

const handleAiAssist = (content: string) => {
  emit('ai-assist', content)
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
