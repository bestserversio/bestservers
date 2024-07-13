import { adminProcedure, createTRPCRouter } from "../trpc";

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
    allBadWords: adminProcedure
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
    allBadIps: adminProcedure
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
    allBadAsns: adminProcedure
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
    addOrUpdateSpy: adminProcedure
        .input(z.object({
            id: z.number().optional(),
            host: z.string(),
            verbose: z.number().default(1),
            keyId: z.number().optional(),
            apiTimeout: z.number().default(5),
            vmsEnabled: z.boolean().default(false),
            vmsKey: z.string().optional(),
            vmsTimeout: z.number().default(5),
            vmsPlatforms: z.array(z.number()).default([]),
            vmsLimit: z.number().default(1000),
            vmsMinWait: z.number().default(60),
            vmsMaxWait: z.number().default(120),
            vmsRecvOnly: z.boolean().default(false),
            vmsExcludeEmpty: z.boolean().default(true),
            vmsSubBots: z.boolean().default(false),
            scanners: z.array(z.number()).default([])
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const eSpy = await ctx.prisma.spy.findFirst({
                    where: {
                        id: input.id ?? 0
                    },
                    include: {
                        scanners: true,
                        vmsPlatforms: true
                    }
                })

                await ctx.prisma.spy.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    update: {
                        host: input.host,
                        verbose: input.verbose,
                        keyId: input.keyId,
                        apiTimeout: input.apiTimeout,
                        vmsEnabled: input.vmsEnabled,
                        vmsKey: input.vmsKey,
                        vmsLimit: input.vmsLimit,
                        vmsMinWait: input.vmsMinWait,
                        vmsMaxWait: input.vmsMaxWait,
                        vmsRecvOnly: input.vmsRecvOnly,
                        vmsExcludeEmpty: input.vmsExcludeEmpty,
                        vmsSubBots: input.vmsSubBots,
                        vmsPlatforms: {
                            disconnect: eSpy?.vmsPlatforms?.map(p => ({ id: p.id })) || [],
                            ...(input.vmsPlatforms.length > 0 && { 
                                connect: input.vmsPlatforms.map((id) => ({
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
                        }
                    },
                    create: {
                        host: input.host,
                        verbose: input.verbose,
                        keyId: input.keyId,
                        apiTimeout: input.apiTimeout,
                        vmsEnabled: input.vmsEnabled,
                        vmsKey: input.vmsKey,
                        vmsLimit: input.vmsLimit,
                        vmsMinWait: input.vmsMinWait,
                        vmsMaxWait: input.vmsMaxWait,
                        vmsRecvOnly: input.vmsRecvOnly,
                        vmsExcludeEmpty: input.vmsExcludeEmpty,
                        vmsSubBots: input.vmsSubBots,
                        ...(input.vmsPlatforms.length > 0 && {
                            vmsPlatforms: {
                                connect: input.vmsPlatforms.map((id) => ({
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
            subBots: z.boolean().default(false)
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
    addOrUpdateBadWord: adminProcedure
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
    addOrUpdateBadIp: adminProcedure
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
    addOrUpdateBadAsn: adminProcedure
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
    deleteBadWord: adminProcedure
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
    deleteBadIp: adminProcedure
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
    deleteBadAsn: adminProcedure
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
        })
})