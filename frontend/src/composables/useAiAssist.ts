import { reactive } from 'vue'
import { apiClient } from '../utils/apiClient'

interface AiAssistState {
  show: boolean
  loading: boolean
  prompt: string
  result: string
}

interface AiAssistRequest {
  prompt: string
  articleContent?: string
}

interface AiAssistResponse {
  improvedContent: string
  originalPrompt: string
  logId: string
  timestamp: string
}

export function useAiAssist() {
  const aiPanel = reactive<AiAssistState>({
    show: false,
    loading: false,
    prompt: '',
    result: '',
  })

  const toggleAiPanel = () => {
    aiPanel.show = !aiPanel.show
    if (!aiPanel.show) {
      clearAiResult()
    }
  }

  const handleAiAssist = async (currentContent: string) => {
    if (!aiPanel.prompt.trim()) return

    aiPanel.loading = true
    try {
      console.log('發送 AI 請求:', { prompt: aiPanel.prompt, currentContent })

      const response = await apiClient.post<AiAssistResponse>('/ai/assist', {
        prompt: aiPanel.prompt,
        articleContent: currentContent
      } as AiAssistRequest)

      console.log('收到 AI 回應:', response)
      aiPanel.result = response.improvedContent
      console.log('設置 aiPanel.result:', aiPanel.result)
    } catch (error: unknown) {
      console.error('AI 協助失敗:', error)
      const errorMessage = error instanceof Error ? error.message : '未知錯誤'
      aiPanel.result = `錯誤: ${errorMessage}`
    } finally {
      aiPanel.loading = false
    }
  }

  const applyAiResult = () => {
    const result = aiPanel.result
    clearAiResult()
    return result
  }

  const appendAiResult = (currentContent: string) => {
    const result = currentContent ? `${currentContent}\n\n${aiPanel.result}` : aiPanel.result
    clearAiResult()
    return result
  }

  const clearAiResult = () => {
    aiPanel.result = ''
    aiPanel.prompt = ''
  }

  const resetAiPanel = () => {
    Object.assign(aiPanel, {
      show: false,
      loading: false,
      prompt: '',
      result: '',
    })
  }

  return {
    aiPanel,
    toggleAiPanel,
    handleAiAssist,
    applyAiResult,
    appendAiResult,
    clearAiResult,
    resetAiPanel,
  }
}
