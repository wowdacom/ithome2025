import { Router } from "express";
import { ArticleController } from "../controllers/ArticleController";
import { auth } from "../middlewares/auth";

export function buildArticleRoutes(controller: ArticleController): Router {
    const r = Router();

    // 文章 CRUD
    r.post("/articles", auth, controller.create);
    r.get("/articles", controller.getAll);
    r.get("/articles/search", controller.search);
    r.get("/articles/:id", controller.getById);
    r.put("/articles/:id", auth, controller.update);
    r.patch("/articles/:id", auth, controller.update);
    r.delete("/articles/:id", auth, controller.delete);

    // 依分類查詢（保持向後相容）
    r.get("/articles/category/:category", controller.getByCategory);

    return r;
}
