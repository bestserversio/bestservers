import { Prisma } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function Handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }

    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "/api/servers/removeinactive",
        writeAccess: true
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve query parameters.
    const { query } = req;

    const timeStr = query?.time?.toString() ?? "2592000"

    const time = new Date(new Date(Date.now() - (Number(timeStr) * 1000)))

    let servers: Prisma.BatchPayload;

    try {
        servers = await prisma.server.deleteMany({
            where: {
                lastOnline: {
                    lte: time
                }
            }
        })
    } catch (err: unknown) {
        return res.status(400).json({
            error: err,
            message: `Failed to remove inactive servers :: ${err}`
        })
    }
    
    return res.status(200).json({
        count: servers.count,
        message: `Successfully removed ${servers.count.toString()} inactive servers!`
    });
}