import { Server } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
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
    const { method } = req;

    if (method !== "DELETE") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }

    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
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

        // Make sure we have at least one where clause combination.
        if (!whereParams.id && ((!whereParams.ip && !whereParams.ip6) || !whereParams.port)) {
            if (abortOnError) {
                return res.status(404).json({
                    message: "Both where ID and IP/port is not specified. Aborting..."
                });
            } else {
                errors.push(`Server missing both where ID and IP/port clauses."`);

                return;
            }
        }

        try {
            const serverFind = await FindServer({
                id: whereParams.id,
                url: whereParams.url,
                ip: whereParams.ip,
                ip6: whereParams.ip6,
                port: whereParams.port
            });
    
            if (!serverFind?.id)  {
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

                const fullErrMsg = `Error deleting server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`;
        
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
        message: `Deleted ${servers.length.toString()} servers!`
    });
}