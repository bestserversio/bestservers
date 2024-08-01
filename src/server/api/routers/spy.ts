import { adminProcedure, createTRPCRouter, modProcedure } from "../trpc";

import * as z from "zod"
import { TRPCError } from "@trpc/server";

export const spyRouter = createTRPCRouter({
    allSpies: adminProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ input, ctx}) => {
            const spies = await ctx.prisma.spy.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            })

            let nextSpy: typeof input.cursor | undefined = undefined;

            if (spies.length > input.limit) {
                const next = spies.pop();

                if (next)
                    nextSpy = next.id;
            }

            return {
                spies,
                nextSpy
            }
        }),
    allScanners: adminProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ input, ctx}) => {
            const scanners = await ctx.prisma.spyScanner.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            })

            let nextScanner: typeof input.cursor | undefined = undefined;

            if (scanners.length > input.limit) {
                const next = scanners.pop();

                if (next)
                    nextScanner = next.id;
            }

            return {
                scanners,
                nextScanner
            }
        }),
    allVms: adminProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ ctx, input }) => {
            const vms = await ctx.prisma.spyVms.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            })

            let nextVms: typeof input.cursor | undefined = undefined;

            if (vms.length > input.limit) {
                const next = vms.pop();

                if (next)
                    nextVms = next.id;
            }

            return {
                vms,
                nextVms
            }
        }),
    allBadWords: modProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ input, ctx }) => {
            const badWords = await ctx.prisma.badWord.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            });

            let nextBadWord: typeof input.cursor | undefined = undefined;

            if (badWords.length > input.limit) {
                const next = badWords.pop();

                if (next)
                    nextBadWord = next.id;
            }

            return {
                badWords,
                nextBadWord
            }
        }),
    allBadIps: modProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ input, ctx }) => {
            const badIps = await ctx.prisma.badIp.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            });

            let nextBadIp: typeof input.cursor | undefined = undefined;

            if (badIps.length > input.limit) {
                const next = badIps.pop();

                if (next)
                    nextBadIp = next.id;
            }

            return {
                badIps,
                nextBadIp
            }
        }),
    allBadAsns: modProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ input, ctx }) => {
            const badAsns = await ctx.prisma.badAsn.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            });

            let nextBadAsn: typeof input.cursor | undefined = undefined;

            if (badAsns.length > input.limit) {
                const next = badAsns.pop();

                if (next)
                    nextBadAsn = next.id;
            }

            return {
                badAsns,
                nextBadAsn
            }
        }),
    allGoodIps: modProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ input, ctx }) => {
            const goodIps = await ctx.prisma.goodIp.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            });

            let nextGoodIp: typeof input.cursor | undefined = undefined;

            if (goodIps.length > input.limit) {
                const next = goodIps.pop();

                if (next)
                    nextGoodIp = next.id;
            }

            return {
                goodIps,
                nextGoodIp
            }
        }),
    addOrUpdateSpy: adminProcedure
        .input(z.object({
            id: z.number().optional(),
            host: z.string(),
            verbose: z.number().default(1),
            logDirectory: z.string().nullable().default("./logs"),
            keyId: z.number().optional().nullable(),
            apiHost: z.string().optional(),
            apiTimeout: z.number().optional(),
            webApiEnabled: z.boolean().optional(),
            webApiHost: z.string().optional(),
            webApiEndpoint: z.string().optional(),
            webApiTimeout: z.number().optional(),
            webApiInterval: z.number().optional(),
            webApiSaveToFs: z.boolean().default(true),
            vmsEnabled: z.boolean().default(false),
            removeTimedOut: z.boolean().default(false),
            removeTimedOutInterval: z.number().default(120),
            removeTimedOutTime: z.number().default(3600),
            removeTimedOutTimeout: z.number().default(30),
            removeTimedOutPlatforms: z.array(z.number()).default([]),
            removeInactive: z.boolean().default(false),
            removeInactiveTime: z.number().default(2592000),
            removeInactiveInterval: z.number().default(86400),
            removeInactiveTimeout: z.number().default(5),
            removeDups: z.boolean().default(false),
            removeDupsInterval: z.number().default(120),
            removeDupsLimit: z.number().default(100),
            removeDupsMaxServers: z.number().default(100),
            removeDupsTimeout: z.number().default(30),
            scanners: z.array(z.number()).default([]),
            vms: z.array(z.number()).default([])
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const eSpy = await ctx.prisma.spy.findFirst({
                    where: {
                        id: input.id ?? 0
                    },
                    include: {
                        scanners: true,
                        vms: true,
                        removeTimedOutPlatforms: true
                    }
                })

                await ctx.prisma.spy.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    update: {
                        host: input.host,
                        verbose: input.verbose,
                        logDirectory: input.logDirectory,
                        keyId: input.keyId,
                        apiHost: input.apiHost,
                        apiTimeout: input.apiTimeout,
                        webApiEnabled: input.webApiEnabled,
                        webApiHost: input.webApiHost,
                        webApiEndpoint: input.webApiEndpoint,
                        webApiTimeout: input.webApiTimeout,
                        webApiInterval: input.webApiInterval,
                        webApiSaveToFs: input.webApiSaveToFs,
                        removeInactive: input.removeInactive,
                        removeInactiveTime: input.removeInactiveTime,
                        removeInactiveInterval: input.removeInactiveInterval,
                        removeInactiveTimeout: input.removeInactiveTimeout,
                        removeDups: input.removeDups,
                        removeDupsInterval: input.removeDupsInterval,
                        removeDupsLimit: input.removeDupsLimit,
                        removeDupsMaxServers: input.removeDupsMaxServers,
                        removeDupsTimeout: input.removeDupsTimeout,
                        removeTimedOut: input.removeTimedOut,
                        removeTimedOutInterval: input.removeTimedOutInterval,
                        removeTimedOutTime: input.removeTimedOutTime,
                        removeTimedOutTimeout: input.removeTimedOutTimeout,
                        removeTimedOutPlatforms: {
                            disconnect: eSpy?.removeTimedOutPlatforms?.map(v => ({ id: v.id })) || [],
                            ...(input.removeTimedOutPlatforms.length > 0 && {
                                connect: input.removeTimedOutPlatforms.map((id) => ({
                                    id: id
                                }))
                            })
                        },
                        scanners: {
                            disconnect: eSpy?.scanners?.map(s => ({ id: s.id })) || [],
                            ...(input.scanners.length > 0 && {
                                connect: input.scanners.map((id) => ({
                                    id: id
                                }))
                            })
                        },
                        vms: {
                            disconnect: eSpy?.vms?.map(v => ({ id: v.id })) || [],
                            ...(input.vms.length > 0 && {
                                connect: input.vms.map((id) => ({
                                    id: id
                                }))
                            })
                        }
                    },
                    create: {
                        host: input.host,
                        verbose: input.verbose,
                        logDirectory: input.logDirectory,
                        keyId: input.keyId,
                        apiHost: input.apiHost,
                        apiTimeout: input.apiTimeout,
                        webApiEnabled: input.webApiEnabled,
                        webApiHost: input.webApiHost,
                        webApiEndpoint: input.webApiEndpoint,
                        webApiTimeout: input.webApiTimeout,
                        webApiInterval: input.webApiInterval,
                        webApiSaveToFs: input.webApiSaveToFs,
                        removeInactive: input.removeInactive,
                        removeInactiveTime: input.removeInactiveTime,
                        removeInactiveInterval: input.removeInactiveInterval,
                        removeInactiveTimeout: input.removeInactiveTimeout,
                        removeDups: input.removeDups,
                        removeDupsInterval: input.removeDupsInterval,
                        removeDupsLimit: input.removeDupsLimit,
                        removeDupsMaxServers: input.removeDupsMaxServers,
                        removeDupsTimeout: input.removeDupsTimeout,
                        removeTimedOut: input.removeTimedOut,
                        removeTimedOutInterval: input.removeTimedOutInterval,
                        removeTimedOutTime: input.removeTimedOutTime,
                        removeTimedOutTimeout: input.removeTimedOutTimeout,
                        ...(input.removeTimedOutPlatforms.length > 0 && {
                            scanners: {
                                connect: input.removeTimedOutPlatforms.map((id) => ({
                                    id: id
                                }))
                            }
                        }),
                        ...(input.scanners.length > 0 && {
                            scanners: {
                                connect: input.scanners.map((id) => ({
                                    id: id
                                }))
                            }
                        }),
                        ...(input.vms.length > 0 && {
                            vms: {
                                connect: input.vms.map((id) => ({
                                    id: id
                                }))
                            }
                        })
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to add Spy instance :: ${err}`
                })
            }
        }),
    addOrUpdateScanner: adminProcedure
        .input(z.object({
            id: z.number().optional(),

            platforms: z.array(z.number()).default([]),
            
            name: z.string(),
            protocol: z.string().default("A2S"),
            minWait: z.number().default(60),
            maxWait: z.number().default(120),
            limit: z.number().default(100),
            recvOnly: z.boolean().default(false),
            subBots: z.boolean().default(false),
            queryTimeout: z.number().default(3),
            a2sPlayer: z.boolean().default(true),
            randomPlatforms: z.boolean().default(false),
            visibleSkipCount: z.number().default(10),
            requestDelay: z.number().default(0)
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const eScanner = await ctx.prisma.spyScanner.findFirst({
                    where: {
                        id: input.id ?? 0
                    },
                    include: {
                        platforms: true
                    }
                })

                await ctx.prisma.spyScanner.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    create: {
                        name: input.name,
                        protocol: input.protocol,
                        minWait: input.minWait,
                        maxWait: input.maxWait,
                        limit: input.limit,
                        recvOnly: input.recvOnly,
                        subBots: input.subBots,
                        queryTimeout: input.queryTimeout,
                        a2sPlayer: input.a2sPlayer,
                        randomPlatforms: input.randomPlatforms,
                        visibleSkipCount: input.visibleSkipCount,
                        requestDelay: input.requestDelay,
                        ...(input.platforms.length > 0 && {
                            platforms: {
                                connect: input.platforms.map((id) => ({
                                    id: id
                                }))
                            }
                        })
                    },
                    update: {
                        name: input.name,
                        protocol: input.protocol,
                        minWait: input.minWait,
                        maxWait: input.maxWait,
                        limit: input.limit,
                        recvOnly: input.recvOnly,
                        subBots: input.subBots,
                        queryTimeout: input.queryTimeout,
                        a2sPlayer: input.a2sPlayer,
                        randomPlatforms: input.randomPlatforms,
                        visibleSkipCount: input.visibleSkipCount,
                        requestDelay: input.requestDelay,
                        platforms: {
                            disconnect: eScanner?.platforms?.map(p => ({ id: p.id })) || [],
                            ...(input.platforms.length > 0 && {
                                connect: input.platforms.map((id) => ({
                                    id: id
                                }))
                            })
                        } 
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete Spy scanner :: ${err}`
                })
            }
        }),
    addOrUpdateVms: adminProcedure
        .input(z.object({
            id: z.number().optional(),

            name: z.string().optional(),

            key: z.string().optional(),
            timeout: z.number().default(5),
            limit: z.number().default(1000),
            minWait: z.number().default(60),
            maxWait: z.number().default(120),
            recvOnly: z.boolean().default(false),
            excludeEmpty: z.boolean().default(true),
            onlyEmpty: z.boolean().default(false),
            subBots: z.boolean().default(false),
            addOnly: z.boolean().default(false),
            randomApps: z.boolean().default(false),
            setOffline: z.boolean().default(true),
            
            platforms: z.array(z.number()).default([])
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const eVms = await ctx.prisma.spyVms.findFirst({
                    include: {
                        platforms: true
                    },
                    where: {
                        id: input.id
                    }
                })

                await ctx.prisma.spyVms.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    create: {
                        name: input.name,
                        key: input.key,
                        timeout: input.timeout,
                        limit: input.limit,
                        minWait: input.minWait,
                        maxWait: input.maxWait,
                        recvOnly: input.recvOnly,
                        excludeEmpty: input.excludeEmpty,
                        onlyEmpty: input.onlyEmpty,
                        subBots: input.subBots,
                        addOnly: input.addOnly,
                        randomApps: input.randomApps,
                        setOffline: input.setOffline,
                        ...(input.platforms.length > 0 && {
                            platforms: {
                                connect: input.platforms.map((id) => ({
                                    id: id
                                }))
                            }
                        })
                    },
                    update: {
                        name: input.name,
                        key: input.key,
                        timeout: input.timeout,
                        limit: input.limit,
                        minWait: input.minWait,
                        maxWait: input.maxWait,
                        recvOnly: input.recvOnly,
                        excludeEmpty: input.excludeEmpty,
                        onlyEmpty: input.onlyEmpty,
                        subBots: input.subBots,
                        addOnly: input.addOnly,
                        randomApps: input.randomApps,
                        setOffline: input.setOffline,
                        platforms: {
                            disconnect: eVms?.platforms?.map(p => ({ id: p.id })) || [],
                            ...(input.platforms.length > 0 && {
                                connect: input.platforms.map((id) => ({
                                    id: id
                                }))
                            })
                        } 
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to add/update VMS due to error :: ${err}`
                })
            }
        }),
    addOrUpdateBadWord: modProcedure
        .input(z.object({
            id: z.number().optional(),
            word: z.string(),
            exact: z.boolean().default(false)
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.badWord.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    create: {
                        word: input.word,
                        exact: input.exact
                    },
                    update: {
                        word: input.word,
                        exact: input.exact
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to add bad word :: ${err}`
                })
            }
        }),
    addOrUpdateBadIp: modProcedure
        .input(z.object({
            id: z.number().optional(),
            ip: z.string(),
            cidr: z.number().default(32)
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.badIp.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    create: {
                        ip: input.ip,
                        cidr: input.cidr
                    },
                    update: {
                        ip: input.ip,
                        cidr: input.cidr
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to add bad IP :: ${err}`
                })
            }
        }),
    addOrUpdateBadAsn: modProcedure
        .input(z.object({
            id: z.number().optional(),
            asn: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.badAsn.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    create: {
                        asn: input.asn
                    },
                    update: {
                        asn: input.asn
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to add bad ASN :: ${err}`
                })
            }
        }),
    addOrUpdateGoodIp: modProcedure
        .input(z.object({
            id: z.number().optional(),
            ip: z.string(),
            cidr: z.number().default(32)
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.goodIp.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    create: {
                        ip: input.ip,
                        cidr: input.cidr
                    },
                    update: {
                        ip: input.ip,
                        cidr: input.cidr
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to add good IP :: ${err}`
                })
            }
        }),
    deleteSpy: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.spy.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete Spy instance :: ${err}`
                })
            }
        }),
    deleteScanner: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.spyScanner.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete Spy Scanner :: ${err}`
                })
            }
        }),
    deleteVms: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.spyVms.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete Spy VMS :: ${err}`
                })
            }
        }),
    deleteBadWord: modProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.badWord.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete bad word :: ${err}`
                })
            }
        }),
    deleteBadIp: modProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.badIp.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete bad IP :: ${err}`
                })
            }
        }),
    deleteBadAsn: modProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.badAsn.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete bad ASN :: ${err}`
                })
            }
        }),
    deleteGoodIp: modProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.goodIp.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete good IP :: ${err}`
                })
            }
        }),
})