<template>
  <div v-if="message?.text" :class="['message', message.type]">
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

<style scoped>
.message {
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.message.success {
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.message.error {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

.message.info {
  color: #0c5460;
  background: #d1ecf1;
  border: 1px solid #bee5eb;
}
</style>
