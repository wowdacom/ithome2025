// 在瀏覽器 console 中執行這段程式碼來調試
async function debugFrontendAPI() {
  console.log('=== 前端 API 調試 ===')

  // 檢查環境變數
  console.log('當前環境變數:')
  console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL)
  console.log('- MODE:', import.meta.env.MODE)
  console.log('- DEV:', import.meta.env.DEV)

  // 測試直接的 fetch 呼叫
  try {
    console.log('\n=== 測試直接 fetch ===')
    const response = await fetch('http://localhost:3000/api/articles')
    console.log('Response:', response)
    console.log('Status:', response.status)
    console.log('Headers:', [...response.headers.entries()])

    const data = await response.json()
    console.log('Data:', data)
    console.log('Data type:', typeof data)
    console.log('Is array:', Array.isArray(data))

    return data
  } catch (error) {
    console.error('Direct fetch error:', error)
  }
}

// 測試 ArticleService
async function debugArticleService() {
  try {
    console.log('\n=== 測試 ArticleService ===')

    // 檢查是否有 store
    if (window.Vue && window.Vue.apps && window.Vue.apps[0]) {
      const app = window.Vue.apps[0]
      console.log('Vue app found:', app)
    }

    // 手動載入並測試
    const response = await fetch('http://localhost:3000/api/articles')
    const data = await response.json()

    console.log('Manual load result:', data)
    console.log('Length:', data?.length)

    if (data && data.length > 0) {
      console.log('First article:', data[0])
      console.log('Article fields:', Object.keys(data[0]))
    }
  } catch (error) {
    console.error('ArticleService debug error:', error)
  }
}

// 執行測試
window.debugFrontendAPI = debugFrontendAPI
window.debugArticleService = debugArticleService

console.log('調試函數已載入。在 console 中執行:')
console.log('- debugFrontendAPI()')
console.log('- debugArticleService()')
