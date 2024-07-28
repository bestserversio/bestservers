import { getServerSideSitemapIndexLegacy } from "next-sitemap"
import { type GetServerSideProps } from "next"

import { prisma } from "@server/db";

export const sitemapStale =  60;
export const sitemapReturnSecs =  15 * 60;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const siteUrl = process.env.SITEMAP_URL ?? "";

    const sitemaps: string[] = [];

    // Set cache headers.
    ctx.res.setHeader(
        'Cache-Control',
        `public, s-maxage=${sitemapStale}, stale-while-revalidate=${sitemapReturnSecs}`
    );

    // We need to determine how many pages of servers we have.
    const items_per_page = Number(process.env.SITEMAP_MAX_ITEMS ?? 5000);

    const servers = await prisma.server.count({
        where: {
            visible: true
        }
    });

    const server_pages = Math.ceil(servers / items_per_page);

    let i;

    // We need to create a for loop and add each page.
    for (i = 1; i <= server_pages; i++) {
        sitemaps.push(`${siteUrl}/sitemap-content/server/${i.toString()}.xml`);
    }

    sitemaps.push(`${siteUrl}/sitemap-static.xml`);

    return getServerSideSitemapIndexLegacy(ctx, sitemaps);
}

export default getServerSideProps;