import { ValidationError } from "../../../domain/Errors";
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, code: err.code });
    }
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
}
