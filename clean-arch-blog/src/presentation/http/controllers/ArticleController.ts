import { BlogService } from "../../../usecases/BlogService";
import { validateCreateArticle } from "../dto/ArticleDTO";
import { Request, Response, NextFunction } from "express";

export class ArticleController {
    constructor(private blog: BlogService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = validateCreateArticle(req.body);
            await this.blog.addArticle(dto);
            res.status(201).json({ message: "created" });
        } catch (err) {
            next(err);
        }
    };

    getByCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = String(req.params.category || "");
            const data = await this.blog.getByCategory(category);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };
}
