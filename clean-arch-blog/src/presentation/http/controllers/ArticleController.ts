import { BlogService } from "../../../usecases/BlogService";
import { validateCreateArticle } from "../dto/ArticleDTO";
import { Request, Response, NextFunction } from "express";

export class ArticleController {
    constructor(private blog: BlogService) { }

    create = (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = validateCreateArticle(req.body);
            this.blog.addArticle(dto);
            res.status(201).json({ message: "created" });
        } catch (err) {
            next(err);
        }
    };

    getByCategory = (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = String(req.params.category || "");
            const data = this.blog.getByCategory(category);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };
}
