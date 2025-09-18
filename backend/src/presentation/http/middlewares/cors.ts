import { Request, Response, NextFunction } from "express";

export function cors(req: Request, res: Response, next: NextFunction) {
    // 允許的來源
    const allowedOrigins = [
        'http://localhost:5173',  // 前端開發伺服器 (Vite)
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3002',
        'http://127.0.0.1:3002'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin as string)) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        // 開發模式允許所有來源
        res.header('Access-Control-Allow-Origin', '*');
    }

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // 處理 OPTIONS 預檢請求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
}