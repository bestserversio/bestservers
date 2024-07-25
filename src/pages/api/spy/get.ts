import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { type NextApiRequest, type NextApiResponse } from "next";

type ApiT = {
    host?: string
    authorization?: string
    timeout?: number
}

type WebApiT = {
    enabled?: boolean
    host?: string
    endpoint?: string
    authorization?: string
    timeout?: number
    interval?: number
}

type VmsT = {
    enabled?: boolean
    timeout?: number
    api_token?: string
    app_ids?: number[]
    recv_only?: boolean
    min_wait?: number
    max_wait?: number
    limit?: number
    exclude_empty?: boolean
    sub_bots?: boolean
    random_apps?: boolean
}

type ScannerT = {
    protocol?: string
    platform_ids?: number[]
    min_wait?: number
    max_wait?: number
    limit?: number
    recv_only?: boolean
    sub_bots?: boolean
    query_timeout?: number
    a2s_player?: boolean
    random_platforms?: boolean
}

type PlatformMapT = {
    app_id: number
    platform_id: number
}

type RemoveInactiveT = {
    enabled: boolean
    interval: number
    inactive_time: number
    timeout: number
}

type SpyResp = {
    verbose: number

    api: ApiT
    web_api: WebApiT
    vms: VmsT
    scanners: ScannerT[]
    platform_maps: PlatformMapT[]
    remove_inactive: RemoveInactiveT
    bad_words: string[]
    bad_ips: string[]
    bad_asns: number[]
}

export default async function Handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }

    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "/api/spy/get",
        writeAccess: false
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve query parameters.
    const { query } = req;

    // Get host.
    let host = query?.host?.toString();

    // If host param not found, use connecting IP.
    if (!host)
        host = req.headers?.["cf-connecting-ip"]?.toString() ?? req.socket.remoteAddress;
    
    try {
        const spy = await prisma.spy.findFirst({
            where: {
                host: host
            },
            include: {
                vmsPlatforms: true,
                scanners: {
                    include: {
                        platforms: true
                    }
                },
                key: true
            }
        })

        if (!spy) {
            return res.status(404).json({
                message: `Spy instance not founded for host '${host}'.`
            })
        }

        // Get bad stuff.
        const badWordsQ = await prisma.badWord.findMany();
        const badIpsQ = await prisma.badIp.findMany();
        const badAsnsQ = await prisma.badAsn.findMany();

        // Start compiling bad stuff arrays.
        const badWords = badWordsQ.map(q => q.word)
        const badIps = badIpsQ.map(q => `${q.ip}/${q.cidr.toString()}`)
        const badAsns = badAsnsQ.map(q => q.asn)

        // Start building API.
        const api: ApiT = {
            host: spy.apiHost,
            authorization: spy.key?.key,
            timeout: spy.apiTimeout
        }

        // Start building web API.
        const webApi: WebApiT = {
            enabled: spy.webApiEnabled,
            host: spy.webApiHost,
            endpoint: spy.webApiEndpoint,
            authorization: spy.key?.key,
            timeout: spy.webApiTimeout,
            interval: spy.webApiInterval
        }

        // Start building VMS.
        const vmsPlatforms = spy.vmsPlatforms.map(p => p.vmsId ?? 0)
            .filter(vmsId => vmsId > 0)

        const vms: VmsT = {
            enabled: spy.vmsEnabled,
            timeout: spy.vmsTimeout,
            api_token: spy.vmsKey ?? undefined,
            app_ids: vmsPlatforms,
            recv_only: spy.vmsRecvOnly,
            min_wait: spy.vmsMinWait,
            max_wait: spy.vmsMaxWait,
            limit: spy.vmsLimit,
            exclude_empty: spy.vmsExcludeEmpty,
            sub_bots: spy.vmsSubBots,
            random_apps: spy.vmsRandomApps
        }

        // Build remove inactive.
        const remove_inactive: RemoveInactiveT = {
            enabled: spy.removeInactive,
            interval: spy.removeInactiveInterval,
            inactive_time: spy.removeInactiveTime,
            timeout: spy.removeInactiveTimeout
        }

        // Setup scanners.
        const scanners: ScannerT[] = [];

        spy.scanners.forEach((s) => {
            // Get platform IDs.
            const platform_ids = s.platforms.map(p => p.id)

            scanners.push({
                protocol: s.protocol,
                platform_ids: platform_ids,
                min_wait: s.minWait,
                max_wait: s.maxWait,
                limit: s.limit,
                recv_only: s.recvOnly,
                sub_bots: s.subBots,
                query_timeout: s.queryTimeout,
                a2s_player: s.a2sPlayer,
                random_platforms: s.randomPlatforms
            })
        })

        // Setup platform mappings.
        const platforms = await prisma.platform.findMany({
            where: {
                vmsId: {
                    gt: 0
                }
            }
        })

        const platform_maps: PlatformMapT[] = [];

        platforms.forEach((p) => {
            if (!p.vmsId)
                    return;

            platform_maps.push({
                platform_id: p.id,
                app_id: p.vmsId
            })
        })

        // Setup finaly response.
        const spyResp: SpyResp = {
            verbose: spy.verbose,
            api: api,
            web_api: webApi,
            vms: vms,
            scanners: scanners,
            platform_maps: platform_maps,
            remove_inactive: remove_inactive,
            bad_words: badWords,
            bad_ips: badIps,
            bad_asns: badAsns
        }

        return res.status(200).json(spyResp);
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Error retrieving spy instance.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`
        });
    }
}