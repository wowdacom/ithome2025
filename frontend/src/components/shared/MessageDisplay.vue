<template>
  <div 
    v-if="message?.text" 
    :class="[
      'px-4 py-3 rounded-md border transition-all duration-300 ease-in-out',
      {
        'bg-green-50 border-green-200 text-green-800': message.type === 'success',
        'bg-red-50 border-red-200 text-red-800': message.type === 'error',
        'bg-blue-50 border-blue-200 text-blue-800': message.type === 'info'
      }
    ]"
  >
    {{ message.text }}
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import type { MessageState } from '@/types/article'

interface Props {
  message?: MessageState
}

interface Emits {
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  message: () => ({ text: '', type: 'info' }),
})
const emit = defineEmits<Emits>()

// Constants for timeout durations
const TIMEOUT_DURATION = {
  success: 3000,
  error: 5000,
  info: 3000,
} as const

function clearMessage() {
  emit('clear')
}

function setupAutoClearing() {
  if (props.message?.text) {
    const timeout = TIMEOUT_DURATION[props.message.type] || TIMEOUT_DURATION.info
    setTimeout(clearMessage, timeout)
  }
}

// Auto clear on mount
onMounted(() => {
  setupAutoClearing()
})

// Auto clear when message changes
watch(
  () => props.message?.text,
  () => {
    setupAutoClearing()
  },
)
</script>
