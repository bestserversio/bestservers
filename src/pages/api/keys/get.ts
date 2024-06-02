import { prisma } from "@server/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
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

    const limit = req.query.limit ?? "10";
    const key = req.query.key;

    const keys = await prisma.apiKey.findMany({
        take: Number(limit),
        where: {
            key: key?.toString()
        }
    })

    return res.status(200).json({
        message: "Retrieved keys successfully!",
        keys: keys,
        count: keys.length
    })
}