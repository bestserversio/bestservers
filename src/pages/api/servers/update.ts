import { Server } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { GetRegionFromString } from "@utils/region";
import { FindServer, ServerBodyT, ServerWhereT } from "@utils/servers/api";
import { NextApiRequest, NextApiResponse } from "next";

type ServerBodyWithWhereT = ServerBodyT & {
    where: ServerWhereT
}

interface ExtendedRequest extends NextApiRequest {
    body: {
        servers: ServerBodyWithWhereT[]
    }
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

    // See if we should abort on error.
    const errors: string[] = [];

    let abortOnError = false;

    const { query } = req;

    const abortOnErrorStr = query.abortOnError?.toString();

    if (abortOnErrorStr && Boolean(abortOnErrorStr))
        abortOnError = true;

    const servers: Server[] = [];

    const promises = req.body.servers.map(async (serverBody) => {
        const { where: whereParams } = serverBody;

        try {
            const serverFind = await FindServer({
                id: whereParams.id,
                url: whereParams.url,
                ip: whereParams.ip,
                ip6: whereParams.ip6,
                port: whereParams.port
            });
    
            if (!serverFind?.id) {
                const fullErrMsg = `Server not found. ID => ${whereParams.id}. URL => ${whereParams.url}. IP => ${whereParams.ip}. IPv6 => ${whereParams.ip6}. Port => ${whereParams.port?.toString()}`;

                if (abortOnError) {
                    return res.status(404).json({
                        message: fullErrMsg
                    });
                } else {
                    errors.push(fullErrMsg);

                    return;
                }
            }
    
            // Retrieve region and last queried since we parse these differently.
            const { region, lastQueried } = serverBody;
    
            let server: Server | null = null;
    
            try {
                server = await prisma.server.update({
                    data: {
                        ...serverBody,
                        region: GetRegionFromString(region),
                        lastQueried: lastQueried ? new Date(lastQueried) : undefined
                    },
                    where: {
                        id: serverFind.id
                    }
                })

                if (server)
                    servers.push(server);
            } catch (err) {
                console.error(err);
        
                const [errMsg, errCode] = ProcessPrismaError(err);

                const fullErrMsg = `Error updating server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`;

                if (abortOnError) {
                    return res.status(400).json({
                        message: fullErrMsg
                    });
                } else {
                    errors.push(fullErrMsg);

                    return;
                }
            }
        } catch (err) {
            console.error(err);
    
            const [errMsg, errCode] = ProcessPrismaError(err);

            const fullErrMsg = `Error finding server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`;

            if (abortOnError) {
                return res.status(400).json({
                    message: fullErrMsg
                });
            } else {
                errors.push(fullErrMsg);

                return;
            }
        }
    })

    await Promise.all(promises);

    return res.status(200).json({
        serverCount: servers.length,
        servers: servers,
        errorCount: errors.length,
        errors: errors,
        message: `Updated ${servers.length.toString()} servers!`
    });
}