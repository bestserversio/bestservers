import { ProcessPrismaError } from "@utils/error";
import { adminProcedure, createTRPCRouter } from "../trpc";

import * as z from "zod"
import { TRPCError } from "@trpc/server";

export const apiRouter = createTRPCRouter({
    all: adminProcedure
        .query(({ ctx, input }) => {
            return ctx.prisma.apiKey.findMany()
        }),
    add: adminProcedure
        .input(z.object({
            userId: z.string().optional(),
            host: z.string().optional(),
            endpoint: z.string().optional(),
            writeAccess: z.boolean().optional(),
            key: z.string(),
            limit: z.number().optional()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.apiKey.create({
                    data: {
                        userId: input.userId,
                        host: input.host,
                        endpoint: input.endpoint,
                        writeAccess: input.writeAccess,
                        key: input.key,
                        limit: input.limit
                    }
                })
            } catch (err) {
                console.error(err)

                const [errMsg, errCode] = ProcessPrismaError(err)

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Error creating API key. ${errMsg ? ` Error => ${errMsg} ${errCode ? ` (${errCode})` : ``}` : ``}`
                })
            }
        }),
    update: adminProcedure
        .input(z.object({
            id: z.number(),
            userId: z.string().nullable().optional(),
            host: z.string().nullable().optional(),
            endpoint: z.string().nullable().optional(),
            writeAccess: z.boolean().optional(),
            limit: z.number().optional()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.apiKey.update({
                    data: {
                        userId: input.userId,
                        host: input.host,
                        endpoint: input.endpoint,
                        writeAccess: input.writeAccess,
                        limit: input.limit
                    },
                    where: {
                        id: input.id
                    }
                })
            } catch (err) {
                console.error(err)

                const [errMsg, errCode] = ProcessPrismaError(err)

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Error updating API key with ID #${input.id.toString()}.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`
                })
            }
        })
})