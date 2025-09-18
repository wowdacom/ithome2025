import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { CreateArticleSchema, UpdateArticleSchema, SearchFiltersSchema } from '@/types/article'
import type { InMemoryArticleRepository } from '@/repositories/InMemoryArticleRepository'
import type { CreateArticleRequest, UpdateArticleRequest, SearchFilters } from '@/types/article'

interface ArticleRoutesOptions {
    repository: InMemoryArticleRepository
}

interface ArticleParams {
    id: string
}

export async function articleRoutes(
    fastify: FastifyInstance,
    opts: ArticleRoutesOptions
) {
    const { repository } = opts

    // GET /api/articles - 獲取所有文章
    fastify.get('/api/articles', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const articles = await repository.findAll()
            return reply.code(200).send({ data: articles })
        } catch (error) {
            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    })

    // GET /api/articles/:id - 根據 ID 獲取文章
    fastify.get<{ Params: ArticleParams }>(
        '/api/articles/:id',
        async (request: FastifyRequest<{ Params: ArticleParams }>, reply: FastifyReply) => {
            try {
                const { id } = request.params
                const article = await repository.findById(id)

                if (!article) {
                    return reply.code(404).send({
                        error: 'Article not found',
                        message: `Article with id ${id} not found`
                    })
                }

                return reply.code(200).send({ data: article })
            } catch (error) {
                return reply.code(500).send({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }
    )

    // POST /api/articles - 新增文章
    fastify.post<{ Body: CreateArticleRequest }>(
        '/api/articles',
        async (request: FastifyRequest<{ Body: CreateArticleRequest }>, reply: FastifyReply) => {
            try {
                // 驗證請求資料
                const validatedData = CreateArticleSchema.parse(request.body)

                const article = await repository.create(validatedData)
                return reply.code(201).send({ data: article })
            } catch (error) {
                if (error instanceof ZodError) {
                    return reply.code(400).send({
                        error: error.errors.map(err => err.message).join(', '),
                        message: 'Validation failed'
                    })
                }

                return reply.code(500).send({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }
    )

    // PUT /api/articles/:id - 更新文章
    fastify.put<{ Params: ArticleParams; Body: UpdateArticleRequest }>(
        '/api/articles/:id',
        async (request: FastifyRequest<{ Params: ArticleParams; Body: UpdateArticleRequest }>, reply: FastifyReply) => {
            try {
                const { id } = request.params

                // 驗證更新資料
                const validatedData = UpdateArticleSchema.parse(request.body)

                const article = await repository.update(id, validatedData)

                if (!article) {
                    return reply.code(404).send({
                        error: 'Article not found',
                        message: `Article with id ${id} not found`
                    })
                }

                return reply.code(200).send({ data: article })
            } catch (error) {
                if (error instanceof ZodError) {
                    return reply.code(400).send({
                        error: error.errors.map(err => err.message).join(', '),
                        message: 'Validation failed'
                    })
                }

                return reply.code(500).send({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }
    )

    // DELETE /api/articles/:id - 刪除文章
    fastify.delete<{ Params: ArticleParams }>(
        '/api/articles/:id',
        async (request: FastifyRequest<{ Params: ArticleParams }>, reply: FastifyReply) => {
            try {
                const { id } = request.params
                const deleted = await repository.delete(id)

                if (!deleted) {
                    return reply.code(404).send({
                        error: 'Article not found',
                        message: `Article with id ${id} not found`
                    })
                }

                return reply.code(204).send()
            } catch (error) {
                return reply.code(500).send({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }
    )

    // GET /api/articles/search - 搜尋文章
    fastify.get<{ Querystring: SearchFilters }>(
        '/api/articles/search',
        async (request: FastifyRequest<{ Querystring: SearchFilters }>, reply: FastifyReply) => {
            try {
                // 驗證查詢參數
                const validatedFilters = SearchFiltersSchema.parse(request.query)

                const articles = await repository.search(validatedFilters)
                return reply.code(200).send({ data: articles })
            } catch (error) {
                if (error instanceof ZodError) {
                    return reply.code(400).send({
                        error: error.errors.map(err => err.message).join(', '),
                        message: 'Invalid search parameters'
                    })
                }

                return reply.code(500).send({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }
    )
}