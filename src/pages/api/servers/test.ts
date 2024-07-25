import { Prisma } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { GetServers, ServerSort } from "@utils/servers/content";
import { type NextApiRequest, type NextApiResponse } from "next";
import { ServerBrowser } from "~/types/Server";

export default async function Handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    let servers: ServerBrowser[] = [];
    let nextServer: number | undefined = undefined;

    for (let i = 0; i < 5; i++) {
        const [serverItems, nextServerItem] = await GetServers({
            prisma: prisma,
            cursor: nextServer,
            sort: ServerSort.NAME,
            sortDir: "DESC"
        });

        servers.push(...serverItems);

        if (!nextServer)
            break;

        nextServer = nextServerItem;
    }
    
    return res.status(200).json({
        servers: servers,
        count: servers.length
    });
}