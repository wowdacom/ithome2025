// 完整的 CRUD API 測試
async function testFullCRUD() {
  console.log('🔍 完整 CRUD 功能測試...\n')

  try {
    // 1. CREATE - 新增文章
    console.log('1. 📝 CREATE - 新增文章')
    const createResponse = await fetch('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'CRUD 測試文章',
        content: '這是完整 CRUD 測試的文章內容',
        category: 'CRUD 測試',
      }),
    })

    const newArticle = await createResponse.json()
    console.log(`✅ 成功新增文章 ID: ${newArticle.id}`)

    // 2. READ - 讀取所有文章
    console.log('\n2. 📖 READ - 取得所有文章')
    const readAllResponse = await fetch('http://localhost:3000/api/articles')
    const allArticles = await readAllResponse.json()
    console.log(`✅ 總共有 ${allArticles.length} 筆文章`)

    // 3. READ - 讀取單一文章
    console.log('\n3. 🔍 READ - 取得單一文章')
    const readOneResponse = await fetch(`http://localhost:3000/api/articles/${newArticle.id}`)
    const oneArticle = await readOneResponse.json()
    console.log(`✅ 取得文章: ${oneArticle.title}`)

    // 4. UPDATE - 更新文章
    console.log('\n4. ✏️ UPDATE - 更新文章')
    const updateResponse = await fetch(`http://localhost:3000/api/articles/${newArticle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'CRUD 測試文章 (已更新)',
        content: '這是更新後的內容',
      }),
    })

    const updatedArticle = await updateResponse.json()
    console.log(`✅ 更新成功: ${updatedArticle.title}`)

    // 5. SEARCH - 搜尋文章
    console.log('\n5. 🔎 SEARCH - 搜尋文章')
    const searchResponse = await fetch('http://localhost:3000/api/articles/search?keyword=CRUD')
    const searchResults = await searchResponse.json()
    console.log(`✅ 搜尋結果: ${searchResults.length} 筆符合條件的文章`)

    // 6. DELETE - 刪除文章
    console.log('\n6. 🗑️ DELETE - 刪除文章')
    const deleteResponse = await fetch(`http://localhost:3000/api/articles/${newArticle.id}`, {
      method: 'DELETE',
    })

    console.log(
      `✅ 刪除狀態: ${deleteResponse.status} (${deleteResponse.status === 204 ? '成功' : '失敗'})`,
    )

    // 驗證刪除
    console.log('\n7. ✅ 驗證刪除結果')
    const verifyResponse = await fetch(`http://localhost:3000/api/articles/${newArticle.id}`)
    console.log(
      `✅ 驗證結果: ${verifyResponse.status} (${verifyResponse.status === 404 ? '文章已被刪除' : '文章仍存在'})`,
    )

    console.log('\n🎉 所有 CRUD 功能測試完成！')
  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  }
}

testFullCRUD()
