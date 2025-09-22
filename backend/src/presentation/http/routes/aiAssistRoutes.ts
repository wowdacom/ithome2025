import { Router } from "express";
import { AiAssistController } from "../controllers/AiAssistController.js";
import { auth } from "../middlewares/auth.js";

export function buildAiAssistRoutes(controller: AiAssistController): Router {
    const r = Router();

    // AI 協助路由
    r.post("/ai-assist", auth, controller.assist);
    r.get("/ai-assist/history/:articleId", auth, controller.getHistory);

    return r;
}