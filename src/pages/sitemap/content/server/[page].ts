import { type GetServerSideProps } from "next";
import { sitemapReturnSecs, sitemapStale } from "@pages/sitemap/index";

import { prisma } from "@server/db";
import { type ISitemapField, getServerSideSitemapLegacy } from "next-sitemap";

export const getServerSideProps: GetServerSideProps = async ctx => {
    const siteUrl = process.env.SITEMAP_URL ?? "";

    // Set cache headers.
    ctx.res.setHeader(
        'Cache-Control',
        `public, s-maxage=${sitemapStale}, stale-while-revalidate=${sitemapReturnSecs}`
    );

    const items: ISitemapField[] = [];

    const page = Number(ctx.params?.page ?? 0);
    const items_per_page = Number(process.env.SITEMAP_MAX_ITEMS ?? 5000);

    // If page number is invalid, they probably requested an invalid sitemap.
    if (isNaN(page)) {
        return {
            notFound: true
        }
    } 

    const servers = await prisma.server.findMany({
        include: {
            platform: true
        },
        where: {
            visible: true
        },
        orderBy: {
            lastOnline: "desc"
        },
        skip: (page - 1) * items_per_page,
        take: items_per_page
    });

    // Check servers length. If below 1, return not found.
    if (servers.length < 1) {
        return {
            notFound: true
        }
    }

    servers.map((srv) => {

        items.push({
            loc: `${siteUrl}/servers/view/ip/${srv.ip}:${srv.port?.toString()}`,
            lastmod: srv?.lastOnline?.toISOString() ?? new Date().toISOString(),
            priority: 0.7,
            changefreq: "daily"
        });
    })

    return getServerSideSitemapLegacy(ctx, items);
}

export default getServerSideProps;