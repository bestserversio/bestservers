import { type Prisma } from "@prisma/client";
import { UserPublicSelect } from "./User";

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

    rank: true,
    avgUsers: true,

    locationLat: true,
    locationLon: true
}

export type ServerPublic = Prisma.ServerGetPayload<{
    select: typeof ServerPublicSelect
}>