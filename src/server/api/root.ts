import { createTRPCRouter } from "~/server/api/trpc";

import { serversRouter } from "./routers/servers";
import { platformsRouter } from "./routers/platforms";
import { categoriesRouter } from "./routers/categories";
import { apiRouter } from "./routers/api";
import { spyRouter } from "./routers/spy";

export const appRouter = createTRPCRouter({
    platforms: platformsRouter,
    categories: categoriesRouter,
    servers: serversRouter,
    api: apiRouter,
    spy: spyRouter
});

export type AppRouter = typeof appRouter;
