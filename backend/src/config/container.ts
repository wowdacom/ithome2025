import { InMemoryArticleRepositoryAsync } from "../data/InMemoryArticleRepository";
import { SupabaseArticleRepository } from "../data/SupabaseArticleRepository";
import { envReadyForSupabase } from "./env";
import { BlogService } from "../usecases/BlogService";
import { ArticleController } from "../presentation/http/controllers/ArticleController";

// Use Supabase repository when environment is ready, otherwise fall back to in-memory for local dev/tests
const articleRepo = envReadyForSupabase() ? new SupabaseArticleRepository() : new InMemoryArticleRepositoryAsync();
const blogService = new BlogService(articleRepo);
export const articleController = new ArticleController(blogService);
