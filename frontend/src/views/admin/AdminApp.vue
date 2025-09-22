<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-gray-900">部落格後台管理</h1>
          <nav>
            <router-link
              to="/blog"
              class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              查看部落格
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- 導航選項卡 -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <router-link
            to="/admin/articles"
            class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors duration-200"
            active-class="!text-blue-600 !border-blue-600"
          >
            📚 文章管理
          </router-link>
          <router-link
            to="/admin/create-article"
            class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors duration-200"
            active-class="!text-blue-600 !border-blue-600"
          >
            📝 新增文章
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 路由內容 -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 移除原本的組件邏輯，現在只作為導航容器
</script>
