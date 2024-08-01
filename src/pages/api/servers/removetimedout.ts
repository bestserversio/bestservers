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
        endpoint: "/api/servers/removetimedout",
        writeAccess: true
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve query parameters.
    const { query } = req;

    let timedOut = 0;

    const platformIdsStr = query?.platformIds?.toString();
    const timeoutStr = query?.timeout?.toString() ?? "3600";

    // Get platform IDs if any.
    let platformIds: number[] | undefined = undefined;

    if (platformIdsStr) {
        platformIds = [];

        const data = platformIdsStr.split(",");
        data.forEach((val) => platformIds?.push(Number(val)))
    }

    // Calculate timeout date.
    const timeout = new Date(Date.now() - (Number(timeoutStr) * 1000));

    const platforms = await prisma.platform.findMany({
        where: {
            ...(platformIds && {
                id: {
                    in: platformIds
                }
            }),
            serverTimeout: {
                gte: 0
            }
        }
    })

    const promises = platforms.map(async (platform) => {
        const servers = await prisma.server.findMany({
            select: {
                id: true
            },
            where: {
                online: true,
                lastOnline: {
                    lte: timeout
                },
                platformId: platform.id
            }
        })

        const ids: number[] = [];

        servers.map((srv) => ids.push(srv.id));

        const cnt = await prisma.server.updateMany({
            data: {
                online: false
            },
            where: {
                id: {
                    in: ids
                }
            }
        })

        timedOut += cnt.count;
    })

    await Promise.all(promises);

    return res.status(200).json({
        timedOut: timedOut,
        message: `Removed ${timedOut.toString()} timed out servers!`
    })
}