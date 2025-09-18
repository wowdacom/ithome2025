import { BlogService } from "../../../usecases/BlogService";
import { validateCreateArticle, validateUpdateArticle, validateSearchFilters } from "../dto/ArticleDTO";
import { Request, Response, NextFunction } from "express";

export class ArticleController {
    constructor(private blog: BlogService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = validateCreateArticle(req.body);
            const article = await this.blog.addArticle(dto);
            res.status(201).json(article);
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

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = String(req.params.id || "");
            const article = await this.blog.getById(id);
            if (!article) {
                return res.status(404).json({ message: "找不到指定的文章" });
            }
            res.json(article);
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = String(req.params.id || "");
            const updates = validateUpdateArticle(req.body);
            const updatedArticle = await this.blog.updateArticle(id, updates);
            res.json(updatedArticle);
        } catch (err) {
            next(err);
        }
    };

    search = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = validateSearchFilters(req.query);
            const articles = await this.blog.searchArticles(filters);
            res.json(articles);
        } catch (err) {
            next(err);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const articles = await this.blog.getAllArticles();
            res.json(articles);
        } catch (err) {
            next(err);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = String(req.params.id || "");
            await this.blog.deleteArticle(id);
            res.status(204).send(); // No Content
        } catch (err) {
            next(err);
        }
    };
}
