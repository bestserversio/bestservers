import { Server } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { FindServer } from "@utils/servers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    if (method !== "DELETE") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }

    // Retrieve our client's IP address.
    const host = req.socket.remoteAddress;

    // Check if we have API access.
    const check = await CheckApiAccess({
        authKey: req.headers.authorization,
        host: host,
        endpoint: "/api/servers/update",
        writeAccess: true
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve where.
    const { query } = req;

    const whereId = query.id?.toString() || undefined;
    const whereUrl = query.url?.toString() || undefined;

    const whereIp = query.ip?.toString() || undefined;
    const whereIp6 = query.ip6?.toString() || undefined;
    const wherePort = query.port?.toString() || undefined;

    // Make sure we have at least one where clause combination.
    if (!whereId && ((!whereIp && !whereIp6) || !wherePort)) {
        return res.status(404).json({
            message: "Both where ID and IP/port is not specified. Aborting..."
        });
    }

    try {
        const serverFind = await FindServer({
            id: whereId,
            url: whereUrl,
            ip: whereIp,
            ip6: whereIp6,
            port: wherePort
        });

        if (!serverFind?.id)  {
            return res.status(404).json({
                message: `Server not found. ID => ${whereId}. URL => ${whereUrl}. IP => ${whereIp}. IPv6 => ${whereIp6}. Port => ${wherePort}`
            });
        }

        let server: Server | null = null;

        try {
            server = await prisma.server.delete({
                where: {
                    id: serverFind.id
                }
            })
        } catch (err) {
            console.error(err);
    
            const [errMsg, errCode] = ProcessPrismaError(err);
    
            return res.status(400).json({
                message: `Error deleting server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`
            });
        }

        return res.status(200).json({
            server: server,
            message: `Successfully deleted server!`
        });
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Error finding server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`
        });
    }
}