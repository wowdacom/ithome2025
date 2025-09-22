import { InMemoryArticleRepositoryAsync } from "../data/InMemoryArticleRepository";
import { SupabaseArticleRepository } from "../data/SupabaseArticleRepository";
import { envReadyForSupabase } from "./env";
import { BlogService } from "../usecases/BlogService";
import { ArticleController } from "../presentation/http/controllers/ArticleController";
import { AiAssistController } from "../presentation/http/controllers/AiAssistController.js";
import { InMemoryPromptLogRepository } from "../data/PromptLogRepository";
import { AiAssistService } from "../usecases/AiAssistService";
import { OpenAIService } from "../data/OpenAIService.js";
import { OpenAIAdapter } from "../usecases/OpenAIAdapter.js";

// Use Supabase repository when environment is ready, otherwise fall back to in-memory for local dev/tests
const articleRepo = envReadyForSupabase() ? new SupabaseArticleRepository() : new InMemoryArticleRepositoryAsync();
const blogService = new BlogService(articleRepo);
export const articleController = new ArticleController(blogService);

// AI Assist dependencies
const promptLogRepo = new InMemoryPromptLogRepository();
const openAIService = new OpenAIService();
const openAIAdapter = new OpenAIAdapter(openAIService);
export const aiAssistService = new AiAssistService(promptLogRepo, openAIAdapter);
export const aiAssistController = new AiAssistController(aiAssistService);
