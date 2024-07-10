import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { type Platform, PlatformFlag } from "@prisma/client";
import { ProcessPrismaError } from "@utils/error";
import { TRPCError } from "@trpc/server";
import { UploadFile } from "@utils/file";

export const PLATFORM_URL_MAX = 64;

export const PLATFORM_NAME_MIN = 3;
export const PLATFORM_NAME_MAX = 128;

export const PLATFORM_DESCRIPTION_MAX = 30_720;

export const platformsRouter = createTRPCRouter({
    all: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.platform.findMany();
        }),
    allInf: publicProcedure
        .input(z.object({
            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ ctx, input }) => {
            const platforms = await ctx.prisma.platform.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined
            });

            let nextPlatform: typeof input.cursor | undefined = undefined;

            if (platforms.length > input.limit) {
                const next = platforms.pop();

                if (next)
                    nextPlatform = next.id;
            }

            return {
                platforms,
                nextPlatform
            }
        }),
    
    addOrUpdate: adminProcedure
        .input(z.object({
            id: z.number()
                .optional(),

            flags: z.array(z.nativeEnum(PlatformFlag))
                .optional(),
            
            banner: z.string()
                .optional(),
            icon: z.string()
                .optional(),

            bannerRemove: z.boolean()
                .default(false),
            iconRemove: z.boolean()
                .default(false),

            jsInternal: z.string()
                .optional(),
            jsExternal: z.string()
                .nullable()
                .optional(),

            url: z.string()
                .max(PLATFORM_URL_MAX, `URL too long (> ${PLATFORM_URL_MAX.toString()})`),
            name: z.string()
                .min(PLATFORM_NAME_MIN, `Name too short (< ${PLATFORM_NAME_MIN.toString()})`)
                .max(PLATFORM_NAME_MAX, `Name too long (> ${PLATFORM_NAME_MAX.toString()})`),
            description: z.string()
                .max(PLATFORM_DESCRIPTION_MAX, `Description too long (> ${PLATFORM_DESCRIPTION_MAX.toString()})`)
                .nullable()
                .optional()
        }))
        .mutation(async ({ ctx, input }) => {
            let platform: Platform | null = null;

            try {
                platform = await ctx.prisma.platform.upsert({
                    where: {
                        id: input.id ?? 0
                    },
                    create: {
                        ...(input.flags !== undefined && {
                            flags: input.flags
                        }),

                        url: input.url,
                        name: input.name,
                        description: input.description
                    },
                    update: {
                        ...(input.flags !== undefined && {
                            flags: input.flags
                        }),

                        ...(input.bannerRemove && {
                            banner: null
                        }),
                        ...(input.iconRemove && {
                            icon: null
                        }),

                        url: input.url,
                        name: input.name,
                        description: input.description
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

            if (!platform) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Platform is null after creation."
                });
            }

            // To Do: Handle JS internal and externals.

            // Handle banner.
            if (input.banner) {
                // Create path.
                const path = `/platforms/${platform.id.toString()}_banner`;

                const [success, errMsg, fullPath] = UploadFile({
                    path: path,
                    contents: input.banner
                });

                if (!success) {
                    throw new TRPCError({
                        code: "PARSE_ERROR",
                        message: `Failed to upload banner for platform #${platform.id.toString()}. Error => ${errMsg}`

                    });
                }

                try {
                    await ctx.prisma.platform.update({
                        where: {
                            id: platform.id
                        },
                        data: {
                            banner: fullPath
                        }
                    });
                } catch (err) {
                    console.error(err);

                    const [errMsg, errCode] = ProcessPrismaError(err);

                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        ...(errMsg && {
                            message: `Error updating platform #${platform.id.toString()} with banner data. Error => ${errMsg}${errCode ? ` (${errCode})` : ``}`
                        })
                    });
                }
            }

            // Handle icon.
            if (input.icon) {
                // Create path.
                const path = `/platforms/${platform.id.toString()}_icon`;

                const [success, errMsg, fullPath] = UploadFile({
                    path: path,
                    contents: input.icon
                });

                if (!success) {
                    throw new TRPCError({
                        code: "PARSE_ERROR",
                        message: `Error uploading icon for platform #${platform.id.toString()}. Error => ${errMsg}`
                    });
                }

                try {
                    await ctx.prisma.platform.update({
                        where: {
                            id: platform.id
                        },
                        data: {
                            icon: fullPath
                        }
                    });
                } catch (err) {
                    console.error(err);

                    const [errMsg, errCode] = ProcessPrismaError(err);

                    throw new TRPCError({
                        code: "PARSE_ERROR",
                        ...(errMsg && {
                            message: `Error updating platform #${platform.id.toString()} with icon data. Error => ${errMsg}${errCode ? ` (${errCode})` : ``}`
                        })
                    })
                }
            }
        }),
    delete: adminProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.platform.delete({
                    where: {
                        id: input.id
                    }
                })
            } catch (err: unknown) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Failed to delete platform due to error :: ${err}`
                })
            }
        })
})