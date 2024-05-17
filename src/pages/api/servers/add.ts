import { Server } from "@prisma/client";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { GetRegionFromString } from "@utils/region";
import { AddServer, ServerBodyT } from "@utils/servers/api";
import { NextApiRequest, NextApiResponse } from "next";

interface ExtendedRequest extends NextApiRequest {
    body: {
        servers: ServerBodyT[]
    }
}

export default async function Handler (
    req: ExtendedRequest,
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

    let servers: Server[] = [];

    // Loop through each server.
    const promises = req.body.servers.map(async (serverBody) => {
        // Retrieve region and last queried parameters since we need to parse them differently.
        const { region, lastQueried } = serverBody;

        // Add server.
        let server: Server | null = null;

        try {
            server = await AddServer({
                ...serverBody,
                region: GetRegionFromString(region),
                lastQueried: lastQueried ? new Date(lastQueried) : undefined
            })

            if (server)
                servers.push(server);
        } catch (err) {
            console.error(err);

            const [errMsg, errCode] = ProcessPrismaError(err);

            const fullErrMsg = `Error adding server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`;

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