import { Request, Response, NextFunction } from "express";
import { AiAssistService } from "../../../usecases/AiAssistService.js";
import { aiAssistSchema } from "../dto/AiAssistDTO.js";

export class AiAssistController {
    constructor(private aiAssistService: AiAssistService) { }

    assist = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 驗證請求資料
            const validatedData = aiAssistSchema.parse(req.body);

            // 呼叫 AI 協助服務
            const result = await this.aiAssistService.assist({
                prompt: validatedData.prompt,
                articleContent: validatedData.articleContent,
                articleId: validatedData.articleId,
            });

            // 回傳結果
            res.json({
                success: true,
                data: {
                    improvedContent: result.improvedContent,
                    originalPrompt: result.originalPrompt,
                    logId: result.log.id,
                    timestamp: result.log.createdAt,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    // 取得協助歷史記錄
    getHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const articleId = req.params.articleId;
            // TODO: 實作取得歷史記錄的功能
            res.json({
                success: true,
                data: [],
                message: "歷史記錄功能待實作"
            });
        } catch (error) {
            next(error);
        }
    };
}