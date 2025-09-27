<template>
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">留言討論 (使用 GitHub Issues)</h2>
      <div ref="container" id="utterances-container"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  repo?: string
  issueTerm?: string
  theme?: string
  articleTitle?: string
  currentPath?: string
}>()

const container = ref<HTMLElement | null>(null)

const repo = props.repo ?? 'wowdacom/blog.comment'
const issueTerm = props.issueTerm ?? 'pathname'
const theme = props.theme ?? 'dark-blue'

let scriptEl: HTMLScriptElement | null = null
let previousTitle: string | undefined

function createUtterances() {
  if (!container.value) return
  // remove existing children
  container.value.innerHTML = ''

  // If issue-term is `title`, utterances reads document.title; only override when explicitly requested
  if (issueTerm === 'title' && props.articleTitle) {
    previousTitle = document.title
    document.title = props.articleTitle
  }

  scriptEl = document.createElement('script')
  scriptEl.setAttribute('src', 'https://utteranc.es/client.js')
  scriptEl.setAttribute('repo', repo)
  scriptEl.setAttribute('issue-term', issueTerm)
  scriptEl.setAttribute('theme', theme)
  scriptEl.setAttribute('crossorigin', 'anonymous')
  scriptEl.setAttribute('async', 'true')

  container.value.appendChild(scriptEl)
}

function removeUtterances() {
  if (container.value) {
    container.value.innerHTML = ''
  }
  if (previousTitle !== undefined) {
    document.title = previousTitle
    previousTitle = undefined
  }
  scriptEl = null
}

onMounted(() => {
  createUtterances()
})

onBeforeUnmount(() => {
  removeUtterances()
})

// re-create when title changes (useful for SPA navigation)
// re-create when title or currentPath changes (SPA navigation)
watch(
  () => [props.articleTitle, props.currentPath],
  () => {
    removeUtterances()
    createUtterances()
  },
)
</script>

<style scoped>
</style>
