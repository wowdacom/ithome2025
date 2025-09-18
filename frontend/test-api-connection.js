// 簡單的 API 連接測試
async function testBackendConnection() {
  console.log('🔍 測試 backend API 連接...\n')

  try {
    console.log('1. 測試 GET /api/articles')
    const getResponse = await fetch('http://localhost:3000/api/articles')

    if (!getResponse) {
      console.log('❌ 無法連接到 backend 服務器')
      return
    }

    console.log('✅ 連接成功! 狀態:', getResponse.status)

    const getData = await getResponse.json()
    console.log(
      '✅ 成功取得資料:',
      Array.isArray(getData) ? `${getData.length} 筆文章` : typeof getData,
    )

    console.log('\n2. 測試 POST /api/articles')
    const postResponse = await fetch('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '前端測試文章',
        content: '這是一篇由前端發送的測試文章',
        category: '測試',
      }),
    })

    console.log('✅ POST 狀態:', postResponse.status)

    if (postResponse.ok) {
      const postData = await postResponse.json()
      console.log('✅ 成功新增文章:', postData.title)
    }
  } catch (error) {
    console.error('❌ 連接失敗:', error.message)
  }
}

testBackendConnection()
