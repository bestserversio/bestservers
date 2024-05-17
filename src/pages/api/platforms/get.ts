import { Platform } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
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

    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "/api/platforms/get",
        writeAccess: false
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    const { query } = req;

    const limit = Number(query?.limit?.toString() ?? 10);

    let platforms: Platform[] | null = null;

    try {
        platforms = await prisma.platform.findMany({
            take: limit
        })
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Error retrieving platforms.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`
        })
    }

    return res.status(200).json({
        count: platforms?.length ?? 0,
        platforms: platforms,
        message: `Retrieved ${platforms?.length?.toString() ?? "0"} platforms!`
    });
}