import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../settingsStore'

describe('SettingsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        // 清除 localStorage
        localStorage.clear()
    })

    it('應該初始化預設設定', () => {
        const store = useSettingsStore()

        expect(store.aiSettings.openaiApiKey).toBe('')
        expect(store.aiSettings.aiAssistanceEnabled).toBe(false)
        expect(store.aiSettings.model).toBe('gpt-3.5-turbo')
        expect(store.userSettings.theme).toBe('light')
        expect(store.userSettings.language).toBe('zh-TW')
    })

    it('應該正確判斷 AI 是否啟用', () => {
        const store = useSettingsStore()

        // 預設狀態：未啟用
        expect(store.isAIEnabled).toBe(false)

        // 只設定 API Key，但未啟用
        store.aiSettings.openaiApiKey = 'sk-test123'
        expect(store.isAIEnabled).toBe(false)

        // 設定 API Key 並啟用
        store.aiSettings.aiAssistanceEnabled = true
        expect(store.isAIEnabled).toBe(true)
    })

    it('應該正確驗證 API Key 格式', () => {
        const store = useSettingsStore()

        store.aiSettings.openaiApiKey = 'invalid-key'
        expect(store.hasValidAPIKey).toBe(false)

        store.aiSettings.openaiApiKey = 'sk-valid-key'
        expect(store.hasValidAPIKey).toBe(true)
    })

    it('應該能儲存和載入 AI 設定', async () => {
        const store = useSettingsStore()

        const aiSettings = {
            openaiApiKey: 'sk-test123',
            aiAssistanceEnabled: true,
            model: 'gpt-4',
            temperature: 0.5,
            maxTokens: 2000
        }

        await store.saveAISettings(aiSettings)

        // 驗證設定已儲存到 store
        expect(store.aiSettings.openaiApiKey).toBe('sk-test123')
        expect(store.aiSettings.model).toBe('gpt-4')

        // 驗證設定已儲存到 localStorage
        const saved = JSON.parse(localStorage.getItem('ai-settings') || '{}')
        expect(saved.openaiApiKey).toBe('sk-test123')
        expect(saved.model).toBe('gpt-4')
    })

    it('應該能儲存和載入用戶設定', async () => {
        const store = useSettingsStore()

        const userSettings = {
            displayName: '測試用戶',
            theme: 'dark' as const,
            language: 'en' as const
        }

        await store.saveUserSettings(userSettings)

        // 驗證設定已儲存到 store
        expect(store.userSettings.displayName).toBe('測試用戶')
        expect(store.userSettings.theme).toBe('dark')

        // 驗證設定已儲存到 localStorage
        const saved = JSON.parse(localStorage.getItem('user-settings') || '{}')
        expect(saved.displayName).toBe('測試用戶')
        expect(saved.theme).toBe('dark')
    })

    it('應該能從 localStorage 載入設定', async () => {
        // 預先在 localStorage 中設定資料
        localStorage.setItem('ai-settings', JSON.stringify({
            openaiApiKey: 'sk-saved-key',
            model: 'gpt-4'
        }))

        localStorage.setItem('user-settings', JSON.stringify({
            displayName: '已儲存的用戶',
            theme: 'dark'
        }))

        const store = useSettingsStore()
        await store.loadSettings()

        expect(store.aiSettings.openaiApiKey).toBe('sk-saved-key')
        expect(store.aiSettings.model).toBe('gpt-4')
        expect(store.userSettings.displayName).toBe('已儲存的用戶')
        expect(store.userSettings.theme).toBe('dark')
    })

    it('應該能重置所有設定', () => {
        const store = useSettingsStore()

        // 設定一些值
        store.aiSettings.openaiApiKey = 'sk-test'
        store.aiSettings.aiAssistanceEnabled = true
        store.userSettings.displayName = '測試'

        store.resetSettings()

        // 驗證已重置
        expect(store.aiSettings.openaiApiKey).toBe('')
        expect(store.aiSettings.aiAssistanceEnabled).toBe(false)
        expect(store.userSettings.displayName).toBe('')
        expect(localStorage.getItem('ai-settings')).toBeNull()
        expect(localStorage.getItem('user-settings')).toBeNull()
    })

    it('應該能測試 API Key（模擬）', async () => {
        const store = useSettingsStore()

        // 模擬 fetch 成功
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] })
        })

        const result = await store.testAPIKey('sk-valid-key')
        expect(result).toBe(true)

        // 模擬 fetch 失敗
        global.fetch = vi.fn().mockResolvedValue({
            ok: false
        })

        const result2 = await store.testAPIKey('sk-invalid-key')
        expect(result2).toBe(false)
    })

    it('應該處理錯誤格式的 API Key', async () => {
        const store = useSettingsStore()

        await expect(store.testAPIKey('invalid-format')).rejects.toThrow('API Key 格式不正確')
    })
})
