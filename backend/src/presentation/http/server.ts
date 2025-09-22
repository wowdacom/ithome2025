import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { articleController, aiAssistService } from "../../config/container.js";
import { buildArticleRoutes } from "./routes/articleRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { cors } from "./middlewares/cors.js";
import { ENV } from "../../config/env.js";
import { aiAssistSchema } from "./dto/AiAssistDTO.js";

export function createApp() {
    const app = express();
    app.use(cors);
    app.use(express.json());
    app.use(express.static(path.join(process.cwd(), 'public')));

    app.use("/api", buildArticleRoutes(articleController));

    app.post('/api/ai/assist', async (req, res, next) => {
        try {
            const dto = aiAssistSchema.parse(req.body);
            const result = await aiAssistService.assist(dto);
            res.json({
                improvedContent: result.improvedContent,
                promptLog: result.log,
            });
        } catch (err) {
            next(err);
        }
    });

    app.get('/', (req, res) => { res.redirect('/admin.html'); });
    app.get('/admin', (req, res) => { res.redirect('/admin.html'); });

    app.use(notFound);
    app.use(errorHandler);
    return app;
}

const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;
if (isMainModule) {
    const app = createApp();
    app.listen(ENV.PORT, '0.0.0.0', () => {
        console.log(`Server listening on port ${ENV.PORT} (all interfaces)`);
        console.log(`Admin panel: http://localhost:${ENV.PORT}/admin.html`);
    });
}
