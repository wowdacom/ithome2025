import { ref } from 'vue'
import { defineStore } from 'pinia'
import { articleService } from '@/services'
import type { Article, CreateArticleRequest, SearchFilters, MessageState } from '@/types/article'

export const useArticleStore = defineStore('article', () => {
    // State
    const articles = ref<Article[]>([])
    const loading = ref(false)
    const message = ref<MessageState>({
        text: '',
        type: 'info'
    })

    // Actions
    async function loadArticles() {
        try {
            loading.value = true
            const result = await articleService.getAll()
            articles.value = result
        } catch (error) {
            showMessage('載入失敗: ' + (error as Error).message, 'error')
            console.error('載入文章錯誤:', error)
        } finally {
            loading.value = false
        }
    }

    async function createArticle(articleData: CreateArticleRequest) {
        try {
            loading.value = true
            await articleService.create(articleData)
            showMessage('文章新增成功', 'success')
            // 重新載入文章列表
            await loadArticles()
        } catch (error) {
            showMessage('新增失敗: ' + (error as Error).message, 'error')
            console.error('新增文章錯誤:', error)
        } finally {
            loading.value = false
        }
    }

    async function searchArticles(filters: SearchFilters) {
        try {
            loading.value = true
            const result = await articleService.search(filters)
            articles.value = result
        } catch (error) {
            showMessage('搜尋失敗: ' + (error as Error).message, 'error')
            console.error('搜尋錯誤:', error)
        } finally {
            loading.value = false
        }
    }

    async function deleteArticle(id: string) {
        try {
            loading.value = true
            await articleService.delete(id)
            showMessage('文章刪除成功', 'success')
            // 重新載入文章列表
            await loadArticles()
        } catch (error) {
            showMessage('刪除失敗: ' + (error as Error).message, 'error')
            console.error('刪除文章錯誤:', error)
        } finally {
            loading.value = false
        }
    }

    function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
        message.value.text = text
        message.value.type = type
    }

    function clearMessage() {
        message.value.text = ''
        message.value.type = 'info'
    }

    return {
        // State
        articles,
        loading,
        message,
        // Actions
        loadArticles,
        createArticle,
        searchArticles,
        deleteArticle,
        showMessage,
        clearMessage
    }
})
