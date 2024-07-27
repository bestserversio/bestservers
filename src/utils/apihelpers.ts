import { prisma } from "@server/db";
import { ProcessPrismaError } from "./error";
import { type NextApiRequest, type NextApiResponse } from "next";

type checkApiAccessT = {
    code: number
    message: string
}

export async function CheckApiAccess({
    req,
    authKey,
    endpoint,
    writeAccess
} : {
    req: NextApiRequest
    authKey?: string
    endpoint: string
    writeAccess?: boolean
}): Promise<checkApiAccessT> {
    // Check if API key is even set.
    if (!authKey) {
        return {
            code: 401,
            message: "Authorization header not set."
        };
    }

    const ipAddr = req.headers?.["cf-connecting-ip"]?.toString() ?? req.socket.remoteAddress;

    // If host is undefined, we should return since it should never be undefined.
    if (!ipAddr) {
        return {
            code: 400,
            message: "IP address is undefined. This should not happen!"
        };
    }

    // Attempt to retrieve API key that matches our parameters.
    try {
        const res = await prisma.apiKey.findFirstOrThrow({
            include: {
                _count: {
                    select: {
                        hits: {
                            where: {
                                time: {
                                    gte: new Date(Date.now() - 3600)
                                }
                            }
                        }
                    }
                }
            },
            where: {
                key: authKey,
                OR: [
                    {
                        OR: [
                            {
                                host: null
                            },
                            {
                                host: ipAddr
                            }
                        ]
                    },
                    {
                        OR: [
                            {
                                endpoint: null
                            },
                            {
                                endpoint: endpoint
                            }
                        ]
                    }
                ],
                ...(writeAccess && {
                    writeAccess: true
                })
            }
        });

        // Make sure we're not rate limited.
        const curHits = res._count.hits;
        const maxHits = res.limit;

        if (curHits > maxHits) {
            return {
                code: 429,
                message: `Rate limited (${curHits.toString()} > ${maxHits.toString()}).`
            };
        }

        // Insert hits entry into database.
        try {
            await prisma.apiKeyHits.create({
                data: {
                    keyId: res.id,
                    host: ipAddr,
                    endpoint: endpoint,
                    write: writeAccess
                }
            })
        } catch {}

        return { 
            code: 200,
            message: "Success!"
        };
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return {
            code: 401,
            message: `Unauthorized.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`
        };
    }
}

export function HandleError(
    res: NextApiResponse,
    errMsg: string,
    errCode: number,
    errors?: string[],
    abortOnError?: boolean
): void {
    if (abortOnError) {
        res.status(errCode).json({
            message: errMsg
        })
    } else if (errors) {
        errors.push(errMsg);
    }
}