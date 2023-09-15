import { TRPCError } from "@trpc/server";
import { createTRPCRouter, canEditServerProcedure, protectedProcedure, publicProcedure } from "../trpc";

import { ServerLinkType } from "@prisma/client";

import z from "zod";

import { isAdmin } from "@utils/auth";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ProcessPrismaError } from "@utils/error";

// Limits
export const SERVER_URL_MIN = 3;
export const SERVER_URL_MAX = 64;

export const SERVER_HOSTNAME_MIN = 3;
export const SERVER_HOSTNAME_MAX = 64;

export const SERVER_NAME_MIN = 5;
export const SERVER_NAME_MAX = 128;

export const SERVER_DESCRIPTIONSHORT_MAX = 128;

export const SERVER_DESCRIPTION_MAX = 30_720;
export const SERVER_FEATURES_MAX = 30_720;
export const SERVER_RULES_MAX = 30_720;

export const SERVER_LINK_NAME_MAX = 128;

export const serversRouter = createTRPCRouter({
    all: publicProcedure
        .input(z.object({
            categories: z.array(z.number()).optional(),
            sort: z.string().default("curUsers"),
            sortDir: z.string().default("desc"),
            online: z.boolean().optional(),
            search: z.string().optional(),

            cursor: z.number().nullish(),
            limit: z.number().default(10)
        }))
        .query(async ({ ctx, input }) => {
            const servers = await ctx.prisma.server.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,

                where: {
                    ...(input.search && {
                        OR: [
                            {
                                name: {
                                    contains: input.search
                                }
                            }
                        ]
                    }),
                    ...(input.online !== undefined && {
                        online: input.online
                    })
                },
                orderBy: {
                    [input.sort]: input.sortDir
                }
            });

            let nextServer: typeof input.cursor | undefined = undefined;

            if (servers.length > input.limit) {
                const next = servers.pop();

                if (next)
                    nextServer = next.id;
            }

            return {
                servers,
                nextServer
            };
        }),
    addGameServer: protectedProcedure
        .input(z.object({
            ip: z.string()
                .ip({
                    version: "v4",
                    message: "IPv4 address not in correct format"
                })
                .optional(),
            ip6: z.string()
                .ip({
                    version: "v6",
                    message: "IPv6 address not in correct format"
                })
                .optional(),
            port: z.number()
                .min(1, "Port number out of range (< 1)")
                .max(65535, "Port number out of range (> 65535)"),
        }))
        .mutation(async ({ ctx, input }) => {
            // If both IPv4 and IPv6 addresses aren't present, don't proceed.
            if (!input.ip && !input.ip6) {
                throw new TRPCError({
                    code: "PARSE_ERROR",
                    message: "IPv4 and IPv6 addresses both not present. Please add an IP address."
                });
            }
            
            try {
                await ctx.prisma.server.create({
                    data: {
                        ip: input.ip,
                        port: input.port
                    }
                });
            } catch (err) {
                console.error(err);

                const [errMsg, errCode] = ProcessPrismaError(err);

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    ...(errMsg && {
                        message: `${errMsg}${errCode ? ` (${errCode})` : ``}`
                    })
                });
            }
        }),
    update: canEditServerProcedure
        .input(z.object({
            id: z.number(),
            
            visible: z.boolean()
                .optional(),

            url: z.string()
                .min(SERVER_URL_MIN, `URL too short (< ${SERVER_URL_MIN.toString()})`)
                .max(SERVER_URL_MAX, `URL too long (> ${SERVER_URL_MAX.toString()})`)
                .optional(),

            ip: z.string()
                .ip({
                    version: "v4",
                    message: "IPv4 address not in correct format."
                })
                .optional(),
            ip6: z.string()
                .ip({
                    version: "v6",
                    message: "IPv6 address not in correct format."
                })
                .optional(),
            port: z.number()
                .min(1, "Port number out of range (< 1)")
                .max(65535, "Port number out of range (> 65535)")
                .optional(),
            hostName: z.string()
                .min(SERVER_HOSTNAME_MIN, `Host name too short (< ${SERVER_HOSTNAME_MIN.toString()})`)
                .max(SERVER_HOSTNAME_MAX, `Host name too long (> ${SERVER_HOSTNAME_MAX.toString()})`)
                .optional(),
            
            locationLat: z.number()
                .optional(),
            locationLon: z.number()
                .optional(),

            links: z.array(z.object({
                type: z.nativeEnum(ServerLinkType),
                name: z.string()
                    .max(SERVER_LINK_NAME_MAX, `Link name too long (> ${SERVER_LINK_NAME_MAX.toString()})`)
                    .optional(),
                url: z.string()
                    .url("Link URL not in correct format.")
            }))
                .optional()
        }))
        .mutation(async ({ ctx, input }) => {
            const admin = isAdmin(ctx.session);

            try {
                await ctx.prisma.server.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        ...(admin && input.visible !== undefined && {
                            visible: input.visible
                        }),
                        ...(input.url !== undefined && {
                            url: input.url
                        }),
                        ...(input.ip !== undefined && {
                            ip: input.ip
                        }),
                        ...(input.ip6 !== undefined && {
                            ip6: input.ip6
                        }),
                        ...(input.port !== undefined && {
                            port: input.port
                        }),
                        ...(input.hostName !== undefined && {
                            hostName: input.hostName
                        }),
                        ...(input.locationLat !== undefined && {
                            locationLat: input.locationLat
                        }),
                        ...(input.locationLon !== undefined && {
                            locationLon: input.locationLon
                        }),
                        ...(input.links !== undefined && {
                            links: {
                                deleteMany: {
                                    serverId: input.id
                                },
                                create: input.links.map((link) => ({
                                    type: link.type,
                                    name: link.name,
                                    url: link.url
                                }))
                            }
                        })
                    }
                })
            } catch (err) {
                console.error(err);

                const [errMsg, errCode] = ProcessPrismaError(err);

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    ...(errMsg && {
                        message: `${errMsg}${errCode ? ` (${errCode})` : ``}`
                    })
                });
            }
        })
})