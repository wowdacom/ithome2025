<template>
  <div class="max-w-4xl mx-auto p-6">
    <header class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">新增文章</h2>
      <p class="text-gray-600">建立一篇新的部落格文章</p>
    </header>

    <!-- 訊息提示組件 -->
    <MessageDisplay :message="messageState" @clear="clearMessage" />

    <!-- 新增文章表單組件 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <ArticleForm
        ref="articleFormRef"
        :loading="loading"
        @create-article="handleCreateArticle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiClient } from '../../utils/apiClient'
import ArticleForm from '../../components/ArticleForm.vue'
import MessageDisplay from '../../components/shared/MessageDisplay.vue'
import type { CreateArticleRequest, MessageState } from '../../types/article'

const loading = ref(false)
const messageState = ref<MessageState>({ text: '', type: 'info' })
const articleFormRef = ref<InstanceType<typeof ArticleForm>>()

const handleCreateArticle = async (articleData: CreateArticleRequest) => {
  loading.value = true
  
  try {
    await apiClient.post('/articles', articleData)
    messageState.value = { text: '文章建立成功！', type: 'success' }
    
    // 重置表單
    if (articleFormRef.value) {
      articleFormRef.value.resetForm()
    }
    
  } catch (error) {
    console.error('建立文章失敗:', error)
    messageState.value = { text: '建立文章失敗，請稍後再試', type: 'error' }
  } finally {
    loading.value = false
  }
}

const clearMessage = () => {
  messageState.value = { text: '', type: 'info' }
}
</script>