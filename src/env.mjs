import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),

    UPLOADS_DIR: z.string().optional(),
    ROOT_API: z.string().optional(),
    SITEMAP_MAX_ITEMS: z.number().optional(),
    SITEMAP_URL: z.string().optional()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().optional(),
    NEXT_PUBLIC_UPLOADS_URL: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
    NEXT_PUBLIC_BACKGROUND_SPEED: z.string().optional(),
    NEXT_PUBLIC_DEFAULT_PLATFORM_GAME_BANNER: z.string().optional(),
    NEXT_PUBLIC_DEFAULT_PLATFORM_COM_BANNER: z.string().optional(),
    NEXT_PUBLIC_DEFAULT_PLATFORM_ICON: z.string().optional()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,

    UPLOADS_DIR: process.env.UPLOADS_DIR,
    ROOT_API: process.env.ROOT_API,

    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_UPLOADS_URL: process.env.NEXT_PUBLIC_UPLOADS_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_BACKGROUND_SPEED: process.env.NEXT_PUBLIC_BACKGROUND_SPEED,
    NEXT_PUBLIC_DEFAULT_PLATFORM_GAME_BANNER: process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_GAME_BANNER,
    NEXT_PUBLIC_DEFAULT_PLATFORM_COM_BANNER: process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_COM_BANNER,
    NEXT_PUBLIC_DEFAULT_PLATFORM_ICON: process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_ICON,
    SITEMAP_MAX_ITEMS: process.env.SITEMAP_MAX_ITEMS,
    SITEMAP_URL: process.env.SITEMAP_URL
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
