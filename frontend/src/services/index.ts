import { ArticleService } from './articleService'
import { apiClient } from '@/utils/apiClient'

// 建立預設的 ArticleService 實例
export const articleService = new ArticleService(apiClient)

// 匯出類別供測試使用
export { ArticleService }
