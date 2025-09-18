<template>
  <section>
    <h2>新增文章</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">標題</label>
        <input id="title" name="title" type="text" v-model="form.title" required />
      </div>
      <div class="form-group">
        <label for="category">分類</label>
        <input id="category" name="category" type="text" v-model="form.category" required />
      </div>
      <div class="form-group">
        <label for="content">內容</label>
        <textarea id="content" name="content" v-model="form.content" required></textarea>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? '新增中...' : '新增文章' }}
      </button>
      <button type="button" @click="resetForm" class="secondary">清除</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { CreateArticleRequest } from '@/types/article'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'create-article', data: CreateArticleRequest): void
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
}

// Expose method for parent components
function clearForm() {
  resetForm()
}

defineExpose({
  clearForm,
})
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  height: 120px;
  resize: vertical;
}

button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

button.secondary {
  background: #6c757d;
}

button.secondary:hover {
  background: #545b62;
}
</style>
