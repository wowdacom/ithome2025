<template>
  <section class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">搜尋文章</h2>
    
    <div class="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="form-group">
          <label for="keyword" class="form-label">關鍵字</label>
          <input 
            id="keyword"
            ref="searchInput"
            type="text" 
            v-model="searchForm.keyword" 
            placeholder="搜尋標題或內容"
            @keyup.enter="handleSearch"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="category" class="form-label">分類</label>
          <input 
            id="category"
            type="text"
            v-model="searchForm.category"
            placeholder="特定分類"
            class="form-input"
          />
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="form-group">
          <label for="dateFrom" class="form-label">開始日期</label>
          <input 
            id="dateFrom"
            type="date"
            v-model="searchForm.dateFrom"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="dateTo" class="form-label">結束日期</label>
          <input 
            id="dateTo"
            type="date"
            v-model="searchForm.dateTo"
            class="form-input"
          />
        </div>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <button 
          type="button" 
          @click="handleSearch"
          class="btn btn-primary"
        >
          搜尋
        </button>
        <button 
          type="button" 
          @click="handleLoadAll" 
          class="btn btn-secondary"
        >
          顯示全部
        </button>
        <button 
          type="button" 
          @click="clearSearch" 
          class="btn btn-secondary"
        >
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