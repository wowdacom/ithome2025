import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AISettings {
    openaiApiKey: string
    aiAssistanceEnabled: boolean
    model: string
    temperature: number
    maxTokens: number
}

export interface UserSettings {
    displayName: string
    avatar: string
    theme: 'light' | 'dark' | 'auto'
    language: 'zh-TW' | 'en'
    timezone: string
}

export const useSettingsStore = defineStore('settings', () => {
    // AI 設定
    const aiSettings = ref<AISettings>({
        openaiApiKey: '',
        aiAssistanceEnabled: false,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000
    })

    // 用戶個人化設定
    const userSettings = ref<UserSettings>({
        displayName: '',
        avatar: '',
        theme: 'light',
        language: 'zh-TW',
        timezone: 'Asia/Taipei'
    })

    // 載入狀態
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const isAIEnabled = computed(() => {
        return aiSettings.value.aiAssistanceEnabled && aiSettings.value.openaiApiKey.trim() !== ''
    })

    const hasValidAPIKey = computed(() => {
        return aiSettings.value.openaiApiKey.trim() !== '' &&
            aiSettings.value.openaiApiKey.startsWith('sk-')
    })

    // Actions
    const loadSettings = async () => {
        loading.value = true
        error.value = null

        try {
            // 從 localStorage 載入設定
            const savedAISettings = localStorage.getItem('ai-settings')
            const savedUserSettings = localStorage.getItem('user-settings')

            if (savedAISettings) {
                const parsed = JSON.parse(savedAISettings)
                aiSettings.value = { ...aiSettings.value, ...parsed }
            }

            if (savedUserSettings) {
                const parsed = JSON.parse(savedUserSettings)
                userSettings.value = { ...userSettings.value, ...parsed }
            }
        } catch (err) {
            error.value = '載入設定失敗'
            console.error('載入設定失敗:', err)
        } finally {
            loading.value = false
        }
    }

    const saveAISettings = async (settings: Partial<AISettings>) => {
        loading.value = true
        error.value = null

        try {
            aiSettings.value = { ...aiSettings.value, ...settings }
            localStorage.setItem('ai-settings', JSON.stringify(aiSettings.value))
        } catch (err) {
            error.value = '儲存 AI 設定失敗'
            console.error('儲存 AI 設定失敗:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const saveUserSettings = async (settings: Partial<UserSettings>) => {
        loading.value = true
        error.value = null

        try {
            userSettings.value = { ...userSettings.value, ...settings }
            localStorage.setItem('user-settings', JSON.stringify(userSettings.value))
        } catch (err) {
            error.value = '儲存用戶設定失敗'
            console.error('儲存用戶設定失敗:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const testAPIKey = async (apiKey: string): Promise<boolean> => {
        if (!apiKey.startsWith('sk-')) {
            throw new Error('API Key 格式不正確')
        }

        try {
            // 使用我們的後端服務進行測試
            const { aiService } = await import('@/services/aiService')
            const result = await aiService.testConnection()
            return result.success
        } catch (err) {
            console.error('測試 API Key 失敗:', err)
            return false
        }
    }

    const resetSettings = () => {
        aiSettings.value = {
            openaiApiKey: '',
            aiAssistanceEnabled: false,
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000
        }

        userSettings.value = {
            displayName: '',
            avatar: '',
            theme: 'light',
            language: 'zh-TW',
            timezone: 'Asia/Taipei'
        }

        localStorage.removeItem('ai-settings')
        localStorage.removeItem('user-settings')
    }

    return {
        // State
        aiSettings,
        userSettings,
        loading,
        error,

        // Computed
        isAIEnabled,
        hasValidAPIKey,

        // Actions
        loadSettings,
        saveAISettings,
        saveUserSettings,
        testAPIKey,
        resetSettings
    }
})
