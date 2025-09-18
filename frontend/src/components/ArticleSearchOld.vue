<template>
  <section>
    <h2>搜尋文章</h2>
    <form @submit.prevent="handleSearch">
      <div class="search-group">
        <div class="form-group">
          <label for="keyword">關鍵字</label>
          <input 
            id="keyword"
            ref="searchInput"
            type="text" 
            v-model="searchForm.keyword" 
            placeholder="輸入搜尋關鍵字..."
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="form-group">
          <label for="category">分類</label>
          <select 
            id="category"
            v-model="searchForm.category"
          >
            <option 
              v-for="option in categoryOptions" 
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="button-group">
        <button type="submit">搜尋</button>
        <button type="button" @click="clearSearch">清除</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { SearchFilters } from '@/types/article'

interface Emits {
  (e: 'search', filters: SearchFilters): void
}

const emit = defineEmits<Emits>()

const searchInput = ref<HTMLInputElement>()

const searchForm = reactive<SearchFilters>({
  keyword: '',
  category: ''
})

// 預定義分類選項
const categoryOptions = [
  { value: '', label: '所有分類' },
  { value: '技術', label: '技術' },
  { value: '教學', label: '教學' },
  { value: '心得', label: '心得' },
  { value: '新聞', label: '新聞' }
] as const

function handleSearch() {
  emit('search', { ...searchForm })
}

function clearSearch() {
  Object.assign(searchForm, {
    keyword: '',
    category: ''
  })
}

onMounted(() => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
})

// Expose method for parent components
defineExpose({
  clearSearch
})
</script>

<style scoped>
.search-group {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

button[type="button"] {
  background: #6c757d;
}

button[type="button"]:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .search-group {
    flex-direction: column;
  }
  
  .form-group {
    min-width: 100%;
  }
  
  .button-group {
    justify-content: stretch;
  }
  
  button {
    flex: 1;
  }
}
</style>