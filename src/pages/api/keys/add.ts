import { prisma } from "@server/db";
import { ProcessPrismaError } from "@utils/error";
import { randomBytes } from "crypto";
import { type NextApiRequest, type NextApiResponse } from "next";

interface NextApiRequestCustom extends NextApiRequest {
    body: {
        host?: string
        endpoint?: string
        writeAccess?: boolean
        limit?: string
    }
}

export default async function Handler (
    req: NextApiRequestCustom,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }
    // Make sure we have the correct auth key set.
    const authToken = req.headers?.authorization;
    const rootApiKey = process.env.ROOT_API;

    if (!authToken || !rootApiKey || authToken !== rootApiKey) {
        return res.status(400).json({
            message: "Unauthorized. Authorization token does not match!"
        });
    }

    // Create key.
    const key = randomBytes(48).toString("hex");

    const {
        host,
        endpoint,
        writeAccess,
        limit
    } = req.body;

    try {
        await prisma.apiKey.create({
            data: {
                host: host,
                endpoint: endpoint,
                limit: limit ? Number(limit) : undefined,
                writeAccess: writeAccess,
                key: key
            }
        })

        return res.status(200).json({
            key: key
        });
    } catch (err: unknown) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        const fullErrMsg = `Error adding API key.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`;

        return res.status(400).json({
            message: "Failed to add API key due to error.",
            error: fullErrMsg
        })
    }
}