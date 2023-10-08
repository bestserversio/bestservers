import { createTRPCRouter } from "~/server/api/trpc";

import { serversRouter } from "./routers/servers";
import { platformsRouter } from "./routers/platforms";
import { categoriesRouter } from "./routers/categories";
import { apiRouter } from "./routers/api";

export const appRouter = createTRPCRouter({
    platforms: platformsRouter,
    categories: categoriesRouter,
    servers: serversRouter,
    api: apiRouter
});

export type AppRouter = typeof appRouter;
