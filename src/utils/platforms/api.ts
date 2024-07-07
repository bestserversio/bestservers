import { type Platform, type PlatformFlag } from "@prisma/client"
import { prisma } from "@server/db"

export type PlatformBodyT = {
    flags?: string[]

    banner?: string
    icon?: string

    url?: string
    name?: string
    nameShort?: string
    description?: string

    jsInternal?: string
    jsExternal?: string
}

export type PlatformDataT = {
    flags?: PlatformFlag[]

    banner?: string
    icon?: string

    url?: string
    name?: string
    nameShort?: string
    description?: string

    jsInternal?: string
    jsExternal?: string
}

export type PlatformWhereT = {
    id?: number | string
    url?: string
}

export async function FindPlatform (where: PlatformWhereT): Promise<Platform | null> {
    const{ id, url } = where;

    if (!id && !url)
        return null;

    return await prisma.platform.findFirst({
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
                }
            ]
        }
    });
}

export async function UpdatePlatform (id: number, data: PlatformDataT): Promise<Platform | null> {
    return await prisma.platform.update({
        data: data,
        where: {
            id: id
        }
    })
}

export async function DeletePlatform (where: PlatformWhereT): Promise<Platform | null> {
    const platform = await FindPlatform(where);

    const platformId = platform?.id;

    if (!platformId)
        return null;

    return await prisma.platform.delete({
        where: {
            id: platformId
        }
    })
}