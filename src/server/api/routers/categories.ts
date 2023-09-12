import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import z from "zod";

export const categoriesRouter = createTRPCRouter({
    all: publicProcedure
        .input(z.object({
            parent: z.number().nullable().optional(),

            limit: z.number().default(10),
            cursor: z.number().nullish()
        }))
        .query(async ({ ctx, input }) => {
            const categories = await ctx.prisma.category.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,

                where: {
                    ...(input.parent !== undefined && {
                        parentId: input.parent
                    })
                }
            });

            let nextCategory: typeof input.cursor | undefined = undefined;

            if (categories.length > input.limit) {
                const next = categories.pop();

                if (next)
                    nextCategory = next.id;
            }

            return {
                categories,
                nextCategory
            };
        }),
    addOrUpdate: adminProcedure
        .input(z.object({
            id: z.number().optional(),

            parent: z.number().optional(),

            banner: z.string().optional(),
            icon: z.string().optional(),
        
            url: z.string(),
            name: z.string(),
            description: z.string().optional(),

            bannerRemove: z.boolean().default(false),
            iconRemove: z.boolean().default(false)
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.category.upsert({
                    create: {
                        parentId: input.parent,

                        url: input.url,
                        name: input.name,
                        description: input.description,
                    },
                    update: {
                        url: input.url,
                        name: input.name,
                        description: input.description,

                        ...(input.bannerRemove && {
                            banner: null
                        }),
                        ...(input.iconRemove && {
                            icon: null
                        })
                    },
                    where: {
                        id: input.id ?? 0
                    }
                })
            } catch (err) {
                console.error(err);

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Error ${input.id ? "saving" : "creating"} category. Error => ${typeof err == "string" ? err : "Check console"}.`
                });
            }
        })
})