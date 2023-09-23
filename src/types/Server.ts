import { type Prisma } from "@prisma/client";
import { UserPublic, UserPublicSelect } from "./User";

export const ServerPublicSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,

    url: true,

    user: {
        select: UserPublicSelect
    },

    ip: true,
    ip6: true,
    port: true,
    hostName: true,

    region: true,

    platform: true,
    category: true,

    name: true,
    descriptionShort: true,
    description: true,
    features: true,
    rules: true,
    
    online: true,
    curUsers: true,
    maxUsers: true,
    mapName: true,

    avgUsers: true,

    locationLat: true,
    locationLon: true
}

export type ServerPublic = Prisma.ServerGetPayload<{
    select: typeof ServerPublicSelect
}>

export type ServerWithRelations = Prisma.ServerGetPayload<{
    include: {
        user: {
            select: typeof UserPublicSelect
        },

        platform: true,
        category: true
    }
}>