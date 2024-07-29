import { Prisma, PrismaClient, Region, Server } from "@prisma/client";
import { ServerBrowser, ServerPublic } from "~/types/Server";

export enum ServerSort {
    CURUSERS = 0,
    LASTQUERIED = 1,
    NAME = 2,
    MAPNAME = 3
}

export async function GetServers({
    prisma,
    isStatic = false,
    cursor,
    limit = 10,
    sort = ServerSort.CURUSERS,
    sortDir = "DESC",
    visible,
    search,
    mapName,
    showOffline,
    hideEmpty,
    hideFull,
    minUsers,
    maxUsers,
    platforms = [],
    categories = [],
    regions = []
} : {
    prisma: PrismaClient
    isStatic?: boolean
    cursor?: number
    limit?: number
    sort?: ServerSort
    sortDir?: "ASC" | "DESC"
    visible?: boolean
    search?: string
    mapName?: string
    showOffline?: boolean
    hideFull?: boolean
    hideEmpty?: boolean
    minUsers?: number
    maxUsers?: number
    platforms?: number[]
    categories?: number[]
    regions?: Region[]
}): Promise<[ServerBrowser[], number | undefined]> {
    let cursorItem: ServerBrowser | null = null;
    let cursorLastQueried: Date | null = null;

    if (!isStatic && cursor) {
        const cursorItems = await prisma.$queryRaw<ServerBrowser[]>`
            SELECT
                "Server"."id",
                "Server"."name",
                "Server"."curUsers",
                "Server"."lastQueried",
                "Server"."mapName"
            FROM
                "Server"
            WHERE
                "Server"."id" = ${cursor}
        `

        cursorItem = cursorItems?.[0] ?? null;

        if (cursorItem) {
            cursorLastQueried = new Date(
                cursorItem.lastQueried.getUTCFullYear(),
                cursorItem.lastQueried.getUTCMonth(),
                cursorItem.lastQueried.getUTCDate(),
                cursorItem.lastQueried.getUTCHours(),
                cursorItem.lastQueried.getUTCMinutes(),
                cursorItem.lastQueried.getUTCSeconds(),
                cursorItem.lastQueried.getUTCMilliseconds()
            )
        }
    }

    let count = limit;

    if (!isStatic)
            count++;

    const sortOp = sortDir == "DESC" ? "<" : ">";

    // Compile where clauses.
    const where = [
        ...(search ? [
            Prisma.sql`
                (
                    "Server"."name" ILIKE  ${"%" + search + "%"} OR
                    "Server"."ip" ILIKE ${"%" + search + "%"} OR 
                    "Server"."ip6" ILIKE ${"%" + search + "%"}
                )
            `
        ] : []),
        ...(mapName ? [
            Prisma.sql`"Server"."mapName" ILIKE ${"%" + mapName + "%"}`
        ] : []),
        ...(hideFull ? [
            Prisma.sql`"Server"."curUsers" < "Server"."maxUsers"`
        ] : []),
        ...(visible !== undefined ? [
            Prisma.sql`"Server"."visible" = ${visible}`
        ] : []),
        ...(!showOffline ? [
            Prisma.sql`"Server"."online" = true`
        ] : []),
        ...(hideEmpty ? [
            Prisma.sql`"Server"."curUsers" > 0`
        ] : []),
        ...(minUsers !== undefined ? [
            Prisma.sql`"Server"."curUsers" >= ${minUsers}`
        ] : []),
        ...(maxUsers !== undefined ? [
            Prisma.sql`"Server"."curUsers" <= ${maxUsers}`
        ] : []),
        ...(platforms.length > 0 ? [
            Prisma.sql`"Server"."platformId" IN (${Prisma.join(platforms)})`
        ] : []),
        ...(categories.length > 0 ? [
            Prisma.sql`"Server"."categoryId" IN (${Prisma.join(categories)})`
        ] : []),
        ...(regions.length > 0 ? [
            Prisma.sql`"Server"."region" IN (${Prisma.join(regions.map(region => Prisma.sql`${region}::"Region"`))})`
        ] : []),
        ...(cursorItem ? [
            Prisma.sql`
                (
                    (
                        ${sort == ServerSort.CURUSERS ? Prisma.sql`
                            "Server"."curUsers" = ${cursorItem.curUsers}
                        ` : Prisma.empty}
                        ${sort == ServerSort.NAME ? Prisma.sql`
                            "Server"."name" = ${cursorItem.name}
                        ` : Prisma.empty}
                        ${sort == ServerSort.MAPNAME ? Prisma.sql`
                            "Server"."mapName" = ${cursorItem.mapName}
                        ` : Prisma.empty}
                        ${sort == ServerSort.LASTQUERIED ? Prisma.sql`
                            "Server"."lastQueried" = ${cursorLastQueried}
                        ` : Prisma.empty}
                        AND
                            "Server"."id" <= ${cursorItem.id}
                    )
                    OR
                    (
                        ${sort == ServerSort.CURUSERS ? Prisma.sql`
                            "Server"."curUsers" ${Prisma.raw(sortOp)} ${cursorItem.curUsers}
                        ` : Prisma.empty}
                        ${sort == ServerSort.NAME ? Prisma.sql`
                            "Server"."name" ${Prisma.raw(sortOp)} ${cursorItem.name}
                        ` : Prisma.empty}
                        ${sort == ServerSort.MAPNAME ? Prisma.sql`
                            "Server"."mapName" ${Prisma.raw(sortOp)} ${cursorItem.mapName}
                        ` : Prisma.empty}
                        ${sort == ServerSort.LASTQUERIED ? Prisma.sql`
                            "Server"."lastQueried" ${Prisma.raw(sortOp)} ${cursorLastQueried}
                        ` : Prisma.empty}
                    )
                )
            `
        ] : [])
    ]

    // Compile order.
    const order = [
        ...(sort == ServerSort.CURUSERS ? [
            Prisma.sql`"Server"."curUsers" ${Prisma.raw(sortDir)}`
        ] : []),
        ...(sort == ServerSort.NAME ? [
            Prisma.sql`"Server"."name" ${Prisma.raw(sortDir)}`
        ] : []),
        ...(sort == ServerSort.MAPNAME ? [
            Prisma.sql`"Server"."mapName" ${Prisma.raw(sortDir)}`
        ] : []),
        ...(sort == ServerSort.LASTQUERIED ? [
            Prisma.sql`"Server"."lastQueried" ${Prisma.raw(sortDir)}`
        ] : []),
        Prisma.sql`"Server"."id" DESC`
    ]

    const servers = await prisma.$queryRaw<ServerBrowser[]>`
        SELECT
            "Server"."id",
            "Server"."visible",
            "Server"."url",
            "Server"."ip",
            "Server"."ip6",
            "Server"."port",
            "Server"."hostName",
            "Server"."region",
            "Server"."name",
            "Server"."online",
            "Server"."curUsers",
            "Server"."maxUsers",
            "Server"."bots",
            "Server"."mapName",
            "Server"."secure",
            "Server"."os",
            "Server"."password",
            "Server"."avgUsers",
            "Server"."locationLat",
            "Server"."locationLon",
            "Server"."lastQueried",
            (
                SELECT jsonb_build_object(
                    'name', "subQuery"."name",
                    'nameShort', "subQuery"."nameShort",
                    'icon', "subQuery"."icon",
                    'flags', "subQuery"."flags"
                ) AS "Platform"
                FROM (
                    SELECT DISTINCT ON ("Platform"."id")
                        "Platform"."name",
                        "Platform"."nameShort",
                        "Platform"."icon",
                        "Platform"."flags"
                    FROM
                        "Platform"
                    WHERE
                        "Platform"."id" = "Server"."platformId"
                    LIMIT 1
                ) AS "subQuery"
            ) AS "platform"
        FROM "Server"
        ${where.length > 0 ?
                Prisma.sql`WHERE ${Prisma.join(where, " AND ")}`
            : 
                Prisma.empty
        }
        GROUP BY
            "Server"."id"
        ORDER BY
            ${Prisma.join(order, ",")}
        LIMIT ${count}
    `

    // Retrieve next server if any.
    let nextServer: number | undefined = undefined;

    if (!isStatic && servers.length > limit) {
        const next = servers.pop();
        nextServer = next?.id;
    }

    return [servers, nextServer]
}

export function GetServerMetaTitle({
    server
} : {
    server?: Server | ServerPublic | ServerBrowser
}) {
    if (!server)
        return "Not Found - Best Servers";
    
    let platformName: string 
    | undefined = undefined;

    if ("platform" in server)
        platformName = server.platform?.name;

    let ipInfo: string | undefined = undefined;
    let ip: string | undefined = undefined;

    if (server.ip)
        ip = server.ip;
    else if (server.ip6)
        ip = server.ip6;

    if (ip && server.port)
        ipInfo = `${ip}:${server.port.toString()}`

    let name = "";

    if (server.name) {
        name = server.name;

        if (ipInfo)
            name += ` (${ipInfo})`
    }
    else if (ipInfo)
        name = ipInfo

    name += " - ";

    return `${name} ${platformName ? ` - ${platformName}` : ``} - Best Servers`
}