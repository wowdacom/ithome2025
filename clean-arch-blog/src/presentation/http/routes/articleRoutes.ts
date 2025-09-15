import { Router } from "express";
import { ArticleController } from "../controllers/ArticleController";

export function buildArticleRoutes(controller: ArticleController): Router {
    const r = Router();
    r.post("/articles", controller.create);
    r.get("/articles/category/:category", controller.getByCategory);
    return r;
}
