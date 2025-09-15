import { InMemoryArticleRepository } from "../data/InMemoryArticleRepository";
import { BlogService } from "../usecases/BlogService";
import { ArticleController } from "../presentation/http/controllers/ArticleController";

const articleRepo = new InMemoryArticleRepository();
const blogService = new BlogService(articleRepo);
export const articleController = new ArticleController(blogService);
