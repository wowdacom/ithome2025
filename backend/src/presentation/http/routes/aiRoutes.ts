import { Router } from 'express'
import { AIController } from '../controllers/AIController'

const router = Router()
const aiController = new AIController()

// AI 內容生成
router.post('/generate', (req, res) => aiController.generateContent(req, res))

// AI 連接測試
router.post('/test', (req, res) => aiController.testConnection(req, res))

export default router