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
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <label for="avatar" class="block text-sm font-medium text-gray-700">
                頭像 URL
              </label>
              <input
                id="avatar"
                v-model="userSettings.avatar"
                type="url"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label for="theme" class="block text-sm font-medium text-gray-700">
                主題
              </label>
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
              <label for="language" class="block text-sm font-medium text-gray-700">
                語言
              </label>
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
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
              </svg>
              {{ loading ? '儲存中...' : '儲存設定' }}
            </button>
          </div>
        </div>

        <!-- AI 管理設定 -->
        <div v-if="activeTab === 'ai'" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">AI 協助功能</h3>
              <p class="text-sm text-gray-600">配置 OpenAI 整合設定以啟用 AI 寫作協助</p>
            </div>
            <div class="flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="aiSettings.aiAssistanceEnabled"
                  class="sr-only peer"
                  :disabled="!hasValidAPIKey"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                <span class="ml-3 text-sm font-medium text-gray-900">啟用 AI 協助</span>
              </label>
            </div>
          </div>

          <!-- API Key 設定 -->
          <div class="space-y-4">
            <div>
              <label for="apiKey" class="block text-sm font-medium text-gray-700">
                OpenAI API Key
              </label>
              <div class="mt-1 relative">
                <input
                  id="apiKey"
                  v-model="aiSettings.openaiApiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  class="block w-full border border-gray-300 rounded-md px-3 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="sk-..."
                />
                <div class="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    @click="showApiKey = !showApiKey"
                    class="px-3 py-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg v-if="showApiKey" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M9.878 9.878a3 3 0 105.303 5.303m0 0L17.25 17.25M14.12 14.12L17.25 17.25" />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="testAPIKey"
                    :disabled="!aiSettings.openaiApiKey || testingKey"
                    class="mr-2 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ testingKey ? '測試中...' : '測試' }}
                  </button>
                </div>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                請輸入您的 OpenAI API Key。Key 將安全地儲存在本地瀏覽器中。
              </p>
              
              <!-- API Key 狀態指示 -->
              <div v-if="apiKeyStatus" class="mt-2 flex items-center text-xs">
                <div
                  :class="[
                    'w-2 h-2 rounded-full mr-2',
                    apiKeyStatus === 'valid' ? 'bg-green-500' : 'bg-red-500'
                  ]"
                ></div>
                <span
                  :class="[
                    apiKeyStatus === 'valid' ? 'text-green-700' : 'text-red-700'
                  ]"
                >
                  {{ apiKeyStatus === 'valid' ? 'API Key 有效' : 'API Key 無效' }}
                </span>
              </div>
            </div>

            <!-- 進階設定 -->
            <div class="border-t pt-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">進階設定</h4>
              
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label for="model" class="block text-sm font-medium text-gray-700">
                    模型
                  </label>
                  <select
                    id="model"
                    v-model="aiSettings.model"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                  </select>
                </div>

                <div>
                  <label for="temperature" class="block text-sm font-medium text-gray-700">
                    創意度 ({{ aiSettings.temperature }})
                  </label>
                  <input
                    id="temperature"
                    v-model.number="aiSettings.temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    class="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>保守</span>
                    <span>創意</span>
                  </div>
                </div>

                <div>
                  <label for="maxTokens" class="block text-sm font-medium text-gray-700">
                    最大字數
                  </label>
                  <input
                    id="maxTokens"
                    v-model.number="aiSettings.maxTokens"
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="resetAISettings"
              class="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              重置設定
            </button>
            <button
              @click="saveAISettings"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
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
        message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
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
        <svg
          v-else
          class="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
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
const showApiKey = ref(false)
const testingKey = ref(false)
const apiKeyStatus = ref<'valid' | 'invalid' | null>(null)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// 選項卡配置
const tabs = [
  { id: 'profile', name: '個人資料', icon: '👤' },
  { id: 'ai', name: 'AI 管理', icon: '🤖' }
]

// 計算屬性和方法
const { aiSettings, userSettings, loading, hasValidAPIKey } = settingsStore
const { loadSettings, saveAISettings: saveAI, saveUserSettings: saveUser, testAPIKey: testKey } = settingsStore

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

const saveAISettings = async () => {
  try {
    await saveAI(aiSettings)
    showMessage('success', 'AI 設定已成功儲存')
  } catch (err) {
    console.error('儲存 AI 設定失敗:', err)
    showMessage('error', '儲存 AI 設定失敗')
  }
}

const testAPIKey = async () => {
  if (!aiSettings.openaiApiKey) {
    showMessage('error', '請先輸入 API Key')
    return
  }

  testingKey.value = true
  apiKeyStatus.value = null

  try {
    const isValid = await testKey(aiSettings.openaiApiKey)
    apiKeyStatus.value = isValid ? 'valid' : 'invalid'
    
    if (isValid) {
      showMessage('success', 'API Key 驗證成功')
    } else {
      showMessage('error', 'API Key 驗證失敗，請檢查是否正確')
    }
  } catch (err) {
    console.error('API Key 測試失敗:', err)
    apiKeyStatus.value = 'invalid'
    showMessage('error', 'API Key 測試失敗')
  } finally {
    testingKey.value = false
  }
}

const resetAISettings = () => {
  aiSettings.openaiApiKey = ''
  aiSettings.aiAssistanceEnabled = false
  aiSettings.model = 'gpt-3.5-turbo'
  aiSettings.temperature = 0.7
  aiSettings.maxTokens = 1000
  apiKeyStatus.value = null
  showMessage('success', 'AI 設定已重置')
}

// 生命週期
onMounted(() => {
  loadSettings()
})
</script>