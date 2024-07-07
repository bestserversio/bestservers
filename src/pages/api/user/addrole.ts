import { UserRole } from "@prisma/client";
import { prisma } from "@server/db";
import { ProcessPrismaError } from "@utils/error";
import { type NextApiRequest, type NextApiResponse } from "next";

interface ExtendedApiRequest extends NextApiRequest {
    body: {
        userId?: string
        role?: string
    }
}

export default async function Handler (
    req: ExtendedApiRequest,
    res: NextApiResponse
) {
    // Retrieve root API  token.
    const apiKey = process.env.ROOT_API ?? undefined;

    // Check if our root API key is set.
    if (!apiKey) {
        console.error("API /api/user/addrole called without root API set.");

        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    // Retrieve our authorization header.
    const authKey = req.headers.authorization ?? undefined;

    // Check if authorization header is set.
    if (!authKey) {
        return res.status(401).json({
            message: "Unauthorized. No authorization header set."
        });
    }

    // Check if both of our API keys match.
    if (authKey !== apiKey) {
        return res.status(401).json({
            message: "Unauthorized."
        });
    }

    const userId = req.body.userId ?? undefined;

    if (!userId) {
        return res.status(400).json({
            message: "User ID not specified or empty."
        });
    }

    const roleStr = req.body.role ?? undefined;

    if (!roleStr) {
        return res.status(400).json(({
            message: "Role not specified or empty."
        }));
    }

    let role: UserRole | undefined = undefined;

    switch (roleStr.toLowerCase()) {
        case "admin":
            role = UserRole.ADMIN

            break;

        case "moderator":
            role = UserRole.MODERATOR

            break;
    }

    if (!role) {
        return res.status(400).json({
            message: `Specified role (${roleStr}) doesn't exist.`
        });
    }

    // Attempt to update user.
    try {
        await prisma.user.update({
            data: {
                roles: [role]
            },
            where: {
                id: userId
            }
        });
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return res.status(400).json({
            ...(errMsg && {
                message: `Unable to add user '${userId}' to role '${roleStr}'. Error => ${errMsg}${errCode ? ` (${errCode})` : ``}.`
            })
        });
    }

    return res.status(200).json({
        message: `Added user '${userId} to role '${roleStr}'.`
    });
}