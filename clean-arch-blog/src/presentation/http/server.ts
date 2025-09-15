import express from "express";
import { articleController } from "../../config/container";
import { buildArticleRoutes } from "./routes/articleRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { ENV } from "../../config/env";

export function createServer() {
    const app = express();
    app.use(express.json());
    app.use("/api", buildArticleRoutes(articleController));
    app.use(notFound);
    app.use(errorHandler);
    return app;
}

// 直接啟動伺服器（開發模式）
const app = createServer();
app.listen(ENV.PORT, () => {
    console.log(`Server listening on port ${ENV.PORT}`);
});
