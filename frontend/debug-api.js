// 調試前端 API 呼叫
console.log('開始檢查 API 呼叫...')

// 檢查環境變數
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)

// 手動測試 API 呼叫
async function testApiCall() {
  try {
    console.log('正在呼叫 API: http://localhost:3000/api/articles')

    const response = await fetch('http://localhost:3000/api/articles')
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    const data = await response.json()
    console.log('API 回傳資料:', data)
    console.log('資料類型:', typeof data)
    console.log('是否為陣列:', Array.isArray(data))
    console.log('資料長度:', data.length)

    if (data.length > 0) {
      console.log('第一筆資料:', data[0])
      console.log('第一筆資料的欄位:', Object.keys(data[0]))
    }

    return data
  } catch (error) {
    console.error('API 呼叫錯誤:', error)
  }
}

// 檢查 ArticleService
async function testArticleService() {
  try {
    // 模擬 ArticleService 的呼叫
    const { articleService } = await import('./src/services/index.js')
    console.log('ArticleService:', articleService)

    const articles = await articleService.getAll()
    console.log('ArticleService.getAll() 結果:', articles)
    console.log('結果類型:', typeof articles)
    console.log('是否為陣列:', Array.isArray(articles))

    return articles
  } catch (error) {
    console.error('ArticleService 測試錯誤:', error)
  }
}

// 執行測試
testApiCall()
  .then((data) => {
    console.log('直接 API 呼叫完成')
    return testArticleService()
  })
  .then((articles) => {
    console.log('ArticleService 測試完成')
  })
  .catch((error) => {
    console.error('測試過程發生錯誤:', error)
  })
