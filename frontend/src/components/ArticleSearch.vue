<template>
  <section>
    <h2>搜尋文章</h2>
    <div class="search-section">
      <div class="search-row">
        <div class="form-group">
          <label for="keyword">關鍵字</label>
          <input 
            id="keyword"
            ref="searchInput"
            type="text" 
            v-model="searchForm.keyword" 
            placeholder="搜尋標題或內容"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="form-group">
          <label for="category">分類</label>
          <input 
            id="category"
            type="text"
            v-model="searchForm.category"
            placeholder="特定分類"
          />
        </div>
      </div>
      <div class="search-row">
        <div class="form-group">
          <label for="dateFrom">開始日期</label>
          <input 
            id="dateFrom"
            type="date"
            v-model="searchForm.dateFrom"
          />
        </div>
        <div class="form-group">
          <label for="dateTo">結束日期</label>
          <input 
            id="dateTo"
            type="date"
            v-model="searchForm.dateTo"
          />
        </div>
      </div>
      <div class="button-group">
        <button type="button" @click="handleSearch">
          搜尋
        </button>
        <button type="button" @click="handleLoadAll" class="secondary">
          顯示全部
        </button>
        <button type="button" @click="clearSearch" class="secondary">
          清除
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { SearchFilters } from '@/types/article'

interface Emits {
  (e: 'search', filters: SearchFilters): void
  (e: 'load-all'): void
}

const emit = defineEmits<Emits>()

const searchInput = ref<HTMLInputElement>()

const searchForm = reactive<SearchFilters>({
  keyword: '',
  category: '',
  dateFrom: '',
  dateTo: ''
})

function handleSearch() {
  emit('search', { ...searchForm })
}

function handleLoadAll() {
  emit('load-all')
}

function clearSearch() {
  Object.assign(searchForm, {
    keyword: '',
    category: '',
    dateFrom: '',
    dateTo: ''
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
.search-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.search-row:last-child {
  margin-bottom: 0;
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
  flex-wrap: wrap;
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

button.secondary {
  background: #6c757d;
}

button.secondary:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .search-row {
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