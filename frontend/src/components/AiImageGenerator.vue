<template>
  <div class="p-4 border rounded-lg bg-gray-50">
    <label class="block text-sm font-medium text-gray-700 mb-2">圖片描述 (prompt)</label>
    <input v-model="prompt" type="text" placeholder="例如：a futuristic city skyline at sunset" class="w-full px-3 py-2 border rounded-md mb-3" />

    <div class="flex items-center gap-3 mb-3">
      <label class="text-sm text-gray-600">尺寸</label>
      <select v-model="size" class="px-2 py-1 border rounded-md">
        <option value="800x600">800 x 600</option>
        <option value="1024x768">1024 x 768</option>
        <option value="640x480">640 x 480</option>
      </select>
      <button @click="generate" :disabled="generating || !prompt.trim()" class="ml-auto px-3 py-1.5 bg-blue-600 text-white rounded-md">{{ generating ? '產生中…' : '產生圖片' }}</button>
    </div>

    <div v-if="imageUrl" class="mb-3">
      <div class="mb-2 text-sm text-gray-600">預覽</div>
      <img :src="imageUrl" :alt="prompt" class="w-full rounded-md border" />
    </div>

    <div class="flex justify-end gap-2">
      <button @click="onCancel" type="button" class="px-3 py-1.5 border rounded-md">取消</button>
      <button @click="onInsert" type="button" :disabled="!imageUrl" class="px-3 py-1.5 bg-green-600 text-white rounded-md">插入文章</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  initialPrompt?: string
}>(), { initialPrompt: '' })

const emit = defineEmits<{
  (e: 'generated', payload: { url: string; prompt: string }): void
  (e: 'cancel'): void
}>()

const prompt = ref(props.initialPrompt)
const size = ref('800x600')
const generating = ref(false)
const imageUrl = ref('')

function hashStringToSeed(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

async function generate() {
  if (!prompt.value.trim()) return
  generating.value = true
  try {
    // 使用 picsum.photos 透過 seed 模擬產圖 (示範用途)
    const seed = hashStringToSeed(prompt.value.trim())
    const [w, h] = size.value.split('x')
    // 使用 stable url，picsum 支援 /seed/{seed}/{w}/{h}
    imageUrl.value = `https://picsum.photos/seed/${seed}/${w}/${h}`
    // small delay to simulate generation
    await new Promise((r) => setTimeout(r, 500))
  } finally {
    generating.value = false
  }
}

function onInsert() {
  if (!imageUrl.value) return
  emit('generated', { url: imageUrl.value, prompt: prompt.value.trim() })
}

function onCancel() {
  emit('cancel')
}
</script>

<style scoped>
</style>
