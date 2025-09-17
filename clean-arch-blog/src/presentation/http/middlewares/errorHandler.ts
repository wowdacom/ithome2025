import { ValidationError } from "../../../domain/Errors";
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ValidationError) {
        // 特殊處理：ARTICLE_NOT_FOUND 對應 404
        if (err.code === 'ARTICLE_NOT_FOUND') {
            return res.status(404).json({ message: err.message });
        }
        return res.status(400).json({ error: err.message, code: err.code });
    }
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
}
