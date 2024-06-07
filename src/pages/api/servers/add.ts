import { Server } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { GetOsFromString } from "@utils/os";
import { GetRegionFromString } from "@utils/region";
import { AddServer, ServerBodyT, ServerWhereT, UpdateServer } from "@utils/servers/api";
import { NextApiRequest, NextApiResponse } from "next";

type ServerBodyWithWhereT = ServerBodyT & {
    where?: ServerWhereT
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
    if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }
    
    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "/api/servers/add",
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

    // Check for update only.
    let updateOnly = false;

    const updateOnlyStr = query.updateonly?.toString();

    if (updateOnlyStr && Boolean(updateOnlyStr))
        updateOnly = true;

    // Check for add only.
    let addOnly = false;
    
    const addOnlyStr = query.addonly?.toString();

    if (addOnlyStr && Boolean(addOnlyStr))
        addOnly = true;

    let servers: Server[] = [];

    // Loop through each server.
    const promises = req.body.servers.map(async (serverBody) => {
        // Retrieve region and last queried parameters since we need to parse them differently.
        const { where, os, region, lastQueried, ...rest } = serverBody;

        try {
            // First, try to retrieve server.
            let server = await prisma.server.findFirst({
                where: {
                    id: where?.id ? Number(where.id.toString()) : undefined,
                    ip: where?.ip,
                    ip6: where?.ip6,
                    url: where?.url,
                    port: where?.port ? Number(where.port.toString()) : undefined
                }
            });

            // Check for update only.
            if (updateOnly && !server) {
                return res.status(400).json({
                    message: `Failed to update server. Server doesn't exist with ID '${where?.id ?? "N/A"}' with update only set.`
                })
            }

            // Check for add only.
            if (addOnly && server) {
                return res.status(400).json({
                    message: `Failed to add server. Server exists with ID '${server.id.toString()}' with add only set.`
                })
            }
            
            if (server) {
                const upRest = { ...rest };

                // If auto name is false, make sure to make name undefined when updating.
                if (!server.autoName)
                    upRest.name = undefined;

                await UpdateServer(server.id, {
                    ...upRest,
                    os: GetOsFromString(os),
                    region: GetRegionFromString(region),

                    lastQueried: lastQueried ? new Date(lastQueried) : undefined
                })
            } else {
                // If we have an invisible server and we're adding, ignore and skip.
                if (serverBody.visible !== undefined && !serverBody.visible)
                    return;

                server = await AddServer({
                    ...rest,
                    os: GetOsFromString(os),
                    region: GetRegionFromString(region),
                    lastQueried: lastQueried ? new Date(lastQueried) : undefined
                })
            }

            if (server)
                servers.push(server);
        } catch (err) {
            console.error(err);

            const [errMsg, errCode] = ProcessPrismaError(err);

            const fullErrMsg = `Error adding/updating server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`;

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
        message: `Added ${servers.length.toString()} servers!`
    });
}