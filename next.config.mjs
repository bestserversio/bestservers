/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: '**',
            port: '',
            pathname: '**',
        }
    ]
  },
  rewrites: async() => [
    {
      source: "/sitemap.xml",
      destination: "/sitemap/"
    },
    {
      source: "/sitemap-static.xml",
      destination: "/sitemap/static"
    },
    {
      source: "/sitemap-content/server/:page.xml",
      destination: "/sitemap/content/server/:page"
    }
  ]
};

export default config;
