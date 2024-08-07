import { type Prisma } from "@prisma/client";
import { UserPublicSelect } from "./User";

export const ServerPublicSelect = {
    visible: true,
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
    category: {
        include: {
            parent: true
        }
    },

    name: true,
    descriptionShort: true,
    description: true,
    features: true,
    rules: true,
    
    online: true,
    curUsers: true,
    maxUsers: true,
    bots: true,
    mapName: true,
    secure: true,
    os: true,
    password: true,

    avgUsers: true,

    locationLat: true,
    locationLon: true,

    lastQueried: true
}

export type ServerPublic = Prisma.ServerGetPayload<{
    select: typeof ServerPublicSelect
}> & {
    rating?: number
}

export type ServerBrowserSelect = {
    id: true,
    visible: true,

    url: true,

    ip: true,
    ip6: true,
    port: true,
    hostName: true,

    region: true,

    platform: true,

    name: true,

    online: true,
    curUsers: true,
    maxUsers: true,
    bots: true,
    mapName: true,
    secure: true,
    os: true,
    password: true,

    avgUsers: true,

    locationLat: true,
    locationLon: true,

    lastQueried: true
}

export type ServerBrowser = Prisma.ServerGetPayload<{
    select: ServerBrowserSelect
}> & {
    rating?: number
}

export type ServerWithRelations = Prisma.ServerGetPayload<{
    include: {
        user: {
            select: typeof UserPublicSelect
        },

        platform: true,
        category: {
            include: {
                parent: true
            }
        }
    }
}>