import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import z from "zod";

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
    add: protectedProcedure
        .input(z.object({
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
                .min(1, "Port number out of range (<1).")
                .max(65535, "Port number out of range (>65535)")
                .optional(),
            isDiscord: z.boolean()
                .default(false)
        }))
        .mutation(async ({ ctx, input }) => {
            // If both IPv4 and IPv6 addresses aren't present, don't proceed.
            if (!input.ip && !input.ip6)
                throw new TRPCError({ code: "PARSE_ERROR" });
            
            try {
                await ctx.prisma.server.create({
                    data: {
                        ip: input.ip,
                        port: input.port
                    }
                });
            } catch (err) {
                console.error(err);

                throw new TRPCError({ code: "BAD_REQUEST" });
            }
        })
})