import { Router } from "express";
import { ArticleController } from "../controllers/ArticleController";
import { auth } from "../middlewares/auth";

export function buildArticleRoutes(controller: ArticleController): Router {
    const r = Router();
        r.post("/articles", auth, controller.create);
    r.get("/articles/category/:category", controller.getByCategory);
    return r;
}
