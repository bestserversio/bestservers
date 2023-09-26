import { Region, Server } from "@prisma/client"
import { prisma } from "@server/db"

export type ServerBodyT = {
    visible?: boolean

    url?: string

    userId?: string

    ip?: string
    ip6?: string
    port?: number
    hostName?: string

    platformId?: number
    categoryId?: number

    name?: string
    descriptionShort?: string
    description?: string
    features?: string
    rules?: string

    online?: boolean
    curUsers?: number
    maxUsers?: number
    bots?: number
    mapName?: string
    avgUsers?: number

    region?: string
    locationLat?: number
    locationLon?: number

    lastQueried?: string
}

export type ServerDataT = {
    visible?: boolean

    url?: string

    userId?: string

    ip?: string
    ip6?: string
    port?: number
    hostName?: string

    platformId?: number
    categoryId?: number

    name?: string
    descriptionShort?: string
    description?: string
    features?: string
    rules?: string

    online?: boolean
    curUsers?: number
    maxUsers?: number
    bots?: number
    mapName?: string
    avgUsers?: number

    region?: Region
    locationLat?: number
    locationLon?: number

    lastQueried?: Date   
}

export type ServerWhereT = {
    id?: number | string
    url?: string
    ip?: string
    ip6?: string
    port?: string | number
}

export async function FindServer(where: ServerWhereT): Promise<Server | null> {
    const { id, url, ip, ip6, port } = where;

    if (!id && !url && ((!ip && !ip6) || port))
        return null; 

    const server = await prisma.server.findFirst({
        where: {
            OR: [
                {
                    ...(id && {
                        id: Number(id)
                    })
                },
                {
                    ...(url && {
                        url: url
                    })
                },
                {
                    AND: [
                        {
                            ...(ip && port && {
                                ip: ip,
                                port: Number(port)
                            })
                        }
                    ]
                },
                {
                    AND: [
                        {
                            ...(ip6 && port && {
                                ip6: ip6,
                                port: Number(port)
                            })
                        }
                    ]
                }
            ]
        }
    });

    return server;
}

export async function UpdateServer (id: number, data: ServerDataT): Promise<Server | null> {
    return await prisma.server.update({
        data: data,
        where: {
            id: id
        }
    })
}

export async function AddServer(data: ServerDataT): Promise<Server | null> {
    return await prisma.server.create({
        data: data
    })
}

export async function DeleteServer(where: ServerWhereT): Promise<Server | null> {
    const server = await FindServer(where);

    const serverId = server?.id;

    if (!serverId)
        return null;

    return prisma.server.delete({
        where: {
            id: serverId
        }
    })
}