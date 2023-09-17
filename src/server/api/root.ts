import { createTRPCRouter } from "~/server/api/trpc";

import { serversRouter } from "./routers/servers";
import { platformsRouter } from "./routers/platforms";
import { categoriesRouter } from "./routers/categories";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    platforms: platformsRouter,
    categories: categoriesRouter,
    servers: serversRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
