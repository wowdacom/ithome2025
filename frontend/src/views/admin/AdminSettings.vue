<!-- AdminSettings.vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 頁面標題 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">個人化設定</h1>
      <p class="mt-2 text-sm text-gray-600">管理您的個人資料和系統偏好設定</p>
    </div>

    <!-- 設定選項卡 -->
    <div class="bg-white shadow rounded-lg">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.icon }} {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- 個人資料設定 -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">個人資料</h3>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                顯示名稱
              </label>
              <input
                id="displayName"
                v-model="userSettings.displayName"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="請輸入您的顯示名稱"
              />
            </div>

            <div>
              <label for="avatar" class="block text-sm font-medium text-gray-700"> 頭像 URL </label>
              <input
                id="avatar"
                v-model="userSettings.avatar"
                type="url"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label for="theme" class="block text-sm font-medium text-gray-700"> 主題 </label>
              <select
                id="theme"
                v-model="userSettings.theme"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">淺色主題</option>
                <option value="dark">深色主題</option>
                <option value="auto">跟隨系統</option>
              </select>
            </div>

            <div>
              <label for="language" class="block text-sm font-medium text-gray-700"> 語言 </label>
              <select
                id="language"
                v-model="userSettings.language"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="zh-TW">繁體中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="saveUserSettings"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  class="opacity-25"
                ></circle>
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  class="opacity-75"
                ></path>
              </svg>
              {{ loading ? '儲存中...' : '儲存設定' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功/錯誤訊息 -->
    <div
      v-if="message"
      :class="[
        'fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 transition-all duration-300',
        message.type === 'success'
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200',
      ]"
    >
      <div class="flex items-center">
        <svg
          v-if="message.type === 'success'"
          class="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ message.text }}</span>
        <button
          @click="message = null"
          class="ml-3 text-sm font-medium underline hover:no-underline"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

// 響應式狀態
const activeTab = ref('profile')
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// 選項卡配置
const tabs = [{ id: 'profile', name: '個人資料', icon: '👤' }]

// 計算屬性和方法
const { userSettings, loading } = settingsStore
const { loadSettings, saveUserSettings: saveUser } = settingsStore

// 方法
const showMessage = (type: 'success' | 'error', text: string) => {
  message.value = { type, text }
  setTimeout(() => {
    message.value = null
  }, 5000)
}

const saveUserSettings = async () => {
  try {
    await saveUser(userSettings)
    showMessage('success', '個人資料已成功儲存')
  } catch (err) {
    console.error('儲存個人資料失敗:', err)
    showMessage('error', '儲存個人資料失敗')
  }
}

// 生命週期
onMounted(() => {
  loadSettings()
})
</script>
