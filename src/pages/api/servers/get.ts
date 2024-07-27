import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { GetRegionFromString } from "@utils/region";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type ServerWithRelations } from "~/types/Server";
import { UserPublicSelect } from "~/types/User";

export default async function Handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }

    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "/api/servers/get",
        writeAccess: false
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve query parameters.
    const { query } = req;

    const countOnly = query?.countOnly?.toString();

    // Limit and sorting.
    const visibleOnly = query?.visibleOnly?.toString();

    const limit = query.limit?.toString() ?? "10";
    const sort = query.sort?.toString() ?? "lastQueried";
    const sortDir = query.sort?.toString() ?? "asc";

    // Filtering
    const platformId = query.platformId?.toString();
    const categoryId = query.categoryId?.toString();
    const regionStr = query.region?.toString();

    const ip = query.ip?.toString();
    const ip6 = query.ip6?.toString();
    const port = query.port?.toString();
    const hostName = query.hostName?.toString();

    // Retrieve region.
    const region = GetRegionFromString(regionStr);

    if (countOnly) {
        try {
            const count = await prisma.server.count({
                where: {
                    ...(platformId && {
                        platformId: Number(platformId)
                    }),
                    ...(categoryId && {
                        categoryId: Number(categoryId)
                    }),
                    region: region,
                    ip: ip,
                    ip6: ip6,
                    ...(port && {
                        port: Number(port)
                    }),
                    ...(visibleOnly && {
                        visible: true
                    }),
                    hostName: hostName
                }
            })

            return res.status(200).json({
                count: count
            })
        } catch (err: unknown) {
            console.error(err);

            const [errMsg, errCode] = ProcessPrismaError(err);

            return res.status(400).json({
                message: `Error retrieving server count.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`
            })
        }
    } else {
        // Retrieve servers.
        let servers: ServerWithRelations[] | null = null;

        try {
            servers = await prisma.server.findMany({
                take: Number(limit),
                orderBy: {
                    [sort]: sortDir
                },
                include: {
                    user: {
                        select: UserPublicSelect
                    },
                    platform: true,
                    category: {
                        include: {
                            parent: true
                        }
                    }
                },
                where: {
                    ...(platformId && {
                        platformId: Number(platformId)
                    }),
                    ...(categoryId && {
                        categoryId: Number(categoryId)
                    }),
                    region: region,
                    ip: ip,
                    ip6: ip6,
                    ...(port && {
                        port: Number(port)
                    }),
                    ...(visibleOnly && {
                        visible: true
                    }),
                    hostName: hostName
                }
            })
        } catch (err) {
            console.error(err);

            const [errMsg, errCode] = ProcessPrismaError(err);

            return res.status(400).json({
                message: `Error retrieving servers.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`
            });
        }

        return res.status(200).json({
            count: servers?.length ?? 0,
            servers: servers,
            message: `Retrieved ${servers?.length?.toString() ?? "0"} servers!`
        });
    }
}