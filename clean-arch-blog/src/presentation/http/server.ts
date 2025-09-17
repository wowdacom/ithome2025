import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { articleController } from "../../config/container";
import { buildArticleRoutes } from "./routes/articleRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { ENV } from "../../config/env";

export function createApp() {
    const app = express();

    // 中介軟體
    app.use(express.json());

    // 靜態檔案（前端後台）
    app.use(express.static(path.join(process.cwd(), 'public')));

    // API 路由
    app.use("/api", buildArticleRoutes(articleController));

    // 根路徑重導向到後台
    app.get('/', (req, res) => {
        res.redirect('/admin.html');
    });

    // 管理介面別名路由
    app.get('/admin', (req, res) => {
        res.redirect('/admin.html');
    });

    // 錯誤處理
    app.use(notFound);
    app.use(errorHandler);

    return app;
}

// 直接啟動伺服器（開發模式）
// 檢查是否為主模組（ES 模組版本）
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
    const app = createApp();
    app.listen(ENV.PORT, () => {
        console.log(`Server listening on port ${ENV.PORT}`);
        console.log(`Admin panel: http://localhost:${ENV.PORT}/admin.html`);
    });
}
