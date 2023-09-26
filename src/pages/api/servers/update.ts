import { Server } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { GetRegionFromString } from "@utils/region";
import { FindServer, ServerBodyT } from "@utils/servers/api";
import { NextApiRequest, NextApiResponse } from "next";

interface ExtendedRequest extends NextApiRequest {
    body: ServerBodyT
}

export default async function Handler (
    req: ExtendedRequest,
    res: NextApiResponse
) {
    const method = req.method;

    if (!method || (method !== "PUT" && method !== "PATCH")) {
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

    try {
        const serverFind = await FindServer({
            id: whereId,
            url: whereUrl,
            ip: whereIp,
            ip6: whereIp6,
            port: wherePort
        });

        if (!serverFind?.id) {
            return res.status(404).json({
                message: `Server not found. ID => ${whereId}. URL => ${whereUrl}. IP => ${whereIp}. IPv6 => ${whereIp6}. Port => ${wherePort}`
            });
        }

        // Retrieve region and last queried since we parse these differently.
        const { region, lastQueried } = req.body;

        let server: Server | null = null;

        try {
            server = await prisma.server.update({
                data: {
                    ...req.body,
                    region: GetRegionFromString(region),
                    lastQueried: lastQueried ? new Date(lastQueried) : undefined
                },
                where: {
                    id: serverFind.id
                }
            })
        } catch (err) {
            console.error(err);
    
            const [errMsg, errCode] = ProcessPrismaError(err);
    
            return res.status(400).json({
                message: `Error updating server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`
            });
        }

        return res.status(200).json({
            server: server,
            message: `Successfully added server!`
        });
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Error finding server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`
        });
    }
    

}