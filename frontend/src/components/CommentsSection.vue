<template>
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">留言討論</h2>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="flex gap-3">
          <input v-model="author" type="text" placeholder="你的名稱 (選填)" class="flex-1 px-3 py-2 border rounded-md" />
          <input v-model="email" type="email" placeholder="電子郵件 (選填)" class="w-56 px-3 py-2 border rounded-md" />
        </div>

        <textarea v-model="message" rows="4" placeholder="寫下你的留言..." class="w-full px-3 py-2 border rounded-md"></textarea>

        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">留言會儲存在你的瀏覽器 (localStorage)。</div>
          <div class="flex gap-2">
            <button type="button" @click="clearForm" class="px-3 py-1.5 border rounded-md text-sm">清除</button>
            <button type="submit" :disabled="submitting || !message.trim()" class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">{{ submitting ? '送出中…' : '送出留言' }}</button>
          </div>
        </div>
      </form>

      <hr class="my-6" />

      <div v-if="comments.length === 0" class="text-gray-500">還沒有留言，成為第一個發表的人！</div>

      <ul class="space-y-4">
        <li v-for="c in comments" :key="c.id" class="border p-4 rounded-md">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-sm font-medium text-gray-900">{{ c.author || '匿名' }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(c.createdAt) }} · {{ c.email || '' }}</div>
            </div>
            <div class="text-right">
              <button @click="deleteComment(c.id)" class="text-xs text-red-600 hover:text-red-700">刪除</button>
            </div>
          </div>

          <p class="mt-3 text-gray-700 whitespace-pre-wrap">{{ c.message }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useComments } from '@/composables/useComments'

interface CommentItem {
  id: string
  author?: string
  email?: string
  message: string
  createdAt: number
}

const props = defineProps<{ articleId: string }>()

const { loadComments, addComment, removeComment, subscribe } = useComments()

const comments = ref<CommentItem[]>([])
const author = ref('')
const email = ref('')
const message = ref('')
const submitting = ref(false)

const refresh = async () => {
  comments.value = await loadComments(props.articleId)
}

onMounted(refresh)

// in case other tabs update localStorage
const unsubscribe = subscribe(props.articleId, () => refresh())

onUnmounted(() => {
  unsubscribe()
})

async function onSubmit() {
  if (!message.value.trim()) return
  submitting.value = true
  try {
    const newComment: Omit<CommentItem, 'id' | 'createdAt'> & { id?: string } = {
      author: author.value.trim() || undefined,
      email: email.value.trim() || undefined,
      message: message.value.trim(),
    }
  await addComment(props.articleId, newComment)
    // reset
    author.value = ''
    email.value = ''
    message.value = ''
    await refresh()
  } catch (err) {
    console.error('Add comment failed', err)
  } finally {
    submitting.value = false
  }
}

async function deleteComment(id: string) {
  await removeComment(props.articleId, id)
  await refresh()
}

function clearForm() {
  author.value = ''
  email.value = ''
  message.value = ''
}

function formatDate(ts: number) {
  const d = new Date(ts)
  return d.toLocaleString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
</style>
