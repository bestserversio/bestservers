import { TRPCError } from "@trpc/server";
import { createTRPCRouter, canEditServerProcedure, protectedProcedure, publicProcedure, adminProcedure, modProcedure } from "../trpc";

import { type Prisma, Region, ServerLinkType } from "@prisma/client";

import z from "zod";

import { isAdmin } from "@utils/auth";
import { ProcessPrismaError } from "@utils/error";
import { ServerPublicSelect } from "~/types/Server";
import { GetServers, ServerSort } from "@utils/servers/content";

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
            visible: z.boolean()
                .optional().default(true),

            categories: z.array(z.number())
                .optional(),
            platforms: z.array(z.number())
                .optional(),
            regions: z.array(z.nativeEnum(Region))
                .optional(),

            sort: z.nativeEnum(ServerSort)
                .default(ServerSort.CURUSERS),
            sortDir: z.enum(["DESC", "ASC"])
                .default("DESC"),
            search: z.string()
                .optional(),
            mapName: z.string()
                .optional(),
            showOffline: z.boolean()
                .optional(),
            hideEmpty: z.boolean()
                .default(false),
            hideFull: z.boolean()
                .default(false),
            minUsers: z.number()
                .optional(),
            maxUsers: z.number()
                .optional(),

            cursor: z.number()
                .nullish(),
            limit: z.number()
                .default(10)
        }))
        .query(async ({ ctx, input }) => {
            const [servers, nextServer] = await GetServers({
                prisma: ctx.prisma,
                isStatic: false,
                cursor: input.cursor ?? undefined,
                limit: input.limit,
                visible: input.visible,
                sort: input.sort,
                sortDir: input.sortDir,
                search: input.search,
                mapName: input.mapName,
                showOffline: input.showOffline,
                hideEmpty: input.hideEmpty,
                hideFull: input.hideFull,
                minUsers: input.minUsers,
                maxUsers: input.maxUsers,
                platforms: input.platforms,
                categories: input.categories,
                regions: input.regions
            })

            return {
                servers,
                nextServer
            };
        }),
    count: publicProcedure
        .input(z.object({
            visible: z.boolean()
                .optional().default(true),

            categories: z.array(z.number())
                .optional(),
            platforms: z.array(z.number())
                .optional(),
            regions: z.array(z.nativeEnum(Region))
                .optional(),

            search: z.string()
                .optional(),
            mapName: z.string()
                .optional(),
            showOffline: z.boolean()
                .optional(),
            hideEmpty: z.boolean()
                .default(false),
            hideFull: z.boolean()
                .default(false),
            minCurUsers: z.number()
                .optional(),
            maxCurUsers: z.number()
                .optional(),
        }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.server.count({
                where: {
                    ...(input.visible !== undefined && {
                        visible: input.visible
                    }),
                    ...(input.search && {
                        OR: [
                            {
                                name: {
                                    contains: input.search,
                                    mode: "insensitive"
                                }
                            },
                            {
    
                                description: {
                                    contains: input.search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                mapName: {
                                    contains: input.search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                platform: {
                                    name: {
                                        contains: input.search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                platform: {
                                    nameShort: {
                                        contains: input.search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                category: {
                                    name: {
                                        contains: input.search,
                                        mode: "insensitive"
                                    }
                                }
                            }
                        ]
                    }),
                    ...(input.mapName && {
                        mapName: {
                            contains: input.mapName,
                            mode: "insensitive"
                        }
                    }),
                    ...(!input.showOffline && {
                        online: true
                    }),
                    ...(input.categories && input.categories.length > 0 && {
                        categoryId: {
                            in: input.categories
                        }
                    }),
                    ...(input.platforms && input.platforms.length > 0 && {
                        platformId: {
                            in: input.platforms
                        }
                    }),
                    ...(input.regions && input.regions.length > 0 && {
                        region: {
                            in: input.regions
                        }
                    }),
                    ...(input.hideEmpty && {
                        curUsers: {
                            gt: 0
                        }
                    }),
                    ...(input.minCurUsers && {
                        curPlayers: {
                            gte: input.minCurUsers
                        }
                    }),
                    ...(input.maxCurUsers && {
                        curPlayers: {
                            lte: input.maxCurUsers
                        }
                    })
                }
            })
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
                .max(65535, "Port number out of range (> 65535)")
        }))
        .mutation(async ({ ctx, input }) => {
            // If both IPv4 and IPv6 addresses aren't present, don't proceed.
            if (!input.ip && !input.ip6) {
                throw new TRPCError({
                    code: "PARSE_ERROR",
                    message: "IPv4 and IPv6 addresses both not present. Please add an IP address."
                });
            }

            // Try finding server first.
            const server = await ctx.prisma.server.findFirst({
                where: {
                    OR: [
                        {
                            ip: input.ip
                        },
                        {
                            ip6: input.ip6
                        }
                    ],
                    port: input.port
                }
            })

            if (server) {
                throw new TRPCError({
                    code: "PARSE_ERROR",
                    message: "Server already exists."
                })
            }
            
            try {
                await ctx.prisma.server.create({
                    data: {
                        ip: input.ip,
                        ip6: input.ip6,
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
                
            platform: z.number()
                .optional(),
            category: z.number()
                .nullable()
                .optional(),

            url: z.string()
                .min(SERVER_URL_MIN, `URL too short (< ${SERVER_URL_MIN.toString()})`)
                .max(SERVER_URL_MAX, `URL too long (> ${SERVER_URL_MAX.toString()})`)
                .nullable()
                .optional(),
            name: z.string()
                .min(SERVER_NAME_MIN, `Name too short (< ${SERVER_NAME_MIN.toString()})`)
                .max(SERVER_NAME_MAX, `URL too long (> ${SERVER_NAME_MAX.toString()})`)
                .nullable()
                .optional(),
            descriptionShort: z.string()
                .max(SERVER_DESCRIPTIONSHORT_MAX, `Description short too long (> ${SERVER_DESCRIPTIONSHORT_MAX.toString()})`)
                .nullable()
                .optional(),
            description: z.string()
                .max(SERVER_DESCRIPTION_MAX, `Description too long (> ${SERVER_DESCRIPTION_MAX.toString()})`)
                .nullable()
                .optional(),
            features: z.string()
                .max(SERVER_FEATURES_MAX, `Features too long (> ${SERVER_FEATURES_MAX.toString()})`)
                .nullable()
                .optional(),
            rules: z.string()
                .max(SERVER_RULES_MAX, `Rules too long (> ${SERVER_RULES_MAX.toString()})`)
                .nullable()
                .optional(),

            ip: z.string()
                .ip({
                    version: "v4",
                    message: "IPv4 address not in correct format."
                })
                .nullable()
                .optional(),
            ip6: z.string()
                .ip({
                    version: "v6",
                    message: "IPv6 address not in correct format."
                })
                .nullable()
                .optional(),
            port: z.number()
                .min(1, "Port number out of range (< 1)")
                .max(65535, "Port number out of range (> 65535)")
                .nullable()
                .optional(),
            hostName: z.string()
                .min(SERVER_HOSTNAME_MIN, `Host name too short (< ${SERVER_HOSTNAME_MIN.toString()})`)
                .max(SERVER_HOSTNAME_MAX, `Host name too long (> ${SERVER_HOSTNAME_MAX.toString()})`)
                .nullable()
                .optional(),
            
            locationLat: z.number()
                .nullable()
                .optional(),
            locationLon: z.number()
                .nullable()
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
                        ...(input.platform !== undefined && {
                            platformId: input.platform
                        }),
                        categoryId: input.category,

                        ...(admin && {
                            visible: input.visible
                        }),

                        url: input.url,
                        name: input.name,
                        descriptionShort: input.descriptionShort,
                        description: input.description,
                        features: input.features,
                        rules: input.rules,

                        ip: input.ip,
                        ip6: input.ip6,
                        port: input.port,
                        hostName: input.hostName,

                        locationLat: input.locationLat,
                        locationLon: input.locationLon,
                        
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
        }),
    allStats: publicProcedure
        .input(z.object({
            id: z.number(),
            timeframe: z.number().optional()
        }))
        .query(({ ctx, input }) => {
            let timeframe: Date | null = null;

            if (input.timeframe) {
                switch (input.timeframe) {
                    case 0:
                        timeframe = new Date(Date.now() - 86400);

                        break;

                    case 1:
                        timeframe = new Date(Date.now() - 604800);

                        break;

                    case 2:
                        timeframe = new Date(Date.now() - 2678400);

                        break;

                    case 3:
                        timeframe = new Date(Date.now() - 31536000);

                        break;
                }
            }

            return ctx.prisma.serverStat.findMany({
                where: {
                    serverId: input.id,

                    ...(timeframe && {
                        createdAt: {
                            gte: timeframe
                        }
                    })
                }
            });
        }),
    delete: modProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.server.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete server :: ${err}`
                })
            }
        }),
    removeInactive: adminProcedure
        .input(z.object({
            time: z.date().default(new Date(Date.now() - 2592000))
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.server.deleteMany({
                    where: {
                        lastQueried: {
                            lte: input.time
                        }
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to remove inactive servers :: ${err}`
                })
            }
        })
})