import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
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
        endpoint: "/api/servers/removedups",
        writeAccess: true
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve query parameters.
    const { query } = req;

    const limit = query?.limit?.toString() ?? "100";
    const maxServers = query?.limit?.toString() ?? "100";

    let filtered = 0;
    
    try {
        const servers = await prisma.server.findMany({
            select: {
                ip: true
            },
            take: Number(limit)
        })

        const promises = servers.map(async (srv) => {
            const cnt = await prisma.server.count({
                where: {
                    ip: srv.ip
                }
            })

            if (cnt > Number(maxServers)) {
                const updated = await prisma.server.updateMany({
                    where: {
                        ip: srv.ip
                    },
                    data: {
                        visible: false
                    }
                }) 

                filtered += updated.count;
            }
        })

        await Promise.all(promises);
    } catch (err) {
        console.error(err);

        const [errMsg] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Failed to scan for duplicate servers due to exception :: ${errMsg ?? "N/A"}`
        })
    }

    return res.status(200).json({
        filtered: filtered,
        message: `Filtered ${filtered.toString()} servers!`
    })
}