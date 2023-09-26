import { Server } from "@prisma/client";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { GetRegionFromString } from "@utils/region";
import { AddServer, ServerBodyT } from "@utils/servers/api";
import { NextApiRequest, NextApiResponse } from "next";

interface ExtendedRequest extends NextApiRequest {
    body: ServerBodyT
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

    // Retrieve our client's IP address.
    const host = req.socket.remoteAddress;

    // Check if we have API access.
    const check = await CheckApiAccess({
        authKey: req.headers.authorization,
        host: host,
        endpoint: "/api/servers/add",
        writeAccess: true
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve region and last queried parameters since we need to parse them differently.
    const { region, lastQueried } = req.body;

    // Add server.
    let server: Server | null = null;

    try {
        server = await AddServer({
            ...req.body,
            region: GetRegionFromString(region),
            lastQueried: lastQueried ? new Date(lastQueried) : undefined
        })
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Error adding server.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}.`
        });
    }

    return res.status(200).json({
        server: server,
        message: `Successfully added server!`
    });
}