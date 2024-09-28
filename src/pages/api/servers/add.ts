import { type PrismaPromise, type Server } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { GetOsFromString } from "@utils/os";
import { GetRegionFromString } from "@utils/region";
import { type ServerBodyT, type ServerWhereT } from "@utils/servers/api";
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
    api: {
        responseLimit: "64mb",
        bodyParser: {
            sizeLimit: "64mb"
        }
    },
}


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

    // First, compile search criteria.
    const searchCrit = req.body.servers.map(sb => ({
        id: sb?.where?.id ? Number(sb.where.id) : undefined,
        ip: sb?.where?.ip,
        ip6: sb?.where?.ip6,
        url: sb?.where?.url,
        port: sb?.where?.port ? Number(sb.where.port) : undefined
    }))

    // Get all existing servers.
    const existingServers = await prisma.server.findMany({
        where: {
            OR: searchCrit
        }
    })

    // Create map for fast lookup.
    const serverMap = new Map<string, Server>()

    existingServers.forEach(s => {
        const key = `${s.ip}:${s.port?.toString()}`

        serverMap.set(key, s)
    })

    // Start creating operations.
    const updateOps: PrismaPromise<Server>[]  = [];
    const createOps: PrismaPromise<Server>[]  = [];

    // Loop through each server.
    req.body.servers.forEach(sb => {
        try {
            const key = `${sb.ip}:${sb.port?.toString()}`

            const existing = serverMap.get(key)

            if (updateOnly && !existing)
                return

            if (addOnly && existing)
                return;

            // Compile data.
            delete sb.where;
            const {  os, region, lastQueried, lastOnline, ...rest } = sb

            const data = {
                ...rest,
                os: GetOsFromString(os),
                region: GetRegionFromString(region),
                lastQueried: lastQueried ? new Date(lastQueried) : undefined,
                lastOnline: lastOnline ? new Date(lastOnline) : undefined,
            }

            // Add to whatever operations.
            if (existing) {
                updateOps.push(prisma.server.update({
                    where: {
                        id: existing.id
                    },
                    data
                }))
            } else {
                createOps.push(prisma.server.create({
                    data
                }))
            }
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

    let updatedServers: Server[] = [];
    let createdServers: Server[] = [];

    // Execute transactions in bulk.
    try {
        if (updateOps.length > 0 || createOps.length > 0) {
            const results = await prisma.$transaction([...updateOps, ...createOps]);
        
            // Separate the update and create results based on the number of operations.
            updatedServers = results.slice(0, updateOps.length);
            createdServers = results.slice(updateOps.length);
        }
    } catch (err) {
        console.error(err)

        const [errMsg] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Failed to execute bulk transaction. Error => ${errMsg}`
        })
    }

    const totServers = updatedServers.length + createdServers.length

    return res.status(200).json({
        serverCount: totServers,
        servers: [...updatedServers, ...createdServers],
        errorCount: errors.length,
        errors: errors,
        message: `Added ${totServers.toString()} servers!`
    });
}