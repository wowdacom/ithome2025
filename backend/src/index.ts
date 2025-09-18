import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { articleRoutes } from './routes/articleRoutes'
import { InMemoryArticleRepository } from './repositories/InMemoryArticleRepository'

const PORT = parseInt(process.env.PORT || '3001')
const HOST = process.env.HOST || 'localhost'

// 建立 Fastify 實例
const app = Fastify({
    logger: {
        level: process.env.LOG_LEVEL || 'info'
    }
})

// 註冊 CORS 插件
app.register(cors, {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // 前端開發伺服器
    credentials: true
})

// 註冊 Swagger 文件
app.register(swagger, {
    openapi: {
        info: {
            title: 'Blog API',
            description: 'RESTful API for blog management',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://${HOST}:${PORT}`,
                description: 'Development server'
            }
        ]
    }
})

app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    }
})

// 建立全域的 repository 實例
const articleRepository = new InMemoryArticleRepository()

// 註冊路由
app.register(articleRoutes, { repository: articleRepository })

// 健康檢查端點
app.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() }
})

// 根路徑
app.get('/', async (request, reply) => {
    return {
        message: 'Blog API Server',
        version: '1.0.0',
        docs: '/docs'
    }
})

// 錯誤處理
app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500

    app.log.error(error)

    reply.status(statusCode).send({
        error: error.name || 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
        statusCode
    })
})

// 404 處理
app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
        error: 'Not Found',
        message: `Route ${request.method} ${request.url} not found`,
        statusCode: 404
    })
})

// 啟動伺服器
const start = async () => {
    try {
        await app.listen({ port: PORT, host: HOST })
        app.log.info(`🚀 Server running on http://${HOST}:${PORT}`)
        app.log.info(`📚 API documentation: http://${HOST}:${PORT}/docs`)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

// 優雅關閉
const gracefulShutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down gracefully...`)
    try {
        await app.close()
        process.exit(0)
    } catch (error) {
        app.log.error(`Error during shutdown: ${error instanceof Error ? error.message : 'Unknown error'}`)
        process.exit(1)
    }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

if (require.main === module) {
    start()
}

export { app }